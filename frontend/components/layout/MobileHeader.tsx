"use client";

import React from 'react';
import { Menu, Activity, Bell, Search, User } from 'lucide-react';
import Link from 'next/link';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 lg:hidden animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between px-6 h-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2.5 rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-primary-400 transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary-400/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-xl">HealthAI</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <Link href="/profile" className="ml-1">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-primary-400 overflow-hidden">
                <User className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
