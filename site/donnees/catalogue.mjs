/* Le plan et les fiches sont la source du catalogue : pas de deuxième inventaire à maintenir. */
import { readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { NAVIGATION } from '../navigation.mjs'
import { tableau, echapper } from '../outils.mjs'

export async function donneesCatalogue() {
  const groupes = NAVIGATION.find((g) => g.titre === 'Composants').pages.filter((g) => !Array.isArray(g))
  const sections = []
  for (const groupe of groupes) {
    const lignes = []
    for (const [chemin, nom] of groupe.pages) {
      const { data } = matter(await readFile(new URL('../pages/' + chemin.replace(/\.html$/, '.md'), import.meta.url), 'utf8'))
      const description = (data.description ?? '').split(/(?<=[.!?])\s/)[0].replace(/`([^`]+)`/g, '$1')
      lignes.push([`<a href="@@/${chemin}">${echapper(nom)}</a>`, echapper(description)])
    }
    const id = groupe.titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    sections.push(`<h2 id="${id}">${echapper(groupe.titre)}</h2>` + tableau(['Composant', 'Usage'], lignes))
  }
  return { 'catalogue-composants': sections.join('\n') }
}
