const simule = document.getElementById('simule')
      const servir = () => {
        const reponse = { success: true, data: { id: 'demo-' + Date.now(), message: '<strong>Fermeture</strong> – Les bibliothèques seront fermées du 24 décembre au 2 janvier. <a href="#apercu">Consulter les horaires des Fêtes</a>.' } }
        simule.setAttribute('service', 'data:application/json,' + encodeURIComponent(JSON.stringify(reponse)))
      }
      servir()
      document.getElementById('nouveau')?.addEventListener('click', servir)
