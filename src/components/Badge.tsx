
import React from 'react';

interface BadgeProps {
    risk: string;
    severity: string;
}

const Badge: React.FC<BadgeProps> = ({ risk, severity }) => {
    let bgClass = "bg-slate-500/20 text-slate-300 border-slate-500/30";
    let dotColor = "bg-slate-400";
    let glowClass = "";

    if (risk === "Safe") {
        bgClass = "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
        dotColor = "bg-emerald-400";
        glowClass = "shadow-emerald-500/20";
    } else if (risk === "Adjust Dosage" || risk === "Reduced Effect") {
        bgClass = "bg-amber-500/15 text-amber-300 border-amber-500/30";
        dotColor = "bg-amber-400";
        glowClass = "shadow-amber-500/20";
    } else if (risk === "Toxic" || risk === "Ineffective") {
        bgClass = "bg-red-500/15 text-red-300 border-red-500/30";
        dotColor = "bg-red-400";
        glowClass = "shadow-red-500/20";
    }

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border shadow-lg ${bgClass} ${glowClass}`}>
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span>{risk}</span>
            <span className="text-xs opacity-60 font-normal">• {severity}</span>
        </div>
    );
};

export default Badge;
