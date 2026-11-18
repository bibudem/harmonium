/*
 * Petits outils de style des composants Astro d'Harmonium (usage interne, non exporté).
 *
 * Le contenu converti
 * passe `style` en chaîne ou en objet, et les composants y ajoutent leurs variables.
 * Tout est fusionné en une seule chaîne pour l'attribut.
 */

type ValeurStyle = string | number | undefined | null | false
export type Style = string | Record<string, ValeurStyle> | undefined | null

// Propriétés numériques qui restent sans unité
const SANS_UNITE = new Set(['flex', 'flex-grow', 'flex-shrink', 'opacity', 'order', 'z-index', 'font-weight', 'line-height', 'zoom'])

function enKebab(cle: string) {
  return cle.startsWith('--') ? cle : cle.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

function versCss(style: Style): string {
  if (!style) return ''
  if (typeof style === 'string') return style.trim().replace(/;?$/, style.trim() ? ';' : '')
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
    .map(([cle, v]) => {
      const prop = enKebab(cle)
      const valeur = typeof v === 'number' && !prop.startsWith('--') && !SANS_UNITE.has(prop) ? `${v}px` : String(v)
      return `${prop}:${valeur};`
    })
    .join('')
}

/** Fusionne plusieurs styles ; le dernier l'emporte (le `style` de l'auteur) */
export function fusionnerStyles(...styles: Style[]): string | undefined {
  const css = styles.map(versCss).join('')
  return css || undefined
}

/** Réunit les classes passées au composant (vides ignorées) */
export function classes(...valeurs: unknown[]): string | undefined {
  const liste = valeurs.filter((v): v is string => typeof v === 'string' && v.trim() !== '')
  return liste.length ? liste.join(' ') : undefined
}

export const POINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type Point = (typeof POINTS)[number]
export type Responsive<T> = T | Partial<Record<Point, T>>

/** Espacement : un nombre vaut un pas de l'échelle (0,5 rem) ; une chaîne CSS passe telle quelle */
export function espacement(valeur: ValeurStyle): string | undefined {
  if (valeur === undefined || valeur === null || valeur === false || valeur === '') return undefined
  if (typeof valeur === 'number') return `calc(${valeur} * var(--espace-1))`
  return /^-?\d*\.?\d+$/.test(valeur) ? `calc(${Number(valeur)} * var(--espace-1))` : valeur
}

/** Ramène une valeur responsive à un objet { point: valeur } */
export function parPoint<T>(valeur: Responsive<T> | undefined): Partial<Record<Point, T>> {
  if (valeur === undefined || valeur === null) return {}
  if (typeof valeur === 'object' && !Array.isArray(valeur)) {
    const resultat: Partial<Record<Point, T>> = {}
    for (const p of POINTS) if (p in (valeur as object)) resultat[p] = (valeur as Record<Point, T>)[p]
    return resultat
  }
  return { xs: valeur as T }
}
