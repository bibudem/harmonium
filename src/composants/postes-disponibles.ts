/*
 * Postes de connexion à distance libres dans une zone de logiciels (facultatif) : remplit un groupe de fiches
 * d'état (fiches-etat.css) avec les postes libres, lus dans l'API des ordinateurs, puis relus toutes les
 * 30 secondes tant que l'onglet est visible.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-postes-disponibles.min.js"></script>
 *
 * Repères : [data-postes="<zone>"] sur le conteneur (data-api : une autre adresse de l'API ; data-intervalle :
 * millisecondes entre deux relectures), [data-message], [data-annonce], [data-liste], [data-compte] (facultatif)
 * et l'état d'erreur .bib-etat-erreur avec son bouton [data-reessayer].
 *
 * - Chaque poste libre est une fiche et un vrai lien `download` vers son fichier de connexion .rdp (adresse
 *   data:), fabriqué dans le navigateur.
 * - La liste n'est remplacée que si elle change : le focus clavier ne se perd pas à chaque relecture. Le
 *   nombre de postes libres est annoncé poliment, seulement quand il change.
 * - Une relecture manquée ne vide pas la liste ; l'erreur ne s'affiche qu'au premier chargement ou après trois
 *   échecs de suite.
 */
const API = 'https://api.bib.umontreal.ca/disponibilite/ordinateurs/?lieu=RDP'
const INTERVALLE = 30_000

const configuration = (adresse: string) =>
  [
    'screen mode id:i:2', 'session bpp:i:32', 'winposstr:s:0,1,691,455,2274,1457', 'compression:i:1', 'keyboardhook:i:2',
    'audiocapturemode:i:0', 'videoplaybackmode:i:1', 'connection type:i:7', 'networkautodetect:i:1', 'bandwidthautodetect:i:1',
    'displayconnectionbar:i:1', 'enableworkspacereconnect:i:0', 'disable wallpaper:i:0', 'allow font smoothing:i:0',
    'allow desktop composition:i:0', 'disable full window drag:i:1', 'disable menu anims:i:1', 'disable themes:i:0',
    'disable cursor setting:i:0', 'bitmapcachepersistenable:i:1', `full address:s:${adresse}`, 'audiomode:i:0',
    'redirectprinters:i:1', 'redirectcomports:i:0', 'redirectsmartcards:i:1', 'redirectclipboard:i:1', 'redirectposdevices:i:0',
    'autoreconnection enabled:i:1', 'authentication level:i:2', 'prompt for credentials:i:0', 'negotiate security layer:i:1',
    'remoteapplicationmode:i:0', 'gatewayusagemethod:i:4', 'gatewaycredentialssource:i:4', 'gatewayprofileusagemethod:i:0',
    'promptcredentialonce:i:0', 'use redirection server name:i:0', 'rdgiskdcproxy:i:0', 'use multimon:i:0', 'gatewaybrokeringtype:i:0',
    '',
  ].join('\n')

const adresseDe = (id: string) => `${id}${id.toLowerCase().includes('sap') ? '.bib.umontreal.ca' : '.fil.umontreal.ca'}`

// Icône « télécharger » (Phosphor DownloadSimple) : la liste est construite dans le navigateur
function telechargement() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  for (const [cle, valeur] of Object.entries({ viewBox: '0 0 256 256', width: '20', height: '20', fill: 'currentColor', 'aria-hidden': 'true', focusable: 'false', class: 'bib-fiches-etat__fleche' })) svg.setAttribute(cle, valeur)
  const chemin = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  chemin.setAttribute('d', 'M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z')
  svg.append(chemin)
  return svg
}

const span = (classe: string, texte: string) => Object.assign(document.createElement('span'), { className: classe, textContent: texte })
const pluriel = (n: number) => (n ? `${n} ${n > 1 ? 'postes disponibles' : 'poste disponible'}` : 'Aucun poste disponible')

