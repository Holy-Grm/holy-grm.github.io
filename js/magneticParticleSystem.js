// magneticParticleSystem.js - Système de répulsion des particules
export class MagneticParticleSystem {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.repulsionRadius = 0; // Rayon d'effet en pixels
        this.repulsionStrength = 0; // Force de répulsion
        this.returnSpeed = 0.05; // Vitesse de retour à la position initiale
        this.isActive = true;
        this.mouseInWindow = true; // ← AJOUTER CETTE LIGNE !

        this.init();
    }

    init() {
        this.createParticles();
        this.bindMouseEvents();
        this.animate();

        console.log('🧲 Système de répulsion magnétique activé !');
    }

    createParticles() {
        const particlesContainer = document.querySelector('#particles');
        if (!particlesContainer) return;

        // Nettoyer les anciennes particules
        particlesContainer.innerHTML = '';

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = {
                // Propriétés HTML
                element: document.createElement('div'),

                // Position initiale (sauvegardée pour le retour)
                initialX: Math.random() * window.innerWidth,
                initialY: Math.random() * window.innerHeight,

                // Position actuelle
                x: 0,
                y: 0,

                // Vélocité pour animations fluides
                vx: 0,
                vy: 0,

                // Propriétés visuelles
                size: Math.random() * 4 + 2,
                opacity: Math.random() * 0.6 + 0.3,

                // Animation de base (vertical)
                baseSpeed: Math.random() * 2 + 1,
                baseOffset: Math.random() * Math.PI * 2
            };

            // Initialiser la position
            particle.x = particle.initialX;
            particle.y = particle.initialY;

            // Style de la particule
            particle.element.className = 'magnetic-particle';
            particle.element.style.cssText = `
                position: absolute;
                width: ${particle.size}px;
                height: ${particle.size}px;
                background: rgba(64, 224, 208, ${particle.opacity});
                border-radius: 50%;
                pointer-events: none;
                left: ${particle.x}px;
                top: ${particle.y}px;
                transition: background-color 0.3s ease;
                will-change: transform;
            `;

            particlesContainer.appendChild(particle.element);
            this.particles.push(particle);
        }

        console.log(`✨ ${particleCount} particules magnétiques créées`);
    }

    bindMouseEvents() {
        // Suivre la position de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouseInWindow = true; // Souris dans la fenêtre
        });

        // NOUVEAU : Quand la souris sort, désactiver SEULEMENT la répulsion
        document.addEventListener('mouseleave', () => {
            this.mouseInWindow = false; // Pas de répulsion
            // this.isActive reste TRUE → Animation continue !
            console.log('🖱️ Souris sortie - Répulsion désactivée, animation continue');
        });

        // Quand la souris revient, réactiver la répulsion
        document.addEventListener('mouseenter', () => {
            this.mouseInWindow = true; // Répulsion réactivée
            console.log('🖱️ Souris revenue - Répulsion réactivée');
        });

        // Gérer le redimensionnement
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('🔄 Redimensionnement détecté, recréation des particules...');
                this.regenerateParticles();
            }, 250);
        });
    }

    calculateRepulsion(particle) {
        // Pas de répulsion si souris hors fenêtre OU système désactivé
        if (!this.isActive || !this.mouseInWindow) {
            return { x: 0, y: 0 };
        }

        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.repulsionRadius || distance === 0) {
            return { x: 0, y: 0 };
        }

        const repulsionForce = (this.repulsionRadius - distance) / this.repulsionRadius;
        const strength = repulsionForce * this.repulsionStrength;

        const repulsionX = (dx / distance) * strength;
        const repulsionY = (dy / distance) * strength;

        return { x: repulsionX, y: repulsionY };
    }

    updateParticle(particle, deltaTime) {
        // Calculer la force de répulsion
        const repulsion = this.calculateRepulsion(particle);

        // Force de retour vers la position initiale
        const returnForceX = (particle.initialX - particle.x) * this.returnSpeed;
        const returnForceY = (particle.initialY - particle.y) * this.returnSpeed;

        // Animation de base (mouvement vertical léger)
        const time = Date.now() * 0.001;
        const baseMovementY = Math.sin(time * particle.baseSpeed + particle.baseOffset) * 2;

        // Appliquer toutes les forces
        particle.vx += repulsion.x * 0.1 + returnForceX * 0.1;
        particle.vy += repulsion.y * 0.1 + returnForceY * 0.1 + baseMovementY * 0.05;

        // Friction pour éviter l'accumulation
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Garder les particules dans l'écran avec un peu de marge
        const margin = 50;
        particle.x = Math.max(-margin, Math.min(window.innerWidth + margin, particle.x));
        particle.y = Math.max(-margin, Math.min(window.innerHeight + margin, particle.y));

        // Effet visuel : plus la particule est repoussée, plus elle brille
        const distanceFromInitial = Math.sqrt(
            Math.pow(particle.x - particle.initialX, 2) +
            Math.pow(particle.y - particle.initialY, 2)
        );

        const glowIntensity = Math.min(distanceFromInitial / 100, 1);
        const finalOpacity = particle.opacity + (glowIntensity * 0.4);

        // Appliquer la transformation CSS
        particle.element.style.transform = `translate(${particle.x - particle.initialX}px, ${particle.y - particle.initialY}px)`;
        particle.element.style.background = `rgba(64, 224, 208, ${finalOpacity})`;

        // Effet de taille qui change avec la répulsion
        const scale = 1 + (glowIntensity * 0.3);
        particle.element.style.transform += ` scale(${scale})`;
    }

    animate() {
        // TOUJOURS continuer l'animation, même si souris sortie
        const now = Date.now();
        const deltaTime = (now - (this.lastTime || now)) / 16.67;
        this.lastTime = now;

        // Mettre à jour toutes les particules
        this.particles.forEach(particle => {
            this.updateParticle(particle, deltaTime);
        });

        // TOUJOURS continuer l'animation
        requestAnimationFrame(() => this.animate());
    }

    // Méthodes de contrôle public
    setRepulsionRadius(radius) {
        this.repulsionRadius = radius;
        console.log(`🧲 Rayon de répulsion: ${radius}px`);
    }

    setRepulsionStrength(strength) {
        this.repulsionStrength = strength;
        console.log(`⚡ Force de répulsion: ${strength}`);
    }

    setReturnSpeed(speed) {
        this.returnSpeed = speed;
        console.log(`🔄 Vitesse de retour: ${speed}`);
    }

    // Activer/désactiver l'effet
    enable() {
        this.isActive = true;
        console.log('🧲 Répulsion activée');
    }

    disable() {
        this.isActive = false;
        console.log('🧲 Répulsion désactivée');
    }

    // Régénérer les particules (utile pour le responsive)
    regenerateParticles() {
        this.particles = [];
        this.createParticles();
    }

    // Nettoyage
    destroy() {
        const particlesContainer = document.querySelector('#particles');
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }
        this.particles = [];
        console.log('🧹 Système magnétique nettoyé');
    }
}

// Fonction utilitaire pour intégrer facilement
export function initializeMagneticParticles() {
    // Attendre que le DOM soit prêt
    if (document.querySelector('#particles')) {
        const magneticSystem = new MagneticParticleSystem();

        // Exposer globalement pour le contrôle
        window.magneticParticles = magneticSystem;

        // Réagir au redimensionnement
        window.addEventListener('resize', () => {
            setTimeout(() => magneticSystem.regenerateParticles(), 100);
        });

        return magneticSystem;
    } else {
        console.warn('⚠️ Container #particles non trouvé pour les particules magnétiques');
        return null;
    }
}

// Configuration personnalisable
export const MAGNETIC_CONFIG = {
    RADIUS_SMALL: 80,
    RADIUS_MEDIUM: 150,
    RADIUS_LARGE: 250,

    STRENGTH_WEAK: 50,
    STRENGTH_MEDIUM: 100,
    STRENGTH_STRONG: 200,

    SPEED_SLOW: 0.02,
    SPEED_MEDIUM: 0.05,
    SPEED_FAST: 0.1
};