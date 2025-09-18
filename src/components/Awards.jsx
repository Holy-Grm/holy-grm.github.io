import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Award, Calendar, MapPin } from "lucide-react"

export function Awards() {
  const awards = [

            {
      title: "Expostage BRP 2025",
      description: "Prix pour la présentation ayant obtenu la meilleure appréciation globale.",
      year: "Été 2025",
      icon: Award
    },
    {
      title: "Ville de Sherbrooke 2023",
      description: "Bravogramme pour avoir développé un outil de travail efficace.",
      year: "Automne 2023", 
      icon: Award
    }
  ]

  return (
    <section id="awards" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Reconnaissance</Badge>
          <h2 className="mb-6">
            Prix et distinctions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Récompenses et reconnaissances obtenues pour mes contributions et réalisations professionnelles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {awards.map((award, index) => {
            const IconComponent = award.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{award.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {award.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{award.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{award.organization}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}