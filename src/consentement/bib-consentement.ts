/*
 * <bib-consentement> : consentement aux statistiques des sites des Bibliothèques de l'UdeM.
 *
 *   <script type="module" src="https://cdn.jsdelivr.net/gh/…/harmonium@1/dist/bib-consentement.min.js"></script>
 *   <bib-consentement ga-id="G-XXXXXXXXXX" clarity-id="abc123"></bib-consentement>
 *
 * Attributs (tous facultatifs ; un outil sans identifiant n'est pas chargé) :
 *   gtm-id          conteneur Google Tag Manager (avec lui, ga-id est ignoré : le conteneur
 *                   charge Google Analytics lui-même)
 *   ga-id           mesure Google Analytics 4, chargée en direct (sans conteneur GTM)
 *   clarity-id      projet Microsoft Clarity
 *   url-vie-privee  page « Vie privée » (par défaut : celle de l'UdeM)
 *
 * Rien n'est chargé avant la réponse. Le choix est gardé dans le témoin décrit dans temoin.ts
 * (partagé sur bib.umontreal.ca et ses sous-domaines). Retirer son accord recharge la page :
 * les outils déjà chargés s'arrêtent vraiment.
 *
 * Pour rouvrir le panneau (bouton « Paramètres des témoins » du pied de page) :
 *   window.dispatchEvent(new Event('bib:parametres-temoins'))   ou   element.ouvrirParametres()
 *   ou <bib-consent-preferences-btn></bib-consent-preferences-btn> (dans le pied de page)
 * Chaque réponse déclenche, sur window, l'événement « bib:consentement » ({ detail: { statistiques } }).
 *
 * Tant que la carte est affichée, sa hauteur est publiée dans --bib-consentement-hauteur (sur
 * <html>) : le clavardage se place au-dessus, et la page garde le focus visible
 * (scroll-padding-bottom).
 *
 * Un seul élément par page : un second est ignoré (avertissement en console).
 */
import { formaterTemoin, lireChoix, type Choix } from './temoin.ts'
import { appliquerStatistiques, statistiquesChargees } from './analytique.ts'
import { gabarit } from './gabarit.ts'
import { STYLES } from './styles.ts'
import './bouton-parametres.ts'

const URL_VIE_PRIVEE = 'https://vie-privee.umontreal.ca/accueil/'

/** L'élément en service (un seul par page) */
let actif: BibConsentement | null = null

/** document.cookie, ou rien s'il est inaccessible (cadre isolé, témoins bloqués) */
function lireTemoins() {
  try {
    return document.cookie
  } catch {
    return ''
  }
}

function ecrireChoix(choix: Choix) {
  try {
    document.cookie = formaterTemoin(choix, window.location)
  } catch (erreur) {
    console.warn('[bib-consentement] Choix non enregistré (témoins indisponibles) : %o', erreur)
  }
}

class BibConsentement extends HTMLElement {
  #racine = this.attachShadow({ mode: 'open' })
  #carte: HTMLElement | null = null
  #panneau: HTMLDialogElement | null = null
  #case: HTMLInputElement | null = null
  #annonce: HTMLElement | null = null
  /** Élément de la page qui avait le focus avant la carte : il le retrouve après le choix */
  #retour: HTMLElement | null = null
  #ecouteur = () => this.ouvrirParametres()
  #observateur: ResizeObserver | null = null
  #mesurer = () => this.#publierHauteur()
  #paddingAvant: string | null = null

  connectedCallback() {
    if (actif && actif !== this && actif.isConnected) {
      console.warn('[bib-consentement] Un seul <bib-consentement> par page : celui-ci est ignoré.')
      return
    }
    actif = this

    const style = document.createElement('style')
    style.textContent = STYLES
    const contenu = document.createElement('div')
    contenu.innerHTML = gabarit(this.#urlViePrivee(), {
      gtm: !!this.getAttribute('gtm-id'),
      ga: !!this.getAttribute('ga-id'),
      clarity: !!this.getAttribute('clarity-id'),
    })
    this.#annonce = document.createElement('p')
    this.#annonce.className = 'visuellement-masque'
    this.#annonce.setAttribute('role', 'status')
    this.#annonce.lang = 'fr-CA'
    this.#racine.replaceChildren(style, contenu, this.#annonce)

    const q = <T extends Element>(sel: string) => this.#racine.querySelector<T>(sel)!
    this.#carte = q('[data-carte]')
    this.#panneau = q<HTMLDialogElement>('[data-panneau]')
    this.#case = q<HTMLInputElement>('[data-statistiques]')

