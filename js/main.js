// main.js - Orchestrateur principal (version avec popup de langue)
import { CONFIG } from './config.js';
import { Router } from './router.js';
import { LanguageManager } from './languageManager.js';
import { NavigationUI } from './navigationUI.js';
import { PageLoader } from './pageLoader.js';
import { ParticleSystem } from './particleSystem.js';
import { TimelineManager } from './timelineManager.js';
import { LoadingScreenManager } from './loadingScreenManager.js';

/**
 * Classe principale de l'application
 * Orchestré tous les modules et gère l'initialisation
 */
class Application {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.loadingScreenManager = null;
    }

    async initialize() {
        if (this.isInitialized) {
            console.warn('⚠️ Application déjà initialisée');
            return;
        }

        console.log('🚀 Initialisation de l\'application...');

        try {
            // 1. Initialiser le loading screen EN PREMIER
            this.loadingScreenManager = new LoadingScreenManager();

            // 2. Initialiser les modules dans l'ordre correct
            await this.initializeCore();
            await this.initializeUI();
            await this.initializeEffects();
            await this.loadContent();

            this.isInitialized = true;
            console.log('✅ Application initialisée avec succès');

            // 3. MASQUER le loading screen une fois tout prêt
            await this.loadingScreenManager.hide();

            // 4. Initialiser la persistance de langue APRÈS l'initialisation
            this.initializeLanguagePersistence();

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            // En cas d'erreur, masquer quand même le loading screen
            if (this.loadingScreenManager) {
                await this.loadingScreenManager.hide();
            }
        }
    }

    async initializeCore() {
        console.log('🔧 Initialisation des modules de base...');

        // 1. Router (gestion des URLs et navigation)
        this.modules.set('router', new Router());

        // 2. LanguageManager (gestion des langues)
        this.modules.set('languageManager',
            new LanguageManager(this.modules.get('router'))
        );

        // 3. PageLoader (chargement du contenu)
        this.modules.set('pageLoader',
            new PageLoader(
                this.modules.get('router'),
                this.modules.get('languageManager')
            )
        );
    }

    async initializeUI() {
        console.log('🎨 Initialisation de l\'interface...');

        // 4. NavigationUI (gestion de la navigation)
        this.modules.set('navigationUI',
            new NavigationUI(this.modules.get('router'))
        );

        // 5. TimelineManager (timeline de la page about)
        this.modules.set('timelineManager',
            new TimelineManager(this.modules.get('router'))
        );
    }

    async initializeEffects() {
        console.log('✨ Initialisation des effets visuels...');

        // 6. ParticleSystem (effets de particules)
        this.modules.set('particleSystem', new ParticleSystem());
    }

    async loadContent() {
        console.log('📄 Chargement du contenu des pages...');

        // Charger toutes les pages
        const pageLoader = this.modules.get('pageLoader');
        await pageLoader.loadAllPages();

        // Initialiser l'état de l'application
        this.initializeApplicationState();
    }

    initializeApplicationState() {
        const router = this.modules.get('router');
        const languageManager = this.modules.get('languageManager');

        // Si l'utilisateur a déjà choisi une langue, l'appliquer
        const savedLang = localStorage.getItem('last-language');
        if (savedLang && savedLang !== router.getCurrentLang()) {
            router.changeLanguage(savedLang, false); // false = ne pas mettre à jour l'URL
        }

        // Appliquer la langue actuelle
        languageManager.updatePageTexts();

        // Naviguer vers la page initiale (mise à jour UI)
        const navigationUI = this.modules.get('navigationUI');
        navigationUI.updateActiveStates(router.getCurrentPage());

        console.log(`📍 État initial: ${router.getCurrentLang()}/${router.getCurrentPage()}`);
    }

    // Fonction pour initialiser la persistance de la langue
    initializeLanguagePersistence() {
        const router = this.modules.get('router');

        // Sauvegarder la langue actuelle
        const currentLang = router.getCurrentLang();
        localStorage.setItem('last-language', currentLang);

        // Écouter les changements de langue pour les sauvegarder
        router.addObserver((type, data) => {
            if (type === 'languageChange') {
                localStorage.setItem('last-language', data.newLang);
                console.log(`💾 Langue sauvegardée: ${data.newLang}`);
            }
        });

        console.log('🔐 Persistance de langue initialisée');
    }

    // Méthodes utilitaires pour accéder aux modules
    getModule(name) {
        return this.modules.get(name);
    }

    getRouter() {
        return this.modules.get('router');
    }

    getLanguageManager() {
        return this.modules.get('languageManager');
    }

    getNavigationUI() {
        return this.modules.get('navigationUI');
    }

    getPageLoader() {
        return this.modules.get('pageLoader');
    }

    getParticleSystem() {
        return this.modules.get('particleSystem');
    }

    getTimelineManager() {
        return this.modules.get('timelineManager');
    }

    getLoadingScreenManager() {
        return this.loadingScreenManager;
    }

    // Méthodes de contrôle de l'application
    enableParticles() {
        const particleSystem = this.modules.get('particleSystem');
        if (particleSystem) {
            particleSystem.enableMouseParticles();
        }
    }

    disableParticles() {
        const particleSystem = this.modules.get('particleSystem');
        if (particleSystem) {
            particleSystem.disableMouseParticles();
        }
    }

    // Navigation programmatique
    navigateTo(page) {
        const router = this.modules.get('router');
        if (router) {
            router.navigateTo(page);
        }
    }

    changeLanguage(lang) {
        const router = this.modules.get('router');
        if (router) {
            router.changeLanguage(lang);
        }
    }

    // Rechargement d'une page spécifique
    async reloadPage(pageName) {
        const pageLoader = this.modules.get('pageLoader');
        if (pageLoader) {
            await pageLoader.reloadPage(pageName);
        }
    }

    // Méthodes de contrôle du loading screen
    showLoadingScreen() {
        if (this.loadingScreenManager) {
            this.loadingScreenManager.show();
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreenManager) {
            this.loadingScreenManager.hide();
        }
    }

    // Cleanup pour tests ou changements majeurs
    destroy() {
        console.log('🧹 Nettoyage de l\'application...');

        // Nettoyer le loading screen en premier
        if (this.loadingScreenManager) {
            this.loadingScreenManager.destroy();
            this.loadingScreenManager = null;
        }

        // Nettoyer tous les modules dans l'ordre inverse
        const moduleNames = Array.from(this.modules.keys()).reverse();

        moduleNames.forEach(name => {
            const module = this.modules.get(name);
            if (module && typeof module.destroy === 'function') {
                try {
                    module.destroy();
                    console.log(`✅ Module ${name} nettoyé`);
                } catch (error) {
                    console.error(`❌ Erreur lors du nettoyage de ${name}:`, error);
                }
            }
        });

        this.modules.clear();
        this.isInitialized = false;

        console.log('🧹 Nettoyage terminé');
    }

    // Informations de debug
    getStatus() {
        const router = this.modules.get('router');
        return {
            initialized: this.isInitialized,
            modules: Array.from(this.modules.keys()),
            currentLang: router?.getCurrentLang(),
            currentPage: router?.getCurrentPage(),
            url: window.location.href,
            loadingScreenHidden: this.loadingScreenManager?.isHidden,
            languageSelected: localStorage.getItem('language-selected') === 'true'
        };
    }

    // Méthode pour ajouter des modules personnalisés
    addModule(name, module) {
        if (this.modules.has(name)) {
            console.warn(`⚠️ Module ${name} déjà existant, remplacement`);
        }
        this.modules.set(name, module);
        console.log(`➕ Module ${name} ajouté`);
    }
}

