/*
 * Les fiches décrivent l'API Astro telle qu'elle est : chaque propriété et chaque slot d'un tableau
 * « Propriété » existe dans les composants importés par l'exemple qui le précède, et aucune
 * valeur anglaise d'avant la francisation n'y reste.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const ASTRO = new URL('../../astro/', import.meta.url)
const FICHES = new URL('../../site/pages/composants/', import.meta.url)

// Attributs HTML transmis tels quels et propriétés communes à tous les composants
const COMMUNES = new Set(['class', 'style', 'id', 'href', 'target', 'rel', 'type', 'title', 'lang', 'name', 'disabled', 'required', 'placeholder', 'scope', 'colSpan', 'rowSpan'])
// Valeurs et noms anglais retirés de l'API ; un exemple qui les montre est périmé
const ANGLAIS = /`(small|medium|large|default|left|right|center|primary|secondary|contained|outlined|offset|hover|gap|subTitle|align|component|severity|className|sx|to)`/

async function lireComposants() {
  const composants = new Map()
  for (const fichier of (await readdir(ASTRO)).filter((f) => f.endsWith('.astro'))) {
    const source = await readFile(new URL(fichier, ASTRO), 'utf8')
    const corps = source.match(/interface Props[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? ''
    const proprietes = new Set([...corps.matchAll(/^\s+['"]?([\w-]+)['"]?\??\s*:/gm)].map((m) => m[1]))
    const slots = new Set([...source.matchAll(/<slot name="([\w-]+)"|slots\.(?:has|render)\(['"]([\w-]+)['"]\)/g)].map((m) => m[1] ?? m[2]))
    composants.set(fichier.replace('.astro', ''), { proprietes, slots })
  }
  return composants
}

/** Pour chaque tableau « Propriété » : les composants importés par le dernier bloc Astro qui le précède */
function tableaux(md) {
  const lignes = md.split('\n')
  const resultats = []
  let importes = []
  let dansCode = false
  for (let i = 0; i < lignes.length; i++) {
    const ligne = lignes[i]
    if (ligne.startsWith('```')) {
      dansCode = !dansCode
      if (dansCode) importes = []
      continue
    }
    if (dansCode) {
      for (const m of ligne.matchAll(/harmonium\/astro\/(\w+)\.astro/g)) importes.push(m[1])
      continue
    }
    if (/^## /.test(ligne)) importes = []
    if (/^\|\s*`?Propriété/.test(ligne) && importes.length) {
      const rangees = []
      for (let j = i + 2; j < lignes.length && lignes[j].startsWith('|'); j++) rangees.push({ numero: j + 1, cellules: lignes[j].split('|').slice(1, -1) })
      resultats.push({ importes: [...importes], rangees })
    }
  }
  return resultats
}

test('les tableaux de propriétés des fiches correspondent aux composants Astro', async () => {
  const composants = await lireComposants()
  const erreurs = []
  for (const fiche of (await readdir(FICHES)).filter((f) => f.endsWith('.md'))) {
    const md = await readFile(new URL(fiche, FICHES), 'utf8')
    for (const { importes, rangees } of tableaux(md)) {
      const connus = importes.map((nom) => composants.get(nom)).filter(Boolean)
      if (connus.length !== importes.length) erreurs.push(`${fiche} : composant importé inconnu (${importes.join(', ')})`)
      const proprietes = new Set(connus.flatMap((c) => [...c.proprietes]))
      const slots = new Set(connus.flatMap((c) => [...c.slots]))
      for (const { numero, cellules } of rangees) {
        const [nom, ...reste] = cellules
        if (ANGLAIS.test(reste.join('|'))) erreurs.push(`${fiche}:${numero} : valeur anglaise retirée (${reste.join('|').match(ANGLAIS)[1]})`)
        const noms = nom.replace(/[`*]/g, '').split(/,| et /).map((n) => n.trim()).filter(Boolean)
        if (/^slots?$/.test(noms[0] ?? '')) {
          for (const [, s] of (reste[0] ?? '').matchAll(/`([\w-]+)`/g)) if (!slots.has(s)) erreurs.push(`${fiche}:${numero} : slot « ${s} » absent de ${importes.join(', ')}`)
          continue
        }
        for (const n of noms) {
          if (!/^[A-Za-z][\w-]*$/.test(n)) continue // « autres attributs », etc.
          if (!proprietes.has(n) && !COMMUNES.has(n)) erreurs.push(`${fiche}:${numero} : propriété « ${n} » absente de ${importes.join(', ')}`)
        }
      }
    }
  }
  assert.deepEqual(erreurs, [])
})

test('les exemples Astro des fiches n’utilisent plus de nom anglais retiré', async () => {
  const erreurs = []
  const retire = /\s(Image|offset|hover|gap|small|niveau|lien|url|fond)=|slot="(title|subTitle|footer)"|from 'harmonium\/astro\/…'|^import 'harmonium\/dist\/[^']+\.js'/m
  for (const fiche of (await readdir(FICHES)).filter((f) => f.endsWith('.md'))) {
    const md = await readFile(new URL(fiche, FICHES), 'utf8')
    for (const [, bloc] of md.matchAll(/```[a-z]*\n(---\n[\s\S]*?)```/g)) {
      if (!bloc.includes('harmonium/astro/')) continue
      for (const ligne of bloc.split('\n')) if (retire.test(ligne) && !/<(SceauBibliotheques|Pagination)\b/.test(ligne)) erreurs.push(`${fiche} : ${ligne.trim()}`)
    }
  }
  assert.deepEqual(erreurs, [])
})

test('les propriétés et les slots suivent le vocabulaire commun', async () => {
  // Un seul nom par notion : niveauTitre, href, image, couleur (teinte du composant), decalage
  const SYNONYMES = { niveau: 'niveauTitre', lien: 'href', url: 'href', Image: 'image', fond: 'couleur', offset: 'decalage' }
  // Exceptions motivées : `fond` du sceau = le fond sur lequel il est posé ; `url` des onglets (booléen)
  // et de la pagination (modèle d'adresse) ne sont pas des liens
  const EXCEPTIONS = new Set(['SceauBibliotheques.fond', 'Onglets.url', 'Pagination.url'])
  const ANGLAIS_PROPS = new Set(['small', 'medium', 'large', 'hover', 'gap', 'variant', 'color', 'size', 'label', 'align', 'component', 'severity', 'children', 'open', 'selected', 'subTitle', 'className', 'sx'])
  const ANGLAIS_SLOTS = new Set(['title', 'subTitle', 'footer', 'header', 'actions-end'])
  const erreurs = []
  for (const [nom, { proprietes, slots }] of await lireComposants()) {
    for (const p of proprietes) {
      if (SYNONYMES[p] && !EXCEPTIONS.has(`${nom}.${p}`)) erreurs.push(`${nom} : « ${p} » → « ${SYNONYMES[p]} »`)
      if (ANGLAIS_PROPS.has(p)) erreurs.push(`${nom} : propriété anglaise « ${p} »`)
    }
    for (const s of slots) if (ANGLAIS_SLOTS.has(s)) erreurs.push(`${nom} : slot anglais « ${s} »`)
  }
  assert.deepEqual(erreurs, [])
})
