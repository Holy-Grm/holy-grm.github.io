import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Spline, Scissors, Brain } from "lucide-react"
import { Link } from "react-router-dom"

export function ToolsPage() {
    const tools = [
        {
            title: "PDF Merge",
            description: "Fusionner plusieurs fichiers PDF en un seul document.",
            icon: <Spline className="h-6 w-6" />,
            link: "/pdfmerge",
            color: "bg-blue-500/10 text-blue-500"
        },
        {
            title: "PDF Trim",
            description: "Découper et extraire des pages de vos fichiers PDF.",
            icon: <Scissors className="h-6 w-6" />,
            link: "/pdfTrim",
            color: "bg-red-500/10 text-red-500"
        },
        {
            title: "Duplicate Find",
            description: "Comparer deux listes pour trouver les doublons, ajouts et suppressions.",
            icon: <Spline className="h-6 w-6" />,
            link: "/duplicatefind",
            color: "bg-green-500/10 text-green-500"
        },
        {
            title: "Générateur de Quiz",
            description: "Créez et jouez à des quiz interactifs.",
            icon: <Brain className="h-6 w-6" />,
            link: "/quizmaster",
            color: "bg-purple-500/10 text-purple-500"
        }
    ]

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4">Utilitaires</Badge>
                    <h1 className="text-4xl font-bold mb-4">Boîte à Outils</h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Une collection d'outils simples et efficaces pour vos tâches quotidiennes.
                        Accessible uniquement via lien direct.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {tools.map((tool, index) => (
                        <Link key={index} to={tool.link}>
                            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-muted">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color}`}>
                                        {tool.icon}
                                    </div>
                                    <CardTitle>{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
