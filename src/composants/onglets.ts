/*
 * Onglets (facultatif) : rend les jeux d'onglets [data-onglets] interactifs, selon le motif Onglets de l'APG
 * WAI-ARIA : tabindex itinérant, flèches, Début et Fin, activation automatique au déplacement du focus.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-onglets.min.js"></script>
 *
 * Amélioration progressive : le HTML du serveur montre tous les panneaux, chacun précédé de son titre. La CSS
 * attend data-onglets-pret avant de montrer les commandes ; ce script pose les rôles ARIA (absents du HTML :
 * sans script, ce ne sont que des sections titrées), l'état et les écouteurs.
 *
 * Balisage attendu : racine [data-onglets], liste [data-onglets-liste] (aria-label dans data-aria-label),
 * onglets [data-onglet] avec aria-controls, panneaux désignés par ces ids, titres [data-titre-panneau].
 *
 * Groupes : une racine qui porte data-groupe, et des onglets qui portent data-valeur, se synchronise avec tous
 * les jeux du même groupe. Le choix de la personne est gardé sous la clé bib.onglets.<groupe>. Avec data-url,
 * il passe aussi dans l'adresse (?<groupe>=<valeur>), qui l'emporte au chargement. L'événement
 * « bib:onglets-groupe » (detail : { groupe, valeur }) est émis sur window à chaque changement de valeur d'un
 * groupe, pour qu'un autre composant puisse le suivre.
 *
 * Onglets horizontaux, sous 900 px : les panneaux sont côte à côte et défilent à l'horizontale, aimantés sur
 * chacun ; on passe de l'un à l'autre d'un glissement du doigt ou en touchant un onglet. La pastille de
 * l'onglet actif ([data-indicateur]) suit le doigt ; à l'arrêt, le panneau le plus proche devient l'onglet
 * choisi. La hauteur du bloc suit celle du panneau affiché, et les panneaux hors de vue sont inertes (hors de
 * l'ordre de tabulation et de l'arbre d'accessibilité). Mouvement réduit : saut direct au panneau.
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */

const FOCALISABLES = 'a[href], button, input, select, textarea, iframe, summary, [tabindex]:not([tabindex="-1"]), [contenteditable]'

type JeuOnglets = {
  racine: HTMLElement
  onglets: HTMLElement[]
  panneaux: HTMLElement[]
  nettoyer: () => void
  selectionner: (index: number, focus?: boolean, defiler?: Defilement) => void
}

/** Comment le carrousel mobile rejoint un panneau : en douceur, d'un saut, ou pas du tout */
type Defilement = 'lisse' | 'instantane' | false

const jeux: JeuOnglets[] = []

/* ---------- Groupes ---------- */

const PREFIXE_STOCKAGE = 'bib.onglets.'
type Rappel = (valeur: string | null) => void
const valeursGroupes = new Map<string, string>()
const abonnes = new Map<string, Set<Rappel>>()

// localStorage peut être absent ou refusé (navigation privée, réglages) :
// le choix vaut alors pour la page seulement.
function lireStockage(groupe: string) {
  try {
    return localStorage.getItem(PREFIXE_STOCKAGE + groupe)
  } catch {
    return null
  }
}

function ecrireStockage(groupe: string, valeur: string) {
  try {
    localStorage.setItem(PREFIXE_STOCKAGE + groupe, valeur)
  } catch {
    // choix non gardé : rien d'autre à faire
  }
}

const lireAdresse = (groupe: string) => new URLSearchParams(location.search).get(groupe)

/** Valeur courante d'un groupe : jeu de la page, sinon adresse, sinon choix gardé */
function valeurDuGroupe(groupe: string) {
  return valeursGroupes.get(groupe) ?? lireAdresse(groupe) ?? lireStockage(groupe)
}

function annoncer(groupe: string, valeur: string) {
  if (valeursGroupes.get(groupe) === valeur) return
  valeursGroupes.set(groupe, valeur)
  abonnes.get(groupe)?.forEach((rappel) => rappel(valeur))
  window.dispatchEvent(new CustomEvent('bib:onglets-groupe', { detail: { groupe, valeur } }))
}

/** Appelle `rappel` tout de suite avec la valeur du groupe, puis à chaque changement */
function suivreGroupe(groupe: string, rappel: Rappel) {
  if (!abonnes.has(groupe)) abonnes.set(groupe, new Set())
  abonnes.get(groupe)!.add(rappel)
  rappel(valeurDuGroupe(groupe))
}

