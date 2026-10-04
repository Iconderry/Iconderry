import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, HelpCircle, ChevronDown,
  ChevronUp, Copy, Check, Sparkles, FileText, ArrowRight, Shield
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'Do I need to give attribution or link back to Iconderry?',
    a: 'Attribution is NOT legally required for personal or commercial projects. You can use any downloaded icon in your apps, websites, and client projects without placing our name. However, a shoutout or link back to iconderry.vercel.app is always deeply appreciated by our community!'
  },
  {
    q: 'Can I use Iconderry icons in paid commercial client projects?',
    a: 'Yes! You have full commercial rights. Whether you are building an e-commerce store, a paid SaaS dashboard, or a mobile app for a paying client, you are completely free to use, recolor, and export any vector asset.'
  },
  {
    q: 'Can I upload icons inside mobile apps on the Apple App Store and Google Play?',
    a: 'Absolutely. You can embed the SVGs, 8K PNGs, or WebP files directly into your iOS (Swift/SwiftUI), Android (Kotlin), Flutter, or React Native production builds without any licensing royalties.'
  },
  {
    q: 'Can I modify the icons in Iconderry Studio, Figma, or Illustrator?',
    a: 'Yes. You are encouraged to modify colors, stroke weights, add 3D extrusion, lighting glows, or combine multiple icons into custom artwork.'
  },
  {
    q: 'What is strictly PROHIBITED under this license?',
    a: 'You CANNOT take Iconderry icons and resell them as a standalone icon pack, bundle them on a competing icon marketplace, or offer an automated API that clones our library. In short: use them freely in your products, but do not resell our raw assets as icon packs.'
  },
  {
    q: 'Can I trademark an icon as my company logo?',
    a: 'Because Iconderry icons are publicly available to everyone under a free commercial license, you cannot register exclusive trademark rights to a raw, unmodified icon. However, if you significantly customize and incorporate an icon as part of a unique composite brand logo, that composite work belongs to you.'
  },
  {
    q: 'Are animated GIFs and WebP exports covered under the same license?',
    a: 'Yes! All export formats produced by Iconderry Studio (SVG, PNG up to 8K, WebP, GIF, 3D Canvas assets) are governed by this exact same royalty-free license.'
  },
  {
    q: 'Is there any monthly subscription or hidden fee?',
    a: 'No. Iconderry is 100% free to search, edit, style, and download. There are no surprise watermarks or paywalls.'
  }
];

export default function LicenseView({ appTheme = 'light', onOpenStudio }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const legalDisclaimerText = `Iconderry Free Commercial License:
All vector icons, SVG code, PNG images, and graphic assets downloaded from Iconderry (iconderry.vercel.app) are licensed for both personal and commercial use worldwide, perpetually and royalty-free.

Permitted: Commercial & personal websites, SaaS apps, mobile applications, client deliverables, advertising, social media graphics, print media, and modified derivative works.
Prohibited: Reselling, bundling, or redistributing the raw vector files as a standalone icon set or competing graphics repository.
Attribution: Not required, but appreciated.`;

  const handleCopyNotice = async () => {
    try {
      await navigator.clipboard.writeText(legalDisclaimerText);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2200);
    } catch (_) {}
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors ${appTheme === 'dark' ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Free for Commercial & Personal Use</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Iconderry Commercial License & Terms
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Simple, transparent, and developer-friendly. Use our vector icons in your apps, websites, client projects, and SaaS products with complete peace of mind.
          </p>
        </div>

        {/* Allowed vs Prohibited Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* Permitted Box */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            appTheme === 'dark'
              ? 'bg-[#18191f] border-emerald-500/30 shadow-xl shadow-emerald-950/20'
              : 'bg-white border-emerald-300 shadow-lg shadow-emerald-100'
          }`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500/20">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-400">What is Permitted?</h3>
                <p className="text-xs text-slate-400">Free forever without royalties</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Commercial Websites & SaaS</strong>: Use in web applications, landing pages, and production dashboards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Mobile Applications</strong>: Embed in native iOS (App Store) and Android (Google Play) builds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Client & Agency Projects</strong>: Deliver final websites and assets to paying freelance clients.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Full Modification Rights</strong>: Recolor, reshape, add 3D depth, and apply filters in Iconderry Studio.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Marketing & Print</strong>: Social graphics, pitch decks, YouTube thumbnails, stickers, and physical merchandise.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>No Attribution Required</strong>: You don't need to put our name or link on your projects.</span>
              </li>
            </ul>
          </div>

          {/* Prohibited Box */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            appTheme === 'dark'
              ? 'bg-[#18191f] border-rose-500/30 shadow-xl shadow-rose-950/20'
              : 'bg-white border-rose-200 shadow-lg shadow-rose-50'
          }`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-500/20">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-400">What is Prohibited?</h3>
                <p className="text-xs text-slate-400">Protecting creator community rights</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm font-medium">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Raw Resale</strong>: You cannot sell or distribute our raw SVG vector files as a standalone icon pack on Etsy, ThemeForest, or other marketplaces.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Competing Icon Repositories</strong>: You cannot scrape and rehost our catalog to build a clone icon service.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Trademarking Raw Icons</strong>: You cannot register an unmodified Iconderry icon as your exclusive legal trademark.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Deceptive Re-licensing</strong>: You cannot claim that you are the original creator of our stock icon library.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyable Plain-English Legal Disclaimer Box */}
        <div className={`p-6 sm:p-7 rounded-3xl border mb-12 ${
          appTheme === 'dark' ? 'bg-[#18191f] border-[#22242c]' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold">Standard License Notice for Audit / Legal Review</h3>
            </div>
            <button
              onClick={handleCopyNotice}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition text-xs font-semibold cursor-pointer ${
                appTheme === 'dark' ? 'border-[#22242c] bg-[#121316] hover:bg-[#1e2029] text-slate-200' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {copiedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy License Text</span>
                </>
              )}
            </button>
          </div>
          <pre className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-all ${
            appTheme === 'dark' ? 'bg-[#14151a] border-[#22242c] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            {legalDisclaimerText}
          </pre>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Frequently Asked Legal Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about rights and permissions.</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? appTheme === 'dark'
                        ? 'bg-[#18191f] border-cyan-500/50 shadow-md'
                        : 'bg-white border-blue-400 shadow-md'
                      : appTheme === 'dark'
                        ? 'bg-[#18191f]/60 border-[#22242c] hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold cursor-pointer"
                  >
                    <span className="pr-4">{item.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className={`px-4 pb-5 sm:px-5 text-xs sm:text-sm leading-relaxed border-t ${
                      appTheme === 'dark' ? 'border-[#22242c] text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}>
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Studio CTA Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 ${
          appTheme === 'dark' ? 'bg-[#131d2b] border-[#1e3a5f]/80' : 'bg-gradient-to-r from-blue-900/40 via-cyan-900/40 to-emerald-900/40 border-cyan-500/40'
        }`}>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Start Designing Without Restrictions
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Explore thousands of vector icons, customize with 3D effects, and download production-ready code with complete commercial freedom.
            </p>
          </div>
          <button
            onClick={() => onOpenStudio?.()}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Iconderry Gallery</span>
          </button>
        </div>
      </div>
    </div>
  );
}
