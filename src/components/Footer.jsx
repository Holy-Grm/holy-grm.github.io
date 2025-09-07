import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <h3 className="mb-4">Olivier Germain</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Étudiant B.Sc. Informatique de gestion
            </p>
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-primary"
                asChild
              >
                <a 
                  href="https://www.linkedin.com/in/oligermain"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:text-primary"
                asChild
              >
                <a 
                  href="mailto:oligermain15@gmail.com"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Liens</h4>
            <div className="space-y-3">
              <button 
                onClick={() => scrollToSection('about')}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('skills')}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Compétences
              </button>
              <button 
                onClick={() => scrollToSection('projects')}
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Projets
              </button>

            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4">Intérêts</h4>
            <div className="space-y-3 text-muted-foreground">
              <div>Data Science</div>
              <div>Intelligence artificielle</div>
              <div>Cybersécurité</div>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © {currentYear} Olivier Germain. Tout droits réversés.
          </div>
          
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={scrollToTop}
            className="hover:text-primary"
          >
            Retour en haut ↑
          </Button>
        </div>
      </div>
    </footer>
  )
}