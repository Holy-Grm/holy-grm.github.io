// Language toggle functionality
let currentLang = 'en';

// Déclaration de toutes les variables nécessaires
const langToggle = document.getElementById('langToggle');
const mobileLangToggle = document.getElementById('mobileLangToggle');
const hamburger = document.getElementById('hamburger');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const logo = document.querySelector('.logo');

// Fonction pour mettre à jour la langue
function updateLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
}

// Système de langue ORIGINAL (desktop)
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
        updateLanguage(currentLang);

        // Mettre à jour aussi le bouton mobile si il existe
        if (mobileLangToggle) {
            mobileLangToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
        }
    });
}

// Bouton langue mobile (simple)
if (mobileLangToggle) {
    mobileLangToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        mobileLangToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
        updateLanguage(currentLang);

        // Mettre à jour aussi le bouton desktop si il existe
        if (langToggle) {
            langToggle.textContent = currentLang === 'en' ? 'FR' : 'EN';
        }
    });
}

// Fonctions pour le menu mobile
function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openMobileMenu() {
    if (hamburger) hamburger.classList.add('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Toggle du menu hamburger
if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (hamburger.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}

// Fonction pour changer de page (utilisée par desktop et mobile)
function navigateToPage(targetPage) {
    // Remove active class from all links and pages
    navLinks.forEach(l => l.classList.remove('active'));
    mobileNavLinks.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    // Add active class to corresponding links
    const desktopLink = document.querySelector(`[data-page="${targetPage}"]`);
    const mobileLink = document.querySelector(`.mobile-nav-link[data-page="${targetPage}"]`);

    if (desktopLink) desktopLink.classList.add('active');
    if (mobileLink) mobileLink.classList.add('active');

    // Show corresponding page
    const targetPageElement = document.getElementById(targetPage);
    if (targetPageElement) targetPageElement.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation desktop
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        navigateToPage(targetPage);

        // Close hamburger menu if it's open
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer && navLinksContainer.classList.contains('show')) {
            navLinksContainer.classList.remove('show');
        }
    });
});

// Navigation mobile
mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        navigateToPage(targetPage);

        // Fermer le menu mobile après sélection
        setTimeout(() => {
            closeMobileMenu();
        }, 300);
    });
});

// Logo navigation
if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToPage('home');

        // Fermer le menu mobile si ouvert
        if (hamburger && hamburger.classList.contains('active')) {
            closeMobileMenu();
        }

        // Close hamburger menu if it's open
        const navLinksContainer = document.querySelector('.nav-links');
        if (navLinksContainer && navLinksContainer.classList.contains('show')) {
            navLinksContainer.classList.remove('show');
        }
    });
}

// Fermer le menu mobile en cliquant en dehors
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });
}

// Fonction pour initialiser les clics sur les cartes de compétences
function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            navigateToPage('projects');
        });
    });
}

// Fonction générique pour charger le contenu des pages
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
    }
}

// Fonction spécifique pour charger le contenu de la page home
async function loadHomeContent() {
    await loadPageContent('home', 'home', () => {
        initializeCTAButton();
        initializeSkillCards();
        initializeMouseEffect();
    });
}

// Fonction spécifique pour charger le contenu de la page projects
async function loadProjectsContent() {
    await loadPageContent('projects', 'projects');
}

// Fonction spécifique pour charger le contenu de la page about
async function loadAboutContent() {
    await loadPageContent('about', 'about', () => {
        // Initialise la timeline après le chargement du contenu
        initializeTimeline();

        // Réapplique les animations d'observation
        observeNewCards();
    });
}

// Fonction spécifique pour charger le contenu de la page contact
async function loadContactContent() {
    await loadPageContent('contact', 'contact');
}

// Fonction pour initialiser le bouton CTA
function initializeCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        // Supprimer l'ancien event listener s'il existe
        ctaButton.replaceWith(ctaButton.cloneNode(true));

        // Ajouter le nouvel event listener
        document.querySelector('.cta-button').addEventListener('click', (e) => {
            e.preventDefault();
            navigateToPage('projects');
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
            const targetPage = links[index].getAttribute('data-page');
            navigateToPage(targetPage);
            if (hamburger && hamburger.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }
});

// Fermer le menu mobile avec Escape et redimensionnement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger && hamburger.classList.contains('active')) {
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && hamburger && hamburger.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Ancien système hamburger (pour compatibilité avec desktop)
const navLinksContainer = document.querySelector('.nav-links');

if (hamburger && navLinksContainer) {
    // Close menu when clicking outside (desktop)
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('show');
        }
    });
}

