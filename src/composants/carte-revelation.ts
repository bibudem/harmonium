/*
 * Cartes à révélation (facultatif) : au clic ou au toucher, la description prend le focus. La carte se
 * révèle alors par :focus-within, comme au clavier, et se referme quand le focus part ailleurs. Sans ce
 * script, le survol et le clavier suffisent.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-carte-revelation.min.js"></script>
 *
 * Repère : [data-carte-revelation] sur la carte, [data-description] sur la zone focalisable. Dans un
 * carrousel, une carte à demi visible qui reçoit le focus est ramenée entière dans sa piste (Chrome ne
 * défile pas jusqu'à une carte à demi visible : le focus resterait hors écran, WCAG 2.4.7 et 2.4.11).
 */
function activer() {
  for (const carte of document.querySelectorAll<HTMLElement>('[data-carte-revelation]')) {
    if (carte.dataset.carteRevelation === 'pret') continue
    carte.dataset.carteRevelation = 'pret'
    const description = carte.querySelector<HTMLElement>('[data-description]')
    carte.addEventListener('focusin', () => {
      const piste = carte.closest<HTMLElement>('[data-piste]')
      if (!piste) return
      const r = carte.getBoundingClientRect()
      const p = piste.getBoundingClientRect()
      if (r.left < p.left - 1 || r.right > p.right + 1) carte.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    })
    carte.addEventListener('click', (evenement) => {
      if (!description || (evenement.target as Element).closest('a, button, input, select, textarea, summary')) return
      if (!carte.contains(document.activeElement)) description.focus({ preventScroll: true })
    })
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', activer)
else activer()
document.addEventListener('astro:page-load', activer)
