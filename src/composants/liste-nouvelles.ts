/*
 * Liste des nouvelles (facultatif) : rend actifs le filtre par type et le filtre par sujet d'une liste déjà
 * complète, et les retrouve dans l'adresse.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-liste-nouvelles.min.js"></script>
 *
 * Repères (voir liste-nouvelles.css) : [data-liste-nouvelles], [data-filtre] (+ data-type) et [data-compte]
 * sur les boutons de type, [data-sujet] sur les boutons de sujet, [data-annonce], [data-annee] ; chaque
 * élément porte data-type et data-sujets. Paramètres d'adresse : ?type=<data-filtre>, ?sujet=<data-sujet>.
 */
const annonce = (n: number) => `${n} ${n > 1 ? 'éléments affichés' : 'élément affiché'}`

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-liste-nouvelles]')) {
    if (racine.dataset.pret === 'oui') continue
    racine.dataset.pret = 'oui'
    const boutons = [...racine.querySelectorAll<HTMLButtonElement>('[data-filtre]')]
    const boutonsSujet = [...racine.querySelectorAll<HTMLButtonElement>('[data-sujet]')]
    const region = racine.querySelector<HTMLElement>('[data-annonce]')
    const elements = [...racine.querySelectorAll<HTMLElement>('li[data-type]')]
    const annees = [...racine.querySelectorAll<HTMLElement>('[data-annee]')]
    if (!boutons.length) continue
    let valeur = boutons.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.filtre ?? boutons[0].dataset.filtre ?? ''
    let sujet = ''

    const duSujet = (li: HTMLElement) => !sujet || (li.dataset.sujets ?? '').split(' ').includes(sujet)

    function appliquer(majAdresse: boolean) {
      const bouton = boutons.find((b) => b.dataset.filtre === valeur) ?? boutons[0]
      const type = bouton.dataset.type
      for (const b of boutons) {
        b.setAttribute('aria-pressed', String(b === bouton))
        const compte = b.querySelector<HTMLElement>('[data-compte]')
        if (compte) compte.textContent = String(elements.filter((li) => duSujet(li) && (!b.dataset.type || li.dataset.type === b.dataset.type)).length)
      }
      for (const b of boutonsSujet) b.setAttribute('aria-pressed', String((b.dataset.sujet ?? '') === sujet))
      let visibles = 0
      for (const li of elements) {
        const visible = duSujet(li) && (!type || li.dataset.type === type)
        li.hidden = !visible
        if (visible) visibles++
      }
      for (const section of annees) section.hidden = !section.querySelector('li[data-type]:not([hidden])')
      if (region) region.textContent = annonce(visibles)
      if (majAdresse) {
        const url = new URL(window.location.href)
        if (bouton === boutons[0]) url.searchParams.delete('type')
        else url.searchParams.set('type', valeur)
        if (sujet) url.searchParams.set('sujet', sujet)
        else url.searchParams.delete('sujet')
        // On garde history.state : le routeur d'Astro peut y ranger ses données
        window.history.replaceState(window.history.state, '', url)
      }
    }

    for (const b of boutons)
      b.addEventListener('click', () => {
        valeur = b.dataset.filtre ?? ''
        appliquer(true)
      })
    for (const b of boutonsSujet)
      b.addEventListener('click', () => {
        sujet = b.dataset.sujet ?? ''
        appliquer(true)
      })

    const parametres = new URLSearchParams(window.location.search)
    const typeDemande = parametres.get('type')
    const sujetDemande = parametres.get('sujet')
    if (typeDemande && boutons.some((b) => b.dataset.filtre === typeDemande)) valeur = typeDemande
    if (sujetDemande && boutonsSujet.some((b) => b.dataset.sujet === sujetDemande)) sujet = sujetDemande
    appliquer(false)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
