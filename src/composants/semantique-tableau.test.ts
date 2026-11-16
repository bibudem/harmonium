import { test } from 'node:test'
import assert from 'node:assert/strict'
import { semantiqueTableau, entetesDeColonne } from '../../astro/semantique-tableau.ts'

test('les cellules HTML natives et les cellules de composant deviennent des en-têtes dans thead', () => {
  const html = entetesDeColonne('<tr><td>Document</td><td class="tarif" data-cellule>Tarif</td></tr>')
  assert.equal(html, '<tr><th scope="col">Document</th><th scope="col" class="tarif" data-cellule>Tarif</th></tr>')
})

test('la sémantique du tableau préserve les portées explicites et distingue lignes et colonnes', () => {
  const html = semantiqueTableau('<thead><tr><td>Document</td></tr></thead><tbody><tr><th>Livre</th><td>5 $</td><th scope="rowgroup">Groupe</th></tr></tbody>')
  assert.match(html, /<th scope="col">Document<\/th>/)
  assert.match(html, /<th scope="row">Livre<\/th>/)
  assert.match(html, /<td>5 \$<\/td>/)
  assert.match(html, /scope="rowgroup"/)
})
