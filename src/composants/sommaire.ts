/*
 * Sommaire « Aller à une section » (facultatif) : les gestes attendus d’un panneau. Échap le ferme et rend le
 * focus à la pastille ; un clic dehors, sur un lien ou le départ du focus au clavier le ferment.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-sommaire.min.js"></script>
 *
 * Repère : [data-sommaire] sur le <nav>, qui contient le <details>. Délégation sur le document : vaut pour
 * toutes les pages et tous les sommaires, navigation côté client comprise.
 */
const sommaires = () => document.querySelectorAll<HTMLElement>('[data-sommaire]')

function fermer(sommaire: Element, rendreFocus = false) {
  const details = sommaire.querySelector('details')
  if (!details?.open) return
  details.open = false
  if (rendreFocus) details.querySelector('summary')?.focus()
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  const sommaire = (e.target as Element | null)?.closest?.('[data-sommaire]')
  if (!sommaire?.querySelector('details[open]')) return
  e.stopPropagation()
  fermer(sommaire, true)
})

// Un clic sur un lien d’ancre referme le panneau (la page défile vers la cible) ; un clic dehors aussi
document.addEventListener('click', (e) => {
  const cible = e.target as Element | null
  for (const sommaire of sommaires()) {
    if (!sommaire.contains(cible) || cible?.closest('a')) fermer(sommaire)
  }
})

// Le focus quitte le panneau au clavier (Tab hors du dernier lien)
document.addEventListener('focusout', (e) => {
  const sommaire = (e.target as Element | null)?.closest?.('[data-sommaire]')
  const suivant = e.relatedTarget as Node | null
  if (sommaire && suivant && !sommaire.contains(suivant)) fermer(sommaire)
})
