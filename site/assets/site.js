// Mini-site : menu (filtre, repli sur téléphone), boutons « Copier » et aperçus.
// Le suivi de lecture appartient au composant TableMatieres.

// ---- Menu replié sur téléphone, ouvert sur grand écran ----
const navMobile = document.querySelector('.nav-mobile')
const petit = matchMedia('(max-width: 56rem)')
const ajuster = () => navMobile && (navMobile.open = !petit.matches)
ajuster()
petit.addEventListener('change', ajuster)

// ---- Filtre des pages ----
const filtre = document.getElementById('filtre-nav')
const etatFiltre = document.querySelector('.filtre-etat')
const sansAccents = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
filtre?.addEventListener('input', () => {
  const q = sansAccents(filtre.value.trim())
  let visibles = 0
  for (const a of document.querySelectorAll('.nav-liste a')) {
    const li = a.parentElement
    const groupe = a.closest('.nav-groupe, .nav-section')
    const ok = !q || sansAccents(a.textContent).includes(q) || (groupe && sansAccents(groupe.querySelector('summary, .nav-section-titre')?.textContent ?? '').includes(q))
    li.hidden = !ok
    if (ok) visibles++
  }
  for (const g of document.querySelectorAll('.nav-groupe')) {
    const aucun = ![...g.querySelectorAll('li')].some((li) => !li.hidden)
    g.hidden = aucun
    if (q && !aucun) g.querySelector('details').open = true
  }
  for (const s of document.querySelectorAll('.nav-section')) s.hidden = ![...s.querySelectorAll(':scope > ul > li')].some((li) => !li.hidden)
  if (etatFiltre) etatFiltre.textContent = q ? `${visibles} page${visibles > 1 ? 's' : ''}` : ''
})

// ---- Code défilant : atteignable au clavier seulement lorsque nécessaire ----
const codeDefilant = new ResizeObserver((entrees) => {
  for (const { target: pre } of entrees) {
    if (pre.scrollWidth > pre.clientWidth + 1) {
      pre.tabIndex = 0
      pre.setAttribute('role', 'group')
      pre.setAttribute('aria-label', 'Extrait de code défilant')
    } else {
      pre.removeAttribute('tabindex')
      pre.removeAttribute('role')
      pre.removeAttribute('aria-label')
    }
  }
})

// ---- Boutons « Copier » ----
for (const pre of document.querySelectorAll('main pre')) {
  const bloc = document.createElement('div')
  bloc.className = 'bloc'
  pre.replaceWith(bloc)
  const bouton = document.createElement('button')
  bouton.type = 'button'
  bouton.className = 'bib-bouton bib-bouton--petit bib-bouton--contour-blanc copier'
  bouton.textContent = 'Copier'
  const etat = document.createElement('span')
  etat.className = 'bib-masque'
  etat.setAttribute('role', 'status')
  bouton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent.trim())
      bouton.textContent = 'Copié'
      etat.textContent = 'Code copié'
    } catch {
      bouton.textContent = 'Échec'
      etat.textContent = 'Copie impossible : sélectionner le code à la main'
    }
    setTimeout(() => {
      bouton.textContent = 'Copier'
      etat.textContent = ''
    }, 1500)
  })
  bloc.append(pre, bouton, etat)
  codeDefilant.observe(pre)
}

// ---- Aperçus de mouvement (Fondations › Mouvement) ----
for (const bouton of document.querySelectorAll('[data-animer]')) {
  bouton.addEventListener('click', () => {
    const piste = bouton.nextElementSibling
    piste.style.setProperty('--d', bouton.style.getPropertyValue('--d'))
    piste.style.setProperty('--c', bouton.style.getPropertyValue('--c'))
    piste.classList.toggle('anime')
  })
}

// ---- Aperçus à la largeur d'un écran (.apercu-ecran[data-largeur] ou [data-largeurs]) ----
// Le contenu est mis en page à la largeur voulue (1200 px pour un écran de bureau), puis
// réduit pour tenir dans la colonne ; la hauteur du cadre suit (menu ouvert, etc.). Avec
// data-largeurs="1200 375", des boutons permettent de passer d'une largeur à l'autre.
const nomLargeur = (l) => (l >= 1000 ? 'Bureau' : l <= 480 ? 'Téléphone' : 'Tablette')
for (const cadre of document.querySelectorAll('.apercu-ecran[data-largeur], .apercu-ecran[data-largeurs]')) {
  const largeurs = (cadre.dataset.largeurs ?? cadre.dataset.largeur).split(/\s+/).map(Number)
  let largeur = largeurs[0]
  const interieur = document.createElement('div')
  interieur.className = 'apercu-ecran-interieur'
  interieur.append(...cadre.childNodes)
  const echelle = document.createElement('span')
  echelle.className = 'apercu-ecran-echelle'
  echelle.setAttribute('aria-hidden', 'true')
  cadre.append(interieur, echelle)
  const ajuster = () => {
    interieur.style.width = `${largeur}px`
    const facteur = Math.min(1, cadre.clientWidth / largeur)
    interieur.style.transform = facteur < 1 ? `scale(${facteur})` : ''
    cadre.style.height = `${Math.ceil(interieur.offsetHeight * facteur)}px`
    echelle.textContent = facteur < 1 ? `${largeur} px · ${Math.round(facteur * 100)} %` : `${largeur} px`
  }
  if (largeurs.length > 1) {
    const choix = document.createElement('div')
    choix.className = 'apercu-ecran-choix'
    choix.setAttribute('role', 'group')
    choix.setAttribute('aria-label', 'Largeur de l’aperçu')
    for (const l of largeurs) {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = `${nomLargeur(l)} · ${l} px`
      b.setAttribute('aria-pressed', String(l === largeur))
      b.addEventListener('click', () => {
        largeur = l
        for (const x of choix.children) x.setAttribute('aria-pressed', String(x === b))
        ajuster()
      })
      choix.append(b)
    }
    cadre.before(choix)
  }
  new ResizeObserver(ajuster).observe(cadre)
  new ResizeObserver(ajuster).observe(interieur)
  ajuster()
}

