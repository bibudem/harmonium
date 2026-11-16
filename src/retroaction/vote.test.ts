import { test } from 'node:test'
import assert from 'node:assert/strict'
import { donneesVote } from './vote.ts'

// Sans navigateur : une adresse de page factice
globalThis.window = { top: { location: { href: 'https://bib.umontreal.ca/page/?q=recherche&jeton=abc#section' } } } as never
globalThis.location = { href: 'https://bib.umontreal.ca/cadre/' } as never

test('structure attendue par LibWizard (insertSubmission)', () => {
  const d = donneesVote('guid-123', 'oui', 'Très utile', new Date('2026-11-15T15:04:05Z'))
  assert.deepEqual(Object.keys(d), ['formId', 'flags', 'collectIP', 'collectBrowser', 'collectRefer', 'isPreview', 'guid', 'data', 'arrive', 'referrer'])
  assert.equal(d.formId, 43176)
  assert.equal(d.guid, 'guid-123')
  assert.deepEqual(
    d.data.map((c) => [c.fieldId, c.type, c.data]),
    [
      [1570387, 'control_radio', 'oui'],
      [1570390, 'control_multi', 'Très utile'],
    ],
  )
  assert.equal(d.arrive, '2026-11-15 10:04:05', 'heure de Montréal (HNE)')
  assert.equal(d.referrer, 'https://bib.umontreal.ca/page/?q=recherche&jeton=abc#section', 'adresse complète')
})

test('heure de Montréal à l’heure avancée (HAE)', () => {
  assert.equal(donneesVote('g', 'oui', '', new Date('2026-07-01T16:00:00Z')).arrive, '2026-07-01 12:00:00')
})

test('cadre d’une autre origine : adresse du cadre lui-même', () => {
  globalThis.window = {
    get top(): never {
      throw new Error('SecurityError')
    },
  } as never
  assert.equal(donneesVote('g', 'non', '').referrer, 'https://bib.umontreal.ca/cadre/')
})
