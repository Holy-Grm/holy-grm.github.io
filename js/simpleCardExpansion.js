// js/simpleCardExpansion.js - Version ultra-simple

export class SimpleCardExpansion {
    constructor(router) {
        this.router = router;
        this.init();
        this.setupRouter();
    }

    init() {
        this.setupCards();
    }

    setupRouter() {
        // S'abonner aux changements de page
        this.router.addObserver((type, data) => {
            if (type === 'pageChange') {
                setTimeout(() => {
                    this.setupCards();
                }, 200);
            }
        });
    }

    setupCards() {
        // Nettoyer les anciennes cartes
        document.querySelectorAll('.card-expandable').forEach(card => {
            this.resetCard(card);
        });

        // Configurer selon la page actuelle
        const currentPage = this.router.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.setupSkillCards();
                break;
            case 'projects':
                this.setupProjectCards();
                break;
            case 'about':
                this.setupTimelineCards();
                break;
        }
    }

    setupSkillCards() {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            this.makeCardExpandable(card, this.getSkillCardConfig(index));
        });
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            this.makeCardExpandable(card, this.getProjectCardConfig(index));
        });
    }

    setupTimelineCards() {
        const timelineEvents = document.querySelectorAll('.timeline-event');
        timelineEvents.forEach((event, index) => {
            const content = event.querySelector('.timeline-content');
            if (content) {
                this.makeCardExpandable(content, this.getTimelineCardConfig(index));
            }
        });
    }

    makeCardExpandable(cardElement, config) {
        // Ajouter la classe expandable
        cardElement.classList.add('card-expandable');
        cardElement.style.position = 'relative';

        // Créer la section du bas
        const bottomSection = document.createElement('div');
        bottomSection.className = 'card-bottom-section';
        bottomSection.innerHTML = this.createBottomContent(config);

        // Ajouter l'indicateur visuel (optionnel)
        const hint = document.createElement('div');
        hint.className = 'expand-hint';
        hint.textContent = '▼';

        cardElement.appendChild(bottomSection);
        cardElement.appendChild(hint);

        // Event listener pour toggle
        cardElement.addEventListener('click', (e) => {
            // Éviter le toggle si on clique sur le bouton
            if (e.target.closest('.simple-discover-btn')) {
                return;
            }
            
            e.preventDefault();
            this.toggleCard(cardElement);
        });
    }

    createBottomContent(config) {
        const currentLang = this.router.getCurrentLang();
        const buttonText = config.buttonText[currentLang] || config.buttonText.en;
        
        return `
            <div class="card-bottom-content">
                <button class="simple-discover-btn" 
                        onclick="window.simpleCardExpansion.handleAction('${config.action}', '${config.destination}')">
                    ${buttonText}
                </button>
            </div>
        `;
    }

    toggleCard(cardElement) {
        // Fermer toutes les autres cartes
        document.querySelectorAll('.card-expandable.expanded').forEach(card => {
            if (card !== cardElement) {
                card.classList.remove('expanded');
            }
        });

        // Toggle la carte actuelle
        cardElement.classList.toggle('expanded');
    }

    resetCard(cardElement) {
        cardElement.classList.remove('card-expandable', 'expanded');
        
        const bottomSection = cardElement.querySelector('.card-bottom-section');
        const hint = cardElement.querySelector('.expand-hint');
        
        if (bottomSection) bottomSection.remove();
        if (hint) hint.remove();
    }

    handleAction(action, destination) {
        switch (action) {
            case 'navigate':
                this.router.navigateTo(destination);
                break;
            case 'external':
                if (destination && destination !== '#') {
                    window.open(destination, '_blank');
                }
                break;
            case 'download':
                this.handleDownload(destination);
                break;
            case 'email':
                window.location.href = destination;
                break;
            default:
                console.log('Action:', action, 'Destination:', destination);
        }
    }

    handleDownload(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = '';
        link.click();
    }

    // Configurations pour chaque type de carte
    getSkillCardConfig(index) {
        const configs = [
            // Data Science
            {
                buttonText: { 
                    en: 'View Projects', 
                    fr: 'Voir les projets' 
                },
                action: 'navigate',
                destination: 'projects'
            },
            // AI
            {
                buttonText: { 
                    en: 'Explore AI', 
                    fr: 'Explorer l\'IA' 
                },
                action: 'navigate',
                destination: 'projects'
            },
            // Cybersecurity
            {
                buttonText: { 
                    en: 'Security Projects', 
                    fr: 'Projets sécurité' 
                },
                action: 'navigate',
                destination: 'projects'
            }
        ];

        return configs[index] || configs[0];
    }

    getProjectCardConfig(index) {
        const configs = [
            // Master Excel
            {
                buttonText: { 
                    en: 'View Demo', 
                    fr: 'Voir la démo' 
                },
                action: 'external',
                destination: '#' // Remplacez par votre lien
            },
            // Visual Automation
            {
                buttonText: { 
                    en: 'Live Demo', 
                    fr: 'Démo en direct' 
                },
                action: 'external',
                destination: '#' // Remplacez par votre lien
            },
            // Excel VBA
            {
                buttonText: { 
                    en: 'Download VBA', 
                    fr: 'Télécharger VBA' 
                },
                action: 'download',
                destination: '#' // Remplacez par votre fichier
            },
            // Sudoku Solver
            {
                buttonText: { 
                    en: 'Source Code', 
                    fr: 'Code source' 
                },
                action: 'external',
                destination: '#' // Remplacez par GitHub
            },
            // Database
            {
                buttonText: { 
                    en: 'View Schema', 
                    fr: 'Voir le schéma' 
                },
                action: 'external',
                destination: '#' // Remplacez par votre lien
            },
            // Data Structures
            {
                buttonText: { 
                    en: 'Source Code', 
                    fr: 'Code source' 
                },
                action: 'external',
                destination: '#' // Remplacez par GitHub
            }
        ];

        return configs[index] || {
            buttonText: { 
                en: 'Learn More', 
                fr: 'En savoir plus' 
            },
            action: 'external',
            destination: '#'
        };
    }

    getTimelineCardConfig(index) {
        const configs = [
            // Stage BRP (premier dans la timeline)
            {
                buttonText: { 
                    en: 'Contact Me', 
                    fr: 'Me contacter' 
                },
                action: 'email',
                destination: 'mailto:oligermain15@gmail.com?subject=À propos de votre stage BRP'
            }
        ];

        return configs[index] || {
            buttonText: { 
                en: 'More Info', 
                fr: 'Plus d\'infos' 
            },
            action: 'email',
            destination: 'mailto:oligermain15@gmail.com'
        };
    }

    // Méthode pour mettre à jour les textes lors d'un changement de langue
    updateLanguage() {
        document.querySelectorAll('.card-expandable').forEach(card => {
            const bottomSection = card.querySelector('.card-bottom-section');
            if (bottomSection) {
                // Récréer le contenu avec la nouvelle langue
                const cardType = this.getCardType(card);
                const index = this.getCardIndex(card);
                const config = this.getConfigForCard(cardType, index);
                
                bottomSection.innerHTML = this.createBottomContent(config);
            }
        });
    }

    getCardType(cardElement) {
        if (cardElement.classList.contains('skill-card') || cardElement.closest('.skill-card')) {
            return 'skill';
        }
        if (cardElement.classList.contains('project-card') || cardElement.closest('.project-card')) {
            return 'project';
        }
        if (cardElement.classList.contains('timeline-content') || cardElement.closest('.timeline-event')) {
            return 'timeline';
        }
        return 'unknown';
    }

    getCardIndex(cardElement) {
        const type = this.getCardType(cardElement);
        let selector;
        
        switch (type) {
            case 'skill':
                selector = '.skill-card';
                break;
            case 'project':
                selector = '.project-card';
                break;
            case 'timeline':
                selector = '.timeline-event';
                break;
            default:
                return 0;
        }

        const cards = Array.from(document.querySelectorAll(selector));
        const targetCard = type === 'timeline' ? cardElement.closest('.timeline-event') : cardElement;
        return cards.indexOf(targetCard);
    }

    getConfigForCard(type, index) {
        switch (type) {
            case 'skill':
                return this.getSkillCardConfig(index);
            case 'project':
                return this.getProjectCardConfig(index);
            case 'timeline':
                return this.getTimelineCardConfig(index);
            default:
                return {
                    buttonText: { en: 'Learn More', fr: 'En savoir plus' },
                    action: 'external',
                    destination: '#'
                };
        }
    }

    // Cleanup
    destroy() {
        document.querySelectorAll('.card-expandable').forEach(card => {
            this.resetCard(card);
        });
    }
}

// Exposer globalement pour les onclick
window.simpleCardExpansion = null;