/* Présentation des blocs éditoriaux : leurs textes et fichiers sont dans le Markdown. */
import { echapper } from './outils.mjs'
export function cartes(elements, inline) {
  // Composant Liste de liens, en grille : la carte entière est cliquable, pastille fléchée à droite
  return `<ul class="bib-liste-liens bib-liste-liens--grille large">${elements.map(({ titre, url, description }) => `<li class="bib-element-liste-liens bib-carte-lien"><div class="bib-element-liste-liens__texte"><h3 class="bib-element-liste-liens__titre"><a class="bib-lien-etire bib-element-liste-liens__lien" href="${echapper(url)}">${echapper(titre)}</a></h3><div class="bib-element-liste-liens__description">${inline(description)}</div></div><span class="bib-pastille-fleche bib-pastille-fleche--petite bib-element-liste-liens__pastille" aria-hidden="true"><span class="bib-pastille-fleche__fleche"></span></span></li>`).join('')}</ul>`
}
export function logos(elements) {
  return `<div class="marque-ressources">${elements.map(({ fichier, nom, libelle, largeur, hauteur, fond }) => `<figure><div class="marque-apercu${fond === 'fonce' ? ' marque-apercu--inverse' : ''}"><img src="${echapper(fichier)}" alt="${echapper(nom)}" width="${Number(largeur)}" height="${Number(hauteur)}" loading="lazy" decoding="async"></div><figcaption><a href="${echapper(fichier)}" download>${echapper(libelle)}</a></figcaption></figure>`).join('')}</div>`
}
