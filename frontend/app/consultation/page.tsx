"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import PatientMeetingRequest from "@/components/PatientMeetingRequest";
import { Video, ShieldCheck } from "lucide-react";

export default function ConsultationPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-12 py-4 md:py-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16 lg:mb-20 px-4 md:px-8">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Video className="w-4 h-4" />
              <span>Live Secure Feed</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-primary-900 tracking-tighter italic">
              Telehealth 🌐
            </h1>
            <p className="text-medical-textSecondary text-lg md:text-xl leading-relaxed font-bold">
              Connect instantly with authorized rural doctors over low-bandwidth
              optimized WebRTC video channels. High reliability, auto-fallback
              audio modes.
            </p>
          </div>

          <div className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] shadow-xl border border-blue-50 relative overflow-hidden group hover:translate-x-2 transition-all">
            <div className="relative z-10 flex flex-col items-end">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1 leading-none">
                Security Encryption
              </p>
              <p className="text-xl font-black italic text-primary-900 tracking-tight leading-none mb-1">
                E2E Matrix
              </p>
              <span className="text-[9px] font-black text-medical-green uppercase tracking-widest flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 bg-medical-green rounded-full animate-pulse"></span>
                READY
              </span>
            </div>
            <div className="relative z-10 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Video Request Application */}
        <div className="px-4 md:px-8 max-w-3xl">
          <PatientMeetingRequest
            patientId="patient_01"
            doctorId="doctor_01"
          />
        </div>
      </div>
    </Layout>
  );
}
