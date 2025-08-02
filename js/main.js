// main.js - Version mise à jour avec le gestionnaire de cartes
import { CONFIG } from './config.js';
import { Router } from './router.js';
import { LanguageManager } from './languageManager.js';
import { NavigationUI } from './navigationUI.js';
import { PageLoader } from './pageLoader.js';
import { ParticleSystem } from './particleSystem.js';
import { TimelineManager } from './timelineManager.js';
import { LoadingScreenManager } from './loadingScreenManager.js';
import { LanguagePopup } from './languagePopup.js';
import { CardExpansionManager } from './cardExpansionManager.js'; // NOUVEAU

/**
 * Classe principale de l'application - Version avec gestionnaire de cartes
 */
class Application {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.loadingScreenManager = null;
        this.languagePopup = null;
        this.cardExpansionManager = null; // NOUVEAU
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

            // 2. Initialiser les modules core dans l'ordre correct
            await this.initializeCore();
            await this.initializeUI();
            await this.initializeEffects();
            await this.loadContent();

            // 3. Initialiser le gestionnaire de cartes APRÈS le contenu
            this.initializeCardExpansion();

            // 4. Finaliser l'initialisation
            this.isInitialized = true;
            console.log('✅ Application initialisée avec succès');

            // 5. Gérer la persistance de langue AVANT de masquer le loading screen
            this.initializeLanguagePersistence();

            // 6. Vérifier si le popup doit être affiché et l'initialiser si nécessaire
            const shouldShowPopup = this.shouldShowLanguagePopup();

            if (shouldShowPopup) {
                console.log('🌍 Popup requis - activation du mode popup et préparation');
                this.loadingScreenManager.enablePopupMode();
                this.initializeLanguagePopup();
                await this.waitForPopupReady();
                await this.loadingScreenManager.hide();
            } else {
                console.log('🌍 Popup non requis - masquage immédiat du loading screen');
                await this.loadingScreenManager.hide();
            }

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
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

    // NOUVELLE MÉTHODE pour initialiser le gestionnaire de cartes
    initializeCardExpansion() {
        console.log('🃏 Initialisation du gestionnaire de cartes...');

        const router = this.modules.get('router');
        this.cardExpansionManager = new CardExpansionManager(router);
        this.modules.set('cardExpansionManager', this.cardExpansionManager);

        console.log('✅ Gestionnaire de cartes initialisé');
    }

    initializeApplicationState() {
        const router = this.modules.get('router');
        const languageManager = this.modules.get('languageManager');

        // Appliquer la langue actuelle aux textes
        languageManager.updatePageTexts();

        // Naviguer vers la page initiale (mise à jour UI)
        const navigationUI = this.modules.get('navigationUI');
        navigationUI.updateActiveStates(router.getCurrentPage());

        console.log(`📍 État initial: ${router.getCurrentLang()}/${router.getCurrentPage()}`);
    }

    // [Autres méthodes inchangées...]
    shouldShowLanguagePopup() {
        let hasSelected = false;
        try {
            if (typeof localStorage !== 'undefined') {
                hasSelected = localStorage.getItem('language-selected') === 'true';
            }
        } catch (e) {
            hasSelected = false;
        }
        return !hasSelected;
    }

    async waitForPopupReady() {
        return new Promise((resolve) => {
            if (!this.languagePopup) {
                resolve();
                return;
            }

            const checkReady = () => {
                if (this.languagePopup.popup && this.languagePopup.isVisible) {
                    console.log('🌍 Popup prêt et visible');
                    setTimeout(resolve, 300);
                } else {
                    setTimeout(checkReady, 100);
                }
            };

            setTimeout(checkReady, 200);
            setTimeout(() => {
                console.warn('⚠️ Timeout atteint pour l\'attente du popup');
                resolve();
            }, 3000);
        });
    }

