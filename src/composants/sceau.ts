/*
 * Sceau des bibliothèques (facultatif) : au survol (souris) ou au focus clavier du lien qui contient
 * le sceau, le texte tourne autour du U (sans toucher au U), puis ralentit en douceur quand on le
 * quitte.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-sceau.min.js"></script>
 *
 * La vitesse tend vers sa cible (décroissance exponentielle), sans à-coup. Aucun mouvement si
 * l'appareil est réglé pour limiter les animations. Compatible avec une navigation sans
 * rechargement (événement astro:page-load).
 */
const VITESSE = 12 // degrés par seconde (un tour en 30 s)
const ACCELERATION = 0.5 // secondes : constante de temps de la montée en vitesse
const RALENTISSEMENT = 0.8 // secondes : constante de temps de l'arrêt (plus long = plus doux)

function brancher() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (const sceau of document.querySelectorAll<HTMLElement>('.bib-sceau:not([data-sceau-pret])')) {
    const anneau = sceau.querySelector<HTMLElement>('.bib-sceau__anneau')
    const lien = sceau.closest('a')
    if (!anneau || !lien) continue
    sceau.dataset.sceauPret = ''

    let angle = 0
    let vitesse = 0
    let cible = 0
    let dernier = 0
    let image = 0

    const pas = (maintenant: number) => {
      if (!sceau.isConnected || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image = 0
        vitesse = 0
        cible = 0
        return
      }
      const dt = Math.min((maintenant - dernier) / 1000, 0.1)
      dernier = maintenant
      const tau = cible > vitesse ? ACCELERATION : RALENTISSEMENT
      vitesse += (cible - vitesse) * (1 - Math.exp(-dt / tau))
      angle = (angle + vitesse * dt) % 360
      anneau.style.rotate = `${angle}deg`
      // Arrêt complet quand la vitesse est devenue imperceptible
      if (cible === 0 && vitesse < 0.05) {
        image = 0
        return
      }
      image = requestAnimationFrame(pas)
    }

    const viser = (v: number) => {
      cible = v
      if (!image) {
        dernier = performance.now()
        image = requestAnimationFrame(pas)
      }
    }

    lien.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && viser(VITESSE))
    lien.addEventListener('pointerleave', () => viser(0))
    lien.addEventListener('focusin', () => lien.matches(':focus-visible') && viser(VITESSE))
    lien.addEventListener('focusout', () => viser(0))
  }
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
