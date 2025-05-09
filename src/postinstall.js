/**
 * Script per installare e configurare correttamente MagicUI con il progetto
 * Da eseguire dopo l'installazione delle dipendenze con npm
 */

const fs = require('fs');
const path = require('path');

// Funzione per verificare se una directory esiste, altrimenti la crea
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory creata: ${directory}`);
  }
}

// Funzione per creare un file CSS con i componenti necessari di MagicUI
function createMagicUIStyling() {
  const magicUIContent = `
/* MagicUI Custom Components */

/* Gooey Button Effect */
.magic-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.magic-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
  z-index: 0;
}

.magic-btn:hover::before {
  width: 300px;
  height: 300px;
}

.magic-btn .content {
  position: relative;
  z-index: 1;
}

/* Magic Text Effect */
.magic-gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

/* Shimmer Effect */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    115deg,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 70%
  );
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% {
    transform: translate(-100%, -100%) rotate(25deg);
  }
  100% {
    transform: translate(100%, 100%) rotate(25deg);
  }
}

/* Magnetic Button */
.magnetic-btn {
  position: relative;
  transition: transform 0.2s ease;
  cursor: pointer;
}
`;

  const magicUICSSPath = path.join(process.cwd(), 'magic-ui.css');
  fs.writeFileSync(magicUICSSPath, magicUIContent);
  console.log(`File magic-ui.css creato in: ${magicUICSSPath}`);
}

// Aggiornare il file index.html per includere il nuovo CSS
function updateIndexHTML() {
  const indexPath = path.join(process.cwd(), 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Verifica se il link a magic-ui.css è già presente
    if (!content.includes('magic-ui.css')) {
      content = content.replace(
        '<link rel="stylesheet" href="styles.css">',
        '<link rel="stylesheet" href="styles.css">\n    <link rel="stylesheet" href="magic-ui.css">'
      );
      
      fs.writeFileSync(indexPath, content);
      console.log('File index.html aggiornato con il riferimento a magic-ui.css');
    }
  } else {
    console.warn('File index.html non trovato. Eseguire prima il setup base del progetto.');
  }
}

// Funzione principale
function main() {
  console.log('Configurazione di MagicUI per il progetto...');
  
  // Creare i file necessari
  createMagicUIStyling();
  updateIndexHTML();
  
  console.log('\nConfigurazioni completate! ✨');
  console.log('Ora puoi utilizzare gli effetti e i componenti di MagicUI nel tuo progetto.');
}

// Esegui la funzione principale
main();