window.addEventListener('bib:consentement', (e) => {
        const choix = document.getElementById('choix')
        if (choix) choix.textContent = e.detail.statistiques ? 'statistiques acceptées' : 'statistiques refusées'
      })
      document.getElementById('effacer')?.addEventListener('click', () => {
        document.cookie = 'bib-consentement=; max-age=0; path=/'
        location.reload()
      })
