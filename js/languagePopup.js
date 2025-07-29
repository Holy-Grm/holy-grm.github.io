// components/languagePopup.js - Gestion du popup de sélection de langue
export class LanguagePopup {
    constructor() {
        this.popup = null;
        this.isVisible = false;
        this.keyboardHandler = null;
        
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
        const hasSelected = localStorage.getItem('language-selected');
        
        if (!hasSelected && this.popup) {
            // Délai pour laisser le temps au loading screen de se terminer
            setTimeout(() => {
                this.show();
            }, 1000);
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

        // Sauvegarder la sélection
        localStorage.setItem('language-selected', 'true');
        localStorage.setItem('last-language', lang);
        
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
        localStorage.removeItem('language-selected');
        localStorage.removeItem('last-language');
        this.show();
        console.log('🔄 Popup de langue forcé');
    }

    /**
     * Vérifie si l'utilisateur a déjà fait un choix
     * @returns {boolean}
     */
    hasUserSelectedLanguage() {
        return localStorage.getItem('language-selected') === 'true';
    }

    /**
     * Obtient la dernière langue sélectionnée
     * @returns {string|null}
     */
    getLastSelectedLanguage() {
        return localStorage.getItem('last-language');
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