    q('[data-accepter]').addEventListener('click', () => this.#enregistrer(true))
    q('[data-refuser]').addEventListener('click', () => this.#enregistrer(false))
    q('[data-details]').addEventListener('click', () => this.ouvrirParametres())
    q('[data-enregistrer]').addEventListener('click', () => this.#enregistrer(this.#case!.checked))
    q('[data-fermer]').addEventListener('click', () => this.#panneau!.close())
    this.#carte.addEventListener('focusin', (e) => {
      const avant = e.relatedTarget
      if (avant instanceof HTMLElement && !this.#racine.contains(avant)) this.#retour = avant
    })
    window.addEventListener('bib:parametres-temoins', this.#ecouteur)

    const choix = lireChoix(lireTemoins())
    if (choix) {
      // Réécrit à chaque visite, sans changer la date : Safari raccourcit la durée des témoins créés par JavaScript
      ecrireChoix(choix)
      if (choix.statistiques) appliquerStatistiques(true, this.#identifiants())
      return
    }
    // Pas encore de choix : la carte paraît
    this.#montrerCarte(true)
  }

  disconnectedCallback() {
    window.removeEventListener('bib:parametres-temoins', this.#ecouteur)
    if (actif !== this) return
    actif = null
    this.#montrerCarte(false)
  }

  /** Ouvre le panneau des préférences */
  ouvrirParametres() {
    if (!this.#panneau || !this.#case) {
      console.warn('[bib-consentement] ouvrirParametres() : élément pas encore dans la page.')
      return
    }
    if (this.#panneau.open) return
    this.#case.checked = lireChoix(lireTemoins())?.statistiques === true
    this.#panneau.showModal()
  }

  /** Autre nom de ouvrirParametres() */
  showPreferences() {
    this.ouvrirParametres()
  }

  #identifiants() {
    return { gtm: this.getAttribute('gtm-id'), ga: this.getAttribute('ga-id'), clarity: this.getAttribute('clarity-id') }
  }

  #urlViePrivee() {
    const url = this.getAttribute('url-vie-privee')
    // Seules les adresses http(s) sont acceptées
    return url && /^https?:\/\//i.test(url) ? url : URL_VIE_PRIVEE
  }

  #enregistrer(statistiques: boolean) {
    // Le panneau rend le focus à ce qui l'a ouvert (souvent « Paramètres des témoins », dans la carte)
    this.#panneau?.close()
    const actifInterne = this.#racine.activeElement
    const focusDansCarte = !!actifInterne && !!this.#carte?.contains(actifInterne)

    ecrireChoix({ statistiques, date: Date.now() })
    this.#montrerCarte(false)
    const retrait = !statistiques && statistiquesChargees()
    appliquerStatistiques(statistiques, this.#identifiants())
    window.dispatchEvent(new CustomEvent('bib:consentement', { detail: { statistiques } }))

    // Retrait de l'accord : GTM, GA et Clarity tournent déjà dans la page, seul un
    // rechargement les arrête tous (balises du conteneur comprises)
    if (retrait) return location.reload()

    if (this.#annonce) this.#annonce.textContent = statistiques ? 'Choix enregistré : statistiques acceptées.' : 'Choix enregistré : statistiques refusées.'
    if (focusDansCarte) this.#rendreFocus()
  }

  /** La carte disparaît avec le focus : il revient là d'où il venait, sinon sur l'élément */
  #rendreFocus() {
    const retour = this.#retour
    if (retour?.isConnected && retour.getClientRects().length) {
      retour.focus()
      if (document.activeElement === retour || retour.shadowRoot?.activeElement) return
    }
    this.tabIndex = -1
    this.addEventListener('blur', () => this.removeAttribute('tabindex'), { once: true })
    this.focus({ preventScroll: true })
  }

  #montrerCarte(visible: boolean) {
    if (this.#carte) this.#carte.hidden = !visible
    const html = document.documentElement
    this.#observateur?.disconnect()
    this.#observateur = null
    window.removeEventListener('resize', this.#mesurer)
    if (!visible || !this.#carte) {
      html.style.removeProperty('--bib-consentement-hauteur')
      if (this.#paddingAvant !== null) {
        html.style.scrollPaddingBottom = this.#paddingAvant
        this.#paddingAvant = null
      }
      return
    }
    // La page garde de la place sous le focus, sauf si elle règle déjà scroll-padding
    if (getComputedStyle(html).scrollPaddingBottom === 'auto') {
      this.#paddingAvant = html.style.scrollPaddingBottom
      html.style.scrollPaddingBottom = 'var(--bib-consentement-hauteur, 0px)'
    }
    this.#observateur = new ResizeObserver(this.#mesurer)
    this.#observateur.observe(this.#carte)
    window.addEventListener('resize', this.#mesurer)
    this.#publierHauteur()
  }

  /** Hauteur occupée par la carte depuis le bas de l'écran */
  #publierHauteur() {
    if (!this.#carte || this.#carte.hidden) return
    const haut = this.#carte.getBoundingClientRect().top
    document.documentElement.style.setProperty('--bib-consentement-hauteur', `${Math.max(0, Math.ceil(innerHeight - haut))}px`)
  }
}

if (!customElements.get('bib-consentement')) customElements.define('bib-consentement', BibConsentement)
