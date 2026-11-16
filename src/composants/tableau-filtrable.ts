/*
 * Tableau filtrable et triable (facultatif) : rend actifs les filtres et le tri d'un tableau déjà complet.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-tableau-filtrable.min.js"></script>
 *
 * Repères (voir tableau-filtrable.css) : [data-tableau-filtrable] (data-unite, data-unites, data-vide),
 * [data-filtre="cle"] sur chaque <select>, [data-statut], [data-aucun], [data-corps] (le <tbody>) et
 * [data-tri="cle"] sur chaque bouton d'en-tête ; chaque rangée porte data-<cle>.
 */
const enCamel = (cle: string) => cle.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())

function correspond(ligne: HTMLElement, cle: string, valeur: string) {
  if (!valeur) return true
  const donnee = ligne.dataset[enCamel(cle)] ?? ''
  if (donnee.startsWith('[')) {
    try {
      return (JSON.parse(donnee) as string[]).includes(valeur)
    } catch {
      return false
    }
  }
  return donnee === valeur
}

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-tableau-filtrable]')) {
    if (racine.dataset.pret === 'oui') continue
    racine.dataset.pret = 'oui'
    const filtres = [...racine.querySelectorAll<HTMLSelectElement>('[data-filtre]')]
    const statut = racine.querySelector<HTMLElement>('[data-statut]')
    const aucun = racine.querySelector<HTMLElement>('[data-aucun]')
    const corps = racine.querySelector<HTMLElement>('[data-corps]')
    if (!corps) continue
    const unite = racine.dataset.unite ?? 'résultat'
    const unites = racine.dataset.unites ?? 'résultats'
    const vide = racine.dataset.vide ?? 'Aucun résultat.'
    const lignes = [...corps.querySelectorAll<HTMLTableRowElement>(':scope > tr')]
    const ordreInitial = [...lignes]
    const boutonsTri = [...racine.querySelectorAll<HTMLButtonElement>('[data-tri]')]
    let tri: { cle: string; sens: 1 | -1 } | null = null

    const filtrer = () => {
      let visibles = 0
      for (const ligne of lignes) {
        const visible = filtres.every((f) => correspond(ligne, f.dataset.filtre!, f.value))
        ligne.hidden = !visible
        if (visible) visibles++
      }
      if (statut) statut.textContent = visibles === 0 ? vide : `${visibles} ${visibles > 1 ? unites : unite}`
      if (aucun) aucun.hidden = visibles > 0
    }

    // Premier clic : ordre croissant ; deuxième : décroissant ; troisième : ordre d'origine
    const trier = (cle: string) => {
      const actuel: typeof tri = tri?.cle !== cle ? { cle, sens: 1 } : tri.sens === 1 ? { cle, sens: -1 } : null
      tri = actuel
      const donnee = (l: HTMLElement) => l.dataset[enCamel(cle)] ?? ''
      corps.append(...(actuel ? [...lignes].sort((a, b) => actuel.sens * donnee(a).localeCompare(donnee(b), 'fr')) : ordreInitial))
      for (const bouton of boutonsTri) {
        const entete = bouton.closest('th')
        if (!entete) continue
        if (actuel && actuel.cle === bouton.dataset.tri) entete.setAttribute('aria-sort', actuel.sens === 1 ? 'ascending' : 'descending')
        else entete.removeAttribute('aria-sort')
      }
    }

    for (const f of filtres) f.addEventListener('change', filtrer)
    for (const b of boutonsTri) b.addEventListener('click', () => trier(b.dataset.tri!))
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
