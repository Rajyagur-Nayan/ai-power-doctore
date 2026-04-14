"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  User,
  Bot,
  Paperclip,
  MoreVertical,
  Smile,
  RefreshCcw,
  Volume2,
  Loader2,
  X,
  Circle,
  MessageSquare,
  ChevronDown,
  WifiOff,
} from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { syncManager } from "@/utils/syncManager";
import { detectEmergency, EMERGENCY_ADVICE } from "@/utils/emergencyCheck";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiService } from "@/utils/api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex w-full mb-8 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
    >
      <div
        className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-4`}
      >
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform hover:scale-110 ${isUser ? "bg-primary-400 text-white" : "bg-white border border-slate-100 text-primary-400"}`}
        >
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Bot className="w-5 h-5" />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div
            className={`
            relative px-6 py-4 rounded-[1.75rem] text-sm font-medium leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-primary-400 text-white rounded-tr-none shadow-primary-400/20"
                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200/50"
            }
            `}
          >
            <p>{message.text}</p>
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${isUser ? "text-primary-300 text-right pr-1" : "text-slate-400 pl-1"}`}
          >
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((text: string, sender: "user" | "ai") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const isOnline = useOnlineStatus();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!text) setInputText("");

    if (detectEmergency(messageText)) {
      const emergencyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: EMERGENCY_ADVICE,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, emergencyMsg]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiService.sendChatMessage(messageText);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Clinical connection fault. Protocol reconciliation recommended.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-slate-100 relative">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl px-10 py-8 flex items-center justify-between border-b border-slate-100 z-20">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className={`w-14 h-14 border-2 ${isOnline ? "border-primary-100 bg-primary-50 text-primary-400" : "border-slate-100 bg-slate-50 text-slate-400"} rounded-2xl flex items-center justify-center transition-all shadow-sm`}
            >
              <Bot className="w-7 h-7" />
            </div>
            <span
              className={`absolute -top-1 -right-1 w-4 h-4 ${isOnline ? "bg-emerald-500" : "bg-slate-300"} border-4 border-white rounded-full ${isOnline ? "animate-pulse shadow-sm shadow-emerald-500" : ""}`}
            ></span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 tracking-tight leading-none text-lg">
              HealthBot <span className="text-primary-400">Pro</span>
            </h4>
            <span
              className={`text-xs font-bold uppercase tracking-widest mt-2 block ${isOnline ? "text-primary-400" : "text-slate-400"}`}
            >
              {isOnline ? "Secure Connection Active" : "Local Mode Mode"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-slate-200">
              <WifiOff className="w-3 h-3" />
              <span>Diagnostic Mode</span>
            </div>
          )}
          <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 group">
            <RefreshCcw className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
          </button>
          <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95 group">
            <MoreVertical className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-10 py-12 bg-slate-50/30 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-premium flex items-center justify-center animate-bounce-slow">
              <MessageSquare className="w-10 h-10 text-primary-400" />
            </div>
            <div className="space-y-3">
              <h5 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-800">
                Medical Pulse Protocol
              </h5>
              <p className="text-xs font-semibold text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Start a clinical dialogue or describe your symptoms below for immediate protocol analysis.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-8 animate-in fade-in duration-300">
                <div className="flex flex-row items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xs text-primary-400">
                    AI
                  </div>
                  <div className="bg-white border border-slate-100 px-6 py-4 rounded-[1.75rem] rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-slate-100">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <div className="flex-1 relative group">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your health concern..."
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 text-sm font-semibold text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:border-primary-400/30 focus:ring-8 focus:ring-primary-400/5 shadow-inner"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                <button className="p-2 text-slate-300 hover:text-primary-400 transition-colors">
                    <Paperclip className="w-5 h-5" />
                </button>
            </div>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className={`
                h-[72px] w-[72px] rounded-3xl flex items-center justify-center transition-all duration-500 active:scale-90 shadow-xl
                ${inputText.trim() && !isLoading ? "bg-primary-400 text-white hover:bg-primary-500 shadow-primary-400/30" : "bg-slate-50 text-slate-300 cursor-not-allowed shadow-none"}
            `}
          >
            {isLoading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
                <Send className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
