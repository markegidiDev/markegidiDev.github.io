// Script di diagnostica per problemi di rendering

console.log("Console script caricato");

// Monitoraggio variabili CSS
function monitorCSSVariables() {
  const styles = getComputedStyle(document.documentElement);
  const cssVars = {
    "--background": styles.getPropertyValue("--background"),
    "--foreground": styles.getPropertyValue("--foreground"),
    "--primary": styles.getPropertyValue("--primary"),
    "--card": styles.getPropertyValue("--card"),
    "--border": styles.getPropertyValue("--border"),
    "--secondary": styles.getPropertyValue("--secondary"),
    
    // Controlla anche le versioni hex
    "--background-hex": styles.getPropertyValue("--background-hex"),
    "--foreground-hex": styles.getPropertyValue("--foreground-hex"),
    "--primary-hex": styles.getPropertyValue("--primary-hex"),
  };
  
  console.log("Current CSS Variables:", cssVars);
}

// Controlla i colori dei principali elementi
function checkElementColors() {
  console.log("Element colors:");
  console.log("Body bg:", getComputedStyle(document.body).backgroundColor);
  
  const root = document.getElementById('root');
  if (root) {
    console.log("Root bg:", getComputedStyle(root).backgroundColor);
    console.log("Root style.display:", getComputedStyle(root).display);
    console.log("Root style.visibility:", getComputedStyle(root).visibility);
    console.log("Root style.opacity:", getComputedStyle(root).opacity);
    console.log("Root children count:", root.childElementCount);
  } else {
    console.error("Root element not found");
  }
  
  const navbar = document.querySelector('nav');
  if (navbar) {
    console.log("Navbar bg:", getComputedStyle(navbar).backgroundColor);
    console.log("Navbar visibility:", getComputedStyle(navbar).visibility);
  } else {
    console.error("Navbar not found");
  }
}

// Check loaded state
function checkLoadedState() {
  console.log("Body has 'loaded' class:", document.body.classList.contains('loaded'));
  
  const loader = document.querySelector('.loading-container');
  if (loader) {
    console.log("Loader display:", getComputedStyle(loader).display);
    console.log("Loader visibility:", getComputedStyle(loader).visibility);
  } else {
    console.log("Loader not found (might be already removed)");
  }
}

// Esegue una diagnostica approfondita e invia a console
function runFullDiagnostics() {
  console.log("----------- DIAGNOSTICA COMPLETA -----------");
  monitorCSSVariables();
  checkElementColors();
  checkLoadedState();
  console.log("-------------------------------------------");
}

// Esegui subito
setTimeout(runFullDiagnostics, 1000);

// Esegui nuovamente dopo il caricamento completo
window.addEventListener('load', function() {
  console.log("Window load event fired");
  setTimeout(runFullDiagnostics, 100);
});

// Attacha al window per poter essere richiamato manualmente
window.runDiagnostics = runFullDiagnostics;
