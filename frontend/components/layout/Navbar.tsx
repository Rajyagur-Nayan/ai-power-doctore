"use client";

import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors lg:hidden active:scale-95"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-primary-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-400/30 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-2xl leading-none">+</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Health<span className="text-primary-400">AI</span>
            </h1>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-12">
          <div className="relative w-full group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
            </span>
            <input 
              type="text" 
              className="block w-full pl-12 pr-4 py-3 bg-slate-100/50 border border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-primary-400/5 focus:border-primary-400/20 text-sm transition-all duration-300 outline-none placeholder:text-slate-400" 
              placeholder="Search health records, doctors..." 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-primary-400 transition-all active:scale-95 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block mx-2"></div>
          
          <button className="flex items-center gap-3 p-1.5 pr-4 rounded-[1.25rem] bg-slate-50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-[0.98]">
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary-400 shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">Dr. Sam</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none">Admin Protocol</p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
