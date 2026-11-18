/* Valeurs et visualisations des fondations, calculées depuis les jetons.
 * Les textes éditoriaux sont dans site/pages/fondations/*.md.
 */
import { lireJetons, resoudre, contraste, estHex } from '../jetons.mjs'
import { c, tableau } from '../outils.mjs'
import { FAMILLES, OFFICIELLES, REGLES, SOURCE, STATUTS } from '../couleurs-udem.mjs'

const BLANC = '#ffffff'
const TEXTE = '#0b113a'

const ratio = (r) => (r === null ? '—' : `${r.toFixed(2).replace('.', ',')}:1`)
const verdict = (r) => (r === null ? '' : r >= 4.5 ? '<span class="eval eval-ok">texte</span>' : r >= 3 ? '<span class="eval eval-moyen">graphique, grand texte</span>' : '<span class="eval eval-non">décor seulement</span>')
const pastille = (couleur) => `<span class="pastille-couleur" style="background:${couleur}" aria-hidden="true"></span>`

/** #fff → #ffffff : compare les valeurs, pas leur écriture */
const hexLong = (v) => v.toLowerCase().replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, '#$1$1$2$2$3$3')
const etiquetteStatut = (statut) => `<span class="statut statut-${statut}">${STATUTS[statut][0]}</span>`

function carteCouleur(j, jetons, statut, note) {
  const v = resoudre(jetons, j.valeur)
  const surBlanc = contraste(v, BLANC)
  const surTexte = contraste(v, TEXTE)
  return `<li class="nuance">
    <div class="nuance-echantillon" style="background:${v}" aria-hidden="true"></div>
    <div class="nuance-info">
      <p class="nuance-nom">${c(j.nom)}${statut ? ` ${etiquetteStatut(statut)}` : ''}</p>
      <p class="nuance-valeur">${c(v)}${j.valeur !== v ? ` <span class="alias">= ${c(j.valeur)}</span>` : ''}</p>
      ${estHex(v) ? `<p class="nuance-contraste">Sur blanc : ${ratio(surBlanc)} ${verdict(surBlanc)}<br />Sur bleu foncé : ${ratio(surTexte)} ${verdict(surTexte)}</p>` : ''}
      ${note ? `<p class="nuance-note">${note}</p>` : j.commentaire ? `<p class="nuance-note">${j.commentaire}</p>` : ''}
    </div>
  </li>`
}

