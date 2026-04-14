"use client";

import React, { useState, useEffect } from 'react';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import Sidebar from './Sidebar';
import OfflineIndicator from '@/components/OfflineIndicator';

const Layout = ({ 
  children, 
  fullWidth = false,
  noPadding = false 
}: { 
  children: React.ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-medical-bg flex font-sans selection:bg-primary-100 selection:text-primary-600">
      {/* Global Offline Alerts */}
      <OfflineIndicator />
      
      {/* Desktop Sidebar (Fixed) & Mobile Drawer */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Viewport */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-500">
        
        {/* Mobile-Only Header */}
        <MobileHeader toggleSidebar={toggleSidebar} />
        
        {/* Scrollable Content Area */}
        <main className={`flex-1 ${!noPadding ? 'pt-20 pb-28 lg:pt-0 lg:pb-0' : ''}`}>
          <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 md:py-16'} ${!noPadding ? 'space-y-12' : ''}`}>
            {children}
          </div>
        </main>
        
        {/* Mobile-Only Bottom Navigation */}
        <MobileBottomNav />

        {/* Desktop-Only Footer (Simple) */}
        <footer className="hidden lg:block border-t border-slate-100 bg-white py-10 px-12 text-left">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                    System Architecture
                </p>
                <p className="text-sm text-slate-600 font-semibold uppercase tracking-widest">
                    © 2026 Health AI • Clinical Integrity Protocol 
                </p>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cloud Sync Active</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-xl border border-primary-100">
                    <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse shadow-sm shadow-primary-400/50"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Secure Protocol v4.1</span>
                </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
