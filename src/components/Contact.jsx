import { Badge } from "./ui/badge"
import { Mail, MapPin, Linkedin } from "lucide-react"

export function Contact() {

  const contactInfo = [
    {
      icon: Mail,
      title: "Courriel",
      content: "oligermain15@gmail.com",
      description: "Écrivez-moi",
      link: "mailto:oligermain15@gmail.com",
      isClickable: true
    },

    {
      icon: Linkedin,
      title: "Linkedin",
      content: "www.linkedin.com/in/oligermain",
      description: "Connectons-nous",
      link: "https://www.linkedin.com/in/oligermain",
      isClickable: true
    },

    {
      icon: MapPin,
      title: "Ville",
      content: "Sherbrooke, Qc",
      description: "Disponible en personne et à distance",
      isClickable: false
    }
  ]

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Contactez-moi</Badge>
          <h2 className="mb-6">
            Travaillons ensemble
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vous avez un projet en tête ou simplement envie de discuter? N'hésitez pas à me contacter!
          </p>
        </div>

        {/* Contact Information */}
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h3 className="mb-6">Contact</h3>
              <p className="text-muted-foreground mb-8">
                Je suis toujours intéressé à discuter d'oppotunités de collaboration. Peu importe le sujet que vous avez en tête, écrivez-moi.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                
                if (info.isClickable) {
                  return (
                    <a 
                      key={index} 
                      href={info.link}
                      target={info.title === "Linkedin" ? "_blank" : "_self"}
                      rel={info.title === "Linkedin" ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    >
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1">{info.title}</h4>
                        <p className="font-medium mb-1">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </a>
                  )
                } else {
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="mb-1">{info.title}</h4>
                        <p className="font-medium mb-1">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
        </div>
      </div>
    </section>
  )
}