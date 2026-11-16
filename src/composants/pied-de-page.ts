/*
 * Pied de page (facultatif) : volets repliables sous 900 px, et bouton « Paramètres des témoins ».
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-pied-de-page.min.js"></script>
 *
 * - Sous 900 px, chaque colonne marquée data-pliable-pied devient un volet replié (motif
 *   Disclosure de l'APG : le titre h3 porte un bouton aria-expanded qui montre ou cache sa liste).
 *   Le bouton n'est ajouté que sous 900 px : sans ce script ou sur grand écran, les listes sont
 *   visibles et les titres restent de simples titres. L'ouverture s'anime après un clic seulement.
 * - Le bouton [data-parametres-temoins] émet l'événement window « bib:parametres-temoins » (que
 *   <bib-consentement> écoute pour rouvrir ses réglages).
 *
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */
const etroit = window.matchMedia('(width < 900px)')

function preparerVolets() {
  for (const colonne of document.querySelectorAll<HTMLElement>('.bib-pied-de-page [data-pliable-pied]')) {
    const titre = colonne.querySelector('.bib-pied-de-page__sous-titre')
    const liste = colonne.querySelector<HTMLElement>('.bib-pied-de-page__liste')
    if (!titre || !liste) continue
    const bouton = titre.querySelector('button')
    if (etroit.matches && !bouton) {
      const nouveau = document.createElement('button')
      nouveau.type = 'button'
      nouveau.className = 'bib-pied-de-page__bascule'
      nouveau.setAttribute('aria-expanded', 'false')
      nouveau.setAttribute('aria-controls', liste.id)
      nouveau.append(...titre.childNodes)
      const chevron = document.createElement('span')
      chevron.className = 'bib-pied-de-page__chevron'
      chevron.setAttribute('aria-hidden', 'true')
      nouveau.append(chevron)
      nouveau.addEventListener('click', () => {
        const ouvert = nouveau.getAttribute('aria-expanded') !== 'true'
        nouveau.setAttribute('aria-expanded', String(ouvert))
        // L'ouverture s'anime après un clic seulement, jamais au chargement
        liste.dataset.anime = ''
        liste.hidden = !ouvert
      })
      titre.append(nouveau)
      liste.hidden = true
    } else if (!etroit.matches && bouton) {
      bouton.querySelector('.bib-pied-de-page__chevron')?.remove()
      titre.replaceChildren(...bouton.childNodes)
      delete liste.dataset.anime
      liste.hidden = false
    }
    colonne.dataset.pret = ''
  }
}

function brancher() {
  preparerVolets()
  document.querySelectorAll('[data-parametres-temoins]:not([data-temoins-pret])').forEach((bouton) => {
    ;(bouton as HTMLElement).dataset.temoinsPret = ''
    bouton.addEventListener('click', (e) => {
      e.preventDefault()
      window.dispatchEvent(new Event('bib:parametres-temoins'))
    })
  })
}

// Le changement de largeur vaut pour toutes les pages : branché une fois
etroit.addEventListener('change', preparerVolets)
document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
