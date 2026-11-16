/*
 * Lecture de src/jetons/jetons.css pour les pages « Fondations » : chaque jeton avec sa
 * valeur, son contexte (base, ≥ 900 px, ≥ 1200 px, couleurs), son groupe
 * (commentaire « ---- Groupe ---- ») et le commentaire qui le précède.
 */
import { readFile } from 'node:fs/promises'

const CONTEXTES = [
  [/^:root$/, 'base'],
  [/width >= 900px/, 'base900'],
  [/width >= 1200px/, 'base1200'],
  [/theme-clair/, 'clair'],
]

export async function lireJetons(fichier = new URL('../src/jetons/jetons.css', import.meta.url)) {
  const css = await readFile(fichier, 'utf8')
  const jetons = { base: [], base900: [], base1200: [], clair: [] }
  // Blocs de premier niveau, éventuellement dans un @media
  const re = /(@media[^{]+)?\{?\s*([^{}@]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(css))) {
    const selecteur = `${m[1] ?? ''} ${m[2]}`.replace(/\/\*[\s\S]*?\*\//g, '').trim()
    const contexte = CONTEXTES.find(([r]) => r.test(selecteur))?.[1]
    if (!contexte) continue
    let groupe = ''
    let commentaire = ''
    for (const morceau of m[3].matchAll(/\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]+);/g)) {
      if (morceau[1] !== undefined) {
        const texte = morceau[1].replace(/\s*\n\s*/g, ' ').trim()
        const titre = texte.match(/^-{2,}\s*(.+?)\s*-{2,}\s*(.*)$/)
        if (titre) {
          groupe = titre[1]
          commentaire = titre[2]
        } else commentaire = commentaire ? `${commentaire} ${texte}` : texte
        continue
      }
      jetons[contexte].push({ nom: morceau[2], valeur: morceau[3].trim(), groupe, commentaire })
      commentaire = ''
    }
  }
  return jetons
}

/** Valeur finale d'un jeton (var() résolus) dans la palette */
export function resoudre(jetons, valeur, profondeur = 0) {
  if (profondeur > 10) return valeur
  return valeur.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (_, nom, repli) => {
    const source = [...jetons.clair, ...jetons.base]
    const j = source.find((x) => x.nom === nom)
    return j ? resoudre(jetons, j.valeur, profondeur + 1) : (repli ?? `var(${nom})`)
  })
}

/** Luminance relative et contraste WCAG (couleurs #rgb ou #rrggbb seulement) */
function luminance(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const estHex = (v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)
export function contraste(a, b) {
  if (!estHex(a) || !estHex(b)) return null
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
