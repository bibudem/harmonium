import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { attendre, json, lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const SCRIPT = [{ fichier: 'udem-urgence.min.js' }]
const MESSAGE = {
  title: 'EXERCICE – Message d’urgence fictif assez long pour passer sur plusieurs lignes sur un téléphone.',
  hour: '10 h 15',
  fullDay: '15 novembre 2026',
  date: '2026-11-15T10:15:00-05:00',
  url: 'https://urgence.umontreal.ca/',
}
const rendu = (page) => attendre(page, () => document.querySelector('udem-urgence').shadowRoot.querySelector('aside'))
const boite = (page, sel) => page.evaluate((s) => document.querySelector('udem-urgence').shadowRoot.querySelector(s).getBoundingClientRect().toJSON(), sel)

test('petit format : date à gauche du message, texte entier, lien vers le message', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json(MESSAGE)}'></udem-urgence>` })
  await rendu(page)
  const lien = page.locator('udem-urgence a.title')
  assert.equal(await lien.getAttribute('href'), MESSAGE.url)
  assert.equal(await lien.getAttribute('target'), '_blank')
  assert.match(await lien.textContent(), /EXERCICE.*\(nouvel onglet\)/)
  const [date, titre] = [await boite(page, '.datetime'), await boite(page, '.title')]
  assert.ok(date.right <= titre.left + 1, 'date à gauche')
  assert.equal(await page.evaluate(() => document.querySelector('udem-urgence').shadowRoot.querySelector('time').getAttribute('datetime')), MESSAGE.date)
  assert.equal(await page.locator('udem-urgence aside').getAttribute('class'), 'wrapper')
  assert.deepEqual(page.erreurs, [])
})

test('grand format imposé par le message (bannerType large)', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json({ ...MESSAGE, bannerType: 'large' })}'></udem-urgence>` })
  await rendu(page)
  assert.equal(await page.locator('udem-urgence aside').getAttribute('class'), 'wrapper big')
})

test('téléphone (375 px) : date au-dessus du message, rien ne déborde', async () => {
  const page = await nouvellePage(nav, { largeur: 375, hauteur: 700 })
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json(MESSAGE)}'></udem-urgence>` })
  await rendu(page)
  const [date, titre] = [await boite(page, '.datetime'), await boite(page, '.title')]
  assert.ok(date.bottom <= titre.top + 1, 'date au-dessus')
  assert.ok(titre.right <= 375, 'message dans la largeur de l’écran')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 375, 'pas de défilement horizontal')
})

test('rien sans titre (pas d’urgence en cours)', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json({})}'></udem-urgence>` })
  await page.waitForTimeout(300)
  assert.equal(await page.evaluate(() => document.querySelector('udem-urgence').shadowRoot.querySelector('aside')), null)
})

test('un seul arrêt au clavier : le lien', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json(MESSAGE)}'></udem-urgence><button id="apres">après</button>` })
  await rendu(page)
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.querySelector('udem-urgence').shadowRoot.activeElement?.className), 'title')
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'apres')
})

test('lien du service : http(s) seulement ; texte en fr-CA', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json({ ...MESSAGE, headerLink: 'javascript:alert(1)', url: '' })}'></udem-urgence>` })
  await rendu(page)
  assert.equal(await page.locator('udem-urgence a.title').getAttribute('href'), 'https://urgence.umontreal.ca/')
  assert.equal(await page.locator('udem-urgence aside').getAttribute('lang'), 'fr-CA')
})

test('urgence publiée pendant la visite : affichée au retour sur l’onglet et annoncée', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<udem-urgence service='${json([])}'></udem-urgence>` })
  await page.waitForTimeout(300)
  assert.equal(await page.locator('udem-urgence [role="alert"]').textContent(), '', 'rien à annoncer au chargement')
  // Simule 5 minutes écoulées puis un retour sur l'onglet, avec une urgence publiée entre-temps
  await page.evaluate((s) => {
    const maintenant = Date.now
    Date.now = () => maintenant() + 6 * 60 * 1000
    const original = window.fetch
    window.fetch = () => original(s)
    document.dispatchEvent(new Event('visibilitychange'))
  }, json(MESSAGE))
  await rendu(page)
  assert.match(await page.locator('udem-urgence [role="alert"]').textContent(), /EXERCICE/)
})
