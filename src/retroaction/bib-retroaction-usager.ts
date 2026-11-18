/*
 * <bib-retroaction-usager> : « Cette page vous a été utile? », réponses envoyées à LibWizard.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-retroaction-usager.min.js"></script>
 *   <bib-retroaction-usager></bib-retroaction-usager>
 *
 * Déroulement (formulaire LibWizard des Bibliothèques, 43176) :
 * - pouce en haut : la réponse part tout de suite, sans commentaire ;
 * - pouce en bas : un champ de commentaire facultatif (500 caractères) paraît et reçoit le
 *   focus, puis « Envoyer mon retour » ;
 * - après l'envoi, le remerciement remplace le formulaire et reçoit le focus (il est lu) ;
 * - en cas d'échec (erreur du serveur, réseau coupé, pas de réponse en 15 s), le message
 *   d'erreur est annoncé (role=alert) et le commentaire est gardé : on peut réessayer.
 *
 * Pendant l'envoi, les boutons restent focalisables (aria-disabled : un bouton désactivé
 * perd le focus) et « Envoi en cours… » est annoncé. L'adresse complète de la page est
 * envoyée (vote.ts). Textes en fr-CA même sur une page anglaise.
 *
 * Classes et ids stables (.survey-title, .radio-group, #btn-vote-y, .input-sm, .write-us,
 * .form-group-submit…) : une feuille de style ajoutée par un site peut les
 * viser.
 *
 * Couleurs, rayons et focus : jetons d'Harmonium (--couleur-fond-fort,
 * --rayon-plein…), sinon valeurs par défaut ; voir styles.ts. Propriétés CSS propres
 * (elles l'emportent) : --bib-retroaction-couleur, -couleur-survol, -sur-couleur, -accent,
 * -focus, -texte, -taille, -graisse-titre, -taille-boutons.
 */
import { STYLES } from './styles.ts'
import { donneesVote } from './vote.ts'

const SERVICE = 'https://umontreal.libwizard.com/api/v1/submission'
const VERSION = '2.0.0'
const DELAI_MS = 15_000
const MAX = 500

// Icônes de Phosphor (comme le reste d'Harmonium) : ThumbsUp, ThumbsDown, CheckCircle et WarningCircle pleins
const POUCE_HAUT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"/></svg>'
const POUCE_BAS =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"/></svg>'
const ICONE_MERCI =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"/></svg>'
const ICONE_ERREUR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"/></svg>'

type Vote = 'oui' | 'non'

const ENVOYER = 'Envoyer mon retour'
const EN_COURS = 'Envoi en cours…'
const MERCI = 'Merci, votre retour a été envoyé. Il nous aide à améliorer le site.'
const ERREUR = 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.'

const GABARIT = `
  <div lang="fr-CA">
    <form>
      <p id="survey-title" class="survey-title">Cette page vous a été utile?</p>
      <div role="group" aria-labelledby="survey-title" class="radio-group">
        <button type="button" id="btn-vote-y" class="btn-vote" value="oui" aria-pressed="false" aria-label="Oui">${POUCE_HAUT}</button>
        <button type="button" id="btn-vote-n" class="btn-vote" value="non" aria-pressed="false" aria-label="Non" aria-controls="survey-commentaire" aria-expanded="false">${POUCE_BAS}</button>
      </div>

      <div class="commentaire" id="survey-commentaire" hidden>
        <p class="intro">Merci. Dites-nous ce qui manquait ou ce qui a rendu cette page moins utile.</p>
        <p class="form-group">
          <label class="label width-full" for="survey-comment">Commentaire <span class="optionnel">(optionnel)</span></label>
          <textarea class="form-control input-sm width-full" name="comment" id="survey-comment" rows="5" maxlength="${MAX}"
            placeholder="Décrivez brièvement le problème. Évitez d’inscrire des renseignements personnels dans ce champ."
            aria-describedby="survey-comment-aide"></textarea>
        </p>
        <p id="survey-comment-aide" class="aide">N’inscrivez pas de renseignements personnels.</p>
        <p class="aide write-us f6 color-fg-muted">Nous ne pourrons pas vous répondre. Pour obtenir de l’aide, <a href="https://bib.umontreal.ca/nous-joindre">contactez-nous directement</a>.</p>
        <div class="form-group-submit d-flex flex-justify-end flex-items-center mt-3">
          <span class="compteur">0/${MAX}</span>
          <button type="submit" class="btn btn-submit">${ENVOYER}</button>
        </div>
      </div>

      <p class="erreur" role="alert"></p>
      <p class="masque annonce" role="status"></p>
    </form>

    <div class="resultat" tabindex="-1" hidden>${ICONE_MERCI}<p>${MERCI}</p></div>
  </div>
`

