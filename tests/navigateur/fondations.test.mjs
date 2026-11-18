/* Contrats communs, avec feuilles ciblées et sans reset du site hôte. */
import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())
const css = (...noms) => ['jetons', ...noms].map(n => `<link rel="stylesheet" href="/dist/bib-${n}.min.css">`).join('')

const onglets = () => `
<div class="bib-onglets" data-onglets>
 <div class="bib-onglets__liste" data-onglets-liste data-aria-label="Services">
  <button type="button" class="bib-onglets__onglet" data-onglet id="o1" aria-controls="p1" data-selectionne="true">Prêt</button>
  <button type="button" class="bib-onglets__onglet" data-onglet id="o2" aria-controls="p2" data-selectionne="false">Retour</button>
 </div>
 <div class="bib-onglets__panneaux">
  <div class="bib-onglets__panneau" id="p1"><h3 data-titre-panneau>Prêt</h3><p>Emprunter un document.</p></div>
  <div class="bib-onglets__panneau" id="p2"><h3 data-titre-panneau>Retour</h3><p>Retourner un document.</p></div>
 </div>
</div>`

test('feuilles ciblées : focus visible, bouton désactivé inactif et cibles de 44 px', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, {corps: css('bouton', 'lien', 'champ-liste') + `
 <button id="b" class="bib-bouton bib-bouton--plein">Réserver</button>
 <button id="d" class="bib-bouton bib-bouton--plein" disabled>Indisponible</button>
 <a id="l" class="bib-lien" href="#">Horaires</a>
 <div class="bib-champ-liste"><label for="q">Bibliothèque</label><div class="bib-champ-liste__boite"><select id="q"><option>Droit</option></select></div></div>`})
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(() => document.activeElement.id), 'b')
 for(const id of ['b','l']) {
  await page.focus('#'+id)
  assert.equal(await page.$eval('#'+id,e=>getComputedStyle(e).outlineWidth),'3px')
 }
 assert.equal(await page.$eval('#d',e=>e.disabled),true)
 await page.focus('#b')
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(() => document.activeElement.id),'l')
 assert.ok(await page.$eval('#q',e=>e.getBoundingClientRect().height)>=44)
 assert.notEqual(await page.$eval('#b',e=>getComputedStyle(e).backgroundColor),await page.$eval('#d',e=>getComputedStyle(e).backgroundColor))
 await page.context().close()
})

test('320 px et texte à 200 % : les libellés et cartes restent dans le contenu', async () => {
 const page = await nouvellePage(nav, {largeur:320})
 await ouvrir(page, {corps: css('bouton', 'carte-texte', 'carte-revelation', 'typographie') + `
 <style>html { font-size:200% } body { margin:16px } .zone { width:100% }</style>
 <div class="zone"><h1 class="bib-typographie bib-typographie--titre-1">BibliothèquesEtServicesDocumentaires</h1>
 <button class="bib-bouton bib-bouton--plein">Réserver une salle pour un travail en équipe</button>
 <div class="bib-carte-texte">BibliothèquesEtServicesDocumentaires</div>
 <div class="bib-carte-revelation bib-carte-revelation--bleu-principal"><h2>Collections</h2></div></div>`})
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= document.documentElement.clientWidth))
 await page.context().close()
})

test('couleurs forcées et mouvement réduit : le focus et la flèche subsistent sans déplacement', async () => {
 const page = await nouvellePage(nav)
 await page.emulateMedia({ forcedColors:'active', reducedMotion:'reduce' })
 await ouvrir(page, {corps: css('bouton')+'<a id="b" href="#" class="bib-bouton bib-bouton--plein"><span>Réserver</span><span class="bib-bouton__fin" aria-hidden="true"></span></a>'})
 await page.keyboard.press('Tab')
 const etat = await page.$eval('#b', e=>({focus:getComputedStyle(e).outlineStyle, fleche:getComputedStyle(e.lastElementChild).backgroundColor, mouvement:getComputedStyle(e.lastElementChild).transform, duree:getComputedStyle(e.lastElementChild).transitionDuration}))
 assert.equal(etat.focus,'solid')
 assert.notEqual(etat.fleche,'rgba(0, 0, 0, 0)')
 assert.equal(etat.mouvement,'none')
 assert.equal(etat.duree,'0s')
 await page.context().close()
})

