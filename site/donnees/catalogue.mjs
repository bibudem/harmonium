/* Le plan et les fiches sont la source du catalogue : pas de deuxième inventaire à maintenir. */
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { NAVIGATION } from '../navigation.mjs'
import { STATUTS } from '../integration.mjs'
import { echapper } from '../outils.mjs'

const VIGNETTES = new URL('../assets/vignettes/', import.meta.url)
const COMPOSANTS = new Set(JSON.parse(readFileSync(new URL('./composants.json', import.meta.url), 'utf8')))

/** Une carte par composant (vignette, nom, usage, statut), construite sur le lien étiré d’Harmonium. */
function carte(chemin, nom, data) {
  const fichier = chemin.split('/').pop().replace('.html', '')
  const usage = (data.description ?? '').split(/(?<=[.!?])\s/)[0].replace(/`([^`]+)`/g, '$1')
  const statut = data.statut ?? 'stable'
  const image = existsSync(new URL(`${fichier}.jpg`, VIGNETTES))
    ? `<img class="catalogue-carte__vignette" src="@@/vignettes/${fichier}.jpg" alt="" width="480" height="300" loading="lazy" decoding="async" />`
    : `<span class="catalogue-carte__vignette catalogue-carte__vignette--vide" aria-hidden="true">${echapper(nom.slice(0, 1))}</span>`
  const pastille = statut === 'stable' ? '' : `<ul class="bib-pastilles" aria-label="Statut"><li class="bib-pastille bib-pastille--${statut === 'beta' ? 'jaune' : 'rose'}">${STATUTS[statut][0]}</li></ul>`
  return `<li class="catalogue-carte bib-carte-lien bib-anneau-carte">${image}<div class="catalogue-carte__texte"><h3 class="catalogue-carte__titre"><a class="bib-lien-etire" href="@@/${chemin}">${echapper(nom)}</a></h3><p>${echapper(usage)}</p>${pastille}</div></li>`
}

export async function donneesCatalogue() {
  // Les groupes de « Composants », puis les services des Bibliothèques ; seules les fiches de composant
  // (donnees/composants.json) ont une carte.
  const groupes = [
    ...NAVIGATION.find((g) => g.titre === 'Composants').pages.filter((g) => typeof g !== 'string'),
    NAVIGATION.find((g) => g.titre === 'Services des Bibliothèques'),
  ]
  const sections = []
  for (const groupe of groupes) {
    const cartes = []
    for (const chemin of groupe.pages.filter((p) => COMPOSANTS.has(p))) {
      const { data } = matter(await readFile(new URL('../pages/' + chemin.replace(/\.html$/, '.md'), import.meta.url), 'utf8'))
      cartes.push(carte(chemin, data['titre-court'] ?? data.titre, data))
    }
    const id = groupe.titre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    sections.push(`<h2 id="${id}">${echapper(groupe.titre)}</h2>\n<ul class="catalogue-grille" aria-label="${echapper(groupe.titre)}">${cartes.join('')}</ul>`)
  }
  return { 'catalogue-composants': sections.join('\n') }
}