// ---- Aperçus « Bureau / Téléphone » (chaque .demo-cadre > .contenu) ----
// Le téléphone est un vrai cadre de 390 px (iframe de la même page, ?apercu=N) : les
// requêtes @media des composants y voient la largeur d'un téléphone, et leurs scripts y
// tournent. Dans ce cadre, la page ne garde que l'exemple N. Le choix vaut pour tous les
// aperçus de la page et est retenu d'une page à l'autre.
const CLE_APERCU = 'harmonium-apercu'
const contenus = [...document.querySelectorAll('.demo-cadre > .contenu')]
const numeroApercu = new URLSearchParams(location.search).get('apercu')
if (numeroApercu !== null) {
  const contenu = contenus[Number(numeroApercu)]
  const cadre = document.createElement('div')
  cadre.className = `${contenu?.parentElement.className ?? ''} apercu-seul`
  if (contenu) cadre.append(contenu)
  document.body.replaceChildren(cadre)
  document.documentElement.classList.add('apercu-pret')
} else {
  let mode = 'bureau'
  try { mode = localStorage.getItem(CLE_APERCU) ?? 'bureau' } catch {}
  const groupes = []
  const appliquer = (m) => {
    mode = m
    try { localStorage.setItem(CLE_APERCU, m) } catch {}
    for (const g of groupes) g(m)
  }
  contenus.forEach((contenu, i) => {
    if (contenu.querySelector('.apercu-ecran')) return
    const demo = contenu.parentElement
    const choix = document.createElement('div')
    choix.className = 'apercu-choix'
    choix.setAttribute('role', 'group')
    choix.setAttribute('aria-label', 'Largeur de l’aperçu')
    const largeurBureau = Number(contenu.dataset.largeurBureau) || 0
    const boutons = [['bureau', largeurBureau ? `Bureau · ${largeurBureau} px` : 'Bureau'], ['telephone', 'Téléphone · 390 px']].map(([m, texte]) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = texte
      b.addEventListener('click', () => appliquer(m))
      choix.append(b)
      return [m, b]
    })
    const etiquette = demo.querySelector(':scope > .etiquette')
    if (etiquette) {
      const entete = document.createElement('div')
      entete.className = 'apercu-entete'
      etiquette.before(entete)
      entete.append(etiquette, choix)
    } else demo.prepend(choix)
    let bureau = null
    if (largeurBureau) {
      const ouvrir = document.createElement('a')
      ouvrir.href = `${location.pathname}?apercu=${i}`
      ouvrir.target = '_blank'
      ouvrir.rel = 'noopener'
      ouvrir.className = 'apercu-taille-reelle'
      ouvrir.textContent = 'Ouvrir à taille réelle ↗'
      ouvrir.setAttribute('aria-label', 'Ouvrir l’aperçu à taille réelle dans un nouvel onglet')
      choix.append(ouvrir)
    }
    let telephone = null
    groupes.push((m) => {
      for (const [x, b] of boutons) b.setAttribute('aria-pressed', String(x === m))
      if (m === 'telephone' && !telephone) {
        telephone = document.createElement('div')
        telephone.className = 'apercu-telephone'
        const iframe = document.createElement('iframe')
        iframe.title = `Aperçu sur téléphone : ${etiquette?.textContent.trim() ?? 'exemple'}`
        iframe.loading = 'lazy'
        iframe.src = `${location.pathname}?apercu=${i}`
        iframe.addEventListener('load', () => {
          const doc = iframe.contentDocument
          if (!doc) return
          const seul = doc.querySelector(".apercu-seul") ?? doc.body
          const ajuster = () => (iframe.style.height = `${Math.max(120, Math.ceil(seul.getBoundingClientRect().height))}px`)
          new ResizeObserver(ajuster).observe(seul)
          ajuster()
        })
        telephone.append(iframe)
        contenu.after(telephone)
      }
      if (m === 'bureau' && largeurBureau && !bureau) {
        bureau = document.createElement('div')
        bureau.className = 'apercu-bureau'
        const cadre = bureau
        const iframe = document.createElement('iframe')
        iframe.title = `Aperçu sur bureau à ${largeurBureau} px : ${etiquette?.textContent.trim() ?? 'exemple'}`
        iframe.style.width = `${largeurBureau}px`
        iframe.src = `${location.pathname}?apercu=${i}`
        iframe.addEventListener('load', () => {
          const doc = iframe.contentDocument
          if (!doc) return
          const seul = doc.querySelector('.apercu-seul') ?? doc.body
          const ajuster = () => {
            const hauteur = Math.max(120, Math.ceil(seul.getBoundingClientRect().height))
            const facteur = Math.min(1, cadre.clientWidth / largeurBureau)
            iframe.style.height = `${hauteur}px`
            iframe.style.transform = `scale(${facteur})`
            cadre.style.height = `${Math.ceil(hauteur * facteur)}px`
          }
          new ResizeObserver(ajuster).observe(seul)
          new ResizeObserver(ajuster).observe(cadre)
          ajuster()
        })
        cadre.append(iframe)
        contenu.after(cadre)
      }
      contenu.hidden = m === 'telephone' || !!largeurBureau
      if (bureau) bureau.hidden = m !== 'bureau' 
      if (telephone) telephone.hidden = m !== 'telephone'
    })
  })
  appliquer(mode)
}
