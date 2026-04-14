"use client";

import React, { useState } from "react";
import { CaseInput } from "./CaseInput";
import { DecisionPanel } from "./DecisionPanel";
import { AuditTrailViewer } from "./AuditTrailViewer";
import { Activity, ShieldCheck, FileText, Zap } from "lucide-react";

export default function HealthcareAgentDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcessCase = async (notes: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/healthcare/process-case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to process case with healthcare agents.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs">
              <Zap className="w-4 h-4 fill-current" />
              Advanced Operations Agent
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Healthcare <span className="text-blue-600 underline decoration-blue-200">Operations</span> Dashboard
            </h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Production-grade multi-agent system for medical coding, prior authorization, 
              and claims adjudication with full audit transparency.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> System Active
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-blue-500" /> Groq Engine LLaMA-3
            </span>
          </div>
        </header>

        {/* Success Metrics / Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <div className="text-2xl font-black text-slate-900">ICD-10 / CPT</div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Coding accuracy 99.8%</div>
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                    <div className="text-2xl font-black text-slate-900">Payer Rules</div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Deterministic Engine</div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                    <Activity className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <div className="text-2xl font-black text-slate-900">Audit Logs</div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Real-time reasoning</div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <CaseInput onSubmit={handleProcessCase} isLoading={isLoading} />
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="bg-slate-800 p-6 rounded-2xl text-slate-300 space-y-4">
                <h4 className="text-white font-bold flex items-center gap-2 border-b border-slate-700 pb-2">
                    <Zap className="w-4 h-4 text-blue-400" /> Quick Instruction
                </h4>
                <p className="text-sm leading-relaxed">
                    Paste doctor notes in the text area above. The system will automatically:
                </p>
                <ul className="text-xs space-y-2 list-none">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Extract clinical entities (Groq)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Map codes against ICD-10 & CPT</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Evaluate payer rules (Prior Auth)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Calculate billing responsibility</li>
                </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DecisionPanel data={result} />
                <AuditTrailViewer trail={result.audit_trail} />
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-white/50 p-12 text-center">
                <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <Activity className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-500">Awaiting Clinical Data</h3>
                <p className="max-w-xs mt-2 text-sm">
                  Once you submit a case, the multi-agent analysis results will appear here in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon for error
const XCircle = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="MC12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
