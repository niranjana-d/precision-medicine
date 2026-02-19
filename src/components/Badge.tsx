
import React from 'react';

interface BadgeProps {
    risk: string;
    severity: string;
}

const Badge: React.FC<BadgeProps> = ({ risk, severity }) => {
    let colorClass = "bg-gray-100 text-gray-800";

    if (risk === "Safe") colorClass = "bg-green-100 text-green-800 border-green-200";
    else if (risk === "Adjust Dosage") colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
    else if (risk === "Toxic" || risk === "Ineffective") colorClass = "bg-red-100 text-red-800 border-red-200";
    else if (risk === "Unknown") colorClass = "bg-gray-100 text-gray-800 border-gray-200";

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
            {risk} • {severity} Severity
        </span>
    );
};

export default Badge;
