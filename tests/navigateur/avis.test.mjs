import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { attendre, json, lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const AVIS = (id, message = 'Avis ' + id) => json({ success: true, data: { id, message } })
const SCRIPT = [{ fichier: 'bib-avis.min.js' }]
const texte = (page, sel) => page.evaluate((s) => document.querySelector(s)?.shadowRoot?.querySelector('.message')?.textContent ?? null, sel)

test('affiche un avis du service et un avis local', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, {
    scripts: SCRIPT,
    corps: `<bib-avis id="service" bouton-fermer service='${AVIS('a1', 'Du service')}'></bib-avis>
            <bib-avis id="local">Avis <b>local</b></bib-avis>`,
  })
  await attendre(page, () => document.querySelector('#service').shadowRoot.querySelector('.message'))
  assert.equal(await texte(page, '#service'), 'Du service')
  await attendre(page, () => document.querySelector('#local').shadowRoot.querySelector('.message'))
  assert.equal(await texte(page, '#local'), 'Avis local')
  assert.equal(await page.locator('#local .btn-close').count(), 0, 'pas de bouton sans bouton-fermer')
  assert.deepEqual(page.erreurs, [])
})

test('rien sans avis en cours (data: null)', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${json({ success: true, data: null })}'></bib-avis>` })
  await page.waitForTimeout(300)
  assert.equal(await page.evaluate(() => document.querySelector('bib-avis').shadowRoot.querySelector('aside')), null)
})

test('un avis fermé ne revient pas au rechargement ; un nouvel avis paraît', async () => {
  const page = await nouvellePage(nav)
  const corps = (id) => `<bib-avis bouton-fermer service='${AVIS(id)}'></bib-avis>`
  await ouvrir(page, { scripts: SCRIPT, corps: corps('f1') })
  await page.locator('bib-avis .btn-close').click()
  await attendre(page, () => !document.querySelector('bib-avis').shadowRoot.querySelector('aside'))
  // La fermeture s'écrit dans IndexedDB juste après le clic : un rechargement immédiat
  // (impossible pour une personne) l'interromprait. On attend qu'elle soit enregistrée.
  await attendre(page, () =>
    new Promise((ok) => {
      const r = indexedDB.open('bib-avis')
      r.onsuccess = () => {
        const g = r.result.transaction('avis').objectStore('avis').get('f1')
        g.onsuccess = () => ok(g.result?.hidden === true)
      }
    }),
  )
  await page.reload()
  await page.waitForTimeout(500)
  assert.equal(await texte(page, 'bib-avis'), null)
  await ouvrir(page, { scripts: SCRIPT, corps: corps('f2'), chemin: '/autre.html' })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  assert.equal(await texte(page, 'bib-avis'), 'Avis f2')
})

test('bib:hide annulé : l’avis reste affiché', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis bouton-fermer service='${AVIS('h1')}'></bib-avis><script>addEventListener('bib:hide', (e) => e.preventDefault())</script>` })
  await page.locator('bib-avis .btn-close').click()
  await page.waitForTimeout(200)
  assert.equal(await texte(page, 'bib-avis'), 'Avis h1')
})

test('changer l’attribut service recharge l’avis', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${AVIS('s1', 'Premier')}'></bib-avis>` })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  await page.evaluate((s) => document.querySelector('bib-avis').setAttribute('service', s), AVIS('s2', 'Second'))
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message')?.textContent === 'Second')
})

test('fermeture au clavier : le focus reste sur l’élément, Tab continue après lui', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis bouton-fermer service='${AVIS('k1')}'></bib-avis><a href="#" id="apres">après</a>` })
  await page.locator('bib-avis .btn-close').focus()
  await page.keyboard.press('Enter')
  await attendre(page, () => !document.querySelector('bib-avis').shadowRoot.querySelector('aside'))
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BIB-AVIS')
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'apres')
})

test('HTML du service nettoyé : ni gestionnaire d’événement ni javascript:, mise en forme gardée ; fr-CA', async () => {
  const page = await nouvellePage(nav)
  const message = '<strong>Fermé</strong> <img src="x" onerror="window.__xss=1"><a href="javascript:window.__xss=2">a</a> <a href="https://bib.umontreal.ca/" target="_blank" onclick="x()">b</a><svg><script>window.__xss=3</script></svg>'
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${AVIS('n1', message)}'></bib-avis>` })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  await page.waitForTimeout(200)
  const html = await page.evaluate(() => document.querySelector('bib-avis').shadowRoot.querySelector('.message').innerHTML)
  assert.equal(html, '<strong>Fermé</strong> <a>a</a> <a href="https://bib.umontreal.ca/" target="_blank" rel="noopener noreferrer">b</a>')
  assert.equal(await page.evaluate(() => window.__xss), undefined)
  assert.equal(await page.evaluate(() => document.querySelector('bib-avis').shadowRoot.querySelector('aside').lang), 'fr-CA')
})

test('avis corrigé par le service (même id) : la nouvelle version paraît', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${AVIS('c1', 'Version 1')}'></bib-avis>` })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  await page.waitForTimeout(200)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${AVIS('c1', 'Version 2')}'></bib-avis>`, chemin: '/b.html' })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  assert.equal(await texte(page, 'bib-avis'), 'Version 2')
})

test('passage à un avis déjà fermé : plus rien d’affiché', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis bouton-fermer service='${AVIS('z1')}'></bib-avis>` })
  await page.locator('bib-avis .btn-close').click()
  await page.waitForTimeout(300)
  await ouvrir(page, { scripts: SCRIPT, corps: `<bib-avis service='${AVIS('z2')}'></bib-avis>`, chemin: '/b.html' })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  await page.evaluate((s) => document.querySelector('bib-avis').setAttribute('service', s), AVIS('z1'))
  await attendre(page, () => !document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
})

test('script classique dans le <head> : le contenu local est lu', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: [{ fichier: 'bib-avis.min.js', attributs: '' }], corps: '<bib-avis>Avis <b>local</b></bib-avis>' })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  assert.equal(await texte(page, 'bib-avis'), 'Avis local')
})

test('repère nommé « Avis des bibliothèques » ; bordure en contraste élevé', async () => {
  const ctx = await nav.newContext({ forcedColors: 'active' })
  const page = await nouvellePage(nav, { contexte: ctx })
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-avis>Avis <b>local</b></bib-avis>' })
  await attendre(page, () => document.querySelector('bib-avis').shadowRoot.querySelector('.message'))
  const { nom, bordure } = await page.evaluate(() => {
    const a = document.querySelector('bib-avis').shadowRoot.querySelector('aside')
    return { nom: a.getAttribute('aria-label'), bordure: getComputedStyle(a).borderTopStyle }
  })
  assert.equal(nom, 'Avis des bibliothèques')
  assert.equal(bordure, 'solid')
  await ctx.close()
})
