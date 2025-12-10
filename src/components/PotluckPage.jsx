import React, { useState, useEffect } from "react";
import { Utensils, Calendar, Gift, Sparkles } from "lucide-react";

export const PotluckPage = () => {
    const participantsList = [
        "Audrey",
        "Oli",
        "Fred",
        "Chlochlo",
        "Zach",
        "Marie-Garance",
    ];

    // Initialize state from local storage or default
    const [contributions, setContributions] = useState(() => {
        const saved = localStorage.getItem("sushi-noel-2025");
        if (saved) {
            return JSON.parse(saved);
        }
        const initial = {};
        participantsList.forEach((p) => (initial[p] = ""));
        return initial;
    });

    // Save to local storage whenever contributions change
    useEffect(() => {
        localStorage.setItem("sushi-noel-2025", JSON.stringify(contributions));
    }, [contributions]);

    const handleChange = (participant, value) => {
        setContributions((prev) => ({
            ...prev,
            [participant]: value,
        }));
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-rose-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-2000" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
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
                                    <th className="py-4 px-4 text-slate-400 font-medium tracking-wider uppercase text-sm">Participant</th>
                                    <th className="py-4 px-4 text-slate-400 font-medium tracking-wider uppercase text-sm w-2/3">Contribution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {participantsList.map((participant) => (
                                    <tr key={participant} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-200 font-bold shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                                                    {participant[0]}
                                                </div>
                                                <span className="font-semibold text-slate-200 text-lg">{participant}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={contributions[participant]}
                                                    onChange={(e) => handleChange(participant, e.target.value)}
                                                    placeholder="Qu'est-ce qu'on mange ?"
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900/80 transition-all shadow-inner"
                                                />
                                                {contributions[participant] && (
                                                    <Gift className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                )}
                                            </div>
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
