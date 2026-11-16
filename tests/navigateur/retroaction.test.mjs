import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { attendre, lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const SCRIPT = [{ fichier: 'bib-retroaction-usager.min.js' }]
const CORS = { 'access-control-allow-origin': '*' }

/** LibWizard simulé : rien n'est envoyé au vrai service. Retourne les corps reçus. */
async function libwizard(page, { statutEnvoi = 200 } = {}) {
  const envois = []
  await page.route('https://umontreal.libwizard.com/**', (route) => {
    const req = route.request()
    if (req.method() === 'OPTIONS') return route.fulfill({ headers: { ...CORS, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    if (req.url().endsWith('/getguid')) return route.fulfill({ json: 'guid-essai', headers: CORS })
    envois.push(JSON.parse(req.postData()))
    return route.fulfill({ status: statutEnvoi, json: {}, headers: CORS })
  })
  return envois
}
const el = (page, sel) => page.locator(`bib-retroaction-usager ${sel}`)
const focusInterne = (page) => page.evaluate(() => document.querySelector('bib-retroaction-usager').shadowRoot.activeElement?.className ?? null)

const MERCI = 'Merci, votre retour a été envoyé. Il nous aide à améliorer le site.'
const merciVisible = (page) => attendre(page, () => !document.querySelector('bib-retroaction-usager').shadowRoot.querySelector('.resultat').hidden)

test('pouce en haut : envoyé tout de suite, sans commentaire ; remerciement', async () => {
  const page = await nouvellePage(nav)
  const envois = await libwizard(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  assert.equal(await el(page, '.survey-title').textContent(), 'Cette page vous a été utile?')
  await el(page, '#btn-vote-y').click()
  await merciVisible(page)
  assert.equal(await el(page, '.commentaire').isHidden(), true, 'pas de commentaire pour le pouce en haut')
  assert.equal((await el(page, '.resultat').textContent()).trim(), MERCI)
  assert.equal(await focusInterne(page), 'resultat', 'le focus suit le remerciement (il est donc lu)')
  assert.equal(await el(page, 'form').isHidden(), true)
  assert.equal(envois.length, 1)
  assert.equal(envois[0].formId, 43176)
  assert.equal(envois[0].guid, 'guid-essai')
  assert.deepEqual(envois[0].data.map((d) => [d.fieldId, d.data]), [[1570387, 'oui'], [1570390, '']])
  assert.deepEqual(page.erreurs, [])
})

test('pouce en bas : champ de commentaire compteur, envoi', async () => {
  const page = await nouvellePage(nav)
  const envois = await libwizard(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  await el(page, '#btn-vote-n').click()
  assert.equal(envois.length, 0, 'rien n’est envoyé avant « Envoyer mon retour »')
  assert.equal(await el(page, '#btn-vote-n').getAttribute('aria-pressed'), 'true')
  assert.equal(await el(page, '#btn-vote-n').getAttribute('aria-expanded'), 'true')
  assert.equal(await focusInterne(page), 'form-control input-sm width-full', 'le focus va au champ')
  assert.equal(await el(page, '.intro').textContent(), 'Merci. Dites-nous ce qui manquait ou ce qui a rendu cette page moins utile.')
  assert.equal((await el(page, 'label').textContent()).replace(/\s+/g, ' ').trim(), 'Commentaire (optionnel)')
  assert.equal(await el(page, 'textarea').getAttribute('maxlength'), '500')
  assert.match(await el(page, '.write-us').textContent(), /Nous ne pourrons pas vous répondre\. Pour obtenir de l’aide, contactez-nous directement\./)
  assert.equal(await el(page, '.btn-submit').textContent(), 'Envoyer mon retour')
  await el(page, 'textarea').fill('  Il manque les heures  ')
  assert.equal(await el(page, '.compteur').textContent(), '24/500')
  await el(page, '.btn-submit').click()
  await merciVisible(page)
  assert.deepEqual(envois[0].data.map((d) => [d.fieldId, d.data]), [[1570387, 'non'], [1570390, 'Il manque les heures']])
})

test('pouce en haut après le pouce en bas : champ fermé, envoi sans commentaire', async () => {
  const page = await nouvellePage(nav)
  const envois = await libwizard(page)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  await el(page, '#btn-vote-n').click()
  await el(page, 'textarea').fill('brouillon')
  await el(page, '#btn-vote-y').click()
  await merciVisible(page)
  assert.deepEqual(envois[0].data.map((d) => d.data), ['oui', ''])
})

test('refus du serveur : message d’erreur, commentaire gardé, nouvel essai possible', async () => {
  const page = await nouvellePage(nav)
  await libwizard(page, { statutEnvoi: 500 })
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  await el(page, '#btn-vote-n').click()
  await el(page, 'textarea').fill('Commentaire important')
  await el(page, '.btn-submit').click()
  await attendre(page, () => document.querySelector('bib-retroaction-usager').shadowRoot.querySelector('.erreur').textContent)
  assert.equal((await el(page, '.erreur').textContent()).trim(), 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.')
  assert.equal(await el(page, '.erreur').getAttribute('role'), 'alert')
  assert.equal(await el(page, 'textarea').inputValue(), 'Commentaire important')
  assert.equal(await el(page, '.btn-submit').textContent(), 'Envoyer mon retour')
  assert.equal(await el(page, '.btn-submit').getAttribute('aria-disabled'), 'false')
  assert.equal(await el(page, '.resultat').isHidden(), true)
  await el(page, 'textarea').fill('Commentaire important!')
  assert.equal(await el(page, '.erreur').textContent(), '', 'l’erreur s’efface quand on écrit')
})

test('envoi en cours : focus gardé, « Envoi en cours… » annoncé ; adresse complète', async () => {
  const page = await nouvellePage(nav)
  let liberer
  const attente = new Promise((r) => (liberer = r))
  const envois = []
  await page.route('https://umontreal.libwizard.com/**', async (route) => {
    const req = route.request()
    if (req.method() === 'OPTIONS') return route.fulfill({ headers: { ...CORS, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    await attente
    if (req.url().endsWith('/getguid')) return route.fulfill({ json: 'g', headers: CORS })
    envois.push(JSON.parse(req.postData()))
    return route.fulfill({ json: {}, headers: CORS })
  })
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  await page.evaluate(() => history.replaceState({}, '', '/essai.html?q=recherche+privee#ancre'))
  await el(page, '#btn-vote-n').click()
  await el(page, '.btn-submit').focus()
  await page.keyboard.press('Enter')
  await attendre(page, () => document.querySelector('bib-retroaction-usager').shadowRoot.querySelector('.annonce').textContent)
  assert.equal(await el(page, '.annonce').textContent(), 'Envoi en cours…')
  assert.equal(await el(page, '.btn-submit').textContent(), 'Envoi en cours…')
  assert.equal(await focusInterne(page), 'btn btn-submit')
  assert.equal(await el(page, '.btn-submit').getAttribute('aria-disabled'), 'true')
  assert.equal(await el(page, '#btn-vote-y').getAttribute('aria-disabled'), 'true')
  liberer()
  await merciVisible(page)
  assert.equal(envois.length, 1)
  assert.equal(envois[0].referrer, 'http://localhost:9999/essai.html?q=recherche+privee#ancre')
})

test('habillage d’un site (feuille ajoutée à la racine fantôme) : classes toujours présentes', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { scripts: SCRIPT, corps: '<bib-retroaction-usager></bib-retroaction-usager>' })
  const selecteurs = ['.survey-title', '.radio-group', 'form', '#btn-vote-y', '#btn-vote-n', 'textarea.input-sm', '.write-us.f6', '.form-group-submit.d-flex']
  const classes = await page.evaluate((l) => l.map((s) => !!document.querySelector('bib-retroaction-usager').shadowRoot.querySelector(s)), selecteurs)
  assert.deepEqual(classes, selecteurs.map(() => true))
})

test('jetons d’Harmonium repris (couleurs, rayon, focus)', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, {
    scripts: SCRIPT,
    corps: '<div style="--couleur-fond-fort: rgb(5, 56, 121); --couleur-sur-fonce: rgb(255, 255, 255); --couleur-focus: rgb(1, 2, 3); --rayon-plein: 999px"><bib-retroaction-usager></bib-retroaction-usager></div>',
  })
  await el(page, '#btn-vote-n').click()
  await el(page, '.btn-submit').focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  const styles = await page.evaluate(() => {
    const b = document.querySelector('bib-retroaction-usager').shadowRoot.querySelector('.btn-submit')
    const s = getComputedStyle(b)
    return { fond: s.backgroundColor, texte: s.color, rayon: s.borderRadius, focus: s.outlineColor }
  })
  assert.deepEqual(styles, { fond: 'rgb(5, 56, 121)', texte: 'rgb(255, 255, 255)', rayon: '999px', focus: 'rgb(1, 2, 3)' })
})
