// loadingScreenManager.js - Version améliorée avec meilleur timing
export class LoadingScreenManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.centralMass = document.getElementById('centralMass');
        this.explosion = document.getElementById('explosion');
        this.loadingText = document.getElementById('loadingText');
        this.progressDots = document.getElementById('progressDots');

        this.minLoadingTime = 1500; // Temps minimum par défaut
        this.maxLoadingTime = 8000; // Augmenter le temps maximum pour le popup
        this.popupMode = false; // Mode spécial pour attendre le popup
        this.startTime = Date.now();
        this.isHidden = false;
        this.hidePromise = null; // Pour éviter les appels multiples

        this.init();
    }

    init() {
        // S'assurer que le loading screen est visible au début
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.style.opacity = '1';
            console.log('🔄 Loading screen initialisé');
        }

        // Créer l'effet d'explosion de particules
        this.createExplosionParticles();

        // Animer le texte de chargement
        this.animateLoadingText();

        // Sécurité : forcer le masquage après le temps maximum
        this.setupFailsafe();
    }

    // Méthode pour activer le mode popup (temps d'attente plus long)
    enablePopupMode() {
        this.popupMode = true;
        this.minLoadingTime = 2500; // Temps minimum plus long pour le popup

        // Redémarrer l'animation du texte avec les nouveaux messages
        if (this.textInterval) {
            clearInterval(this.textInterval);
        }
        this.animateLoadingText();

        console.log('🌍 Mode popup activé - temps de loading étendu');
    }

    // Méthode pour désactiver le mode popup
    disablePopupMode() {
        this.popupMode = false;
        this.minLoadingTime = 1500; // Retour au temps normal
        console.log('🌍 Mode popup désactivé - temps de loading normal');
    }

    setupFailsafe() {
        // Failsafe pour éviter que le loading screen reste à l'infini
        setTimeout(() => {
            if (!this.isHidden) {
                console.warn('⚠️ Loading screen failsafe activé - masquage forcé');
                this.forceHide();
            }
        }, this.maxLoadingTime);
    }

    createExplosionParticles() {
        if (!this.explosion) return;

        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';

            // Position aléatoire autour du centre
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--color-primary);
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                animation: explodeParticle 3s ease-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;

            // Variables CSS custom pour l'animation
            particle.style.setProperty('--final-x', `${x}px`);
            particle.style.setProperty('--final-y', `${y}px`);

            this.explosion.appendChild(particle);
        }

        // Ajouter les keyframes si elles n'existent pas
        if (!document.querySelector('#explosion-keyframes')) {
            const style = document.createElement('style');
            style.id = 'explosion-keyframes';
            style.textContent = `
                @keyframes explodeParticle {
                    0% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(
                            calc(-50% + var(--final-x)), 
                            calc(-50% + var(--final-y))
                        ) scale(0.5);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    animateLoadingText() {
        if (!this.loadingText) return;

        const normalTexts = [
            'Gathering particles...',
            'Initializing quantum fields...',
            'Calibrating neural networks...',
            'Loading portfolio data...',
            'Almost ready...'
        ];

        const popupTexts = [
            'Gathering particles...',
            'Preparing language selection...',
            'Initializing interface...',
            'Getting ready for you...',
            'Almost there...'
        ];

        const texts = this.popupMode ? popupTexts : normalTexts;
        let currentIndex = 0;

        const changeText = () => {
            if (this.isHidden) return;

            this.loadingText.style.opacity = '0';

            setTimeout(() => {
                if (this.isHidden) return;
                currentIndex = (currentIndex + 1) % texts.length;
                this.loadingText.textContent = texts[currentIndex];
                this.loadingText.style.opacity = '1';
            }, 300);
        };

        // Changer le texte toutes les 600ms (plus rapide)
        this.textInterval = setInterval(changeText, 600);
    }

    // Méthode principale pour masquer le loading screen
    async hide() {
        // Éviter les appels multiples
        if (this.hidePromise) {
            return this.hidePromise;
        }

        if (this.isHidden) {
            return Promise.resolve();
        }

        console.log('🔄 Début du masquage du loading screen...');

        this.hidePromise = this._performHide();
        return this.hidePromise;
    }

    async _performHide() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        // Attendre le temps minimum si nécessaire
        if (remainingTime > 0) {
            console.log(`⏱️ Attente de ${remainingTime}ms pour respecter le temps minimum`);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        return this._hideNow();
    }

    // Méthode pour masquer immédiatement (utilisée par le failsafe)
    forceHide() {
        if (this.isHidden) return;

        console.log('⚡ Masquage forcé du loading screen');
        this._hideNow();
    }

    _hideNow() {
        return new Promise((resolve) => {
            this.isHidden = true;

            // Arrêter les animations
            if (this.textInterval) {
                clearInterval(this.textInterval);
                this.textInterval = null;
            }

            // Animation de fermeture
            if (this.loadingScreen) {
                console.log('✅ Masquage du loading screen en cours...');

                // Effet de fade out
                this.loadingScreen.style.transition = 'opacity 0.8s ease-in-out';
                this.loadingScreen.style.opacity = '0';

                // Ajouter la classe hidden après l'animation
                setTimeout(() => {
                    if (this.loadingScreen) {
                        this.loadingScreen.classList.add('hidden');
                        this.loadingScreen.style.display = 'none';
                        console.log('✅ Loading screen complètement masqué');
                    }
                    resolve();
                }, 800); // Correspond à la durée de transition CSS
            } else {
                resolve();
            }
        });
    }

    // Méthode pour forcer l'affichage (debug)
    show() {
        this.isHidden = false;
        this.hidePromise = null;
        this.startTime = Date.now(); // Reset du timer

        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            this.loadingScreen.style.opacity = '1';
            this.loadingScreen.style.display = 'flex';
            this.loadingScreen.style.transition = '';

            // Redémarrer l'animation du texte
            if (!this.textInterval) {
                this.animateLoadingText();
            }

            console.log('🔄 Loading screen réaffiché');
        }

        // Redémarrer le failsafe
        this.setupFailsafe();
    }

    // Vérifier si le loading screen est masqué
    get hidden() {
        return this.isHidden;
    }

    // Cleanup
    destroy() {
        // Arrêter les timers
        if (this.textInterval) {
            clearInterval(this.textInterval);
            this.textInterval = null;
        }

        // Masquer si nécessaire
        if (!this.isHidden) {
            this.forceHide();
        }

        // Supprimer du DOM
        if (this.loadingScreen && this.loadingScreen.parentNode) {
            this.loadingScreen.remove();
        }

        // Supprimer les styles ajoutés
        const explosionStyles = document.querySelector('#explosion-keyframes');
        if (explosionStyles) {
            explosionStyles.remove();
        }

        console.log('🧹 LoadingScreenManager détruit');
    }

    // Méthodes utilitaires pour debug
    getStatus() {
        return {
            isHidden: this.isHidden,
            elapsedTime: Date.now() - this.startTime,
            minLoadingTime: this.minLoadingTime,
            maxLoadingTime: this.maxLoadingTime,
            hasHidePromise: !!this.hidePromise,
            hasTextInterval: !!this.textInterval
        };
    }

    // Méthode pour ajuster les timings si nécessaire
    setTimings(minTime, maxTime) {
        this.minLoadingTime = minTime;
        this.maxLoadingTime = maxTime;
        console.log(`⚙️ Timings mis à jour: min=${minTime}ms, max=${maxTime}ms`);
    }
}