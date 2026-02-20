
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`glass-card overflow-hidden ${className}`}>
        {children}
    </div>
);

export default Card;