test('onglets : si le script manque, tous les contenus restent lisibles même avec JavaScript activé', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, {corps:css('onglets')+onglets()})
 assert.equal(await page.locator('.bib-onglets__liste').isVisible(),false)
 assert.equal(await page.locator('#p1').isVisible(),true)
 assert.equal(await page.locator('#p2').isVisible(),true)
 assert.equal(await page.locator('[data-titre-panneau]').first().isVisible(),true)
 await page.context().close()
})

test('onglets : orientation clavier, ancre malformée et initialisation répétée', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, {scripts:[{fichier:'bib-onglets.min.js'}],corps:css('onglets')+onglets()})
 await page.evaluate(()=>{ location.hash = '%E0%A4%A' })
 await page.focus('#o1')
 await page.keyboard.press('ArrowDown')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'o1')
 await page.keyboard.press('ArrowRight')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'o2')
 assert.equal(await page.locator('#o2').getAttribute('aria-selected'),'true')
 assert.equal(await page.locator('#p1').isVisible(),false)
 await page.evaluate(()=>document.dispatchEvent(new Event('astro:page-load')))
 await page.keyboard.press('Home')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'o1')
 assert.deepEqual(page.erreurs,[])
 await page.context().close()
})

test('lien d’évitement : premier arrêt, visible au focus, puis passage au contenu', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page,{corps:css('lien-evitement')+'<a class="bib-lien-evitement" href="#contenu">Aller au contenu</a><header><a href="#">Navigation</a></header><main id="contenu" tabindex="-1"><a id="premier" href="#">Contenu</a></main>'})
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(()=>document.activeElement.className),'bib-lien-evitement')
 assert.ok(await page.locator('.bib-lien-evitement').evaluate(e=>e.getBoundingClientRect().height)>=44)
 await page.keyboard.press('Enter')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'contenu')
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'premier')
 await page.context().close()
})

test('un thème clair unique, même si le système préfère le sombre', async () => {
 const page = await nouvellePage(nav)
 await page.emulateMedia({colorScheme:'dark'})
 await ouvrir(page,{corps:css()})
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme),'light')
 await page.context().close()
})

test('le sceau s’arrête si le mouvement réduit est activé pendant le survol', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, { corps: '<a href="#" style="display:block;width:100px;height:100px"><span class="bib-sceau"><span class="bib-sceau__anneau" style="display:block;width:100px;height:100px">Sceau</span></span></a>', scripts: [{ fichier: 'bib-sceau.min.js' }] })
 await page.locator('a').hover()
 await page.waitForFunction(() => parseFloat(document.querySelector('.bib-sceau__anneau').style.rotate) > 0)
 await page.emulateMedia({ reducedMotion: 'reduce' })
 await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))
 const angle = await page.locator('.bib-sceau__anneau').evaluate((e) => e.style.rotate)
 await page.waitForTimeout(100)
 assert.equal(await page.locator('.bib-sceau__anneau').evaluate((e) => e.style.rotate), angle)
 await page.context().close()
})

test('les chiffres reviennent à leur valeur finale quand le mouvement est réduit en cours de visite', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, { corps: css('chiffres') + '<style>:root{--duree-longue:5s}</style><div data-chiffres style="height:100px"><div data-chiffres-unite><span class="bib-chiffres__compteur" data-compteur="1000">1 000</span></div></div>', scripts: [{ fichier: 'bib-chiffres.min.js' }] })
 await page.waitForFunction(() => document.querySelector('[data-compteur]').hasAttribute('data-compte'))
 await page.emulateMedia({ reducedMotion: 'reduce' })
 await page.waitForFunction(() => document.querySelector('[data-compteur]').textContent.replace(/\D/g, '') === '1000')
 await page.waitForTimeout(100)
 assert.equal(await page.locator('[data-compteur]').evaluate((e) => e.textContent.replace(/\D/g, '')), '1000')
 assert.equal(await page.locator('[data-compteur]').getAttribute('data-compte'), null)
 await page.context().close()
})
