import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import { lancer, nouvellePage, ouvrir } from './outils.mjs'

let nav
before(async () => (nav = await lancer()))
after(() => nav?.close())

const FEUILLE = '<link rel="stylesheet" href="/dist/bib-alertes.min.css">'
const alerte = (type, contenu = '<p>Texte.</p>', icone = true) => `
  <div class="bib-alerte bib-alerte--${type}" id="${type}">
    ${icone ? '<span class="bib-alerte__icone" aria-hidden="true"></span>' : ''}
    <div class="bib-alerte__message"><span class="bib-masque">${type} : </span>${contenu}</div>
  </div>`

const styles = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s)
    const icone = el.querySelector('.bib-alerte__icone')
    const avant = icone && getComputedStyle(icone, '::before')
    return {
      fondIcone: icone && getComputedStyle(icone).backgroundColor,
      couleurIcone: icone && getComputedStyle(icone).color,
      masque: avant && (avant.maskImage || avant.webkitMaskImage).slice(0, 26),
      tailleIcone: avant && `${avant.width}x${avant.height}`,
      fondMessage: getComputedStyle(el.querySelector('.bib-alerte__message')).backgroundColor,
      rayon: getComputedStyle(el).borderRadius,
    }
  }, sel)

test('quatre types : couleurs par défaut, icône dessinée par masque', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { corps: FEUILLE + ['info', 'succes', 'avertissement', 'erreur'].map((t) => alerte(t)).join('') })
  const attendu = {
    info: ['rgb(204, 226, 243)', 'rgb(0, 87, 172)'],
    succes: ['rgb(214, 240, 226)', 'rgb(2, 66, 68)'],
    avertissement: ['rgb(255, 224, 194)', 'rgb(179, 52, 16)'],
    erreur: ['rgb(254, 225, 222)', 'rgb(177, 0, 0)'],
  }
  for (const [type, [fond, couleur]] of Object.entries(attendu)) {
    const s = await styles(page, `#${type}`)
    assert.equal(s.fondIcone, fond, type)
    assert.equal(s.couleurIcone, couleur, type)
    assert.equal(s.masque, 'url("data:image/svg+xml,%3', type)
    assert.equal(s.tailleIcone, '24px x 24px'.replace(' x ', 'x'), type)
    assert.equal(s.fondMessage, 'rgb(238, 244, 247)')
    assert.equal(s.rayon, '0px 12px 12px 0px')
  }
})

test('jetons du site repris : mode sombre compris', async () => {
  const page = await nouvellePage(nav)
  const jetons = '<style>:root { --alerte-fond: #1a2338; --alerte-info-fond: #1d2f4b; --alerte-info-icone: #93c3f5; --rayon-petit: 4px; }</style>'
  await ouvrir(page, { corps: jetons + FEUILLE + alerte('info') })
  const s = await styles(page, '#info')
  assert.deepEqual([s.fondIcone, s.couleurIcone, s.fondMessage, s.rayon], ['rgb(29, 47, 75)', 'rgb(147, 195, 245)', 'rgb(26, 35, 56)', '0px 4px 4px 0px'])
})

test('accessibilité : type lu en texte masqué, icône cachée, pas de rôle d’alerte', async () => {
  const page = await nouvellePage(nav)
  await ouvrir(page, { corps: FEUILLE + alerte('avertissement', '<p>Salle fermée.</p>') })
  const arbre = await page.accessibility.snapshot({ root: await page.$('#avertissement'), interestingOnly: false })
  const textes = JSON.stringify(arbre)
  assert.match(textes, /"name":"avertissement :"/)
  assert.match(textes, /Salle fermée\./)
  assert.doesNotMatch(textes, /"role":"alert"/)
  const masque = await page.evaluate(() => {
    const r = document.querySelector('.bib-masque').getBoundingClientRect()
    return r.width <= 1 && r.height <= 1
  })
  assert.equal(masque, true, 'le libellé du type est invisible à l’écran')
})

test('sans icône, texte long sans espace : rien ne déborde de la colonne', async () => {
  const page = await nouvellePage(nav, { largeur: 320 })
  await ouvrir(page, { corps: FEUILLE + '<main style="padding:16px">' + alerte('info', '<p>' + 'x'.repeat(200) + '</p>', false) + '</main>' })
  const { largeur, page: largeurPage } = await page.evaluate(() => ({ largeur: document.querySelector('#info').getBoundingClientRect().right, page: innerWidth }))
  assert.ok(largeur <= largeurPage, `${largeur} ≤ ${largeurPage}`)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
})

test('contraste élevé : l’icône reste visible', async () => {
  const ctx = await nav.newContext({ forcedColors: 'active' })
  const page = await nouvellePage(nav, { contexte: ctx })
  await ouvrir(page, { corps: FEUILLE + alerte('erreur') })
  const fond = await page.evaluate(() => getComputedStyle(document.querySelector('.bib-alerte__icone'), '::before').backgroundColor)
  assert.notEqual(fond, 'rgba(0, 0, 0, 0)')
  await ctx.close()
})
