import React from "react";
import { Utensils, Calendar, Sparkles } from "lucide-react";

export const PotluckPage = () => {
    // MODIFIER ICI : Ajoutez les plats entre les guillemets pour chaque personne
    const participants = [
        { name: "Audrey", dish: "" },
        { name: "Oli", dish: "" },
        { name: "Fred", dish: "" },
        { name: "Chlochlo", dish: "" },
        { name: "Zach", dish: "" },
        { name: "Marie-Garance", dish: "" },
    ];

    return (
        <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-rose-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 w-full max-w-3xl">
                {/* Header Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-purple-300 to-indigo-300 mb-4 font-display flex items-center justify-center gap-4">
                        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
                        Sushi Noël
                        <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-slate-300 text-lg">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Calendar className="w-5 h-5 text-rose-400" />
                            <span>29 Décembre 2025</span>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <Utensils className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-200">Menu du Potluck</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="py-4 px-4 text-slate-400 font-medium tracking-wider uppercase text-sm w-1/3">Participant</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium tracking-wider uppercase text-sm w-2/3">Qu'est-ce qu'on mange ?</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {participants.map((participant) => (
                                    <tr key={participant.name} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="font-semibold text-slate-200 text-lg">{participant.name}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            {participant.dish ? (
                                                <span className="text-indigo-200 font-medium text-lg">{participant.dish}</span>
                                            ) : (
                                                <span className="text-slate-600 italic">À déterminer...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
