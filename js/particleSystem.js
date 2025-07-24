// particleSystem.js - Système de particules et effets visuels
import { CONFIG } from './config.js';

// Classe pour une particule individuelle de souris
class MouseParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.particles.particleSize;
        this.life = 1.0;
        this.decay = Math.random() * CONFIG.particles.particleDecay.max + CONFIG.particles.particleDecay.min;

        // Direction aléatoire pour l'étoile filante
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (CONFIG.particles.particleSpeed.max - CONFIG.particles.particleSpeed.min) + CONFIG.particles.particleSpeed.min;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.color = 'rgba(64, 224, 208, ';
        this.createElement();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.style.cssText = `
            position: fixed;
            width: ${this.size}px;
            height: ${this.size}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${this.x}px;
            top: ${this.y}px;
        `;

        this.updateStyle();
        document.body.appendChild(this.element);
    }

    updateStyle() {
        const alpha = this.life;
        this.element.style.background = `${this.color}${alpha})`;
        this.element.style.boxShadow = `0 0 ${this.size * 2}px ${this.color}${alpha * 0.8})`;
        this.element.style.transform = `scale(${this.life})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.updateStyle();

        return this.life <= 0 ||
            this.x < -20 || this.x > window.innerWidth + 20 ||
            this.y < -20 || this.y > window.innerHeight + 20;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Classe principale pour le système de particules de souris
class MouseParticleSystem {
    constructor() {
        this.particles = [];
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.enabled = true;
        this.distanceCounter = 0;

        this.checkMobileDevice();
        this.bindEvents();
        this.animate();
    }

    checkMobileDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            this.enabled = false;
            console.log('📱 Particules souris désactivées sur mobile');
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            if (!this.enabled) return;

            const deltaX = e.clientX - this.lastMouseX;
            const deltaY = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            this.distanceCounter += distance;

            if (this.distanceCounter >= CONFIG.particles.mouseParticleThreshold) {
                this.createParticle(e.clientX, e.clientY);
                this.distanceCounter = 0;
            }

            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });
    }

    createParticle(x, y) {
        const particle = new MouseParticle(x, y);
        this.particles.push(particle);

        if (this.particles.length > CONFIG.particles.maxMouseParticles) {
            const excess = this.particles.length - CONFIG.particles.maxMouseParticles;
            for (let i = 0; i < excess; i++) {
                this.particles[i].destroy();
            }
            this.particles.splice(0, excess);
        }
    }

    animate() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const isDead = particle.update();

            if (isDead) {
                particle.destroy();
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
        this.particles.forEach(particle => particle.destroy());
        this.particles = [];
    }

    destroy() {
        this.disable();
    }
}

// Classe principale pour tous les effets de particules
export class ParticleSystem {
    constructor() {
        this.mouseParticleSystem = null;
        this.backgroundParticles = [];

        this.init();
    }

    init() {
        this.createBackgroundParticles();
        this.initializeMouseParticles();
        this.setupMouseEffect();
    }

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

        console.log(`✨ ${CONFIG.particles.count} particules de fond créées`);
    }

    initializeMouseParticles() {
        if (!this.mouseParticleSystem) {
            this.mouseParticleSystem = new MouseParticleSystem();
            console.log('✨ Effet particules souris activé !');
        }
    }

    setupMouseEffect() {
        // Effet de mouvement de souris pour la section héro
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

    // Méthodes de contrôle
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

    // Cleanup
    destroy() {
        if (this.mouseParticleSystem) {
            this.mouseParticleSystem.destroy();
        }

        // Nettoyer les particules de fond
        const particlesContainer = document.querySelector(CONFIG.selectors.particles);
        if (particlesContainer) {
            particlesContainer.innerHTML = '';
        }

        this.backgroundParticles = [];
    }

    // Méthodes utilitaires
    recreateBackgroundParticles() {
        this.createBackgroundParticles();
    }

    setMouseParticleEnabled(enabled) {
        if (enabled) {
            this.enableMouseParticles();
        } else {
            this.disableMouseParticles();
        }
    }
}