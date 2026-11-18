/*
 * Styles du composant (Shadow DOM : aucune règle de la page n'y entre, aucune n'en sort).
 * Les couleurs et la forme se règlent par des propriétés CSS personnalisées, qui traversent le
 * Shadow DOM ; chaque site les définit une fois, avec ses propres jetons de design :
 *
 *   bib-consentement {
 *     --bib-consentement-fond: var(--couleur-surface);
 *     --bib-consentement-texte: var(--couleur-texte);
 *     ...
 *   }
 */
export const STYLES = /* css */ `
  :host {
    --_fond: var(--bib-consentement-fond, #ffffff);
    --_texte: var(--bib-consentement-texte, #0b113a);
    --_bordure: var(--bib-consentement-bordure, #c3ccd5);
    --_bouton-fond: var(--bib-consentement-bouton-fond, #0b113a);
    --_bouton-texte: var(--bib-consentement-bouton-texte, #ffffff);
    --_bouton-survol: var(--bib-consentement-bouton-survol, #0057ac);
    --_rayon: var(--bib-consentement-rayon, 12px);
    --_ombre: var(--bib-consentement-ombre, 0 4px 16px rgb(0 0 0 / 0.18));
    --_focus: var(--bib-consentement-focus, #ffca40);
    --_focus-contour: var(--bib-consentement-focus-contour, #0b113a);
    --_voile: var(--bib-consentement-voile, #000000);
    --_z: var(--bib-consentement-z-index, 1200);
    font: inherit;
  }

  /* Reçoit le focus quand la carte disparaît après le choix : rien à montrer */
  :host(:focus) { outline: none; }

  *, *::before, *::after { box-sizing: border-box; }

  :focus-visible {
    outline: 3px solid var(--_focus);
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--_focus-contour);
  }

  [hidden] { display: none !important; }

  .visuellement-masque {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* En bas à droite de l'écran */
  .carte {
    position: fixed;
    z-index: var(--_z);
    right: 1rem;
    bottom: 1rem;
    width: min(29rem, calc(100vw - 2rem));
    padding: 1rem;
    border: 1px solid var(--_bordure);
    border-radius: var(--_rayon);
    background-color: var(--_fond);
    color: var(--_texte);
    box-shadow: var(--_ombre);
  }

  .titre-carte { margin: 0 0 0.25rem; font-size: var(--texte-courant, 1rem); line-height: 1.3; }
  .texte-carte { margin: 0 0 0.75rem; font-size: var(--texte-petit, 0.889rem); line-height: 1.4; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }

  .bouton {
    padding: 0.5rem 1.25rem;
    /* Transparente, mais visible en mode contraste élevé (forced-colors) */
    border: 1px solid transparent;
    border-radius: var(--rayon-plein, 9999px);
    background-color: var(--_bouton-fond);
    color: var(--_bouton-texte);
    font: inherit;
    font-size: var(--texte-petit, 0.889rem);
    font-weight: var(--graisse-moyenne, 500);
    cursor: pointer;
  }
  .bouton:hover { background-color: var(--_bouton-survol); }

  .lien-texte {
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }

  .panneau {
    width: min(40rem, calc(100vw - 2rem));
    max-height: calc(100dvh - 2rem);
    padding: 1.5rem;
    overflow-y: auto;
    border: 1px solid var(--_bordure);
    border-radius: var(--_rayon);
    background-color: var(--_fond);
    color: var(--_texte);
    font-size: var(--texte-petit, 0.889rem);
  }
  .panneau::backdrop {
    background-color: color-mix(in srgb, var(--couleur-voile, #000) 50%, transparent);
    background-color: color-mix(in srgb, var(--_voile) 50%, transparent);
  }
  .panneau p { margin: 0 0 0.75rem; }
  .panneau a { color: inherit; }
  .titre-panneau { margin: 0 0 0.75rem; font-size: var(--titre-4, 1.44rem); }

  .categorie { margin-block-end: 0.75rem; padding-block: 0.75rem; border-block: 1px solid var(--_bordure); }
  .categorie p { margin: 0.25rem 0 0.5rem; }
  .categorie summary { cursor: pointer; }
  .categorie ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .choix { display: flex; align-items: center; gap: 0.5rem; font-weight: var(--graisse-forte, 600); cursor: pointer; }
  .choix input { width: 1.125rem; height: 1.125rem; }

  /* Mobile : bande compacte en bas de l'écran */
  @media (max-width: 599.98px) {
    .carte { right: 0; bottom: 0; width: 100%; padding: 0.75rem 1rem; border-width: 1px 0 0; border-radius: 0; }
    .texte-carte { margin-bottom: 0.5rem; font-size: var(--texte-minuscule, 0.79rem); }
    .panneau { padding: 1rem; }
  }

  /* Écran peu haut (téléphone couché, zoom à 400 %) : la carte prend moins de place */
  @media (max-height: 30rem) {
    .carte { padding: 0.5rem 0.75rem; }
    .titre-carte { font-size: var(--texte-petit, 0.889rem); }
    .texte-carte { margin-bottom: 0.375rem; font-size: var(--texte-minuscule, 0.79rem); line-height: 1.3; }
    .bouton { padding: 0.25rem 1rem; }
    .panneau { padding: 0.75rem; }
  }
`
