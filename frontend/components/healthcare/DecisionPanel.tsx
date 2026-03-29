"use client";

import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info, DollarSign } from "lucide-react";

interface DecisionPanelProps {
  data: any;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ data }) => {
  if (!data) return null;

  const { status, reason } = data.decision;
  const { billing, codes } = data;

  const statusConfig = {
    approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-100", label: "Approved" },
    denied: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "Denied" },
    needs_review: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Needs Review" },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.needs_review;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className={`p-6 rounded-xl border ${currentStatus.bg} ${currentStatus.border} flex items-start gap-4 shadow-sm`}>
        <currentStatus.icon className={`w-10 h-10 ${currentStatus.color} mt-1`} />
        <div>
          <h3 className={`text-xl font-bold ${currentStatus.color}`}>{currentStatus.label}</h3>
          <p className="text-slate-700 mt-1 font-medium">{reason}</p>
        </div>
      </div>

      {/* Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" /> Diagnoses (ICD-10)
          </h4>
          <div className="space-y-2">
            {codes.icd10.length > 0 ? (
              codes.icd10.map((code: any) => (
                <div key={code.code} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded transition-colors">
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{code.code}</span>
                  <span className="text-slate-600 text-sm flex-1 ml-3 text-right truncate">{code.description}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic text-sm">No diagnoses found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" /> Procedures (CPT)
          </h4>
          <div className="space-y-2">
            {codes.cpt.length > 0 ? (
              codes.cpt.map((code: any) => (
                <div key={code.code} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded transition-colors">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{code.code}</span>
                  <span className="text-slate-600 text-sm flex-1 ml-3 text-right truncate">{code.description}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic text-sm">No procedures found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Adjudication Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-bold">Claims Adjudication Summary</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-slate-400">
            <span>Total Gross Cost</span>
            <span className="text-xl font-bold text-white">${billing.total_gross.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-green-400">
            <span>Insurance Coverage</span>
            <span className="text-xl font-bold">-${billing.insurance_payable.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-700 my-2" />
          <div className="flex justify-between items-center text-slate-100">
            <span className="text-lg">Patient Responsibility</span>
            <span className="text-3xl font-extrabold text-blue-400">${billing.patient_payable.toFixed(2)}</span>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="pb-2">Code</th>
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Cost</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {billing.line_items.map((item: any) => (
                <tr key={item.code} className="text-slate-300">
                  <td className="py-2 font-mono">{item.code}</td>
                  <td className="py-2 truncate max-w-[150px]">{item.description}</td>
                  <td className="py-2 text-right">${item.gross_cost.toFixed(2)}</td>
                  <td className="py-2 text-right capitalize">
                    <span className={item.status === 'approved' ? 'text-green-500' : item.status === 'denied' ? 'text-red-500' : 'text-amber-500'}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