// Timeline Interactive JavaScript
function initializeTimeline() {
    // Configuration de l'Intersection Observer
    const timelineObserverOptions = {
        threshold: 0.2, // L'élément est visible à 20%
        rootMargin: '-100px 0px' // Déclenche 100px avant d'entrer dans le viewport
    };

    // Observer pour les événements de la timeline
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe visible avec un délai pour un effet cascade
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 100);
            }
        });
    }, timelineObserverOptions);

    // Observer tous les événements de la timeline
    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach((event, index) => {
        event.dataset.delay = index; // Ajoute un délai progressif
        timelineObserver.observe(event);
    });

    // Gestion de l'indicateur d'année flottant
    let currentYear = '2025';
    const yearIndicator = document.querySelector('.year-indicator');

    function updateYearIndicator() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let closestYear = '2025';
        let closestDistance = Infinity;

        timelineEvents.forEach(event => {
            const rect = event.getBoundingClientRect();
            const elementPosition = rect.top + window.scrollY;
            const distance = Math.abs(scrollPosition - elementPosition);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestYear = event.dataset.year;
            }
        });

        if (closestYear !== currentYear) {
            currentYear = closestYear;
            if (yearIndicator) {
                yearIndicator.style.opacity = '0';

                setTimeout(() => {
                    yearIndicator.textContent = currentYear;
                    yearIndicator.style.opacity = '0.3';
                }, 300);
            }
        }

        // Active l'indicateur quand on est dans la zone de la timeline
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer && yearIndicator) {
            const containerRect = timelineContainer.getBoundingClientRect();
            if (containerRect.top < window.innerHeight && containerRect.bottom > 0) {
                yearIndicator.classList.add('active');
            } else {
                yearIndicator.classList.remove('active');
            }
        }
    }

    // Effet de parallaxe sur la ligne de la timeline
    function updateTimelineParallax() {
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            const scrolled = window.scrollY;
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            timelineLine.style.transform = `translateX(-50%) translateY(${yPos}px)`;
        }
    }

    // Effet de lueur sur les dots au survol
    function addDotHoverEffects() {
        const dots = document.querySelectorAll('.timeline-dot');

        dots.forEach(dot => {
            const timelineEvent = dot.closest('.timeline-event');
            const content = timelineEvent.querySelector('.timeline-content');

            content.addEventListener('mouseenter', () => {
                dot.style.transform = 'translateX(-50%) scale(1.5)';
                dot.style.boxShadow = '0 0 0 10px rgba(64, 224, 208, 0.3), 0 0 40px rgba(64, 224, 208, 0.8)';
            });

            content.addEventListener('mouseleave', () => {
                dot.style.transform = 'translateX(-50%) scale(1)';
                dot.style.boxShadow = '0 0 0 5px rgba(64, 224, 208, 0.2), 0 0 20px rgba(64, 224, 208, 0.5)';
            });
        });
    }

    // Animation de la ligne qui se remplit au scroll
    function updateTimelineFill() {
        const timelineLine = document.querySelector('.timeline-line');
        if (!timelineLine) return;

        const timelineContainer = document.querySelector('.timeline-container');
        const containerRect = timelineContainer.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const scrollProgress = Math.max(0, Math.min(1,
            (window.innerHeight - containerRect.top) / (containerHeight + window.innerHeight)
        ));

        // Crée un gradient qui se remplit progressivement
        const gradientPercentage = scrollProgress * 100;
        timelineLine.style.background = `linear-gradient(180deg, 
            #40e0d0 0%, 
            #40e0d0 ${gradientPercentage}%, 
            rgba(64, 224, 208, 0.2) ${gradientPercentage}%, 
            rgba(64, 224, 208, 0.2) 100%)`;
    }

    // Smooth scroll to timeline event on click
    function addTimelineClickEvents() {
        const timelineContents = document.querySelectorAll('.timeline-content');

        timelineContents.forEach(content => {
            content.style.cursor = 'pointer';
            content.addEventListener('click', function() {
                const event = this.closest('.timeline-event');
                const rect = event.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;

                window.scrollTo({
                    top: absoluteTop - 150,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Event listeners pour la timeline
    const scrollHandler = () => {
        updateYearIndicator();
        updateTimelineParallax();
        updateTimelineFill();
    };

    // Ajouter l'event listener seulement si on est sur la page About
    const aboutPage = document.getElementById('about');
    if (aboutPage && aboutPage.classList.contains('active')) {
        window.addEventListener('scroll', scrollHandler);
    }

    // Initialisation
    addDotHoverEffects();
    addTimelineClickEvents();
    updateYearIndicator();
    updateTimelineFill();

    // Animation d'entrée pour le titre
    const timelineTitle = document.querySelector('.timeline-container h2');
    if (timelineTitle) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInScale 1s ease-out';
                }
            });
        }, { threshold: 0.5 });

        titleObserver.observe(timelineTitle);
    }
}

