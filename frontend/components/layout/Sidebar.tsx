"use client";

import React from "react";
import {
  Home,
  MessageSquare,
  X,
  MapPin,
  User,
  Pill,
  Camera,
  Stethoscope,
  Activity,
  ChevronRight,
  Mic,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Medical Profile", icon: User, path: "/profile" },
    { name: "Voice Assistant", icon: Mic, path: "/voice" },
    { name: "AI Health Chat", icon: MessageSquare, path: "/chat" },
    { name: "Image Analysis", icon: Camera, path: "/diagnosis" },
    { name: "Prescriptions", icon: Pill, path: "/medication" },
    { name: "Video Consult", icon: Video, path: "/consultation" },
    { name: "Live Locator", icon: MapPin, path: "/location" },
    { name: "Doctor Portal", icon: Stethoscope, path: "/doctor" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-full w-72 bg-[#fcfdfe] border-r border-slate-100 transition-all duration-500 ease-in-out shadow-2xl lg:shadow-none
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0 opacity-100"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Branding Header */}
          <div className="p-10">
            <div className="flex items-center justify-between mb-2">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-11 h-11 bg-primary-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary-400/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 tracking-tight text-2xl leading-none">
                    Health<span className="text-primary-400">AI</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1.5 pl-0.5">
                    Care Protocol
                  </span>
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 lg:hidden active:scale-90 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar pb-10">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`
                    flex items-center justify-between px-6 py-4 rounded-2xl text-[13px] font-semibold transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-white text-primary-500 shadow-premium border border-slate-100"
                        : "text-slate-500 hover:bg-white hover:text-primary-400 hover:shadow-sm"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-500 ${isActive ? "text-primary-400 scale-110" : "text-slate-300 group-hover:text-primary-400 group-hover:scale-110"}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full shadow-sm shadow-primary-400/50"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
