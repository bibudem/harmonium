import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'
let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())
const css = ['jetons', 'champ', 'entete', 'recherche'].map((nom) => `<link rel="stylesheet" href="/dist/bib-${nom}.min.css">`).join('')
// Composants hors catalogue : leurs exemples vivent avec les tests
const fixture = async (nom) => readFile(new URL(`./exemples/${nom}.html`, import.meta.url), 'utf8')
const exemple = async (nom, numero = '01') => readFile(new URL(`../../site/exemples/composants/${nom}/${numero}.html`, import.meta.url), 'utf8')

test('en-tête sans JavaScript : la navigation reste dans la barre, sans commandes', async () => {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 800 }, javaScriptEnabled: false })
  const page = await nouvellePage(nav, { contexte: ctx })
  await ouvrir(page, { corps: css + await exemple('entete') })
  assert.equal(await page.locator('.bib-entete__navigation').isVisible(), true)
  assert.equal(await page.locator('[data-entete-outils]').isVisible(), false)
  assert.equal(await page.locator('[data-entete-rideau]').isVisible(), false)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await ctx.close()
})

test('en-tête compact : Menu, loupe, « Afficher le menu », Échap et poignée', async () => {
  const page = await nouvellePage(nav, { largeur: 390 })
  await ouvrir(page, { corps: css + await exemple('entete') + '<main><a href="#">Après</a></main>', scripts: [{ fichier: 'bib-entete.min.js' }] })
  const menu = page.locator('[data-entete-menu]')
  const loupe = page.locator('[data-entete-recherche]')
  assert.equal(await page.locator('.bib-entete__navigation').isVisible(), false)
  // Menu : le rideau entier, Explorer compris ; la page devient inerte
  await menu.click()
  assert.equal(await menu.getAttribute('aria-expanded'), 'true')
  assert.equal(await menu.getAttribute('aria-label'), 'Fermer le menu')
  assert.equal(await page.getByRole('link', { name: 'Accueil', exact: true }).isVisible(), true)
  assert.equal(await page.locator('main').evaluate((m) => m.inert), true)
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('[data-entete-rideau]').evaluate((r) => r.hidden), true)
  assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-entete-menu')), true)
  assert.equal(await page.locator('main').evaluate((m) => m.inert), false)
  // Loupe : la recherche seule, le focus dans le champ
  await loupe.click()
  assert.equal(await loupe.getAttribute('aria-expanded'), 'true')
  assert.equal(await page.evaluate(() => document.activeElement?.type), 'search')
  assert.equal(await page.getByRole('link', { name: 'Accueil', exact: true }).isVisible(), false)
  // « Afficher le menu » : le reste apparaît, le focus va au premier lien, le burger prend le X
  await page.getByRole('button', { name: 'Afficher le menu' }).click()
  await page.waitForFunction(() => document.activeElement?.closest('.bib-entete__explorer'))
  assert.equal(await page.getByRole('link', { name: 'Accueil', exact: true }).isVisible(), true)
  assert.equal(await menu.getAttribute('aria-expanded'), 'true')
  assert.equal(await loupe.getAttribute('aria-expanded'), 'false')
  // Poignée : ferme et rend le focus
  await page.locator('[data-entete-poignee]').click()
  assert.equal(await page.locator('[data-entete-rideau]').evaluate((r) => r.hidden), true)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  assert.deepEqual(page.erreurs, [])
  await page.context().close()
})

test('en-tête de bureau : navigation dans la barre, loupe seule, rideau réduit à la recherche', async () => {
  const page = await nouvellePage(nav, { largeur: 1280 })
  await ouvrir(page, { corps: css + await exemple('entete', '02') + '<main><a href="#">Après</a></main>', scripts: [{ fichier: 'bib-entete.min.js' }] })
  assert.equal(await page.locator('.bib-entete__navigation').isVisible(), true)
  assert.equal(await page.locator('[data-entete-menu]').isVisible(), false)
  assert.equal(await page.locator('.bib-entete__navigation a[aria-current="page"]').count(), 1)
  await page.locator('[data-entete-recherche]').click()
  assert.equal(await page.locator('.bib-entete__groupe--recherche').isVisible(), true)
  assert.equal(await page.locator('.bib-entete__explorer').isVisible(), false)
  assert.equal(await page.getByRole('button', { name: 'Afficher le menu' }).isVisible(), false)
  // Le reste de la page est inerte ; Échap ferme et rend le focus à la loupe
  assert.equal(await page.locator('main').evaluate((m) => m.inert), true)
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('[data-entete-rideau]').evaluate((r) => r.hidden), true)
  assert.equal(await page.evaluate(() => document.activeElement?.hasAttribute('data-entete-recherche')), true)
  assert.deepEqual(page.erreurs, [])
  await page.context().close()
})

test('en-tête de bureau avec menuBureau : bouton Menu visible et groupes du site sous la recherche', async () => {
  const page = await nouvellePage(nav, { largeur: 1280 })
  await ouvrir(page, { corps: css + await exemple('entete'), scripts: [{ fichier: 'bib-entete.min.js' }] })
  await page.locator('[data-entete-menu]').click()
  assert.equal(await page.locator('.bib-entete__supplement').isVisible(), true)
  assert.equal(await page.locator('.bib-entete__explorer').isVisible(), false)
  assert.deepEqual(page.erreurs, [])
  await page.context().close()
})

test('recherche commune : Entrée soumet une requête GET sans JavaScript', async () => {
  const page = await nouvellePage(nav)
  page.pages.set('/rechercher', '<h1>Résultats</h1>')
  await ouvrir(page, { corps: css + (await exemple('recherche')).replace('action="#apercu"', 'action="/rechercher"') })
  await page.getByRole('searchbox', { name: 'Rechercher dans le site', exact: true }).fill('histoire des sciences')
  await page.locator('input[type=search]').press('Enter')
  await page.waitForURL((url) => url.pathname === '/rechercher')
  assert.equal(new URL(page.url()).searchParams.get('q'), 'histoire des sciences')
  await page.context().close()
})

test('champs : erreur reliée, validation native et choix au clavier', async () => {
  const page = await nouvellePage(nav, { largeur: 390 })
  await ouvrir(page, { corps: css + await fixture('champ-liste-02') + await fixture('champ-liste-03') })
  const champ = page.getByLabel('Adresse courriel (obligatoire)')
  assert.equal(await champ.getAttribute('aria-invalid'), 'true')
  assert.equal(await champ.evaluate((el) => el.checkValidity()), false)
  assert.deepEqual(await champ.evaluate((el) => el.getAttribute('aria-describedby').split(' ').map((id) => !!document.getElementById(id))), [true, true])
  await champ.fill('nom@umontreal.ca')
  assert.equal(await champ.evaluate((el) => el.checkValidity()), true)
  await page.getByRole('radio', { name: 'En salle' }).focus()
  await page.keyboard.press('ArrowDown')
  assert.equal(await page.getByRole('radio', { name: 'À distance' }).isChecked(), true)
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await page.context().close()
})
