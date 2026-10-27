import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Code, 
  Users, 
  Zap, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Terminal, 
  Sliders, 
  Github, 
  Eye, 
  Download, 
  Flame, 
  Layers, 
  ArrowRight,
  MessageSquare,
  Lock,
  ExternalLink,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (mode?: 'ai' | 'web' | 'room') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'web' | 'room'>('web');

  return (
    <div className="min-h-screen bg-[#07070A] text-gray-100 font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-violet-800/10 rounded-full blur-[160px]" />
        <div className="absolute top-[1200px] -right-40 w-[600px] h-[600px] bg-purple-900/15 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf612_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* NAVBAR */}
      <header className="relative z-30 w-full border-b border-purple-500/15 bg-[#09090D]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-700 to-violet-500 p-0.5 shadow-lg shadow-purple-600/30">
                <div className="w-full h-full bg-[#0E0E14] rounded-[14px] flex items-center justify-center overflow-hidden">
                  <img src="/bara-ai-logo.jpg" alt="Bara AI Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  BARA AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-400 tracking-wide uppercase">
                Official Web Studio & AI Engine
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#fitur" className="hover:text-purple-400 transition-colors">Fitur Unggulan</a>
            <a href="#studio" className="hover:text-purple-400 transition-colors">Web Studio</a>
            <a href="#arsitektur" className="hover:text-purple-400 transition-colors">Arsitektur & Prompts</a>
            <a href="#komunitas" className="hover:text-purple-400 transition-colors">Room Komunitas</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterApp('ai')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-[#161622]/80 hover:bg-purple-900/30 text-purple-200 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-sm hover:border-purple-400"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Chat Bara</span>
            </button>
            <button
              onClick={() => onEnterApp('web')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mulai Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono mb-8 backdrop-blur-md shadow-inner shadow-purple-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Bara AI Web Creator & Autonomous Assistant</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-400 font-semibold">Gemini 2.5 Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl font-orbitron font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-white">
          Bangun Website Masa Depan & Asisten AI{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Pintar & Patuh
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-300 font-sans leading-relaxed">
          Platform AI all-in-one buatan <strong className="text-purple-300 font-semibold">Bara Official</strong>. Dilengkapi Web Studio otomatis, live sandbox, sinkronisasi GitHub, Room Chat interaktif, serta System Prompt terpisah dengan tingkat kepatuhan tinggi.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
          <button
            onClick={() => onEnterApp('web')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide transition-all shadow-xl shadow-purple-600/40 hover:shadow-purple-600/60 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-3 group"
          >
            <Code className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            <span>Buka Web Studio AI</span>
            <ChevronRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onEnterApp('ai')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#14141E] hover:bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 text-gray-200 hover:text-white font-semibold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg"
          >
            <Bot className="w-5 h-5 text-purple-400" />
            <span>Mulai Chat Bara AI</span>
          </button>

          <button
            onClick={() => onEnterApp('room')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#101016]/90 hover:bg-[#181824] border border-gray-800 hover:border-purple-500/40 text-gray-300 hover:text-purple-300 font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Room Chat</span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl pt-8 border-t border-purple-500/15">
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-950/10 border border-purple-500/15">
            <span className="font-orbitron font-extrabold text-xl text-purple-300">0.2</span>
            <span className="text-[11px] text-gray-400 font-mono mt-1">High Adherence Temp</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-950/10 border border-purple-500/15">
            <span className="font-orbitron font-extrabold text-xl text-purple-300">100%</span>
            <span className="text-[11px] text-gray-400 font-mono mt-1">Live In-Browser Sandbox</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-950/10 border border-purple-500/15">
            <span className="font-orbitron font-extrabold text-xl text-purple-300">2-in-1</span>
            <span className="text-[11px] text-gray-400 font-mono mt-1">Dual System Prompt</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-950/10 border border-purple-500/15">
            <span className="font-orbitron font-extrabold text-xl text-purple-300">GitHub</span>
            <span className="text-[11px] text-gray-400 font-mono mt-1">Direct Commit Sync</span>
          </div>
        </div>

        {/* INTERACTIVE MOCKUP SHOWCASE */}
        <div id="studio" className="mt-16 w-full max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-purple-500/40 via-purple-500/10 to-transparent shadow-2xl shadow-purple-950/50">
          <div className="w-full bg-[#0C0C12] border border-purple-500/30 rounded-[22px] overflow-hidden text-left flex flex-col">
            {/* Mockup Window Header */}
            <div className="px-5 py-3.5 bg-[#14141C] border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-gray-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  bara-ai-engine://workspace
                </span>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center bg-[#1A1A26] p-1 rounded-xl border border-purple-500/20">
                <button
                  onClick={() => setActiveTab('web')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'web' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Web Studio AI
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'chat' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Bara AI Chat
                </button>
                <button
                  onClick={() => setActiveTab('room')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === 'room' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Room Live
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={() => onEnterApp(activeTab === 'chat' ? 'ai' : activeTab)} 
                  className="px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-1.5 border border-purple-500/30 cursor-pointer"
                >
                  <span>Buka Layar Penuh</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mockup Body Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'web' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono w-fit">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Generator Website Instan</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-2xl text-white">
                      Ketik Prompt, Website Langsung Jadi & Interaktif
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Katakan <em className="text-purple-300">"Buatkan landing page toko kopi neon purple dengan menu interaktif"</em>. Bara AI akan menyusun kode lengkap HTML, Tailwind CSS, JavaScript, render preview instan, dan siap diunduh atau disinkronkan ke GitHub.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Live Sandbox & Preview Interaktif</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Syntax Highlighter Berwarna & Download HTML</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sinkronisasi Otomatis ke GitHub Repository</span>
                      </div>
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => onEnterApp('web')}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit"
                      >
                        <Code className="w-4 h-4" />
                        <span>Coba Web Studio Sekarang</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview Card */}
                  <div className="md:col-span-7 bg-[#101018] border border-purple-500/30 rounded-2xl p-4 shadow-xl font-mono text-xs overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3 text-gray-400">
                      <span className="text-[11px] text-purple-300 font-bold">Preview: Cyber Coffee Lounge</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">RUNNING</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#09090D] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                          <span className="font-bold text-white text-sm">NEO ROAST</span>
                        </div>
                        <span className="text-[10px] text-purple-400">Order Online</span>
                      </div>
                      <div className="h-16 rounded-lg bg-gradient-to-r from-purple-900/40 via-violet-900/30 to-purple-950/40 border border-purple-500/20 flex items-center px-4 justify-between">
                        <div>
                          <div className="text-white font-bold text-xs">Caramel Nitro Brew</div>
                          <div className="text-[10px] text-gray-400">Infused cold nitrogen blend</div>
                        </div>
                        <span className="px-2.5 py-1 bg-purple-600 rounded-lg text-white font-bold text-xs">$4.50</span>
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                        <span className="text-emerald-400">✓</span> <span>HTML5 + Tailwind CSS v4 + Responsive Canvas rendered</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono w-fit">
                      <Bot className="w-3.5 h-3.5" />
                      <span>Percakapan & Analisis Cerdas</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-2xl text-white">
                      Bara AI yang Patuh, Teliti, & Solutif
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Sistem AI asisten dengan prompt terdedikasi untuk tugas penalaran, coding, riset, penulisan, hingga otomasi tugas. Dilengkapi riwayat obrolan tersimpan dan kontrol system prompt pribadi.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Riwayat chat otomatis & multi-sesi</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Dukungan upload file, gambar, dan analisis</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Kepatuhan tinggi tanpa basa-basi korporat</span>
                      </div>
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => onEnterApp('ai')}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit"
                      >
                        <Bot className="w-4 h-4" />
                        <span>Masuk Chat Bara AI</span>
                      </button>
                    </div>
                  </div>

                  {/* Chat Preview Card */}
                  <div className="md:col-span-7 bg-[#101018] border border-purple-500/30 rounded-2xl p-4 shadow-xl font-mono text-xs space-y-3">
                    <div className="p-3 rounded-xl bg-purple-900/20 border border-purple-500/30 text-purple-200">
                      <span className="font-bold text-[10px] text-purple-400 block mb-1">User</span>
                      "Bara, bantu saya desain arsitektur database untuk aplikasi e-commerce real-time."
                    </div>
                    <div className="p-3 rounded-xl bg-[#09090D] border border-purple-500/20 text-gray-200">
                      <span className="font-bold text-[10px] text-emerald-400 block mb-1">Bara AI Engine</span>
                      "Siap. Untuk e-commerce real-time dengan skalabilitas tinggi, berikut blueprint Firestore + relational schema terdistribusi..."
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'room' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-5 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono w-fit">
                      <Users className="w-3.5 h-3.5" />
                      <span>Kolaborasi Multi-User</span>
                    </div>
                    <h3 className="font-orbitron font-bold text-2xl text-white">
                      Room Chat Interaktif & Live Komunitas
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Ngobrol bersama komunitas, berbagi ide coding, sematkan pesan penting, pin bintang, hingga kustomisasi video wallpaper real-time.
                    </p>
                    <div className="flex flex-col gap-2 pt-2">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Sinkronisasi pesan real-time Firestore</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Kustom wallpaper gambar atau video dinamis</span>
                      </div>
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => onEnterApp('room')}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit"
                      >
                        <Users className="w-4 h-4" />
                        <span>Masuk Room Chat</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-7 bg-[#101018] border border-purple-500/30 rounded-2xl p-4 shadow-xl font-mono text-xs space-y-2">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">BO</span>
                        <span className="text-gray-300 text-xs">Bara Officer</span>
                      </div>
                      <span className="text-[10px] text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Disematkan
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#14141E] border border-purple-500/20 text-gray-200 text-xs">
                      "Selamat datang di Room Bara Official! Diskusikan ide proyek dan Web Studio di sini."
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN SECTION */}
      <section id="fitur" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono mb-4">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>KEMAMPUAN UTAMA</span>
          </div>
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white">
            Fitur Canggih untuk Kreator & Developer Masa Depan
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">
            Dirancang secara khusus dengan performa tinggi, tampilan futuristik, dan kontrol penuh terhadap perilaku AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Web Studio AI</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Pembuatan aplikasi web frontend dan full-stack otomatis. Menyediakan panel live preview sandbox, syntax highlighter berwarna ala VSCode, ekspor file HTML instan, dan sync GitHub.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('web')}
              className="mt-6 flex items-center gap-2 text-xs font-mono text-purple-400 group-hover:text-purple-300 font-semibold cursor-pointer"
            >
              <span>Jelajahi Web Studio</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Dual System Prompts</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Pemisahan instruksi mandiri antara <strong>Bara AI (Chat)</strong> dan <strong>Web Studio</strong>. Anda memiliki kendali 100% untuk mengubah kepribadian, instruksi, dan aturan kepatuhan AI.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('ai')}
              className="mt-6 flex items-center gap-2 text-xs font-mono text-violet-400 group-hover:text-violet-300 font-semibold cursor-pointer"
            >
              <span>Buka Chat & Pengaturan</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#0D0D14] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">Room Komunitas Real-Time</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Ruang obrolan interaktif dengan sinkronisasi Firebase, pesan tersemat, reply thread, dukungan lampiran media, dan wallpaper video futuristik.
              </p>
            </div>
            <button
              onClick={() => onEnterApp('room')}
              className="mt-6 flex items-center gap-2 text-xs font-mono text-indigo-400 group-hover:text-indigo-300 font-semibold cursor-pointer"
            >
              <span>Masuk Room Chat</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ARSITEKTUR & PROMPTS SECTION */}
      <section id="arsitektur" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-purple-500/15">
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#10101A] to-purple-950/30 border border-purple-500/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-2 font-bold">
              Kepatuhan & Kecepatan Maksimal
            </span>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white mb-4">
              Konfigurasi Suhu Rendah (0.2) untuk Presisi Penuh
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Bara AI dijalankan dengan parameter <code>temperature: 0.2</code> di backend dan client, memastikan AI mematuhi instruksi Anda tanpa halusinasi atau mengabaikan panduan proyek.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono">
                ✓ System Prompt Bara AI Terpisah
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono">
                ✓ Web Studio System Prompt Khusus
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-mono">
                ✓ Anti-Drift & Anti-Refusal Tuning
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col gap-3 min-w-[280px]">
            <button
              onClick={() => onEnterApp('ai')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm text-center shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Buka Aplikasi & Pengaturan
            </button>
            <button
              onClick={() => onEnterApp('web')}
              className="w-full py-3 px-6 rounded-2xl bg-[#14141E] hover:bg-purple-900/20 border border-purple-500/30 text-purple-200 text-xs font-mono text-center transition-all cursor-pointer"
            >
              Langsung ke Web Studio
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-purple-500/15 bg-[#07070A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/30 p-1 flex items-center justify-center">
              <img src="/bara-ai-logo.jpg" alt="Bara AI" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="font-orbitron font-bold text-sm text-white">BARA AI</span>
              <p className="text-[11px] text-gray-500 font-mono">© 2026 Bara Official X Bara AI. Hak cipta dilindungi.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400 font-mono">
            <button onClick={() => onEnterApp('ai')} className="hover:text-purple-300 transition-colors cursor-pointer">
              Bara Chat
            </button>
            <button onClick={() => onEnterApp('web')} className="hover:text-purple-300 transition-colors cursor-pointer">
              Web Studio
            </button>
            <button onClick={() => onEnterApp('room')} className="hover:text-purple-300 transition-colors cursor-pointer">
              Room Chat
            </button>
            <a href="#fitur" className="hover:text-purple-300 transition-colors">
              Fitur
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
