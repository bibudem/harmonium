/* Contenu éditorial en Markdown ; exemples HTML et ressources de présentation séparés. */
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import { echapper } from './outils.mjs'
import { cartes, logos } from './vues.mjs'

const RACINE_EXEMPLES = new URL('./exemples/', import.meta.url)
const cheminValide = (valeur) => typeof valeur === 'string' && /^[\w/-]+(?:\.[\w]+)?$/.test(valeur) && !valeur.split('/').includes('..')
const md = new MarkdownIt({ html: true, typographer: false })

// Les identifiants sont du contenu : conserver les ancres existantes des fiches.
md.core.ruler.before('inline', 'ancres-explicites', (state) => {
  for (let i = 0; i < state.tokens.length; i++) {
    const token = state.tokens[i]
    if (token.type !== 'heading_open') continue
    const inline = state.tokens[i + 1]
    const ancre = inline.content.match(/\s+\{#([\w-]+)\}$/)
    if (ancre) {
      token.attrSet('id', ancre[1])
      inline.content = inline.content.slice(0, ancre.index)
    }
  }
})

function donnee(nom, env) {
  if (!Object.hasOwn(env.donnees ?? {}, nom)) throw new Error(`Donnée inconnue : ${nom}`)
  return String(env.donnees[nom])
}
function exemple(chemin, env) {
  if (!cheminValide(chemin) || !chemin.endsWith('.html')) throw new Error(`Exemple invalide : ${chemin}`)
  const html = readFileSync(new URL(chemin, RACINE_EXEMPLES), 'utf8')
  return html.replace(/\{\{([\w-]+)\}\}/g, (_, nom) => donnee(nom, env))
}

// Directives autonomes, ignorées dans les blocs de code Markdown.
md.block.ruler.before('paragraph', 'bloc-harmonium', (state, ligne, fin, silencieux) => {
  const texte = state.src.slice(state.bMarks[ligne] + state.tShift[ligne], state.eMarks[ligne]).trim()
  const ex = texte.match(/^::(exemple|cartes|logos)\[([\w/.-]+)\]$/)
  const valeur = texte.match(/^\{\{([\w-]+)\}\}$/)
  if (!ex && !valeur) return false
  if (!silencieux) {
    const token = state.push('bloc_harmonium', '', 0)
    token.meta = ex ? { type: ex[1], chemin: ex[2] } : { donnee: valeur[1] }
    token.map = [ligne, ligne + 1]
    state.line = ligne + 1
  }
  return true
})
md.renderer.rules.bloc_harmonium = (tokens, i, options, env) => {
  const meta = tokens[i].meta
  if (meta.type === 'exemple') return exemple(meta.chemin, env) + '\n'
  if (meta.type) {
    const elements = env.blocs?.[meta.chemin]
    if (!Array.isArray(elements)) throw new Error(`Bloc éditorial inconnu : ${meta.chemin}`)
    return (meta.type === 'cartes' ? cartes(elements, (texte) => md.renderInline(texte)) : logos(elements)) + '\n'
  }
  return donnee(meta.donnee, env) + '\n'
}
md.inline.ruler.before('text', 'valeur-harmonium', (state, silencieux) => {
  const valeur = state.src.slice(state.pos).match(/^\{\{([\w-]+)\}\}/)
  if (!valeur) return false
  if (!silencieux) {
    const token = state.push('valeur_harmonium', '', 0)
    token.content = valeur[1]
  }
  state.pos += valeur[0].length
  return true
})
md.renderer.rules.valeur_harmonium = (tokens, i, options, env) => donnee(tokens[i].content, env)
md.renderer.rules.table_open = () => '<div class="tableau"><table>\n'
md.renderer.rules.table_close = () => '</table></div>\n'
md.renderer.rules.th_open = () => '<th scope="col">'

export function rendreMarkdown(texte, donnees = {}, blocs = {}) {
  return md.render(texte, { donnees, blocs })
}

export async function lirePage(fichier, donnees = {}) {
  const { data, content } = matter(await readFile(fichier, 'utf8'))
  if (typeof data.titre !== 'string' || !data.titre.trim()) throw new Error(`${fichier} : titre manquant`)
  let tete = '', fin = ''
  if (data.ressources) {
    if (!cheminValide(data.ressources)) throw new Error(`Ressources invalides : ${data.ressources}`)
    const ressources = JSON.parse(await readFile(new URL(`${data.ressources}/ressources.json`, RACINE_EXEMPLES), 'utf8'))
    tete = ressources.styles.map((href) => `<link rel="stylesheet" href="${echapper(href)}">`).join('\n')
    fin = ressources.scripts.map(({ src, attributs = '' }) => `<script ${attributs} src="${echapper(src)}"></script>`).join('\n')
  }
  const titre = data.logo
    ? `<h1 class="accueil-marque"><img src="${echapper(data.logo)}" alt="${echapper(data.titre)}" width="680" height="160" fetchpriority="high"></h1>`
    : `<h1>${echapper(data.titre)}</h1>`
  const description = data.description ? `<p class="chapeau">${md.renderInline(data.description, { donnees })}</p>` : ''
  const fichiers = data.fichiers ? `<p class="fichier">${md.renderInline(data.fichiers, { donnees })}</p>` : ''
  return { titre: data.titre, tete, fin, contenu: `${titre}\n${description}\n${fichiers}\n${rendreMarkdown(content, donnees, data.blocs)}` }
}
