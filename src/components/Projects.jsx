import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ExternalLink, Github } from "lucide-react"
import { useState, useEffect } from "react"

// Import des images locales
import img_masterexcel from '../img/img_masterexcel.jpg'
import img_automatisationvisuelle from '../img/img_automatisationvisuelle.jpg'
import img_excelvba from '../img/img_excelvba.jpg'
import img_pixelbot from '../img/img_pixelbot.jpg'
import img_solveursudoku from '../img/img_solveursudoku.jpg'
import img_basededonnees from '../img/img_basededonnees.jpg'
import img_structuresdonnees from '../img/img_structuresdonnees.jpg'

export function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [api, setApi] = useState()
  const [current, setCurrent] = useState(0)

  // Auto-scroll effect
  useEffect(() => {
    if (!api) return

    const intervalId = setInterval(() => {
      api.scrollNext()
    }, 5000) // 5 seconds

    return () => clearInterval(intervalId)
  }, [api])

  // Track current slide
  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const projects = [
    {
      title: "Master Excel",
      description: "Développement de projets avancés impliquant la consolidation de plus de 25 fichiers Excel avec tableaux de bord dynamiques et analyses automatisées.",
      detailedDescription: "Ce projet consistait à consolider et analyser des données provenant de multiples sources Excel. J'ai créé des tableaux de bord interactifs avec des graphiques dynamiques, des tableaux croisés dynamiques avancés et des systèmes d'analyse automatisés pour optimiser les processus de reporting.",
      image: img_masterexcel,
      technologies: ["Tableaux croisés dynamiques", "Dashboards", "VBA"]
    },
    {
      title: "Automatisation visuelle",
      description: "Transforme les données CSV/Excel en graphiques visuels pour la chaîne de production d'usine avec génération automatique de diagrammes.",
      detailedDescription: "Application qui automatise la transformation de données de production en visualisations graphiques. J'ai utilisé Graphviz pour générer des diagrammes de flux de production en temps réel, permettant aux gestionnaires d'usine de visualiser instantanément le déroulement d'une chaîne de production.",
      image: img_automatisationvisuelle,
      technologies: ["HTML", "CSS", "Graphviz DOT", "JavaScript"]
    },
    {
      title: "Excel VBA",
      description: "Développement d'outils Excel automatisés avec interface utilisateur intégrée pour la sélection dynamique de fichiers et le traitement de données.",
      detailedDescription: "Suite d'outils VBA avancés avec interfaces utilisateur personnalisées. Inclut des systèmes de sélection de fichiers dynamiques, des macros d'automatisation de processus répétitifs et l'intégration avec Python pour les analyses de données complexes.",
      image: img_excelvba,
      technologies: ["VBA", "Automation"]
    },
    {
      title: "PixelBot",
      description: "Automatise les tâches visuelles répétitives grâce à la reconnaissance d'images en temps réel avec des raccourcis clavier personnalisés.",
      detailedDescription: "Bot d'automatisation avancé utilisant la reconnaissance d'images pour automatiser des tâches répétitives sur ordinateur. Système de configuration JSON flexible, détection d'images en temps réel, et intégration de raccourcis clavier personnalisés pour une utilisation optimale.",
      image: img_pixelbot,
      technologies: ["Python", "Automatisation", "JSON"]
    },
    {
      title: "Solveur de Sudoku",
      description: "Algorithme de résolution de Sudoku développé comme projet universitaire.",
      detailedDescription: "Implémentation d'un algorithme de résolution de Sudoku optimisé en C++. J'ai utilisé des techniques de backtracking avec optimisations heuristiques, capable de résoudre des grilles de difficulté variable en temps optimal. Projet développé dans le cadre de cours d'algorithmes avancés.",
      image: img_solveursudoku,
      technologies: ["C++", "Algorithmes", "Projet Universitaire"]
    },
    {
      title: "Base de données relationnelle",
      description: "Conception et implémentation d'une base de données relationnelle complète pour une chaîne de restaurants avec optimisations de performance.",
      detailedDescription: "Projet complet de conception de base de données pour une chaîne de restaurants. Inclut la modélisation UML complète, l'implémentation PostgreSQL avec contraintes d'intégrité, les procédures stockées et l'optimisation des requêtes pour de gros volumes de données.",
      image: img_basededonnees,
      technologies: ["PostgreSQL", "UML", "SQL"]
    },
    {
      title: "Structures de données avancées",
      description: "Implémentation complète de structures de données complexes from scratch incluant des optimisations de performance personnalisées.",
      detailedDescription: "Implémentation from scratch de structures de données avancées en C++: deques double-ended, skip lists avec probabilités optimisées, arbres binaires de recherche équilibrés. Chaque structure inclut des tests de performance et des optimisations mémoire spécifiques.",
      image: img_structuresdonnees,
      technologies: ["C++", "Algorithmes", "Performance"]
    }
  ]

  return (
    <section id="projects" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Mes réalisations</Badge>
          <h2 className="mb-6">
            Projets dont je suis fier
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Voici quelques-uns de mes projets récents qui démontrent mes compétences en développement, 
            en analyse de données et en résolution de problèmes.
          </p>
        </div>

        {/* Horizontal Carousel with Auto-scroll */}
        <div className="relative w-full">
          <Carousel 
            className="w-full"
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
              skipSnaps: false,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {projects.map((project, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-[1.02] h-full bg-card text-card-foreground rounded-lg">
                        <div className="relative overflow-hidden">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        
                        <div className="p-6">
                          <h3 className="mb-3 group-hover:text-primary transition-colors font-semibold text-xl">{project.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {project.technologies.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.technologies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>

                    
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl mb-2">{project.title}</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="relative overflow-hidden rounded-lg">
                          <ImageWithFallback
                            src={project.image}
                            alt={project.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                        
                        <DialogDescription className="text-base leading-relaxed">
                          {project.detailedDescription}
                        </DialogDescription>
                        
                        <div>
                          <h4 className="font-semibold mb-3">Technologies utilisées</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir le projet
                          </Button>
                          <Button variant="outline">
                            <Github className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          {/* Progress indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  current === index ? 'bg-primary w-8' : 'bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}