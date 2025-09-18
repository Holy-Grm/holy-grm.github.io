import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Music, Calendar, Users } from "lucide-react"

export function Hobbies() {
  const hobbies = [
    {
      title: "Musique",
      description: "Première trompette pour l'Orchestre Philharmonique de l'Université de Sherbrooke depuis 2018",
      icon: Music,
      details: [
        "Première trompette",
        "Orchestre Philharmonique UdeS",
        "Depuis 2018"
      ]
    }
  ]

  return (
    <section id="hobbies" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Passions</Badge>
          <h2 className="mb-6">
            Loisirs et intérêts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mes activités et passions en dehors du domaine professionnel qui enrichissent mon parcours personnel.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {hobbies.map((hobby, index) => {
            const IconComponent = hobby.icon
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl mb-3">{hobby.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                      {hobby.description}
                    </p>
                    
                    <div className="space-y-2">
                      {hobby.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="text-muted-foreground">{detail}</span>
                        </div>
                      ))}
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