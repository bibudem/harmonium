/*
 * Quoi de neuf (facultatif) : les onglets sous 900 px (rôles ARIA, clavier, panneaux qui défilent à
 * l'horizontale, pastille qui suit le doigt). Sans lui, la CSS affiche les colonnes empilées.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-quoi-de-neuf.min.js"></script>
 *
 * Repères : [data-quoi-de-neuf], [data-onglets], [data-indicateur], les boutons [data-cible] et les colonnes
 * [data-colonne] (voir quoi-de-neuf.css).
 */
let controleur: AbortController | undefined

function brancher() {
  const nouveaux = [...document.querySelectorAll<HTMLElement>('[data-quoi-de-neuf]')].filter((r) => r.dataset.pret !== 'oui')
  if (!nouveaux.length) return
  controleur?.abort()
  const { signal } = (controleur = new AbortController())
  for (const racine of nouveaux) {
    racine.dataset.pret = 'oui'
    const barre = racine.querySelector<HTMLElement>('[data-onglets]')!
    const onglets = [...barre.querySelectorAll<HTMLButtonElement>('button[data-cible]')]
    const panneaux = onglets.map((o) => racine.querySelector<HTMLElement>(`[data-colonne="${o.dataset.cible}"]`))
    const mq = window.matchMedia('(width >= 900px)')
    let actif = 0

    panneaux.forEach((p, i) => {
      if (p) p.id ||= `quoi-de-neuf-panneau-${onglets[i].dataset.cible}`
    })

    const grille = racine.querySelector<HTMLElement>('.bib-quoi-de-neuf__grille')!
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)')
    const enOnglets = () => !mq.matches
    const carrousel = () => grille.classList.contains('bib-quoi-de-neuf__grille--carrousel')
    // Position de défilement de chaque panneau (ils sont côte à côte)
    const position = (i: number) => (panneaux[i]?.offsetLeft ?? 0) - (panneaux[0]?.offsetLeft ?? 0)

    // La pastille prend la place et la taille de l'onglet actif (les
    // onglets peuvent passer sur deux lignes avec le texte agrandi). Avec
    // une position fractionnaire (glissement en cours), elle est entre deux
    // onglets.
    const indicateur = barre.querySelector<HTMLElement>('[data-indicateur]')!
    function placerIndicateur(progression = actif) {
      const a = onglets[Math.floor(progression)]
      const b = onglets[Math.min(Math.ceil(progression), onglets.length - 1)]
      if (!a.offsetWidth) return
      const t = progression - Math.floor(progression)
      const entre = (x: number, y: number) => x + (y - x) * t
      indicateur.style.width = `${entre(a.offsetWidth, b.offsetWidth)}px`
      indicateur.style.height = `${entre(a.offsetHeight, b.offsetHeight)}px`
      indicateur.style.translate = `${entre(a.offsetLeft, b.offsetLeft)}px ${entre(a.offsetTop, b.offsetTop)}px`
    }
    const tailleBarre = new ResizeObserver(() => {
      placerIndicateur()
      // Pas de glissement à la première mise en place
      requestAnimationFrame(() => barre.classList.add('bib-quoi-de-neuf__onglets--pret'))
    })
    tailleBarre.observe(barre)

    // Hauteur du bloc : celle du panneau affiché (les listes se remplissent
    // après coup, d'où l'observation de chaque panneau)
    function ajusterHauteur() {
      const p = panneaux[actif]
      grille.style.height = carrousel() && p ? `${p.offsetHeight}px` : ''
    }
    const observateur = new ResizeObserver(ajusterHauteur)
    for (const p of panneaux) if (p) observateur.observe(p)
    signal.addEventListener('abort', () => {
      tailleBarre.disconnect()
      observateur.disconnect()
    }, { once: true })

    function activer(index: number, focus = false, defiler = true) {
      actif = index
      onglets.forEach((o, i) => {
        o.dataset.actif = String(i === actif)
        if (enOnglets()) {
          o.setAttribute('aria-selected', String(i === actif))
          o.tabIndex = i === actif ? 0 : -1
        }
        panneaux[i]?.setAttribute('data-actif', String(i === actif))
        if (panneaux[i]) panneaux[i]!.inert = carrousel() && i !== actif
      })
      ajusterHauteur()
      if (defiler && carrousel()) grille.scrollTo({ left: position(actif), behavior: reduit.matches ? 'auto' : 'smooth' })
      else placerIndicateur()
      if (focus) onglets[actif].focus()
    }

    // Glissement du doigt (ou défilement lancé par un onglet) : la pastille
    // suit ; à l'arrêt, le panneau le plus proche devient l'onglet actif
    let enAttente = false
    let minuterieFin: ReturnType<typeof setTimeout> | undefined
    function finDefilement() {
      barre.classList.remove('bib-quoi-de-neuf__onglets--suivi')
      const pas = position(1) || grille.clientWidth
      const index = Math.round(grille.scrollLeft / pas)
      if (index !== actif) activer(index, false, false)
      else placerIndicateur()
    }
    grille.addEventListener(
      'scroll',
      () => {
        if (!carrousel()) return
        clearTimeout(minuterieFin)
        minuterieFin = setTimeout(finDefilement, 120)
        if (enAttente) return
        enAttente = true
        requestAnimationFrame(() => {
          enAttente = false
          barre.classList.add('bib-quoi-de-neuf__onglets--suivi')
          const pas = position(1) || grille.clientWidth
          const progression = Math.max(0, Math.min(onglets.length - 1, grille.scrollLeft / pas))
          placerIndicateur(progression)
          // Texte en blanc sur l'onglet le plus proche de la pastille (visuel
          // seulement : aria-selected change à l'arrêt)
          onglets.forEach((o, i) => (o.dataset.actif = String(i === Math.round(progression))))
        })
      },
      { passive: true },
    )

    function mettreEnPage() {
      grille.classList.toggle('bib-quoi-de-neuf__grille--carrousel', enOnglets())
      activer(actif, false, false)
      if (carrousel()) grille.scrollLeft = position(actif)
    }

    function poserRoles() {
      const oui = enOnglets()
      if (oui) {
        barre.setAttribute('role', 'tablist')
        barre.setAttribute('aria-label', 'Quoi de neuf')
      } else {
        barre.removeAttribute('role')
        barre.removeAttribute('aria-label')
      }
      onglets.forEach((o, i) => {
        const p = panneaux[i]
        if (oui) {
          o.setAttribute('role', 'tab')
          o.setAttribute('aria-controls', p?.id ?? '')
          o.setAttribute('aria-selected', String(i === actif))
          o.tabIndex = i === actif ? 0 : -1
          p?.setAttribute('role', 'tabpanel')
          p?.setAttribute('aria-labelledby', o.id)
        } else {
          for (const a of ['role', 'aria-controls', 'aria-selected', 'tabindex']) o.removeAttribute(a)
          p?.removeAttribute('role')
          // Hors onglets, la colonne reprend son titre comme nom
          p?.setAttribute('aria-labelledby', o.dataset.cible!)
        }
      })
    }

    onglets.forEach((o, i) => o.addEventListener('click', () => activer(i)))
    barre.addEventListener('keydown', (e) => {
      if (!enOnglets()) return
      const dernier = onglets.length - 1
      const cible = { ArrowRight: actif === dernier ? 0 : actif + 1, ArrowLeft: actif === 0 ? dernier : actif - 1, Home: 0, End: dernier }[e.key]
      if (cible === undefined) return
      e.preventDefault()
      activer(cible, true)
    })
    mq.addEventListener('change', () => {
      poserRoles()
      mettreEnPage()
    }, { signal })
    poserRoles()
    mettreEnPage()
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:before-swap', () => controleur?.abort())
document.addEventListener('astro:page-load', brancher)
