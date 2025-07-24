// navigationUI.js - Gestion de l'interface de navigation
import { CONFIG } from './config.js';

export class NavigationUI {
    constructor(router) {
        this.router = router;
        this.isMenuOpen = false;

        this.initializeElements();
        this.bindEvents();
        this.setupScrollEffect();
        this.setupKeyboardNavigation();

        // S'abonner aux changements de page du router
        this.router.addObserver((type, data) => {
            if (type === 'pageChange') {
                this.updateActiveStates(data.newPage);
            }
        });
    }

    initializeElements() {
        this.nav = document.querySelector(CONFIG.selectors.nav);
        this.hamburger = document.querySelector(CONFIG.selectors.hamburger);
        this.mobileMenuOverlay = document.querySelector(CONFIG.selectors.mobileMenuOverlay);
        this.logo = document.querySelector(CONFIG.selectors.logo);

        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.pages = document.querySelectorAll('.page');

        // Pour le système desktop hamburger (compatibilité)
        this.navLinksContainer = document.querySelector('.nav-links');
    }

    bindEvents() {
        this.bindDesktopNavigation();
        this.bindMobileNavigation();
        this.bindHamburgerMenu();
        this.bindLogoNavigation();
        this.bindMobileMenuClose();
    }

    bindDesktopNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.router.navigateTo(targetPage);
                this.closeMobileMenuIfOpen();
            });
        });
    }

    bindMobileNavigation() {
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                this.router.navigateTo(targetPage);

                // Fermer le menu mobile avec un délai
                setTimeout(() => {
                    this.closeMobileMenu();
                }, CONFIG.ui.animationDuration);
            });
        });
    }

    bindHamburgerMenu() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    bindLogoNavigation() {
        if (this.logo) {
            this.logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.router.navigateTo('home');
                this.closeMobileMenuIfOpen();
            });
        }
    }

    bindMobileMenuClose() {
        // Fermer en cliquant en dehors
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileMenuOverlay) {
                    this.closeMobileMenu();
                }
            });
        }

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Fermer au redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > CONFIG.ui.mobileBreakpoint && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Système desktop (compatibilité)
        if (this.navLinksContainer) {
            document.addEventListener('click', (e) => {
                if (!this.hamburger?.contains(e.target) && !this.navLinksContainer.contains(e.target)) {
                    this.navLinksContainer.classList.remove('show');
                }
            });
        }
    }

    // Gestion du menu mobile
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;

        if (this.hamburger) this.hamburger.classList.add('active');
        if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.add('active');

        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;

        if (this.hamburger) this.hamburger.classList.remove('active');
        if (this.mobileMenuOverlay) this.mobileMenuOverlay.classList.remove('active');

        document.body.style.overflow = 'auto';
    }

    closeMobileMenuIfOpen() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }

        // Compatibilité système desktop
        if (this.navLinksContainer?.classList.contains('show')) {
            this.navLinksContainer.classList.remove('show');
        }
    }

    // Mettre à jour les états actifs
    updateActiveStates(activePage) {
        // Retirer toutes les classes actives
        this.navLinks.forEach(link => link.classList.remove('active'));
        this.mobileNavLinks.forEach(link => link.classList.remove('active'));
        this.pages.forEach(page => page.classList.remove('active'));

        // Ajouter les classes actives appropriées
        const desktopLink = document.querySelector(`[data-page="${activePage}"]`);
        const mobileLink = document.querySelector(`.mobile-nav-link[data-page="${activePage}"]`);
        const pageElement = document.getElementById(activePage);

        if (desktopLink) desktopLink.classList.add('active');
        if (mobileLink) mobileLink.classList.add('active');
        if (pageElement) pageElement.classList.add('active');

        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Effet de scroll sur la navigation
    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            if (this.nav) {
                if (window.scrollY > CONFIG.ui.scrollThreshold) {
                    this.nav.classList.add('scrolled');
                } else {
                    this.nav.classList.remove('scrolled');
                }
            }
        });
    }

    // Navigation au clavier
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const index = parseInt(e.key) - 1;
                const link = this.navLinks[index];

                if (link) {
                    const targetPage = link.getAttribute('data-page');
                    this.router.navigateTo(targetPage);
                    this.closeMobileMenuIfOpen();
                }
            }
        });
    }

    // Méthodes utilitaires
    getCurrentActivePage() {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id : 'home';
    }

    // Pour l'intégration avec d'autres modules
    onPageChange(callback) {
        this.router.addObserver((type, data) => {
            if (type === 'pageChange') {
                callback(data.newPage, data.oldPage);
            }
        });
    }
}