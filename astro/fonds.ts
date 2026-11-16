/*
 * Fonds de couleur des bandes (<Section>), avec leur ton : le même tableau que les modificateurs
 * de src/composants/section.css. Usage interne et pour les sites Astro (Harmonium le publie
 * pour que les directives et le schéma des vitrines d'un site s'appuient sur une seule liste).
 *
 * Ton de chaque fond, d'après les contrastes calculés (WCAG 2.x) :
 * - fonce : blanc ≥ 7,1:1 (bleu principal 7,10, bleu 600 10,30, vert foncé 11,26, bleu foncé 18,17) ;
 * - moyen : le blanc ne passe pas (rouge orangé 3,61, violet 3,46, vert pâle 2,48), le bleu foncé
 *   oui (5,04 à 7,32) ; le lien bleu (1,97 à 4,33) et le texte orange non ;
 * - clair : bleu foncé ≥ 13,6:1, lien bleu ≥ 5,32:1, texte orange ≥ 4,61:1.
 * Jaune et rose 500 sont « moyens » à cause du texte orange (4,03 et 3,75) et du lien sur rose 500 (4,33).
 */
export const FONDS = {
  bleuPrincipal: { modificateur: 'bleu-principal', ton: 'fonce' },
  bleuFonce: { modificateur: 'bleu-fonce', ton: 'fonce' },
  bleu600: { modificateur: 'bleu-principal-fonce', ton: 'fonce' },
  vertFonce: { modificateur: 'vert-fonce', ton: 'fonce' },
  rougeOrange: { modificateur: 'rouge-orange', ton: 'moyen' },
  orange: { modificateur: 'orange', ton: 'moyen' },
  violetFonce: { modificateur: 'violet-fonce', ton: 'moyen' },
  vertPale: { modificateur: 'vert-pale', ton: 'moyen' },
  jaune: { modificateur: 'jaune', ton: 'moyen' },
  rose500: { modificateur: 'rose-500', ton: 'moyen' },
  bleu100: { modificateur: 'bleu-100', ton: 'clair' },
  bleu200: { modificateur: 'bleu-200', ton: 'clair' },
  jaunePale: { modificateur: 'jaune-pale', ton: 'clair' },
  rose100: { modificateur: 'rose-100', ton: 'clair' },
  rose300: { modificateur: 'rose-300', ton: 'clair' },
} as const satisfies Record<string, { modificateur: string; ton: 'fonce' | 'moyen' | 'clair' }>

export type Fond = keyof typeof FONDS
