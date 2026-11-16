/*
 * Horaire de la semaine d'un service (facultatif) : lit l'API des horaires (huit semaines en une requête) et
 * construit les onglets des jours de horaire-semaine.css.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-horaire-semaine.min.js"></script>
 *
 * Repères : [data-horaire-semaine] avec data-bibliotheque (code de la bibliothèque dans l'API, ex. ss),
 * data-service (ex. soutien-informatique) et data-api (facultatif : une autre adresse de l'API) ; dedans
 * [data-periode], [data-navigation], [data-precedente], [data-suivante], [data-repli], [data-chargement],
 * .bib-etat-erreur et son [data-reessayer], [data-vue], [data-onglets], [data-panneau], [data-date], [data-valeur].
 *
 * - Motif Onglets de l'APG : un onglet par jour (flèches, Début, Fin), activation automatique ; Précédente et
 *   Suivante changent de semaine. Le bouton de semaine qui se désactive passe le focus à l'autre (WCAG 2.4.3).
 * - Les dates suivent le fuseau de Montréal, pas celui du visiteur (src/horaires/horaires.ts).
 */
import { HORAIRES_API, ajouterJours, analyserHoraires, formaterDate, formaterPlages, lundiDe, maintenantMontreal, urlHoraires, type Plage } from '../horaires/horaires.ts'

const NB_SEMAINES = 8

const span = (classe: string, texte: string, decoratif = false) => {
  const element = Object.assign(document.createElement('span'), { className: classe, textContent: texte })
  if (decoratif) element.setAttribute('aria-hidden', 'true')
  return element
}

let compteur = 0

function initialiser(racine: HTMLElement) {
  const code = racine.dataset.bibliotheque ?? ''
  const service = racine.dataset.service ?? 'regulier'
  const api = racine.dataset.api || HORAIRES_API
  const id = racine.id || `horaire-semaine-${++compteur}`
  const periode = racine.querySelector<HTMLElement>('[data-periode]')!
  const navigation = racine.querySelector<HTMLElement>('[data-navigation]')!
  const precedente = racine.querySelector<HTMLButtonElement>('[data-precedente]')!
  const suivante = racine.querySelector<HTMLButtonElement>('[data-suivante]')!
  const repli = racine.querySelector<HTMLElement>('[data-repli]')
  const chargement = racine.querySelector<HTMLElement>('[data-chargement]')
  const erreur = racine.querySelector<HTMLElement>('.bib-etat-erreur')
  const vue = racine.querySelector<HTMLElement>('[data-vue]')!
  const onglets = racine.querySelector<HTMLElement>('[data-onglets]')!
  const panneau = racine.querySelector<HTMLElement>('[data-panneau]')!
  if (!panneau.id) panneau.id = `${id}-panneau`

  const aujourdhui = maintenantMontreal().date
  const lundi0 = lundiDe(aujourdhui)
  let horaires: Record<string, Plage[]> = {}
  let semaine = 0
  let choisi = 0

  const jours = () => Array.from({ length: 7 }, (_, i) => ajouterJours(lundi0, semaine * 7 + i))

  const choisir = (index: number, focaliser = false) => {
    choisi = index
    const boutons = [...onglets.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
    boutons.forEach((b, i) => {
      b.setAttribute('aria-selected', String(i === index))
      b.tabIndex = i === index ? 0 : -1
    })
    const jour = jours()[index]
    const plages = horaires[jour]
    panneau.setAttribute('aria-labelledby', boutons[index].id)
    panneau.querySelector('[data-date]')!.textContent = formaterDate(jour, { weekday: 'long', day: 'numeric', month: 'long' })
    const champ = panneau.querySelector<HTMLElement>('[data-valeur]')!
    champ.textContent = formaterPlages(plages)
    champ.toggleAttribute('data-ferme', !plages?.length)
    if (focaliser) boutons[index].focus()
  }

  const afficherSemaine = () => {
    const liste = jours()
    const long = { day: 'numeric', month: 'long', year: 'numeric' } as const
    periode.textContent = `du ${formaterDate(liste[0], long)} au ${formaterDate(liste[6], long)}`
    precedente.disabled = semaine === 0
    suivante.disabled = semaine === NB_SEMAINES - 1
    onglets.replaceChildren(
      ...liste.map((jour, i) => {
        const bouton = document.createElement('button')
        bouton.type = 'button'
        bouton.setAttribute('role', 'tab')
        bouton.id = `${id}-jour-${i}`
        bouton.className = 'bib-horaire-semaine__jour'
        bouton.setAttribute('aria-controls', panneau.id)
        bouton.toggleAttribute('data-aujourdhui', jour === aujourdhui)
        // Abréviation à l'écran, nom complet pour les lecteurs d'écran : « lundi 2 novembre (aujourd'hui) »
        bouton.append(
          span('bib-horaire-semaine__nom', formaterDate(jour, { weekday: 'short' }).replace('.', ''), true),
          span('bib-masque', `${formaterDate(jour, { weekday: 'long' })} `),
          span('bib-horaire-semaine__numero', String(Number(jour.slice(8)))),
          span('bib-masque', ` ${formaterDate(jour, { month: 'long' })}${jour === aujourdhui ? ' (aujourd’hui)' : ''}`),
        )
        bouton.addEventListener('click', () => choisir(i))
        return bouton
      }),
    )
    const index = liste.indexOf(aujourdhui)
    choisir(index >= 0 ? index : 0)
  }

  onglets.addEventListener('keydown', (e) => {
    const cibles: Record<string, number> = { ArrowRight: (choisi + 1) % 7, ArrowLeft: (choisi + 6) % 7, Home: 0, End: 6 }
    if (!(e.key in cibles)) return
    e.preventDefault()
    choisir(cibles[e.key], true)
  })

  const changerSemaine = (pas: number, bouton: HTMLButtonElement, autre: HTMLButtonElement) => {
    const avaitFocus = document.activeElement === bouton
    semaine = Math.min(NB_SEMAINES - 1, Math.max(0, semaine + pas))
    afficherSemaine()
    if (avaitFocus && bouton.disabled) autre.focus()
  }
  precedente.addEventListener('click', () => changerSemaine(-1, precedente, suivante))
  suivante.addEventListener('click', () => changerSemaine(1, suivante, precedente))

  const charger = async () => {
    if (repli) repli.hidden = true
    if (erreur) erreur.hidden = true
    if (chargement) chargement.hidden = false
    try {
      const reponse = await fetch(urlHoraires(lundi0, NB_SEMAINES * 7, api), { signal: AbortSignal.timeout(10000) })
      if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`)
      // L'API renvoie tout le réseau : on garde la bibliothèque et le service voulus
      horaires = analyserHoraires(await reponse.json()).parBib[code]?.[service] ?? {}
      if (chargement) chargement.hidden = true
      vue.hidden = false
      navigation.hidden = false
      afficherSemaine()
    } catch (e) {
      console.error('Horaire de la semaine :', e)
      if (chargement) chargement.hidden = true
      if (erreur) erreur.hidden = false
      if (repli) repli.hidden = false
    }
  }

  racine.querySelector('[data-reessayer]')?.addEventListener('click', () => {
    racine.tabIndex = -1
    racine.dataset.focusProgramme = ''
    racine.focus()
    void charger()
  })
  void charger()
}

function brancher() {
  for (const racine of document.querySelectorAll<HTMLElement>('[data-horaire-semaine]:not([data-pret])')) {
    racine.toggleAttribute('data-pret', true)
    initialiser(racine)
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
