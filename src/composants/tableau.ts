/*
 * Tableau (facultatif) : la zone qui défile n'est un arrêt de tabulation et une région nommée que si
 * le tableau défile vraiment : sinon, un arrêt inutile, et le nom du tableau annoncé deux fois
 * (zone, puis tableau). Sans ce script, la zone l'est toujours.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-tableau.min.js"></script>
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */
function brancher() {
  const zones = [...document.querySelectorAll<HTMLElement>('[data-tableau-defilant]:not([data-tableau-pret])')]
  if (!zones.length) return
  const maj = () => {
    for (const zone of zones) {
      const defile = zone.scrollWidth > zone.clientWidth + 1
      // aria-label n'est pas permis sur un <div> sans rôle : il part avec lui
      zone.dataset.nom ??= zone.getAttribute('aria-label') ?? ''
      zone.dataset.role ??= zone.getAttribute('role') ?? 'region'
      if (defile) {
        zone.setAttribute('tabindex', '0')
        zone.setAttribute('role', zone.dataset.role)
        zone.setAttribute('aria-label', zone.dataset.nom)
      } else {
        for (const attribut of ['tabindex', 'role', 'aria-label']) zone.removeAttribute(attribut)
      }
    }
  }
  const observateur = new ResizeObserver(maj)
  document.addEventListener('astro:before-swap', () => {
    observateur.disconnect()
    zones.forEach((zone) => zone.removeAttribute('data-tableau-pret'))
  }, { once: true })
  for (const zone of zones) {
    zone.dataset.tableauPret = ''
    observateur.observe(zone)
  }
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
