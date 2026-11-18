import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = ['jetons', 'champ', 'recapitulatif-erreurs'].map((n) => `<link rel="stylesheet" href="/dist/bib-${n}.min.css">`).join('')
const recapitulatif = (attributs = '') => `<div class="bib-recapitulatif-erreurs" tabindex="-1" aria-labelledby="t" data-recapitulatif-erreurs ${attributs}>
<h2 class="bib-recapitulatif-erreurs__titre" id="t">Il y a un problème</h2>
<ul class="bib-recapitulatif-erreurs__liste"><li><a href="#courriel">Saisir une adresse complète</a></li><li><a href="#format-salle">Choisir le format</a></li></ul></div>`
const formulaire = `<div style="height:1500px"></div>
<div class="bib-champ"><label for="courriel">Adresse courriel</label><input id="courriel" aria-invalid="true"></div>
<div style="height:600px"></div>
<fieldset class="bib-choix"><legend id="legende">Format</legend><label><input type="radio" id="format-salle" name="f"> En salle</label></fieldset><div style="height:1500px"></div>`
const scripts = [{ fichier: 'bib-recapitulatif-erreurs.min.js' }]

test('le récapitulatif reçoit le focus au chargement', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { corps: CSS + recapitulatif() + formulaire, scripts })
  await page.waitForFunction(() => document.activeElement?.hasAttribute('data-recapitulatif-erreurs'))
  assert.deepEqual(page.erreurs, [])
  await page.context().close()
})

test('data-sans-focus : le focus reste où il était', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { corps: CSS + recapitulatif('data-sans-focus') + formulaire, scripts })
  await page.waitForFunction(() => document.querySelector('[data-recapitulatif-erreurs]')?.hasAttribute('data-pret'))
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BODY')
  await page.context().close()
})

test('un lien montre le libellé (ou la légende) puis donne le focus au champ', async () => {
  const page = await nouvellePage(nav, { hauteur: 600 })
  await ouvrir(page, { corps: CSS + recapitulatif() + formulaire, scripts })
  await page.click('a[href="#courriel"]')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'courriel')
  const haut = await page.evaluate(() => document.querySelector('label[for="courriel"]').getBoundingClientRect().top)
  assert.ok(haut >= 0 && haut < 5, `libellé en haut de l’écran (${haut})`)
  await page.click('a[href="#format-salle"]')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'format-salle')
  const legende = await page.evaluate(() => document.getElementById('legende').getBoundingClientRect().top)
  assert.ok(legende >= 0 && legende < 5, `légende en haut de l’écran (${legende})`)
  assert.equal(await page.evaluate(() => location.hash), '')
  await page.context().close()
})

test('une seconde initialisation (astro:page-load) ne double pas les écouteurs', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { corps: CSS + recapitulatif() + formulaire, scripts })
  await page.evaluate(() => document.dispatchEvent(new Event('astro:page-load')))
  await page.evaluate(() => {
    window.focus_ = 0
    document.getElementById('courriel').addEventListener('focus', () => window.focus_++)
  })
  await page.click('a[href="#courriel"]')
  assert.equal(await page.evaluate(() => window.focus_), 1)
  await page.context().close()
})
