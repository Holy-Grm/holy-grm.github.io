// config.js - Configuration centralisée
export const CONFIG = {
    // Routing
    routing: {
        defaultLang: 'en',
        defaultPage: 'home',
        validPages: ['home', 'projects', 'about', 'contact'],
        validLangs: ['en', 'fr']
    },

    // UI
    ui: {
        scrollThreshold: 50,
        mobileBreakpoint: 768,
        animationDuration: 300
    },

    // Particules
    particles: {
        count: 50,
        mouseParticleThreshold: 2000,
        maxMouseParticles: 50,
        particleSpeed: { min: 12, max: 20 },
        particleSize: 5,
        particleDecay: { min: 0.0, max: 0.05 }
    },

    // Timeline
    timeline: {
        observerThreshold: 0.2,
        rootMargin: '-100px 0px',
        parallaxSpeed: 0.5
    },

    // Selectors (pour éviter les erreurs de typos)
    selectors: {
        nav: '#nav',
        hamburger: '#hamburger',
        langToggle: '#langToggle',
        mobileLangToggle: '#mobileLangToggle',
        mobileMenuOverlay: '#mobileMenuOverlay',
        particles: '#particles',
        logo: '.logo'
    }
};