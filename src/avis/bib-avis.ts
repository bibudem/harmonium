/*
 * <bib-avis> : avis des bibliothèques de l'UdeM (bandeau en haut de page).
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-avis.min.js"></script>
 *   <bib-avis bouton-fermer></bib-avis>
 *
 * Sans dépendance. Les avis vus et fermés sont retenus dans IndexedDB (stockage.ts).
 *
 * Attributs (tous facultatifs) :
 *   service        URL du service d'avis (JSON { success, data: { id, message } | null }).
 *                  Par défaut : https://avis.bib.umontreal.ca/api/avis. Une adresse data:
 *                  fonctionne aussi (essais). Changer l'attribut recharge l'avis.
 *   bouton-fermer  affiche le bouton « Fermer » ; un avis fermé ne revient plus.
 *   fluide         pleine largeur, sans largeur maximale ni marges latérales.
 *
 * Contenu local : un <bib-avis> qui contient du HTML affiche ce HTML au lieu d'appeler
 * le service. Le HTML du service, lui, est nettoyé (nettoyage.ts) : il s'affiche sur des
 * sites que nous ne contrôlons pas.
 *
 * Événements (sur l'élément, propagés, annulables) : « bib:show » avant l'affichage,
 * « bib:hide » avant la fermeture.
 *
 * Propriétés CSS : --bib-avis-fond (fond), --bib-avis-taille (taille du texte),
 * --bib-avis-spacing-inline (marges latérales), --bib-btn-close-color,
 * --bib-btn-close-hover-color.
 *
 * Un avis corrigé par le service (même identifiant) s'affiche dans sa nouvelle version ; le
 * focus ne se perd pas à la fermeture ; texte en fr-CA même sur une page anglaise ; croix
 * contrastée (3:1).
 */
import { STYLES } from './styles.ts'
import { nettoyer } from './nettoyage.ts'
import { ouvrirBase, type Avis, type Base } from './stockage.ts'

const SERVICE = 'https://avis.bib.umontreal.ca/api/avis'
const VERSION = '1.0.0'

// Icône « close » de Material Symbols
const ICONE_FERMER =
  '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" aria-hidden="true" focusable="false"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>'

/** Ce qu'a donné la lecture : contenu local ou réponse du service. */
type Source = { isLocal: true; message: string } | { isLocal: false; id?: string; message: string | null }

class BibAvis extends HTMLElement {
  static observedAttributes = ['service', 'bouton-fermer']

  #racine = this.attachShadow({ mode: 'open' })
  #avis: Avis | null = null
  #base: Base | null = null
  #chargement: AbortController | null = null
  #connecte = false

  get service() {
    return this.getAttribute('service') || SERVICE
  }
  set service(valeur: string) {
    this.setAttribute('service', valeur)
  }

  get boutonFermer() {
    return this.hasAttribute('bouton-fermer')
  }
  set boutonFermer(valeur: boolean) {
    this.toggleAttribute('bouton-fermer', valeur)
  }