type Poste = { id?: string; enabled?: boolean; state?: string }

function initialiser(racine: HTMLElement) {
  const zone = racine.dataset.postes!
  const api = racine.dataset.api || API
  const intervalle = Number(racine.dataset.intervalle) || INTERVALLE
  const message = racine.querySelector<HTMLElement>('[data-message]')!
  const annonce = racine.querySelector<HTMLElement>('[data-annonce]')!
  const liste = racine.querySelector<HTMLUListElement>('[data-liste]')!
  const compte = racine.querySelector<HTMLElement>('[data-compte]')
  const erreur = racine.querySelector<HTMLElement>('.bib-etat-erreur')
  let precedents = ''
  let minuterie: number | undefined
  let echecs = 0

  message.textContent = 'Chargement des postes disponibles…'

  const afficher = (ids: string[]) => {
    const cle = ids.join('|')
    if (cle === precedents && !liste.hidden) return
    precedents = cle
    liste.replaceChildren(
      ...ids.map((id) => {
        const adresse = adresseDe(id)
        const lien = document.createElement('a')
        lien.className = 'bib-fiches-etat__fiche'
        // Toujours libre, et un fichier à télécharger : filet, flèche vers le bas
        lien.dataset.statut = 'disponible'
        lien.dataset.fleche = 'bas'
        lien.href = `data:application/x-rdp;charset=utf-8,${encodeURIComponent(configuration(adresse))}`
        lien.download = `${adresse}.rdp`
        lien.append(span('bib-fiches-etat__libelle', id), span('bib-fiches-etat__etat', 'Disponible'), span('bib-masque', ' (fichier de connexion .rdp)'), telechargement())
        const li = document.createElement('li')
        li.append(lien)
        return li
      }),
    )
    liste.hidden = !ids.length
    message.hidden = Boolean(ids.length)
    message.textContent = 'Aucun poste disponible pour le moment.'
    const texte = pluriel(ids.length)
    if (compte) compte.textContent = texte
    annonce.textContent = texte
  }

  // Chaque chargement a son numéro : seul le plus récent programme la relecture suivante
  let tour = 0
  const charger = async () => {
    clearTimeout(minuterie)
    const ceTour = ++tour
    try {
      const separateur = api.includes('?') ? '&' : '?'
      const reponse = await fetch(`${api}${separateur}zone=${encodeURIComponent(zone)}`, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) })
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`)
      const donnees: Poste[] = await reponse.json()
      if (!Array.isArray(donnees)) throw new Error('La réponse n’est pas une liste.')
      echecs = 0
      if (erreur) erreur.hidden = true
      afficher(donnees.filter((p) => p?.id && p.enabled === true && p.state !== 'active').map((p) => String(p.id).trim()))
    } catch (e) {
      console.error(`Postes disponibles (${zone}) :`, e)
      echecs++
      if (!precedents || echecs >= 3) {
        liste.hidden = true
        message.hidden = true
        if (erreur) erreur.hidden = false
      }
    } finally {
      racine.setAttribute('aria-busy', 'false')
      if (ceTour === tour && !document.hidden && racine.isConnected) minuterie = window.setTimeout(charger, intervalle)
    }
  }

  const visibilite = () => {
    if (!racine.isConnected) return document.removeEventListener('visibilitychange', visibilite)
    if (document.hidden) clearTimeout(minuterie)
    else void charger()
  }
  document.addEventListener('visibilitychange', visibilite)
  racine.querySelector('[data-reessayer]')?.addEventListener('click', () => {
    if (erreur) erreur.hidden = true
    message.hidden = false
    message.textContent = 'Chargement des postes disponibles…'
    racine.tabIndex = -1
    racine.dataset.focusProgramme = ''
    racine.focus()
    void charger()
  })
  void charger()
}

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-postes]:not([data-pret])')) {
    racine.toggleAttribute('data-pret', true)
    initialiser(racine)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
