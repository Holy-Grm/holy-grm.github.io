import { Header } from "./components/Header"
import { Hero } from "./components/Hero"
import { About } from "./components/About"
import { Skills } from "./components/Skills"
import { Projects } from "./components/Projects"
import { Awards } from "./components/Awards"
import { Hobbies } from "./components/Hobbies"
import { Contact } from "./components/Contact"
import { Footer } from "./components/Footer"

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Awards />
        <Hobbies />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}