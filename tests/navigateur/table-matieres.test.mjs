import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'
let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())
const CSS = ['jetons','navigation-secondaire','table-matieres'].map(n=>`<link rel="stylesheet" href="/dist/bib-${n}.min.css">`).join('')
const liste = '<ul><li><a href="#premier">Emprunter</a><ul><li><a href="#duree">Durée du prêt</a></li></ul></li><li><a href="#deuxieme">Retourner</a></li></ul>'
const corps = CSS+`<style>body{margin:16px}.ligne{display:grid;grid-template-columns:240px minmax(0,1fr);gap:24px}section{min-height:900px}#duree{margin-top:400px}@media(width < 1200px){.ligne{display:block}}</style>
<div class="ligne"><div class="bib-table-matieres" data-table-matieres>
<nav class="bib-navigation-secondaire bib-navigation-secondaire--sommaire" aria-label="Sur cette page">${liste}</nav>
<details class="bib-navigation-secondaire-repliable"><summary>Sur cette page</summary><nav class="bib-navigation-secondaire bib-navigation-secondaire--sommaire" aria-label="Sur cette page">${liste}</nav></details>
</div><article><section><h2 id="premier">Emprunter</h2><h3 id="duree">Durée du prêt</h3></section><section><h2 id="deuxieme">Retourner</h2></section></article></div>`
const scripts=[{fichier:'bib-table-matieres.min.js'}]

test('bureau : une seule navigation visible et section active synchronisée', async () => {
 const page=await nouvellePage(nav,{largeur:1300,hauteur:700})
 await ouvrir(page,{corps,scripts})
 assert.equal(await page.locator('.bib-table-matieres > nav').isVisible(),true)
 assert.equal(await page.locator('details').isVisible(),false)
 await page.evaluate(()=>window.scrollTo(0,document.getElementById('deuxieme').getBoundingClientRect().top+scrollY-innerHeight*.2))
 await page.waitForFunction(()=>document.querySelectorAll('[href="#deuxieme"][aria-current="true"]').length===2)
 assert.equal(await page.locator('[href="#premier"][aria-current]').count(),0)
 assert.equal(await page.evaluate(()=>location.hash),'')
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'BODY')
 assert.deepEqual(page.erreurs,[])
 await page.context().close()
})

test('mobile : Échap rend le focus au résumé, un lien ferme le volet et focalise sa cible', async () => {
 const page=await nouvellePage(nav,{largeur:390,hauteur:700})
 await ouvrir(page,{corps,scripts})
 assert.equal(await page.locator('.bib-table-matieres > nav').isVisible(),false)
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY')
 await page.keyboard.press('Enter')
 await page.keyboard.press('Tab')
 await page.keyboard.press('Escape')
 assert.equal(await page.locator('details').getAttribute('open'),null)
 assert.equal(await page.evaluate(()=>document.activeElement.tagName),'SUMMARY')
 await page.keyboard.press('Enter')
 await page.locator('details a[href="#deuxieme"]').click()
 await page.waitForFunction(()=>document.activeElement.id==='deuxieme')
 assert.equal(await page.locator('details').getAttribute('open'),null)
 assert.equal(await page.evaluate(()=>location.hash),'#deuxieme')
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
 await page.context().close()
})

test('sans script : le volet natif et les liens restent utilisables', async () => {
 const page=await nouvellePage(nav,{largeur:390})
 await ouvrir(page,{corps})
 await page.locator('summary').click()
 assert.equal(await page.locator('details a[href="#duree"]').isVisible(),true)
 await page.locator('details a[href="#deuxieme"]').click()
 assert.equal(await page.evaluate(()=>location.hash),'#deuxieme')
 assert.equal(await page.locator('details').getAttribute('open'),'')
 await page.context().close()
})

test('rechargement Astro : les sections de la nouvelle page remplacent les anciennes', async () => {
 const page=await nouvellePage(nav,{largeur:1300,hauteur:700})
 await ouvrir(page,{corps,scripts})
 await page.evaluate(()=>{
  document.dispatchEvent(new Event('astro:before-swap'))
  document.body.innerHTML=document.body.innerHTML.replaceAll('premier','nouveau').replaceAll('deuxieme','dernier')
  document.dispatchEvent(new Event('astro:page-load'))
  document.querySelector('nav ul').insertAdjacentHTML('beforeend','<li><a href="#%E0%A4%A">Ancre invalide</a></li>')
  document.dispatchEvent(new Event('astro:page-load'))
  window.scrollTo(0,document.documentElement.scrollHeight)
 })
 await page.waitForFunction(()=>document.querySelectorAll('[href="#dernier"][aria-current="true"]').length===2)
 assert.deepEqual(page.erreurs,[])
 await page.context().close()
})

test('placement : sommaire à droite avec une navigation secondaire, à gauche sans elle', async () => {
 const page=await nouvellePage(nav,{largeur:1440,hauteur:900})
 const toc='<div class="bib-table-matieres"><nav class="bib-navigation-secondaire" aria-label="Sur cette page">Sommaire</nav><details class="bib-navigation-secondaire-repliable"><summary>Sur cette page</summary></details></div>'
 const article='<article class="bib-page-avec-sommaire__contenu">Contenu</article>'
 const secondaire='<div class="bib-page-avec-sommaire__navigation"><nav aria-label="Dans cette section">Section</nav></div>'
 await ouvrir(page,{corps:CSS+`<div id="autonome" class="bib-page-avec-sommaire">${toc}${article}</div><div id="section" class="bib-page-avec-sommaire">${secondaire}${toc}${article}</div>`})
 const position=async(id,classe)=>page.locator(`#${id} > .${classe}`).boundingBox()
 let som=await position('autonome','bib-table-matieres'), contenu=await position('autonome','bib-page-avec-sommaire__contenu')
 assert.ok(som.x+som.width<=contenu.x)
 som=await position('section','bib-table-matieres'); contenu=await position('section','bib-page-avec-sommaire__contenu')
 const section=await position('section','bib-page-avec-sommaire__navigation')
 assert.ok(section.x+section.width<=contenu.x)
 assert.ok(contenu.x+contenu.width<=som.x)
 await page.setViewportSize({width:390,height:900})
 for(const id of ['autonome','section']) {
  som=await position(id,'bib-table-matieres'); contenu=await position(id,'bib-page-avec-sommaire__contenu')
  assert.ok(som.y+som.height<=contenu.y)
 }
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
 await page.context().close()
})
