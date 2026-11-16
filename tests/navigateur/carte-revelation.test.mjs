import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-carte-revelation.min.css">'
const SCRIPT = [{ fichier: 'bib-carte-revelation.min.js' }]
const CARTE = `
  <div class="bib-carte-revelation bib-carte-revelation--vert-fonce" data-carte-revelation id="carte">
    <div class="bib-carte-revelation__icone"></div>
    <h3 class="bib-carte-revelation__titre" id="t1">Services</h3>
    <div class="bib-carte-revelation__contenu" tabindex="0" role="group" aria-labelledby="t1" data-description id="d"><p>Description.</p></div>
  </div>
  <button id="ailleurs">Ailleurs</button>`

const opacite = (page) => page.evaluate(() => getComputedStyle(document.querySelector('#d')).opacity)

test('description cachée par l’opacité seule, révélée par le survol', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + CARTE })
  assert.equal(await opacite(page), '0')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('#d')).visibility), 'visible', 'reste lue par les lecteurs d’écran')
  await page.hover('#carte')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#d')).opacity === '1')
})

test('clavier : le focus sur la description révèle la carte', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + CARTE })
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'd')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#d')).opacity === '1')
})

test('clic ou toucher : la description prend le focus, la carte se referme au départ du focus', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + CARTE })
  await page.click('#carte', { position: { x: 10, y: 10 } })
  assert.equal(await page.evaluate(() => document.activeElement.id), 'd')
  await page.focus('#ailleurs')
  await page.mouse.move(0, 0)
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#d')).opacity === '0')
})
