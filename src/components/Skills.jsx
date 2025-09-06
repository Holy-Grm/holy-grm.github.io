import { Badge } from "./ui/badge"

export function Skills() {
  const technologies = [
    "C++", "C#","Java", "Python", "Assembly", "HTML","CSS", "JavaScript", "React", "PostgreSQL",  "Figma", "Github", "Excel", "VBA", 
     "SQL", "Snowflake", "SAP"
  ]

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Compétences</Badge>
          <h2 className="mb-6">
            Technologies acquises
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            J'apprends en continue et j'améliore mes compétences sur des outils et technologies variés.
          </p>
        </div>

        {/* Technology Tags */}
        <div className="text-center">
          <h3 className="mb-8">Technologies et outils</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}