class BibRetroactionUsager extends HTMLElement {
  #racine = this.attachShadow({ mode: 'open' })
  #enCours = false

  connectedCallback() {
    if (this.#racine.childElementCount) return
    const style = document.createElement('style')
    style.textContent = STYLES
    const contenu = document.createElement('template')
    contenu.innerHTML = GABARIT
    this.#racine.replaceChildren(style, contenu.content)

    for (const bouton of this.#pouces()) {
      bouton.addEventListener('click', () => this.#voter(bouton.value as Vote))
    }
    const champ = this.#q<HTMLTextAreaElement>('textarea')
    champ.addEventListener('input', () => {
      this.#erreur(false)
      this.#q('.compteur').textContent = `${champ.value.length}/${MAX}`
    })
    this.#q<HTMLFormElement>('form').addEventListener('submit', (e) => {
      e.preventDefault()
      void this.#envoyer('non', champ.value.trim())
    })
  }

  #q<T extends Element = HTMLElement>(sel: string) {
    return this.#racine.querySelector<T>(sel)!
  }

  #pouces() {
    return [...this.#racine.querySelectorAll<HTMLButtonElement>('.btn-vote')]
  }

  #voter(vote: Vote) {
    if (this.#enCours) return
    for (const bouton of this.#pouces()) bouton.setAttribute('aria-pressed', String(bouton.value === vote))
    this.#q('#btn-vote-n').setAttribute('aria-expanded', String(vote === 'non'))
    const section = this.#q('.commentaire')
    this.#erreur(false)
    if (vote === 'oui') {
      // Pouce en haut : envoyé tout de suite, sans commentaire
      section.hidden = true
      void this.#envoyer('oui', '')
    } else {
      section.hidden = false
      this.#q<HTMLTextAreaElement>('textarea').focus()
    }
  }

  #erreur(visible: boolean) {
    const erreur = this.#q('.erreur')
    erreur.innerHTML = visible ? `${ICONE_ERREUR}<span>${ERREUR}</span>` : ''
  }

  #occupe(oui: boolean) {
    this.#enCours = oui
    // aria-disabled plutôt que disabled : un bouton désactivé perd le focus
    const envoi = this.#q<HTMLButtonElement>('.btn-submit')
    for (const bouton of [...this.#pouces(), envoi]) bouton.setAttribute('aria-disabled', String(oui))
    envoi.textContent = oui ? EN_COURS : ENVOYER
    this.#q('.annonce').textContent = oui ? EN_COURS : ''
  }

  async #envoyer(vote: Vote, commentaire: string) {
    if (this.#enCours) return
    this.#erreur(false)
    this.#occupe(true)
    try {
      const reponseGuid = await fetch(`${SERVICE}/getguid`, { signal: AbortSignal.timeout(DELAI_MS) })
      if (!reponseGuid.ok) throw new Error(`LibWizard getguid : HTTP ${reponseGuid.status}`)
      // L'API renvoie la chaîne nue, parfois { guid }
      const brut = await reponseGuid.json()
      const guid = typeof brut === 'string' ? brut : brut?.guid
      if (!guid) throw new Error('LibWizard getguid : pas de GUID')
      const envoi = await fetch(`${SERVICE}/insertSubmission`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(donneesVote(guid, vote, commentaire)),
        signal: AbortSignal.timeout(DELAI_MS),
      })
      if (!envoi.ok) throw new Error(`LibWizard insertSubmission : HTTP ${envoi.status}`)
      this.#q('form').hidden = true
      const merci = this.#q('.resultat')
      merci.hidden = false
      merci.focus()
    } catch (erreur) {
      console.error('[bib-retroaction-usager] Envoi échoué : %o', erreur)
      this.#occupe(false)
      this.#erreur(true)
    }
  }
}

if (!customElements.get('bib-retroaction-usager')) customElements.define('bib-retroaction-usager', BibRetroactionUsager)

// window.bib.retroactionUsager signale le composant chargé
const bib = ((globalThis as Record<string, unknown>).bib ??= {}) as Record<string, unknown>
bib.retroactionUsager ??= { version: VERSION }
