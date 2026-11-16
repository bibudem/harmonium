/*
 * Carte des bibliothèques (facultatif) : montre la zone de la carte, les boutons de région et « Voir sur la
 * carte » de carte-bibliotheques.css, et ne charge Leaflet (et les tuiles d'OpenStreetMap) qu'à la demande.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-carte-bibliotheques.min.js"></script>
 *
 * Repères : [data-carte-bibliotheques] (data-leaflet-js, data-leaflet-css : une autre adresse de Leaflet 1.9 ;
 * data-tuiles : un autre fond de carte), [data-regions] et ses [data-region], [data-zone-carte], [data-carte],
 * [data-afficher], [data-etat-carte], et un [data-lieu] par bibliothèque (data-lat, data-lng, data-region,
 * data-itineraire) avec son bouton [data-voir], ses [data-pastilles] et ses [data-details].
 *
 * - Leaflet n'est chargé qu'une fois par page, même avec plusieurs cartes. En cas d'échec, un message le dit ;
 *   la liste reste à jour.
 * - Clavier : « Afficher la carte » donne le focus à la carte ; la bulle d'un marqueur reçoit le focus à
 *   l'ouverture et le rend au marqueur à la fermeture ; Échap la ferme. La molette ne zoome pas (elle ne piège
 *   pas le défilement de la page).
 */
const LEAFLET_JS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
const LEAFLET_CSS = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
const TUILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

