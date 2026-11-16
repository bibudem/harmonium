// Styles de <udem-urgence> : hauteurs selon le texte, le message n'est jamais coupé.
export const STYLES = `
  :host, *, *::before, *::after { box-sizing: border-box; }
  :host { display: block; -webkit-font-smoothing: antialiased; }
  :host([hidden]) { display: none; }

  .wrapper {
    position: relative;
    width: 100%;
    background-color: #282828;
    border-bottom: 7px solid #40474f;
    color: #fff;
    font-size: 13px;
  }
  .container { min-height: 48px; background: #b60000; }
  .content {
    display: flex;
    align-items: stretch;
    min-height: 48px;
    margin-inline: auto;
    padding-inline: 15px;
  }
  @media (min-width: 768px) { .content { max-width: 768px; } }
  @media (min-width: 992px) { .content { max-width: 970px; } }
  @media (min-width: 1200px) { .content { max-width: 1220px; } }

  .title {
    align-self: center;
    margin: 0;
    padding: 8px 12px;
    color: #fff;
    font-size: 17px;
    line-height: 22px;
    text-decoration: none;
    overflow-wrap: anywhere;
  }
  /* Tout le bandeau est cliquable : la zone du lien le recouvre */
  .title::after { content: ''; position: absolute; inset: 0; }
  .title:hover .texte { text-decoration: underline; }
  .title:focus { outline: none; }
  .title:focus-visible::after { outline: 3px solid #fff; outline-offset: -5px; }

  .datetime {
    display: flex;
    flex: none;
    flex-direction: column;
    justify-content: center;
    order: -1;
    min-width: 127px;
    margin: 0;
    padding: 7px 12px 4px;
    background: #40474f;
    font-size: 15px;
    line-height: 17px;
    text-align: center;
    text-transform: uppercase;
  }

  .big .content { flex-direction: column; align-items: flex-start; }
  .big .title { align-self: flex-start; padding: 12px 0; font-size: 18px; line-height: normal; }
  .big .datetime { order: 1; flex-direction: row; gap: 0.5em; line-height: 36px; }
  .big .datetime br { display: none; }

  @media (max-width: 599.98px) {
    .content, .big .content { flex-direction: column; align-items: stretch; padding: 0; }
    .datetime, .big .datetime { order: -1; flex-direction: row; justify-content: flex-start; gap: 0.5em; padding: 4px 15px; line-height: 17px; }
    .datetime br { display: none; }
    .title, .big .title { align-self: stretch; padding: 8px 15px 10px; font-size: 16px; }
  }

  .masque {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (forced-colors: active) {
    .wrapper { border-bottom-color: CanvasText; }
    .title:focus-visible::after { outline-color: LinkText; }
  }
`
