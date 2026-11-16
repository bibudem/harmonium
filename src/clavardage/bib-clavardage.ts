/*
 * Clavardage flottant des Bibliothèques de l'UdeM (widget LibChat « flottant »),
 * en bas à droite de l'écran, pour n'importe quel site.
 *
 * Utilisation (une balise, réglages facultatifs en data-*) :
 *   <script defer src="…/bib-clavardage.min.js"></script>
 *
 * LibChat construit tout lui-même, à la fin du <body> : un bloc
 * #s-lch-widget-<id> (.s-lch-widget-float) avec un bouton icône
 * (.s-lch-widget-float-btn, nom accessible dans aria-label).
 * - ≥ 700 px (règle de LibChat) : le clic ouvre la conversation dans un
 *   panneau intégré (iframe .s-lch-widget-float-load) au-dessus du bouton.
 * - < 700 px : le clic ouvre la conversation dans un nouvel onglet.
 *
 * Ce script règle tout ce qui est hors de l'iframe : le bouton (rond, libellé
 * visible), la place du bloc, le cadre du panneau, l'invitation et
 * l'accessibilité. Le contenu du panneau (couleurs, textes) se règle dans
 * l'administration de LibAnswers.
 *
 * L'invitation automatique de LibAnswers doit rester désactivée (délai 0
 * dans les paramètres du widget) : elle ouvrirait le panneau en même temps
 * que la bulle de ce script et y déplacerait le focus.
 *
 * Avec <bib-consentement> sur la page, le bloc se place au-dessus de la carte
 * de consentement tant qu'elle est affichée (--bib-consentement-hauteur).
 */
import styles from './styles.css'

// Valeurs par défaut : le widget des Bibliothèques de l'UdeM
const DEFAUTS = {
  hote: 'unequestion.bib.umontreal.ca',
  hash: '5bf2a2d1005334dfc19c0251445da11752707fc7cf749dde3926c32db9dc5b6a',
  id: '9467',
  version: '1',
  invitation: '30',
  texteInvitation: 'Une question? Un technicien ou une technicienne en documentation est là pour vous aider.',
  langue: 'fr-CA',
}

// Réglages lus sur la balise <script> elle-même (data-hash, data-id…).
// En type="module", document.currentScript est null : la balise est retrouvée par son adresse.
const balise =
  (document.currentScript as HTMLScriptElement | null) ??
  document.querySelector<HTMLScriptElement>('script[src*="bib-clavardage"]')
if (!balise) console.warn('[bib-clavardage] Balise <script> introuvable : réglages par défaut (data-* ignorés).')
const reglages = { ...DEFAUTS, ...balise?.dataset }
const ATTENTE_LIBCHAT_MS = 30_000

// Le script ne s'exécute qu'une fois, même inclus deux fois par erreur
const MARQUE = '__bibClavardage'
const w = window as unknown as Record<string, boolean>
if (!w[MARQUE]) {
  w[MARQUE] = true
  demarrer()
}

