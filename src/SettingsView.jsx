import React, { useState } from 'react';
import {
  ArrowLeft, Moon, Sun, Download, HardDrive, RotateCcw,
  CheckCircle2, Check, ShieldCheck, Sparkles, Layers,
  ExternalLink, Info, Palette, Sliders, Smartphone, Laptop
} from 'lucide-react';
import { INITIAL_ELEMENTS } from './initialData';

export default function SettingsView({
  appTheme = 'light',
  setAppTheme,
  exportFormat = 'png',
  setExportFormat,
  exportSize = 1024,
  setExportSize,
  elements = [],
  setElements,
  onBack,
  onOpenLicense,
  onOpenStudio
}) {
  const [toastMessage, setToastMessage] = useState('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleThemeChange = (newTheme) => {
    setAppTheme(newTheme);
    showToast(newTheme === 'dark' ? 'Dark Mode activated' : 'Light Mode activated');
  };

  const handleFormatChange = (fmt) => {
    setExportFormat(fmt);
    localStorage.setItem('iconderry_default_format', fmt);
    showToast(`Default export format set to .${fmt.toUpperCase()}`);
  };

  const handleSizeChange = (sz) => {
    if (setExportSize) {
      setExportSize(sz);
      localStorage.setItem('iconderry_default_size', String(sz));
      showToast(`Default resolution set to ${sz >= 1024 ? `${sz / 1024}K` : `${sz}px`}`);
    }
  };

  const handleResetLibrary = () => {
    const fresh = INITIAL_ELEMENTS.map(el => ({ ...el, downloads: el.downloads || 0 }));
    setElements(fresh);
    localStorage.setItem('iconderry_assets', JSON.stringify(fresh));
    setResetConfirmOpen(false);
    showToast('Default icon library successfully restored!');
  };

  return (
    <div className={`min-h-[calc(100vh-65px)] pb-28 md:pb-16 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto transition-colors duration-200 ${
      appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="pt-6 sm:pt-8 pb-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-slate-700/30">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className={`p-2.5 rounded-2xl border transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
              appTheme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
            }`}
            title="Back to Gallery"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">App Settings</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Preferences
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Customize themes, default rendering formats, and local offline cache
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition cursor-pointer"
        >
          <span>Done &bull; Back to Gallery</span>
        </button>
      </div>

      <div className="mt-8 space-y-6 sm:space-y-8">
        {/* SECTION 1: THEME & APPEARANCE */}
        <section className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
          appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#22242c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/20 mb-5">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${appTheme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                {appTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold">Theme & Visual Grading</h2>
                <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Choose between high-contrast dark OLED mode or studio clean light mode
                </p>
              </div>
            </div>

            {/* Sliding Toggle Switch */}
            <button
              type="button"
              onClick={() => handleThemeChange(appTheme === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner flex-shrink-0 cursor-pointer ${
                appTheme === 'dark' ? 'bg-cyan-500' : 'bg-slate-300'
              }`}
              title="Toggle Dark Mode"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                  appTheme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Dark Mode Card */}
            <div
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                appTheme === 'dark'
                  ? 'border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/20'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-inner">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Deep Cyber Dark</h3>
                    <span className="text-[11px] text-slate-400">#121316 OLED Dark Palette</span>
                  </div>
                </div>
                {appTheme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                <span className="text-[11px] text-slate-400">Optimized for high-contrast neon glows & eye comfort</span>
              </div>
            </div>

            {/* Light Mode Card */}
            <div
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                appTheme === 'light'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-600/20'
                  : appTheme === 'dark'
                    ? 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 shadow-sm">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold">Studio Clean Light</h3>
                    <span className="text-[11px] opacity-75">Bright White & Crisp Canvas</span>
                  </div>
                </div>
                {appTheme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="mt-3.5 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                <span className="text-[11px] opacity-75">Ideal for outdoor visibility and daylight editing</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: DEFAULT EXPORT PREFERENCES */}
        <section className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
          appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#22242c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className={`p-2 rounded-xl ${appTheme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">Default Export Configuration</h2>
              <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Set default format and resolution when opening or downloading assets
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Format Selector */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${
                appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Default File Format
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { fmt: 'png', desc: 'Lossless' },
                  { fmt: 'svg', desc: 'Vector' },
                  { fmt: 'ico', desc: 'Windows' },
                  { fmt: 'webp', desc: 'Modern' },
                  { fmt: 'jpeg', desc: 'Standard' },
                  { fmt: 'gif', desc: 'Looping' }
                ].map(({ fmt, desc }) => {
                  const isSelected = exportFormat === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => handleFormatChange(fmt)}
                      className={`py-3 px-2 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 ring-2 ring-blue-500/30'
                          : appTheme === 'dark'
                            ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold uppercase">.{fmt}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'opacity-60'}`}>{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolution Presets */}
            {setExportSize && (
              <div className="pt-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${
                  appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Default Export Resolution
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { sz: 512, label: '512px Standard', badge: 'Fast Web' },
                    { sz: 1024, label: '1024px High-Res', badge: 'App Icon' },
                    { sz: 2048, label: '2048px 2K Retina', badge: 'Retina' },
                    { sz: 4096, label: '4096px 4K Ultra-HD', badge: 'Print' }
                  ].map(({ sz, label, badge }) => {
                    const isSelected = exportSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeChange(sz)}
                        className={`py-2.5 px-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between active:scale-95 ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 ring-2 ring-cyan-500/20'
                            : appTheme === 'dark'
                              ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold block">{label}</span>
                          <span className="text-[10px] opacity-60">{badge}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: DATA & OFFLINE CACHE MANAGEMENT */}
        <section className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
          appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#22242c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/20 mb-4">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${appTheme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold">Offline Storage & Library</h2>
                <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Manage locally stored vectors, custom icon uploads, and cache
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {elements.length} Vectors Cached
            </span>
          </div>

          <div className="space-y-3">
            <p className={`text-xs leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Iconderry uses browser IndexedDB and offline caching to store vector assets without eating device memory. You can reset to the original default library at any time.
            </p>

            {resetConfirmOpen ? (
              <div className={`p-4 rounded-2xl border ${
                appTheme === 'dark' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="text-xs font-semibold mb-3">
                  Kya aap sach me icon library ko default built-in version par reset karna chahte hain?
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetLibrary}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirmOpen(true)}
                className={`w-full py-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
                  appTheme === 'dark'
                    ? 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 shadow-sm'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reload / Restore Default Icon Library</span>
              </button>
            )}
          </div>
        </section>

        {/* SECTION 4: ABOUT & LICENSE */}
        <section className={`p-5 sm:p-6 rounded-3xl border transition-colors ${
          appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#22242c]' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/app-icon.png"
                alt="Iconderry Icon"
                className="w-12 h-12 rounded-2xl object-cover shadow-lg shadow-purple-600/30 border border-white/20 flex-shrink-0"
              />
              <div>
                <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                  <span>Iconderry Pro Suite</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    v2.4
                  </span>
                </h3>
                <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Advanced Visual Grading &bull; 8K Multi-Format Vector Rendering Engine
                </p>
              </div>
            </div>

            {onOpenLicense && (
              <button
                type="button"
                onClick={onOpenLicense}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition cursor-pointer self-start sm:self-auto"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Commercial License</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
