/*
 * <bib-consent-preferences-btn> : bouton « Paramètres des témoins » à mettre dans le pied de
 * page. Il ouvre le panneau de <bib-consentement> (événement « bib:parametres-temoins »). Il
 * n'a aucun style propre : il prend la police et la couleur du pied de page.
 */
class BoutonParametres extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return
    const racine = this.attachShadow({ mode: 'open' })
    racine.innerHTML = `<style>
        button { all: unset; cursor: pointer; }
        button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
      </style><button type="button" lang="fr-CA">Paramètres des témoins</button>`
    racine.querySelector('button')!.addEventListener('click', () => window.dispatchEvent(new Event('bib:parametres-temoins')))
  }
}

if (!customElements.get('bib-consent-preferences-btn')) customElements.define('bib-consent-preferences-btn', BoutonParametres)