function demarrer() {
  const idBloc = `s-lch-widget-${reglages.id}`
  const selecteurBloc = `#${CSS.escape(idBloc)}`

  // Feuille de style, au début du <head> : celle de LibChat, insérée à la fin,
  // vient après, mais les règles d'ici passent par l'id du bloc et gagnent
  const feuille = document.createElement('style')
  feuille.dataset.bibClavardage = ''
  feuille.textContent = styles.replaceAll('#s-lch-widget-9467', selecteurBloc)
  document.head.prepend(feuille)

  // Script de LibChat. `v` : LibAnswers garde le script une heure en cache ;
  // changer data-version après une modification du widget la fait prendre
  // tout de suite.
  const s = document.createElement('script')
  s.src = `https://${reglages.hote}/load_chat.php?hash=${encodeURIComponent(reglages.hash)}&v=${encodeURIComponent(reglages.version)}`
  s.async = true

  const trouverBouton = () => document.querySelector<HTMLButtonElement>(`${selecteurBloc} .s-lch-widget-float-btn`)

  // Le bloc de LibChat arrive après le chargement de son script. Sans bloc après 30 s
  // (script bloqué, service en panne), l'observateur s'arrête.
  const attendreBouton = new Promise<HTMLButtonElement>((resoudre) => {
    const deja = trouverBouton()
    if (deja) return resoudre(deja)
    const observateur = new MutationObserver(() => {
      const bouton = trouverBouton()
      if (bouton) {
        observateur.disconnect()
        resoudre(bouton)
      }
    })
    observateur.observe(document.documentElement, { childList: true, subtree: true })
    const abandonner = (raison: string) => {
      if (trouverBouton()) return
      observateur.disconnect()
      console.warn(`[bib-clavardage] LibChat indisponible (${raison}) : pas de clavardage sur cette page.`)
    }
    s.addEventListener('error', () => abandonner(`script ${s.src} non chargé`))
    setTimeout(() => abandonner('aucun widget après 30 s'), ATTENTE_LIBCHAT_MS)
  })
  document.head.append(s)

  // Échap ferme le panneau, quand le focus est dans le clavardage ou nulle part
  // (Échap dans un menu du site ne le ferme pas). Dans l'iframe, LibChat s'en charge.
  document.addEventListener(
    'keydown',
    (e) => {
      const bloc = document.getElementById(idBloc)
      if (e.key !== 'Escape' || !bloc?.classList.contains('open')) return
      const focus = document.activeElement
      if (focus && focus !== document.body && !bloc.contains(focus)) return
      const bouton = bloc.querySelector<HTMLButtonElement>('.s-lch-widget-float-btn')
      bouton?.click()
      bouton?.focus()
    },
    true,
  )

  // Ouvrir le clavardage depuis le site (un lien « Clavarder », par exemple) :
  //   window.dispatchEvent(new Event('bib:ouvrir-clavardage'))
  // L'événement est annulé (preventDefault) quand le clavardage le prend en charge : l'appelant sait ainsi
  // s'il doit proposer une autre voie (la page Clavarder, par exemple).
  window.addEventListener('bib:ouvrir-clavardage', (e) => {
    const bloc = document.getElementById(idBloc)
    const bouton = trouverBouton()
    if (!bloc || !bouton) return
    e.preventDefault()
    if (!bloc.classList.contains('open')) bouton.click()
  })

  attendreBouton.then((bouton) => {
    const bloc = bouton.closest<HTMLElement>(selecteurBloc)!
    accessibilite(bloc, bouton)
    const delai = Number(reglages.invitation)
    if (delai > 0) invitation(bloc, bouton, delai * 1000)
  })
}

/*
 * Accessibilité du widget de LibChat :
 * - la région et l'iframe s'appellent « Chat Widget » : nommées dans la
 *   langue du clavardage (WCAG 3.1.2), et le bloc porte cette langue même
 *   sur une page d'une autre langue ;
 * - la pastille « nouveau message » de LibChat est un point rouge sans
 *   texte : quand elle paraît, le bouton reçoit une description et une
 *   annonce polie est faite (WCAG 1.3.1, 4.1.3).
 */
function accessibilite(bloc: HTMLElement, bouton: HTMLButtonElement) {
  // Langue du widget LibChat (data-langue) ; les textes ajoutés ici sont en français
  bloc.lang = reglages.langue
  bloc.setAttribute('aria-label', reglages.langue.startsWith('fr') ? 'Clavardage' : 'Chat')

  const nommerIframe = () => {
    const iframe = bloc.querySelector('iframe')
    if (iframe && iframe.title !== 'Clavardage') iframe.title = 'Clavardage'
  }

  const description = document.createElement('span')
  description.id = `${bloc.id}-non-lu`
  // Masqué de tous : lu seulement comme description du bouton
  description.hidden = true
  description.textContent = 'Nouveau message'
  description.lang = 'fr-CA'
  const annonce = document.createElement('span')
  annonce.className = 'bib-clavardage-masque'
  annonce.setAttribute('role', 'status')
  annonce.lang = 'fr-CA'
  bloc.append(description, annonce)

  let nonLu = false
  const suivrePastille = () => {
    const pastille = bouton.querySelector<HTMLElement>('#s-lch-widget-float-indicator')
    const visible = !!pastille && pastille.style.display !== 'none'
    if (visible === nonLu) return
    nonLu = visible
    if (visible) {
      bouton.setAttribute('aria-describedby', description.id)
      annonce.textContent = 'Nouveau message dans le clavardage.'
    } else {
      bouton.removeAttribute('aria-describedby')
      annonce.textContent = ''
    }
  }

  /*
   * Le libellé (::after du rond) fait une, deux ou trois lignes selon son texte, la
   * police et l'espacement choisis par la personne (WCAG 1.4.12) : sa hauteur réelle
   * fixe la place gardée sous le rond, pour qu'il ne sorte pas de l'écran.
   */
  let hauteurLibelle = ''
  const mesurerLibelle = () => {
    const h = getComputedStyle(bouton, '::after').height
    if (h === hauteurLibelle || !h.endsWith('px')) return
    hauteurLibelle = h
    bloc.style.setProperty('--_libelle-mesure', `calc(${h} + 0.5rem)`)
  }
  new ResizeObserver(mesurerLibelle).observe(document.body)
  void document.fonts?.ready.then(mesurerLibelle)

  nommerIframe()
  suivrePastille()
  mesurerLibelle()
  new MutationObserver(() => {
    nommerIframe()
    suivrePastille()
    mesurerLibelle()
  }).observe(bloc, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'aria-label'] })
}

