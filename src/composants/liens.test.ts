import { test } from 'node:test'
import assert from 'node:assert/strict'
import { analyserLien, lienCarte } from '../../astro/liens.ts'

test('les liens absolus sont analysés dans le site hôte, y compris Studio', () => {
  assert.equal(analyserLien('https://studio.bib.umontreal.ca/aide/', 'https://studio.bib.umontreal.ca').interne, true)
  assert.equal(analyserLien('https://bib.umontreal.ca/', 'https://studio.bib.umontreal.ca').interne, false)
  assert.equal(analyserLien('/aide/', 'https://studio.bib.umontreal.ca').interne, true)
  assert.equal(analyserLien('https://bib-pp.umontreal.ca/aide/').interne, true)
})

test('la carte annonce le PDF et le nouvel onglet, sans flèche contradictoire', () => {
  const pdf = lienCarte('/rapport.pdf')
  assert.equal(pdf.cible, '_blank')
  assert.equal(pdf.afficherFleche, false)
  assert.match(pdf.annonce, /PDF, nouvel onglet/)
  assert.equal(lienCarte('/aide/', '_blank').externe, true)
  assert.equal(lienCarte('mailto:aide@umontreal.ca').afficherFleche, false)
  assert.equal(analyserLien('/recherche?q=rapport.pdf').pdf, false)
  assert.equal(analyserLien('mailto:aide@umontreal.ca?subject=rapport.pdf').pdf, false)
  assert.equal(analyserLien('/rapport.PDF?download=1#page=2').pdf, true)
  assert.equal(lienCarte('/aide/', undefined, 'author').rel, 'author')
})
