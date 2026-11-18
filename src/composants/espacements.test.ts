import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'

// Marges, retraits et écarts des composants : un pas de l'échelle (--espace-*) ou un rôle, jamais
// une valeur en dur. Exceptions admises : 3 px au plus (compensation d'une bordure), les em (relatifs
// au texte), les calculs (calc, env) et une ligne marquée « hors échelle » avec sa raison.
const DOSSIERS = ['src/composants', 'src/alertes']
const PROPRIETE = /^\s*(padding|margin|gap|row-gap|column-gap|padding-[a-z-]+|margin-[a-z-]+)\s*:\s*([^;{}]+);(.*)$/
const LONGUEUR = /(?<![\w.(-])(\d*\.?\d+)(px|rem)\b/g

test('les espacements des composants viennent de l’échelle', () => {
  const fautes: string[] = []
  for (const dossier of DOSSIERS) {
    for (const nom of readdirSync(dossier).filter((f) => f.endsWith('.css'))) {
      let commentaire = false
      readFileSync(`${dossier}/${nom}`, 'utf8').split('\n').forEach((ligne, i) => {
        const debut = ligne.trim()
        if (commentaire || debut.startsWith('/*') || debut.startsWith('*')) {
          commentaire = (commentaire || debut.startsWith('/*')) && !ligne.includes('*/')
          return
        }
        const m = ligne.match(PROPRIETE)
        if (!m || /calc\(|env\(/.test(m[2]) || /!important|hors échelle/.test(m[3])) return
        for (const [, valeur, unite] of m[2].matchAll(LONGUEUR)) {
          const px = unite === 'px' ? Number(valeur) : Number(valeur) * 16
          if (px > 3) fautes.push(`${dossier}/${nom}:${i + 1} ${ligne.trim()}`)
        }
      })
    }
  }
  assert.deepEqual(fautes, [])
})

// Couleurs, graisses, tailles de texte et empilement : toujours un jeton. Une valeur de repli après
// un jeton (var(--x, #fff)) est permise ; « hors échelle » marque une exception justifiée.
const INTERDITS: [string, RegExp][] = [
  ['couleur', /#[0-9a-f]{3,8}\b|rgba?\(\s*\d/i],
  ['graisse', /font-weight:\s*\d/],
  ['taille de texte', /font-size:\s*[\d.]+(px|rem)/],
  ['empilement', /z-index:\s*-?[1-9]/],
]

test('couleurs, graisses, tailles de texte et empilement des composants viennent des jetons', () => {
  const fautes: string[] = []
  for (const dossier of DOSSIERS) {
    for (const nom of readdirSync(dossier).filter((f) => f.endsWith('.css'))) {
      let commentaire = false
      readFileSync(`${dossier}/${nom}`, 'utf8').split('\n').forEach((ligne, i) => {
        const debut = ligne.trim()
        if (commentaire || debut.startsWith('/*') || debut.startsWith('*')) {
          commentaire = (commentaire || debut.startsWith('/*')) && !ligne.includes('*/')
          return
        }
        if (/hors échelle|forced-colors/.test(ligne)) return
        // Retire les replis var(--x, valeur) et les commentaires de fin de ligne
        const code = ligne.replace(/\/\*.*?\*\//g, '').replace(/var\(--[\w-]+,[^()]*(\([^()]*\))?[^()]*\)/g, '')
        for (const [genre, motif] of INTERDITS) if (motif.test(code)) fautes.push(`${genre} — ${dossier}/${nom}:${i + 1} ${debut}`)
      })
    }
  }
  assert.deepEqual(fautes, [])
})
