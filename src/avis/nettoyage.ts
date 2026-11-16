/*
 * Nettoyage du HTML reçu du service d'avis. L'avis s'affiche sur des sites que nous ne
 * contrôlons pas : seule la mise en forme de texte passe. Les éléments inconnus sont
 * remplacés par leur contenu ; les éléments actifs (script, iframe, svg…) disparaissent avec
 * leur contenu ; les attributs hors liste (on*, style…) sont retirés ; un lien n'accepte que
 * http, https, mailto, tel ou une adresse relative.
 */
const ELEMENTS = new Set(['A', 'ABBR', 'B', 'BR', 'CODE', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'S', 'SMALL', 'SPAN', 'STRONG', 'SUB', 'SUP', 'TIME', 'U', 'UL'])
const SUPPRIMES = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'IFRAME', 'FRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'NOSCRIPT', 'LINK', 'META', 'BASE'])
const ATTRIBUTS = new Set(['href', 'title', 'lang', 'dir', 'target', 'datetime'])
const ADRESSE_SURE = /^(?:https?:|mailto:|tel:|[^:]*$)/i

export function nettoyer(html: string): DocumentFragment {
  const gabarit = document.createElement('template')
  gabarit.innerHTML = html
  nettoyerNoeud(gabarit.content)
  return gabarit.content
}

function nettoyerNoeud(parent: ParentNode) {
  for (const noeud of [...parent.childNodes]) {
    if (noeud.nodeType === Node.COMMENT_NODE) {
      noeud.remove()
      continue
    }
    if (!(noeud instanceof Element)) continue
    const nom = noeud.tagName.toUpperCase()
    if (SUPPRIMES.has(nom)) {
      noeud.remove()
      continue
    }
    nettoyerNoeud(noeud)
    if (!ELEMENTS.has(nom)) {
      noeud.replaceWith(...noeud.childNodes)
      continue
    }
    for (const { name } of [...noeud.attributes]) {
      if (!ATTRIBUTS.has(name)) noeud.removeAttribute(name)
    }
    if (nom === 'A') {
      const href = (noeud.getAttribute('href') ?? '').replace(/[\s\u0000-\u001f]/g, '')
      if (!ADRESSE_SURE.test(href)) noeud.removeAttribute('href')
      if (noeud.getAttribute('target') === '_blank') noeud.setAttribute('rel', 'noopener noreferrer')
      else noeud.removeAttribute('target')
    }
  }
}
