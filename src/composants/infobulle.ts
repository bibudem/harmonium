/*
 * Infobulles (facultatif) : Échap ferme celle qui est affichée, au survol comme au focus (WCAG
 * 1.4.13) ; elle revient au prochain survol ou focus.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-infobulle.min.js"></script>
 *
 * Une seule définition pour toutes les infobulles de la page (.bib-infobulle).
 */
const cle = '__bibInfobulle'
if (!(window as unknown as Record<string, unknown>)[cle]) {
  ;(window as unknown as Record<string, unknown>)[cle] = true
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    document.querySelectorAll<HTMLElement>('.bib-infobulle:is(:hover, :focus-visible)').forEach((el) => el.setAttribute('data-infobulle-fermee', ''))
  })
  for (const evenement of ['pointerout', 'focusout']) {
    document.addEventListener(evenement, (e) => {
      const el = (e.target as Element | null)?.closest?.('.bib-infobulle[data-infobulle-fermee]')
      if (el) el.removeAttribute('data-infobulle-fermee')
    })
  }
}
