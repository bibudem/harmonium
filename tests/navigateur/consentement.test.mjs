import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { attendre, lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const SCRIPT = [{ fichier: 'bib-consentement.min.js' }]

/** Google et Clarity interceptés : rien n'est chargé ni envoyé. Retourne les adresses demandées. */
async function tiers(page) {
  const demandes = []
  await page.route(/googletagmanager\.com|clarity\.ms/, (route) => {
    demandes.push(route.request().url())
    return route.fulfill({ body: '', contentType: 'text/javascript' })
  })
  return demandes
}
const couche = (page) =>
  page.evaluate(() => (window.dataLayer ?? []).map((e) => (typeof e.length === 'number' ? Array.from(e).slice(0, 2).join(' ') : Object.keys(e).join(','))))
const nomTiers = async (page) => (await page.locator('bib-consentement li', { hasText: 'Tiers' }).textContent()).replace(/\s+/g, ' ').trim()

test('refus : rien n’est chargé', async () => {
  const page = await nouvellePage(nav)
  const demandes = await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement gtm-id="GTM-ESSAI" clarity-id="clar"></bib-consentement>' })
  await page.locator('bib-consentement [data-refuser]').click()
  await page.waitForTimeout(300)
  assert.deepEqual(demandes, [])
  assert.match(await page.evaluate(() => document.cookie), /bib-consentement=/)
})

test('gtm-id : conteneur GTM et Clarity après acceptation, ga-id ignoré, ordre standard', async () => {
  const page = await nouvellePage(nav)
  const demandes = await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement gtm-id="GTM-ESSAI" ga-id="G-IGNORE" clarity-id="clar"></bib-consentement>' })
  assert.deepEqual(demandes, [], 'rien avant la réponse')
  assert.equal(await nomTiers(page), 'Tiers : Google (Google Tag Manager, Google Analytics) et Microsoft (Clarity) recueillent ces renseignements.')
  await page.locator('bib-consentement [data-accepter]').click()
  await page.waitForTimeout(300)
  assert.deepEqual(demandes.sort(), ['https://www.clarity.ms/tag/clar', 'https://www.googletagmanager.com/gtm.js?id=GTM-ESSAI'])
  assert.deepEqual(await couche(page), ['consent default', 'consent update', 'gtm.start,event', 'event page_view'])
})

test('bib:page-vue : une page vue par nouvelle adresse', async () => {
  const page = await nouvellePage(nav)
  await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement gtm-id="GTM-ESSAI"></bib-consentement>' })
  await page.locator('bib-consentement [data-accepter]').click()
  await page.evaluate(() => {
    history.pushState({}, '', '/page-2')
    dispatchEvent(new Event('bib:page-vue'))
    dispatchEvent(new Event('bib:page-vue'))
  })
  assert.equal((await couche(page)).filter((e) => e === 'event page_view').length, 2)
})

test('ga-id seul : Google Analytics en direct, texte sans Tag Manager', async () => {
  const page = await nouvellePage(nav)
  const demandes = await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement ga-id="G-ESSAI"></bib-consentement>' })
  assert.equal(await nomTiers(page), 'Tiers : Google (Google Analytics) recueille ces renseignements.', 'Microsoft absent sans clarity-id')
  assert.equal(await page.locator('bib-consentement p', { hasText: /YouTube|Loom/ }).count(), 0)
  await page.locator('bib-consentement [data-accepter]').click()
  await page.waitForTimeout(300)
  assert.deepEqual(demandes, ['https://www.googletagmanager.com/gtag/js?id=G-ESSAI'])
})

test('clarity-id seul : seul Microsoft est nommé ; sans outil : aucun tiers', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement clarity-id="c"></bib-consentement>' })
  assert.equal(await nomTiers(page), 'Tiers : Microsoft (Clarity) recueille ces renseignements.')
  const vide = await nouvellePage(nav)
  await ouvrir(vide, { scripts: SCRIPT, corps: '<bib-consentement></bib-consentement>' })
  assert.equal(await nomTiers(vide), 'Tiers : aucun outil de statistiques n’est utilisé sur ce site.')
})

test('choix déjà fait : pas de message, statistiques chargées directement', async () => {
  const page = await nouvellePage(nav)
  const demandes = await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement gtm-id="GTM-ESSAI"></bib-consentement>' })
  await page.locator('bib-consentement [data-accepter]').click()
  demandes.length = 0
  await page.reload()
  await page.waitForTimeout(300)
  assert.equal(await page.locator('bib-consentement [data-carte]').isHidden(), true)
  assert.deepEqual(demandes, ['https://www.googletagmanager.com/gtm.js?id=GTM-ESSAI'])
})

