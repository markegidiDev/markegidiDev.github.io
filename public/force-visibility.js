// Script per forzare la visibilità dell'applicazione
(function() {
  // Controlla se l'app è caricata ogni 200ms
  function checkAppLoaded() {
    var rootElement = document.getElementById('root');
    
    if (rootElement && rootElement.childElementCount > 0) {
      console.log("App caricata, applicando stili di emergenza...");
      
      // Applica stili di visibilità al root
      rootElement.style.visibility = 'visible';
      rootElement.style.opacity = '1';
      rootElement.style.display = 'flex';
      rootElement.style.flexDirection = 'column';
      rootElement.style.minHeight = '100vh';
      
      // Rimuovi l'animazione di caricamento
      var loader = document.querySelector('.loading-container');
      if (loader) {
        loader.style.display = 'none';
      }
      
      document.body.classList.add('loaded');
      
      // Applica stili diretti a componenti principali
      var navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.visibility = 'visible';
        navbar.style.display = 'block';
        navbar.style.backgroundColor = '#FFFFFF';
      }
      
      var main = document.querySelector('main');
      if (main) {
        main.style.visibility = 'visible';
        main.style.display = 'block';
        main.style.flexGrow = '1';
      }
      
      var footer = document.querySelector('footer');
      if (footer) {
        footer.style.visibility = 'visible';
        footer.style.display = 'block';
        footer.style.backgroundColor = '#FFFFFF';
      }
      
      // Assicura che tutti gli elementi siano visibili
      var allElements = document.querySelectorAll('div, h1, h2, h3, p, a, span');
      for (var i = 0; i < allElements.length; i++) {
        allElements[i].style.visibility = 'visible';
        allElements[i].style.opacity = '1';
      }
      
      console.log("Stili di emergenza applicati");
      return true;
    }
    
    return false;
  }
  
  // Esegui immediatamente e poi ogni 200ms
  if (!checkAppLoaded()) {
    var interval = setInterval(function() {
      if (checkAppLoaded()) {
        clearInterval(interval);
      }
    }, 200);
    
    // Failsafe dopo 5 secondi
    setTimeout(function() {
      document.body.classList.add('loaded');
      var loader = document.querySelector('.loading-container');
      if (loader) {
        loader.style.display = 'none';
      }
      clearInterval(interval);
    }, 5000);
  }
})();
