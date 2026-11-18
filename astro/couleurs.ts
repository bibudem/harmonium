/*
 * Couleurs passées aux composants Astro, vers les jetons d'Harmonium (usage interne).
 *
 * `couleurPalette` lit un nom de la palette, en camelCase (`bleuPrincipal`, `rougeOrange40`) :
 * fonds et icônes des cartes. `couleurTheme` lit une couleur de texte : un rôle (`texte`,
 * `texte-secondaire`, `accent`, `sur-fonce`) ou un nom de la palette ; le rouge orangé passe alors
 * par sa variante lisible. Une autre valeur (`'#fff'`) passe telle quelle.
 */

// Couleurs de la palette (src/jetons/jetons.css)
const JETONS = new Set([
  'bleu-principal', 'bleu-principal-fonce', 'bleu-fonce', 'bleu-10', 'bleu-20',
  'rose', 'rose-50', 'rouge-orange', 'rouge-orange-40', 'orange', 'orange-30',
  'jaune', 'jaune-40', 'vert', 'vert-20', 'vert-fonce', 'blanc',
])

const versJeton = (nom: string) => nom.replace(/([A-Z])/g, '-$1').replace(/(\d+)/, '-$1').toLowerCase()

export function couleurPalette(nom: string | undefined): string | undefined {
  if (!nom) return undefined
  const jeton = versJeton(nom)
  return JETONS.has(jeton) ? `var(--${jeton})` : nom
}

const ROLES: Record<string, string> = {
  texte: 'var(--couleur-texte)',
  'texte-secondaire': 'var(--couleur-texte-secondaire)',
  accent: 'var(--couleur-accent)',
  'sur-fonce': 'var(--couleur-sur-fonce)',
  herite: 'inherit',
  rougeOrange: 'var(--couleur-texte-accent)',
}

export function couleurTheme(nom: string | undefined): string | undefined {
  if (!nom) return undefined
  return ROLES[nom] ?? couleurPalette(nom)
}
