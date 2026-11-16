/*
 * Plan du mini-site : la seule liste des pages. Le menu, le fil d'Ariane et les liens
 * « Précédent / Suivant » en découlent. Ajouter une page = un fichier Markdown dans site/pages/ + une ligne ici.
 *
 * Chaque page : [chemin publié, titre dans le menu]. Les groupes peuvent avoir des
 * sous-groupes ({ titre, pages }).
 */
/** Exemples conservés pour référence, exclus du catalogue actif. */
export const HORS_CATALOGUE = [
  ['composants/carte-texte.html', 'Carte de texte'],
  ['composants/carte-depliable.html', 'Carte dépliable'],
  ['composants/carte-revelation.html', 'Carte à révélation'],
  ['composants/colonnes-texte.html', 'Colonnes de texte'],
]

export const NAVIGATION = [
  {
    titre: 'Démarrer',
    pages: [
      ['index.html', 'Accueil'],
      ['demarrer/principes.html', 'Principes et qualité'],
      ['demarrer/integration.html', 'Intégrer à un site'],
    ],
  },
  {
    titre: 'Fondations',
    pages: [
      ['fondations/couleurs.html', 'Couleurs'],
      ['fondations/typographie.html', 'Typographie'],
      ['fondations/espacements.html', 'Espacements et mise en page'],
      ['fondations/formes.html', 'Formes, ombres, empilement'],
      ['fondations/mouvement.html', 'Mouvement'],
      ['fondations/redaction.html', 'Rédaction et messages'],
      ['fondations/identite.html', 'Identité des sites des bibliothèques'],
      ['fondations/icones.html', 'Icônes'],
      ['fondations/images.html', 'Images'],
      ['fondations/jetons.html', 'Utiliser les jetons'],
    ],
  },
  {
    titre: 'Composants',
    pages: [
      ['composants/index.html', 'Vue d’ensemble'],
      {
        titre: 'Services',
        pages: [
          ['composants/urgence.html', 'Urgence'],
          ['composants/avis.html', 'Avis'],
          ['composants/clavardage.html', 'Clavardage'],
          ['composants/retroaction.html', 'Rétroaction'],
          ['composants/consentement.html', 'Consentement'],
          ['composants/integration.html', 'Intégration tierce'],
        ],
      },
      {
        titre: 'Contenu',
        pages: [
          ['composants/alertes.html', 'Alertes'],
          ['composants/accordeons.html', 'Accordéons'],
          ['composants/chiffres.html', 'Chiffres clés'],
          ['composants/onglets.html', 'Onglets'],
          ['composants/citation.html', 'Citation'],
          ['composants/separateur.html', 'Séparateur'],
          ['composants/surface.html', 'Surface'],
          ['composants/modalites.html', 'Modalités'],
          ['composants/tableau.html', 'Tableau'],
          ['composants/video.html', 'Vidéo'],
        ],
      },
      {
        titre: 'Primitives',
        pages: [
          ['composants/bouton.html', 'Bouton'],
          ['composants/champ-liste.html', 'Champs et filtres'],
          ['composants/lien.html', 'Lien'],
        ],
      },
      {
        titre: 'Cartes et listes',
        pages: [
          ['composants/carte-icone.html', 'Carte à icône'],
          ['composants/carte-image.html', 'Carte à image'],
          ['composants/liste-liens.html', 'Liste de liens'],
          ['composants/carrousel.html', 'Carrousel'],
        ],
      },
      {
        titre: 'Mise en page',
        pages: [
          ['composants/section.html', 'Section'],
          ['composants/banniere.html', 'Bannière'],
          ['composants/colonne-decalee.html', 'Colonne décalée'],
          ['composants/icone-carree.html', 'Icône carrée'],
          ['composants/bande-image-texte.html', 'Bande image-texte'],
        ],
      },
      {
        titre: 'Navigation',
        pages: [
          ['composants/lien-evitement.html', 'Lien d’évitement'],
          ['composants/table-matieres.html', 'Table des matières'],
          ['composants/fil-ariane.html', 'Fil d’Ariane'],
          ['composants/entete.html', 'En-tête et menu'],
          ['composants/recherche.html', 'Recherche'],
          ['composants/navigation-secondaire.html', 'Navigation secondaire'],
          ['composants/retour-haut.html', 'Retour en haut'],
          ['composants/infobulle.html', 'Infobulle'],
        ],
      },
      {
        titre: 'Pied de page',
        pages: [
          ['composants/pied-de-page.html', 'Pied de page'],
          ['composants/sceau.html', 'Sceau des bibliothèques'],
          ['composants/licence.html', 'Licence'],
        ],
      },
    ],
  },
  {
    titre: 'Intégration',
    pages: [['sites/index.html', 'Suivi d’intégration']],
  },
  {
    titre: 'Hors catalogue',
    pages: [
      ['hors-catalogue/index.html', 'Non retenus'],
    ],
  },
]

/** Liste à plat des pages, dans l'ordre de lecture, avec leur chemin de groupes */
export function pagesAPlat(noeuds = NAVIGATION, parents = []) {
  const liste = []
  for (const n of noeuds) {
    if (Array.isArray(n)) liste.push({ chemin: n[0], titre: n[1], parents })
    else liste.push(...pagesAPlat(n.pages, [...parents, n.titre]))
  }
  return liste
}
