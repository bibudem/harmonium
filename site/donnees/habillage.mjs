/*
 * Variables d'habillage de chaque composant (--bib-*), relevées dans sa feuille : nom, valeur par
 * défaut (le repli de var()) et ce qu'elle règle (propriété et élément). Le tableau de chaque fiche
 * ({{habillage-<nom>}}) suit ainsi le code : une variable ajoutée est documentée d'office.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { c, echapper, tableau } from '../outils.mjs'

const DOSSIER = new URL('../../src/composants/', import.meta.url)

/** Argument de var() jusqu'à sa parenthèse fermante (les var() imbriqués compris) */
function repli(css, debut) {
  let profondeur = 1
  for (let i = debut; i < css.length; i++) {
    if (css[i] === '(') profondeur++
    else if (css[i] === ')' && --profondeur === 0) return css.slice(debut, i)
  }
  return ''
}

function declarations(css) {
  const liste = []
  for (const regle of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selecteur = regle[1].trim().split(',')[0].trim()
    const variante = selecteur.match(/--([\w-]+)/)?.[1]
    const element = selecteur.match(/__([\w-]+)/)?.[1]?.replace(/-/g, ' ') ?? (variante ? `variante ${variante}` : 'composant')
    for (const decl of regle[2].split(';')) {
      const [prop, ...reste] = decl.split(':')
      if (reste.length) liste.push({ prop: prop.trim(), valeur: reste.join(':'), element })
    }
  }
  return liste
}

function variables(fichier) {
  const css = readFileSync(new URL(fichier, DOSSIER), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  const decls = declarations(css)
  // Une variable privée (--_x) relaie souvent la variable publique : on dit où elle sert
  const usage = (prop, element) => {
    if (!prop.startsWith('--_')) return `${prop} (${element})`
    const relais = decls.find((d) => !d.prop.startsWith('--') && d.valeur.includes(`var(${prop})`))
    return relais ? `${relais.prop} (${relais.element})` : `${prop} (${element})`
  }
  const vues = new Map()
  for (const { prop, valeur, element } of decls) {
    for (const m of valeur.matchAll(/var\((--bib-[\w-]+)\s*(,)?/g)) {
      const nom = m[1]
      if (vues.has(nom)) continue
      const defaut = m[2] ? repli(valeur, m.index + m[0].length).trim() : ''
      vues.set(nom, { defaut, regle: usage(prop, element) })
    }
  }
  return vues
}

export function donneesHabillage() {
  const donnees = {}
  for (const f of readdirSync(DOSSIER).filter((f) => f.endsWith('.css') && f !== 'tout.css')) {
    const vues = variables(f)
    const nom = f.replace(/\.css$/, '')
    donnees[`habillage-${nom}`] = vues.size
      ? tableau(['Variable', 'Par défaut', 'Règle'], [...vues].sort(([a], [b]) => a.localeCompare(b)).map(([v, { defaut, regle }]) => [c(v), defaut ? c(defaut) : '—', echapper(regle)]))
      : '<p>Ce composant n’a pas de variable d’habillage : il suit les jetons du site.</p>'
  }
  return donnees
}
