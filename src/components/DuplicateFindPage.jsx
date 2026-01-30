import { useEffect } from "react";

export function DuplicateFindPage() {
    useEffect(() => {
        // Redirection vers la page HTML complète
        window.location.href = "/duplicate-find.html";
    }, []);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Redirection vers Duplicate Find...</h1>
                <p className="text-muted-foreground">
                    Si la redirection ne fonctionne pas,
                    <a href="/duplicate-find.html" className="text-primary underline ml-1">
                        cliquez ici
                    </a>
                </p>
            </div>
        </div>
    );
}
