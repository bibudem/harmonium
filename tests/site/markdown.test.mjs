import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { rendreMarkdown, lirePage } from '../../site/markdown.mjs'
import { donneesCatalogue } from '../../site/donnees/catalogue.mjs'
import { donneesIntegration } from '../../site/integration.mjs'
import { donneesFondations } from '../../site/donnees/fondations.mjs'
import { donneesHabillage } from '../../site/donnees/habillage.mjs'
import { statutComposant, verifierSuivi } from '../../site/integration.mjs'
import { pagesAPlat } from '../../site/navigation.mjs'

const RACINE = new URL('../../site/pages/', import.meta.url)

test('le Markdown conserve les ancres et les blocs de code comme texte', () => {
  const html = rendreMarkdown('## Utilisation {#utilisation}\n\n```html\n<script>nePasExecuter()</script>\n::exemple[inexistant.html]\n{{inconnue}}\n```')
  assert.match(html, /<h2 id="utilisation">Utilisation<\/h2>/)
  assert.match(html, /&lt;script&gt;nePasExecuter\(\)&lt;\/script&gt;/)
  assert.match(html, /::exemple\[inexistant.html\]/)
})

test('les données calculées restent à jour et les directives invalides échouent', () => {
  assert.equal(rendreMarkdown('{{tableau}}', { tableau: '<table><tr><td>42</td></tr></table>' }).trim(), '<table><tr><td>42</td></tr></table>')
  assert.throws(() => rendreMarkdown('{{absente}}'), /Donnée inconnue/)
  assert.throws(() => rendreMarkdown('::exemple[../absent.html]'), /Exemple invalide/)
  assert.throws(() => rendreMarkdown('::cartes[absent]'), /Bloc éditorial inconnu/)
})

test('le contenu et les ressources du bouton sont distincts, l’exemple est le vrai HTML', async () => {
  const page = await lirePage(new URL('composants/bouton.md', RACINE), donneesHabillage())
  assert.match(page.contenu, /class="bib-bouton/)
  assert.doesNotMatch(page.contenu, /<style\b|<script\b/)
  const source = await readFile(new URL('composants/bouton.md', RACINE), 'utf8')
  assert.match(source, /::exemple\[composants\/bouton\/01.html\]/)
})

test('les styles et scripts des aperçus sont chargés depuis des fichiers séparés', async () => {
  const page = await lirePage(new URL('composants/entete.md', RACINE), donneesHabillage())
  assert.ok(page.tete.includes('exemples/composants/entete/style.css'))
  assert.ok(page.fin.includes('src="@@dist/bib-entete.min.js"'))
  assert.doesNotMatch(page.tete, /<style\b/)
  const pied = await lirePage(new URL('composants/pied-de-page.md', RACINE), donneesHabillage())
  assert.ok(pied.tete.includes('exemples/composants/pied-de-page/style.css'))
  assert.doesNotMatch(pied.tete, /<style\b/)
})

test('chaque page du plan possède une source Markdown qui se construit', async () => {
  const donnees = { ...await donneesFondations(), ...await donneesCatalogue(), ...donneesIntegration(), ...donneesHabillage() }
  for (const { chemin } of pagesAPlat()) {
    const page = await lirePage(new URL(chemin.replace(/\.html$/, '.md'), RACINE), donnees)
    assert.ok(page.titre, chemin)
    assert.doesNotMatch(page.contenu, /HARMONIUMDONNEE|%7B%7B[\w-]+%7D%7D/, chemin)
  }
  async function fichiers(url) {
    for (const e of await readdir(url, { withFileTypes: true })) {
      if (e.isDirectory()) await fichiers(new URL(e.name + '/', url))
      else assert.ok(e.name.endsWith('.md'), e.name)
    }
  }
  await fichiers(RACINE)
})

test('les fiches affichent la maturité, jamais les sites ; le suivi reste validé à part', () => {
  assert.match(statutComposant(), /Stable/)
  assert.match(statutComposant('beta'), /Bêta/)
  assert.throws(() => statutComposant('inconnu'), /Statut de composant inconnu/)
  const fixture = { sites: [{ id: 'a', nom: 'Site A', etat: 'a-integrer' }], composants: { 'composants/bouton.html': { a: { etat: 'integre' } } } }
  assert.throws(() => verifierSuivi(fixture), /Validation incomplète/)
  Object.assign(fixture.composants['composants/bouton.html'].a, { date: '2026-11-16', preuve: 'Parcours vérifiés.' })
  assert.doesNotThrow(() => verifierSuivi(fixture))
})

test('aucune fiche ne nomme un site dans son en-tête', async () => {
  const donnees = { ...await donneesFondations(), ...await donneesCatalogue(), ...donneesIntegration(), ...donneesHabillage() }
  for (const { chemin } of pagesAPlat()) {
    if (!chemin.startsWith('composants/')) continue
    const page = await lirePage(new URL(chemin.replace(/\.html$/, '.md'), RACINE), donnees).catch(() => null)
    if (!page) continue
    statutComposant(page.statut)
  }
})

test('chaque fiche du catalogue actif a son suivi d’intégration', async () => {
  const communs = JSON.parse(await readFile(new URL('../../site/donnees/composants.json', import.meta.url), 'utf8'))
  const archives = new Set(['carte-texte', 'carte-depliable', 'carte-revelation', 'colonnes-texte'].map((nom) => `composants/${nom}.html`))
  for (const { chemin } of pagesAPlat()) {
    if (!chemin.startsWith('composants/') || chemin === 'composants/index.html' || archives.has(chemin)) continue
    assert.ok(communs.includes(chemin), chemin + ' absent de composants.json')
  }
})

test('aucun bloc HTML de présentation ne se trouve dans les sources éditoriales', async () => {
  const { default: MarkdownIt } = await import('markdown-it')
  const { default: matter } = await import('gray-matter')
  const md = new MarkdownIt({ html: true })
  for (const { chemin } of pagesAPlat()) {
    const { content } = matter(await readFile(new URL(chemin.replace(/\.html$/, '.md'), RACINE), 'utf8'))
    assert.equal(md.parse(content, {}).filter((t) => t.type === 'html_block').length, 0, chemin)
  }
})
