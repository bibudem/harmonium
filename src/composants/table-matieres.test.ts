import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rendreTableMatieres } from '../../astro/table-matieres.ts'
import { rendre } from '../../site/gabarit.mjs'

const titres = [
  { depth: 2, slug: 'emprunter', text: 'Emprunter' },
  { depth: 3, slug: 'duree', text: 'Durée du prêt' },
  { depth: 2, slug: 'retourner', text: 'Retourner' },
]

test('table des matières : seuil de sections, sous-titres et noms échappés', () => {
  assert.equal(rendreTableMatieres({ titres: titres.slice(0, 2), niveauMax: 3 }), '')
  assert.equal(rendreTableMatieres({ titres, minimum: 3 }), '')
  assert.ok(!rendreTableMatieres({ titres }).includes('href="#duree"'))
  const html = rendreTableMatieres({ titres: [...titres, { depth: 3, slug: 'duree', text: 'Doublon' }], niveauMax: 3, nom: '<Lire & choisir>' })
  assert.equal((html.match(/href="#duree"/g) ?? []).length, 2, 'un seul lien par variante')
  assert.ok(!html.includes('Doublon'))
  assert.ok(html.includes('&lt;Lire &amp; choisir&gt;'))
  assert.ok(!html.includes('<Lire'))
})

test('documentation : même composant, après l’introduction, avec les titres lisibles', () => {
  const html = rendre({ chemin: 'composants/bouton.html', contenu: '<h1>Bouton</h1><p class="chapeau">Introduction.</p><h2 id="pret">Prêt &amp; retour</h2><p>Texte.</p><h2 id="aide">Aide</h2>' }, { rechargement: false, dist: 'dist/' })
  const composant = rendreTableMatieres({ titres: [{ depth: 2, slug: 'pret', text: 'Prêt & retour' }, { depth: 2, slug: 'aide', text: 'Aide' }], id: 'table-matieres-doc', classe: 'table-matieres-doc' })
  assert.ok(html.includes(composant), 'le gabarit utilise le rendu commun')
  assert.ok(html.indexOf('Introduction.') < html.indexOf('id="table-matieres-doc"'))
  assert.ok(html.indexOf('id="table-matieres-doc"') < html.indexOf('<h2 id="pret">'))
  assert.ok(html.includes('bib-table-matieres.min.js'))
  assert.ok(!html.includes('class="sommaire"'))
  assert.ok(!html.includes('Prêt &amp;amp; retour'))
})
