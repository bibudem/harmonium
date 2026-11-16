/*
 * Accordéons (facultatif) : deux finesses que <details> n'a pas.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-accordeons.min.js"></script>
 *
 * - Une ancre qui vise un volet, ou un élément de son contenu, l'ouvre (au chargement et au
 *   changement de #), puis ramène la cible en vue : ouvrir un volet après le saut décale la page.
 * - Dans un groupe (même attribut name), ouvrir un volet ferme celui qui était ouvert. S'il est
 *   plus haut, sa fermeture faisait remonter la page et le titre cliqué filait hors de vue : on
 *   le ferme d'un coup, avant l'ouverture, et on compense le défilement. Le clic couvre aussi
 *   Entrée et Espace sur le titre.
 *
 * Sans ce script, les accordéons s'ouvrent, se ferment et s'excluent quand même. Compatible
 * avec une navigation sans rechargement (événement astro:page-load).
 */
const VOLET = 'details.bib-accordeon'
const SANS_TRANSITION = 'bib-accordeon--sans-transition'

function idDeLAncre(): string {
  try {
    return decodeURIComponent(location.hash.slice(1))
  } catch {
    return ''
  }
}

function ouvrirSelonAncre() {
  const id = idDeLAncre()
  const cible = id ? document.getElementById(id) : null
  if (!cible) return
  let volet = cible.closest<HTMLDetailsElement>(VOLET)
  let change = false
  while (volet) {
    if (!volet.open) {
      volet.classList.add(SANS_TRANSITION)
      volet.open = true
      change = true
    }
    volet = volet.parentElement?.closest<HTMLDetailsElement>(VOLET) ?? null
  }
  if (change)
    requestAnimationFrame(() => {
      // Saut immédiat : le défilement doux de html ferait traverser la page
      cible.scrollIntoView({ behavior: 'instant' })
      requestAnimationFrame(() => document.querySelectorAll(`.${SANS_TRANSITION}`).forEach((d) => d.classList.remove(SANS_TRANSITION)))
    })
}

const cle = '__bibAccordeons'
if (!(window as unknown as Record<string, unknown>)[cle]) {
  ;(window as unknown as Record<string, unknown>)[cle] = true
  window.addEventListener('hashchange', ouvrirSelonAncre)
  document.addEventListener('astro:page-load', ouvrirSelonAncre)
  document.addEventListener('click', (evenement) => {
    const sommaire = (evenement.target as Element | null)?.closest(`${VOLET} > summary`)
    const volet = sommaire?.parentElement as HTMLDetailsElement | undefined
    if (!sommaire || !volet || volet.open || !volet.name) return
    const ouvert = [...document.querySelectorAll<HTMLDetailsElement>(`${VOLET}[open][name="${CSS.escape(volet.name)}"]`)].find(
      (d) => d !== volet && !d.contains(volet) && d.compareDocumentPosition(volet) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    if (!ouvert) return
    const avant = sommaire.getBoundingClientRect().top
    ouvert.classList.add(SANS_TRANSITION)
    ouvert.open = false
    window.scrollBy({ top: sommaire.getBoundingClientRect().top - avant, behavior: 'instant' })
    requestAnimationFrame(() => requestAnimationFrame(() => ouvert.classList.remove(SANS_TRANSITION)))
  })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ouvrirSelonAncre)
else ouvrirSelonAncre()
