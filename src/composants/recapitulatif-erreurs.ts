/*
 * Récapitulatif d'erreurs (facultatif) : focus au chargement, et liens qui montrent le champ avec son libellé.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-recapitulatif-erreurs.min.js"></script>
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */
function libelleDe(champ: HTMLElement): HTMLElement | null {
  const legende = champ.closest('fieldset')?.querySelector('legend')
  if (legende && (champ as HTMLInputElement).type?.match(/radio|checkbox/)) return legende
  return champ.id ? document.querySelector<HTMLElement>(`label[for="${CSS.escape(champ.id)}"]`) : null
}

function aller(evenement: MouseEvent) {
  const lien = (evenement.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
  if (!lien) return
  const champ = document.getElementById(decodeURIComponent(lien.hash.slice(1)))
  if (!champ) return
  evenement.preventDefault()
  // Le libellé (ou la légende du groupe) au-dessus du champ : la personne voit ce qu'on lui demande
  ;(libelleDe(champ) ?? champ).scrollIntoView({ block: 'start' })
  champ.focus({ preventScroll: true })
}

function brancher() {
  for (const recapitulatif of document.querySelectorAll<HTMLElement>('[data-recapitulatif-erreurs]:not([data-pret])')) {
    recapitulatif.dataset.pret = ''
    recapitulatif.addEventListener('click', aller)
    if (!recapitulatif.hasAttribute('data-sans-focus')) recapitulatif.focus()
  }
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
