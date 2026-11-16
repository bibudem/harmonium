import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { attendre, lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

/*
 * LibChat simulé : le script load_chat.php est remplacé par un bloc minimal, de même structure
 * que celui de LibChat (id, classes, bouton avec aria-label et aria-expanded). Le clic bascule
 * la classe « open », comme LibChat.
 */
const FAUX_LIBCHAT = (etat) => `
  // Styles de base de LibChat (sa feuille, insérée à la fin du <head>) : bloc fixe en bas à droite
  const style = document.createElement('style')
  style.textContent = '.s-lch-widget-float { position: fixed; display: flex; flex-direction: column; align-items: flex-end; } .s-lch-widget-float:not(.open) .s-lch-widget-float-load { display: none; }'
  document.head.append(style)
  const bloc = document.createElement('div')
  bloc.id = 's-lch-widget-9467'
  bloc.className = 's-lch-widget-float'
  bloc.innerHTML = '<button class="s-lch-widget-float-btn ${etat}" aria-label="Clavarder avec nous" aria-expanded="false"><svg></svg><span id="s-lch-widget-float-indicator" style="display:none"></span></button><iframe class="s-lch-widget-float-load" title="Chat Widget"></iframe>'
  bloc.querySelector('button').addEventListener('click', (e) => {
    const ouvert = bloc.classList.toggle('open')
    e.currentTarget.setAttribute('aria-expanded', String(ouvert))
  })
  document.body.append(bloc)`

async function preparer(page, { etat = 'online', attributs = 'data-invitation="1"' } = {}) {
  const demandes = []
  await page.route('https://unequestion.bib.umontreal.ca/**', (route) => {
    demandes.push(route.request().url())
    return route.fulfill({ body: FAUX_LIBCHAT(etat), contentType: 'text/javascript' })
  })
  await ouvrir(page, { scripts: [{ fichier: 'bib-clavardage.min.js', attributs: `defer ${attributs}` }], corps: '<main>Page</main>' })
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn'))
  return demandes
}
const bulle = (page) => page.locator('#s-lch-widget-9467 .invitation-clavardage')

test('charge LibChat avec le hash et la version, styles et noms en français', async () => {
  const page = await nouvellePage(nav)
  const demandes = await preparer(page, { attributs: 'data-version="essai-3" data-invitation="0"' })
  assert.equal(demandes.length, 1)
  assert.match(demandes[0], /load_chat\.php\?hash=5bf2a2d1[0-9a-f]+&v=essai-3$/)
  assert.equal(await page.evaluate(() => !!document.querySelector('style[data-bib-clavardage]')), true)
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 iframe').title === 'Clavardage')
  assert.equal(await page.locator('#s-lch-widget-9467').getAttribute('lang'), 'fr-CA')
  assert.equal(await page.locator('#s-lch-widget-9467').getAttribute('aria-label'), 'Clavardage')
  assert.deepEqual(page.erreurs, [])
})

test('invitation après le délai si en ligne ; la croix la ferme pour la session', async () => {
  const page = await nouvellePage(nav)
  await preparer(page)
  await bulle(page).waitFor({ timeout: 3000 })
  assert.match(await bulle(page).textContent(), /Une question\?/)
  assert.equal(await bulle(page).getAttribute('role'), 'status')
  await page.locator('#s-lch-widget-9467 .invitation-fermer').click()
  await bulle(page).waitFor({ state: 'detached', timeout: 2000 })
  await page.reload()
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn'))
  await page.waitForTimeout(1500)
  assert.equal(await bulle(page).count(), 0, 'ne revient pas dans la session')
})

test('hors ligne : pas d’invitation', async () => {
  const page = await nouvellePage(nav)
  await preparer(page, { etat: 'offline' })
  await page.waitForTimeout(1500)
  assert.equal(await bulle(page).count(), 0)
})

test('bib:ouvrir-clavardage ouvre le panneau ; Échap le referme', async () => {
  const page = await nouvellePage(nav)
  await preparer(page, { attributs: 'data-invitation="0"' })
  await page.evaluate(() => dispatchEvent(new Event('bib:ouvrir-clavardage')))
  assert.match(await page.locator('#s-lch-widget-9467').getAttribute('class'), /\bopen\b/)
  await page.keyboard.press('Escape')
  assert.doesNotMatch(await page.locator('#s-lch-widget-9467').getAttribute('class'), /\bopen\b/)
})

test('pastille de nouveau message : description et annonce', async () => {
  const page = await nouvellePage(nav)
  await preparer(page, { attributs: 'data-invitation="0"' })
  await page.evaluate(() => (document.querySelector('#s-lch-widget-float-indicator').style.display = 'block'))
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn').hasAttribute('aria-describedby'))
  assert.equal(await page.locator('#s-lch-widget-9467 [role="status"].bib-clavardage-masque').textContent(), 'Nouveau message dans le clavardage.')
})

test('chargé en type="module" : réglages data-* lus quand même', async () => {
  const page = await nouvellePage(nav)
  const demandes = []
  await page.route('https://unequestion.bib.umontreal.ca/**', (route) => {
    demandes.push(route.request().url())
    return route.fulfill({ body: FAUX_LIBCHAT('online'), contentType: 'text/javascript' })
  })
  await ouvrir(page, { scripts: [{ fichier: 'bib-clavardage.min.js', attributs: 'type="module" data-version="module-1" data-invitation="0"' }], corps: '<main>Page</main>' })
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn'))
  assert.match(demandes[0], /&v=module-1$/)
})

test('avec <bib-consentement> : le rond reste visible au-dessus de la carte', async () => {
  for (const [largeur, hauteur] of [[1280, 720], [375, 667]]) {
    const page = await nouvellePage(nav, { largeur, hauteur })
    await page.route('https://unequestion.bib.umontreal.ca/**', (route) => route.fulfill({ body: FAUX_LIBCHAT('online'), contentType: 'text/javascript' }))
    await ouvrir(page, {
      scripts: [{ fichier: 'bib-clavardage.min.js', attributs: 'defer data-invitation="0"' }, { fichier: 'bib-consentement.min.js' }],
      corps: '<main>Page</main><bib-consentement ga-id="G-A"></bib-consentement>',
    })
    await attendre(page, () => document.documentElement.style.getPropertyValue('--bib-consentement-hauteur'))
    await page.waitForTimeout(300)
    const visible = await page.evaluate(() => {
      const b = document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn')
      const r = b.getBoundingClientRect()
      return [[r.left + 4, r.top + r.height / 2], [r.right - 4, r.top + r.height / 2], [r.left + r.width / 2, r.bottom - 4]].every(([x, y]) => b.contains(document.elementFromPoint(x, y)))
    })
    assert.equal(visible, true, `${largeur}x${hauteur}`)
  }
})

test('CSS hostile du site : le rond reste rond, focus visible, libellé dans l’écran', async () => {
  const page = await nouvellePage(nav, { largeur: 1280, hauteur: 720 })
  await page.route('https://unequestion.bib.umontreal.ca/**', (route) =>
    route.fulfill({ body: FAUX_LIBCHAT('online').replace('Clavarder avec nous', 'Clavardage hors ligne : laissez-nous un message'), contentType: 'text/javascript' }),
  )
  const hostile = '<style>button{min-width:120px;min-height:48px;margin:8px;text-transform:uppercase;letter-spacing:.2em}button:focus{outline:none!important}*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}</style>'
  await ouvrir(page, { scripts: [{ fichier: 'bib-clavardage.min.js', attributs: 'defer data-invitation="0"' }], corps: hostile + '<main>Page</main>' })
  await attendre(page, () => document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn'))
  await page.waitForTimeout(300)
  await page.keyboard.press('Tab')
  const r = await page.evaluate(() => {
    const b = document.querySelector('#s-lch-widget-9467 .s-lch-widget-float-btn')
    const box = b.getBoundingClientRect()
    const libelle = parseFloat(getComputedStyle(b, '::after').height)
    return { l: box.width, h: box.height, outline: getComputedStyle(b).outlineStyle, basLibelle: box.bottom + 6 + libelle, fenetre: innerHeight }
  })
  assert.equal(r.l, r.h, 'rond')
  assert.equal(r.outline, 'solid')
  assert.ok(r.basLibelle <= r.fenetre, `libellé dans l’écran (${r.basLibelle} ≤ ${r.fenetre})`)
})

test('LibChat en panne : avertissement en console', async () => {
  const page = await nouvellePage(nav)
  const messages = []
  page.on('console', (m) => messages.push(m.text()))
  await page.route('https://unequestion.bib.umontreal.ca/**', (route) => route.fulfill({ status: 503 }))
  await ouvrir(page, { scripts: [{ fichier: 'bib-clavardage.min.js', attributs: 'defer' }], corps: '<main>Page</main>' })
  await page.waitForTimeout(500)
  assert.ok(messages.some((m) => m.includes('[bib-clavardage] LibChat indisponible')))
})

test('Échap dans un élément du site : le clavardage reste ouvert', async () => {
  const page = await nouvellePage(nav)
  await preparer(page, { attributs: 'data-invitation="0"' })
  await page.evaluate(() => {
    document.body.insertAdjacentHTML('afterbegin', '<button id="menu">Menu</button>')
    dispatchEvent(new Event('bib:ouvrir-clavardage'))
  })
  await page.locator('#menu').focus()
  await page.keyboard.press('Escape')
  assert.match(await page.locator('#s-lch-widget-9467').getAttribute('class'), /\bopen\b/)
})
