/*
 * Identifiants uniques pour les composants Astro d'Harmonium (usage interne, non exporté) :
 * un compteur par préfixe, remis à zéro à chaque construction.
 */
const compteurs = new Map<string, number>()

export function idUnique(prefixe: string): string {
  const n = (compteurs.get(prefixe) ?? 0) + 1
  compteurs.set(prefixe, n)
  return `${prefixe}-${n}`
}
