/*
 * Animation des chiffres clés (facultative) : quand un bloc [data-chiffres] entre à l'écran, ses
 * barres se dévoilent (CSS) et ses nombres montent de 0 à leur valeur, une seule fois.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-chiffres.min.js"></script>
 *
 * L'état par défaut est l'état final : sans ce script, avec le mouvement réduit, sur un
 * rechargement ou un retour (défilement restauré) et à l'impression, les valeurs finales et les
 * barres pleines sont affichées. Un bloc déjà à l'écran au chargement s'anime aussi : la montée des
 * nombres est le propos du bloc, et elle ne masque aucun texte. Compatible avec une navigation
 * sans rechargement (événement astro:page-load : chaque page atteinte est une nouvelle visite).
 *
 * Durée : deux fois --duree-longue ; courbe : --courbe-entree, appliquée aussi aux
 * nombres par une animation Web vide dont on lit la progression.
 */
const nombre = new Intl.NumberFormat('fr-CA')
/** Décalage maximal entre unités d'un bloc (en pas de --duree-decalage) */
const RANG_MAX = 5
const A_ANIMER = 'bib-chiffres--a-animer'
const ANIME = 'bib-chiffres--anime'

function jeton(nom: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(nom).trim()
}

function enMs(valeur: string) {
  const n = parseFloat(valeur)
  return valeur.endsWith('ms') ? n : n * 1000
}

/** Montre la valeur finale, ou 0 en attendant le défilement */
function afficher(compteur: HTMLElement, depart: boolean) {
  if (depart) {
    compteur.textContent = nombre.format(0)
    compteur.dataset.compte = ''
  } else {
    compteur.textContent = nombre.format(Number(compteur.dataset.compteur))
    delete compteur.dataset.compte
  }
}

/** Fait défiler un nombre de 0 à sa valeur, à la courbe donnée */
function compter(compteur: HTMLElement, duree: number, delai: number, courbe: string) {
  const fin = Number(compteur.dataset.compteur)
  const effet = new KeyframeEffect(null, null, { duration: duree, delay: delai, easing: courbe, fill: 'both' })
  const animation = new Animation(effet, document.timeline)
  animation.play()

  let arrete = false
  const terminer = () => { arrete = true; afficher(compteur, false) }
  const image = () => {
    if (arrete || !compteur.isConnected) return
    if (animation.playState === 'finished') return terminer()
    const progression = effet.getComputedTiming().progress ?? 0
    compteur.textContent = nombre.format(Math.round(fin * progression))
    requestAnimationFrame(image)
  }
  requestAnimationFrame(image)
  return () => {
    animation.cancel()
    terminer()
  }
}

/** Changement de page côté client : vrai après le premier */
let pageSuivante = false

function animerChiffres() {
  const suivante = pageSuivante
  pageSuivante = true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('print').matches) return
  if (!('IntersectionObserver' in window) || typeof KeyframeEffect === 'undefined') return
  // Rechargement ou retour : pas d'animation au premier chargement ; une page atteinte par un lien
  // (navigation côté client) est une nouvelle visite
  const navigation = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined
  if (!suivante && navigation && navigation.type !== 'navigate') return

  const blocs = [...document.querySelectorAll<HTMLElement>(`[data-chiffres]:not(.${A_ANIMER})`)]
  if (!blocs.length) return

  const duree = 2 * enMs(jeton('--duree-longue'))
  const pas = enMs(jeton('--duree-decalage'))
  const courbe = jeton('--courbe-entree')
  const arrets = new Set<() => void>()

  for (const bloc of blocs) {
    bloc.classList.add(A_ANIMER)
    bloc.style.setProperty('--duree-chiffres', `${duree}ms`)
    bloc.querySelectorAll<HTMLElement>('[data-chiffres-unite]').forEach((unite, i) => unite.style.setProperty('--rang', String(Math.min(i, RANG_MAX))))
    bloc.querySelectorAll<HTMLElement>('[data-compteur]').forEach((compteur) => afficher(compteur, true))
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const { target, isIntersecting } of entrees) {
        if (!isIntersecting) continue
        observateur.unobserve(target)
        const bloc = target as HTMLElement
        bloc.classList.add(ANIME)
        bloc.querySelectorAll<HTMLElement>('[data-chiffres-unite]').forEach((unite, i) => {
          for (const compteur of unite.querySelectorAll<HTMLElement>('[data-compteur]')) {
            arrets.add(compter(compteur, duree, Math.min(i, RANG_MAX) * pas, courbe))
          }
        })
      }
    },
    // Le bloc est bien à l'écran : un tiers visible, ou 8 % au-dessus du bas
    { rootMargin: '0px 0px -8% 0px', threshold: 0.3 },
  )
  blocs.forEach((bloc) => observateur.observe(bloc))

  const arreter = () => {
    observateur.disconnect()
    arrets.forEach((arret) => arret())
  }
  const finDeVie = new AbortController()
  const finaliser = () => {
    arreter()
    finDeVie.abort()
    for (const bloc of blocs) {
      bloc.classList.remove(A_ANIMER, ANIME)
      bloc.querySelectorAll<HTMLElement>('[data-compteur]').forEach((compteur) => afficher(compteur, false))
    }
  }
  const options = { once: true, signal: finDeVie.signal }
  window.addEventListener('beforeprint', finaliser, options)
  document.addEventListener('astro:before-swap', finaliser, options)
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => e.matches && finaliser(), { signal: finDeVie.signal })

}

document.addEventListener('astro:page-load', animerChiffres)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animerChiffres)
else animerChiffres()
