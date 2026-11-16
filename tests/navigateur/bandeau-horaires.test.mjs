import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const CSS = '<link rel="stylesheet" href="/dist/bib-jetons.min.css"><link rel="stylesheet" href="/dist/bib-bandeau-horaires.min.css">'
const SCRIPT = [{ fichier: 'bib-bandeau-horaires.min.js' }]
const BANDEAU = `
  <section class="bib-bandeau-horaires" aria-labelledby="bh-t" data-bandeau-horaires data-defaut="ss" data-api="https://api.exemple.test/horaires">
    <div class="bib-bandeau-horaires__rangee">
      <div class="bib-bandeau-horaires__choix">
        <label class="bib-bandeau-horaires__titre" id="bh-t" for="bh-c">Horaires du jour</label>
        <span class="bib-bandeau-horaires__selecteur"><select class="bib-bandeau-horaires__liste" id="bh-c" data-choix>
          <option value="ss">Sciences de la santé</option><option value="dr">Droit</option></select></span>
      </div>
      <p class="bib-bandeau-horaires__statut" data-statut><span class="bib-bandeau-horaires__pastille" data-pastille></span><span data-texte>Chargement des horaires…</span></p>
      <a class="bib-bandeau-horaires__tous" href="/horaires/">Tous les horaires</a>
    </div>
  </section>`

// Ouvert toute la journée (de 0 h à 24 h) à « ss », fermé à « dr » : le statut ne dépend pas de l'heure du test
const evenement = (date, bibliotheque, debut, fin) => ({ date: `${date}T00:00:00-04:00`, bibliotheque, service: 'regulier', debut1: debut, fin2: fin })
async function preparer(page, { echec = false } = {}) {
  const demandes = []
  await page.route('https://api.exemple.test/**', (route) => {
    demandes.push(route.request().url())
    if (echec) return route.fulfill({ status: 500, body: '' })
    const jour = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10)
    const evenements = [-1, 0, 1, 2].flatMap((d) => [evenement(jour(d), 'ss', '00:00', '24:00'), evenement(jour(d), 'dr')])
    return route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ evenements }) })
  })
  return demandes
}

test('statut de la bibliothèque choisie, région d’annonce après le premier remplissage', async () => {
  const page = await nouvellePage(nav)
  const demandes = await preparer(page)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + BANDEAU })
  await page.waitForFunction(() => document.querySelector('[data-texte]').textContent.startsWith('Ouvert'))
  assert.equal(await page.getAttribute('[data-statut]', 'role'), 'status')
  assert.equal(await page.getAttribute('[data-pastille]', 'data-etat'), 'open')
  assert.match(demandes[0], /fin=P2D&format=json/)
  await page.selectOption('[data-choix]', 'dr')
  await page.waitForFunction(() => document.querySelector('[data-texte]').textContent.startsWith('Fermé'))
  assert.equal(await page.getAttribute('[data-pastille]', 'data-etat'), 'closed')
  assert.deepEqual(page.erreurs, [])
})

test('le choix est gardé d’une page à l’autre', async () => {
  const page = await nouvellePage(nav)
  await preparer(page)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + BANDEAU })
  await page.selectOption('[data-choix]', 'dr')
  await page.reload()
  assert.equal(await page.inputValue('[data-choix]'), 'dr')
})

test('API en échec : « Horaire indisponible », pas « Fermé »', async () => {
  const page = await nouvellePage(nav)
  await preparer(page, { echec: true })
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + BANDEAU })
  await page.waitForFunction(() => document.querySelector('[data-texte]').textContent.startsWith('Horaire indisponible'))
  assert.equal(await page.getAttribute('[data-pastille]', 'data-etat'), 'unknown')
})

test('nom accessible de la liste : « Horaires du jour », texte masqué', async () => {
  const page = await nouvellePage(nav)
  await preparer(page)
  await ouvrir(page, { scripts: SCRIPT, corps: CSS + BANDEAU })
  const t = await page.evaluate(() => {
    const l = document.querySelector('label')
    const r = l.getBoundingClientRect()
    return [r.width, r.height, document.querySelector('[data-choix]').labels[0].textContent]
  })
  assert.deepEqual(t, [1, 1, 'Horaires du jour'])
})
