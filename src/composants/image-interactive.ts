/*
 * Image interactive (facultatif) : fait de chaque élément de la liste [data-zone] un bouton qui éclaire sa
 * zone de l'image.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-image-interactive.min.js"></script>
 *
 * Survol et focus éclairent la zone (le projecteur prend sa position, data-position) ; un clic la garde
 * éclairée (aria-pressed), un second clic la relâche. Les zones de l'image ([data-cible], aria-hidden)
 * répondent au survol et au clic de la souris ; le clavier passe par la liste. Compatible avec une navigation
 * sans rechargement (événement astro:page-load).
 */

function brancherImage(racine: HTMLElement) {
  const projecteur = racine.querySelector<HTMLElement>('[data-projecteur]')
  if (!projecteur) return
  racine.setAttribute('data-pret', '')
  const elements = [...racine.querySelectorAll<HTMLElement>('[data-zone]')]
  const boutons = new Map<string, HTMLButtonElement>()
  let fixe: string | null = null

  const eclairer = (id: string | null) => {
    const element = elements.find((e) => e.dataset.zone === id)
    racine.toggleAttribute('data-eclaire', Boolean(element))
    if (element) projecteur.style.cssText = element.dataset.position ?? ''
    for (const [cle, bouton] of boutons) bouton.toggleAttribute('data-actif', cle === id)
  }
  const relacher = () => eclairer(fixe)

  for (const element of elements) {
    const id = element.dataset.zone!
    const bouton = document.createElement('button')
    bouton.type = 'button'
    bouton.className = 'bib-image-interactive__zone'
    bouton.setAttribute('aria-pressed', 'false')
    bouton.append(...element.childNodes)
    element.append(bouton)
    boutons.set(id, bouton)
    bouton.addEventListener('mouseenter', () => eclairer(id))
    bouton.addEventListener('mouseleave', relacher)
    bouton.addEventListener('focus', () => eclairer(id))
    bouton.addEventListener('blur', relacher)
    bouton.addEventListener('click', () => {
      fixe = fixe === id ? null : id
      for (const [cle, b] of boutons) b.setAttribute('aria-pressed', String(cle === fixe))
      eclairer(fixe ?? id)
    })
  }

  for (const cible of racine.querySelectorAll<HTMLElement>('[data-cible]')) {
    const id = cible.dataset.cible!
    cible.addEventListener('mouseenter', () => eclairer(id))
    cible.addEventListener('mouseleave', relacher)
    cible.addEventListener('click', () => boutons.get(id)?.click())
  }
}

function brancher() {
  document.querySelectorAll<HTMLElement>('[data-image-interactive]:not([data-pret])').forEach(brancherImage)
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
