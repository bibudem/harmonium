/* Présentation des blocs éditoriaux : leurs textes et fichiers sont dans le Markdown. */
import { echapper } from './outils.mjs'
export function cartes(elements, inline) {
  return `<ul class="cartes large">${elements.map(({ titre, url, description }) => `<li><article class="carte"><h3><a href="${echapper(url)}">${echapper(titre)}</a></h3><p>${inline(description)}</p></article></li>`).join('')}</ul>`
}
export function logos(elements) {
  return `<div class="marque-ressources">${elements.map(({ fichier, nom, libelle, largeur, hauteur, fond }) => `<figure><div class="marque-apercu${fond === 'fonce' ? ' marque-apercu--inverse' : ''}"><img src="${echapper(fichier)}" alt="${echapper(nom)}" width="${Number(largeur)}" height="${Number(hauteur)}" loading="lazy" decoding="async"></div><figcaption><a href="${echapper(fichier)}" download>${echapper(libelle)}</a></figcaption></figure>`).join('')}</div>`
}