// ============ INITIALISATION GLOBALE ============

// Instance globale de l'application
let app = null;

// Fonction d'initialisation principale
async function initializeApp() {
    try {
        app = new Application();
        await app.initialize();

        // Exposer l'app globalement pour le debug (optionnel)
        if (typeof window !== 'undefined') {
            window.app = app;
            window.APP_CONFIG = CONFIG; // Pour debug
        }

        console.log('🎉 Application complètement initialisée !');

    } catch (error) {
        console.error('💥 Erreur fatale lors de l\'initialisation:', error);

        // En cas d'erreur fatale, forcer le masquage du loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que tout est prêt
    setTimeout(initializeApp, 100);
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('💥 Erreur JavaScript globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Promise rejetée non gérée:', event.reason);
});

// Export pour utilisation en tant que module (optionnel)
export { Application, CONFIG };

// ============ FONCTIONS UTILITAIRES GLOBALES ============

// Fonctions de compatibilité pour l'ancien code
window.navigateToPage = (page) => {
    if (app) {
        app.navigateTo(page);
    }
};

window.changeLanguage = (lang) => {
    if (app) {
        app.changeLanguage(lang);
    }
};

window.toggleParticles = () => {
    if (app) {
        const particleSystem = app.getParticleSystem();
        // Implémenter la logique de toggle si nécessaire
    }
};

// Fonctions de contrôle du loading screen
window.showLoadingScreen = () => {
    if (app) {
        app.showLoadingScreen();
    }
};

window.hideLoadingScreen = () => {
    if (app) {
        app.hideLoadingScreen();
    }
};

// Debug helpers
window.debugApp = () => {
    if (app) {
        console.table(app.getStatus());
    } else {
        console.log('Application non initialisée');
    }
};

// Fonction utilitaire pour réinitialiser la sélection de langue (debug)
window.resetLanguageSelection = () => {
    localStorage.removeItem('language-selected');
    localStorage.removeItem('last-language');
    window.showLanguagePopup();
    console.log('🔄 Sélection de langue réinitialisée');
};

console.log('📦 main.js chargé - En attente du DOM...');