// languageManager.js - Version finale sans doublons
import { CONFIG } from './config.js';

export class LanguageManager {
    constructor(router) {
        this.router = router;
        this.currentLang = router.getCurrentLang();

        this.initializeElements();
        this.bindEvents();

        // S'abonner aux changements de langue du router
        this.router.addObserver((type, data) => {
            if (type === 'languageChange') {
                this.handleLanguageChange(data.newLang);
            }
        });
    }

    initializeElements() {
        this.langToggle = document.querySelector(CONFIG.selectors.langToggle);
        this.mobileLangToggle = document.querySelector(CONFIG.selectors.mobileLangToggle);

        // Créer le thumb pour l'interrupteur si il n'existe pas
        this.createToggleThumbs();
        this.updateToggleButtons();
    }

    createToggleThumbs() {
        // Créer le thumb pour le toggle desktop
        if (this.langToggle && !this.langToggle.querySelector('.lang-toggle-thumb')) {
            const thumb = document.createElement('div');
            thumb.className = 'lang-toggle-thumb';
            this.langToggle.appendChild(thumb);

            // Définir l'attribut data-lang initial
            this.langToggle.setAttribute('data-lang', this.currentLang);
        }

        // Créer le thumb pour le toggle mobile si il existe
        if (this.mobileLangToggle && !this.mobileLangToggle.querySelector('.lang-toggle-thumb')) {
            const thumb = document.createElement('div');
            thumb.className = 'lang-toggle-thumb';
            this.mobileLangToggle.appendChild(thumb);

            // Définir l'attribut data-lang initial
            this.mobileLangToggle.setAttribute('data-lang', this.currentLang);
        }
    }

    bindEvents() {
        // Bouton langue desktop
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguageWithAnimation(this.langToggle);
            });
        }

        // Bouton langue mobile
        if (this.mobileLangToggle) {
            this.mobileLangToggle.addEventListener('click', () => {
                this.toggleLanguageWithAnimation(this.mobileLangToggle);
            });
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'fr' : 'en';
        this.router.changeLanguage(newLang);
    }

    toggleLanguageWithAnimation(toggleElement) {
        // Ajouter la classe d'animation
        toggleElement.classList.add('changing');

        // Changer la langue après un petit délai pour l'animation
        setTimeout(() => {
            this.toggleLanguage();

            // Retirer la classe d'animation
            setTimeout(() => {
                toggleElement.classList.remove('changing');
            }, 300);
        }, 100);
    }

    handleLanguageChange(newLang) {
        this.currentLang = newLang;
        this.updateToggleButtons();
        this.updatePageTexts();

        console.log(`🌍 Langue changée vers: ${newLang}`);
    }

    updateToggleButtons() {
        // Mettre à jour le toggle desktop
        if (this.langToggle) {
            this.langToggle.setAttribute('data-lang', this.currentLang);

            // Mettre à jour l'aria-label pour l'accessibilité
            const otherLang = this.currentLang === 'en' ? 'français' : 'english';
            this.langToggle.setAttribute('aria-label', `Switch to ${otherLang}`);
        }

        // Mettre à jour le toggle mobile
        if (this.mobileLangToggle) {
            this.mobileLangToggle.setAttribute('data-lang', this.currentLang);

            const otherLang = this.currentLang === 'en' ? 'français' : 'english';
            this.mobileLangToggle.setAttribute('aria-label', `Switch to ${otherLang}`);
        }
    }

    updatePageTexts() {
        console.log('🔍 updatePageTexts appelée, langue:', this.currentLang);

        // Mettre à jour tous les éléments avec des attributs de langue (sauf les images)
        document.querySelectorAll('[data-en]').forEach(element => {
            if (element.tagName !== 'IMG') {
                const text = element.getAttribute(`data-${this.currentLang}`);
                if (text) {
                    element.textContent = text;
                }
            }
        });

        // Mettre à jour les images séparément
        this.updateProjectImages();

        console.log(`📝 Textes et images mis à jour pour la langue: ${this.currentLang}`);
    }

    updateProjectImages() {
        console.log('🖼️ updateProjectImages appelée, langue:', this.currentLang);

        const images = document.querySelectorAll('img[data-en][data-fr]');
        console.log('🖼️ Images trouvées:', images.length);

        images.forEach((img, index) => {
            const currentSrc = img.src;
            const newSrc = img.getAttribute(`data-${this.currentLang}`);
            console.log(`🖼️ Image ${index}: ${currentSrc.split('/').pop()} -> ${newSrc}`);

            if (newSrc && !currentSrc.endsWith(newSrc)) {
                img.src = newSrc;
                console.log(`✅ Image ${index} changée vers: ${newSrc}`);
            }
        });
    }

    // Méthode pour ajouter facilement de nouvelles traductions
    addTranslation(element, translations) {
        Object.keys(translations).forEach(lang => {
            element.setAttribute(`data-${lang}`, translations[lang]);
        });

        // Appliquer immédiatement la langue actuelle
        const currentText = element.getAttribute(`data-${this.currentLang}`);
        if (currentText) {
            element.textContent = currentText;
        }
    }

    // Méthode pour obtenir une traduction spécifique
    getText(key, lang = this.currentLang) {
        const element = document.querySelector(`[data-key="${key}"]`);
        return element ? element.getAttribute(`data-${lang}`) : null;
    }

    // Méthode pour forcer la mise à jour de tous les textes
    forceUpdateTexts() {
        this.updatePageTexts();
    }

    // Méthode utilitaire pour forcer la mise à jour de l'interrupteur
    forceUpdateToggle() {
        this.updateToggleButtons();
    }

    // Méthode pour ajouter des effets visuels supplémentaires
    addToggleEffects() {
        const toggles = [this.langToggle, this.mobileLangToggle].filter(Boolean);

        toggles.forEach(toggle => {
            // Effet au focus pour accessibilité clavier
            toggle.addEventListener('focus', () => {
                toggle.style.boxShadow = '0 0 0 3px rgba(64, 224, 208, 0.3)';
            });

            toggle.addEventListener('blur', () => {
                toggle.style.boxShadow = '';
            });

            // Support des touches fléchées
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleLanguageWithAnimation(toggle);
                }
            });
        });
    }

    // Méthode pour vérifier si une langue est supportée
    isLanguageSupported(lang) {
        return CONFIG.routing.validLangs.includes(lang);
    }

    // Getter pour la langue actuelle
    getCurrentLang() {
        return this.currentLang;
    }

    // Méthode pour obtenir la liste des langues supportées
    getSupportedLanguages() {
        return [...CONFIG.routing.validLangs];
    }

    // Cleanup
    destroy() {
        // Supprimer les event listeners si nécessaire
        console.log('🧹 LanguageManager nettoyé');
    }
}