// Rechargement automatique pendant `npm start` : la page se recharge quand dist/ est
// reconstruit (événement d'esbuild) ou quand le mini-site est régénéré (version.txt).
// Retiré du site publié.
const source = new EventSource('/esbuild')
source.addEventListener('change', () => location.reload())
source.onerror = () => source.close()

const adresseVersion = new URL('version.txt', new URL('.', document.querySelector('script[src$="rechargement.js"]').src))
let version = null
setInterval(async () => {
  try {
    const v = await (await fetch(adresseVersion, { cache: 'no-store' })).text()
    if (version !== null && v !== version) location.reload()
    version = v
  } catch {
    /* serveur arrêté */
  }
}, 1000)
