"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import ChatUI from "@/components/ChatUI";
import { Bot } from "lucide-react";

export default function ChatPage() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-10 px-4 md:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
        <div className="w-full text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-primary-100">
            <Bot className="w-3.5 h-3.5" />
            <span>Protocol Sync Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Clinical Assistant
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Secure end-to-end biological dialogue. Describe symptoms or clinical
            concerns for immediate protocol reconciliation.
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <ChatUI />
        </div>
      </div>
    </Layout>
  );
}
