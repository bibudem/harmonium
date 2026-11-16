// Démo de la rétroaction : hors de cette machine (site publié sur GitHub Pages), LibWizard est
// simulé. Aucune réponse n'est enregistrée ; le composant se comporte comme avec le vrai
// service (délai, remerciement). En local (npm start), les réponses sont réelles.
//
// L'attribut data-libwizard (« simule » ou « reel ») sur <html> choisit l'avertissement affiché.
const LOCAL = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
const SERVICE = 'https://umontreal.libwizard.com/'

document.documentElement.dataset.libwizard = LOCAL ? 'reel' : 'simule'

if (!LOCAL) {
  const fetchReel = window.fetch.bind(window)
  window.fetch = async (ressource, options) => {
    const adresse = typeof ressource === 'string' ? ressource : ressource.url
    if (!adresse.startsWith(SERVICE)) return fetchReel(ressource, options)
    await new Promise((ok) => setTimeout(ok, 600))
    const corps = adresse.endsWith('/getguid') ? '"demo-simulee"' : '{}'
    if (options?.body) console.info('[démo] Réponse simulée, non envoyée à LibWizard :', JSON.parse(options.body))
    return new Response(corps, { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
}
