/*
 * Plan du mini-site : la seule liste des pages. Le menu, le fil d'Ariane et les liens
 * « Précédent / Suivant » en découlent. Ajouter une page = un fichier Markdown dans site/pages/ + une ligne ici.
 *
 * Chaque page : son chemin publié. Le libellé vient de la page elle-même (`titre-court`, sinon
 * `titre`) : le titre ne s'écrit qu'une fois. Les groupes peuvent avoir des sous-groupes ({ titre, pages }).
 */
import { readFileSync } from 'node:fs'
import matter from 'gray-matter'

/** Libellé d'une page dans le menu, lu dans son Markdown */
export const libelle = (chemin) => {
  const { data } = matter(readFileSync(new URL(`./pages/${chemin.replace(/\.html$/, '.md')}`, import.meta.url), 'utf8'))
  return data['titre-court'] ?? data.titre
}

export const NAVIGATION = [
  {
    titre: 'Démarrer',
    pages: [
      'index.html',
      'demarrer/principes.html',
      'demarrer/integration.html',
    ],
  },
  {
    titre: 'Fondations',
    pages: [
      'fondations/couleurs.html',
      'fondations/typographie.html',
      'fondations/espacements.html',
      'fondations/formes.html',
      'fondations/mouvement.html',
      'fondations/redaction.html',
      'fondations/identite.html',
      'fondations/icones.html',
      'fondations/images.html',
      'fondations/jetons.html',
    ],
  },
  {
    titre: 'Composants',
    pages: [
      'composants/index.html',
      {
        titre: 'Services',
        pages: [
          'composants/urgence.html',
          'composants/avis.html',
          'composants/clavardage.html',
          'composants/retroaction.html',
          'composants/consentement.html',
          'composants/integration.html',
        ],
      },
      {
        titre: 'Contenu',
        pages: [
          'composants/alertes.html',
          'composants/accordeons.html',
          'composants/chiffres.html',
          'composants/onglets.html',
          'composants/citation.html',
          'composants/separateur.html',
          'composants/surface.html',
          'composants/modalites.html',
          'composants/tableau.html',
          'composants/video.html',
          'composants/galerie.html',
          'composants/etat-erreur.html',
          'composants/etat-vide.html',
        ],
      },
      {
        titre: 'Primitives',
        pages: [
          'composants/bouton.html',
          'composants/etiquettes.html',
          'composants/lien.html',
          'composants/copier.html',
        ],
      },
      {
        titre: 'Cartes et listes',
        pages: [
          'composants/carte-icone.html',
          'composants/carte-image.html',
          'composants/liste-liens.html',
          'composants/carrousel.html',
          'composants/liste-filtrable.html',
          'composants/equipe.html',
        ],
      },
      {
        titre: 'Lieux et horaires',
        pages: [
          'composants/lieu.html',
          'composants/horaire-semaine.html',
        ],
      },
      {
        titre: 'Mise en page',
        pages: [
          'composants/section.html',
          'composants/banniere.html',
          'composants/colonne-decalee.html',
          'composants/icone-carree.html',
          'composants/bande-image-texte.html',
        ],
      },
      {
        titre: 'Navigation',
        pages: [
          'composants/lien-evitement.html',
          'composants/table-matieres.html',
          'composants/fil-ariane.html',
          'composants/entete.html',
          'composants/recherche.html',
          'composants/navigation-secondaire.html',
          'composants/pagination.html',
          'composants/retour-haut.html',
          'composants/infobulle.html',
        ],
      },
      {
        titre: 'Pied de page',
        pages: [
          'composants/pied-de-page.html',
          'composants/sceau.html',
          'composants/licence.html',
        ],
      },
    ],
  },
  {
    titre: 'Intégration',
    pages: ['sites/index.html'],
  },
]

/** Liste à plat des pages, dans l'ordre de lecture, avec leur chemin de groupes */
export function pagesAPlat(noeuds = NAVIGATION, parents = []) {
  const liste = []
  for (const n of noeuds) {
    if (typeof n === 'string') liste.push({ chemin: n, titre: libelle(n), parents })
    else liste.push(...pagesAPlat(n.pages, [...parents, n.titre]))
  }
  return liste
}
