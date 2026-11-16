// Faux scripts tiers de la démo : ce que LibAnswers et LibChat injecteraient dans la cible
  window.exIntegration = {
    formulaire(id) {
      document.getElementById(id)?.insertAdjacentHTML('beforeend', `
        <form class="ex-int-faux s-la-askform" data-faux>
          <p class="nom">Imitation du widget LibAnswers</p>
          <div class="deux">
            <div class="champ"><label for="ex-int-q">Votre question</label><input id="ex-int-q" type="text" autocomplete="off"></div>
            <div class="champ"><label for="ex-int-c">Courriel</label><input id="ex-int-c" type="email" autocomplete="email"></div>
          </div>
          <div class="champ"><label for="ex-int-d">Détails</label><textarea id="ex-int-d" rows="8"></textarea></div>
          <fieldset><legend>Vous êtes</legend>
            <div class="radio"><label><input type="radio" name="ex-int-statut"> Étudiante ou étudiant</label></div>
            <div class="radio"><label><input type="radio" name="ex-int-statut"> Membre du personnel</label></div>
            <div class="radio"><label><input type="radio" name="ex-int-statut"> Autre</label></div>
          </fieldset>
          <div class="deux"><div class="champ"><label for="ex-int-n">Nom (facultatif)</label><input id="ex-int-n" type="text" autocomplete="name"></div><div class="champ"><label for="ex-int-f">Faculté ou département (facultatif)</label><input id="ex-int-f" type="text"></div></div>
          <button class="s-la-askform-button" type="submit">Envoyer</button>
        </form>`)
    },
    clavardage(id) {
      document.getElementById(id)?.insertAdjacentHTML('beforeend', `
        <div class="ex-int-clav lci_chat_load">
          <div class="tete">Imitation de LibChat</div>
          <div class="fil"><p class="bulle">Bonjour! Posez votre question, une personne de l’équipe vous répond.</p></div>
          <form data-faux><input type="text" aria-label="Votre message" placeholder="Votre message" autocomplete="off"><button type="submit">Envoyer</button></form>
        </div>`)
    },
  }
  // Rien n'est envoyé
  document.addEventListener('submit', (e) => e.target.closest?.('[data-faux]') && e.preventDefault())

  // Commandes : un conteneur neuf (comme à une nouvelle visite de la page), puis le script d'Harmonium le branche
  for (const commandes of document.querySelectorAll('[data-ex-int]')) {
    const contenu = commandes.parentElement
    const journal = commandes.querySelector('[data-ex-int-journal]')
    let racine = contenu.querySelector('[data-integration]')
    const srcReussite = racine.dataset.src
    const reserve = racine.getAttribute('style')
    const decrire = () => {
      if (racine.dataset.etat === 'erreur') journal.textContent = 'Échec du script : message annoncé dans la région role="status", réserve levée.'
      else if (!racine.querySelector('.bib-integration__cible').childElementCount) journal.textContent = 'Script demandé : place réservée, « Chargement… » affiché.'
      else if (racine.hasAttribute('data-attente')) journal.textContent = 'Contenu arrivé, styles en attente : masqué, place gardée.'
      else journal.textContent = 'Contenu affiché : rien n’a bougé.'
    }
    const observer = () => {
      const obs = new MutationObserver(decrire)
      obs.observe(racine, { attributes: true, subtree: true, childList: true })
      decrire()
    }
    const recharger = (src) => {
      const neuf = racine.cloneNode(true)
      for (const a of ['data-pret', 'data-etat', 'data-attente']) neuf.removeAttribute(a)
      neuf.querySelector('.bib-integration__cible').replaceChildren()
      neuf.querySelector('.bib-integration__erreur').textContent = ''
      neuf.dataset.src = src
      racine.replaceWith(neuf)
      racine = neuf
      observer()
      document.dispatchEvent(new Event('astro:page-load'))
    }
    commandes.querySelector('[data-ex-int-action="succes"]').addEventListener('click', () => recharger(srcReussite))
    commandes.querySelector('[data-ex-int-action="echec"]').addEventListener('click', () => recharger(new URL('integration-introuvable.js', location.href).href))
    commandes.querySelector('[data-ex-int-sans-reserve]')?.addEventListener('change', (e) => {
      if (e.currentTarget.checked) racine.removeAttribute('style')
      else racine.setAttribute('style', reserve)
      recharger(srcReussite)
    })
    observer()
  }
