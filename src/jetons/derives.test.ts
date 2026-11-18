import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Les nuances dérivées de la palette suivent une seule règle : éclaircir = mélange avec le
// blanc (le nombre est la part de la couleur) ; assombrir = 30 % de noir (suffixe -fonce).
const css = readFileSync(new URL('./jetons.css', import.meta.url), 'utf8')
const valeur = (nom: string): string => {
  const m = css.match(new RegExp(`--${nom}:\\s*(#[0-9a-f]{3,6})`, 'i'))
  assert.ok(m, `--${nom} absent ou sans valeur hexadécimale`)
  const h = m[1].slice(1)
  return h.length === 3 ? [...h].map((c) => c + c).join('') : h.toLowerCase()
}
const melange = (hex: string, part: number, avec: number): string =>
  [0, 2, 4]
    .map((i) => Math.round(avec + (parseInt(hex.slice(i, i + 2), 16) - avec) * part).toString(16).padStart(2, '0'))
    .join('')

const ECLAIRCIES: [string, string, number][] = [
  ['bleu-20', 'bleu-principal', 0.2],
  ['rose-50', 'rose', 0.5],
  ['rouge-orange-40', 'rouge-orange', 0.4],
  ['jaune-40', 'jaune', 0.4],
  ['vert-20', 'vert', 0.2],
  ['orange-30', 'orange', 0.3],
]
const ASSOMBRIES: [string, string][] = [
  ['bleu-principal-fonce', 'bleu-principal'],
  ['rouge-orange-fonce', 'rouge-orange'],
]

for (const [nom, source, part] of ECLAIRCIES) {
  test(`--${nom} = --${source} à ${part * 100} % dans du blanc`, () => {
    assert.equal(valeur(nom), melange(valeur(source), part, 255))
  })
}

for (const [nom, source] of ASSOMBRIES) {
  test(`--${nom} = --${source} et 30 % de noir`, () => {
    assert.equal(valeur(nom), melange(valeur(source), 0.7, 0))
  })
}

test('--bleu-10 garde la valeur officielle « Bleu 10 % », à un point près de la règle', () => {
  const ecart = [0, 2, 4].map((i) => Math.abs(parseInt(valeur('bleu-10').slice(i, i + 2), 16) - parseInt(melange(valeur('bleu-principal'), 0.1, 255).slice(i, i + 2), 16)))
  assert.ok(Math.max(...ecart) <= 1)
})

// Échelles typographiques : texte au rapport 1,125 ; titres au rapport 1,2 (mobile) et 1,25 (dès 900 px)
const rem = (nom: string, bloc = css): number => {
  const m = bloc.match(new RegExp(`--${nom}:\\s*([\\d.]+)rem`))
  assert.ok(m, `--${nom} absent`)
  return Number(m[1])
}
const pres = (a: number, b: number) => assert.ok(Math.abs(a - b) < 0.002, `${a} ≠ ${b.toFixed(3)}`)

test('texte : rapport 1,125 autour de 1 rem', () => {
  const pas = { minuscule: -2, petit: -1, courant: 0, moyen: 1, grand: 2, 'tres-grand': 3 }
  for (const [nom, n] of Object.entries(pas)) pres(rem(`texte-${nom}`), 1.125 ** n)
})

test('titres : rapport 1,2 sur mobile, 1,25 dès 900 px ; l’affiche prolonge l’échelle', () => {
  const large = css.slice(css.indexOf('@media (width >= 900px)'))
  for (let h = 6; h >= 1; h--) {
    pres(rem(`titre-${h}`), 1.2 ** (6 - h))
    if (h < 6) pres(rem(`titre-${h}`, large), 1.25 ** (6 - h))
  }
  pres(rem('affiche-2'), 1.2 ** 5)
  pres(rem('affiche-1'), 1.2 ** 6)
  pres(rem('affiche-2', large), 1.25 ** 6)
  pres(rem('affiche-1', large), 1.25 ** 7)
})
