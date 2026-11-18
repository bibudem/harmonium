/*
 * Deux informations distinctes :
 * - la maturité d’un composant (stable, bêta, déconseillé), affichée sous le titre de sa fiche ;
 * - son intégration dans les sites, suivie sur une seule page (sites/index.html), jamais dans les fiches.
 */
import { readFileSync } from 'node:fs'
import { echapper, tableau } from './outils.mjs'
const suivi = JSON.parse(readFileSync(new URL('./donnees/integrations.json', import.meta.url), 'utf8'))
const libelles = { 'a-integrer': 'À intégrer', 'en-cours': 'En cours', 'a-verifier': 'À vérifier', integre: 'Bien intégré' }

export const STATUTS = {
  stable: ['Stable', 'Éprouvé et documenté : à utiliser dans les nouvelles pages.'],
  beta: ['Bêta', 'Utilisable, mais son HTML, ses classes ou son apparence peuvent encore changer.'],
  deconseille: ['Déconseillé', 'Conservé pour les pages existantes ; ne pas l’employer dans une nouvelle page.'],
}

/** Pastille de maturité affichée sous le titre d’une fiche (stable par défaut). */
export function statutComposant(statut = 'stable', racine = '@@/') {
  const [libelle, sens] = STATUTS[statut] ?? []
  if (!libelle) throw new Error(`Statut de composant inconnu : ${statut}`)
  // Composant Pastilles : stable en bleu, bêta en jaune, déconseillé en rose
  const couleur = { stable: 'bleu', beta: 'jaune', deconseille: 'rose' }[statut] ?? 'bleu'
  return `<div class="statut-composant"><ul class="bib-pastilles" aria-label="Statut du composant"><li class="bib-pastille bib-pastille--${couleur}">${libelle}</li></ul> <span>${sens}</span> <a href="${racine}demarrer/principes.html#maturite">Statuts</a></div>`
}

/** Valide le suivi : une intégration « Bien intégré » doit être datée et prouvée. */
export function verifierSuivi(donnees = suivi) {
  for (const [chemin, etats] of Object.entries(donnees.composants)) {
    for (const site of donnees.sites) {
      const v = etats[site.id]
      if (!v) continue
      if (!libelles[v.etat]) throw new Error(`État d’intégration inconnu : ${v.etat}`)
      if (v.etat === 'integre' && (!v.date || !v.preuve)) throw new Error(`Validation incomplète : ${chemin} dans ${site.nom}`)
    }
  }
  return donnees
}

export function donneesIntegration(donnees = suivi) {
  verifierSuivi(donnees)
  return {
    'integration-sites': tableau(['Site', 'État du socle', 'Composants validés'], donnees.sites.map((site) => {
      const valides = Object.entries(donnees.composants).filter(([, etats]) => etats[site.id]?.etat === 'integre')
      return [echapper(site.nom), libelles[site.etat], String(valides.length)]
    })),
  }
}
