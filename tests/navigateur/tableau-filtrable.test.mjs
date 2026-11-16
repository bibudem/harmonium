import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-champ-liste.min.css"><link rel="stylesheet" href="/dist/bib-tableau.min.css"><link rel="stylesheet" href="/dist/bib-tableau-filtrable.min.css">'
const SCRIPT = [{ fichier: 'bib-tableau-filtrable.min.js' }]
const ligne = (nom, cat, periodes) => `<tr data-nom="${nom}" data-categorie="${cat}" data-periodes='${JSON.stringify(periodes)}'><th scope="row">${nom}</th><td>${cat}</td></tr>`
const TABLEAU = `
<div class="bib-tableau-filtrable" data-tableau-filtrable data-unite="fonds ou collection" data-unites="fonds et collections" data-vide="Aucun fonds.">
  <form data-filtres>
    <select id="p" data-filtre="periodes"><option value="">Toutes</option><option>Moyen Âge</option><option>20e siècle</option></select>
    <select id="c" data-filtre="categorie"><option value="">Toutes</option><option>Droit</option><option>Art</option></select>
  </form>
  <p role="status" data-statut>3 fonds et collections</p>
  <table><thead><tr><th scope="col"><button type="button" data-tri="nom">Nom</button></th><th scope="col"><button type="button" data-tri="categorie">Catégorie</button></th></tr></thead>
  <tbody data-corps>${ligne('Beta', 'Droit', ['Moyen Âge', '20e siècle'])}${ligne('Alpha', 'Art', ['20e siècle'])}${ligne('Gamma', 'Droit', ['Moyen Âge'])}</tbody></table>
  <p hidden data-aucun>Aucun fonds.</p>
</div>`
const visibles = (page) => page.$$eval('tbody tr:not([hidden]) th', (e) => e.map((x) => x.textContent))

test('filtre par période (tableau JSON) puis par catégorie, compte annoncé', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + TABLEAU })
  await page.selectOption('#p', 'Moyen Âge')
  assert.deepEqual(await visibles(page), ['Beta', 'Gamma'])
  assert.equal(await page.textContent('[data-statut]'), '2 fonds et collections')
  await page.selectOption('#c', 'Art')
  assert.deepEqual(await visibles(page), [])
  assert.equal(await page.textContent('[data-statut]'), 'Aucun fonds.')
  assert.equal(await page.evaluate(() => document.querySelector('[data-aucun]').hidden), false)
  await page.selectOption('#p', '')
  await page.selectOption('#c', '')
  assert.equal(await page.textContent('[data-statut]'), '3 fonds et collections')
})

test('tri : croissant, décroissant, ordre d’origine ; aria-sort sur l’en-tête', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + TABLEAU })
  const tri = async () => [await visibles(page), await page.getAttribute('thead th:first-child', 'aria-sort')]
  await page.click('[data-tri="nom"]')
  assert.deepEqual(await tri(), [['Alpha', 'Beta', 'Gamma'], 'ascending'])
  await page.click('[data-tri="nom"]')
  assert.deepEqual(await tri(), [['Gamma', 'Beta', 'Alpha'], 'descending'])
  await page.click('[data-tri="nom"]')
  assert.deepEqual(await tri(), [['Beta', 'Alpha', 'Gamma'], null])
  await page.click('[data-tri="categorie"]')
  assert.equal(await page.getAttribute('thead th:first-child', 'aria-sort'), null)
  assert.equal(await page.getAttribute('thead th:nth-child(2)', 'aria-sort'), 'ascending')
})
