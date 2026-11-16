/*
 * Mémoire des avis vus et fermés, dans IndexedDB (sans la bibliothèque idb).
 * Clés hors ligne : l'identifiant de l'avis.
 */
export const NOM_BASE = 'bib-avis'
const VERSION_BASE = 1
const MAGASIN = 'avis'

export interface Avis {
  message: string
  id?: string
  isLocal?: boolean
  hidden?: boolean
}

export interface Base {
  lire(id: string): Promise<Avis | undefined>
  ecrire(avis: Avis & { id: string }): Promise<void>
}

const enPromesse = <T>(requete: IDBRequest<T>) =>
  new Promise<T>((resoudre, rejeter) => {
    requete.onsuccess = () => resoudre(requete.result)
    requete.onerror = () => rejeter(requete.error)
  })

export async function ouvrirBase(): Promise<Base> {
  const ouverture = indexedDB.open(NOM_BASE, VERSION_BASE)
  ouverture.onupgradeneeded = () => {
    if (!ouverture.result.objectStoreNames.contains(MAGASIN)) ouverture.result.createObjectStore(MAGASIN)
  }
  const db = await enPromesse(ouverture)
  const magasin = (mode: IDBTransactionMode) => db.transaction(MAGASIN, mode).objectStore(MAGASIN)
  return {
    lire: (id) => enPromesse(magasin('readonly').get(id)),
    ecrire: async (avis) => {
      await enPromesse(magasin('readwrite').put(avis, avis.id))
    },
  }
}
