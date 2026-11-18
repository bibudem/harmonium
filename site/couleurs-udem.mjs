/*
 * Palette officielle de l'Université de Montréal et statut de chaque couleur des jetons.
 *
 * Source : guide de marque https://marque.umontreal.ca/ (section 2.3.4 « Couleurs ») et son
 * nuancier téléchargeable (udem_couleurs_biblio_adobe.zip : bibliothèques Adobe RVB et CMJN),
 * consultés le 15 novembre 2026. À mettre à jour si le guide change.
 */

export const SOURCE = {
  url: 'https://marque.umontreal.ca/',
  consulte: '15 novembre 2026',
}

/** Les sept couleurs de la palette officielle (2 dominantes, 5 secondaires), plus les neutres du nuancier */
export const OFFICIELLES = [
  { nom: 'Bleu principal', hex: '#0057ac', rvb: '0, 87, 172', cmjn: 'C100 M56 J0 N0', pantone: 'PMS 293', categorie: 'dominante', jeton: '--bleu-principal' },
  { nom: 'Bleu foncé', hex: '#0b113a', rvb: '11, 17, 58', cmjn: 'C100 M80 J0 N60', categorie: 'dominante', jeton: '--bleu-fonce' },
  { nom: 'Rose', hex: '#fee1de', rvb: '254, 225, 222', cmjn: 'C0 M13 J7 N0', categorie: 'secondaire', jeton: '--rose' },
  { nom: 'Orangé', hex: '#f04e24', rvb: '240, 78, 36', cmjn: 'C0 M78 J81 N0', categorie: 'secondaire', jeton: '--rouge-orange' },
  { nom: 'Jaune', hex: '#ffca40', rvb: '255, 202, 64', cmjn: 'C0 M21 J85 N0', categorie: 'secondaire', jeton: '--jaune' },
  { nom: 'Vert', hex: '#52b782', rvb: '82, 183, 130', cmjn: 'C70 M0 J65 N0', categorie: 'secondaire', jeton: '--vert' },
  { nom: 'Vert foncé', hex: '#024244', rvb: '2, 66, 68', cmjn: 'C100 M0 J30 N70', categorie: 'secondaire', jeton: '--vert-fonce' },
  { nom: 'Bleu 10 %', hex: '#e5eef7', rvb: '229, 238, 247', cmjn: 'C10 M6 J0 N0', categorie: 'fond', jeton: '--bleu-10' },
  { nom: 'Blanc', hex: '#ffffff', rvb: '255, 255, 255', cmjn: 'C0 M0 J0 N0', categorie: 'neutre', jeton: '--blanc' },
  { nom: 'Noir', hex: '#000000', rvb: '0, 0, 0', cmjn: 'N100', categorie: 'neutre', jeton: '--noir' },
]

/** Règles du guide de marque (citées) */
export const REGLES = [
  'La palette comprend deux couleurs dominantes et cinq couleurs secondaires ; les secondaires sont des couleurs d’accent, à utiliser avec parcimonie.',
  'Toute communication doit contenir le bleu principal.',
  'Les couleurs secondaires s’utilisent en duo et sont toujours accompagnées du bleu principal ; une couleur d’accent n’est jamais la couleur principale d’une communication.',
  'Le fond principal est toujours blanc, bleu principal ou bleu foncé ; le bleu principal à 10 % peut remplacer le blanc comme fond.',
  'Le logo : bleu principal (Pantone 293) ou noir ; en blanc sur un fond foncé.',
  'Numérique : les combinaisons de couleurs respectent au minimum WCAG AA ; AAA est l’objectif.',
]

/*
 * Statut de chaque couleur de la palette des jetons :
 *   officielle   même valeur que le nuancier de l'UdeM
 *   ecart        correspond à une couleur officielle, avec une valeur légèrement différente
 *   derivee      nuance construite à partir d'une couleur officielle (survol, fond pâle, texte lisible)
 *   complement   couleur hors palette officielle, ajoutée pour un besoin précis
 *   neutre       gris et blancs d'interface
 */
export const STATUTS = {
  officielle: ['Officielle UdeM', 'Même valeur que le nuancier de l’UdeM.'],
  ecart: ['Officielle, valeur à corriger', 'Correspond à une couleur officielle, avec une valeur légèrement différente.'],
  derivee: ['Dérivée', 'Nuance construite à partir d’une couleur officielle : survol, fond pâle, texte assez contrasté.'],
  complement: ['Complémentaire', 'Hors palette officielle, ajoutée pour un besoin précis des bibliothèques.'],
  neutre: ['Neutre', 'Gris et blancs d’interface.'],
}

/** Famille et statut de chaque jeton de la palette (dans l'ordre d'affichage) */
export const FAMILLES = [
  {
    titre: 'Bleus',
    couleurs: [
      ['--bleu-principal', 'officielle', 'Bleu principal'],
      ['--bleu-principal-fonce', 'derivee', 'Bleu principal et 30 % de noir : survol des liens.'],
      ['--bleu-fonce', 'officielle', 'Bleu foncé'],
      ['--bleu-20', 'derivee', 'Bleu principal à 20 % : alerte info, teinte forte.'],
      ['--bleu-10', 'officielle', 'Bleu 10 %'],
    ],
  },
  {
    titre: 'Roses et rouges orangés',
    couleurs: [
      ['--rose', 'officielle', 'Rose'],
      ['--rose-50', 'derivee', 'Rose à 50 % : fond teinté.'],
      ['--rouge-orange', 'officielle', 'Orangé'],
      ['--rouge-orange-40', 'derivee', 'Rouge orangé à 40 % : bandes et pastilles.'],
      ['--rouge-orange-fonce', 'derivee', 'Rouge orangé et 30 % de noir : texte d’accent, 4,5:1 sur tous les fonds clairs.'],
      ['--rouge', 'complement', 'Erreurs : texte, icône et bordure.'],
    ],
  },
  {
    titre: 'Jaunes et oranges',
    couleurs: [
      ['--jaune', 'officielle', 'Jaune'],
      ['--jaune-40', 'derivee', 'Jaune à 40 % : fond des avis, actions douces.'],
      ['--orange', 'complement', 'Orange plus chaud que le rouge orangé : bandes de couleur.'],
      ['--orange-30', 'derivee', 'Orange à 30 % : fond des avertissements.'],
    ],
  },
  {
    titre: 'Verts',
    couleurs: [
      ['--vert', 'officielle', 'Vert'],
      ['--vert-20', 'derivee', 'Vert à 20 % : fond des succès.'],
      ['--vert-fonce', 'officielle', 'Vert foncé'],
    ],
  },
  {
    titre: 'Neutres',
    couleurs: [
      ['--blanc', 'officielle', 'Blanc'],
      ['--gris-50', 'neutre', 'Fond des pages.'],
      ['--gris-100', 'neutre', 'Fond désactivé.'],
      ['--gris-200', 'neutre', ''],
      ['--gris-300', 'neutre', 'Bordures décoratives.'],
      ['--gris-400', 'neutre', ''],
      ['--gris-500', 'neutre', 'Contours d’éléments interactifs, texte désactivé.'],
      ['--gris-600', 'neutre', 'Texte secondaire.'],
      ['--gris-700', 'neutre', 'Texte neutre fort.'],
      ['--noir', 'officielle', 'Noir (voile posé sur les photos)'],
    ],
  },
]
