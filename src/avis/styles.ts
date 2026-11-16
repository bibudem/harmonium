// Styles de <bib-avis>. Croix à 60 % de noir : 3:1 au moins sur le fond jaune (WCAG 1.4.11).
export const STYLES = `
  :host, *, *::before, *::after { box-sizing: border-box; }
  :host {
    display: block;
    font-size: var(--bib-avis-size, var(--md-sys-typescale-title-medium-size, inherit));
    background: var(--bib-avis-container-color, var(--md-sys-color-warningContainer, #ffe8ac));
  }
  :host([hidden]) { display: none; }
  /* Reçoit le focus quand l'avis est fermé (le bouton disparaît) : rien à montrer */
  :host(:focus) { outline: none; }
  .inner {
    display: flex;
    align-items: center;
    gap: 1em;
    margin: 0 auto;
    padding: 16px;
  }
  :host(:not([fluide])) .inner {
    max-width: 1536px;
    padding: 16px var(--bib-avis-spacing-inline, 64px);
  }
  .message { flex-grow: 1; min-height: 24px; }
  .btn-close {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background-color: transparent;
    color: var(--bib-btn-close-color, rgba(0, 0, 0, 0.6));
    font: inherit;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn-close:hover { color: var(--bib-btn-close-hover-color, rgba(0, 0, 0, 0.8)); }
  .btn-close:focus-visible {
    outline: var(--md-focus-ring-width, 3px) solid currentColor;
    outline-offset: 3px;
    border-radius: 99999px;
  }
  .btn-close > svg { fill: currentColor; }
  /* Contraste élevé : le fond jaune disparaît, une bordure délimite l'avis */
  @media (forced-colors: active) {
    .container { border-block: 1px solid CanvasText; }
  }
`
