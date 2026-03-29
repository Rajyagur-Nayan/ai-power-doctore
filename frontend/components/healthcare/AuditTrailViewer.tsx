"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, History, Clock, Brain, Calculator, ShieldCheck } from "lucide-react";

interface AuditTrailViewerProps {
  trail: any[];
}

export const AuditTrailViewer: React.FC<AuditTrailViewerProps> = ({ trail }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case "NLP": return <Brain className="w-5 h-5 text-purple-500" />;
      case "Coding": return <History className="w-5 h-5 text-blue-500" />;
      case "RuleEngine": return <ShieldCheck className="w-5 h-5 text-green-500" />;
      case "Claims": return <Calculator className="w-5 h-5 text-amber-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 mt-6 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <History className="w-5 h-5" />
          <span>System Audit Trail & Reasoning</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-6 bg-slate-50/50">
          {trail.map((step, index) => (
            <div key={index} className="relative pl-8 pb-6 border-l-2 border-slate-200 last:border-0 last:pb-0">
              {/* Dot */}
              <div className="absolute -left-[11px] top-0 bg-white p-1 rounded-full border-2 border-slate-200">
                {getAgentIcon(step.agent)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800">{step.agent} Agent</h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 shadow-sm leading-relaxed">
                  <div className="font-semibold mb-1 text-slate-400 text-xs uppercase tracking-tight">Logic Applied</div>
                  <p className="mb-2">{step.logic}</p>
                  
                  <div className="font-semibold mb-1 text-slate-400 text-xs uppercase tracking-tight mt-3">Reasoning Summary</div>
                  <p className="italic text-slate-500">{step.reasoning || "Systemic logic applied."}</p>
                </div>

                <div className="mt-2 text-[11px] font-mono text-slate-400">
                  <details>
                    <summary className="cursor-pointer hover:text-slate-600">View Raw Output Data</summary>
                    <pre className="mt-2 bg-slate-900 text-green-400 p-2 rounded overflow-x-auto max-h-40">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