const valeurOnglet = (onglet: HTMLElement) => onglet.dataset.valeur ?? ''

function initialiser(racine: HTMLElement) {
  if (racine.hasAttribute('data-onglets-pret')) return
  const liste = racine.querySelector<HTMLElement>(':scope > [data-onglets-liste]')
  if (!liste) return
  const onglets = Array.from(liste.querySelectorAll<HTMLElement>(':scope > [data-onglet]'))
  const panneaux = onglets.map((onglet) => document.getElementById(onglet.getAttribute('aria-controls') ?? ''))
  if (!onglets.length || panneaux.some((p) => !p)) return
  const panneauxSurs = panneaux as HTMLElement[]
  const nettoyages: (() => void)[] = []

  liste.setAttribute('role', 'tablist')
  if (liste.dataset.ariaLabel) liste.setAttribute('aria-label', liste.dataset.ariaLabel)
  onglets.forEach((onglet) => onglet.setAttribute('role', 'tab'))

  panneauxSurs.forEach((panneau, i) => {
    panneau.setAttribute('role', 'tabpanel')
    panneau.setAttribute('aria-labelledby', onglets[i].id)
    // L'APG rend le panneau focalisable seulement s'il n'a rien à focaliser,
    // pour que Tab mène du jeu d'onglets au contenu sans arrêt superflu.
    if (!panneau.querySelector(FOCALISABLES)) panneau.tabIndex = 0
    // Le titre ne sert qu'au rendu sans JS : l'onglet le remplace
    panneau.querySelectorAll<HTMLElement>(':scope > [data-titre-panneau]').forEach((titre) => (titre.hidden = true))
  })

  // ---- Carrousel mobile des onglets horizontaux ----
  const conteneur = panneauxSurs[0].parentElement as HTMLElement
  const indicateur = liste.querySelector<HTMLElement>('[data-indicateur]')
  // Un seul seuil, 900 px, pour le carrousel et l'orientation annoncée
  const large = window.matchMedia('(width >= 900px)')
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)')
  const enCarrousel = () => racine.dataset.orientationLarge === 'horizontal' && !!indicateur && !large.matches
  let actuel = 0

  // Position de défilement de chaque panneau (ils sont côte à côte)
  const position = (i: number) => (panneauxSurs[i]?.offsetLeft ?? panneauxSurs[0].offsetLeft) - panneauxSurs[0].offsetLeft
  const pas = () => position(1) || conteneur.clientWidth

  // La pastille prend la place et la taille de l'onglet actif ; pendant un glissement, elle est entre deux onglets
  function placerIndicateur(progression = actuel) {
    if (!indicateur) return
    // Hors carrousel, la pastille est masquée : ne pas garder une position mesurée sur la mise en page
    // large, d'où elle glisserait (hors de l'écran) au retour sur téléphone
    if (!enCarrousel()) {
      indicateur.style.removeProperty('width')
      indicateur.style.removeProperty('height')
      indicateur.style.removeProperty('translate')
      liste.classList.remove('bib-onglets__liste--pret')
      return
    }
    const a = onglets[Math.floor(progression)]
    const b = onglets[Math.min(Math.ceil(progression), onglets.length - 1)]
    if (!a.offsetWidth) return
    const t = progression - Math.floor(progression)
    const entre = (x: number, y: number) => x + (y - x) * t
    indicateur.style.width = `${entre(a.offsetWidth, b.offsetWidth)}px`
    indicateur.style.height = `${entre(a.offsetHeight, b.offsetHeight)}px`
    indicateur.style.translate = `${entre(a.offsetLeft, b.offsetLeft)}px ${entre(a.offsetTop, b.offsetTop)}px`
  }

  // Hauteur du bloc : celle du panneau affiché (le contenu change après coup, d'où l'observation)
  function ajusterHauteur() {
    conteneur.style.height = enCarrousel() ? `${panneauxSurs[actuel].offsetHeight}px` : ''
  }

  function selectionner(index: number, focus = false, defiler: Defilement = 'lisse') {
    actuel = index
    const carrousel = enCarrousel()
    onglets.forEach((onglet, i) => {
      const actif = i === index
      onglet.setAttribute('aria-selected', String(actif))
      onglet.dataset.selectionne = String(actif)
      onglet.tabIndex = actif ? 0 : -1
      // En carrousel, tous les panneaux sont affichés côte à côte : ceux hors de vue sont inertes
      panneauxSurs[i].hidden = carrousel ? false : !actif
      panneauxSurs[i].inert = carrousel && !actif
      panneauxSurs[i].dataset.selectionne = String(actif)
    })
    if (carrousel) {
      ajusterHauteur()
      if (defiler) conteneur.scrollTo({ left: position(index), behavior: defiler === 'instantane' || reduit.matches ? 'instant' : 'smooth' })
      else placerIndicateur()
    }
    if (focus) onglets[index].focus()
  }

  function mettreEnPage() {
    const carrousel = enCarrousel()
    racine.classList.toggle('bib-onglets--carrousel', carrousel)
    selectionner(actuel, false, false)
    if (carrousel) conteneur.scrollLeft = position(actuel)
    else conteneur.style.height = ''
    placerIndicateur()
  }

  if (indicateur) {
    const tailleListe = new ResizeObserver(() => {
      placerIndicateur()
      // Pas de glissement de la pastille à la première mise en place
      requestAnimationFrame(() => liste.classList.add('bib-onglets__liste--pret'))
    })
    tailleListe.observe(liste)
    nettoyages.push(() => tailleListe.disconnect())
    const observateur = new ResizeObserver(ajusterHauteur)
    panneauxSurs.forEach((p) => observateur.observe(p))
    nettoyages.push(() => observateur.disconnect())

    // Glissement du doigt (ou défilement lancé par un onglet) : la pastille suit ; à l'arrêt, le panneau le plus proche est choisi
    let enAttente = false
    // Sans défilement pendant ce délai (ms), le geste est considéré comme fini (pas un jeton de
    // mouvement : c'est un seuil de détection, pas une durée d'animation)
    const FIN_DEFILEMENT = 120
    let minuterieFin: ReturnType<typeof setTimeout> | undefined
    conteneur.addEventListener(
      'scroll',
      () => {
        if (!enCarrousel()) return
        clearTimeout(minuterieFin)
        minuterieFin = setTimeout(() => {
          liste.classList.remove('bib-onglets__liste--suivi')
          const index = Math.round(conteneur.scrollLeft / pas())
          if (index !== actuel) choisir(index, false, false)
          else placerIndicateur()
        }, FIN_DEFILEMENT)
        if (enAttente) return
        enAttente = true
        requestAnimationFrame(() => {
          enAttente = false
          liste.classList.add('bib-onglets__liste--suivi')
          placerIndicateur(Math.max(0, Math.min(onglets.length - 1, conteneur.scrollLeft / pas())))
        })
      },
      { passive: true },
    )
    large.addEventListener('change', mettreEnPage)
    nettoyages.push(() => { large.removeEventListener('change', mettreEnPage); clearTimeout(minuterieFin) })
  }

  const groupe = racine.dataset.groupe

  /** Choix de la personne : il vaut pour tout le groupe et il est gardé */
  function choisir(index: number, focus = false, defiler: Defilement = 'lisse') {
    selectionner(index, focus, defiler)
    if (!groupe) return
    const valeur = valeurOnglet(onglets[index])
    // Les autres jeux du groupe changent de hauteur : on garde l'onglet
    // choisi à la même place à l'écran
    const avant = onglets[index].getBoundingClientRect().top
    for (const jeu of jeux) {
      if (jeu.racine === racine || jeu.racine.dataset.groupe !== groupe) continue
      const cible = jeu.onglets.findIndex((o) => valeurOnglet(o) === valeur)
      if (cible >= 0) jeu.selectionner(cible, false, 'instantane')
    }
    const decalage = onglets[index].getBoundingClientRect().top - avant
    if (decalage) window.scrollBy({ top: decalage, behavior: 'instant' })
    ecrireStockage(groupe, valeur)
    if (racine.hasAttribute('data-url')) {
      const adresse = new URL(location.href)
      adresse.searchParams.set(groupe, valeur)
      history.replaceState(history.state, '', adresse)
    }
    annoncer(groupe, valeur)
  }

  liste.addEventListener('click', (evenement) => {
    racine.removeAttribute('data-onglets-clavier')
    const onglet = (evenement.target as Element).closest<HTMLElement>('[data-onglet]')
    const index = onglet ? onglets.indexOf(onglet) : -1
    if (index >= 0) choisir(index)
  })

  liste.addEventListener('keydown', (evenement) => {
    const index = onglets.indexOf(document.activeElement as HTMLElement)
    if (index < 0) return
    const dernier = onglets.length - 1
    let suivant: number
    // L'axe libre garde le défilement normal de la page (motif APG).
    const verticale = liste.getAttribute('aria-orientation') === 'vertical'
    if (verticale && (evenement.key === 'ArrowLeft' || evenement.key === 'ArrowRight')) return
    if (!verticale && (evenement.key === 'ArrowUp' || evenement.key === 'ArrowDown')) return
    switch (evenement.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        suivant = index === dernier ? 0 : index + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        suivant = index === 0 ? dernier : index - 1
        break
      case 'Home':
        suivant = 0
        break
      case 'End':
        suivant = dernier
        break
      default:
        return
    }
    evenement.preventDefault()
    racine.setAttribute('data-onglets-clavier', '')
    choisir(suivant, true, 'instantane')
  })

  // Orientation annoncée selon la mise en page réelle (CSS), sans changer le
  // rendu : seul l'attribut ARIA suit la largeur.
  const orientationLarge = racine.dataset.orientationLarge
  if (orientationLarge) {
    const appliquer = () => liste.setAttribute('aria-orientation', large.matches ? orientationLarge : 'horizontal')
    appliquer()
    large.addEventListener('change', appliquer)
    nettoyages.push(() => large.removeEventListener('change', appliquer))
  }

  // Onglet de départ : celui du groupe (adresse, puis choix gardé) s'il
  // existe dans ce jeu, sinon l'onglet par défaut du HTML
  const parDefaut = Math.max(
    0,
    onglets.findIndex((o) => o.dataset.selectionne === 'true'),
  )
  const valeurGroupe = groupe ? valeurDuGroupe(groupe) : null
  const duGroupe = valeurGroupe === null ? -1 : onglets.findIndex((o) => valeurOnglet(o) === valeurGroupe)
  const initial = duGroupe >= 0 ? duGroupe : parDefaut
  actuel = initial
  selectionner(initial, false, false)
  mettreEnPage()
  if (groupe) annoncer(groupe, valeurOnglet(onglets[initial]))
  racine.setAttribute('data-onglets-pret', '')
  // Le fondu des panneaux (animations.css) ne vaut qu'après le premier
  // affichage : le panneau initial n'est pas animé au chargement.
  requestAnimationFrame(() => racine.setAttribute('data-onglets-anime', ''))
  jeux.push({ racine, onglets, panneaux: panneauxSurs, selectionner, nettoyer: () => nettoyages.forEach((nettoyer) => nettoyer()) })
}

