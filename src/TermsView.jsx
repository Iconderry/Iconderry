import React from 'react';
import {
  FileText, CheckCircle2, AlertTriangle, Scale, ShieldCheck,
  ArrowLeft, Mail, ExternalLink, Sparkles
} from 'lucide-react';

export default function TermsView({ appTheme = 'dark', onOpenStudio, onOpenPrivacy, onOpenLicense }) {
  const isDark = appTheme === 'dark';

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDark ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto">
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
            {onOpenPrivacy && (
              <button onClick={onOpenPrivacy} className="text-cyan-400 hover:underline">
                Privacy Policy
              </button>
            )}
            <span className="text-slate-500">•</span>
            {onOpenLicense && (
              <button onClick={onOpenLicense} className="text-emerald-400 hover:underline">
                Commercial License
              </button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-4 shadow-sm">
            <Scale className="w-4 h-4 text-purple-400" />
            <span>Legal Agreement</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Terms of Service
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Effective Date: October 2026. Please read these terms carefully before using <strong>Iconderry</strong> on the web or via our Android mobile application.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 ${
          isDark ? 'bg-[#181a22] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}>
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">1</span>
              Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              By accessing, browsing, installing, or exporting assets from Iconderry (the "Platform" or "Service"), you agree to be bound by these Terms of Service and our Commercial License. If you do not agree to all terms, please refrain from using the application.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">2</span>
              Permitted Commercial &amp; Personal Use
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Iconderry grants you a worldwide, perpetual, royalty-free license to use all exported vector files, SVGs, PNGs, and graphics in:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
              <li>Commercial and personal web applications, software, and dashboards.</li>
              <li>Native iOS, Android, Flutter, and React Native production applications published on the Apple App Store, Google Play Store, or other storefronts.</li>
              <li>Client design projects, marketing materials, slide decks, and advertising banners.</li>
              <li>Printed physical merchandise, packaging, and branding collateral.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">3</span>
              Prohibited Uses &amp; Restrictions
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              To protect the Iconderry creator community, the following actions are strictly forbidden:
            </p>
            <div className={`p-4 rounded-xl border space-y-2 text-xs ${
              isDark ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              <p>❌ <strong>No Reselling of Raw Assets:</strong> You may not repackage, re-license, or resell Iconderry vector icons as standalone icon packs or icon marketplace assets.</p>
              <p>❌ <strong>No Scraping or Cloning:</strong> You may not use automated scrapers, bots, or crawling software to mirror or replicate the Iconderry platform or database.</p>
              <p>❌ <strong>No Malicious or Unlawful Content:</strong> You may not upload vector artwork that promotes hate speech, violence, copyright infringement, or illegal material.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">4</span>
              User-Uploaded Content &amp; Custom Vectors
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              When using the "Upload SVG" or Canvas Pro import features, you retain complete ownership and copyright of any proprietary designs you upload. You are responsible for ensuring your uploaded files do not violate third-party trademarks or proprietary copyrights.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">5</span>
              Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Iconderry and all related services, tools, and export functions are provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind. In no event shall Iconderry or its creators be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-mono">6</span>
              Modifications to Service &amp; Terms
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              We reserve the right to modify, enhance, or temporarily suspend features within Iconderry at any time. Continued use of the platform after updates indicates your acceptance of revised terms.
            </p>
          </section>

          {/* Contact Box */}
          <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Questions about our Terms?</div>
                <div className="text-xs text-purple-400 font-mono">legal@iconderry.com</div>
              </div>
            </div>
            <button
              onClick={onOpenStudio}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition cursor-pointer"
            >
              Start Creating Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
