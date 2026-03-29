"use client";

import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface CaseInputProps {
  onSubmit: (notes: string) => void;
  isLoading: boolean;
}

export const CaseInput: React.FC<CaseInputProps> = ({ onSubmit, isLoading }) => {
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim()) {
      onSubmit(notes);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">New Clinical Case</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-2">
            Clinician Notes / Patient Symptoms
          </label>
          <textarea
            id="notes"
            className="w-full h-40 p-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-slate-800"
            placeholder="Enter patient symptoms, suspected conditions, or required procedures here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !notes.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
            isLoading || !notes.trim()
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Case...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Analyze & Code Case
            </>
          )}
        </button>
      </form>
    </div>
  );
};
