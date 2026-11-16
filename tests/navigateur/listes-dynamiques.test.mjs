import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-actualite.min.css"><link rel="stylesheet" href="/dist/bib-etat-erreur.min.css">'
const SCRIPT = [{ fichier: 'bib-listes-dynamiques.min.js' }]
const CORS = { 'access-control-allow-origin': '*' }
const gabarit = `<template data-gabarit><li class="bib-actualite"><span class="bib-actualite__vignette" data-champ="vignette"></span><div class="bib-actualite__texte"><p class="bib-actualite__ligne"><span data-champ="date"></span></p><a class="bib-actualite__titre" href="#" data-champ="lien"><span data-champ="titre"></span></a></div></li></template>`
const liste = (attribut, service, extra = '') => `
  <div class="bib-actualites-dynamique" ${attribut} data-service="${service}" data-limite="2" ${extra} aria-busy="true">
    <ul class="bib-actualites" data-etat="chargement"><li>…</li></ul>
    <ul class="bib-actualites" data-etat="pret" data-liste hidden></ul>
    <div class="bib-etat-erreur" data-etat="erreur" hidden><p>Indisponible.</p><button type="button" data-reessayer>Réessayer</button></div>
    <p data-etat="vide" hidden>Rien.</p>
    ${gabarit}
  </div>`
const rss = (...items) => `<?xml version="1.0"?><rss><channel>${items.map(([t, d, img]) => `<item><title>${t}</title><link>https://cal.test/${encodeURIComponent(t)}</link><pubDate>${d}</pubDate>${img ? `<enclosure url="${img}"/>` : ''}</item>`).join('')}</channel></rss>`

test('événements : éléments remplis, doublons du flux retirés, limite respectée', async () => {
  const page = await nouvellePage(nav)
  await page.route('https://flux.test/**', (r) => r.fulfill({ contentType: 'application/rss+xml', headers: CORS, body: rss(['Conférence', 'Mon, 02 Nov 2026 14:00:00 -0500'], ['Conférence', 'Mon, 02 Nov 2026 14:00:00 -0500'], ['Atelier', 'Tue, 03 Nov 2026 10:00:00 -0500'], ['Troisième', 'Wed, 04 Nov 2026 10:00:00 -0500']) }))
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + liste('data-liste-evenements', 'https://flux.test/rss') })
  await page.waitForSelector('[data-liste] li')
  const lignes = await page.$$eval('[data-liste] li', (els) => els.map((e) => [e.querySelector('[data-champ="titre"]').textContent, e.querySelector('a').getAttribute('href'), e.querySelector('[data-champ="date"]').textContent]))
  assert.equal(lignes.length, 2)
  assert.equal(lignes[0][0], 'Conférence')
  assert.equal(lignes[1][0], 'Atelier')
  assert.match(lignes[0][2], /novembre 2026/)
  assert.equal(await page.getAttribute('[data-liste-evenements]', 'aria-busy'), 'false')
  assert.equal(await page.evaluate(() => document.querySelector('[data-etat="chargement"]').hidden), true)
})

test('événements : image de repli quand la vignette ne se charge pas', async () => {
  const page = await nouvellePage(nav)
  await page.route('https://flux.test/**', (r) => r.fulfill({ contentType: 'application/rss+xml', headers: CORS, body: rss(['A', 'Mon, 02 Nov 2026 14:00:00 -0500', 'https://img.test/absente.jpg']) }))
  await page.route('https://img.test/**', (r) => r.fulfill({ status: 404, body: '' }))
  await page.route('**/repli.svg', (r) => r.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' }))
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + liste('data-liste-evenements', 'https://flux.test/rss', 'data-repli-image="/repli.svg"') })
  await page.waitForFunction(() => document.querySelector('[data-liste] img')?.getAttribute('src') === '/repli.svg')
  await page.waitForTimeout(300)
  assert.equal(await page.locator('[data-liste] img').count(), 1, 'le repli reste affiché')
})

test('formations : date, heures, vide et limite', async () => {
  const page = await nouvellePage(nav)
  await page.route('https://api.test/**', (r) => r.fulfill({ contentType: 'application/json', headers: CORS, body: JSON.stringify([{ url: 'https://cal.test/1', titre: 'Zotero', date: '5 novembre 2026', debut: '10 h', fin: '11 h' }, { url: 'https://cal.test/2', titre: 'Excel', date: '6 novembre 2026' }, { url: 'https://cal.test/3', titre: 'Trop', date: 'x' }]) }))
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + liste('data-liste-formations', 'https://api.test/f?limit=2') })
  await page.waitForSelector('[data-liste] li')
  const dates = await page.$$eval('[data-liste] [data-champ="date"]', (els) => els.map((e) => e.textContent))
  assert.deepEqual(dates, ['5 novembre 2026 · 10 h–11 h', '6 novembre 2026'])
})

test('liste vide : message « vide »', async () => {
  const page = await nouvellePage(nav)
  await page.route('https://api.test/**', (r) => r.fulfill({ contentType: 'application/json', headers: CORS, body: '[]' }))
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + liste('data-liste-formations', 'https://api.test/f') })
  await page.waitForFunction(() => document.querySelector('[data-etat="vide"]').hidden === false)
})

test('échec : message d’erreur, puis « Réessayer » rend le focus au conteneur et recharge', async () => {
  const page = await nouvellePage(nav)
  let appels = 0
  await page.route('https://api.test/**', (r) => {
    appels++
    if (appels === 1) return r.fulfill({ status: 500, body: '' })
    return r.fulfill({ contentType: 'application/json', headers: CORS, body: JSON.stringify([{ url: 'https://cal.test/1', titre: 'Zotero', date: 'd' }]) })
  })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + liste('data-liste-formations', 'https://api.test/f') })
  await page.waitForFunction(() => document.querySelector('[data-etat="erreur"]').hidden === false)
  await page.click('[data-reessayer]')
  assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-liste-formations')), true, 'le focus passe au conteneur')
  await page.waitForSelector('[data-liste] li')
  assert.equal(appels, 2)
})
