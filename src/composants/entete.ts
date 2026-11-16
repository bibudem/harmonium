/*
 * En-tête et menu (bib-entete.min.js) : rideau, modes « complet » et « recherche », poignée, focus et Échap.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-entete.min.js"></script>
 *
 * Amélioration progressive : sans ce script, la navigation reste dans la barre et les commandes restent
 * masquées. Le script pose data-entete-pret sur l'en-tête et montre les commandes.
 *
 * - Les boutons Menu [data-entete-menu] et Rechercher [data-entete-recherche] commandent le même rideau
 *   [data-entete-rideau], selon le motif « disclosure navigation » de l'APG : aria-expanded et aria-label
 *   suivent l'état ; Échap ferme et rend le focus au bouton qui a ouvert.
 * - Deux modes, posés sur le rideau (data-mode) : « complet » (Menu) et « recherche » (loupe : la
 *   recherche seule, le focus dans le champ). « Afficher le menu » [data-entete-deplier] déplie le reste
 *   et donne le focus au premier lien apparu ; la loupe, menu entier ouvert, le replie. Le passage d'un
 *   mode à l'autre est animé, sauf si le mouvement réduit est demandé.
 * - La poignée [data-entete-poignee] ferme d'un tapotement, ou d'un glissé vers le haut : la feuille suit
 *   le doigt et se referme passé le quart de sa hauteur ou sur un geste vif.
 * - Le rideau se referme quand le focus quitte l'en-tête, au clic sur le voile ou hors de l'en-tête, et
 *   quand la barre change de forme (1200 px). Ouvert, le reste de la page est inerte.
 * - --hauteur-entete (marge de défilement des ancres et du focus, WCAG 2.4.11) suit la hauteur réelle.
 * - bib-entete--superpose : data-defile après 50 px de défilement, ou menu ouvert.
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */

type Mode = 'recherche' | 'complet'

const IGNORES = new Set(['HEAD', 'SCRIPT', 'STYLE', 'LINK', 'TEMPLATE'])
const SEUIL_GLISSE = 8 // px avant de considérer le geste comme un glissé
const VITESSE_FERMETURE = 0.5 // px/ms : un geste vif ferme même s'il est court

const reduit = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const jeton = (nom: string, defaut: string) => getComputedStyle(document.documentElement).getPropertyValue(nom).trim() || defaut

