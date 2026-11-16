/*
 * Bandeau des horaires (facultatif, mais sans lui ni la liste ni le statut ne s'affichent) : lit l'API des
 * horaires, dit si la bibliothèque choisie est ouverte et s'estompe sous l'en-tête collant au défilement.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-bandeau-horaires.min.js"></script>
 *
 * Repères : [data-bandeau-horaires] (data-defaut : code de la bibliothèque par défaut ; data-api : adresse de
 * l'API ; data-sous : sélecteur de l'en-tête collant, [data-entete] par défaut), [data-choix] (la liste),
 * [data-statut], [data-texte] et [data-pastille]. Une seule requête par jour (le module survit aux
 * navigations du ClientRouter d'Astro). Le choix est gardé dans localStorage (bib.bandeau-horaires.bibliotheque).
 */
import { analyserHoraires, ajouterJours, maintenantMontreal, statutDe, urlHoraires, type Horaires } from '../horaires/horaires.ts'

const MEMOIRE = 'bib.bandeau-horaires.bibliotheque'
const FONDU = 0.75
let cache: { date: string; horaires: Horaires } | undefined
let controleur: AbortController | undefined

function brancher() {
  const bandeau = document.querySelector<HTMLElement>('[data-bandeau-horaires]')
  if (!bandeau || bandeau.dataset.pret === 'oui') return
  bandeau.dataset.pret = 'oui'
  controleur?.abort()
  const { signal } = (controleur = new AbortController())
  const api = bandeau.dataset.api || undefined

  // Au défilement, le bandeau s'estompe au lieu de glisser sous l'en-tête collant : son opacité suit la part
  // passée sous l'en-tête, et il est effacé quand il en est aux trois quarts couvert. Lié au défilement, le
  // fondu suit le geste, dans un sens comme dans l'autre. Il reste affiché tant que le focus y est (WCAG
  // 2.4.7). Opacité seule : il garde sa place, la page ne bouge pas.
  const entete = document.querySelector<HTMLElement>(bandeau.dataset.sous || '[data-entete]')
  let enAttente = false
  const majVisibilite = () => {
    enAttente = false
    const sous = entete ? entete.getBoundingClientRect().bottom : 0
    const { top, height } = bandeau.getBoundingClientRect()
    const couvert = Math.min(1, Math.max(0, (sous - top) / (height * FONDU)))
    const opacite = bandeau.contains(document.activeElement) ? 1 : 1 - couvert
    bandeau.style.opacity = opacite < 1 ? String(opacite) : ''
    bandeau.toggleAttribute('data-masque', opacite === 0)
  }
  const planifier = () => {
    if (enAttente) return
    enAttente = true
    requestAnimationFrame(majVisibilite)
  }
  majVisibilite()
  window.addEventListener('scroll', planifier, { passive: true, signal })
  window.addEventListener('resize', planifier, { passive: true, signal })
  bandeau.addEventListener('focusout', planifier)

  const choix = bandeau.querySelector<HTMLSelectElement>('[data-choix]')
  const statutEl = bandeau.querySelector<HTMLElement>('[data-statut]')
  const texte = bandeau.querySelector<HTMLElement>('[data-texte]')
  const pastille = bandeau.querySelector<HTMLElement>('[data-pastille]')
  if (!choix || !statutEl || !texte || !pastille) return

  // Jour des horaires chargés : la page peut rester ouverte toute la nuit
  let jourCharge = cache?.date ?? ''
  let horaires: Horaires | null | undefined = cache?.horaires
  let echecA = 0

  try {
    const garde = window.localStorage.getItem(MEMOIRE)
    if (garde && [...choix.options].some((o) => o.value === garde)) choix.value = garde
  } catch {
    // Stockage indisponible (navigation privée) : la valeur par défaut suffit
  }
  if (bandeau.dataset.defaut && !choix.value) choix.value = bandeau.dataset.defaut

  // L'heure est relue à chaque affichage : un onglet ouvert à 21 h 50 ne dit plus « Ferme bientôt » le
  // lendemain matin.
  const afficher = () => {
    if (horaires === undefined) return
    const maintenant = maintenantMontreal()
    if (maintenant.date !== jourCharge) return charger(maintenant.date)
    // Échec : nouvel essai après cinq minutes
    if (horaires === null && Date.now() - echecA > 5 * 60 * 1000) return charger(maintenant.date)
    const dates = [maintenant.date, ajouterJours(maintenant.date, 1)]
    const statut = statutDe({ codeBib: choix.value }, horaires, maintenant, dates)
    // Même texte : on n'y touche pas, la région d'annonce resterait muette pour rien ou répéterait le statut
    // chaque minute
    if (texte.textContent !== statut.texte) texte.textContent = statut.texte
    pastille.dataset.etat = statut.etat
  }

  choix.addEventListener('change', () => {
    afficher()
    try {
      window.localStorage.setItem(MEMOIRE, choix.value)
    } catch {
      // idem
    }
  })

  const charger = (date: string) => {
    jourCharge = date
    fetch(urlHoraires(date, 2, api), { signal: AbortSignal.timeout?.(10_000) })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`API horaires : HTTP ${r.status}`))))
      .then((donnees) => {
        horaires = analyserHoraires(donnees)
        cache = { date, horaires }
      })
      .catch(() => {
        horaires = null
        echecA = Date.now()
      })
      .finally(() => {
        afficher()
        // Région d'annonce seulement après le premier remplissage
        statutEl.setAttribute('role', 'status')
      })
  }

  if (horaires) {
    afficher()
    statutEl.setAttribute('role', 'status')
  } else charger(maintenantMontreal().date)
  const minute = setInterval(afficher, 60 * 1000)
  signal.addEventListener('abort', () => clearInterval(minute), { once: true })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:before-swap', () => controleur?.abort())
document.addEventListener('astro:page-load', brancher)
