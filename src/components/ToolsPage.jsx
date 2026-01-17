import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Spline, Scissors, Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import img_pdf_merge from "../img/preview_pdf_merge.png"
import img_pdf_trim from "../img/preview_pdf_trim.png"

export function ToolsPage() {
    const tools = [
        {
            title: "PDF Merge",
            description: "Fusionner plusieurs fichiers PDF en un seul document.",
            icon: <Spline className="h-6 w-6" />,
            link: "/pdfmerge",
            color: "bg-blue-500/10 text-blue-500",
            image: img_pdf_merge
        },
        {
            title: "PDF Trim",
            description: "Découper et extraire des pages de vos fichiers PDF.",
            icon: <Scissors className="h-6 w-6" />,
            link: "/pdfTrim",
            color: "bg-red-500/10 text-red-500",
            image: img_pdf_trim
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
                            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-muted relative overflow-hidden group">
                                {/* Background Image on Hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${tool.image})` }}
                                />

                                <CardHeader className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tool.color} bg-background/80 backdrop-blur-sm`}>
                                        {tool.icon}
                                    </div>
                                    <CardTitle>{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <CardDescription>
                                        {tool.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="flex justify-center gap-4">
                    <Link to="/">
                        <Button variant="outline">
                            <Home className="h-4 w-4 mr-2" />
                            Retour à l'accueil
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
