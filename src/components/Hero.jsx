import { Button } from "./ui/button"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import photo from '../img/blancblanc.png';

export function Hero() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
                Bienvenue sur mon portfolio
              </span>
              <h1 className="mb-4">
                  Science des données | Intelligence artificielle | Cybersécurité

              </h1>
              <h2 className="text-muted-foreground">
                  Bonjour, je m'appelle Olivier !

              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg">
                Je suis étudiant au baccalauréat en sciences à l'Université de Sherbrooke 
                en informatique de gestion, programme coopératif.

              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button onClick={() => scrollToSection('projects')} size="lg">
                Mes projets
              </Button>
              <Button 
                variant="outline" 
                onClick={() => scrollToSection('contact')} 
                size="lg"
              >
                Contact
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-background shadow-2xl">
                <ImageWithFallback
                  src={photo}
                  alt="Olivier Germain - B.Sc. Informatique de Gestion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-16">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('about')}
            className="animate-bounce hover:text-primary"
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}