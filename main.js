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

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', (e) => {
        e.preventDefault();

        // Désactive toutes les sections et liens actifs
        navLinks.forEach(l => l.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        // Active la section Home et son lien
        const homeLink = document.querySelector('[data-page="home"]');
        const homePage = document.getElementById('home');
        if (homeLink && homePage) {
            homeLink.classList.add('active');
            homePage.classList.add('active');
        }

        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Fonction pour initialiser les clics sur les cartes de compétences
function initializeSkillCards() {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            const projectsLink = document.querySelector('[data-page="projects"]');
            const projectsPage = document.getElementById('projects');

            if (projectsLink && projectsPage) {
                projectsLink.classList.add('active');
                projectsPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
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
        initializeSkillCards(); // Nom de fonction corrigé
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
            yearIndicator.style.opacity = '0';

            setTimeout(() => {
                yearIndicator.textContent = currentYear;
                yearIndicator.style.opacity = '0.3';
            }, 300);
        }

        // Active l'indicateur quand on est dans la zone de la timeline
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer) {
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Charger le contenu de toutes les pages
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