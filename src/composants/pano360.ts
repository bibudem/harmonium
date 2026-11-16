/*
 * Visite virtuelle 360° (facultatif) : branche les figures [data-pano360]. Le bouton « Démarrer la visite
 * virtuelle » charge photo-sphere-viewer et le panorama, puis remplace l'aperçu par la visite.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-pano360.min.js"></script>
 *
 * Rien n'est chargé avant le clic. La visionneuse vient de jsDelivr (module ESM de @photo-sphere-viewer/core
 * et sa feuille de style) ; un site qui la sert lui-même donne d'autres adresses par data-module (un module
 * qui exporte Viewer) et data-feuille (vide : aucune feuille) sur la figure.
 *
 * Accessibilité : la visite est un élément role="application" (aria-roledescription « visite virtuelle »),
 * nommé par data-nom et décrit par la légende (data-description). Le clavier (flèches, + et −) n'est écouté
 * que lorsqu'elle a le focus (keyboard: 'always' écouterait toute la fenêtre et bloquerait le défilement).
 * Les boutons de la barre de photo-sphere-viewer sont des <div> : ils reçoivent rôle et nom (title), et
 * Espace les active comme Entrée. En cas d'échec, le bouton revient et l'état invite à l'image à plat.
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */

const MODULE = 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5/+esm'
const FEUILLE = 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core@5/index.min.css'

const LANG = {
  zoom: 'Zoom',
  zoomOut: 'Dézoomer',
  zoomIn: 'Zoomer',
  moveUp: 'Haut',
  moveDown: 'Bas',
  moveLeft: 'Gauche',
  moveRight: 'Droite',
  fullscreen: 'Plein écran',
  loadError: 'Le panorama n’a pas pu être chargé.',
  webglError: 'Votre navigateur ne permet pas d’afficher la visite 360° (WebGL non disponible).',
  twoFingers: 'Utilisez deux doigts pour naviguer',
  ctrlZoom: 'Utilisez Ctrl + molette pour zoomer',
}

type Visionneuse = {
  addEventListener: (type: string, rappel: () => void, options?: { once?: boolean }) => void
  startKeyboardControl: () => void
  stopKeyboardControl: () => void
}
type ModuleVisionneuse = { Viewer: new (options: Record<string, unknown>) => Visionneuse }

const feuillesChargees = new Set<string>()

function chargerFeuille(adresse: string) {
  if (!adresse || feuillesChargees.has(adresse)) return Promise.resolve()
  feuillesChargees.add(adresse)
  return new Promise<void>((resoudre, rejeter) => {
    const lien = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: adresse })
    lien.addEventListener('load', () => resoudre())
    lien.addEventListener('error', () => rejeter(new Error(`feuille introuvable : ${adresse}`)))
    document.head.append(lien)
  })
}

function rendreBoutonsAccessibles(conteneur: HTMLElement) {
  for (const bouton of conteneur.querySelectorAll<HTMLElement>('.psv-button')) {
    bouton.setAttribute('role', 'button')
    const nom = bouton.getAttribute('title')
    if (nom && !bouton.getAttribute('aria-label')) bouton.setAttribute('aria-label', nom)
  }
}

function brancherPano(figure: HTMLElement) {
  const visionneuse = figure.querySelector<HTMLElement>('[data-visionneuse]')
  const bouton = figure.querySelector<HTMLButtonElement>('[data-demarrer]')
  const etat = figure.querySelector<HTMLElement>('[data-etat]')
  if (!visionneuse || !bouton || !etat) return
  figure.setAttribute('data-pret', '')
  bouton.hidden = false

  bouton.addEventListener('click', async () => {
    bouton.disabled = true
    etat.textContent = 'Chargement de la visite virtuelle…'
    try {
      const [{ Viewer }] = await Promise.all([
        import(/* @vite-ignore */ figure.dataset.module || MODULE) as Promise<ModuleVisionneuse>,
        chargerFeuille(figure.dataset.feuille ?? FEUILLE),
      ])
      const conteneur = document.createElement('div')
      conteneur.className = 'bib-pano360__visite'
      conteneur.tabIndex = 0
      conteneur.setAttribute('role', 'application')
      conteneur.setAttribute('aria-roledescription', 'visite virtuelle')
      conteneur.setAttribute('aria-label', figure.dataset.nom ?? 'Visite virtuelle 360°')
      if (figure.dataset.description) conteneur.setAttribute('aria-describedby', figure.dataset.description)
      visionneuse.replaceChildren(conteneur, etat)

      const visite = new Viewer({
        container: conteneur,
        panorama: figure.dataset.image,
        caption: figure.dataset.legende,
        navbar: ['zoom', 'move', 'caption', 'fullscreen'],
        keyboard: 'fullscreen',
        lang: LANG,
      })
      visite.addEventListener(
        'ready',
        () => {
          rendreBoutonsAccessibles(conteneur)
          etat.textContent = ''
          if (conteneur.contains(document.activeElement)) visite.startKeyboardControl()
        },
        { once: true },
      )
      conteneur.addEventListener('keydown', (e) => {
        const cible = (e.target as HTMLElement).closest<HTMLElement>('.psv-button')
        if (e.key !== ' ' || !cible) return
        e.preventDefault()
        cible.click()
      })
      conteneur.addEventListener('focusin', () => visite.startKeyboardControl())
      conteneur.addEventListener('focusout', (e) => {
        if (!conteneur.contains(e.relatedTarget as Node)) visite.stopKeyboardControl()
      })
      const aide = figure.querySelector<HTMLElement>('[data-aide]')
      if (aide) aide.hidden = false
      // Le bouton a disparu : le focus passe à la visite
      conteneur.focus()
    } catch (erreur) {
      console.error('Visite virtuelle :', erreur)
      bouton.disabled = false
      etat.textContent = 'La visite virtuelle n’a pas pu être chargée. Utilisez le lien vers l’image à plat sous l’aperçu.'
    }
  })
}

function brancher() {
  document.querySelectorAll<HTMLElement>('[data-pano360]:not([data-pret])').forEach(brancherPano)
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