    initializeLanguagePersistence() {
        const router = this.modules.get('router');

        let savedLang = null;
        try {
            if (typeof localStorage !== 'undefined') {
                savedLang = localStorage.getItem('last-language');
            }
        } catch (e) {
            console.log('📝 localStorage non disponible pour la persistance');
        }

        if (savedLang && savedLang !== router.getCurrentLang()) {
            router.changeLanguage(savedLang, false);
            console.log(`🔄 Langue restaurée: ${savedLang}`);
        }

        router.addObserver((type, data) => {
            if (type === 'languageChange') {
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('last-language', data.newLang);
                        console.log(`💾 Langue sauvegardée: ${data.newLang}`);
                    }
                } catch (e) {
                    console.log('📝 Impossible de sauvegarder la langue');
                }
            }
        });

        console.log('🔐 Persistance de langue initialisée');
    }

    initializeLanguagePopup() {
        this.languagePopup = new LanguagePopup();
        this.modules.set('languagePopup', this.languagePopup);
        window.languagePopupInstance = this.languagePopup;
        console.log('🌍 Popup de langue créé et prêt');
    }

    // === MÉTHODES PUBLIQUES MISES À JOUR ===

    // Getters pour tous les modules
    getModule(name) { return this.modules.get(name); }
    getRouter() { return this.modules.get('router'); }
    getLanguageManager() { return this.modules.get('languageManager'); }
    getNavigationUI() { return this.modules.get('navigationUI'); }
    getPageLoader() { return this.modules.get('pageLoader'); }
    getParticleSystem() { return this.modules.get('particleSystem'); }
    getTimelineManager() { return this.modules.get('timelineManager'); }
    getLoadingScreenManager() { return this.loadingScreenManager; }
    getLanguagePopup() { return this.languagePopup; }

    // NOUVEAU getter pour le gestionnaire de cartes
    getCardExpansionManager() { return this.cardExpansionManager; }

    // Méthodes de contrôle de l'application
    enableParticles() {
        const particleSystem = this.modules.get('particleSystem');
        if (particleSystem) particleSystem.enableMouseParticles();
    }

    disableParticles() {
        const particleSystem = this.modules.get('particleSystem');
        if (particleSystem) particleSystem.disableMouseParticles();
    }

    navigateTo(page) {
        const router = this.modules.get('router');
        if (router) router.navigateTo(page);
    }

    changeLanguage(lang) {
        const router = this.modules.get('router');
        if (router) router.changeLanguage(lang);
    }

    async reloadPage(pageName) {
        const pageLoader = this.modules.get('pageLoader');
        if (pageLoader) await pageLoader.reloadPage(pageName);
    }

    // NOUVELLES MÉTHODES pour contrôler les cartes
    expandCard(selector) {
        if (this.cardExpansionManager) {
            this.cardExpansionManager.expandCardBySelector(selector);
        }
    }

    collapseAllCards() {
        if (this.cardExpansionManager) {
            this.cardExpansionManager.collapseAllCards();
        }
    }

    getCurrentExpandedCard() {
        return this.cardExpansionManager ?
            this.cardExpansionManager.getCurrentExpandedCard() : null;
    }

    // Méthodes de contrôle des autres systèmes...
    showLoadingScreen() {
        if (this.loadingScreenManager) this.loadingScreenManager.show();
    }

    hideLoadingScreen() {
        if (this.loadingScreenManager) this.loadingScreenManager.hide();
    }

    showLanguagePopup() {
        if (this.languagePopup) {
            this.languagePopup.forceShow();
        } else {
            this.languagePopup = new LanguagePopup();
            this.modules.set('languagePopup', this.languagePopup);
            window.languagePopupInstance = this.languagePopup;
            this.languagePopup.forceShow();
        }
    }

    // Cleanup mis à jour
    destroy() {
        console.log('🧹 Nettoyage de l\'application...');

        // Nettoyer le gestionnaire de cartes
        if (this.cardExpansionManager) {
            this.cardExpansionManager.destroy();
            this.cardExpansionManager = null;
        }

        // Nettoyer le popup de langue
        if (this.languagePopup) {
            this.languagePopup.destroy();
            this.languagePopup = null;
        }

        // Nettoyer le loading screen
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

    // Informations de debug mises à jour
    getStatus() {
        const router = this.modules.get('router');

        let languageSelected = false;
        try {
            if (typeof localStorage !== 'undefined') {
                languageSelected = localStorage.getItem('language-selected') === 'true';
            }
        } catch (e) {
            languageSelected = false;
        }

        return {
            initialized: this.isInitialized,
            modules: Array.from(this.modules.keys()),
            currentLang: router?.getCurrentLang(),
            currentPage: router?.getCurrentPage(),
            url: window.location.href,
            loadingScreenHidden: this.loadingScreenManager?.isHidden,
            languageSelected: languageSelected,
            hasLanguagePopup: !!this.languagePopup,
            hasCardExpansionManager: !!this.cardExpansionManager,
            currentExpandedCard: this.getCurrentExpandedCard()?.className || 'none',
            localStorageAvailable: typeof localStorage !== 'undefined',
            popupVisible: this.languagePopup?.isVisible || false,
            shouldShowPopup: this.shouldShowLanguagePopup()
        };
    }

    addModule(name, module) {
        if (this.modules.has(name)) {
            console.warn(`⚠️ Module ${name} déjà existant, remplacement`);
        }
        this.modules.set(name, module);
        console.log(`➕ Module ${name} ajouté`);
    }
}

// ============ INITIALISATION GLOBALE ============

let app = null;

async function initializeApp() {
    try {
        app = new Application();
        await app.initialize();

        if (typeof window !== 'undefined') {
            window.app = app;
            window.APP_CONFIG = CONFIG;
        }

        console.log('🎉 Application complètement initialisée !');

    } catch (error) {
        console.error('💥 Erreur fatale lors de l\'initialisation:', error);

        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 100);
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('💥 Erreur JavaScript globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Promise rejetée non gérée:', event.reason);
});

export { Application, CONFIG };

// ============ FONCTIONS UTILITAIRES GLOBALES MISES À JOUR ============

window.navigateToPage = (page) => {
    if (app) app.navigateTo(page);
};

window.changeLanguage = (lang) => {
    if (app) app.changeLanguage(lang);
};

// NOUVELLES FONCTIONS pour contrôler les cartes
window.expandCard = (selector) => {
    if (app) app.expandCard(selector);
};

window.collapseAllCards = () => {
    if (app) app.collapseAllCards();
};

window.getCurrentExpandedCard = () => {
    return app ? app.getCurrentExpandedCard() : null;
};

window.showLoadingScreen = () => {
    if (app) app.showLoadingScreen();
};

window.hideLoadingScreen = () => {
    if (app) app.hideLoadingScreen();
};

window.resetLanguageSelection = () => {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('language-selected');
            localStorage.removeItem('last-language');
        }
    } catch (e) {
        console.log('📝 Impossible de nettoyer localStorage');
    }

    if (app) app.showLanguagePopup();
    console.log('🔄 Sélection de langue réinitialisée');
};

window.debugApp = () => {
    if (app) {
        console.table(app.getStatus());
    } else {
        console.log('Application non initialisée');
    }
};

console.log('📦 main.js chargé - En attente du DOM...');