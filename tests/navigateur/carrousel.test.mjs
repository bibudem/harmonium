import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'
let navigateur
before(async () => (navigateur = await lancer()))
after(() => navigateur?.close())
const css = ['jetons','carrousel'].map((n) => `<link rel="stylesheet" href="/dist/bib-${n}.min.css">`).join('')
const corps = css + `<style>.bib-carrousel__piste{width:300px}.bib-carrousel__diapositive{flex:0 0 200px;min-height:80px}</style>
<div data-carrousel><div data-commandes><button type="button" data-precedent aria-controls="piste">Précédentes</button><button type="button" data-suivant aria-controls="piste">Suivantes</button></div>
<div id="piste" class="bib-carrousel__piste" data-piste tabindex="0" role="group" aria-label="Contenus du carrousel"><div class="bib-carrousel__diapositive">Premier</div><div class="bib-carrousel__diapositive">Deuxième</div><div class="bib-carrousel__diapositive">Troisième</div></div><p role="status" data-position></p></div>`

test('sans script : les cartes non interactives restent accessibles par défilement au clavier', async () => {
 const page = await nouvellePage(navigateur)
 await ouvrir(page, { corps })
 await page.locator('[data-piste]').focus()
 await page.keyboard.press('ArrowRight')
 await page.waitForFunction(() => document.getElementById('piste').scrollLeft > 0)
 assert.notEqual(await page.locator('[data-piste]').evaluate((e) => getComputedStyle(e).outlineStyle), 'none')
 await page.context().close()
})

test('navigation Astro : une seule action par clic après réinitialisation, et annonce des cartes', async () => {
 const page = await nouvellePage(navigateur)
 await page.emulateMedia({ reducedMotion: 'reduce' })
 await ouvrir(page, { corps, scripts: [{ fichier: 'bib-carrousel.min.js' }] })
 await page.evaluate(() => {
   document.dispatchEvent(new Event('astro:before-swap'))
   document.dispatchEvent(new Event('astro:page-load'))
   document.dispatchEvent(new Event('astro:page-load'))
   const piste = document.getElementById('piste'), original = piste.scrollTo.bind(piste)
   window.appelsDefilement = 0
   piste.scrollTo = (...args) => { window.appelsDefilement++; original(...args) }
 })
 await page.locator('[data-suivant]').click()
 assert.equal(await page.evaluate(() => window.appelsDefilement), 1)
 await page.waitForFunction(() => /sur 3/.test(document.querySelector('[data-position]').textContent))
 assert.ok(await page.locator('[data-piste]').evaluate((e) => e.scrollLeft > 0))
 assert.deepEqual(page.erreurs, [])
 await page.context().close()
})
