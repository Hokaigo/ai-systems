import React from 'react';
import { MenuIcon } from './Icons';

export default function Header({ isSidebarOpen, setIsSidebarOpen }) {
    return (
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#121212]/80 backdrop-blur-md z-10 border-b border-gray-800/60">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-xl hover:bg-gray-800 transition text-gray-300"
                >
                    <MenuIcon />
                </button>
                <span className="text-sm font-semibold opacity-70">Model: qwen2.5:1.5b-q4_0 | Strict Validation Engine</span>
            </div>
        </header>
    );
}