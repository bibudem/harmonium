const message = (bannerType) => 'data:application/json,' + encodeURIComponent(JSON.stringify({
        title: 'EXERCICE – Message d’urgence fictif : test d’affichage. Aucune action requise. Un texte assez long pour passer sur plusieurs lignes sur un téléphone.',
        hour: '10 h 15', fullDay: '15 novembre 2026', date: '2026-11-15T10:15:00-05:00', url: 'https://urgence.umontreal.ca/', bannerType,
      }))
      document.getElementById('petit').setAttribute('service', message('small'))
      document.getElementById('grand').setAttribute('service', message('large'))