export async function donneesFondations() {
  const J = await lireJetons()
  const groupe = (g) => J.base.filter((j) => j.groupe.startsWith(g))
  const base900 = (nom) => J.base900.find((j) => j.nom === nom)?.valeur
  const base1200 = (nom) => J.base1200.find((j) => j.nom === nom)?.valeur

  // ------------------------------------------------------------------ Couleurs
  const marque = groupe('Couleurs de marque')
  const ETAT = /^--couleur-(succes|info|avertissement|erreur)/
  const roles = J.clair.filter((j) => j.nom.startsWith('--couleur-') && !ETAT.test(j.nom))
  const etats = J.clair.filter((j) => ETAT.test(j.nom))
  const ligneRole = (j) => {
    const clair = resoudre(J, j.valeur)
    return [`${c(j.nom)}`, `${pastille(clair)} ${c(clair)}${j.valeur !== clair ? `<br /><span class="alias">${c(j.valeur)}</span>` : ''}`, j.commentaire]
  }
  const couleurs = {
    "source-marque": SOURCE.url,
    "date-guide-marque": SOURCE.consulte,
    "regles-marque": `<ul>${REGLES.map((r) => `<li>${r}</li>`).join('')}</ul>`,
    "statuts-couleurs": tableau(['Étiquette', 'Sens'], Object.keys(STATUTS).filter((k) => FAMILLES.some((f) => f.couleurs.some(([, st]) => st === k))).map((k) => [etiquetteStatut(k), STATUTS[k][1]])),
    "nuances-couleurs": FAMILLES.map((f) => `<h3>${f.titre}</h3><ul class="nuancier">${f.couleurs
    .map(([nom, statut, note]) => {
      const j = J.base.find((x) => x.nom === nom)
      if (!j) return ''
      const off = OFFICIELLES.find((o) => o.jeton === nom)
      const texte = statut === 'officielle' || statut === 'ecart' ? `Nom officiel : <strong>${off?.nom ?? note}</strong>${statut === 'ecart' ? ` (${c(off.hex)} dans le nuancier)` : ''}` : note
      return carteCouleur(j, J, statut, texte)
    })
    .join('')}</ul>`).join('\n'),
    "roles-couleurs": tableau(['Rôle', 'Valeur', 'Usage'], roles.map(ligneRole), 'tableau-couleurs'),
    "roles-etats": tableau(['Rôle', 'Valeur', 'Usage'], etats.map(ligneRole), 'tableau-couleurs')
  }

  // ------------------------------------------------------------------ Typographie
  const graisses = groupe('Typographie').filter((j) => j.nom.startsWith('--graisse'))
  const echelle = groupe('Typographie').filter((j) => j.nom.startsWith('--texte'))
  const px = (rem, racine) => `${Math.round(parseFloat(rem) * racine * 10) / 10} px`
  // Niveau, police, jeton, graisse, interligne : tailles lues dans les jetons (mobile, puis dès 900 px)
  const TITRES = [
    ['h1', 'Figtree', '--titre-1', 'forte (600)', '1.1'],
    ['h2', 'Figtree', '--titre-2', 'forte (600)', '1.1'],
    ['h3', 'Figtree', '--titre-3', 'grasse (700), forte (600) dès 900 px', '1.2'],
    ['h4', 'Figtree', '--titre-4', 'moyenne (500)', '1.2'],
    ['titre éditorial', 'Lora', '--titre-4', 'normale (400)', '1.2'],
    ['h5', 'Figtree', '--titre-5', 'grasse (700)', '1.1'],
    ['h6', 'Figtree', '--titre-6', 'normale (400)', '1.2'],
    ['affiche', 'Figtree', '--affiche-2', 'forte (600)', '1.1'],
    ['grande affiche', 'Figtree', '--affiche-1', 'forte (600)', '1.1'],
  ].map(([n, p, jeton, g, l]) => {
    const t = J.base.find((j) => j.nom === jeton).valeur
    return [n, p, jeton, t, base900(jeton) ?? t, g, l]
  })
  const typographie = {
    "jeton-sans": c('--police-sans'),
    "specimen-graisses-sans": [400, 500, 600, 700].map((g) => `<span style="font-weight:${g}">${g} Bibliothèques</span>`).join(''),
    "jeton-serif": c('--police-serif'),
    "specimen-graisses-serif": [400, 500, 600, 700].map((g) => `<span style="font-weight:${g}">${g} Bibliothèques</span>`).join(''),
    "echelle-texte": tableau(['Jeton', 'Valeur', 'À 17 px', 'À 18 px', 'Aperçu'], echelle.map((j) => [c(j.nom), c(j.valeur), px(j.valeur, 17), px(j.valeur, 18), `<span style="font-size:${j.valeur}">Les bibliothèques</span>`])),
    "tableau-titres": tableau(['Niveau', 'Jeton', 'Police', 'Taille', 'Dès 900 px', 'Graisse', 'Interligne'], TITRES.map(([n, p, jeton, t, t9, g, l]) => [`<strong>${n}</strong>`, c(jeton), p, c(t), c(t9), g, c(l)])),
    "specimen-titres": TITRES.filter(([n]) => n.startsWith('h')).map(([n, p, , t, t9, g, l]) => `  <p class="specimen-titre" style="font-family:${p === 'Lora' ? 'var(--police-serif)' : 'var(--police-sans)'};font-size:${t9};font-weight:${n === 'h3' ? 600 : g.match(/\((\d+)\)/)[1]};line-height:${l}"><span class="specimen-niveau">${n}</span>Les bibliothèques</p>`).join('\n'),
    "tableau-graisses": tableau(['Jeton', 'Valeur', 'Aperçu'], graisses.map((j) => [c(j.nom), c(j.valeur), `<span style="font-weight:${j.valeur}">Les bibliothèques de l’UdeM</span>`]))
  }

  // ------------------------------------------------------------------ Espacements
  const espaces = J.base.filter((j) => j.groupe === 'Espacement')
  const rolesEspace = groupe('Espacement par rôle').filter((j) => j.nom !== '--gouttiere')
  const gouttiere = J.base.filter((j) => j.nom === '--gouttiere')
  const dims = groupe('Dimensions')
  const barre = (v) => `<span class="barre-espace" style="width:${v}" aria-hidden="true"></span>`
  const evolue = (nom, v) => [v, base900(nom) && `dès 900 px : ${c(base900(nom))}`, base1200(nom) && `dès 1200 px : ${c(base1200(nom))}`].filter(Boolean).join('<br />')
  const espacements = {
    "echelle-espacements": tableau(['Jeton', 'Valeur', ''], espaces.map((j) => [c(j.nom), c(j.valeur), barre(j.valeur)])),
    "roles-espacements": tableau(['Rôle', 'Valeur', 'Usage', ''], rolesEspace.map((j) => [c(j.nom), evolue(j.nom, c(j.valeur)), j.commentaire, barre(resoudre(J, j.valeur))])),
    "largeurs-contenu": tableau(['Jeton', 'Valeur', 'Usage'], [...gouttiere, ...dims].filter((j) => ['--gouttiere', '--largeur-max', '--mesure-texte'].includes(j.nom)).map((j) => [c(j.nom), evolue(j.nom, c(j.valeur)), j.commentaire])),
    "dimensions-composants": tableau(['Jeton', 'Valeur', 'Usage'], dims.filter((j) => !['--gouttiere', '--largeur-max', '--mesure-texte'].includes(j.nom)).map((j) => [c(j.nom), evolue(j.nom, c(j.valeur)), j.commentaire]))
  }

  // ------------------------------------------------------------------ Formes
  const rayons = groupe('Formes')
  const ombres = J.clair.filter((j) => j.nom.startsWith('--ombre'))
  const z = groupe('Empilement')
  const formes = {
    "specimen-rayons": rayons.map((j) => `<li><span class="forme" style="border-radius:${j.valeur}" aria-hidden="true"></span>${c(j.nom)}<br />${c(j.valeur)}</li>`).join(''),
    "specimen-ombres": ombres.map((j) => `<li><span class="forme forme-ombre" style="box-shadow:${j.valeur}" aria-hidden="true"></span>${c(j.nom)}</li>`).join(''),
    "tableau-ombres": tableau(['Jeton', 'Valeur'], ombres.map((j) => [c(j.nom), c(j.valeur)])),
    "empilement": tableau(['Jeton', 'Valeur', 'Usage'], z.map((j) => [c(j.nom), c(j.valeur), j.commentaire]))
  }

  // ------------------------------------------------------------------ Mouvement
  const mvt = groupe('Mouvement')
  const durees = mvt.filter((j) => j.nom.startsWith('--duree'))
  const courbes = mvt.filter((j) => j.nom.startsWith('--courbe'))
  const trace = (v) => {
    const m = resoudre(J, v).match(/cubic-bezier\(([^)]+)\)/)
    if (!m) return ''
    const [x1, y1, x2, y2] = m[1].split(',').map(Number)
    const P = (x, y) => `${(x * 100).toFixed(1)},${(100 - y * 100).toFixed(1)}`
    return `<svg class="courbe" viewBox="-5 -5 110 110" aria-hidden="true"><path class="courbe-axes" d="M0,100 H100 M0,100 V0" /><path class="courbe-trace" d="M0,100 C${P(x1, y1)} ${P(x2, y2)} 100,0" /></svg>`
  }
  const demo = (duree, courbe) => `<button type="button" class="bib-bouton bib-bouton--contour bib-bouton--petit" data-animer style="--d:${duree};--c:${courbe}">Voir</button><span class="piste" aria-hidden="true"><span class="point"></span></span>`
  const mouvement = {
    "durees": tableau(['Jeton', 'Valeur', 'Usage courant', 'Aperçu'], durees.map((j) => [c(j.nom), c(j.valeur), j.commentaire || '', demo(j.valeur, 'var(--courbe-standard)')]), 'tableau-mouvement'),
    "courbes": tableau(['Jeton', 'Valeur', 'Tracé', 'Aperçu'], courbes.map((j) => [c(j.nom) + (j.commentaire ? `<br /><span class="note">${j.commentaire}</span>` : ''), c(j.valeur), trace(j.valeur), demo('var(--duree-longue)', j.valeur)]), 'tableau-mouvement')
  }

  // ------------------------------------------------------------------ Liste complète
  const CONTEXTE = { base: 'Base', base900: 'Dès 900 px', base1200: 'Dès 1200 px', clair: 'Thème clair' }
  const lignes = Object.entries(J).flatMap(([k, liste]) => liste.map((j) => [c(j.nom), c(j.valeur), CONTEXTE[k]]))
  const jetons = {
    
    
    
    "nombre-jetons": lignes.length,
    "liste-jetons": tableau(['Jeton', 'Valeur', 'Contexte'], lignes, 'tableau-compact')
  }

  return { ...couleurs, ...typographie, ...espacements, ...formes, ...mouvement, ...jetons }
}