function brancher(entete: HTMLElement) {
  if (entete.dataset.enteteBranche !== undefined) return
  entete.dataset.enteteBranche = ''
  entete.setAttribute('data-entete-pret', '')

  const rideau = entete.querySelector<HTMLElement>('[data-entete-rideau]')
  const voile = entete.querySelector<HTMLElement>('[data-entete-voile]')
  const outils = entete.querySelector<HTMLElement>('[data-entete-outils]')
  const boutons = [...entete.querySelectorAll<HTMLButtonElement>('[data-entete-menu]')]
  const loupes = [...entete.querySelectorAll<HTMLButtonElement>('[data-entete-recherche]')]
  const feuille = rideau?.querySelector<HTMLElement>('.bib-entete__feuille')
  const poignee = rideau?.querySelector<HTMLButtonElement>('[data-entete-poignee]')
  if (outils) outils.hidden = false

  // Hauteur réelle de l'en-tête (texte agrandi : la barre peut passer sur deux rangées)
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--hauteur-entete', `${Math.ceil(entete.getBoundingClientRect().height)}px`)
  }).observe(entete)

  const superpose = entete.classList.contains('bib-entete--superpose')
  const majDefilement = () => {
    if (superpose) entete.toggleAttribute('data-defile', window.scrollY > 50 || entete.hasAttribute('data-ouvert'))
  }
  majDefilement()
  if (superpose) window.addEventListener('scroll', majDefilement, { passive: true })

  if (!rideau || !feuille) return

  let mode: Mode = (rideau.dataset.mode as Mode) || 'complet'
  // Bouton qui a ouvert le rideau : il reprend le focus à la fermeture
  let declencheur: HTMLButtonElement | null = null
  let inertes: HTMLElement[] = []
  let animation = false
  const champ = () => rideau.querySelector<HTMLInputElement>('input[type="search"], input:not([type="hidden"])')
  const ouvert = () => !rideau.hidden

  // Tout ce qui n'est ni l'en-tête ni l'un de ses ancêtres devient inerte
  function rendreInerte() {
    for (let el: HTMLElement | null = entete; el && el !== document.documentElement; el = el.parentElement) {
      for (const frere of el.parentElement?.children ?? []) {
        if (frere === el || !(frere instanceof HTMLElement) || frere.inert || IGNORES.has(frere.tagName)) continue
        frere.inert = true
        inertes.push(frere)
      }
    }
  }
  function liberer() {
    for (const el of inertes) el.inert = false
    inertes = []
  }

  function majBoutons() {
    const menuEntier = ouvert() && mode === 'complet'
    const recherche = ouvert() && mode === 'recherche'
    for (const b of boutons) {
      b.setAttribute('aria-expanded', String(menuEntier))
      b.setAttribute('aria-label', menuEntier ? 'Fermer le menu' : 'Menu')
    }
    for (const l of loupes) {
      l.setAttribute('aria-expanded', String(recherche))
      l.setAttribute('aria-label', recherche ? 'Fermer la recherche' : 'Rechercher')
    }
  }

  function changerMode(nouveau: Mode) {
    mode = nouveau
    rideau!.dataset.mode = nouveau
    poignee?.setAttribute('aria-label', nouveau === 'recherche' ? 'Fermer la recherche' : 'Fermer le menu')
    majBoutons()
  }

  function fermer({ rendreFocus = false } = {}) {
    if (!ouvert()) return
    rideau!.hidden = true
    if (voile) voile.hidden = true
    entete.removeAttribute('data-ouvert')
    liberer()
    majBoutons()
    majDefilement()
    if (rendreFocus) declencheur?.focus()
  }

  function ouvrir(origine: HTMLButtonElement, nouveau: Mode) {
    declencheur = origine
    // Le rideau remplit la fenêtre sous l'en-tête, où qu'il soit (bandeau au-dessus, page défilée)
    rideau!.style.setProperty('--haut-menu', `${Math.max(0, entete.getBoundingClientRect().bottom)}px`)
    rideau!.hidden = false
    if (voile) voile.hidden = false
    changerMode(nouveau)
    entete.setAttribute('data-ouvert', '')
    rendreInerte()
    majDefilement()
    if (nouveau === 'recherche') champ()?.focus({ preventScroll: true })
  }

  // Groupes masqués en mode recherche, visibles dans la mise en page courante
  const autresGroupes = () =>
    [...feuille.children].filter((e): e is HTMLElement => e instanceof HTMLElement && !e.matches('.bib-entete__groupe--recherche, .bib-entete__deplier, .bib-entete__pied') && e.offsetParent !== null)

  async function changerHauteur(avant: number) {
    feuille!.style.height = ''
    const apres = feuille!.getBoundingClientRect().height
    feuille!.style.overflowY = 'hidden'
    await feuille!.animate([{ height: `${avant}px` }, { height: `${apres}px` }], { duration: 300, easing: jeton('--courbe-emphase-deceleree', 'ease-out') }).finished.catch(() => {})
    feuille!.style.overflowY = ''
  }

  async function replier() {
    if (reduit() || animation) {
      changerMode('recherche')
      feuille!.scrollTo({ top: 0 })
      champ()?.focus({ preventScroll: true })
      return
    }
    animation = true
    const autres = autresGroupes()
    const avant = feuille!.getBoundingClientRect().height
    feuille!.style.height = `${avant}px`
    feuille!.scrollTo({ top: 0, behavior: 'smooth' })
    const sortie = jeton('--courbe-standard-acceleree', 'ease-in')
    await Promise.all(autres.map((e) => e.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 -1rem' }], { duration: 150, easing: sortie, fill: 'forwards' }).finished.catch(() => {})))
    changerMode('recherche')
    for (const e of autres) e.getAnimations().forEach((a) => a.cancel())
    champ()?.focus({ preventScroll: true })
    await changerHauteur(avant)
    animation = false
  }

  async function deplier() {
    if (reduit() || animation) return changerMode('complet')
    animation = true
    const avant = feuille!.getBoundingClientRect().height
    feuille!.style.height = `${avant}px`
    changerMode('complet')
    const entree = jeton('--courbe-emphase-deceleree', 'ease-out')
    autresGroupes().forEach((e, i) => e.animate([{ opacity: 0, translate: '0 -1rem' }, { opacity: 1, translate: '0 0' }], { duration: 300, delay: 60 + i * 50, easing: entree, fill: 'backwards' }))
    await changerHauteur(avant)
    animation = false
  }

  for (const bouton of boutons) {
    bouton.addEventListener('click', () => {
      if (!ouvert()) ouvrir(bouton, 'complet')
      else if (mode === 'complet') fermer()
      else {
        // Ouvert en mode recherche : le menu se déplie sans se refermer
        declencheur = bouton
        deplier()
      }
    })
  }
  for (const loupe of loupes) {
    loupe.addEventListener('click', () => {
      if (!ouvert()) ouvrir(loupe, 'recherche')
      else if (mode === 'recherche') fermer()
      else {
        declencheur = loupe
        replier()
      }
    })
  }

  // « Afficher le menu » disparaît : le focus passe au premier lien apparu
  rideau.querySelector<HTMLButtonElement>('[data-entete-deplier]')?.addEventListener('click', () => {
    declencheur = boutons.find((b) => b.offsetParent) ?? declencheur
    deplier()
    requestAnimationFrame(() => {
      const premier = autresGroupes()
        .flatMap((g) => [...g.querySelectorAll<HTMLElement>('a[href], button, summary, input')])
        .find((e) => e.offsetParent !== null)
      premier?.focus({ preventScroll: true })
    })
  })

  voile?.addEventListener('click', () => fermer())
  document.addEventListener('click', (e) => {
    if (ouvert() && !entete.contains(e.target as Node)) fermer()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !ouvert() || e.defaultPrevented) return
    // Une boîte de dialogue ouverte par-dessus gère sa propre Échap
    if (document.querySelector('dialog[open]')) return
    fermer({ rendreFocus: true })
  })
  // Tab hors de l'en-tête : le rideau ne doit pas masquer l'élément qui reçoit le focus (WCAG 2.4.11)
  entete.addEventListener('focusout', (e) => {
    const suivant = e.relatedTarget as Node | null
    if (ouvert() && suivant && !entete.contains(suivant)) fermer()
  })
  matchMedia('(width < 1200px)').addEventListener('change', () => fermer())

  if (poignee) brancherPoignee(poignee, feuille, () => fermer({ rendreFocus: true }))
}

