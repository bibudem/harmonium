/*
 * Sémantique des tableaux, réglée à la construction sur le HTML du slot (usage interne).
 *
 * Astro n'a pas de contexte entre composants pour choisir <th> ou <td> (MUI le faisait par
 * contexte React). On rend donc le contenu, puis on change les cellules d'en-tête en
 * <th scope="col"> et on ajoute la portée aux <th> écrits à la main qui n'en ont pas
 * (scope="row" dans le corps).
 */

/** Contenu de <thead> : toutes les cellules deviennent des en-têtes de colonne */
export function entetesDeColonne(html: string): string {
  return ajouterPortee(html.replace(/<td(\s[^>]*)?>/g, (_, attributs = '') => `<th${attributs}>`).replace(/<\/td>/g, '</th>'), 'col')
}

/** Ajoute scope aux <th> qui n'en ont pas */
export function ajouterPortee(html: string, portee: 'col' | 'row'): string {
  return html.replace(/<th(\s[^>]*)?>/g, (balise, attributs = '') => (/\sscope=/.test(attributs) ? balise : `<th scope="${portee}"${attributs}>`))
}

/** Tableau complet : col dans <thead>, row ailleurs */
export function semantiqueTableau(html: string): string {
  return html.replace(/(<thead[\s>][\s\S]*?<\/thead>)|(<th(?:\s[^>]*)?>)/g, (bloc, entete: string | undefined) =>
    entete ? entetesDeColonne(entete) : ajouterPortee(bloc, 'row'),
  )
}
