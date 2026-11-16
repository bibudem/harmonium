/*
 * Gabarit HTML du composant. Les textes sont ceux exigés par la Loi sur l'accès (art. 53.1, 65 et
 * 65.0.1) : à modifier seulement avec la validation de la personne responsable de la vie privée.
 */

const echapper = (texte: string) => texte.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export type Outils = { gtm: boolean; ga: boolean; clarity: boolean }

/**
 * Phrase « Tiers » : seuls les outils que le site charge vraiment sont nommés. « Google Tag
 * Manager, Google Analytics » est la formulation retenue pour un site qui
 * charge un conteneur GTM (ga-id est alors ignoré).
 */
export function phraseTiers({ gtm, ga, clarity }: Outils) {
  const tiers: string[] = []
  if (gtm) tiers.push('Google (Google Tag Manager, Google Analytics)')
  else if (ga) tiers.push('Google (Google Analytics)')
  if (clarity) tiers.push('Microsoft (Clarity)')
  if (!tiers.length) return 'aucun outil de statistiques n’est utilisé sur ce site.'
  return `${tiers.join(' et ')} ${tiers.length > 1 ? 'recueillent' : 'recueille'} ces renseignements.`
}

export function gabarit(urlViePrivee: string, outils: Outils = { gtm: false, ga: false, clarity: false }) {
  return /* html */ `
  <div lang="fr-CA">
    <section class="carte" aria-labelledby="consentement-titre" hidden data-carte>
      <h2 id="consentement-titre" class="titre-carte">L’UdeM reconnaît l’importance de respecter la vie privée</h2>
      <p class="texte-carte">
        Avec votre accord, ce site utilise des témoins (cookies) pour mesurer sa fréquentation.
        <button type="button" class="lien-texte" data-details>Paramètres des témoins</button>
      </p>
      <div class="actions">
        <button type="button" class="bouton" data-accepter>Accepter</button>
        <button type="button" class="bouton" data-refuser>Refuser</button>
      </div>
    </section>

    <dialog class="panneau" aria-labelledby="consentement-panneau-titre" data-panneau>
      <h2 id="consentement-panneau-titre" class="titre-panneau">Personnaliser les témoins</h2>
      <p>Cette catégorie est facultative. Si vous la refusez, le site fonctionne normalement.</p>
      <p>Vous pouvez modifier vos préférences en tout temps avec le bouton « Paramètres des témoins », en bas de chaque page.</p>

      <div class="categorie">
        <label class="choix">
          <input type="checkbox" data-statistiques />
          <span>Statistiques de fréquentation</span>
        </label>
        <p>Pour savoir quelles pages sont consultées et mieux organiser le contenu du site.</p>
        <details>
          <summary>Détails sur les statistiques</summary>
          <ul>
            <li>
              <strong>Moyens :</strong> des témoins et des scripts recueillent notamment les pages vues, la durée de la
              visite, les clics, le défilement, le type d’appareil et une localisation approximative tirée de l’adresse IP.
            </li>
            <li>
              <strong>Tiers :</strong> ${phraseTiers(outils)}
            </li>
            <li><strong>Hors du Québec :</strong> ces renseignements peuvent être communiqués à l’extérieur du Québec.</li>
            <li>
              <strong>Profilage et localisation :</strong> ces outils analysent les parcours de navigation et peuvent estimer
              votre localisation. Ces fonctions s’activent seulement si vous acceptez les statistiques.
            </li>
            <li><strong>Si vous refusez ou retirez votre accord :</strong> le site fonctionne normalement.</li>
            <li><strong>Portée :</strong> ce choix vaut pour les sites des bibliothèques.</li>
          </ul>
        </details>
      </div>

      <p>
        Pour en savoir plus sur vos renseignements personnels, vos droits d’accès et de rectification ou la façon dont l’UdeM
        traite ces renseignements, consultez
        <a href="${echapper(urlViePrivee)}" target="_blank" rel="noopener noreferrer">Vie privée à l’UdeM<span class="visuellement-masque"> (ouvre une nouvelle fenêtre)</span></a>.
      </p>

      <div class="actions">
        <button type="button" class="bouton" data-enregistrer>Enregistrer mes choix</button>
        <button type="button" class="lien-texte" data-fermer>Fermer</button>
      </div>
    </dialog>
  </div>`
}
