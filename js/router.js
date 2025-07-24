// router.js - Gestion du routing et de la navigation
import { CONFIG } from './config.js';

export class Router {
    constructor() {
        this.currentLang = CONFIG.routing.defaultLang;
        this.currentPage = CONFIG.routing.defaultPage;
        this.basePath = this.getBasePath();
        this.observers = new Set(); // Pour notifier les changements

        this.init();
    }

    init() {
        // Parser l'URL initiale
        const { lang, page } = this.parseCurrentURL();
        this.currentLang = lang;
        this.currentPage = page;

        // Écouter les changements d'historique
        window.addEventListener('popstate', (event) => this.handlePopState(event));

        // Gérer les redirections 404 si nécessaire
        this.handleRedirects();
    }

    // Fonction utilitaire pour obtenir le chemin de base
    getBasePath() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);

        if (pathParts.length > 0) {
            const firstPart = pathParts[0];
            const allKnownPaths = [...CONFIG.routing.validLangs, ...CONFIG.routing.validPages];
            if (!allKnownPaths.includes(firstPart)) {
                return '/' + firstPart;
            }
        }
        return '';
    }

    // Parser l'URL actuelle
    parseCurrentURL() {
        let path = sessionStorage.getItem('redirectPath') || window.location.pathname;

        if (sessionStorage.getItem('redirectPath')) {
            sessionStorage.removeItem('redirectPath');
            sessionStorage.removeItem('redirectCount');
        }

        // Retirer le chemin de base
        if (this.basePath && path.startsWith(this.basePath)) {
            path = path.substring(this.basePath.length);
        }

        const segments = path.split('/').filter(segment => segment !== '');
        let lang = CONFIG.routing.defaultLang;
        let page = CONFIG.routing.defaultPage;
        let isValid = false;

        // Logique de parsing des segments
        if (segments.length === 0) {
            isValid = true;
        } else if (segments.length === 1) {
            if (CONFIG.routing.validLangs.includes(segments[0])) {
                lang = segments[0];
                isValid = true;
            } else if (CONFIG.routing.validPages.includes(segments[0])) {
                page = segments[0];
                isValid = true;
            }
        } else if (segments.length === 2) {
            if (CONFIG.routing.validLangs.includes(segments[0]) &&
                CONFIG.routing.validPages.includes(segments[1])) {
                lang = segments[0];
                page = segments[1];
                isValid = true;
            }
        }

        if (!isValid) {
            console.warn('⚠️ Chemin invalide détecté:', path);
            sessionStorage.setItem('needsRedirectToHome', 'true');
        }

        return { lang, page, isValid };
    }

    // Construire une URL
    buildURL(lang, page) {
        if (lang === 'en' && page === 'home') {
            return this.basePath + '/';
        }

        if (page === 'home') {
            return this.basePath + `/${lang}/`;
        }

        return this.basePath + `/${lang}/${page}`;
    }

    // Mettre à jour l'URL
    updateURL(lang, page, addToHistory = true) {
        const newURL = this.buildURL(lang, page);

        if (addToHistory) {
            window.history.pushState({ lang, page }, '', newURL);
        } else {
            window.history.replaceState({ lang, page }, '', newURL);
        }
    }

    // Naviguer vers une page
    navigateTo(page, updateURL = true) {
        const oldPage = this.currentPage;
        this.currentPage = page;

        if (updateURL) {
            this.updateURL(this.currentLang, page);
        }

        this.notifyObservers('pageChange', { oldPage, newPage: page });
    }

    // Changer de langue
    changeLanguage(newLang, updateURL = true) {
        const oldLang = this.currentLang;
        this.currentLang = newLang;

        if (updateURL) {
            this.updateURL(newLang, this.currentPage);
        }

        this.notifyObservers('languageChange', { oldLang, newLang });
    }

    // Gérer les redirections
    handleRedirects() {
        const needsRedirect = sessionStorage.getItem('needsRedirectToHome');
        if (needsRedirect === 'true') {
            sessionStorage.removeItem('needsRedirectToHome');
            setTimeout(() => {
                window.location.replace(this.buildURL(CONFIG.routing.defaultLang, CONFIG.routing.defaultPage));
            }, 100);
        }
    }

    // Gérer les événements de l'historique
    handlePopState(event) {
        if (event.state) {
            const { lang, page } = event.state;

            if (lang !== this.currentLang) {
                this.changeLanguage(lang, false);
            }

            if (page !== this.currentPage) {
                this.navigateTo(page, false);
            }
        } else {
            const { lang, page } = this.parseCurrentURL();
            this.changeLanguage(lang, false);
            this.navigateTo(page, false);
        }
    }

    // Système d'observation pour notifier les changements
    addObserver(callback) {
        this.observers.add(callback);
    }

    removeObserver(callback) {
        this.observers.delete(callback);
    }

    notifyObservers(type, data) {
        this.observers.forEach(observer => {
            try {
                observer(type, data);
            } catch (error) {
                console.error('Erreur dans un observer du router:', error);
            }
        });
    }

    // Getters
    getCurrentLang() {
        return this.currentLang;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    // Fonctions utilitaires
    addValidPage(pageName) {
        if (!CONFIG.routing.validPages.includes(pageName)) {
            CONFIG.routing.validPages.push(pageName);
            console.log(`📄 Nouvelle page ajoutée: ${pageName}`);
        }
    }

    addValidLang(langCode) {
        if (!CONFIG.routing.validLangs.includes(langCode)) {
            CONFIG.routing.validLangs.push(langCode);
            console.log(`🌍 Nouvelle langue ajoutée: ${langCode}`);
        }
    }
}