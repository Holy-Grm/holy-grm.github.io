// cardExpansionManager.js - Gestionnaire d'expansion de cartes amélioré
export class CardExpansionManager {
    constructor(router) {
        this.router = router;
        this.expandedCard = null;
        this.cardSelectors = [
            '.skill-card',
            '.project-card', 
            '.timeline-content'
        ];

        this.init();
    }

    init() {
        this.setupCardClickHandlers();
        this.setupPageChangeListener();
        this.setupOutsideClickHandler();
        
        console.log('🃏 Card Expansion Manager initialisé');
    }

    setupCardClickHandlers() {
        // Délégation d'événements pour gérer les cartes ajoutées dynamiquement
        document.addEventListener('click', (e) => {
            const clickedCard = this.findCardElement(e.target);
            
            if (clickedCard) {
                e.preventDefault();
                e.stopPropagation();
                this.handleCardClick(clickedCard);
            }
        });
    }

    findCardElement(target) {
        // Trouver la carte parente la plus proche
        for (const selector of this.cardSelectors) {
            const card = target.closest(selector);
            if (card) {
                return card;
            }
        }
        return null;
    }

    handleCardClick(clickedCard) {
        // Si la carte cliquée est déjà expandée, la fermer
        if (this.expandedCard === clickedCard) {
            this.collapseCard(clickedCard);
            this.expandedCard = null;
            return;
        }

        // Fermer la carte actuellement expandée s'il y en a une
        if (this.expandedCard) {
            this.collapseCard(this.expandedCard);
        }

        // Expandre la nouvelle carte
        this.expandCard(clickedCard);
        this.expandedCard = clickedCard;
    }

    expandCard(card) {
        card.classList.add('expanded');
        
        // Animation optionnelle
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
            if (card.classList.contains('expanded')) {
                card.style.transform = '';
            }
        }, 300);

        console.log('📖 Carte expandée:', card.className);
    }

    collapseCard(card) {
        card.classList.remove('expanded');
        
        // Animation de fermeture
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);

        console.log('📘 Carte fermée:', card.className);
    }

    collapseAllCards() {
        // Fermer toutes les cartes expandées
        this.cardSelectors.forEach(selector => {
            document.querySelectorAll(`${selector}.expanded`).forEach(card => {
                this.collapseCard(card);
            });
        });
        
        this.expandedCard = null;
        console.log('📚 Toutes les cartes fermées');
    }

    setupPageChangeListener() {
        // Écouter les changements de page via le router
        if (this.router) {
            this.router.addObserver((type, data) => {
                if (type === 'pageChange') {
                    this.collapseAllCards();
                    console.log('🔄 Cartes fermées lors du changement de page:', data.newPage);
                }
            });
        }

        // Fallback avec MutationObserver pour détecter les changements de page
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    mutation.target.classList.contains('page')) {
                    
                    if (mutation.target.classList.contains('active')) {
                        // Une nouvelle page devient active
                        setTimeout(() => this.collapseAllCards(), 100);
                    }
                }
            });
        });

        // Observer tous les éléments de page
        document.querySelectorAll('.page').forEach(page => {
            observer.observe(page, { attributes: true });
        });
    }

    setupOutsideClickHandler() {
        // Fermer les cartes si on clique en dehors (optionnel)
        document.addEventListener('click', (e) => {
            // Vérifier si le clic est en dehors de toute carte
            const clickedCard = this.findCardElement(e.target);
            
            if (!clickedCard && this.expandedCard) {
                // Le clic est en dehors d'une carte, mais on peut vouloir garder la carte ouverte
                // Décommentez la ligne suivante si vous voulez fermer en cliquant à l'extérieur
                // this.collapseAllCards();
            }
        });
    }

    // Méthodes publiques pour contrôler les cartes
    expandCardById(cardId) {
        const card = document.getElementById(cardId);
        if (card && this.cardSelectors.some(selector => card.matches(selector))) {
            this.handleCardClick(card);
        }
    }

    expandCardBySelector(selector) {
        const card = document.querySelector(selector);
        if (card) {
            this.handleCardClick(card);
        }
    }

    isCardExpanded(card) {
        return card.classList.contains('expanded');
    }

    getCurrentExpandedCard() {
        return this.expandedCard;
    }

    // Méthodes pour ajouter/supprimer des types de cartes
    addCardSelector(selector) {
        if (!this.cardSelectors.includes(selector)) {
            this.cardSelectors.push(selector);
            console.log(`➕ Nouveau sélecteur de carte ajouté: ${selector}`);
        }
    }

    removeCardSelector(selector) {
        const index = this.cardSelectors.indexOf(selector);
        if (index > -1) {
            this.cardSelectors.splice(index, 1);
            console.log(`➖ Sélecteur de carte supprimé: ${selector}`);
        }
    }

    // Cleanup
    destroy() {
        this.collapseAllCards();
        console.log('🧹 Card Expansion Manager nettoyé');
    }
}

// Fonction utilitaire pour initialiser le gestionnaire globalement
export function initializeCardExpansion(router) {
    const manager = new CardExpansionManager(router);
    
    // Exposer globalement pour le debug
    window.cardExpansionManager = manager;
    
    return manager;
}