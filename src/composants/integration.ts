/*
 * Intégration tierce (facultatif, mais sans lui rien n’est chargé quand data-src est donné) : charge le script
 * du fournisseur, garde le contenu masqué jusqu’à l’arrivée de ses styles et annonce un échec.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-integration.min.js"></script>
 *
 * Repères : [data-integration] sur la racine, data-src (script à charger), data-message-erreur, la cible
 * .bib-integration__cible et la région .bib-integration__erreur (voir la feuille). Pose sur la racine
 * [data-attente] (contenu masqué) puis [data-etat="erreur"] si le script échoue.
 *
 * Le script tiers est réinséré à chaque visite de la page (navigation côté client d’Astro comprise) : le
 * conteneur est alors neuf et vide, et un script retiré puis remis se réexécute. Le contenu arrivé reste
 * masqué (visibility, place gardée) jusqu’au chargement des feuilles de style en attente, DELAI_FEUILLE au
 * plus par feuille et DELAI_MAX en tout : le widget LibAnswers, rendu une fraction de seconde sans ses styles,
 * se décalait de 8 px à leur arrivée.
 */
const DELAI_FEUILLE = 3000
const DELAI_MAX = 8000
const ERREUR = 'Le contenu n’a pas pu être chargé. Rechargez la page ou réessayez plus tard.'
let controleur: AbortController | undefined

// Résolue au chargement (ou à l’échec) d’une feuille de style, ou après DELAI_FEUILLE
const feuillePrete = (lien: HTMLLinkElement) =>
  new Promise<void>((fin) => {
    lien.addEventListener('load', () => fin(), { once: true })
    lien.addEventListener('error', () => fin(), { once: true })
    setTimeout(fin, DELAI_FEUILLE)
  })

function echouer(racine: HTMLElement) {
  delete racine.dataset.attente
  racine.dataset.etat = 'erreur'
  const region = racine.querySelector<HTMLElement>('.bib-integration__erreur')
  if (region) region.textContent = racine.dataset.messageErreur || ERREUR
}

function charger(racine: HTMLElement, src: string) {
  // Un identifiant par adresse : l’ancien script est retiré, le nouveau se réexécute
  const id = `bib-integration-${[...src].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36)}`
  document.getElementById(id)?.remove()
  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = true
  script.addEventListener('error', () => echouer(racine), { once: true })
  document.body.append(script)
}

function surveiller(racine: HTMLElement, signal: AbortSignal) {
  const cible = racine.querySelector<HTMLElement>('.bib-integration__cible')
  if (!cible) return
  racine.dataset.attente = ''
  const reveler = () => delete racine.dataset.attente
  const filet = setTimeout(reveler, DELAI_MAX)
  signal.addEventListener('abort', () => clearTimeout(filet), { once: true })

  const verifier = () => {
    if (!cible.childElementCount) return false
    const enAttente = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].filter((lien) => !lien.sheet)
    Promise.all(enAttente.map(feuillePrete)).then(() =>
      requestAnimationFrame(() => {
        clearTimeout(filet)
        reveler()
      }),
    )
    return true
  }
  if (verifier()) return
  const observateur = new MutationObserver(() => verifier() && observateur.disconnect())
  observateur.observe(cible, { childList: true })
  signal.addEventListener('abort', () => observateur.disconnect(), { once: true })
}

function brancher() {
  const racines = [...document.querySelectorAll<HTMLElement>('[data-integration]')].filter((r) => r.dataset.pret !== 'oui')
  if (!racines.length) return
  controleur ??= new AbortController()
  for (const racine of racines) {
    racine.dataset.pret = 'oui'
    surveiller(racine, controleur.signal)
    if (racine.dataset.src) charger(racine, racine.dataset.src)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:before-swap', () => {
  controleur?.abort()
  controleur = undefined
})
document.addEventListener('astro:page-load', brancher)
