// components/languagePopup.js - Version corrigée avec meilleure gestion
export class LanguagePopup {
    constructor() {
        this.popup = null;
        this.isVisible = false;
        this.keyboardHandler = null;
        this.hasUserSelected = false;
        this.selectedLanguage = null;

        this.init();
    }

    init() {
        this.popup = document.getElementById('languagePopup');
        this.setupKeyboardSupport();
        this.checkAndShow();
    }

    checkAndShow() {
        if (this.popup) {
            setTimeout(() => {
                this.show();
            }, 200);
        }
    }

    show() {
        if (!this.popup || this.isVisible) return;

        this.popup.classList.add('show');
        this.isVisible = true;
        this.createSplitScreenParticles();

        console.log('🌍 Popup de sélection de langue affiché');
    }

    hide() {
        if (!this.popup || !this.isVisible) return;

        this.popup.style.transform = 'scale(0.95)';
        this.popup.style.opacity = '0';

        setTimeout(() => {
            this.popup.classList.remove('show');
            this.popup.style.transform = '';
            this.popup.style.opacity = '';
            this.isVisible = false;
        }, 400);
    }

    selectLanguage(lang) {
        if (!['en', 'fr'].includes(lang)) {
            console.warn('⚠️ Langue invalide:', lang);
            return;
        }

        console.log(`🌍 Langue sélectionnée: ${lang}`);

        // Marquer que l'utilisateur a fait une sélection
        this.hasUserSelected = true;
        this.selectedLanguage = lang;

        // Sauvegarder en localStorage si disponible
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('language-selected', 'true');
                localStorage.setItem('last-language', lang);
            }
        } catch (e) {
            console.log('📝 localStorage non disponible');
        }

        // Fermer le popup
        this.hide();

        // Appliquer la langue - MÉTHODE AMÉLIORÉE
        setTimeout(() => {
            this.applyLanguageChange(lang);
        }, 500);
    }

    // NOUVELLE MÉTHODE pour appliquer le changement de langue de manière robuste
    applyLanguageChange(lang) {
        console.log(`🔄 Application du changement de langue vers: ${lang}`);

        // Méthode 1: Via l'app si disponible
        if (window.app && typeof window.app.changeLanguage === 'function') {
            console.log('✅ Changement via window.app');
            window.app.changeLanguage(lang);
            return;
        }

        // Méthode 2: Via le router directement
        if (window.app && window.app.getRouter) {
            const router = window.app.getRouter();
            if (router && typeof router.changeLanguage === 'function') {
                console.log('✅ Changement via router');
                router.changeLanguage(lang);
                return;
            }
        }

        // Méthode 3: Attendre que l'app soit prête
        console.log('⏳ App non prête, attente...');
        let attempts = 0;
        const maxAttempts = 20; // 2 secondes max

        const waitForApp = () => {
            attempts++;

            if (window.app && typeof window.app.changeLanguage === 'function') {
                console.log('✅ App prête, changement de langue');
                window.app.changeLanguage(lang);
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(waitForApp, 100);
            } else {
                console.error('❌ Impossible de changer la langue - app non disponible');
                // Méthode de fallback : recharger la page avec la bonne langue
                this.fallbackLanguageChange(lang);
            }
        };

        waitForApp();
    }

    // Méthode de fallback si l'app n'est pas disponible
    fallbackLanguageChange(lang) {
        console.log(`🔄 Fallback: rechargement avec langue ${lang}`);

        // Construire la nouvelle URL
        let newUrl = window.location.origin + window.location.pathname;

        // Déterminer le chemin de base (pour GitHub Pages)
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        let basePath = '';

        if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0];
            const knownPaths = ['en', 'fr', 'home', 'projects', 'about', 'contact'];
            if (!knownPaths.includes(firstSegment)) {
                basePath = '/' + firstSegment;
            }
        }

        // Construire la nouvelle URL avec la langue
        if (lang === 'en') {
            newUrl = window.location.origin + basePath + '/';
        } else {
            newUrl = window.location.origin + basePath + '/' + lang + '/';
        }

        console.log(`🔗 Redirection vers: ${newUrl}`);
        window.location.href = newUrl;
    }

    createSplitScreenParticles() {
        this.createParticlesForSide('englishParticles', 15);
        this.createParticlesForSide('frenchParticles', 15);
    }

    createParticlesForSide(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'popup-particle floating';

            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';

            container.appendChild(particle);
        }
    }

    setupKeyboardSupport() {
        this.keyboardHandler = (e) => {
            if (!this.isVisible) return;

            switch (e.key) {
                case 'ArrowLeft':
                case '1':
                    e.preventDefault();
                    this.selectLanguage('en');
                    break;
                case 'ArrowRight':
                case '2':
                    e.preventDefault();
                    this.selectLanguage('fr');
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.selectLanguage('en');
                    break;
            }
        };

        document.addEventListener('keydown', this.keyboardHandler);
    }

    forceShow() {
        this.hasUserSelected = false;
        this.selectedLanguage = null;

        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('language-selected');
                localStorage.removeItem('last-language');
            }
        } catch (e) {
            // Ignorer
        }

        this.show();
        console.log('🔄 Popup de langue forcé');
    }

    hasUserSelectedLanguage() {
        if (this.hasUserSelected) {
            return true;
        }

        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('language-selected') === 'true';
            }
        } catch (e) {
            // localStorage non disponible
        }

        return false;
    }

    getLastSelectedLanguage() {
        if (this.selectedLanguage) {
            return this.selectedLanguage;
        }

        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('last-language');
            }
        } catch (e) {
            // localStorage non disponible
        }

        return null;
    }

    destroy() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
            this.keyboardHandler = null;
        }

        const containers = ['englishParticles', 'frenchParticles'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '';
            }
        });

        console.log('🧹 LanguagePopup nettoyé');
    }
}

// FONCTIONS GLOBALES AMÉLIORÉES
window.selectLanguage = function(lang) {
    console.log(`🖱️ Clic sur langue: ${lang}`);

    // Méthode 1: Via l'instance du popup
    if (window.languagePopupInstance && typeof window.languagePopupInstance.selectLanguage === 'function') {
        console.log('✅ Utilisation de l\'instance popup');
        window.languagePopupInstance.selectLanguage(lang);
        return;
    }

    // Méthode 2: Chercher l'instance dans l'app
    if (window.app && window.app.getLanguagePopup) {
        const popup = window.app.getLanguagePopup();
        if (popup && typeof popup.selectLanguage === 'function') {
            console.log('✅ Utilisation du popup via app');
            popup.selectLanguage(lang);
            return;
        }
    }

    // Méthode 3: Créer une instance temporaire pour gérer la sélection
    console.log('⚠️ Aucune instance trouvée, création temporaire');
    const tempPopup = new LanguagePopup();
    tempPopup.selectLanguage(lang);
};

window.showLanguagePopup = function() {
    if (window.languagePopupInstance) {
        window.languagePopupInstance.forceShow();
    } else if (window.app && window.app.showLanguagePopup) {
        window.app.showLanguagePopup();
    }
};