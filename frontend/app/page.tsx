"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  Users,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Database,
  Zap,
  Pill,
  Camera,
  History as HistoryIcon,
  User as UserIcon,
  ChevronRight,
  Stethoscope,
  HeartPulse,
  TrendingUp,
  Clock,
  MessageSquare,
  Mic,
  Video,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { apiService } from "@/utils/api";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [pData, hData, qData] = await Promise.all([
          apiService.getProfile(),
          apiService.getHistory(),
          apiService.getQueue(),
        ]);
        setProfile(pData);
        setHistory(hData.slice(0, 3));
        setQueue(qData.filter((p: any) => p.status === "Pending"));
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const systemMetrics = [
    {
      title: "Oxygen Sync",
      value: "98%",
      detail: "Optimal",
      icon: HeartPulse,
      color: "text-medical-green",
      bg: "bg-medical-green/10",
    },
    {
      title: "Bio-Vault",
      value: "Secure",
      detail: "Encrypted",
      icon: ShieldCheck,
      color: "text-primary-500",
      bg: "bg-primary-500/10",
    },
    {
      title: "Protocol",
      value: "V2.1",
      detail: "Stable",
      icon: Activity,
      color: "text-medical-warning",
      bg: "bg-medical-warning/10",
    },
    {
      title: "Network",
      value: "Live",
      detail: "Rural Mode",
      icon: Zap,
      color: "text-primary-600",
      bg: "bg-primary-600/10",
    },
  ];

  return (
    <Layout>
      {/* Premium Hero Section */}
      <div className="relative mb-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 text-primary-500 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-primary-100">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>System Protocol v4.0 Active</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-800 tracking-tight leading-[1.1]">
              Modern Healthcare <br />
              <span className="text-primary-400">Reimagined.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed">
              A unified AI-driven medical clinical protocol. Synchronized
              diagnostics and intelligent rural health deployment in one
              seamless interface.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button
                  size="xl"
                  className="w-full sm:w-auto shadow-2xl shadow-primary-400/30"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  <span>New Session</span>
                </Button>
              </Link>
              <Link href="/history" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  <span>View Records</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element / Decoration */}
          <div className="hidden lg:block relative">
            <div className="w-96 h-96 bg-gradient-to-tr from-primary-400/20 to-primary-100 rounded-full blur-3xl absolute -z-10 animate-pulse-soft"></div>
            <Card className="p-10 w-80 rotate-2 hover:rotate-0 transition-all duration-700 bg-white/40 backdrop-blur-xl border-white shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Live Sync
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      98% Vitality
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  Optical protocol synchronized with local bio-vault for instant
                  diagnostic analysis.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {systemMetrics.map((stat, i) => (
          <Card
            key={i}
            className="p-10 border-slate-50/50 hover:bg-slate-50/30 group"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-8">
              <div
                className={`w-16 h-16 ${stat.bg} ${stat.color.replace("text-", "bg-").replace("text-", "bg-").replace("text-", "bg-").split(" ")[0]} bg-opacity-10 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-all duration-500`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <Activity className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">
              {stat.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-800 tracking-tight leading-none">
                {stat.value}
              </p>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.detail}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Bio-Profile Integrated Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="bg-slate-900 border-none p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 space-y-12">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <UserIcon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">
                    Biometric Profile
                  </span>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
                    Biological Data
                  </h3>
                  <div className="flex gap-6">
                    <div className="px-7 py-5 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">
                        Patient Age
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {profile?.age || "24"}
                      </p>
                    </div>
                    <div className="px-7 py-5 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex-1">
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">
                        Unit Weight
                      </p>
                      <p className="text-3xl font-bold text-white">
                        {profile?.weight ? `${profile.weight}kg` : "72kg"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/20 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            </Card>

            <Card className="bg-white border-slate-100 p-12 rounded-[3rem] shadow-premium flex flex-col justify-between group">
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-400">
                      <HistoryIcon className="w-6 h-6" />
                    </div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                      Clinical Logs
                    </h4>
                  </div>
                  <TrendingUp className="w-5 h-5 text-emerald-500/30" />
                </div>
                <div className="space-y-6">
                  {history.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-400 leading-relaxed italic">
                      Synchronizing encrypted vault...
                    </p>
                  ) : (
                    history.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-6 group/item cursor-pointer"
                      >
                        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full opacity-0 group-hover/item:opacity-100 transition-all shadow-sm shadow-primary-400"></div>
                        <div className="flex flex-col">
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-tight group-hover/item:text-primary-500 transition-colors">
                            {item.title || "Clinical Observation"}
                          </p>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1.5">
                            UID: {item.id || "0x99"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <Link
                href="/history"
                className="pt-10 flex items-center justify-between group/link"
              >
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary-400">
                  Enter Vault
                </span>
                <ChevronRight className="w-5 h-5 text-slate-200 group-hover/link:translate-x-3 group-hover/link:text-primary-400 transition-all duration-500" />
              </Link>
            </Card>
          </div>

          {/* Diagnostic Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "AI Health Chat",
                icon: MessageSquare,
                path: "/chat",
                desc: "Intelligence Sync",
                accent: "bg-primary-50 text-primary-400",
              },
              {
                name: "Voice Assistant",
                icon: Mic,
                path: "/voice",
                desc: "Bio-Voice Protocol",
                accent: "bg-emerald-50 text-emerald-500",
              },
              {
                name: "Radiology",
                icon: Camera,
                path: "/diagnosis",
                desc: "Vision Scan v2",
                accent: "bg-sky-50 text-sky-500",
              },
              {
                name: "Digital Rx",
                icon: Pill,
                path: "/medication",
                desc: "Pharmacy Sync",
                accent: "bg-indigo-50 text-indigo-400",
              },
              {
                name: "Video Consult",
                icon: Video,
                path: "/consultation",
                desc: "Remote Protocol",
                accent: "bg-rose-50 text-rose-500",
              },
              {
                name: "Live Locator",
                icon: MapPin,
                path: "/location",
                desc: "Smart Facility Scan",
                accent: "bg-amber-50 text-amber-500",
              },
            ].map((mod, i) => (
              <Link key={i} href={mod.path}>
                <Card className="p-10 rounded-[2.5rem] border-slate-50/50 hover:border-primary-400/20 transition-all group flex items-center gap-8 shadow-premium hover:shadow-premium-hover">
                  <div
                    className={`w-20 h-20 ${mod.accent} rounded-[1.75rem] flex items-center justify-center group-hover:scale-110 shadow-sm transition-all duration-700`}
                  >
                    <mod.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-2xl leading-tight mb-1 group-hover:text-primary-400 transition-colors">
                      {mod.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      {mod.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-slate-100 ml-auto group-hover:text-primary-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {/* Doctor Hub Access */}
          <Card className="bg-primary-500 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border-none">
            <div className="relative z-10 space-y-10">
              <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-inner">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400"></span>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">
                    Clinical Authorization
                  </p>
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-6">
                  Doctor Hub
                </h3>
                <p className="text-sm font-medium text-white/60 leading-relaxed mb-10">
                  Issuing high-fidelity prescriptions and managing patient
                  synchronization for clinical Protocol 4.
                </p>
                <div className="flex items-end justify-between border-t border-white/10 pt-10">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      Live Queue
                    </p>
                    <p className="text-5xl font-bold tracking-tighter leading-none">
                      {queue.length}
                    </p>
                  </div>
                  <Link href="/doctor">
                    <Button
                      size="xl"
                      className="bg-white text-primary-500 hover:bg-slate-50 shadow-2xl shadow-black/10"
                    >
                      <span>Enter Hub</span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/10 transition-all duration-1000"></div>
            <Activity className="absolute -left-20 -bottom-20 w-80 h-80 opacity-[0.03] text-white animate-pulse" />
          </Card>

          <Card className="bg-white border-slate-100 p-12 rounded-[3rem] shadow-premium flex flex-col items-center text-center gap-10 group hover:translate-y-[-8px] transition-all duration-500">
            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100 text-primary-400 group-hover:bg-primary-50 transition-colors">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-800">
                Secure Environment
              </h4>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                End-to-end biological encryption deployed. Local zero-retention
                compliance protocol is active.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
              <div className="w-8 h-1.5 bg-primary-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
            </div>
          </Card>

          <Card className="bg-slate-50/50 border border-dashed border-slate-100 p-10 rounded-[2.5rem] text-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 group">
            <Clock className="w-8 h-8 mx-auto mb-6 text-slate-300 group-hover:text-primary-400 group-hover:rotate-[360deg] transition-all duration-1000" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">
              Protocol Audit
            </p>
            <p className="text-[10px] font-bold text-slate-800">
              {new Date().toLocaleTimeString()} Sync
            </p>
          </Card>
        </div>
      </div>

      <div className="pt-40 pb-20 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[2em] text-slate-300">
          Health Core Architecture • Clinical Matrix V4.1.2
        </p>
      </div>
    </Layout>
  );
}
