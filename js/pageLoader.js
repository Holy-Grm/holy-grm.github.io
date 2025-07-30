// pageLoader.js - Gestion du chargement des contenus de pages
import { CONFIG } from './config.js';

export class PageLoader {
    constructor(router, languageManager) {
        this.router = router;
        this.languageManager = languageManager;
        this.loadedPages = new Set();
        this.pageCallbacks = new Map();

        this.setupObserver();
        this.registerPageCallbacks();
    }

    setupObserver() {
        // Configuration pour l'Intersection Observer
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease-in-out';
                }
            });
        }, this.observerOptions);
    }

    registerPageCallbacks() {
        // Callbacks spécifiques à chaque page
        this.pageCallbacks.set('home', () => {
            this.initializeCTAButton();
        });

        this.pageCallbacks.set('about', () => {
            // Timeline sera initialisée par le TimelineManager
            this.observeNewCards();
        });

        this.pageCallbacks.set('projects', () => {
            this.observeNewCards();
        });

        this.pageCallbacks.set('contact', () => {
            // Logique spécifique à la page contact si nécessaire
        });
    }

    async loadAllPages() {
        console.log('🔄 Chargement de toutes les pages...');

        const loadPromises = CONFIG.routing.validPages.map(page =>
            this.loadPageContent(page)
        );

        try {
            await Promise.all(loadPromises);
            console.log('✅ Toutes les pages chargées');
        } catch (error) {
            console.error('❌ Erreur lors du chargement des pages:', error);
        }
    }

    async loadPageContent(pageName) {
        if (this.loadedPages.has(pageName)) {
            console.log(`📄 Page ${pageName} déjà chargée`);
            return;
        }

        try {
            const basePath = this.router.basePath;
            const resourcePath = basePath ? `${basePath}/${pageName}.html` : `/${pageName}.html`;

            console.log(`🔄 Chargement de ${pageName}...`);

            const response = await fetch(resourcePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const targetElement = document.getElementById(pageName);

            if (targetElement) {
                targetElement.innerHTML = html;
                this.loadedPages.add(pageName);

                // Réappliquer la langue actuelle
                this.languageManager.updatePageTexts();

                // Exécuter le callback spécifique à la page
                const callback = this.pageCallbacks.get(pageName);
                if (callback) {
                    callback();
                }

                console.log(`✅ Page ${pageName} chargée`);
            } else {
                console.error(`❌ Élément cible pour ${pageName} non trouvé`);
            }

        } catch (error) {
            console.error(`❌ Erreur lors du chargement de ${pageName}:`, error);
        }
    }

    // Méthodes spécifiques aux pages
    initializeCTAButton() {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            // Supprimer l'ancien event listener en clonant l'élément
            const newButton = ctaButton.cloneNode(true);
            ctaButton.parentNode.replaceChild(newButton, ctaButton);

            // Ajouter le nouvel event listener
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.router.navigateTo('projects');
            });
        }
    }



    observeNewCards() {
        const selectors = ['.skill-card', '.project-card', '.timeline-item'];

        selectors.forEach(selector => {
            document.querySelectorAll(`${selector}:not([data-observed])`).forEach(card => {
                card.setAttribute('data-observed', 'true');
                this.intersectionObserver.observe(card);
            });
        });
    }

    // Méthode pour ajouter des callbacks personnalisés
    addPageCallback(pageName, callback) {
        this.pageCallbacks.set(pageName, callback);
    }

    // Méthode pour recharger une page spécifique
    async reloadPage(pageName) {
        this.loadedPages.delete(pageName);
        await this.loadPageContent(pageName);
    }

    // Méthode pour précharger une page
    async preloadPage(pageName) {
        if (!this.loadedPages.has(pageName)) {
            await this.loadPageContent(pageName);
        }
    }

    // Cleanup
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        this.loadedPages.clear();
        this.pageCallbacks.clear();
    }
}