/*
 * Invitation : après `delai` ms, et seulement si le service est en ligne
 * (sinon elle attend qu'il ouvre), une bulle s'ouvre à gauche du rond et le
 * rond pulse trois fois (moins de 5 s, WCAG 2.2.2). Rien ne prend le focus :
 * la bulle est une région role=status. Son texte n'est pas cliquable (le rond
 * ouvre le clavardage) ; la croix la ferme. Fermée ou utilisée, elle ne
 * revient pas de la session (sessionStorage). Elle disparaît quand le panneau
 * s'ouvre.
 */
function invitation(bloc: HTMLElement, bouton: HTMLButtonElement, delai: number) {
  const CLE = 'bib-invitation-clavardage'
  const dejaVue = () => {
    try {
      return sessionStorage.getItem(CLE) === 'fermee'
    } catch {
      return false
    }
  }
  const memoriser = () => {
    try {
      sessionStorage.setItem(CLE, 'fermee')
    } catch {
      /* stockage indisponible : la bulle pourra revenir, sans plus */
    }
  }
  if (dejaVue()) return

  const enLigne = () => bouton.matches('.online, .bot')
  let bulle: HTMLElement | null = null

  const retirer = () => {
    memoriser()
    bouton.classList.remove('appel')
    if (!bulle) return
    const b = bulle
    bulle = null
    // Fermée au clavier, la bulle emporterait le focus : il revient au rond
    if (b.contains(document.activeElement)) bouton.focus()
    b.classList.add('sortie')
    b.addEventListener('animationend', () => b.remove(), { once: true })
    // Mouvement réduit (aucune animation) : retrait direct
    setTimeout(() => b.remove(), 400)
  }

  const montrer = () => {
    if (bulle || dejaVue() || bloc.classList.contains('open')) return
    bulle = document.createElement('div')
    bulle.className = 'invitation-clavardage'
    bulle.lang = 'fr-CA'
    bulle.setAttribute('role', 'status')
    const texte = document.createElement('p')
    texte.className = 'invitation-texte'
    const fermer = document.createElement('button')
    fermer.type = 'button'
    fermer.className = 'invitation-fermer'
    fermer.setAttribute('aria-label', 'Fermer l’invitation au clavardage')
    fermer.addEventListener('click', retirer)
    bulle.append(texte, fermer)
    bloc.append(bulle)
    // Texte ajouté une image plus tard : une région role=status annonce un
    // changement de son contenu, pas son arrivée déjà remplie
    requestAnimationFrame(() => (texte.textContent = reglages.texteInvitation))
    bouton.classList.add('appel')
  }

  new MutationObserver(() => {
    if (bloc.classList.contains('open')) retirer()
  }).observe(bloc, { attributes: true, attributeFilter: ['class'] })

  setTimeout(() => {
    if (enLigne()) return montrer()
    // Hors ligne au moment voulu : la bulle attend que le service ouvre
    const attente = new MutationObserver(() => {
      if (enLigne()) {
        attente.disconnect()
        montrer()
      }
    })
    attente.observe(bouton, { attributes: true, attributeFilter: ['class'] })
  }, delai)
}
