// components/languagePopup.js - Version corrigée sans localStorage
export class LanguagePopup {
    constructor() {
        this.popup = null;
        this.isVisible = false;
        this.keyboardHandler = null;
        this.hasUserSelected = false; // Utiliser une variable interne au lieu de localStorage
        this.selectedLanguage = null;

        this.init();
    }

    init() {
        this.popup = document.getElementById('languagePopup');
        this.setupKeyboardSupport();
        this.checkAndShow();
    }

    /**
     * Vérifie si le popup doit être affiché et l'affiche si nécessaire
     */
    checkAndShow() {
        // Afficher immédiatement le popup car la vérification est faite en amont
        if (this.popup) {
            // Petit délai pour s'assurer que le DOM est prêt
            setTimeout(() => {
                this.show();
            }, 200);
        }
    }

    /**
     * Affiche le popup avec les animations
     */
    show() {
        if (!this.popup || this.isVisible) return;

        this.popup.classList.add('show');
        this.isVisible = true;
        this.createSplitScreenParticles();

        console.log('🌍 Popup de sélection de langue affiché');
    }

    /**
     * Cache le popup avec les animations
     */
    hide() {
        if (!this.popup || !this.isVisible) return;

        // Animation de fermeture
        this.popup.style.transform = 'scale(0.95)';
        this.popup.style.opacity = '0';

        setTimeout(() => {
            this.popup.classList.remove('show');
            this.popup.style.transform = '';
            this.popup.style.opacity = '';
            this.isVisible = false;
        }, 400);
    }

    /**
     * Sélectionne une langue et ferme le popup
     * @param {string} lang - Code de langue ('en' ou 'fr')
     */
    selectLanguage(lang) {
        if (!['en', 'fr'].includes(lang)) {
            console.warn('⚠️ Langue invalide:', lang);
            return;
        }

        // Marquer que l'utilisateur a fait une sélection (en mémoire seulement)
        this.hasUserSelected = true;
        this.selectedLanguage = lang;

        // Essayer de sauvegarder en localStorage si disponible (pour la version en ligne)
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('language-selected', 'true');
                localStorage.setItem('last-language', lang);
            }
        } catch (e) {
            // localStorage non disponible, ignorer silencieusement
            console.log('📝 localStorage non disponible, utilisation de la mémoire uniquement');
        }

        console.log(`🌍 Langue sélectionnée: ${lang}`);

        // Fermer le popup
        this.hide();

        // Appliquer la langue dans l'application après fermeture
        setTimeout(() => {
            if (window.app && window.app.changeLanguage) {
                window.app.changeLanguage(lang);
            }
        }, 500);
    }

    /**
     * Crée les particules animées pour les deux côtés
     */
    createSplitScreenParticles() {
        this.createParticlesForSide('englishParticles', 15);
        this.createParticlesForSide('frenchParticles', 15);
    }

    /**
     * Crée les particules pour un côté spécifique
     * @param {string} containerId - ID du conteneur de particules
     * @param {number} count - Nombre de particules à créer
     */
    createParticlesForSide(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Nettoyer les particules existantes
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'popup-particle floating';

            // Position aléatoire
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Délai d'animation aléatoire
            particle.style.animationDelay = Math.random() * 6 + 's';

            container.appendChild(particle);
        }
    }

    /**
     * Configure le support clavier
     */
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
                    this.selectLanguage('en'); // Par défaut
                    break;
            }
        };

        document.addEventListener('keydown', this.keyboardHandler);
    }

    /**
     * Force l'affichage du popup (pour debug/settings)
     */
    forceShow() {
        this.hasUserSelected = false;
        this.selectedLanguage = null;

        // Nettoyer localStorage si disponible
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem('language-selected');
                localStorage.removeItem('last-language');
            }
        } catch (e) {
            // Ignorer silencieusement
        }

        this.show();
        console.log('🔄 Popup de langue forcé');
    }

    /**
     * Vérifie si l'utilisateur a déjà fait un choix
     * @returns {boolean}
     */
    hasUserSelectedLanguage() {
        // Vérifier d'abord la variable interne
        if (this.hasUserSelected) {
            return true;
        }

        // Puis essayer localStorage si disponible
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('language-selected') === 'true';
            }
        } catch (e) {
            // localStorage non disponible
        }

        return false;
    }

    /**
     * Obtient la dernière langue sélectionnée
     * @returns {string|null}
     */
    getLastSelectedLanguage() {
        // Vérifier d'abord la variable interne
        if (this.selectedLanguage) {
            return this.selectedLanguage;
        }

        // Puis essayer localStorage si disponible
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('last-language');
            }
        } catch (e) {
            // localStorage non disponible
        }

        return null;
    }

    /**
     * Nettoie les event listeners (pour cleanup)
     */
    destroy() {
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
            this.keyboardHandler = null;
        }

        // Nettoyer les particules
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

// Fonctions globales pour la compatibilité avec le HTML
window.selectLanguage = function(lang) {
    if (window.languagePopupInstance) {
        window.languagePopupInstance.selectLanguage(lang);
    }
};

window.showLanguagePopup = function() {
    if (window.languagePopupInstance) {
        window.languagePopupInstance.forceShow();
    }
};