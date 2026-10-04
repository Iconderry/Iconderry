import React from 'react';
import {
  Sparkles, Layers, Palette, Zap, ArrowLeft, Download, ShieldCheck,
  Code2, Heart, Users, Globe, Cpu, Award
} from 'lucide-react';

export default function AboutView({ appTheme = 'dark', onOpenStudio, onOpenLicense, onOpenFeedback }) {
  const isDark = appTheme === 'dark';

  const STATS = [
    { label: 'Stickman Vectors', value: '120+', icon: Users, color: 'text-purple-400' },
    { label: 'Real-Time Shaders', value: '29+', icon: Palette, color: 'text-cyan-400' },
    { label: 'Max Export Resolution', value: '8K Ultra HD', icon: Download, color: 'text-emerald-400' },
    { label: 'Commercial Cost', value: '100% Free', icon: ShieldCheck, color: 'text-amber-400' },
  ];

  const FEATURES = [
    {
      title: '29+ Instant Vector Shaders',
      desc: 'Transform plain flat monochrome icons into Glassmorphic UI, Cyberpunk Neon, 3D Chrome, Molten Gold, Holo Foil, and Frosted Glass with single-click hardware accelerated SVG filter pipelines.',
      icon: Palette,
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400'
    },
    {
      title: '120 Unique Stickman Action Pack',
      desc: 'Extensive hand-crafted vector silhouette poses spanning extreme sports, real-world professions, modern lifestyle, gaming, and dynamic human emotions.',
      icon: Users,
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400'
    },
    {
      title: 'Multi-Layer Canvas Studio',
      desc: 'Compose complex scenes with multi-layer stacking, granular rotation, scale, shadow depth, custom stroke weight adjustments, and iOS-style squircle app icon badges.',
      icon: Layers,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400'
    },
    {
      title: 'Lossless Vector & Ultra HD Export',
      desc: 'Export clean XML SVGs for web developers, optimized WebP for mobile developers, and crystal-clear PNGs up to 8192px (8K) for high-dpi print & billboard assets.',
      icon: Download,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
    },
    {
      title: 'Private & Local-First Architecture',
      desc: 'Zero user tracking, zero data mining. Your custom palettes, favorites, and canvas scenes are stored directly on your device via HTML5 IndexedDB.',
      icon: ShieldCheck,
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400'
    },
    {
      title: 'Native Android App & Responsive Web',
      desc: 'Built using modern React, Tailwind CSS, Vite, and Capacitor for buttery smooth 60fps performance across desktop browsers, tablets, and Android smartphones.',
      icon: Cpu,
      color: 'from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 text-indigo-400'
    }
  ];

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDark ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onOpenStudio}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Studio
          </button>

          <div className="flex items-center gap-2 text-xs">
            {onOpenLicense && (
              <button onClick={onOpenLicense} className="text-emerald-400 hover:underline">
                Commercial License
              </button>
            )}
            <span className="text-slate-500">•</span>
            {onOpenFeedback && (
              <button onClick={onOpenFeedback} className="text-cyan-400 hover:underline">
                Request an Icon
              </button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-emerald-500/15 text-cyan-400 border border-cyan-500/30 mb-5 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>The Modern Vector Graphics Engine</span>
          </div>

          <h1 className={`text-4xl sm:text-6xl font-black tracking-tight mb-5 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Empowering Creators with Free, High-End Vector Art
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <strong>Iconderry</strong> was built to solve a major problem: designers and software engineers shouldn't have to choose between expensive subscriptions or generic, boring icons. We combined an ultra-fast vector gallery with an in-browser styling studio.
          </p>
        </div>

        {/* Live Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border text-center transition-all ${
                  isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-800/40 flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-2xl sm:text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* The Story & Mission */}
        <div className={`p-8 sm:p-10 rounded-3xl border mb-16 space-y-6 ${
          isDark ? 'bg-[#181a22] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5" /> Our Mission
          </div>

          <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why We Created Iconderry
          </h2>

          <p className="text-sm sm:text-base leading-relaxed">
            Most icon libraries online are static repositories. You search, copy a black SVG, and then have to open complex desktop software like Figma or Adobe Illustrator just to change colors, add lighting, or create consistent app badges.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            We wanted something radically different: an app where you can pick an icon, apply glassmorphism or cyber neons in one tap, tweak stroke thickness, mix and match layers on a live canvas, and export production-ready code in seconds — all directly on your browser or Android smartphone, completely free.
          </p>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Crafted with passion for the global open developer community</span>
            </div>
            <button
              onClick={onOpenStudio}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-600/25 transition cursor-pointer"
            >
              Open Studio Now
            </button>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything You Need in One Unified Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              From individual vector glyphs to multi-layer composite illustrations and mobile app icon assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.02] ${
                    isDark ? `${item.color} bg-[#161820]` : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-cyan-900/60 border border-purple-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Ready to Upgrade Your Visual Design?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 120+ unique stickmen, browse curated vector categories, apply 29+ real-time shaders, and download production-grade assets in seconds.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={onOpenStudio}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-black/30 transition cursor-pointer"
              >
                Launch Studio
              </button>
              {onOpenLicense && (
                <button
                  onClick={onOpenLicense}
                  className="px-5 py-3 rounded-xl text-xs font-bold border border-white/20 text-white hover:bg-white/10 transition cursor-pointer"
                >
                  View Commercial License
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
