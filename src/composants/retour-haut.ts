/*
 * Retour en haut (facultatif mais nécessaire à son affichage) : pose [data-visible] sur le bouton
 * [data-retour-haut] quand on a défilé de plus d'un écran et demi, et le ramène en haut au clic.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-retour-haut.min.js"></script>
 *
 * - Sous 900 px, il flotte sur le contenu : il se retire aussi après 2,5 s sans défilement (arrêté sur
 *   un passage, on lit), sauf s'il a le focus, le survol ou le toucher ; dès 900 px, il est dans la
 *   marge et reste affiché. Le focus (ou le doigt, le pointeur) le garde affiché : il ne disparaît pas
 *   sous le clavier ni au moment de le toucher.
 * - Au clic : défilement jusqu'en haut (instantané avec le mouvement réduit, selon scroll-behavior),
 *   puis le focus revient au début du document sans le montrer : le Tab suivant atteint le lien
 *   d'évitement, comme à l'arrivée sur la page. Laisser le focus sur le bouton, devenu masqué, le
 *   ferait disparaître sous le clavier (WCAG 2.4.3).
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */
const REPOS = 2500
const large = window.matchMedia('(width >= 900px)')
let minuterie: ReturnType<typeof setTimeout> | undefined
let auRepos = false
let enAttente = false

function bouton() {
  return document.querySelector<HTMLButtonElement>('[data-retour-haut]')
}

function mettreAJour() {
  enAttente = false
  const b = bouton()
  if (!b) return
  const loin = window.scrollY > window.innerHeight * 1.5
  const garde = b.matches(':focus-visible, :hover, :active')
  b.toggleAttribute('data-visible', loin && (large.matches || garde || !auRepos))
}

function brancher() {
  const b = bouton()
  if (!b || b.dataset.retourHautPret !== undefined) return
  b.dataset.retourHautPret = ''
  // Quitter le bouton sans l'avoir utilisé : la minuterie a pu passer
  b.addEventListener('blur', mettreAJour)
  b.addEventListener('click', () => {
    window.scrollTo({ top: 0 })
    // Point de départ de la navigation au clavier : le haut du document
    const corps = document.body
    corps.setAttribute('tabindex', '-1')
    corps.style.outline = 'none'
    corps.focus({ preventScroll: true })
    corps.addEventListener(
      'blur',
      () => {
        corps.removeAttribute('tabindex')
        corps.style.removeProperty('outline')
      },
      { once: true },
    )
  })
  mettreAJour()
}

const cle = '__bibRetourHaut'
if (!(window as unknown as Record<string, unknown>)[cle]) {
  ;(window as unknown as Record<string, unknown>)[cle] = true
  large.addEventListener('change', mettreAJour)
  window.addEventListener('resize', mettreAJour, { passive: true })
  window.addEventListener(
    'scroll',
    () => {
      auRepos = false
      clearTimeout(minuterie)
      minuterie = setTimeout(() => {
        auRepos = true
        mettreAJour()
      }, REPOS)
      if (enAttente) return
      enAttente = true
      requestAnimationFrame(mettreAJour)
    },
    { passive: true },
  )
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
