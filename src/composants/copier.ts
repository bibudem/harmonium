/*
 * Copier (facultatif) : affiche et branche les boutons « Copier » [data-copier] quand le presse-papiers est
 * disponible (JavaScript, contexte sécurisé). Sans lui, les boutons restent masqués.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-copier.min.js"></script>
 *
 * Le clic copie data-texte, affiche « Copié » deux secondes ([data-copie]) et l'annonce dans la région
 * role="status" ; un refus du navigateur invite à sélectionner le texte, qui reste sélectionnable.
 * Compatible avec une navigation sans rechargement (événement astro:page-load).
 */

// Durée du « Copié » : le temps de le lire
const DUREE_CONFIRMATION = 2000

function brancherCopier(copier: HTMLElement) {
  const bouton = copier.querySelector<HTMLButtonElement>('.bib-copier__bouton')
  const statut = copier.querySelector<HTMLElement>('[role="status"]')
  const libelle = bouton?.querySelector('.bib-copier__libelle')
  if (!bouton || !statut || !libelle) return
  copier.setAttribute('data-pret', '')
  bouton.hidden = false
  let minuterie: number | undefined
  bouton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bouton.dataset.texte ?? '')
    } catch {
      statut.textContent = 'La copie a échoué : sélectionnez le texte pour le copier.'
      return
    }
    bouton.dataset.copie = ''
    libelle.textContent = 'Copié'
    statut.textContent = 'Copié dans le presse-papiers'
    window.clearTimeout(minuterie)
    minuterie = window.setTimeout(() => {
      delete bouton.dataset.copie
      libelle.textContent = 'Copier'
      statut.textContent = ''
    }, DUREE_CONFIRMATION)
  })
}

function brancher() {
  if (!navigator.clipboard?.writeText) return
  document.querySelectorAll<HTMLElement>('[data-copier]:not([data-pret])').forEach(brancherCopier)
}

document.addEventListener('astro:page-load', brancher)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
