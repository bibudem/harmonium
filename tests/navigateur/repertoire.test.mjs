import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir, ORIGINE } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-champ-liste.min.css"><link rel="stylesheet" href="/dist/bib-repertoire.min.css">'
const SCRIPT = [{ fichier: 'bib-repertoire.min.js' }]
// 10 personnes : les trois premières au droit, les autres à la santé
const personnes = Array.from({ length: 10 }, (_, i) => ({ nom: ['Tremblay', 'Gagnon', 'Roy', 'Côté', 'Lavoie', 'Bouchard', 'Morin', 'Pelletier', 'Fortin', 'Gauthier'][i], bib: i < 3 ? 'droit' : 'sante', disc: i === 0 ? 'criminologie' : 'medecine' }))
const fiche = (p) => `<li class="bib-repertoire__fiche" data-texte="${p.nom.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')} ${p.bib}" data-bibliotheque="${p.bib}" data-discipline="${p.disc}"><div class="bib-repertoire__entete"><h3 class="bib-repertoire__nom">${p.nom}</h3></div></li>`
const REPERTOIRE = `
<div class="bib-repertoire" data-repertoire data-ancres='{"droit":"droit","sante":"sante"}'>
  <form class="bib-repertoire__filtres" role="search" aria-label="Répertoire" data-filtres>
    <input type="search" id="q" name="q" data-recherche aria-label="Rechercher">
    <select id="b" data-filtre="bibliotheque"><option value="">Toutes</option><option value="droit" data-ancre="droit">Droit</option><option value="sante" data-ancre="sante">Santé</option></select>
    <select id="d" data-filtre="discipline"><option value="">Toutes</option><option value="criminologie">Criminologie</option><option value="medecine">Médecine</option></select>
  </form>
  <div class="bib-repertoire__actifs" hidden data-actifs></div>
  <p class="bib-repertoire__compte" role="status" data-statut>10 personnes</p>
  <ul class="bib-repertoire__fiches" aria-label="Membres" data-liste>${personnes.map(fiche).join('')}</ul>
  <nav class="bib-repertoire__pagination" aria-label="Pagination" hidden data-pagination><ul data-pages></ul></nav>
</div>`
const noms = (page) => page.$$eval('[data-liste] > li:not([hidden]) .bib-repertoire__nom', (e) => e.map((x) => x.textContent))
const statut = (page) => page.textContent('[data-statut]')

test('première page de 8, pagination, page suivante et focus sur la liste', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + REPERTOIRE })
  assert.equal((await noms(page)).length, 8)
  assert.equal(await statut(page), '10 personnes, page 1 sur 2')
  assert.equal(await page.evaluate(() => document.querySelector('[data-pagination]').hidden), false)
  assert.equal(await page.getAttribute('[data-pages] [aria-current]', 'aria-current'), 'page')
  await page.click('[data-pages] button[aria-label="Page 2"]')
  assert.deepEqual(await noms(page), ['Fortin', 'Gauthier'])
  assert.equal(await statut(page), '10 personnes, page 2 sur 2')
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('[data-liste]')), true)
})

test('recherche sans accents, annonce différée ; mots cumulés', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + REPERTOIRE })
  await page.fill('#q', 'cote')
  assert.deepEqual(await noms(page), ['Côté'])
  await page.waitForFunction(() => document.querySelector('[data-statut]').textContent === '1 personne')
  await page.fill('#q', 'cote droit')
  assert.deepEqual(await noms(page), [])
  await page.waitForFunction(() => document.querySelector('[data-statut]').textContent.startsWith('Aucune personne'))
})

test('filtre : puce du filtre actif, retrait au clic, focus rendu à la liste', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + REPERTOIRE })
  await page.selectOption('#b', 'droit')
  assert.deepEqual(await noms(page), ['Tremblay', 'Gagnon', 'Roy'])
  assert.equal(await page.evaluate(() => location.hash), '#droit', 'l’ancre suit le choix')
  assert.equal(await page.getAttribute('.bib-repertoire__puce', 'aria-label'), 'Retirer le filtre : Droit')
  await page.selectOption('#d', 'criminologie')
  assert.deepEqual(await noms(page), ['Tremblay'])
  await page.click('.bib-repertoire__puce[aria-label$="Droit"]')
  assert.equal(await page.inputValue('#b'), '')
  assert.equal(await page.evaluate(() => location.hash), '')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'b')
})

test('ancre de l’adresse et ?q= préremplissent les filtres', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + REPERTOIRE })
  await page.goto(`${ORIGINE}/essai.html?q=roy#droit`)
  assert.equal(await page.inputValue('#q'), 'roy')
  assert.equal(await page.inputValue('#b'), 'droit')
  assert.deepEqual(await noms(page), ['Roy'])
})
