/*
 * Liens rapides (facultatif) : le tiroir du bureau s'ouvre et se referme, la barre mobile suit le défilement
 * et les boutons à data-evenement déclenchent leur événement.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-liens-rapides.min.js"></script>
 *
 * Repères : [data-liens-rapides] (le tiroir), [data-poignee], [data-replie] (sur le panneau),
 * [data-liens-rapides-mobile] (la barre, qui porte [data-suit] quand le doigt la déplace) et
 * [data-evenement] (+ [data-repli]) sur un bouton. Pose sur la racine du document
 * --bib-liens-rapides-decalage, --bib-liens-rapides-retrait et --bib-liens-rapides-hauteur (voir la feuille).
 */
const SEUIL = 8
const OMBRE = 16
const racine = document.documentElement
let controleur: AbortController | undefined

// Délégation sur le document : branchée une fois, vaut pour toutes les pages
document.addEventListener('click', (e) => {
  const bouton = (e.target as Element | null)?.closest?.<HTMLElement>('[data-evenement]')
  if (!bouton?.dataset.evenement) return
  const evenement = new Event(bouton.dataset.evenement, { cancelable: true })
  window.dispatchEvent(evenement)
  // Personne n'a pris le relais (clavardage pas prêt, par exemple) : la page de repli
  if (!evenement.defaultPrevented && bouton.dataset.repli) window.location.assign(bouton.dataset.repli)
})

function tiroir(signal: AbortSignal) {
  // Échap ou un clic ailleurs replient le tiroir ; Échap rend le focus à la poignée. Portée au tiroir :
  // d'autres composants ont un panneau (le sommaire des longues pages vient avant dans le DOM)
  const panneau = document.querySelector<HTMLElement>('[data-liens-rapides] nav')
  const poignee = panneau?.querySelector<HTMLButtonElement>('[data-poignee]')
  if (!panneau || !poignee) return
  const ouvrir = (ouvert: boolean) => {
    poignee.setAttribute('aria-expanded', String(ouvert))
    panneau.toggleAttribute('data-replie', !ouvert)
  }
  poignee.addEventListener('click', () => {
    // Pas d'infobulle juste après un clic : en refermant, la poignée repasse sous le curseur et la bulle
    // apparaissait un instant
    poignee.setAttribute('data-infobulle-fermee', '')
    ouvrir(panneau.hasAttribute('data-replie'))
  })
  // L'infobulle fermée revient au prochain survol ou focus
  for (const nom of ['pointerout', 'focusout']) poignee.addEventListener(nom, () => poignee.removeAttribute('data-infobulle-fermee'))
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || panneau.hasAttribute('data-replie') || !panneau.contains(document.activeElement)) return
      ouvrir(false)
      poignee.focus()
    },
    { signal },
  )
  document.addEventListener('click', (e) => !panneau.contains(e.target as Node) && ouvrir(false), { signal })
  // La rangée ouverte se replie dès que la page défile ; la poignée, elle, reste toujours affichée
  window.addEventListener('scroll', () => !panneau.hasAttribute('data-replie') && ouvrir(false), { passive: true, signal })
}

function barre(signal: AbortSignal) {
  // Barre mobile qui suit le défilement : --bib-liens-rapides-decalage la descend de 0 (affichée) à toute sa
  // hauteur et son ombre (sortie). Mouvement réduit : SEUIL évite qu'un petit rebond la fasse clignoter.
  const barre = document.querySelector<HTMLElement>('[data-liens-rapides-mobile]')
  if (!barre) return
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)')
  let precedent = window.scrollY
  let decalage = 0
  let enAttente = false
  let minuterieFin: ReturnType<typeof setTimeout> | undefined

  const placer = (valeur: number, suivre: boolean) => {
    decalage = valeur
    // Pas de transition pendant que le doigt la déplace ; une transition pour les mouvements qu'elle finit seule
    barre.toggleAttribute('data-suit', suivre)
    racine.style.setProperty('--bib-liens-rapides-decalage', `${valeur}px`)
    // Part sortie, de 0 à 1, sans unité : « Retour en haut » s'en sert pour sortir avec la barre
    const max = barre.offsetHeight + OMBRE
    racine.style.setProperty('--bib-liens-rapides-retrait', String(max ? Math.min(1, valeur / max) : 0))
  }

  // À l'arrêt, la barre ne reste pas à moitié sortie
  const terminer = () => {
    if (reduit.matches) return
    const max = barre.offsetHeight + OMBRE
    if (decalage > 0 && decalage < max) placer(decalage > max / 2 ? max : 0, false)
  }

  const mettreAJour = () => {
    enAttente = false
    const y = window.scrollY
    const ecart = y - precedent
    const max = barre.offsetHeight + OMBRE
    const enBas = window.innerHeight + y >= racine.scrollHeight - 2
    if (y <= 0 || enBas) placer(0, false)
    else if (reduit.matches) {
      if (Math.abs(ecart) < SEUIL) return
      placer(ecart > 0 ? max : 0, false)
    } else placer(Math.min(max, Math.max(0, decalage + ecart)), true)
    precedent = y
    // Repli pour les navigateurs sans l'événement scrollend
    clearTimeout(minuterieFin)
    minuterieFin = setTimeout(terminer, 150)
  }
  window.addEventListener(
    'scroll',
    () => {
      if (enAttente) return
      enAttente = true
      requestAnimationFrame(mettreAJour)
    },
    { passive: true, signal },
  )
  window.addEventListener(
    'scrollend',
    () => {
      clearTimeout(minuterieFin)
      terminer()
    },
    { signal },
  )

  // La page réserve en bas la hauteur réelle de la barre : avec le texte agrandi, elle passe sur deux lignes
  // et dépasse les 86 px par défaut
  const hauteur = new ResizeObserver(() => {
    if (barre.offsetHeight) racine.style.setProperty('--bib-liens-rapides-hauteur', `${Math.ceil(barre.offsetHeight)}px`)
  })
  hauteur.observe(barre)
  signal.addEventListener(
    'abort',
    () => {
      hauteur.disconnect()
      clearTimeout(minuterieFin)
    },
    { once: true },
  )
}

function brancher() {
  const el = document.querySelector<HTMLElement>('[data-liens-rapides], [data-liens-rapides-mobile]')
  if (!el || el.dataset.pret === 'oui') return
  for (const e of document.querySelectorAll<HTMLElement>('[data-liens-rapides], [data-liens-rapides-mobile]')) e.dataset.pret = 'oui'
  controleur?.abort()
  const { signal } = (controleur = new AbortController())
  tiroir(signal)
  barre(signal)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:before-swap', () => controleur?.abort())
document.addEventListener('astro:page-load', brancher)
