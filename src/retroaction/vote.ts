/*
 * Données d'une réponse pour l'API de LibWizard (insertSubmission) : formulaire 43176,
 * champ 1570387 (vote : « oui » ou « non »), champ 1570390 (commentaire).
 */
const FORMULAIRE = 43176
const CHAMP_VOTE = 1570387
const CHAMP_COMMENTAIRE = 1570390

/**
 * Adresse complète de la page notée (paramètres et ancre compris) : celle
 * du cadre principal si elle est lisible, sinon celle du cadre.
 */
function adressePage() {
  try {
    return window.top?.location.href ?? location.href
  } catch {
    return location.href
  }
}

export function donneesVote(guid: unknown, vote: string, commentaire: string, maintenant = new Date()) {
  return {
    formId: FORMULAIRE,
    flags: 0,
    collectIP: false,
    collectBrowser: true,
    collectRefer: true,
    isPreview: false,
    guid,
    data: [
      { flags: 0, formId: FORMULAIRE, fieldId: CHAMP_VOTE, hidden: false, type: 'control_radio', data: vote },
      { flags: 0, formId: FORMULAIRE, fieldId: CHAMP_COMMENTAIRE, hidden: false, type: 'control_multi', data: commentaire },
    ],
    // Heure de Montréal, « AAAA-MM-JJ HH:MM:SS » : ce champ n'a pas de
    // fuseau, et une heure UTC paraîtrait 4 ou 5 h en avance dans LibWizard
    arrive: maintenant.toLocaleString('sv-SE', { timeZone: 'America/Toronto' }),
    referrer: adressePage(),
  }
}
