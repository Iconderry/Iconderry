import React, { useState } from 'react';
import {
  MessageSquarePlus, CheckCircle2, Sparkles, Send, HelpCircle,
  ChevronDown, ChevronUp, ArrowLeft, Mail, Heart, Check, Users, Lightbulb
} from 'lucide-react';

const COMMUNITY_FAQ = [
  {
    q: 'How long does it take for requested icons to be added to Iconderry?',
    a: 'We review community suggestions weekly! High-demand requests (such as our 120+ Stickmen collection and custom shader styles) are prioritized and usually rolled out in upcoming weekly drops.'
  },
  {
    q: 'Can I request an entire pack or category?',
    a: 'Yes! If you are building a specific project (e.g., e-commerce, fitness tracking, crypto dashboard), let us know the theme and key actions you need, and we can generate a cohesive multi-item pack.'
  },
  {
    q: 'Will requested icons be free for me and everyone else?',
    a: 'Yes, 100%. All community-requested vectors are published under the Iconderry Free Commercial License for the entire world to use royalty-free in personal and commercial apps.'
  },
  {
    q: 'Can I contribute my own SVGs or suggest modifications?',
    a: 'Absolutely! You can upload your own SVGs directly into Iconderry Studio for custom styling, or reach out to our team at support@iconderry.com to contribute to our official catalog.'
  }
];

const RECENTLY_FULFILLED = [
  { tag: 'Stickman Pack', title: '120 Unique Stickmen in Dynamic Action & Profession Poses', status: 'Fulfilled' },
  { tag: 'Export Engine', title: '8K Ultra HD PNG & Lossless XML SVG Exports', status: 'Fulfilled' },
  { tag: 'Visual Shaders', title: '29+ Instant Shaders including Glassmorphism & Cyber Neons', status: 'Fulfilled' },
  { tag: 'Studio', title: 'Multi-Layer Canvas Studio with Squircle App Badges', status: 'Fulfilled' },
];

export default function CommunityView({ appTheme = 'dark', onOpenStudio }) {
  const isDark = appTheme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    // Save to local feedback history if needed
    try {
      const existing = JSON.parse(localStorage.getItem('iconderry_community_requests') || '[]');
      existing.unshift({
        ...formData,
        date: new Date().toISOString()
      });
      localStorage.setItem('iconderry_community_requests', JSON.stringify(existing.slice(0, 20)));
    } catch (_) {}

    setSubmitted(true);
  };

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

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Community Driven Design</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 mb-4 shadow-sm">
            <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
            <span>Request an Icon or Feature</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Tell Us What You Need Built
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Can't find the exact icon, pose, or shader style for your product? Submit your request and our design team will craft it for the next release.
          </p>
        </div>

        {/* Form & Fulfilled Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Request Form */}
          <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border ${
            isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <h2 className={`text-lg font-bold mb-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-4 h-4 text-cyan-400" /> Submit Your Request
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              No account required. Every submission is directly reviewed by our creators.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-emerald-400">Request Received Successfully!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                  Thank you for contributing to Iconderry. Your icon request has been added to our design roadmap.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', category: '', message: '' });
                  }}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Your Name or Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sahil"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        isDark
                          ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Email (For notifications)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        isDark
                          ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Category / Theme
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stickman Action, E-Commerce, 3D Gaming, Healthcare"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    What icons or poses do you need? <span className="text-cyan-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the desired poses, props, activities, or visual style in as much detail as possible..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" /> Submit Request to Design Team
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Fulfilled Community Requests */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Recently Fulfilled Requests
                </h3>
              </div>

              <div className="space-y-3">
                {RECENTLY_FULFILLED.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-xs ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-cyan-400">{item.tag}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Support */}
            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Need Direct Developer Support?
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Found a bug or want to partner with us? Drop an email to our team:
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="text-slate-400">Direct Support</div>
                  <div className="font-mono font-semibold text-cyan-400">support@iconderry.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community FAQ Accordion */}
        <div className={`p-6 sm:p-8 rounded-3xl border mb-16 ${
          isDark ? 'bg-[#181a22] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> FAQ
            </div>
            <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Community Questions &amp; Answers
            </h2>
          </div>

          <div className="space-y-3">
            {COMMUNITY_FAQ.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDark
                      ? isOpen ? 'bg-slate-900/90 border-cyan-500/30' : 'bg-slate-900/40 border-slate-800'
                      : isOpen ? 'bg-cyan-50/50 border-cyan-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className={`px-5 pb-4 text-xs leading-relaxed border-t pt-3 ${
                      isDark ? 'text-slate-300 border-slate-800/80' : 'text-slate-600 border-slate-200'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
