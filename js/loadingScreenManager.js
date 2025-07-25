// loadingScreenManager.js - Nouveau gestionnaire pour le loading screen
export class LoadingScreenManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.centralMass = document.getElementById('centralMass');
        this.explosion = document.getElementById('explosion');
        this.loadingText = document.getElementById('loadingText');
        this.progressDots = document.getElementById('progressDots');

        this.minLoadingTime = 2000; // Minimum 2 secondes pour l'expérience
        this.startTime = Date.now();
        this.isHidden = false;

        this.init();
    }

    init() {
        // S'assurer que le loading screen est visible au début
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            console.log('🔄 Loading screen initialisé');
        }

        // Créer l'effet d'explosion de particules
        this.createExplosionParticles();

        // Animer le texte de chargement
        this.animateLoadingText();
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

        const texts = [
            'Gathering particles...',
            'Initializing quantum fields...',
            'Calibrating neural networks...',
            'Loading portfolio data...',
            'Almost ready...'
        ];

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

        // Changer le texte toutes les 800ms
        this.textInterval = setInterval(changeText, 800);
    }

    // Méthode principale pour masquer le loading screen
    async hide() {
        if (this.isHidden) return;

        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);

        // Attendre le temps minimum si nécessaire
        if (remainingTime > 0) {
            console.log(`⏱️ Attente de ${remainingTime}ms pour respecter le temps minimum`);
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        this.isHidden = true;

        // Arrêter les animations
        if (this.textInterval) {
            clearInterval(this.textInterval);
        }

        // Animation de fermeture
        if (this.loadingScreen) {
            console.log('✅ Masquage du loading screen');

            // Effet de fade out
            this.loadingScreen.style.opacity = '0';

            // Ajouter la classe hidden après l'animation
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');

                // Optionnel : supprimer complètement du DOM après le fade
                setTimeout(() => {
                    if (this.loadingScreen && this.loadingScreen.parentNode) {
                        this.loadingScreen.style.display = 'none';
                    }
                }, 100);
            }, 800); // Correspond à la durée de transition CSS
        }
    }

    // Méthode pour forcer l'affichage (debug)
    show() {
        this.isHidden = false;
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
            this.loadingScreen.style.opacity = '1';
            this.loadingScreen.style.display = 'flex';
        }
    }

    // Cleanup
    destroy() {
        if (this.textInterval) {
            clearInterval(this.textInterval);
        }

        if (this.loadingScreen) {
            this.loadingScreen.remove();
        }

        // Supprimer les styles ajoutés
        const explosionStyles = document.querySelector('#explosion-keyframes');
        if (explosionStyles) {
            explosionStyles.remove();
        }
    }
}