// Styles de <bib-retroaction-usager> : discrète, centrée, en texte secondaire.
//
// Les couleurs, rayons et tailles viennent des jetons d'Harmonium
// (--couleur-fond-fort, --rayon-plein…), qui traversent la racine fantôme : le composant
// suit leur thème. Ordre : réglage propre au composant
// (--bib-retroaction-*), jeton du site, jeton Material (--md-sys-*), valeur par défaut.
export const STYLES = `
  :host, *, *::before, *::after { box-sizing: border-box; }
  :host {
    --_couleur: var(--bib-retroaction-couleur, var(--couleur-fond-fort, var(--md-sys-color-primary, rgb(64 95 144))));
    --_couleur-survol: var(--bib-retroaction-couleur-survol, var(--couleur-fond-fort-survol, var(--_couleur)));
    --_sur-couleur: var(--bib-retroaction-sur-couleur, var(--couleur-sur-fonce, var(--md-sys-color-on-primary, #fff)));
    --_accent: var(--bib-retroaction-accent, var(--couleur-accent, var(--_couleur)));
    --_focus: var(--bib-retroaction-focus, var(--couleur-focus, var(--_couleur)));
    --_texte: var(--bib-retroaction-texte, var(--couleur-texte, currentColor));
    --_bordure: var(--couleur-bordure, var(--md-sys-color-outline, rgb(116 119 127)));
    --_surface: var(--couleur-surface, transparent);
    --_cible: var(--taille-cible, 44px);
    --_rayon-plein: var(--rayon-plein, 9999px);
    --_rayon-petit: var(--rayon-petit, 4px);
    --_graisse: var(--graisse-moyenne, 500);
    --_taille-boutons: var(--md-sys-typescale-label-large-size, inherit);

    display: block;
    font-size: var(--bib-comp-retroaction-usager-size, 0.875rem);
    line-height: 1.43;
    text-align: center;
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]), [hidden] { display: none !important; }

  p { margin: 0; }

  .survey-title {
    font-weight: var(--bib-comp-retroaction-usager-title-weight, var(--md-sys-typescale-title-medium-weight, var(--_graisse)));
  }

  .radio-group { display: flex; justify-content: center; gap: 2px; margin-top: 0.25rem; }

  button { font: inherit; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  button[aria-disabled='true'] { opacity: 0.65; cursor: not-allowed; }
  button:focus-visible, textarea:focus-visible, a:focus-visible {
    outline: 3px solid var(--_focus);
    outline-offset: 2px;
  }

  /* Pouces : cible de 44 px (WCAG 2.5.8 demande 24 px), pastille pleine une fois choisis */
  .btn-vote {
    display: inline-grid;
    place-items: center;
    width: var(--_cible);
    height: var(--_cible);
    padding: 0;
    border: 0;
    border-radius: var(--_rayon-plein);
    background: transparent;
    color: var(--_texte);
    transition: background-color 150ms cubic-bezier(0.2, 0, 0, 1), color 150ms cubic-bezier(0.2, 0, 0, 1);
  }
  @media (hover: hover) and (pointer: fine) {
    .btn-vote:hover:not([aria-disabled='true']) {
      background-color: rgb(0 0 0 / 8%);
      background-color: color-mix(in srgb, currentColor 8%, transparent);
    }
  }
  .btn-vote[aria-pressed='true'],
  .btn-vote[aria-pressed='true']:hover { background-color: var(--_couleur); color: var(--_sur-couleur); }

  .commentaire { max-width: 32rem; margin: 1rem auto 0; text-align: start; }
  .intro { margin-bottom: 0.95rem; text-align: center; }

  .form-group { margin: 0; }
  .label { display: block; margin-bottom: 0.3rem; color: var(--_texte); font-weight: var(--_graisse); }
  .optionnel { font-weight: normal; }
  .width-full { width: 100%; }

  textarea {
    display: block;
    min-height: 110px;
    padding: 0.7rem 0.75rem;
    border: 1px solid var(--_bordure);
    border-radius: var(--_rayon-petit);
    background: var(--_surface);
    color: var(--_texte);
    font: inherit;
    resize: vertical;
  }
  textarea::placeholder { color: inherit; opacity: 0.7; }

  .aide { margin: 0.3rem 0 0.6rem; }
  a { color: inherit; }

  .form-group-submit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    margin-top: 0.6rem;
  }

  .btn-submit {
    min-height: var(--_cible);
    padding: 0 1.5rem;
    border: 0;
    border-radius: var(--_rayon-plein);
    background-color: var(--_couleur);
    color: var(--_sur-couleur);
    font-size: var(--_taille-boutons);
    font-weight: var(--_graisse);
    transition: background-color 150ms cubic-bezier(0.2, 0, 0, 1);
  }
  @media (hover: hover) and (pointer: fine) {
    .btn-submit:hover:not([aria-disabled='true']) { background-color: var(--_couleur-survol); }
  }

  .erreur { display: inline-flex; align-items: center; gap: 0.45rem; margin-top: 0.8rem; font-weight: 600; }
  .erreur:empty { display: none; }
  .erreur svg { flex: none; }

  .resultat { display: flex; align-items: center; justify-content: center; gap: 0.6rem; color: var(--_texte); }
  .resultat svg { flex: none; color: var(--_accent); }
  .resultat:focus { outline: none; }

  .masque {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .form-group-submit { flex-direction: column; align-items: stretch; }
    .compteur { align-self: flex-end; }
  }

  @media (forced-colors: active) {
    .btn-vote[aria-pressed='true'] { outline: 2px solid SelectedItem; }
    .btn-submit { border: 1px solid ButtonText; }
  }
`
