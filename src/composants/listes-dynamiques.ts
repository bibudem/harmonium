/*
 * Listes chargées dans le navigateur : les événements (flux RSS du calendrier de l'Université) et les
 * formations (API JSON). Les flux ne sont pas lus à la construction du site : ils changent tous les jours.
 *
 *   <script type="module" src="…/harmonium@1/dist/bib-listes-dynamiques.min.js"></script>
 *
 * Repères d'une liste (voir la fiche Listes d'actualités) : [data-liste-evenements] ou
 * [data-liste-formations] sur le conteneur, avec data-service (adresse du flux), data-limite et, pour les
 * événements, data-repli-image (image décorative quand l'événement n'en a pas, ou que la sienne ne se charge
 * pas) ; dedans, des éléments [data-etat="chargement|pret|erreur|vide"] (un seul affiché à la fois), la liste
 * [data-liste], le gabarit <template data-gabarit> (un élément d'actualité dont les champs portent
 * data-champ="lien|titre|vignette|date") et le bouton [data-reessayer] de l'état d'erreur. Sans JavaScript, le
 * HTML garde le renvoi vers le calendrier.
 */
type Element = HTMLElement

/** GET avec un délai par tentative ; réessaie avant d'abandonner */
async function chargerAvecDelai<T>(url: string, lire: (reponse: Response) => Promise<T>, { delai = 5000, tentatives = 1 } = {}): Promise<T> {
  for (let tentative = 1; ; tentative++) {
    try {
      const reponse = await fetch(url, { signal: AbortSignal.timeout(delai) })
      if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`)
      return await lire(reponse)
    } catch (erreur) {
      // Le détail reste dans la console ; le visiteur voit un message clair
      console.error(`Chargement de ${url} (tentative ${tentative}/${tentatives}) :`, erreur)
      if (tentative >= tentatives) throw erreur
    }
  }
}

const cloner = (gabarit: HTMLTemplateElement) => gabarit.content.firstElementChild!.cloneNode(true) as Element

/** Remplit un élément cloné : lien, titre et, s'il y a lieu, la vignette (avec une image de repli) */
function remplir(element: Element, { url, titre, image, repli }: { url: string; titre: string; image?: string; repli?: string }) {
  element.querySelector<HTMLAnchorElement>('[data-champ="lien"]')?.setAttribute('href', url)
  const champTitre = element.querySelector('[data-champ="titre"]')
  if (champTitre) champTitre.textContent = titre
  const vignette = element.querySelector('[data-champ="vignette"]')
  const source = image || repli
  if (vignette && source) {
    const img = document.createElement('img')
    img.alt = ''
    img.loading = 'lazy'
    img.decoding = 'async'
    img.width = 300
    img.height = 300
    // Image introuvable : on passe au repli, sinon on garde le carré vide plutôt qu'une icône cassée (et on ne
    // boucle pas si le repli échoue).
    img.addEventListener('error', function surErreur() {
      if (repli && img.getAttribute('src') !== repli) img.src = repli
      else {
        img.removeEventListener('error', surErreur)
        img.remove()
      }
    })
    img.src = source
    vignette.append(img)
  }
}

/** Montre l'un des états d'une liste (data-etat) et masque les autres */
function montrerEtat(racine: Element, etat: string) {
  for (const el of racine.querySelectorAll<Element>('[data-etat]')) el.hidden = el.dataset.etat !== etat
  racine.setAttribute('aria-busy', String(etat === 'chargement'))
}

/** Branche « Réessayer » : le bouton disparaît pendant le nouveau chargement, le focus passe au conteneur */
function brancherReessayer(racine: Element, charger: () => void) {
  racine.querySelector('[data-reessayer]')?.addEventListener('click', () => {
    racine.tabIndex = -1
    racine.dataset.focusProgramme = ''
    racine.focus()
    charger()
  })
}

function remplirDate(element: Element, texte: string) {
  const champ = element.querySelector('[data-champ="date"]')
  if (champ) champ.textContent = texte
}

const formatDate = new Intl.DateTimeFormat('fr-CA', { day: 'numeric', month: 'long', year: 'numeric' })

async function lireRss(reponse: Response) {
  const xml = new DOMParser().parseFromString(await reponse.text(), 'text/xml')
  const erreur = xml.querySelector('parsererror')
  if (erreur) throw new Error(`XML illisible : ${erreur.textContent}`)
  // Un flux vide ou une page d'erreur n'a pas de <channel>
  if (!xml.querySelector('channel')) throw new Error('Structure RSS invalide')
  return xml
}

function evenements(xml: Document, limite: number) {
  const vus = new Set<string>()
  const resultat: { titre: string; url: string; image?: string; date: string }[] = []
  for (const item of xml.querySelectorAll('item')) {
    if (resultat.length >= limite) break
    const titre = item.querySelector('title')?.textContent?.trim()
    const date = new Date(item.querySelector('pubDate')?.textContent?.trim() ?? '')
    if (!titre || Number.isNaN(date.getTime())) continue
    // Le flux répète une activité pour chacun de ses types
    const cle = `${titre}:::${date.getHours()}:${date.getMinutes()}`
    if (vus.has(cle)) continue
    vus.add(cle)
    resultat.push({
      titre,
      url: item.querySelector('link')?.textContent?.trim() || 'https://calendrier.umontreal.ca/',
      image: item.querySelector('enclosure')?.getAttribute('url')?.trim() || undefined,
      date: formatDate.format(date),
    })
  }
  return resultat
}

type Formation = { url: string; titre: string; date: string; debut?: string; fin?: string; imageVedette?: string }

function brancher() {
  for (const racine of document.querySelectorAll<Element>('[data-liste-evenements], [data-liste-formations]')) {
    if (racine.dataset.pret === 'oui') continue
    racine.dataset.pret = 'oui'
    const liste = racine.querySelector<Element>('[data-liste]')
    const gabarit = racine.querySelector<HTMLTemplateElement>('template[data-gabarit]')
    const service = racine.dataset.service
    if (!liste || !gabarit || !service) continue
    const estEvenements = racine.hasAttribute('data-liste-evenements')
    const limite = Number(racine.dataset.limite) || (estEvenements ? 3 : 4)
    const repli = racine.dataset.repliImage || undefined

    const charger = async () => {
      montrerEtat(racine, 'chargement')
      try {
        let elements: Element[]
        if (estEvenements) {
          // Le flux met 2 à 3 s à répondre : 10 s par tentative, et une seconde tentative avant l'erreur
          const items = evenements(await chargerAvecDelai(service, lireRss, { delai: 10_000, tentatives: 2 }), limite)
          elements = items.map(({ titre, url, image, date }) => {
            const element = cloner(gabarit)
            remplir(element, { url, titre, image, repli })
            remplirDate(element, date)
            return element
          })
        } else {
          const formations = await chargerAvecDelai<Formation[]>(service, (r) => r.json(), { delai: 5000 })
          elements = (Array.isArray(formations) ? formations : []).slice(0, limite).map(({ url, titre, date, debut, fin, imageVedette }) => {
            const element = cloner(gabarit)
            remplir(element, { url, titre, image: imageVedette })
            remplirDate(element, `${date}${debut ? ` · ${debut}${fin ? `–${fin}` : ''}` : ''}`)
            return element
          })
        }
        liste.replaceChildren(...elements)
        montrerEtat(racine, elements.length ? 'pret' : 'vide')
      } catch {
        montrerEtat(racine, 'erreur')
      }
    }

    brancherReessayer(racine, charger)
    charger()
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher)
else brancher()
document.addEventListener('astro:page-load', brancher)
