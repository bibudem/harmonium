/*
 * Liste filtrable (facultatif) : montre le formulaire de liste-filtrable.css et masque les fiches qui ne
 * correspondent ni à la recherche (sans accents ni casse) ni à la catégorie choisie.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-liste-filtrable.min.js"></script>
 *
 * Repères : [data-liste-filtrable] (data-unite, data-unites, data-vide-recherche, data-vide-categorie),
 * [data-filtres], [data-recherche], [data-categorie], [data-compte], [data-liste] et ses <li> (data-texte,
 * data-categorie), [data-vide] et [data-vide-texte].
 */
const DELAI_ANNONCE = 400

const normaliser = (texte: string) => texte.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

function initialiser(racine: HTMLElement) {
  const filtres = racine.querySelector<HTMLFormElement>('[data-filtres]')
  const recherche = racine.querySelector<HTMLInputElement>('[data-recherche]')
  const categorie = racine.querySelector<HTMLSelectElement>('[data-categorie]')
  const compte = racine.querySelector<HTMLElement>('[data-compte]')
  const vide = racine.querySelector<HTMLElement>('[data-vide]')
  const videTexte = racine.querySelector<HTMLElement>('[data-vide-texte]')
  const unite = racine.dataset.unite ?? 'résultat'
  const unites = racine.dataset.unites ?? 'résultats'
  const videRecherche = racine.dataset.videRecherche ?? 'Aucun résultat ne correspond à « {q} ».'
  const videCategorie = racine.dataset.videCategorie ?? 'Aucun résultat dans cette catégorie.'
  const fiches = [...racine.querySelectorAll<HTMLElement>('[data-liste] > li')].map((element) => ({
    element,
    texte: normaliser(element.dataset.texte ?? element.textContent ?? ''),
    categorie: element.dataset.categorie ?? '',
  }))
  let minuterie: number | undefined

  const filtrer = () => {
    const brut = recherche?.value.trim() ?? ''
    const requete = normaliser(brut)
    const choix = categorie?.value ?? ''
    let n = 0
    for (const fiche of fiches) {
      const visible = (!requete || fiche.texte.includes(requete)) && (!choix || fiche.categorie === choix)
      fiche.element.hidden = !visible
      if (visible) n++
    }
    if (vide) vide.hidden = n > 0
    if (videTexte) videTexte.textContent = brut ? videRecherche.replace('{q}', brut) : videCategorie
    // Annonce différée : un lecteur d'écran ne répète pas le compte à chaque touche
    clearTimeout(minuterie)
    minuterie = window.setTimeout(() => {
      if (compte) compte.textContent = n ? `${n} ${n > 1 ? `${unites} trouvés` : `${unite} trouvé`}` : `Aucun ${unite} trouvé`
    }, DELAI_ANNONCE)
  }

  if (filtres) {
    filtres.hidden = false
    filtres.addEventListener('submit', (e) => e.preventDefault())
  }
  recherche?.addEventListener('input', filtrer)
  categorie?.addEventListener('change', filtrer)
  // Valeurs restaurées par le navigateur (retour arrière)
  if (recherche?.value || categorie?.value) filtrer()
}

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-liste-filtrable]:not([data-pret])')) {
    racine.toggleAttribute('data-pret', true)
    initialiser(racine)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
