/*
 * Le paquet : chaque composant Astro de astro/ est exporté par package.json, chaque export
 * existe, chaque feuille importée par un composant est dans les fichiers publiés, et chaque
 * feuille de src/composants/ a son composant HTML documenté en tête.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const paquet = JSON.parse(readFileSync('package.json', 'utf8'))
const exports: Record<string, string> = paquet.exports

test('chaque composant Astro est exporté', () => {
  for (const f of readdirSync('astro').filter((f) => f.endsWith('.astro'))) {
    assert.ok(`./astro/${f}` in exports, `${f} n'est pas dans exports`)
  }
})

test('chaque export existe', () => {
  for (const [cle, chemin] of Object.entries(exports)) {
    if (cle.includes('*')) continue
    assert.ok(existsSync(chemin), `${cle} → ${chemin} est introuvable`)
  }
})

test('les feuilles importées par les composants sont publiées', () => {
  const dossiers: string[] = paquet.files
  for (const f of readdirSync('astro').filter((f) => f.endsWith('.astro'))) {
    for (const [, chemin] of readFileSync(`astro/${f}`, 'utf8').matchAll(/^import '\.\.\/(src\/[^']+\.css)'/gm)) {
      assert.ok(existsSync(chemin), `${f} importe ${chemin}, introuvable`)
      assert.ok(dossiers.some((d) => chemin.startsWith(d)), `${chemin} (importé par ${f}) n'est pas dans files`)
    }
  }
})

test('chaque feuille de src/composants/ commence par un commentaire', () => {
  for (const f of readdirSync('src/composants').filter((f) => f.endsWith('.css') && f !== 'tout.css')) {
    assert.match(readFileSync(`src/composants/${f}`, 'utf8'), /^\/\*/, `${f} n'a pas de commentaire d'en-tête`)
  }
})


test('les SVG des composants et de la marque sont distribués sans transformation', () => {
  for (const [dossier, prefixe] of [['src/composants', 'bib-'], ['src/marque', ''], ['src/marque-sites', '']]) {
    for (const f of readdirSync(dossier).filter((f) => f.endsWith('.svg'))) {
      const cible = `dist/${prefixe}${f}`
      assert.ok(existsSync(cible), `${cible} absent de la distribution`)
      assert.equal(readFileSync(cible, 'utf8'), readFileSync(`${dossier}/${f}`, 'utf8'), `${cible} diffère de sa source`)
    }
  }
})
