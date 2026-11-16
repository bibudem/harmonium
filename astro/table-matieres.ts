/* Rendu HTML commun à TableMatieres.astro et au mini-site sans Astro. */
export type TitreTableMatieres = { depth: number; slug: string; text: string }
type Entree = { titre: string; url: string; enfants: Entree[] }
export type OptionsTableMatieres = {
  titres: TitreTableMatieres[]
  niveauMax?: 2 | 3
  minimum?: number
  nom?: string
  id?: string
  classe?: string
}
const echapper = (texte: string) => texte.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export function rendreTableMatieres({ titres, niveauMax = 2, minimum = 2, nom = 'Sur cette page', id = 'table-matieres', classe = '' }: OptionsTableMatieres): string {
  const entrees: Entree[] = []
  const connus = new Set<string>()
  for (const t of titres) {
    if (!t.slug || connus.has(t.slug) || t.depth < 2 || t.depth > niveauMax) continue
    connus.add(t.slug)
    const entree: Entree = { titre: t.text, url: `#${encodeURIComponent(t.slug)}`, enfants: [] }
    if (t.depth === 2) entrees.push(entree)
    else entrees.at(-1)?.enfants.push(entree)
  }
  if (entrees.length < Math.max(2, minimum)) return ''
  const liste = (noeuds: Entree[]): string => `<ul>${noeuds.map((n) => `<li><a href="${echapper(n.url)}">${echapper(n.titre)}</a>${n.enfants.length ? liste(n.enfants) : ''}</li>`).join('')}</ul>`
  const liens = liste(entrees)
  const identifiant = echapper(id)
  const libelle = echapper(nom)
  return `<div id="${identifiant}" class="${echapper(['bib-table-matieres', classe].filter(Boolean).join(' '))}" data-table-matieres>
  <nav class="bib-navigation-secondaire bib-navigation-secondaire--sommaire" aria-labelledby="${identifiant}-titre">
    <p class="bib-navigation-secondaire__titre" id="${identifiant}-titre">${libelle}</p>${liens}
  </nav>
  <details class="bib-navigation-secondaire-repliable">
    <summary><span id="${identifiant}-titre-repliable">${libelle}</span><span class="bib-navigation-secondaire__chevron" aria-hidden="true"></span></summary>
    <nav class="bib-navigation-secondaire bib-navigation-secondaire--dans-repliable bib-navigation-secondaire--sommaire" aria-labelledby="${identifiant}-titre-repliable">${liens}</nav>
  </details>
</div>`
}
