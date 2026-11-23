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

/*
 * Ordre des sections : démarrer, marque et rédaction, fondations visuelles, composants (classés par fonction),
 * services des Bibliothèques (modules branchés sur un service externe).
 * Dans « Composants », les groupes suivent les catégories « How To » de W3Schools (Menus, Buttons, Forms,
 * Filters, Images, Tables, Lists, Cards, Alerts…), traduites. Les listes vont de la plus simple à la plus riche.
 */
export const NAVIGATION = [
  {
    titre: 'Démarrer',
    pages: [
      'index.html',
      'demarrer/principes.html',
      'demarrer/integration.html',
      'sites/index.html',
    ],
  },
  {
    titre: 'Marque et rédaction',
    pages: [
      'fondations/identite.html',
      'composants/sceau.html',
      'fondations/redaction.html',
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
        titre: 'Menus et navigation',
        pages: [
          'composants/entete.html',
          'composants/navigation-secondaire.html',
          'composants/fil-ariane.html',
          'composants/table-matieres.html',
          'composants/onglets.html',
          'composants/accordeons.html',
          'composants/pagination.html',
          'composants/lien-evitement.html',
          'composants/retour-haut.html',
          'composants/pied-de-page.html',
          'composants/licence.html',
        ],
      },
      {
        titre: 'Boutons et liens',
        pages: [
          'composants/bouton.html',
          'composants/lien.html',
          'composants/copier.html',
        ],
      },
      {
        titre: 'Formulaires',
        pages: [
          'composants/recherche.html',
        ],
      },
      {
        titre: 'Images et médias',
        pages: [
          'composants/banniere.html',
          'composants/bande-image-texte.html',
          'composants/galerie.html',
          'composants/grille-logos.html',
          'composants/carrousel.html',
          'composants/video.html',
          'composants/icone-carree.html',
        ],
      },
      {
        titre: 'Tableaux',
        pages: [
          'composants/tableau.html',
        ],
      },
      {
        titre: 'Listes',
        pages: [
          'composants/liste-simple.html',
          'composants/liste-etapes.html',
          'composants/liste-icones.html',
          'composants/liste-illustree.html',
          'composants/liste-liens.html',
          'composants/liste-datee.html',
          'composants/liste-filtrable.html',
          'composants/liste-profils.html',
        ],
      },
      {
        titre: 'Cartes',
        pages: [
          'composants/carte-icone.html',
          'composants/carte-image.html',
          'composants/lieu.html',
        ],
      },
      {
        titre: 'Messages',
        pages: [
          'composants/alertes.html',
          'composants/etiquettes.html',
          'composants/infobulle.html',
          'composants/etat-vide.html',
          'composants/etat-erreur.html',
        ],
      },
      {
        titre: 'Contenu',
        pages: [
          'composants/citation.html',
          'composants/chiffres.html',
        ],
      },
      {
        titre: 'Mise en page',
        pages: [
          'composants/section.html',
          'composants/colonne-decalee.html',
          'composants/surface.html',
          'composants/separateur.html',
        ],
      },
    ],
  },
  {
    titre: 'Services des Bibliothèques',
    pages: [
      'composants/urgence.html',
      'composants/avis.html',
      'composants/clavardage.html',
      'composants/retroaction.html',
      'composants/consentement.html',
      'composants/integration.html',
      'composants/horaire-semaine.html',
    ],
  },
]

/** Anciennes adresses de pages renommées : une page de redirection les remplace dans le site publié */
export const REDIRECTIONS = {
  'composants/typographie.html': 'fondations/typographie.html#composant',
  'composants/modalites.html': 'composants/liste-icones.html',
  'composants/equipe.html': 'composants/liste-profils.html',
}

/** Liste à plat des pages, dans l'ordre de lecture, avec leur chemin de groupes */
export function pagesAPlat(noeuds = NAVIGATION, parents = []) {
  const liste = []
  for (const n of noeuds) {
    if (typeof n === 'string') liste.push({ chemin: n, titre: libelle(n), parents })
    else liste.push(...pagesAPlat(n.pages, [...parents, n.titre]))
  }
  return liste
}
