import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-actualite.min.css"><link rel="stylesheet" href="/dist/bib-colonne-actualites.min.css"><link rel="stylesheet" href="/dist/bib-quoi-de-neuf.min.css">'
const SCRIPT = [{ fichier: 'bib-quoi-de-neuf.min.js' }]
const element = (t) => `<li class="bib-actualite"><div class="bib-actualite__texte"><a class="bib-actualite__titre" href="#">${t}</a></div></li>`
const colonne = (id, titre) => `<section class="bib-colonne-actualites" aria-labelledby="${id}" data-colonne="${id}"><h3 class="bib-colonne-actualites__titre" id="${id}">${titre}</h3><div class="bib-colonne-actualites__corps"><ul class="bib-actualites">${[1, 2, 3, 4].map((n) => element(`${titre} ${n}`)).join('')}</ul></div></section>`
const QDN = `<div class="bib-quoi-de-neuf" data-quoi-de-neuf>
  <div class="bib-quoi-de-neuf__onglets" data-onglets><span class="bib-quoi-de-neuf__indicateur" aria-hidden="true" data-indicateur></span>
    <button type="button" class="bib-quoi-de-neuf__onglet" id="o-ev" data-cible="ev" data-actif="true">Événements</button>
    <button type="button" class="bib-quoi-de-neuf__onglet" id="o-nv" data-cible="nv" data-actif="false">Nouvelles</button></div>
  <div class="bib-quoi-de-neuf__grille">${colonne('ev', 'Événements')}${colonne('nv', 'Nouvelles')}</div></div>`

test('téléphone : onglets ARIA, premier panneau, deux éléments par colonne', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 800 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + QDN })
  assert.equal(await page.getAttribute('[data-onglets]', 'role'), 'tablist')
  assert.deepEqual(await page.$$eval('[data-cible]', (b) => b.map((x) => [x.getAttribute('role'), x.getAttribute('aria-selected')])), [['tab', 'true'], ['tab', 'false']])
  assert.equal(await page.getAttribute('[data-colonne="ev"]', 'role'), 'tabpanel')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelectorAll('[data-colonne="ev"] li')[2]).display), 'none')
  assert.equal(await page.evaluate(() => document.querySelector('[data-colonne="nv"]').inert), true, 'panneau hors de vue inerte')
})

test('téléphone : flèches changent d’onglet, le panneau devient actif', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 800 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + QDN })
  await page.focus('#o-ev')
  await page.keyboard.press('ArrowRight')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'o-nv')
  assert.equal(await page.getAttribute('#o-nv', 'aria-selected'), 'true')
  await page.waitForFunction(() => document.querySelector('[data-colonne="ev"]').inert === true && document.querySelector('[data-colonne="nv"]').inert === false)
  await page.keyboard.press('Home')
  assert.equal(await page.getAttribute('#o-ev', 'aria-selected'), 'true')
})

test('bureau : pas d’onglets ni de rôles, colonnes côte à côte avec leur titre', async () => {
  const page = await nouvellePage(nav, { largeur: 1000, hauteur: 800 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + QDN })
  assert.equal(await page.getAttribute('[data-onglets]', 'role'), null)
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('[data-onglets]')).display), 'none')
  assert.equal(await page.getAttribute('[data-colonne="ev"]', 'role'), null)
  const tops = await page.$$eval('[data-colonne]', (c) => c.map((x) => Math.round(x.getBoundingClientRect().top)))
  assert.equal(tops[0], tops[1], 'même rangée')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelectorAll('[data-colonne="ev"] li')[3]).display), 'flex')
})

test('un second astro:page-load ne débranche pas les onglets (le redimensionnement les met toujours à jour)', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 800 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + QDN })
  await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')))
  await page.setViewportSize({ width: 1000, height: 800 })
  await page.waitForFunction(() => document.querySelector('[data-onglets]').getAttribute('role') === null)
})
