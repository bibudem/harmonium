/*
 * Analyse d'une adresse de lien, partagée par Lien, Bouton et les cartes (usage interne).
 *
 * L’origine du site hôte décide des liens internes. Une adresse relative reste locale ;
 * une adresse absolue du même site aussi. Les environnements d’un même site (production, essai) partagent leur
 * identité, tandis qu’un lien entre deux sites de la famille reste un changement de site.
 */

const HOTES_INTERNES = new Set(['bib.umontreal.ca', 'bib-pp.umontreal.ca', 'bib-prod.umontreal.ca'])

export type AnalyseLien = {
  /** Chemin ou adresse du site hôte */
  interne: boolean
  /** mailto: ou tel: */
  courrielOuTelephone: boolean
  /** Le fichier visé est un PDF */
  pdf: boolean
}

export function analyserLien(adresse: string | undefined | null, origine = 'https://bib.umontreal.ca'): AnalyseLien {
  const href = (adresse ?? '').trim()
  const courrielOuTelephone = /^(mailto|tel):/i.test(href)
  let pdf = false
  let interne = false
  try {
    const base = new URL(origine)
    const url = new URL(href, base)
    // Le format appartient au chemin, pas à une recherche « ?q=rapport.pdf ».
    pdf = /^https?:$/.test(url.protocol) && /\.pdf$/i.test(url.pathname)
    interne = url.origin !== 'null' && (url.origin === base.origin || (HOTES_INTERNES.has(base.hostname) && HOTES_INTERNES.has(url.hostname)))
  } catch {
    interne = false
  }
  return { interne, courrielOuTelephone, pdf }
}

/**
 * Le lien mène-t-il ailleurs (flèche oblique ↗) ? Oui pour une adresse hors de la famille
 * Bibliothèques, ou pour un lien qui s'ouvre dans un nouvel onglet. Jamais pour un PDF (son
 * icône vient du CSS) ni pour un courriel ou un téléphone. Règle unique : liens, boutons et
 * cartes l'appliquent.
 */
export function versAilleurs({ interne, courrielOuTelephone, pdf }: AnalyseLien, nouvelOnglet = false) {
  return !pdf && !courrielOuTelephone && (!interne || nouvelOnglet)
}

/** Texte masqué qui annonce ce que la vue seule laisse deviner (PDF, onglet) */
export function annonceLien({ pdf, nouvelOnglet }: { pdf: boolean; nouvelOnglet: boolean }) {
  const parties = [pdf && 'PDF', nouvelOnglet && 'nouvel onglet'].filter(Boolean)
  return parties.length ? ` (${parties.join(', ')})` : ''
}

/** Valeur de rel : celle de l'auteur, plus noopener pour un autre site ou un nouvel onglet */
export function relDuLien(rel: string | undefined, interne: boolean, nouvelOnglet: boolean) {
  if (interne && !nouvelOnglet) return rel
  return [...new Set([...(rel ?? '').split(/\s+/).filter(Boolean), 'noopener'])].join(' ')
}

/** Attributs et annonce d'un lien de carte : l'analyse est calculée à la construction */
export function lienCarte(href: string, target?: string, rel?: string, origine?: string) {
  const analyse = analyserLien(href, origine)
  const cible = analyse.pdf ? '_blank' : target
  const nouvelOnglet = cible === '_blank'
  return {
    interne: analyse.interne,
    externe: versAilleurs(analyse, nouvelOnglet),
    afficherFleche: !analyse.pdf && !analyse.courrielOuTelephone,
    cible,
    rel: relDuLien(rel, analyse.interne, nouvelOnglet),
    annonce: annonceLien({ pdf: analyse.pdf, nouvelOnglet }),
  }
}
