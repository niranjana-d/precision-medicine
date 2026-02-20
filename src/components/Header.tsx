
import React from 'react';

const Header: React.FC = () => (
    <header className="relative border-b border-brand-500/20 py-5 mb-8">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500 to-transparent"></div>

        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Logo icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-glow flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">
                        Pharma<span className="text-brand-400">Guard</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">
                        AI-Powered Pharmacogenomic Risk Analysis
                    </p>
                </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-glow opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-glow"></span>
                </span>
                System Online
            </div>
        </div>
    </header>
);

export default Header;
