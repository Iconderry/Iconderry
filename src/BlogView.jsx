import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, ArrowLeft, Clock, Calendar, Tag, Share2, Check,
  BookOpen, Sparkles, ChevronRight, Zap, Layers, Activity,
  ExternalLink, Copy, CheckCircle2, Bookmark
} from 'lucide-react';
import { BLOG_POSTS, BLOG_CATEGORIES } from './blogData';

export default function BlogView({ appTheme = 'light', onOpenStudio, onSelectCategory }) {
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Active article resolution
  const activePost = useMemo(() => {
    return BLOG_POSTS.find(p => p.id === selectedPostId || p.slug === selectedPostId) || null;
  }, [selectedPostId]);

  // Scroll to top when opening an article
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedPostId]);

  // Filtered post list for browse view
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const handleShare = async (post) => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url
        });
        return;
      } catch (_) {}
    }
    // Fallback copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    } catch (_) {}
  };

  const handleCopyCode = async (codeText, idx) => {
    try {
      await navigator.clipboard.writeText(codeText.trim());
      setCopiedCodeIndex(idx);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    } catch (_) {}
  };

  // Helper to render markdown-like content cleanly
  const renderArticleBody = (content) => {
    const lines = content.trim().split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines = [];
    let codeBlockCount = 0;

    let inTable = false;
    let tableRows = [];

    const flushTable = () => {
      if (!inTable || tableRows.length === 0) return;
      const headers = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator row (---)
      elements.push(
        <div key={`table-${elements.length}`} className="my-6 overflow-x-auto rounded-xl border border-slate-700/60 shadow-lg">
          <table className="w-full text-left text-sm border-collapse">
            <thead className={appTheme === 'dark' ? 'bg-slate-900/90 text-cyan-300' : 'bg-slate-100 text-slate-800'}>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-3 font-semibold border-b border-slate-700/40">{h.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody className={appTheme === 'dark' ? 'divide-y divide-slate-800/60' : 'divide-y divide-slate-200'}>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className={appTheme === 'dark' ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-xs sm:text-sm font-medium opacity-90">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableRows = [];
    };

    lines.forEach((line, idx) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          const blockIdx = codeBlockCount++;
          const fullCode = codeLines.join('\n');
          elements.push(
            <div key={`code-${idx}`} className="my-5 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl text-xs sm:text-sm">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 uppercase font-bold text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {codeLanguage || 'code'}
                </span>
                <button
                  onClick={() => handleCopyCode(fullCode, blockIdx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  title="Copy snippet"
                >
                  {copiedCodeIndex === blockIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto font-mono text-slate-200 leading-relaxed">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          // Open code block
          flushTable();
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'javascript';
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Markdown Table line: | col1 | col2 |
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line.trim().slice(1, -1).split('|');
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable();
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className={`text-xl sm:text-2xl font-bold mt-8 mb-3.5 tracking-tight ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={idx} className={`text-base sm:text-lg font-bold mt-6 mb-2 tracking-tight ${appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-600'}`}>
            {line.replace('#### ', '')}
          </h4>
        );
        return;
      }

      // Blockquotes / Pro Tips
      if (line.startsWith('> ')) {
        elements.push(
          <div key={idx} className="my-5 p-4 rounded-xl border-l-4 border-cyan-500 bg-cyan-950/20 text-cyan-200 text-sm leading-relaxed backdrop-blur-sm">
            <span className="font-bold text-cyan-400 block mb-1">💡 Tip / Insight:</span>
            {line.replace('> ', '').replace('**Pro Tip**:', '').replace('**Design Insight**:', '')}
          </div>
        );
        return;
      }

      // Markdown Images: ![alt](url)
      const imageMatch = line.trim().match(/^!\[(.*?)\]\((https?:\/\/.*?)\)$/);
      if (imageMatch) {
        const altText = imageMatch[1];
        const imgUrl = imageMatch[2];
        elements.push(
          <figure key={`img-${idx}`} className="my-7 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-900/60 shadow-xl">
            <img
              src={imgUrl}
              alt={altText}
              loading="lazy"
              className="w-full max-h-[460px] object-cover hover:scale-[1.01] transition-transform duration-300"
            />
            {altText && (
              <figcaption className={`p-3 text-center text-xs border-t flex items-center justify-center gap-1.5 font-medium ${
                appTheme === 'dark' ? 'text-slate-400 border-slate-800 bg-slate-950/70' : 'text-slate-600 border-slate-200 bg-slate-100'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{altText}</span>
              </figcaption>
            )}
          </figure>
        );
        return;
      }

      // Horizontal dividers
      if (line.trim() === '---') {
        elements.push(<hr key={idx} className="my-8 border-t border-slate-800" />);
        return;
      }

      // Unordered lists (- item)
      if (line.trim().startsWith('- ')) {
        elements.push(
          <li key={idx} className="ml-5 list-disc text-sm sm:text-base mb-1.5 leading-relaxed opacity-90">
            <span dangerouslySetInnerHTML={{
              __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">$1</code>')
            }} />
          </li>
        );
        return;
      }

      // Ordered lists (1. item)
      if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <li key={idx} className="ml-5 list-decimal text-sm sm:text-base mb-1.5 leading-relaxed opacity-90">
            <span dangerouslySetInnerHTML={{
              __html: line.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">$1</code>')
            }} />
          </li>
        );
        return;
      }

      // Regular paragraph
      if (line.trim().length > 0) {
        elements.push(
          <p
            key={idx}
            className={`text-sm sm:text-base leading-relaxed mb-4 font-normal ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
            dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">$1</code>')
            }}
          />
        );
      }
    });

    flushTable();
    return elements;
  };

  // ==========================================
  // VIEW: SINGLE ARTICLE DETAIL READER
  // ==========================================
  if (activePost) {
    const relatedPosts = BLOG_POSTS.filter(p => p.id !== activePost.id).slice(0, 2);

    return (
      <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${appTheme === 'dark' ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Top Navigation & Back Button */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#22242c]">
            <button
              onClick={() => setSelectedPostId(null)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm ${
                appTheme === 'dark'
                  ? 'border-[#22242c] bg-[#18191f] hover:bg-[#1e2029] text-slate-300 hover:text-white'
                  : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Articles</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare(activePost)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  appTheme === 'dark'
                    ? 'border-[#22242c] bg-[#18191f] hover:bg-[#1e2029] text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="Share Article"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Article Header Banner */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0e2736] text-[#38bdf8] border border-cyan-800/40">
                {activePost.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5" /> {activePost.readTime}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5" /> {activePost.publishedAt}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {activePost.title}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed mb-6 font-medium ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {activePost.excerpt}
            </p>

            {/* Author Chip & Tags */}
            <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border ${
              appTheme === 'dark' ? 'border-[#22242c] bg-[#18191f]' : 'border-slate-200 bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-10 h-10 rounded-xl border border-cyan-500/30 shadow-md object-cover"
                />
                <div>
                  <div className="text-sm font-bold">{activePost.author.name}</div>
                  <div className="text-xs text-slate-400">{activePost.author.role}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {activePost.tags.map(tag => (
                  <span key={tag} className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    appTheme === 'dark' ? 'bg-[#121316] text-slate-300 border-[#22242c]' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Article Banner Image */}
          {activePost.coverImage && (
            <div className="mb-10 rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl relative max-h-[460px] bg-slate-950 group">
              <img
                src={activePost.coverImage}
                alt={activePost.title}
                className="w-full h-full object-cover max-h-[460px] group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/70 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Article Body Content */}
          <article className="prose prose-invert max-w-none mb-12">
            {renderArticleBody(activePost.content)}
          </article>

          {/* Interactive Studio CTA Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-cyan-900/40 border border-cyan-500/40 shadow-2xl relative overflow-hidden my-12">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-400 text-slate-950 mb-3 inline-block">
                  Live Vector Studio
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  Ready to test these techniques?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                  Jump into Iconderry Studio to edit multi-layer colors, apply 3D lighting, and download optimized SVG and 8K PNG assets for your web projects.
                </p>
              </div>
              <button
                onClick={() => onOpenStudio?.()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Iconderry Studio</span>
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="pt-8 border-t border-slate-800">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>More Guides & Tutorials</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPostId(p.id)}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-cyan-400 mb-1.5 uppercase tracking-wider">
                      {p.category}
                    </div>
                    <div className="text-base font-bold text-white group-hover:text-cyan-300 transition line-clamp-2 mb-2">
                      {p.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" /> {p.readTime} &bull; {p.publishedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: BLOG POSTS LISTING & SEARCH
  // ==========================================
  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors ${appTheme === 'dark' ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0e2736] text-[#38bdf8] border border-cyan-800/40 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Iconderry Design & Engineering Journal</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Guides, Tutorials & Vector Trends
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Master modern vector design, Core Web Vitals optimization, multi-layer SVG animations, and 3D UI iconography with in-depth engineering guides.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tutorials, React guides, 3D vector trends..."
              className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                appTheme === 'dark'
                  ? 'bg-[#18191f] border-[#22242c] text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {BLOG_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : appTheme === 'dark'
                      ? 'bg-[#18191f] border border-[#22242c] text-slate-400 hover:text-white hover:border-slate-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPostId(post.id)}
                className={`group rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  appTheme === 'dark'
                    ? 'bg-[#18191f] border-[#22242c] hover:border-[#38bdf8]/60 hover:bg-[#1e2029] shadow-xl hover:shadow-cyan-500/10'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl shadow-sm'
                }`}
              >
                {/* Visual Cover Banner with Real Image & Overlay */}
                <div className="h-48 sm:h-56 w-full relative overflow-hidden bg-slate-950 flex flex-col justify-between p-5">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 group-hover:brightness-110 transition-all duration-700 ease-out"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-tr ${post.coverGradient}`} />
                  )}
                  {/* High contrast gradient backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50" />

                  {/* Top Category Badge & Read Time */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/60 text-[#38bdf8] backdrop-blur-md border border-cyan-500/40 shadow-sm">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-white/95 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" /> {post.readTime}
                    </span>
                  </div>

                  {/* Bottom published date */}
                  <div className="relative z-10">
                    <span className="text-white/90 text-xs font-semibold px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-sm border border-white/10 inline-block">
                      {post.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-3 transition group-hover:text-cyan-400 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {post.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {post.excerpt}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-6">
                      {post.tags.map(t => (
                        <span key={t} className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          appTheme === 'dark' ? 'bg-[#121316] text-slate-300 border-[#22242c]' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Author & Read Article CTA */}
                    <div className={`flex items-center justify-between pt-4 border-t ${
                      appTheme === 'dark' ? 'border-[#22242c]' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-7 h-7 rounded-lg object-cover border border-white/20"
                        />
                        <span className="text-xs font-bold">{post.author.name}</span>
                      </div>

                      <span className="flex items-center gap-1 text-xs font-bold text-[#38bdf8] group-hover:translate-x-1 transition-transform">
                        Read Guide <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No articles found</h4>
            <p className="text-xs text-slate-400 mb-4">Try searching for other terms or reset category filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
