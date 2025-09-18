import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-medium">
          Olivier Germain
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <button 
            onClick={() => scrollToSection('about')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            À propos
          </button>
          <button 
            onClick={() => scrollToSection('skills')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            Compétences
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            Projets
          </button>
          <button 
            onClick={() => scrollToSection('awards')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            Prix
          </button>
          <button 
            onClick={() => scrollToSection('hobbies')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            Loisirs
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="hover:text-primary transition-colors whitespace-nowrap px-3 py-2"
          >
            Contact
          </button>
          <Button onClick={() => scrollToSection('contact')} className="whitespace-nowrap">
            Offrir un stage
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-left hover:text-primary transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection('skills')}
              className="text-left hover:text-primary transition-colors"
            >
              Compétences
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-left hover:text-primary transition-colors"
            >
              Projets
            </button>
            <button 
              onClick={() => scrollToSection('awards')}
              className="text-left hover:text-primary transition-colors"
            >
              Prix
            </button>
            <button 
              onClick={() => scrollToSection('hobbies')}
              className="text-left hover:text-primary transition-colors"
            >
              Loisirs
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-left hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Button onClick={() => scrollToSection('contact')} className="self-start">
              Offrir un stage
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}