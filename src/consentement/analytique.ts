/*
 * Chargement de Google (conteneur Google Tag Manager ou Google Analytics en direct) et de
 * Microsoft Clarity, seulement après un consentement valide. Un outil dont l'identifiant n'est
 * pas fourni n'est pas chargé.
 *
 * Avec un conteneur GTM, le chargement suit la séquence standard de Google : signal
 * gtm.start, script gtm.js, puis une page vue envoyée par gtag. Un site à navigation côté client
 * signale chaque nouvelle page avec l'événement « bib:page-vue » (voir envoyerPageVue).
 */

// Témoins posés sur le domaine du site (ceux de clarity.ms ou bing.com, comme MUID, ne sont
// pas accessibles d'ici). _gat_* : limitation de débit de GA ; _gcl_* : conversion linker
// d'un conteneur GTM.
const TEMOINS_STATISTIQUES = [/^_ga$/, /^_ga_.+/, /^_gid$/, /^_gat(_.+)?$/, /^_gcl_.+/, /^_clck$/, /^_clsk$/]

type Fenetre = typeof window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  clarity?: { (...args: unknown[]): void; q?: unknown[] }
}
const fenetre = window as Fenetre

export interface Identifiants {
  /** Conteneur Google Tag Manager (GTM-XXXXXX) */
  gtm?: string | null
  /** Mesure Google Analytics 4 (G-XXXXXXXXXX) */
  ga?: string | null
  /** Projet Microsoft Clarity */
  clarity?: string | null
}

const ajouterScript = (src: string) => {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.append(script)
}

let defautEnvoye = false

function gtag(...args: unknown[]) {
  fenetre.dataLayer ??= []
  if (!fenetre.gtag) {
    // gtag() doit pousser l'objet arguments : c'est ce que lit Google Tag Manager
    fenetre.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      fenetre.dataLayer!.push(arguments)
    }
  }
  // Toujours en premier, même si le site a défini gtag lui-même
  if (!defautEnvoye) {
    defautEnvoye = true
    fenetre.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    })
  }
  fenetre.gtag(...args)
}

/**
 * Supprime les témoins de statistiques de l'hôte et de tous ses domaines parents : Google
 * Analytics pose les siens sur le domaine le plus large possible (.umontreal.ca,
 * .exemple.org). Le navigateur ignore sans erreur les domaines refusés (suffixes publics).
 */
export function effacerTemoinsStatistiques() {
  const morceaux = window.location.hostname.split('.')
  const domaines = morceaux.slice(0, -1).flatMap((_, i) => {
    const domaine = morceaux.slice(i).join('.')
    return i === 0 ? [domaine, `.${domaine}`] : [`.${domaine}`]
  })
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  document.cookie
    .split('; ')
    .map((morceau) => morceau.split('=')[0])
    .filter((nom) => TEMOINS_STATISTIQUES.some((motif) => motif.test(nom)))
    .forEach((nom) => {
      document.cookie = `${nom}=; ${expire}`
      domaines.forEach((domaine) => {
        document.cookie = `${nom}=; ${expire}; domain=${domaine}`
      })
    })
}

let googleCharge = false
let gtmCharge = false
let clarityCharge = false

/** Vrai si ce composant a chargé un outil de statistiques dans cette page. */
export const statistiquesChargees = () => googleCharge || clarityCharge
let derniereAdresse = ''

/*
 * Page vue (conteneur GTM seulement), une fois par adresse. Appelée au chargement du conteneur,
 * puis à chaque événement « bib:page-vue » : un site à navigation côté client (Astro
 * ClientRouter, application monopage) le déclenche à chaque nouvelle page :
 *   window.dispatchEvent(new Event('bib:page-vue'))
 */
function envoyerPageVue() {
  if (!gtmCharge || location.href === derniereAdresse) return
  derniereAdresse = location.href
  gtag('event', 'page_view', {
    page_path: location.pathname,
    page_location: location.href,
    page_title: document.title,
  })
}
window.addEventListener('bib:page-vue', envoyerPageVue)

/** Active (ou coupe) les statistiques selon le choix de la personne */
export function appliquerStatistiques(accepte: boolean, { gtm, ga, clarity }: Identifiants) {
  if (accepte) {
    if (gtm || ga) gtag('consent', 'update', { analytics_storage: 'granted' })
    if (gtm && !gtmCharge) {
      gtmCharge = googleCharge = true
      fenetre.dataLayer!.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      ajouterScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`)
      envoyerPageVue()
    }
    if (ga && !gtm && !googleCharge) {
      googleCharge = true
      ajouterScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`)
      gtag('js', new Date())
      gtag('config', ga)
    }
    if (clarity && !fenetre.clarity) {
      const c: Fenetre['clarity'] = function () {
        // eslint-disable-next-line prefer-rest-params
        ;(c!.q ??= []).push(arguments)
      }
      fenetre.clarity = c
      clarityCharge = true
      ajouterScript(`https://www.clarity.ms/tag/${encodeURIComponent(clarity)}`)
    }
  } else {
    if (googleCharge) gtag('consent', 'update', { analytics_storage: 'denied' })
    // Plus aucune page vue (navigation côté client) après un refus
    gtmCharge = false
  }

  fenetre.clarity?.('consent', accepte)
  fenetre.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: accepte ? 'granted' : 'denied' })
  if (!accepte) effacerTemoinsStatistiques()
}