type Lieu = { element: HTMLElement; nom: string; region: string; coords: [number, number] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type L = any

const reduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const chargements = new Map<string, Promise<void>>()

/** Charge un script ou une feuille une seule fois par page */
function charger(adresse: string, type: 'script' | 'style') {
  let promesse = chargements.get(adresse)
  if (!promesse) {
    promesse = new Promise<void>((resoudre, rejeter) => {
      const element = type === 'script' ? Object.assign(document.createElement('script'), { src: adresse }) : Object.assign(document.createElement('link'), { rel: 'stylesheet', href: adresse })
      element.addEventListener('load', () => resoudre())
      element.addEventListener('error', () => {
        chargements.delete(adresse)
        element.remove()
        rejeter(new Error(`${adresse} introuvable`))
      })
      document.head.append(element)
    })
    chargements.set(adresse, promesse)
  }
  return promesse
}

async function leaflet(racine: HTMLElement): Promise<L> {
  const w = window as unknown as { L?: L }
  await Promise.all([charger(racine.dataset.leafletCss || LEAFLET_CSS, 'style'), w.L ? undefined : charger(racine.dataset.leafletJs || LEAFLET_JS, 'script')])
  if (!w.L) throw new Error('Leaflet est absent')
  return w.L
}

function initialiser(racine: HTMLElement) {
  const zone = racine.querySelector<HTMLElement>('[data-zone-carte]')!
  const conteneur = racine.querySelector<HTMLElement>('[data-carte]')!
  const etat = racine.querySelector<HTMLElement>('[data-etat-carte]')!
  const regions = racine.querySelector<HTMLElement>('[data-regions]')
  const lieux: Lieu[] = [...racine.querySelectorAll<HTMLElement>('[data-lieu]')].map((element) => ({
    element,
    nom: element.dataset.lieu!,
    region: element.dataset.region ?? '',
    coords: [Number(element.dataset.lat), Number(element.dataset.lng)],
  }))
  if (!zone || !conteneur || !lieux.length) return

  zone.hidden = false
  if (regions) regions.hidden = false
  for (const bouton of racine.querySelectorAll<HTMLElement>('[data-voir]')) bouton.hidden = false

  let carte: L
  let chargement: Promise<void> | undefined
  const groupes = new Map<string, L>()
  const marqueurs = new Map<string, L>()

  const mettreEnEvidence = (nom: string | null) => {
    for (const lieu of lieux) lieu.element.toggleAttribute('data-actif', lieu.nom === nom)
  }

  const cadrer = (region: string) => {
    const groupe = groupes.get(region)
    if (carte && groupe) carte.fitBounds(groupe.getBounds(), { padding: [40, 40], maxZoom: 15, animate: !reduit() })
    for (const bouton of regions?.querySelectorAll<HTMLElement>('[data-region]') ?? []) bouton.setAttribute('aria-pressed', String(bouton.dataset.region === region))
  }

  // Contenu de la bulle, construit en DOM à partir de la liste (aucun HTML injecté)
  const bulle = (lieu: Lieu) => {
    const div = document.createElement('div')
    div.append(Object.assign(document.createElement('strong'), { className: 'bib-carte-bibliotheques__bulle-titre', textContent: lieu.nom }))
    const pastilles = [...lieu.element.querySelectorAll('[data-pastilles] li')].map((li) => li.textContent!.trim())
    if (pastilles.length) {
      const ul = Object.assign(document.createElement('ul'), { className: 'bib-carte-bibliotheques__bulle-liste' })
      for (const texte of pastilles) ul.append(Object.assign(document.createElement('li'), { textContent: texte }))
      div.append(ul)
    }
    const details = [...lieu.element.querySelectorAll('[data-details] li')].map((li) => li.textContent!.trim())
    if (details.length) div.append(Object.assign(document.createElement('p'), { className: 'bib-carte-bibliotheques__bulle-details', textContent: details.join(' · ') }))
    if (lieu.element.dataset.itineraire) div.append(Object.assign(document.createElement('a'), { href: lieu.element.dataset.itineraire, textContent: 'Itinéraire Google Maps' }))
    return div
  }

  const afficherCarte = () =>
    (chargement ??= (async () => {
      etat.textContent = 'Chargement de la carte…'
      try {
        const L = await leaflet(racine)
        conteneur.replaceChildren()
        carte = L.map(conteneur, { scrollWheelZoom: false, zoomControl: false })
        L.control.zoom({ zoomInTitle: 'Zoom avant', zoomOutTitle: 'Zoom arrière' }).addTo(carte)
        L.tileLayer(racine.dataset.tuiles || TUILES, {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(carte)
        carte.attributionControl.setPrefix(false)

        lieux.forEach((lieu, i) => {
          if (!groupes.has(lieu.region)) groupes.set(lieu.region, L.featureGroup().addTo(carte))
          const icone = L.divIcon({ className: 'bib-carte-bibliotheques__marqueur', html: `<span aria-hidden="true">${i + 1}</span>`, iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -13] })
          const marqueur = L.marker(lieu.coords, { icon: icone, title: `${i + 1}. ${lieu.nom}`, alt: lieu.nom }).bindPopup(bulle(lieu)).addTo(groupes.get(lieu.region))
          marqueurs.set(lieu.nom, marqueur)
          // Clavier : à l'ouverture, le focus entre dans la bulle ; à la fermeture, il revient au marqueur
          marqueur.on('popupopen', (e: L) => {
            const element = e.popup.getElement() as HTMLElement | null
            const fermer = element?.querySelector('.leaflet-popup-close-button')
            fermer?.setAttribute('aria-label', 'Fermer')
            fermer?.setAttribute('title', 'Fermer')
            element?.querySelector<HTMLElement>('a[href]:not(.leaflet-popup-close-button)')?.focus({ preventScroll: true })
            mettreEnEvidence(lieu.nom)
          })
          marqueur.on('popupclose', (e: L) => {
            const element = e.popup.getElement() as HTMLElement | null
            if (!element || element.contains(document.activeElement) || document.activeElement === document.body) marqueur.getElement()?.focus({ preventScroll: true })
          })
        })
        // Échap dans une bulle la ferme (Leaflet ne l'écoute que sur le fond de carte)
        conteneur.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && (e.target as HTMLElement).closest('.leaflet-popup')) carte.closePopup()
        })
        cadrer(lieux[0].region)
        etat.textContent = ''
        racine.toggleAttribute('data-carte-prete', true)
      } catch (erreur) {
        console.error('Carte des bibliothèques :', erreur)
        chargement = undefined
        etat.textContent = 'La carte n’a pas pu être chargée. La liste des bibliothèques reste à jour.'
      }
    })())

  racine.querySelector('[data-afficher]')?.addEventListener('click', async () => {
    await afficherCarte()
    // Le bouton a disparu avec l'invite : le focus passe à la carte
    // (Leaflet rend la carte focalisable)
    if (carte) conteneur.focus({ preventScroll: true })
  })

  // Un bouton de région charge la carte si elle ne l'est pas encore, puis la cadre
  regions?.addEventListener('click', async (e) => {
    const bouton = (e.target as HTMLElement).closest<HTMLElement>('[data-region]')
    if (!bouton) return
    await afficherCarte()
    cadrer(bouton.dataset.region!)
  })

  for (const lieu of lieux) {
    lieu.element.querySelector('[data-voir]')?.addEventListener('click', async () => {
      await afficherCarte()
      const marqueur = marqueurs.get(lieu.nom)
      if (!carte || !marqueur) return
      cadrer(lieu.region)
      mettreEnEvidence(lieu.nom)
      // Sur téléphone, la carte est au-dessus de la liste : la ramener à l'écran
      const r = zone.getBoundingClientRect()
      if (r.top < 0 || r.bottom > window.innerHeight) zone.scrollIntoView({ block: 'nearest', behavior: reduit() ? 'auto' : 'smooth' })
      // Zoom 17 : sépare les bibliothèques voisines du campus principal
      carte.setView(marqueur.getLatLng(), Math.max(carte.getZoom(), 17), { animate: !reduit() })
      marqueur.openPopup()
    })
  }
}

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-carte-bibliotheques]:not([data-pret])')) {
    racine.toggleAttribute('data-pret', true)
    initialiser(racine)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
