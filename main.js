// Language toggle functionality
let currentLang = 'en';
const langToggle = document.getElementById('langToggle');

// Fonction pour mettre à jour la langue
function updateLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'fr' : 'en';
    langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
    updateLanguage(currentLang);
});

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links and pages
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Show corresponding page
        const targetPage = link.getAttribute('data-page');
        document.getElementById(targetPage).classList.add('active');
    });
});
async function loadPageContent(pageName, targetElementId, callback = null) {
    try {
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;

        // Réappliquer la langue actuelle après le chargement
        updateLanguage(currentLang);

        // Exécuter le callback spécifique à la page si fourni
        if (callback && typeof callback === 'function') {
            callback();
        }

        // Observer les nouvelles cartes chargées
        observeNewCards();

    } catch (err) {
        console.error(`Erreur lors du chargement de ${pageName}.html :`, err);
        // En cas d'erreur, garder le contenu existant ou afficher un message d'erreur
    }
}

// Fonction spécifique pour charger le contenu de la page home
async function loadHomeContent() {
    await loadPageContent('home', 'home', () => {
        initializeCTAButton();
        initializeMouseEffect();
    });
}

// Fonction spécifique pour charger le contenu de la page projects
async function loadProjectsContent() {
    await loadPageContent('projects', 'projects');
}

// Fonction spécifique pour charger le contenu de la page about
async function loadAboutContent() {
    await loadPageContent('about', 'about');
}

// Fonction spécifique pour charger le contenu de la page about
async function loadContactContent() {
    await loadPageContent('contact', 'contact');
}


// Fonction pour initialiser le bouton CTA (à appeler après le chargement du contenu)
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        // Supprimer l'ancien event listener s'il existe
        ctaButton.replaceWith(ctaButton.cloneNode(true));

        // Ajouter le nouvel event listener
        document.querySelector('.cta-button').addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Activate projects page
            document.querySelector('[data-page="projects"]').classList.add('active');
            document.getElementById('projects').classList.add('active');
        });
    }
}

// Fonction pour initialiser l'effet de souris
function initializeMouseEffect() {
    // L'event listener est déjà global, donc il fonctionnera automatiquement
}

// Fonction pour observer les nouvelles cartes
function observeNewCards() {
    document.querySelectorAll('.skill-card:not([data-observed])').forEach(card => {
        card.setAttribute('data-observed', 'true');
        observer.observe(card);
    });
}

// Scroll effect for navigation
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Create animated particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Mouse move effect for hero section
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        hero.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

// Smooth scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-in-out';
        }
    });
}, observerOptions);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        const links = document.querySelectorAll('.nav-link');
        if (links[index]) {
            links[index].click();
        }
    }
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('show');
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Charger le contenu de la page home
    await loadHomeContent();
    await loadProjectsContent();
    await loadAboutContent();
    await loadContactContent();

    // Initialiser les particules
    createParticles();

    // Observer les cartes existantes (projects, about, etc.)
    document.querySelectorAll('.skill-card, .project-card, .timeline-item').forEach(card => {
        observer.observe(card);
    });
});