test('retrait de l’accord pendant la visite : page rechargée, plus rien de chargé ni envoyé', async () => {
  const page = await nouvellePage(nav)
  const demandes = await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement gtm-id="GTM-ESSAI" clarity-id="clar"></bib-consentement>' })
  await page.locator('bib-consentement [data-accepter]').click()
  await page.waitForTimeout(200)
  demandes.length = 0
  await page.evaluate(() => dispatchEvent(new Event('bib:parametres-temoins')))
  await page.locator('bib-consentement [data-statistiques]').uncheck()
  await Promise.all([page.waitForEvent('load'), page.locator('bib-consentement [data-enregistrer]').click()])
  await page.evaluate(() => { history.pushState({}, '', '/page-2'); dispatchEvent(new Event('bib:page-vue')) })
  await page.waitForTimeout(300)
  assert.deepEqual(demandes, [])
  assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined')
})

test('focus : après Accepter au clavier, il revient à l’élément de la page d’où il venait', async () => {
  const page = await nouvellePage(nav)
  await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<a href="#" id="lien">lien</a><bib-consentement ga-id="G-A"></bib-consentement>' })
  await page.locator('bib-consentement [data-carte]').waitFor()
  await page.locator('#lien').focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter') // Accepter
  assert.equal(await page.evaluate(() => document.activeElement.id), 'lien')
  assert.match(await page.locator('bib-consentement [role="status"]').textContent(), /acceptées/)
})

test('focus : après Enregistrer (panneau ouvert depuis la carte), il ne tombe pas sur body', async () => {
  const page = await nouvellePage(nav)
  await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement ga-id="G-A"></bib-consentement>' })
  await page.locator('bib-consentement [data-details]').click()
  await page.locator('bib-consentement [data-enregistrer]').click()
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BIB-CONSENTEMENT')
})

test('refus hors umontreal.ca : témoins de GA effacés aussi sur le domaine parent', async () => {
  const page = await nouvellePage(nav)
  const script = await readFile(new URL('../../dist/bib-consentement.min.js', import.meta.url))
  await page.route('http://www.exemple.test/**', (route) =>
    route.request().url().endsWith('.js')
      ? route.fulfill({ body: script, contentType: 'text/javascript' })
      : route.fulfill({ body: '<!doctype html><meta charset="utf-8"><script type="module" src="/c.js"></script><bib-consentement ga-id="G-A"></bib-consentement>', contentType: 'text/html' }),
  )
  await page.goto('http://www.exemple.test/')
  await page.evaluate(() => { document.cookie = '_ga=GA1.1.9; path=/; domain=.exemple.test'; document.cookie = '_ga_X=GS1; path=/; domain=.exemple.test' })
  await page.locator('bib-consentement [data-refuser]').click()
  const restants = (await page.context().cookies()).map((c) => c.name)
  assert.deepEqual(restants, ['bib-consentement'])
})

test('un seul élément actif ; <bib-consent-preferences-btn> ouvre le panneau', async () => {
  const page = await nouvellePage(nav)
  await tiers(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-consentement ga-id="G-A"></bib-consentement><bib-consentement ga-id="G-A"></bib-consentement><footer><bib-consent-preferences-btn></bib-consent-preferences-btn></footer>' })
  await page.locator('bib-consentement [data-carte]').first().waitFor()
  assert.equal(await page.locator('bib-consentement [data-carte]:visible').count(), 1)
  await page.locator('bib-consent-preferences-btn button').click()
  assert.equal(await page.evaluate(() => [...document.querySelectorAll('bib-consentement')].filter((e) => e.shadowRoot.querySelector('dialog')?.open).length), 1)
})

test('gtag déjà défini par le site : consent default envoyé quand même, en premier', async () => {
  const page = await nouvellePage(nav)
  await tiers(page)
  await ouvrir(page, { scripts: [{ fichier: 'bib-consentement.min.js', attributs: 'type="module"' }], corps: '<script>window.dataLayer=[];function gtag(){dataLayer.push(arguments)}</script><bib-consentement ga-id="G-A"></bib-consentement>' })
  await page.locator('bib-consentement [data-accepter]').click()
  assert.deepEqual((await couche(page)).slice(0, 2), ['consent default', 'consent update'])
})

test('carte affichée : sa hauteur est publiée, la page garde le focus visible (400 %)', async () => {
  const page = await nouvellePage(nav, { largeur: 320, hauteur: 256 })
  await tiers(page)
  const liens = Array.from({ length: 40 }, (_, i) => `<p><a href="#">Lien ${i}</a></p>`).join('')
  await ouvrir(page, { scripts: SCRIPT, corps: `<main>${liens}</main><bib-consentement ga-id="G-A"></bib-consentement>` })
  await attendre(page, () => document.documentElement.style.getPropertyValue('--bib-consentement-hauteur'))
  let caches = 0
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab')
    caches += await page.evaluate(() => {
      const a = document.activeElement
      if (a.tagName !== 'A') return 0
      const r = a.getBoundingClientRect()
      return document.elementFromPoint(r.left + 2, (r.top + r.bottom) / 2) === a ? 0 : 1
    })
  }
  assert.equal(caches, 0, 'aucun lien caché sous la carte')
  await page.locator('bib-consentement [data-refuser]').click()
  assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue('--bib-consentement-hauteur')), '')
})
