import React from 'react';
import {
  Shield, Lock, EyeOff, Database, Server, Smartphone,
  CheckCircle2, ArrowLeft, Mail, FileText, Sparkles, ExternalLink
} from 'lucide-react';

export default function PrivacyView({ appTheme = 'dark', onOpenStudio, onOpenTerms, onOpenLicense }) {
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
            {onOpenTerms && (
              <button onClick={onOpenTerms} className="text-cyan-400 hover:underline">
                Terms of Service
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mb-4 shadow-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Google Play & GDPR Compliant</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Privacy Policy
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Last Updated: October 2026. At <strong>Iconderry</strong>, your privacy and creative freedom are our highest priority. We do not sell your personal data or track your vector creations.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <EyeOff className="w-6 h-6 text-cyan-400 mb-2.5" />
            <h3 className="text-sm font-bold mb-1">Zero Activity Tracking</h3>
            <p className="text-xs text-slate-400">No ad-tech spyware, no third-party trackers, and no selling personal profile telemetry.</p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Database className="w-6 h-6 text-emerald-400 mb-2.5" />
            <h3 className="text-sm font-bold mb-1">On-Device Local Storage</h3>
            <p className="text-xs text-slate-400">Your downloaded favorites, recent studio designs, and custom theme remain locally on your phone or browser.</p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Lock className="w-6 h-6 text-purple-400 mb-2.5" />
            <h3 className="text-sm font-bold mb-1">Full Creative Ownership</h3>
            <p className="text-xs text-slate-400">Any SVG, PNG, or GIF graphics you compose and export in Iconderry belong 100% exclusively to you.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-8 ${
          isDark ? 'bg-[#181a22] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
        }`}>
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">1</span>
              Information We Collect &amp; How It Is Used
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Iconderry is designed as a standalone vector graphics tool. You do not need to register an account or provide any personal details to browse our gallery, edit vectors, or download files.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
              <li><strong>Local App Data:</strong> Favorite icons, custom stroke preferences, gradient presets, and dark/light mode choices are saved locally on your device via HTML5 LocalStorage and IndexedDB.</li>
              <li><strong>Optional Account Registration:</strong> If you optionally sign in with your email or social provider (powered by Supabase Auth), we store your email address solely to sync your personal bookmarks across devices.</li>
              <li><strong>Non-Personal Device Info:</strong> Standard crash reports and OS platform info (Android/Web) may be collected automatically by Google Play Services to ensure high stability and fix runtime bugs.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">2</span>
              Android App Permissions (Google Play)
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              When using the Iconderry Android application, we request only the minimal permissions required for core functionality:
            </p>
            <div className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-cyan-300' : 'bg-slate-50 border-slate-200 text-cyan-700'
            }`}>
              <p>• <strong>WRITE_EXTERNAL_STORAGE / Download Manager:</strong> Used only when you tap "Download SVG" or "Export PNG" to save the vector artwork to your device's Downloads directory.</p>
              <p>• <strong>INTERNET:</strong> Used to load online community icon packs, blog tutorials, and sync updates.</p>
              <p>• <strong>NO CAMERA, MICROPHONE, CONTACTS, OR LOCATION:</strong> Iconderry does not access, request, or monitor your location, camera, microphone, or contacts.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">3</span>
              Third-Party Services
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              We may utilize trusted cloud service providers to maintain the global availability of the application:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
              <li><strong>Google Play Services:</strong> Core Android framework updates, app distribution, and in-app updates.</li>
              <li><strong>Supabase:</strong> Secure authentication and encrypted cloud database for users who voluntarily create an account.</li>
              <li><strong>Cloudflare / Vercel CDN:</strong> High-speed content delivery network used to distribute static vector icons globally.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">4</span>
              Children’s Privacy (COPPA &amp; Google Families Policy)
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              Iconderry does not knowingly collect personally identifiable information from children under the age of 13. Our application provides general graphic design tools suitable for all ages without any explicit or adult material.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">5</span>
              Data Retention &amp; Right to Delete (GDPR / CCPA)
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              You have full control over your stored data. You can clear your favorites, search history, and cached icons at any time through the in-app <strong>Settings &gt; Clear Local Storage</strong> button or by clearing the app data in Android system settings.
            </p>
          </section>

          {/* Section 6: Contact */}
          <section className="space-y-3 border-t border-slate-800/60 pt-6">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-mono">6</span>
              Contact Us Regarding Privacy
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed">
              If you have any questions, feedback, or requests regarding this Privacy Policy or data protection, please contact our developer team at:
            </p>
            <div className={`p-4 rounded-xl border flex items-center justify-between flex-wrap gap-3 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Developer &amp; Legal Support</div>
                  <div className="text-xs text-cyan-400 font-mono">support@iconderry.com</div>
                </div>
              </div>
              <button
                onClick={onOpenStudio}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer"
              >
                Open Studio
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
