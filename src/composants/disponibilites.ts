/*
 * Disponibilités d'un document prêté (facultatif) : remplit l'état des fiches d'état (fiches-etat.css) avec le
 * nombre d'exemplaires disponibles, lu dans l'API Atrium (/atrium/docs/<oclc>/statut-circulation).
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-disponibilites.min.js"></script>
 *
 * Repères : [data-disponibilites] sur le conteneur (data-api : une autre adresse de l'API), une fiche
 * [data-oclc] par bibliothèque avec son état [data-etat], et la région [data-annonce] (role="status").
 *
 * Amélioration progressive : sans le script, chaque fiche reste un lien vers la notice dans Sofia. Une erreur
 * laisse ce lien, avec un message. Une seule annonce pour toutes les fiches, à la fin du chargement.
 */
const API = 'https://api.bib.umontreal.ca/atrium/docs'
const DELAI = 8000

type Statut = { permalien: string; disponibles: number }

async function statut(api: string, oclc: string): Promise<Statut> {
  // Délai de 8 s : une API muette ne laisse pas la liste « en chargement » indéfiniment
  const reponse = await fetch(`${api}/${encodeURIComponent(oclc)}/statut-circulation`, { signal: AbortSignal.timeout(DELAI) })
  if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`)
  const json = await reponse.json()
  if (!json?.permalien) throw new Error('Réponse incomplète')
  return { permalien: json.permalien, disponibles: Number(json['total-exemplaires-disponibles']) || 0 }
}

const texteDisponibles = (n: number) => (n > 0 ? `${n} ${n > 1 ? 'disponibles' : 'disponible'}` : 'Aucun exemplaire disponible pour le moment')

function charger(bloc: HTMLElement) {
  const api = bloc.dataset.api || API
  const liste = bloc.querySelector('.bib-fiches-etat__liste')
  const annonce = bloc.querySelector<HTMLElement>('[data-annonce]')
  const fiches = [...bloc.querySelectorAll<HTMLAnchorElement>('[data-oclc]')]
  liste?.setAttribute('aria-busy', 'true')
  for (const fiche of fiches) {
    const etat = fiche.querySelector('[data-etat]')
    if (etat) etat.textContent = 'Chargement de la disponibilité…'
    fiche.dataset.statut = 'chargement'
  }
  return Promise.all(
    fiches.map(async (fiche) => {
      const etat = fiche.querySelector('[data-etat]')
      try {
        const { permalien, disponibles } = await statut(api, fiche.dataset.oclc!)
        fiche.href = permalien
        if (etat) etat.textContent = texteDisponibles(disponibles)
        fiche.dataset.statut = disponibles > 0 ? 'disponible' : 'indisponible'
        return true
      } catch (erreur) {
        console.error(`Disponibilité (${fiche.dataset.oclc}) :`, erreur)
        // Le lien vers la notice Sofia reste : on peut y vérifier soi-même
        if (etat) etat.textContent = 'Disponibilité impossible à afficher pour le moment. Vérifier dans Sofia'
        fiche.dataset.statut = 'erreur'
        return false
      }
    }),
  ).then((resultats) => {
    liste?.removeAttribute('aria-busy')
    if (annonce) {
      annonce.textContent = resultats.every(Boolean)
        ? 'Disponibilités à jour.'
        : 'Disponibilités à jour, sauf pour certaines bibliothèques : leur lien mène à Sofia.'
    }
  })
}

function brancher() {
  for (const bloc of document.querySelectorAll<HTMLElement>('[data-disponibilites]:not([data-pret])')) {
    bloc.toggleAttribute('data-pret', true)
    void charger(bloc)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
