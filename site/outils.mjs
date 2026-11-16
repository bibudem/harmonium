// Petits outils de rédaction des pages calculées (site/donnees/)

export const echapper = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** Bloc de code (le texte est échappé ; le bouton « Copier » est ajouté par site.js) */
export const code = (texte) => `<pre><code>${echapper(texte.replace(/^\n+|\s+$/g, ''))}</code></pre>`

/** Tableau : en-têtes, lignes de cellules HTML */
export const tableau = (entetes, lignes, classe = '') =>
  `<div class="tableau"><table${classe ? ` class="${classe}"` : ''}><thead><tr>${entetes.map((e) => `<th scope="col">${e}</th>`).join('')}</tr></thead><tbody>${lignes
    .map((l) => `<tr>${l.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`

export const c = (t) => `<code>${echapper(t)}</code>`