// Ajoute l'animation fadeInScale au CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);
// ✨ SYSTÈME DE PARTICULES POUR LA SOURIS ✨
// À ajouter dans votre main.js

class MouseParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5; // Particules plus petites
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.0; // Disparaissent plus vite

        // Direction aléatoire pour l'étoile filante - MOUVEMENT TRÈS RAPIDE
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 12; // Vitesse très élevée (12-20)
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        // Couleur turquoise uniquement (comme les autres particules du site)
        this.color = 'rgba(64, 224, 208, '; // Turquoise principal seulement

        // Créer l'élément DOM
        this.element = document.createElement('div');
        this.element.style.position = 'fixed';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.borderRadius = '50%';
        this.element.style.pointerEvents = 'none';
        this.element.style.zIndex = '10000';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.updateStyle();

        document.body.appendChild(this.element);
    }

    updateStyle() {
        const alpha = this.life;
        this.element.style.background = `${this.color}${alpha})`;
        this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}${alpha * 0.8})`;
        this.element.style.transform = `scale(${this.life})`;
    }

    update() {
        // Mouvement en ligne droite (pas de gravité, pas de changement de direction)
        this.x += this.vx;
        this.y += this.vy;

        // Dégradation de la vie (les particules disparaissent rapidement)
        this.life -= this.decay;

        // Mise à jour de la position et du style
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.updateStyle();

        // Retourner true si la particule est morte
        // Mort plus rapide quand elle sort de l'écran (même un peu)
        return this.life <= 0 ||
            this.x < -20 || this.x > window.innerWidth + 20 ||
            this.y < -20 || this.y > window.innerHeight + 20;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

class MouseParticleSystem {
    constructor() {
        this.particles = [];
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastTime = 0;
        this.enabled = true;
        this.distanceCounter = 0; // Compteur de distance parcourue
        this.particleThreshold = 500; // 1 particule tous les 5 pixels

        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            if (!this.enabled) return;

            // Calculer la distance parcourue depuis la dernière position
            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Ajouter à notre compteur de distance
            this.distanceCounter += distance;

            // Créer une particule seulement tous les 5 pixels parcourus
            if (this.distanceCounter >= this.particleThreshold) {
                this.createParticle(e.clientX, e.clientY);
                this.distanceCounter = 0; // Reset du compteur
            }

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        // Désactiver sur mobile pour éviter les problèmes de performance
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            this.enabled = false;
        }
    }

    createParticle(x, y) {
        // Créer UNE SEULE particule par appel (pas plusieurs)
        const particle = new MouseParticle(x, y);
        this.particles.push(particle);

        // Limiter le nombre total de particules pour les performances
        if (this.particles.length > 50) { // Réduit de 100 à 50
            const excess = this.particles.length - 50;
            for (let i = 0; i < excess; i++) {
                this.particles[i].destroy();
            }
            this.particles.splice(0, excess);
        }
    }

    animate() {
        // Mettre à jour toutes les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const isDead = particle.update();

            if (isDead) {
                particle.destroy();
                this.particles.splice(i, 1);
            }
        }

        // Continuer l'animation
        requestAnimationFrame(() => this.animate());
    }

    // Méthodes pour contrôler l'effet
    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        // Nettoyer toutes les particules existantes
        this.particles.forEach(particle => particle.destroy());
        this.particles = [];
    }

    destroy() {
        this.disable();
    }
}

// Variable globale pour contrôler le système
let mouseParticleSystem;

// Fonction pour initialiser l'effet de particules de souris
function initializeMouseParticles() {
    if (!mouseParticleSystem) {
        mouseParticleSystem = new MouseParticleSystem();
        console.log('✨ Effet particules souris activé !');
    }
}

// Fonction pour désactiver l'effet (utile pour les performances)
function disableMouseParticles() {
    if (mouseParticleSystem) {
        mouseParticleSystem.disable();
        console.log('❌ Effet particules souris désactivé');
    }
}

// Fonction pour réactiver l'effet
function enableMouseParticles() {
    if (mouseParticleSystem) {
        mouseParticleSystem.enable();
        console.log('✅ Effet particules souris réactivé');
    }
}

// INTÉGRATION DANS VOTRE SYSTÈME EXISTANT
// Ajoutez cette ligne dans votre DOMContentLoaded existant :
// initializeMouseParticles();

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Charger le contenu de toutes les pages
    await loadHomeContent();
    await loadProjectsContent();
    await loadAboutContent();
    await loadContactContent();

    // Initialiser les particules
    createParticles();

    initializeMouseParticles();

    // Observer les cartes existantes (projects, about, etc.)
    document.querySelectorAll('.skill-card, .project-card, .timeline-item').forEach(card => {
        observer.observe(card);
    });
});