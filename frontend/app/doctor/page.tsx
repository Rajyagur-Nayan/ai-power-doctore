"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import DoctorDashboard from "@/components/DoctorDashboard";
import { Stethoscope, ShieldCheck, Activity, ShieldAlert, ChevronRight } from "lucide-react";

import DoctorMeetingRequests from "@/components/DoctorMeetingRequests";

export default function DoctorPortalPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16 lg:mb-20 px-4 md:px-8">
            <div className="space-y-6 max-w-2xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Stethoscope className="w-4 h-4" />
                    <span>MD-Protocol Authorized</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-primary-900 tracking-tighter italic">
                    Doctor Portal 🧬
                </h1>
                <p className="text-medical-textSecondary text-lg md:text-xl leading-relaxed font-bold">
                    Localized high-fidelity healthcare management system. Manage active consultation queues, synchronized patient bio-logs, and issue verified digital prescriptions.
                </p>
            </div>
            
            <div className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] shadow-xl border border-primary-50 relative overflow-hidden group hover:translate-x-2 transition-all">
                <div className="relative z-10 flex flex-col items-end">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1 leading-none">Security Clearance</p>
                    <p className="text-xl font-black italic text-primary-900 tracking-tight leading-none mb-1">Level 4 Access</p>
                    <span className="text-[9px] font-black text-medical-green uppercase tracking-widest flex items-center gap-1.5 mt-2">
                        <span className="w-1.5 h-1.5 bg-medical-green rounded-full animate-pulse"></span>
                        ACTIVE PROTOCOL
                    </span>
                </div>
                <div className="relative z-10 w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-8 h-8 text-primary-500" />
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl"></div>
            </div>
        </div>

        {/* Live Active Meeting Requests */}
        <div className="px-4 md:px-8 mb-8">
           <DoctorMeetingRequests doctorId="DOC_DEMO_999" />
        </div>

        {/* Dashboard Core */}
        <div className="medical-card p-2 md:p-6 lg:p-10 bg-white shadow-2xl rounded-[3rem] border-none overflow-hidden hover:shadow-primary-500/5 transition-all duration-700 mx-4 md:mx-8">
           <DoctorDashboard />
        </div>

        {/* Status Activity */}
        <div className="pt-20 border-t border-medical-border flex items-center justify-between opacity-10 px-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-primary-900 italic">
                Clinical Core 9.2.1 • Matrix Sync
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-primary-900 italic">
                Secure Log 44.1 • Rural Protocol
            </div>
        </div>
      </div>
    </Layout>
  );
}
