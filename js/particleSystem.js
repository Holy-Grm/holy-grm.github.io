// Modification de particleSystem.js pour intégrer la répulsion magnétique
import { CONFIG } from './config.js';
import { MagneticParticleSystem, MAGNETIC_CONFIG } from './magneticParticleSystem.js';

// Classe mise à jour pour inclure l'effet magnétique
export class ParticleSystem {
    constructor() {
        this.mouseParticleSystem = null;
        this.magneticParticleSystem = null; // NOUVEAU
        this.backgroundParticles = [];
        this.useMagneticEffect = true; // Par défaut activé

        this.init();
    }

    init() {
        // Choisir entre particules normales ou magnétiques
        if (this.useMagneticEffect) {
            this.initializeMagneticParticles();
        } else {
            this.createBackgroundParticles();
        }

        this.initializeMouseParticles();
        this.setupMouseEffect();
    }

    initializeMagneticParticles() {
        import('./magneticParticleSystem.js').then(module => {
            this.magneticParticleSystem = new module.MagneticParticleSystem();

            // ← VOILÀ LE PROBLÈME ! Ces lignes overrident vos valeurs :
            this.magneticParticleSystem.setRepulsionRadius(120); // 150 !
            this.magneticParticleSystem.setRepulsionStrength(10); // 100 !
            this.magneticParticleSystem.setReturnSpeed(0.01);

            console.log('🧲 Particules magnétiques initialisées !');
        });
    }

    // Méthode existante (fallback)
    createBackgroundParticles() {
        const particlesContainer = document.querySelector(CONFIG.selectors.particles);
        if (!particlesContainer) return;

        // Nettoyer les particules existantes
        particlesContainer.innerHTML = '';

        for (let i = 0; i < CONFIG.particles.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 8}s;
                animation-duration: ${(Math.random() * 3 + 5)}s;
            `;

            particlesContainer.appendChild(particle);
            this.backgroundParticles.push(particle);
        }

        console.log(`✨ ${CONFIG.particles.count} particules normales créées`);
    }

    initializeMouseParticles() {
        if (!this.mouseParticleSystem) {
            // Import dynamique pour éviter les dépendances circulaires
            import('./mouseParticleSystem.js').then(module => {
                this.mouseParticleSystem = new module.MouseParticleSystem();
                console.log('✨ Effet particules souris activé !');
            }).catch(() => {
                // Fallback vers l'ancien système si le module n'existe pas
                console.log('✨ Utilisation du système de particules intégré');
            });
        }
    }

    setupMouseEffect() {
        // Effet de mouvement de souris pour la section héro (conservé)
        document.addEventListener('mousemove', (e) => {
            const hero = document.querySelector('.hero');
            if (!hero) return;

            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            hero.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }

    // NOUVELLES MÉTHODES de contrôle magnétique
    enableMagneticEffect() {
        if (this.magneticParticleSystem) {
            this.magneticParticleSystem.enable();
        } else {
            this.useMagneticEffect = true;
            this.initializeMagneticParticles();
        }
        console.log('🧲 Effet magnétique activé');
    }

    disableMagneticEffect() {
        if (this.magneticParticleSystem) {
            this.magneticParticleSystem.disable();
        }
        this.useMagneticEffect = false;
        console.log('🧲 Effet magnétique désactivé');
    }

    toggleMagneticEffect() {
        if (this.useMagneticEffect) {
            this.disableMagneticEffect();
        } else {
            this.enableMagneticEffect();
        }
    }

    // Configurer la répulsion
    setMagneticConfig(radius, strength, returnSpeed) {
        if (this.magneticParticleSystem) {
            this.magneticParticleSystem.setRepulsionRadius(radius);
            this.magneticParticleSystem.setRepulsionStrength(strength);
            this.magneticParticleSystem.setReturnSpeed(returnSpeed);
        }
    }

    // Presets de configuration
    setMagneticPreset(preset) {
        const presets = {
            'subtle': {
                radius: MAGNETIC_CONFIG.RADIUS_SMALL,
                strength: MAGNETIC_CONFIG.STRENGTH_WEAK,
                speed: MAGNETIC_CONFIG.SPEED_SLOW
            },
            'normal': {
                radius: MAGNETIC_CONFIG.RADIUS_MEDIUM,
                strength: MAGNETIC_CONFIG.STRENGTH_MEDIUM,
                speed: MAGNETIC_CONFIG.SPEED_MEDIUM
            },
            'intense': {
                radius: MAGNETIC_CONFIG.RADIUS_LARGE,
                strength: MAGNETIC_CONFIG.STRENGTH_STRONG,
                speed: MAGNETIC_CONFIG.SPEED_FAST
            }
        };

        const config = presets[preset] || presets['normal'];
        this.setMagneticConfig(config.radius, config.strength, config.speed);

        console.log(`🎯 Preset magnétique "${preset}" appliqué`);
    }

    // Méthodes de contrôle existantes (conservées)
    enableMouseParticles() {
        if (this.mouseParticleSystem) {
            this.mouseParticleSystem.enable();
            console.log('✅ Effet particules souris réactivé');
        }
    }

    disableMouseParticles() {
        if (this.mouseParticleSystem) {
            this.mouseParticleSystem.disable();
            console.log('❌ Effet particules souris désactivé');
        }
    }

    // Cleanup mis à jour
    destroy() {
        // Nettoyer le système magnétique
        if (this.magneticParticleSystem) {
            this.magneticParticleSystem.destroy();
        }

        // Nettoyer le système de particules souris
        if (this.mouseParticleSystem) {
            this.mouseParticleSystem.destroy();
        }

        // Nettoyer les particules de fond normales
        const particlesContainer = document.querySelector(CONFIG.selectors.particles);
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }

        this.backgroundParticles = [];
        console.log('🧹 Système de particules nettoyé');
    }

    // Méthodes utilitaires
    recreateParticles() {
        if (this.useMagneticEffect && this.magneticParticleSystem) {
            this.magneticParticleSystem.regenerateParticles();
        } else {
            this.createBackgroundParticles();
        }
    }

    // Getter pour savoir quel système est actif
    getActiveSystem() {
        return {
            magnetic: !!this.magneticParticleSystem && this.useMagneticEffect,
            mouse: !!this.mouseParticleSystem,
            normal: !this.useMagneticEffect
        };
    }
}

// Fonctions utilitaires globales pour contrôler l'effet magnétique
window.toggleMagneticParticles = () => {
    if (window.app && window.app.getParticleSystem) {
        window.app.getParticleSystem().toggleMagneticEffect();
    }
};

window.setMagneticPreset = (preset) => {
    if (window.app && window.app.getParticleSystem) {
        window.app.getParticleSystem().setMagneticPreset(preset);
    }
};

window.configureMagneticEffect = (radius, strength, speed) => {
    if (window.app && window.app.getParticleSystem) {
        window.app.getParticleSystem().setMagneticConfig(radius, strength, speed);
    }
};