function brancherPoignee(poignee: HTMLButtonElement, feuille: HTMLElement, fermer: () => void) {
  let depart: { y: number; t: number } | null = null
  let ecart = 0
  let glisse = false

  poignee.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return
    depart = { y: e.clientY, t: e.timeStamp }
    ecart = 0
    glisse = false
    poignee.setPointerCapture(e.pointerId)
  })
  poignee.addEventListener('pointermove', (e) => {
    if (!depart) return
    ecart = Math.min(0, e.clientY - depart.y)
    if (!glisse && ecart > -SEUIL_GLISSE) return
    glisse = true
    // La feuille suit le doigt, sans transition
    feuille.style.transition = 'none'
    feuille.style.translate = `0 ${ecart}px`
  })
  const relacher = (e: PointerEvent) => {
    if (!depart) return
    const vitesse = -ecart / Math.max(1, e.timeStamp - depart.t)
    depart = null
    if (!glisse) return
    feuille.style.transition = ''
    feuille.style.translate = ''
    if (-ecart > feuille.offsetHeight / 4 || vitesse > VITESSE_FERMETURE) fermer()
  }
  poignee.addEventListener('pointerup', relacher)
  poignee.addEventListener('pointercancel', relacher)
  poignee.addEventListener('click', () => {
    // Le clic qui suit un glissé est déjà traité par relacher
    if (glisse) {
      glisse = false
      return
    }
    fermer()
  })
}

function initialiser() {
  document.querySelectorAll<HTMLElement>('[data-entete]').forEach(brancher)
}

initialiser()
document.addEventListener('astro:page-load', initialiser)
