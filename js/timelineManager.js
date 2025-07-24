// timelineManager.js - Gestion de la timeline interactive
import { CONFIG } from './config.js';

export class TimelineManager {
    constructor(router) {
        this.router = router;
        this.currentYear = '2025';
        this.isActive = false;

        // S'abonner aux changements de page
        this.router.addObserver((type, data) => {
            if (type === 'pageChange') {
                if (data.newPage === 'about') {
                    this.initializeTimeline();
                } else {
                    this.deactivateTimeline();
                }
            }
        });
    }

    initializeTimeline() {
        // Attendre que le DOM soit prêt
        setTimeout(() => {
            if (this.hasTimelineElements()) {
                this.setupObserver();
                this.setupScrollHandlers();
                this.setupInteractions();
                this.addCustomStyles();
                this.isActive = true;
                console.log('📅 Timeline initialisée');
            }
        }, 100);
    }

    hasTimelineElements() {
        return document.querySelector('.timeline-container') !== null;
    }

    setupObserver() {
        const timelineObserverOptions = {
            threshold: CONFIG.timeline.observerThreshold,
            rootMargin: CONFIG.timeline.rootMargin
        };

        this.timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 100);
                }
            });
        }, timelineObserverOptions);

        // Observer tous les événements de la timeline
        const timelineEvents = document.querySelectorAll('.timeline-event');
        timelineEvents.forEach((event, index) => {
            event.dataset.delay = index;
            this.timelineObserver.observe(event);
        });
    }

    setupScrollHandlers() {
        this.scrollHandler = () => {
            if (!this.isActive) return;

            this.updateYearIndicator();
            this.updateTimelineParallax();
            this.updateTimelineFill();
        };

        window.addEventListener('scroll', this.scrollHandler);
    }

    updateYearIndicator() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        const yearIndicator = document.querySelector('.year-indicator');
        const timelineEvents = document.querySelectorAll('.timeline-event');

        let closestYear = '2025';
        let closestDistance = Infinity;

        timelineEvents.forEach(event => {
            const rect = event.getBoundingClientRect();
            const elementPosition = rect.top + window.scrollY;
            const distance = Math.abs(scrollPosition - elementPosition);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestYear = event.dataset.year;
            }
        });

        if (closestYear !== this.currentYear) {
            this.currentYear = closestYear;
            if (yearIndicator) {
                yearIndicator.style.opacity = '0';
                setTimeout(() => {
                    yearIndicator.textContent = this.currentYear;
                    yearIndicator.style.opacity = '0.3';
                }, 300);
            }
        }

        // Activer l'indicateur dans la zone de la timeline
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineContainer && yearIndicator) {
            const containerRect = timelineContainer.getBoundingClientRect();
            if (containerRect.top < window.innerHeight && containerRect.bottom > 0) {
                yearIndicator.classList.add('active');
            } else {
                yearIndicator.classList.remove('active');
            }
        }
    }

    updateTimelineParallax() {
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            const scrolled = window.scrollY;
            const yPos = -(scrolled * CONFIG.timeline.parallaxSpeed);
            timelineLine.style.transform = `translateX(-50%) translateY(${yPos}px)`;
        }
    }

    updateTimelineFill() {
        const timelineLine = document.querySelector('.timeline-line');
        const timelineContainer = document.querySelector('.timeline-container');

        if (!timelineLine || !timelineContainer) return;

        const containerRect = timelineContainer.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const scrollProgress = Math.max(0, Math.min(1,
            (window.innerHeight - containerRect.top) / (containerHeight + window.innerHeight)
        ));

        const gradientPercentage = scrollProgress * 100;
        timelineLine.style.background = `linear-gradient(180deg, 
            #40e0d0 0%, 
            #40e0d0 ${gradientPercentage}%, 
            rgba(64, 224, 208, 0.2) ${gradientPercentage}%, 
            rgba(64, 224, 208, 0.2) 100%)`;
    }

    setupInteractions() {
        this.addDotHoverEffects();
        this.addTimelineClickEvents();
        this.setupTitleAnimation();
    }

    addDotHoverEffects() {
        const dots = document.querySelectorAll('.timeline-dot');

        dots.forEach(dot => {
            const timelineEvent = dot.closest('.timeline-event');
            const content = timelineEvent?.querySelector('.timeline-content');

            if (content) {
                content.addEventListener('mouseenter', () => {
                    dot.style.transform = 'translateX(-50%) scale(1.5)';
                    dot.style.boxShadow = '0 0 0 10px rgba(64, 224, 208, 0.3), 0 0 40px rgba(64, 224, 208, 0.8)';
                });

                content.addEventListener('mouseleave', () => {
                    dot.style.transform = 'translateX(-50%) scale(1)';
                    dot.style.boxShadow = '0 0 0 5px rgba(64, 224, 208, 0.2), 0 0 20px rgba(64, 224, 208, 0.5)';
                });
            }
        });
    }

    addTimelineClickEvents() {
        const timelineContents = document.querySelectorAll('.timeline-content');

        timelineContents.forEach(content => {
            content.style.cursor = 'pointer';
            content.addEventListener('click', function() {
                const event = this.closest('.timeline-event');
                const rect = event.getBoundingClientRect();
                const absoluteTop = window.scrollY + rect.top;

                window.scrollTo({
                    top: absoluteTop - 150,
                    behavior: 'smooth'
                });
            });
        });
    }

    setupTitleAnimation() {
        const timelineTitle = document.querySelector('.timeline-container h2');
        if (timelineTitle) {
            const titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeInScale 1s ease-out';
                    }
                });
            }, { threshold: 0.5 });

            titleObserver.observe(timelineTitle);
        }
    }

    addCustomStyles() {
        if (!document.querySelector('#timeline-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'timeline-styles';
            styleSheet.textContent = `
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8) translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `;
            document.head.appendChild(styleSheet);
        }
    }

    deactivateTimeline() {
        this.isActive = false;

        // Nettoyer les event listeners
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }

        // Déconnecter l'observer
        if (this.timelineObserver) {
            this.timelineObserver.disconnect();
        }

        console.log('📅 Timeline désactivée');
    }

    // Méthodes publiques pour contrôler la timeline
    enable() {
        if (this.router.getCurrentPage() === 'about') {
            this.initializeTimeline();
        }
    }

    disable() {
        this.deactivateTimeline();
    }

    // Cleanup complet
    destroy() {
        this.deactivateTimeline();

        // Supprimer les styles personnalisés
        const timelineStyles = document.querySelector('#timeline-styles');
        if (timelineStyles) {
            timelineStyles.remove();
        }
    }
}