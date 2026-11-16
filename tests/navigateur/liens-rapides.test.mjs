import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-infobulle.min.css"><link rel="stylesheet" href="/dist/bib-liens-rapides.min.css">'
const SCRIPT = [{ fichier: 'bib-liens-rapides.min.js' }]
const liste = (taille) => `
  <li><a class="bib-liens-rapides__lien" href="/horaires/" aria-label="Horaires et lieux"><svg width="${taille}" height="${taille}" aria-hidden="true"></svg><span class="bib-liens-rapides__etiquette" aria-hidden="true">Horaires</span></a></li>
  <li><button type="button" class="bib-liens-rapides__lien" aria-label="Clavarder" data-evenement="bib:ouvrir-clavardage" data-repli="/clavarder/"><svg width="${taille}" height="${taille}" aria-hidden="true"></svg><span class="bib-liens-rapides__etiquette" aria-hidden="true">Clavarder</span></button></li>`
const LIENS = `
  <main style="height: 3000px"><p>Page</p><button id="autre">Ailleurs</button></main>
  <div class="bib-liens-rapides">
    <div class="bib-liens-rapides__bureau" data-liens-rapides>
      <nav class="bib-liens-rapides__panneau" aria-label="Liens rapides" data-replie>
        <button type="button" class="bib-liens-rapides__poignee bib-infobulle bib-infobulle--gauche" aria-expanded="false" aria-controls="lr" aria-label="Liens rapides" data-infobulle="Liens rapides" data-poignee></button>
        <ul class="bib-liens-rapides__liste" id="lr">${liste(24)}</ul>
      </nav>
    </div>
    <nav class="bib-liens-rapides__mobile" aria-label="Liens rapides" data-liens-rapides-mobile><ul class="bib-liens-rapides__liste">${liste(26)}</ul></nav>
  </div>`

const expanded = (page) => page.getAttribute('[data-poignee]', 'aria-expanded')

test('bureau : replié au départ, liens hors de l’ordre de tabulation', async () => {
  const page = await nouvellePage(nav, { largeur: 1200 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  assert.equal(await expanded(page), 'false')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.bib-liens-rapides__bureau .bib-liens-rapides__liste')).visibility), 'hidden')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.bib-liens-rapides__mobile')).display), 'none')
})

test('bureau : la poignée ouvre, Échap referme et rend le focus à la poignée', async () => {
  const page = await nouvellePage(nav, { largeur: 1200 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  await page.click('[data-poignee]')
  assert.equal(await expanded(page), 'true')
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.bib-liens-rapides__bureau .bib-liens-rapides__liste')).visibility), 'visible')
  await page.focus('.bib-liens-rapides__bureau a')
  await page.keyboard.press('Escape')
  assert.equal(await expanded(page), 'false')
  assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-poignee')), true)
})

test('bureau : un clic ailleurs ou le défilement referment', async () => {
  const page = await nouvellePage(nav, { largeur: 1200 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  await page.click('[data-poignee]')
  await page.click('#autre')
  assert.equal(await expanded(page), 'false')
  await page.click('[data-poignee]')
  await page.mouse.wheel(0, 300)
  await page.waitForFunction(() => document.querySelector('[data-poignee]').getAttribute('aria-expanded') === 'false')
})

test('bouton à événement : l’événement part ; sans preneur, la page de repli', async () => {
  const page = await nouvellePage(nav, { largeur: 1200 })
  page.pages.set('/clavarder/', '<!doctype html><title>Clavarder</title>')
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  await page.evaluate(() => {
    window.recu = 0
    window.addEventListener('bib:ouvrir-clavardage', (e) => {
      window.recu++
      if (window.preneur) e.preventDefault()
    })
  })
  await page.click('[data-poignee]')
  await page.evaluate(() => (window.preneur = true))
  await page.click('.bib-liens-rapides__bureau button[data-evenement]')
  assert.equal(await page.evaluate(() => window.recu), 1)
  assert.equal(new URL(page.url()).pathname, '/essai.html', 'pris en charge : pas de repli')
  await page.evaluate(() => (window.preneur = false))
  await page.click('.bib-liens-rapides__bureau button[data-evenement]')
  await page.waitForURL('**/clavarder/')
})

test('mobile : la barre suit le défilement et revient en haut de page', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 700 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.bib-liens-rapides__bureau')).display), 'none')
  const retrait = () => page.evaluate(() => Number(document.documentElement.style.getPropertyValue('--bib-liens-rapides-retrait') || 0))
  await page.mouse.wheel(0, 400)
  await page.waitForFunction(() => Number(document.documentElement.style.getPropertyValue('--bib-liens-rapides-retrait')) > 0)
  await page.mouse.wheel(0, -400)
  await page.waitForFunction(() => Number(document.documentElement.style.getPropertyValue('--bib-liens-rapides-retrait')) === 0)
  assert.equal(await retrait(), 0)
  assert.ok(Number.parseInt(await page.evaluate(() => document.documentElement.style.getPropertyValue('--bib-liens-rapides-hauteur'))) > 40, 'hauteur réelle de la barre posée')
})

test('mobile : le focus dans la barre la ramène entière', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 700 })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + LIENS })
  await page.mouse.wheel(0, 600)
  await page.waitForFunction(() => Number(document.documentElement.style.getPropertyValue('--bib-liens-rapides-retrait')) > 0.9)
  await page.focus('.bib-liens-rapides__mobile a')
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.bib-liens-rapides__mobile')).translate === 'none' || getComputedStyle(document.querySelector('.bib-liens-rapides__mobile')).translate === '0px')
})
