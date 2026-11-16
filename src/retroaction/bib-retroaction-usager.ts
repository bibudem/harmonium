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
 * --rayon-plein…) s'ils existent, sinon jetons Material (--md-sys-*) ; voir styles.ts.
 * Propriétés CSS propres (elles l'emportent) : --bib-comp-retroaction-usager-size (taille du texte),
 * --bib-comp-retroaction-usager-title-weight (graisse de la question),
 * --bib-retroaction-couleur (pouce choisi, bouton d'envoi ; à défaut
 * --md-sys-color-primary), --bib-retroaction-sur-couleur, --bib-retroaction-accent (icône du
 * remerciement), --bib-retroaction-texte (question et pouces ; à défaut --couleur-texte),
 * --md-sys-typescale-label-large-size (taille du texte du bouton).
 */
import { STYLES } from './styles.ts'
import { donneesVote } from './vote.ts'

const SERVICE = 'https://umontreal.libwizard.com/api/v1/submission'
const VERSION = '2.0.0'
const DELAI_MS = 15_000
const MAX = 500

// Icônes « thumb_up » et « thumb_down » de Material Symbols
const POUCE_HAUT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M840-640q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14H280v-520l240-238q15-15 35.5-17.5T595-888q19 10 28 28t4 37l-45 183h258Zm-480 34v406h360l120-280v-80H480l54-220-174 174ZM160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640h120v80H160v360h120v80H160Zm200-80v-406 406Z"/></svg>'
const POUCE_BAS =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M120-320q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14h440v520L440-82q-15 15-35.5 17.5T365-72q-19-10-28-28t-4-37l45-183H120Zm480-34v-406H240L120-480v80h360l-54 220 174-174Zm200-486q33 0 56.5 23.5T880-760v360q0 33-23.5 56.5T800-320H680v-80h120v-360H680v-80h120Zm-200 80v406-406Z"/></svg>'
// Cercle plein coché et cercle plein « ! »
const ICONE_MERCI =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 7.7-5.5 5.5a1 1 0 0 1-1.4 0l-2.3-2.3a1 1 0 1 1 1.4-1.4l1.6 1.6 4.8-4.8a1 1 0 1 1 1.4 1.4Z"/></svg>'
const ICONE_ERREUR =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5.5a1 1 0 1 1 2 0V13a1 1 0 1 1-2 0V7.5ZM12 17.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z"/></svg>'

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
