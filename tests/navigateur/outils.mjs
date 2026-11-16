/*
 * Outils des tests dans le navigateur (Playwright, avec le Chrome installé sur le poste).
 *
 * Aucun serveur : toutes les requêtes vers http://localhost:9999 sont interceptées. Les pages
 * d'essai sont du HTML écrit dans chaque test, les scripts sont lus dans dist/ (lancer
 * `npm run build` avant ; `npm run test:navigateur` le fait). localhost est un contexte sécurisé :
 * IndexedDB et crypto.subtle y fonctionnent comme en production.
 */
import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

export const ORIGINE = 'http://localhost:9999'
const DIST = new URL('../../dist/', import.meta.url)

/** Lance Chrome (sans fenêtre). CHROME_PATH permet de désigner un autre exécutable. */
export function lancer() {
  return chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
}

/**
 * Nouvelle page (contexte vierge : témoins, IndexedDB et sessionStorage vides) dont l'origine
 * sert dist/ (scripts et feuilles de style) et les pages d'essai. Les erreurs JavaScript sont relevées dans page.erreurs.
 */
export async function nouvellePage(navigateur, { largeur = 1200, hauteur = 800, contexte } = {}) {
  const ctx = contexte ?? (await navigateur.newContext({ viewport: { width: largeur, height: hauteur } }))
  const page = await ctx.newPage()
  page.erreurs = []
  page.on('pageerror', (e) => page.erreurs.push(e.message))
  page.pages = new Map()
  await page.route(`${ORIGINE}/**`, async (route) => {
    const { pathname } = new URL(route.request().url())
    if (page.pages.has(pathname)) return route.fulfill({ body: page.pages.get(pathname), contentType: 'text/html; charset=utf-8' })
    if (pathname.startsWith('/dist/')) {
      try {
        const type = pathname.endsWith('.css') ? 'text/css' : 'text/javascript'
        return route.fulfill({ body: await readFile(new URL(pathname.slice(6), DIST)), contentType: type })
      } catch {
        /* fichier absent : 404 ci-dessous */
      }
    }
    return route.fulfill({ status: 404, body: '' })
  })
  return page
}

/** Ouvre une page d'essai faite du HTML donné (le <head> charge les scripts demandés). */
export async function ouvrir(page, { scripts = [], corps = '', chemin = '/essai.html' }) {
  const tete = scripts.map((s) => `<script ${s.attributs ?? 'type="module"'} src="/dist/${s.fichier}"></script>`).join('\n')
  page.pages.set(chemin, `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><title>Essai</title>${tete}</head><body>${corps}</body></html>`)
  await page.goto(ORIGINE + chemin)
}

/** Adresse data: d'une réponse JSON (services d'avis et d'urgence simulés). */
export const json = (objet) => 'data:application/json,' + encodeURIComponent(JSON.stringify(objet))

/** Attend qu'une condition évaluée dans la page devienne vraie. */
export const attendre = (page, fn, arg) => page.waitForFunction(fn, arg, { timeout: 5000 })
