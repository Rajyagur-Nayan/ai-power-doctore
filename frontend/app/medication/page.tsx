"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import Medication from "@/components/Medication";
import { Pill, Activity, ShieldAlert, HeartPulse, ChevronRight } from "lucide-react";

export default function MedicationPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-12 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-12">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-medical-green/10 text-medical-green rounded-full text-[9px] font-black uppercase tracking-widest">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>Temporal Adherence Synchronized</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-primary-900 tracking-tighter italic">
                    Med-Support 💊
                </h1>
                <p className="text-medical-textSecondary text-lg max-w-xl leading-relaxed font-bold">
                    Secure over-the-counter advice and persistent daily reminders to ensure strict biological adherence.
                </p>
            </div>
            <div className="medical-card p-6 bg-white shadow-xl flex items-center gap-6 border-none rounded-[2.5rem] group hover:translate-x-2 transition-transform">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
                    <HeartPulse className="w-7 h-7" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-900 leading-none mb-1">Clinic Vault</h4>
                    <p className="text-xl font-black italic text-primary-900 tracking-tighter font-sans leading-none">Verified</p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary-200 ml-4" />
            </div>
        </div>

        {/* Medication Core */}
        <div className="medical-card p-6 md:p-10 bg-white shadow-2xl rounded-[3rem] border-none overflow-hidden hover:shadow-primary-500/10 transition-all duration-700">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-14 bg-medical-green rounded-2xl flex items-center justify-center shadow-lg shadow-medical-green/20">
                    <Pill className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-medical-textSecondary leading-none mb-1">Adherence Module</span>
                    <span className="text-lg font-black text-primary-900 italic tracking-tight">Active Prescriptions</span>
                </div>
            </div>
           <Medication />
        </div>

        {/* Global Warning Footer */}
        <div className="p-10 bg-medical-bg border border-medical-border rounded-[3rem] flex flex-col md:flex-row items-center gap-8 group hover:border-medical-warning/30 transition-all">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-sm border border-medical-border group-hover:bg-medical-warning/5 transition-colors">
                <ShieldAlert className="w-10 h-10 text-medical-warning group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-900 mb-2 italic">Critical Advisory Notice</h4>
                <p className="text-sm font-bold text-medical-textSecondary leading-relaxed">
                    This module provides non-clinical biological suggestions based on localized safe-lists. 
                    End-to-end biological encryption is applied. Always consult a licensed medical professional for serious pathologies.
                </p>
            </div>
            <div className="flex items-center gap-2 pr-4 opacity-20">
                <div className="w-1.5 h-1.5 bg-primary-900 rounded-full"></div>
                <div className="w-3 h-1.5 bg-primary-900 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-primary-900 rounded-full"></div>
            </div>
        </div>

        <div className="pt-40 text-center opacity-5">
            <p className="text-[10px] font-black uppercase tracking-[1em] text-primary-900 italic">Temporal Bio-Core Matrix • medication protocol 4.1.2</p>
        </div>
      </div>
    </Layout>
  );
}
