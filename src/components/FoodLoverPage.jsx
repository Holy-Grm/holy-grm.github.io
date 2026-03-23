import { useEffect } from "react";

export function FoodLoverPage() {
    useEffect(() => {
        // Redirection vers la page HTML complète
        window.location.href = "/FoodLover/index.html";
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Redirection vers FoodLover...</h1>
                <p className="text-muted-foreground">
                    Si la redirection ne fonctionne pas,
                    <a href="/FoodLover/index.html" className="text-primary underline ml-1">
                        cliquez ici
                    </a>
                </p>
            </div>
        </div>
    );
}
