/*
 * <udem-urgence> : message d'urgence de l'Université de Montréal (BCRP), en haut de page.
 *
 *   <script type="module" src="…/harmonium@1/dist/udem-urgence.min.js"></script>
 *   <udem-urgence></udem-urgence>
 *
 * Sans dépendance. Rien ne s'affiche tant qu'il n'y a pas d'urgence.
 *
 * Attributs (facultatifs) :
 *   service  URL du message (JSON du BCRP). Par défaut :
 *            https://urgence.umontreal.ca/urgence-udem.json. Une adresse data: sert aux essais.
 *            Changer l'attribut recharge le message.
 *   big      grand format (le message peut aussi l'imposer : bannerType « large »).
 *
 * Comportement :
 * - date et message côte à côte (date au-dessus sous 600 px), hauteur selon le texte : le
 *   message n'est jamais coupé ;
 * - un seul élément actif, le lien (nouvel onglet, annoncé), étendu à tout le bandeau ;
 * - le message est relu toutes les 5 minutes pendant que la page est visible (et au retour
 *   sur l'onglet) : une urgence publiée pendant la visite paraît et est annoncée (role=alert).
 *   Au chargement, elle n'est pas annoncée : elle est en haut de la page ;
 * - texte en fr-CA même sur une page anglaise ; lien accepté en http(s) seulement.
 */
import { STYLES } from './styles.ts'

const SERVICE = 'https://urgence.umontreal.ca/urgence-udem.json'
const LIEN_DEFAUT = 'https://urgence.umontreal.ca/'
const INTERVALLE_MS = 5 * 60 * 1000

interface Urgence {
  bannerType?: 'small' | 'large'
  date?: string
  fullDay?: string
  headerLink?: string
  hour?: string
  title?: string
  url?: string
}

class UdeMUrgence extends HTMLElement {
  static observedAttributes = ['service', 'big']

  #racine = this.attachShadow({ mode: 'open' })
  #urgence: Urgence | null = null
  #chargement: AbortController | null = null
  #connecte = false
  #dernierChargement = 0
  #minuterie = 0
  /** Message déjà rendu (JSON) : pas de nouveau rendu, donc pas de focus perdu, s'il n'a pas changé */
  #rendu: string | null = null
  /** Région role=alert, gardée d'un rendu à l'autre pour pouvoir annoncer */
  #annonce = document.createElement('p')
  #auRetour = () => {
    if (document.visibilityState === 'visible' && Date.now() - this.#dernierChargement > INTERVALLE_MS) void this.#charger(true)
  }

  get service() {
    return this.getAttribute('service') || SERVICE
  }
  set service(valeur: string) {
    this.setAttribute('service', valeur)
  }

  get big() {
    return this.hasAttribute('big')
  }
  set big(valeur: boolean) {
    this.toggleAttribute('big', valeur)
  }

  connectedCallback() {
    this.#connecte = true
    this.#annonce.className = 'masque'
    this.#annonce.setAttribute('role', 'alert')
    this.#annonce.lang = 'fr-CA'
    this.#rendu = null
    this.#afficher()
    void this.#charger()
    this.#minuterie = window.setInterval(this.#auRetour, INTERVALLE_MS)
    document.addEventListener('visibilitychange', this.#auRetour)
  }

  disconnectedCallback() {
    this.#connecte = false
    this.#chargement?.abort()
    clearInterval(this.#minuterie)
    document.removeEventListener('visibilitychange', this.#auRetour)
  }

  attributeChangedCallback(nom: string, avant: string | null, apres: string | null) {
    if (!this.#connecte || avant === apres) return
    if (nom === 'service') void this.#charger()
    else this.#afficher(true)
  }

  /** @param actualisation relecture pendant la visite : une nouvelle urgence est annoncée */
  async #charger(actualisation = false) {
    this.#chargement?.abort()
    const chargement = (this.#chargement = new AbortController())
    this.#dernierChargement = Date.now()
    const avant = this.#urgence?.title
    try {
      const reponse = await fetch(new URL(this.service, location.href), { headers: { Accept: 'application/json' }, signal: chargement.signal })
      if (!reponse.ok) throw new Error(`Service d'urgence : HTTP ${reponse.status}`)
      this.#urgence = await reponse.json()
    } catch (erreur) {
      if (chargement.signal.aborted) return
      console.error('[udem-urgence] Message non chargé : %o', erreur)
      // Une panne passagère pendant la visite n'efface pas une urgence affichée
      if (!actualisation) this.#urgence = null
    }
    this.#afficher()
    const titre = this.#urgence?.title
    if (actualisation && titre && titre !== avant) this.#annonce.textContent = `Message d’urgence de l’Université de Montréal : ${titre}`
  }

  #afficher(force = false) {
    const u = this.#urgence?.title ? this.#urgence : null
    const cle = JSON.stringify([u, this.big])
    if (!force && cle === this.#rendu) return
    this.#rendu = cle

    const style = document.createElement('style')
    style.textContent = STYLES
    if (!u) return this.#racine.replaceChildren(style, this.#annonce)

    const grand = u.bannerType ? u.bannerType === 'large' : this.big
    const adresse = [u.headerLink, u.url].find(estAdresseWeb) ?? LIEN_DEFAUT

    const aside = document.createElement('aside')
    aside.className = grand ? 'wrapper big' : 'wrapper'
    aside.lang = 'fr-CA'
    aside.setAttribute('aria-label', 'Message d’urgence de l’Université de Montréal')
    aside.innerHTML = `
      <div class="container">
        <div class="content">
          <a class="title" target="_blank" rel="noopener"><span class="texte"></span><span class="masque"> (nouvel onglet)</span></a>
          <time class="datetime"><span class="hour"></span><br /><span class="date"></span></time>
        </div>
      </div>`
    const q = (sel: string) => aside.querySelector<HTMLElement>(sel)!
    q('.title').setAttribute('href', adresse)
    q('.texte').textContent = String(u.title)
    if (u.date) q('.datetime').setAttribute('datetime', u.date)
    q('.hour').textContent = u.hour ?? ''
    q('.date').textContent = u.fullDay ?? ''
    this.#racine.replaceChildren(style, aside, this.#annonce)
  }
}

/** Adresse http(s) absolue : le lien vient d'un service extérieur (pas de javascript:…) */
function estAdresseWeb(adresse: unknown): adresse is string {
  if (typeof adresse !== 'string' || !adresse) return false
  try {
    return ['http:', 'https:'].includes(new URL(adresse).protocol)
  } catch {
    return false
  }
}

if (!customElements.get('udem-urgence')) customElements.define('udem-urgence', UdeMUrgence)
