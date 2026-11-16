/*
 * Vidéo (facultatif) : la façade [data-video] cède la place au lecteur de la plateforme au clic.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-video.min.js"></script>
 *
 * Avant le clic, rien n'est demandé à la plateforme. Au clic (ou Entrée) sur le lien .bib-video__lecture,
 * une iframe (data-lecteur, lecture automatique) le remplace, nommée par data-titre-video (WCAG 4.1.2), et
 * reçoit le focus. Ctrl, Cmd ou Maj-clic gardent le comportement du lien (ouvrir la plateforme).
 *
 * Avant de créer l'iframe, l'événement annulable « bib:video-lecture » (detail : { lecteur, titre }) est émis
 * sur la façade : un site peut l'annuler pour tenir le lecteur lui-même (le mini-site d'Harmonium s'en sert
 * pour ne rien charger). Sans JavaScript, le lien mène à la vidéo. Compatible avec une navigation sans
 * rechargement (événement astro:page-load).
 */

function brancherVideo(cadre: HTMLElement) {
  const lien = cadre.querySelector<HTMLAnchorElement>('.bib-video__lecture')
  if (!lien || !cadre.dataset.lecteur) return
  cadre.setAttribute('data-pret', '')
  lien.addEventListener('click', (evenement) => {
    // Ctrl/Cmd/Maj-clic : ouvrir la plateforme, comme tout lien
    if (evenement.metaKey || evenement.ctrlKey || evenement.shiftKey) return
    evenement.preventDefault()
    const titre = cadre.dataset.titreVideo ?? 'Vidéo'
    const demande = new CustomEvent('bib:video-lecture', { bubbles: true, cancelable: true, detail: { lecteur: cadre.dataset.lecteur, titre } })
    if (!cadre.dispatchEvent(demande)) return
    const lecteur = document.createElement('iframe')
    lecteur.src = cadre.dataset.lecteur!
    lecteur.title = titre
    lecteur.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
    lecteur.allowFullscreen = true
    lecteur.referrerPolicy = 'strict-origin-when-cross-origin'
    lien.replaceWith(lecteur)
    lecteur.focus()
  })
}

function brancher() {
  document.querySelectorAll<HTMLElement>('[data-video]:not([data-pret])').forEach(brancherVideo)
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
