// DOM Elements
const linkUtiliBtn = document.getElementById('link-utili-btn');
const contattamiBtn = document.getElementById('contattami-btn');
const linkUtiliModal = document.getElementById('link-utili-modal');
const contattamiModal = document.getElementById('contattami-modal');
const closeButtons = document.querySelectorAll('.close-button');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Theme toggle functionality
const toggleTheme = () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');

  // Update icon
  if (isDarkMode) {
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"/>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"/>
    </svg>`;
  } else {
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
    </svg>`;
  }
};

// Check for saved theme preference or respect OS preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('darkMode');

  if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"/>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"/>
    </svg>`;
  } else if (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    themeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12z"/>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-6 4a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"/>
    </svg>`;
  }
};

// Blob animation with GSAP
const animateBlobs = () => {
  gsap.to('.gradient-blob', {
    x: 'random(-100, 100)',
    y: 'random(-100, 100)',
    scale: 'random(0.8, 1.2)',
    duration: 20,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    repeatRefresh: true
  });

  gsap.to('.gradient-blob.second', {
    x: 'random(-100, 100)',
    y: 'random(-100, 100)',
    scale: 'random(0.7, 1.3)',
    duration: 25,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    repeatRefresh: true,
    delay: 2
  });
};

// Function to open modal with animation
const openModal = (modal) => {
  modal.classList.add('fade-in');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
};

// Function to close modal
const closeModal = (modal) => {
  modal.classList.remove('fade-in');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
  }, 300);
};

// Event Listeners for opening modals
linkUtiliBtn.addEventListener('click', (e) => {
  e.preventDefault();
  linkUtiliModal.style.display = 'block';
  openModal(linkUtiliModal);
});

contattamiBtn.addEventListener('click', (e) => {
  e.preventDefault();
  contattamiModal.style.display = 'block';
  openModal(contattamiModal);
});

// Event Listeners for closing modals
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal);
  });
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    closeModal(e.target);
  }
});

// Close modal with ESC key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.fade-in');
    openModals.forEach(modal => closeModal(modal));
  }
});

// Rimuovo la gestione del form contattami perché non c'è più il form
// Gestione form rimossa: non serve più codice JS per il form contattami

// Text magic effect for the title
const addMagicEffect = () => {
  const title = document.querySelector('.magic-text');
  if (!title) return;

  // Subtle hover animation
  title.addEventListener('mousemove', (e) => {
    const rect = title.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables for gradient position
    title.style.setProperty('--x', `${x}px`);
    title.style.setProperty('--y', `${y}px`);
  });
};

// Enhance buttons with magnetic effect
const enhanceSocialButtons = () => {
  const buttons = document.querySelectorAll('.social-button');

  buttons.forEach(button => {
    button.classList.add('enhanced');

    // Add magnetic effect
    // Effetto magnetico rimosso
  });
};

// Slideshow laterale blendato
function createPhotoSlideshow() {
  const container = document.querySelector('.photo-slideshow-container');
  if (!container) return;
  const images = [
    'src/img/chiesa-15.webp',
    'src/img/chiesa-10.webp',
    'src/img/chiesa-20.webp',
    'src/img/chiesa-25.webp'
  ];
  let current = 0;
  // Pulisci container
  container.innerHTML = '';
  // Crea immagini
  images.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Foto personale ${idx + 1}`;
    img.loading = 'lazy';
    if (idx === 0) img.classList.add('active');
    container.appendChild(img);
  });
  const slides = container.querySelectorAll('img');
  // Funzione per mostrare la slide successiva
  function showNextSlide() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }
  setInterval(showNextSlide, 3500);
}

// Hamburger menu per mobile
const hamburger = document.getElementById('hamburger-menu');
const navUl = document.querySelector('nav ul');
if (hamburger && navUl) {
  hamburger.addEventListener('click', () => {
    navUl.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
}

// Initialize animations when the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Initialize theme based on preference
  initializeTheme();

  // Set up event listener for theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Initialize animations
  animateBlobs();
  addMagicEffect();
  enhanceSocialButtons();

  // Animate elements on page load
  gsap.from('.hero h1', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out'
  });

  gsap.from('.subtitle', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.social-button', {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.8,
    delay: 0.6,
    ease: 'back.out(1.7)'
  });

  createPhotoSlideshow();
});

