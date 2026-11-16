/* Suivi explicite : une disponibilité dans Harmonium ne vaut pas validation dans un site. */
import { readFileSync } from 'node:fs'
import { echapper, tableau } from './outils.mjs'
const suivi = JSON.parse(readFileSync(new URL('./donnees/integrations.json', import.meta.url), 'utf8'))
const libelles = { 'a-integrer': 'À intégrer', 'en-cours': 'En cours', 'a-verifier': 'À vérifier', integre: 'Bien intégré' }

export function integrationComposant(chemin, racine = '@@/', donnees = suivi) {
  const sites = donnees.sites.map((site) => {
    const verification = donnees.composants[chemin]?.[site.id]
    const etat = verification?.etat ?? site.etat
    if (!libelles[etat]) throw new Error(`État d’intégration inconnu : ${etat}`)
    if (etat === 'integre' && (!verification?.date || !verification?.preuve)) {
      throw new Error(`Validation incomplète : ${chemin} dans ${site.nom}`)
    }
    return `<li><span>${echapper(site.nom)}</span> <strong>${libelles[etat]}</strong>${verification?.date ? ` <small>(${echapper(verification.date)})</small>` : ''}</li>`
  }).join('')
  return `<div class="integration-composant"><ul aria-label="Intégration du composant par site">${sites}</ul><a href="${racine}sites/index.html">Suivi d’intégration</a></div>`
}

export function donneesIntegration() {
  return {
    'integration-sites': tableau(['Site', 'État du socle', 'Composants validés'], suivi.sites.map((site) => {
      const valides = Object.entries(suivi.composants).filter(([, etats]) => etats[site.id]?.etat === 'integre')
      return [echapper(site.nom), libelles[site.etat], String(valides.length)]
    })),
    'date-integration': new Intl.DateTimeFormat('fr', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(suivi.verification + 'T00:00:00Z')),
  }
}
