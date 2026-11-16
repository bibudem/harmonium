/*
 * Table des matières : suivi de la section lue (40 % supérieurs de la fenêtre),
 * aria-current="true" synchronisé dans les deux variantes, fermeture du volet mobile.
 * Les ancres fonctionnent sans ce script. Compatible avec astro:page-load.
 */
const cle = '__bibTableMatieres'
if (!(window as unknown as Record<string, unknown>)[cle]) {
  ;(window as unknown as Record<string, unknown>)[cle] = true
  let nettoyer: (() => void) | undefined
  const cibleDe = (lien: HTMLAnchorElement) => {
    try { return document.getElementById(decodeURIComponent(lien.hash.slice(1))) } catch { return null }
  }
  function brancher() {
    nettoyer?.()
    const controleur = new AbortController()
    const { signal } = controleur
    const groupes = [...document.querySelectorAll<HTMLElement>('[data-table-matieres]')].map((racine) => {
      const liens = [...racine.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      const titres = [...new Set(liens.map(cibleDe).filter((t): t is HTMLElement => !!t))]
      return { racine, liens, titres }
    })
    let trame = 0
    const maj = () => {
      trame = 0
      for (const { racine, liens, titres } of groupes) {
        if (!racine.isConnected) continue
        let actuel: HTMLElement | undefined
        for (const titre of titres) {
          const repere = titre.closest('details:not([open])') ?? titre
          if (repere.getBoundingClientRect().top <= window.innerHeight * 0.4) actuel = titre
        }
        const defile = document.documentElement.scrollHeight > window.innerHeight + 2
        if (defile && window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) actuel = titres.at(-1)
        for (const lien of liens) {
          if (actuel && cibleDe(lien) === actuel) lien.setAttribute('aria-current', 'true')
          else lien.removeAttribute('aria-current')
        }
        const courant = racine.querySelector<HTMLElement>(':scope > nav [aria-current="true"]')
        if (courant && racine.scrollHeight > racine.clientHeight) {
          const cadre = racine.getBoundingClientRect()
          const repere = courant.getBoundingClientRect()
          if (repere.top < cadre.top || repere.bottom > cadre.bottom) racine.scrollTop += repere.top - cadre.top - cadre.height / 2
        }
      }
    }
    const planifier = () => { if (!trame) trame = requestAnimationFrame(maj) }
    if (groupes.length) {
      window.addEventListener('scroll', planifier, { passive: true, signal })
      window.addEventListener('resize', planifier, { signal })
      window.addEventListener('hashchange', planifier, { signal })
      maj()
    }
    nettoyer = () => { controleur.abort(); cancelAnimationFrame(trame) }
  }
  document.addEventListener('click', (e) => {
    const lien = (e.target as Element | null)?.closest<HTMLAnchorElement>('[data-table-matieres] a[href^="#"]')
    const volet = lien?.closest('details')
    const cible = lien && cibleDe(lien)
    if (!volet?.open || !cible || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    volet.open = false
    // Le lien disparaît avec le volet : poursuivre la lecture sur la cible, sans arrêt de Tab ajouté.
    if (!cible.hasAttribute('tabindex')) cible.tabIndex = -1
    requestAnimationFrame(() => cible.focus({ preventScroll: true }))
  })
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    const volet = (e.target as Element | null)?.closest<HTMLDetailsElement>('[data-table-matieres] details[open]')
    if (!volet) return
    volet.open = false
    volet.querySelector('summary')?.focus()
  })
  document.addEventListener('astro:before-swap', () => nettoyer?.())
  document.addEventListener('astro:page-load', brancher)
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
  else brancher()
}
