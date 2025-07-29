// languageManager.js - Version corrigée sans localStorage
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

        this.updateToggleButtons();
    }

    bindEvents() {
        // Bouton langue desktop
        if (this.langToggle) {
            this.langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Bouton langue mobile
        if (this.mobileLangToggle) {
            this.mobileLangToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'fr' : 'en';
        this.router.changeLanguage(newLang);
    }

    handleLanguageChange(newLang) {
        this.currentLang = newLang;
        this.updateToggleButtons();
        this.updatePageTexts();

        console.log(`🌍 Langue changée vers: ${newLang}`);
    }

    updateToggleButtons() {
        const buttonText = this.currentLang === 'en' ? 'FR' : 'EN';

        if (this.langToggle) {
            this.langToggle.textContent = buttonText;
        }

        if (this.mobileLangToggle) {
            this.mobileLangToggle.textContent = buttonText;
        }
    }

    updatePageTexts() {
        // Mettre à jour tous les éléments avec des attributs de langue
        document.querySelectorAll('[data-en]').forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                element.textContent = text;
            }
        });

        console.log(`📝 Textes mis à jour pour la langue: ${this.currentLang}`);
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
        // (Pas nécessaire ici car les éléments sont supprimés du DOM)
        console.log('🧹 LanguageManager nettoyé');
    }
}