"use client";

import React from 'react';
import { Home, Users, MessageSquare, User, Activity, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileBottomNav: React.FC = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Locator', icon: MapPin, path: '/location' },
        { name: 'AI Chat', icon: MessageSquare, path: '/chat' },
        { name: 'Profile', icon: User, path: '/profile' }
    ];

    return (
        <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/80 backdrop-blur-xl border border-slate-100 lg:hidden rounded-[2rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8">
            <div className="flex items-center justify-around h-20 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link 
                            key={item.name} 
                            href={item.path}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 active:scale-90 ${isActive ? 'text-primary-500' : 'text-slate-400 hover:text-primary-400'}`}
                        >
                            <div className={`relative p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-primary-50 scale-110 shadow-sm' : 'bg-transparent'}`}>
                                <item.icon className={`w-6 h-6 transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} />
                                {isActive && (
                                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-400 rounded-full border-2 border-white shadow-sm shadow-primary-400"></span>
                                )}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 text-primary-500' : 'opacity-0 translate-y-1'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