  connectedCallback() {
    this.#connecte = true
    this.#afficher()
    // Script classique dans le <head> : le contenu local n'est pas encore lu
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.#connecte && void this.#charger(), { once: true })
    } else {
      void this.#charger()
    }
  }

  disconnectedCallback() {
    this.#connecte = false
    this.#chargement?.abort()
  }

  attributeChangedCallback(nom: string, avant: string | null, apres: string | null) {
    if (!this.#connecte || avant === apres) return
    if (nom === 'service') void this.#charger()
    else this.#afficher()
  }

  /** Affiche un message (texte HTML ou avis complet), ou rien avec null. */
  setMessage(message: string | Avis | null) {
    this.#avis = typeof message === 'string' ? { message, isLocal: true } : message
    this.#afficher()
  }

  async #charger() {
    this.#chargement?.abort()
    const chargement = (this.#chargement = new AbortController())
    try {
      const source = await this.#lire(chargement.signal)
      if (!chargement.signal.aborted) await this.#traiter(source, chargement.signal)
    } catch (erreur) {
      if (!chargement.signal.aborted) console.error('[bib-avis] Avis non chargé : %o', erreur)
    }
  }

  async #lire(signal: AbortSignal): Promise<Source> {
    if (this.textContent?.trim()) return { isLocal: true, message: this.innerHTML }

    const reponse = await fetch(new URL(this.service, location.href), { headers: { Accept: 'application/json' }, signal })
    if (!reponse.ok) throw new Error(`Service d'avis : HTTP ${reponse.status}`)
    const { success, data } = await reponse.json()
    if (!success) throw new Error("Service d'avis : réponse sans succès")
    if (data === null) return { isLocal: false, message: null }
    if (typeof data !== 'object') throw new Error("Service d'avis : champ data manquant")
    const message = typeof data.message === 'string' ? data.message : null
    return { isLocal: false, id: data.id == null ? undefined : String(data.id), message }
  }

  /*
   * Un avis déjà fermé (hidden) ne revient pas ; sinon, c'est la version reçue qui
   * s'affiche (la base ne sert qu'à retenir la fermeture : un avis corrigé par le service
   * paraît corrigé). Sans identifiant fourni par le service, l'avis est reconnu par
   * l'empreinte SHA-256 de son contenu.
   */
  async #traiter(source: Source, signal: AbortSignal) {
    if (!source.message) return this.setMessage(null)
    const id = ('id' in source && source.id) || (await empreinte(source))

    if ('indexedDB' in window) {
      try {
        const base = (this.#base ??= await ouvrirBase())
        const vu = await base.lire(id)
        if (signal.aborted) return
        if (vu?.hidden) return this.setMessage(null)
      } catch (erreur) {
        console.warn('[bib-avis] IndexedDB indisponible : la fermeture ne sera pas mémorisée. %o', erreur)
      }
    }
    if (!signal.aborted) await this.#montrer({ ...source, id, message: source.message })
  }

  async #montrer(avis: Avis & { id: string }) {
    if (!this.dispatchEvent(new CustomEvent('bib:show', { bubbles: true, cancelable: true }))) return
    this.setMessage(avis)
    try {
      await this.#base?.ecrire({ ...avis, hidden: false })
    } catch (erreur) {
      console.warn('[bib-avis] Avis non mémorisé : %o', erreur)
    }
  }

  async #fermer() {
    if (!this.#avis) return
    if (!this.dispatchEvent(new CustomEvent('bib:hide', { bubbles: true, cancelable: true }))) return
    const avis = this.#avis
    // Le bouton va disparaître : le focus passe à l'élément lui-même (Tab continue
    // après lui) au lieu de retomber au début de la page
    if (this.#racine.activeElement) {
      this.tabIndex = -1
      this.addEventListener('blur', () => this.removeAttribute('tabindex'), { once: true })
      this.focus({ preventScroll: true })
    }
    this.setMessage(null)
    try {
      if (this.#base && avis.id) await this.#base.ecrire({ ...avis, id: avis.id, hidden: true })
    } catch (erreur) {
      console.error('[bib-avis] Fermeture non mémorisée : %o', erreur)
    }
  }

  #afficher() {
    const style = document.createElement('style')
    style.textContent = STYLES
    if (!this.#avis?.message) return this.#racine.replaceChildren(style)

    const aside = document.createElement('aside')
    aside.className = 'container'
    aside.lang = 'fr-CA'
    // Repère nommé : sans nom, un <aside> est une région anonyme pour les lecteurs d'écran
    aside.setAttribute('aria-label', 'Avis des bibliothèques')
    aside.innerHTML = `<div class="inner"><div class="message"></div></div>`
    const message = aside.querySelector('.message')!
    // HTML de la page (contenu local, setMessage) : tel quel ; HTML du service : nettoyé
    if (this.#avis.isLocal) message.innerHTML = this.#avis.message
    else message.replaceChildren(nettoyer(this.#avis.message))
    if (this.boutonFermer) {
      const bouton = document.createElement('button')
      bouton.type = 'button'
      bouton.className = 'btn-close'
      bouton.setAttribute('aria-label', 'Fermer l’avis')
      bouton.innerHTML = ICONE_FERMER
      bouton.addEventListener('click', () => void this.#fermer())
      aside.firstElementChild!.append(bouton)
    }
    this.#racine.replaceChildren(style, aside)
  }
}

/**
 * Empreinte SHA-256 (hexadécimale) de l'avis, clé de stockage sans identifiant. Hors
 * contexte sécurisé (site en http), crypto.subtle n'existe pas : empreinte FNV-1a, pour que
 * la fermeture soit quand même retenue.
 */
async function empreinte(source: Source) {
  const texte = JSON.stringify(source)
  if (globalThis.crypto?.subtle) {
    const condense = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texte))
    return [...new Uint8Array(condense)].map((o) => o.toString(16).padStart(2, '0')).join('')
  }
  let h = 0x811c9dc5
  for (let i = 0; i < texte.length; i++) h = Math.imul(h ^ texte.charCodeAt(i), 0x01000193)
  return `fnv1a-${(h >>> 0).toString(16)}-${texte.length}`
}

if (!customElements.get('bib-avis')) customElements.define('bib-avis', BibAvis)

// window.bib.avis signale le composant chargé
const bib = ((globalThis as Record<string, unknown>).bib ??= {}) as Record<string, unknown>
bib.avis ??= { version: VERSION }
