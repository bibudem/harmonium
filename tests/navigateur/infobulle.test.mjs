import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-bouton.min.css"><link rel="stylesheet" href="/dist/bib-infobulle.min.css">'
const SCRIPT = [{ fichier: 'bib-infobulle.min.js' }]
const boutons = CSS + `<div style="padding:120px;display:flex;gap:160px">
 <button id="dessus" type="button" class="bib-bouton bib-bouton--plein bib-infobulle bib-infobulle--dessus" aria-label="Imprimer la page" data-infobulle="Imprimer"><span aria-hidden="true">⎙</span></button>
 <button id="dessous" type="button" class="bib-bouton bib-bouton--plein bib-infobulle bib-infobulle--dessous" aria-label="Partager la page" data-infobulle="Partager">⇪</button>
 <button id="gauche" type="button" class="bib-bouton bib-bouton--plein bib-infobulle bib-infobulle--gauche" aria-label="Retour en haut" data-infobulle="Retour en haut">↑</button>
 </div><button id="ailleurs">Autre commande</button>`

const attendreVisible = (page, id) => page.waitForFunction(id => {
 const s = getComputedStyle(document.getElementById(id), '::after')
 return s.visibility === 'visible' && s.opacity === '1'
}, id)

test('survol : les trois placements sont ancrés au bouton, sans CSS du site hôte', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page, {corps:boutons, scripts:SCRIPT})
 for (const id of ['dessus', 'dessous', 'gauche']) {
  await page.hover('#'+id)
  await attendreVisible(page,id)
  const s = await page.$eval('#'+id,e=>{
   const bulle=getComputedStyle(e,'::after')
   return {position:getComputedStyle(e).position,left:parseFloat(bulle.left),top:parseFloat(bulle.top),right:parseFloat(bulle.right),bottom:parseFloat(bulle.bottom),largeur:e.clientWidth,hauteur:e.clientHeight}
  })
  assert.equal(s.position,'relative')
  if(id==='dessus') { assert.ok(Math.abs(s.left-s.largeur/2)<1); assert.ok(Math.abs(s.bottom-s.hauteur-8)<1) }
  if(id==='dessous') { assert.equal(s.left,0); assert.ok(Math.abs(s.top-s.hauteur-8)<1) }
  if(id==='gauche') { assert.ok(Math.abs(s.right-s.largeur-8)<1); assert.ok(Math.abs(s.top-s.hauteur/2)<1) }
 }
 assert.deepEqual(page.erreurs,[])
 await page.context().close()
})

test('focus clavier : affichage immédiat, fermeture par Échap et retour au prochain focus', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page,{corps:boutons,scripts:SCRIPT})
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'dessus')
 await attendreVisible(page,'dessus')
 assert.equal(await page.$eval('#dessus',e=>getComputedStyle(e,'::after').transitionDuration),'0s')
 await page.keyboard.press('Escape')
 await page.waitForFunction(()=>getComputedStyle(document.getElementById('dessus'),'::after').visibility==='hidden')
 assert.equal(await page.evaluate(()=>document.activeElement.id),'dessus')
 await page.keyboard.press('Tab')
 await page.keyboard.press('Shift+Tab')
 await attendreVisible(page,'dessus')
 await page.context().close()
})

test('un déclencheur fixe garde son positionnement', async () => {
 const page = await nouvellePage(nav)
 await ouvrir(page,{corps:CSS+'<style>.commande { position:fixed;right:20px;bottom:20px }</style><button class="commande bib-infobulle bib-infobulle--gauche" data-infobulle="Retour en haut" aria-label="Retour en haut">↑</button>'})
 assert.equal(await page.$eval('.commande',e=>getComputedStyle(e).position),'fixed')
 await page.context().close()
})