/** Une ancre qui vise un onglet, un panneau ou un élément d'un panneau l'affiche */
function suivreAncre() {
  let id: string
  try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
  const cible = id ? document.getElementById(id) : null
  if (!cible) return
  let change = false
  for (const jeu of jeux) {
    let index = jeu.onglets.indexOf(cible)
    if (index < 0) index = jeu.panneaux.findIndex((panneau) => panneau.contains(cible))
    if (index >= 0 && jeu.panneaux[index].dataset.selectionne !== 'true') {
      // Cible d'une ancre : visible tout de suite, sans le fondu du panneau
      jeu.racine.removeAttribute('data-onglets-anime')
      jeu.selectionner(index, false, 'instantane')
      // L'onglet affiché vaut pour le groupe (MasquerSi), sans devenir un choix gardé
      if (jeu.racine.dataset.groupe) annoncer(jeu.racine.dataset.groupe, valeurOnglet(jeu.onglets[index]))
      requestAnimationFrame(() => jeu.racine.setAttribute('data-onglets-anime', ''))
      change = true
    }
  }
  // Saut immédiat : le défilement doux de html ferait traverser la page
  if (change) cible.scrollIntoView({ behavior: 'instant' })
}

function brancher() {
  // Écarter les pages quittées par ClientRouter des synchronisations suivantes.
  let pageQuittee = false
  for (let i = jeux.length - 1; i >= 0; i--) if (!jeux[i].racine.isConnected) {
    jeux[i].nettoyer()
    jeux.splice(i, 1)
    pageQuittee = true
  }
  // La nouvelle adresse prime sur le choix en mémoire de la page quittée.
  if (pageQuittee && !jeux.length) valeursGroupes.clear()
  document.querySelectorAll<HTMLElement>('[data-onglets]').forEach(initialiser)
  suivreAncre()
}

window.addEventListener('hashchange', suivreAncre)
document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
