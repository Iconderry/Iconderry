import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X, Download, Wand2, Copy, Check, Heart, Share2,
  ExternalLink, Sparkles, ShieldCheck, Tag, ZoomIn, ZoomOut, RotateCcw,
  ArrowLeft, Layers, FileCode, CheckCircle2, ChevronRight, Eye,
  Maximize2, Film, Play, ArrowUpRight, AlertCircle, Info, Sun, Moon, Palette, Edit2
} from 'lucide-react';

import { downloadAsset } from './converter';
import { normalizeForeignObjectSvg } from './cssToSvgConverter';
import { calculateArtworkBounds } from './layerUtils';

const FORMATS = [
  { id: 'png', label: '.PNG', supportsAlpha: true },
  { id: 'svg', label: '.SVG', supportsAlpha: true },
  { id: 'ico', label: '.ICO', supportsAlpha: true },
  { id: 'webp', label: '.WEBP', supportsAlpha: true },
  { id: 'jpeg', label: '.JPEG', supportsAlpha: false },
  { id: 'gif', label: '.GIF', supportsAlpha: true }
];

const RESOLUTIONS = [
  { id: 128, label: '128px' },
  { id: 256, label: '256px' },
  { id: 512, label: '512px' },
  { id: 1024, label: '1K' },
  { id: 2048, label: '2K' },
  { id: 4096, label: '4K' },
  { id: 8192, label: '8K' }
];

export default function AssetDetailModal({
  asset,
  allAssets = [],
  isOpen,
  onClose,
  onOpenInStudio,
  isFavorite = false,
  onToggleFavorite,
  appTheme = 'light',
  onToggleTheme,
  isGalleryAdminMode = false,
  onEditDetails
}) {

  const [format, setFormat] = useState('png');
  const [resolution, setResolution] = useState(256);
  const [isTransparent, setIsTransparent] = useState(true);
  const [fitToCanvas, setFitToCanvas] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const [transparencyNotice, setTransparencyNotice] = useState('');

  const [bgPreview, setBgPreview] = useState(() => (appTheme === 'dark' ? 'dark' : 'light')); // 'dark' | 'light' | 'grid' | 'ambient'

  // Sync background preview if theme changes
  useEffect(() => {
    setBgPreview(appTheme === 'dark' ? 'dark' : 'light');
  }, [appTheme]);

  const [zoom, setZoom] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [prevAssetId, setPrevAssetId] = useState(asset?.id);
  const [relatedVisibleCount, setRelatedVisibleCount] = useState(20);
  const [historyStack, setHistoryStack] = useState([]);

  const previewContainerRef = useRef(null);
  const pageScrollRef = useRef(null);

  // Synchronous render-phase sync: If a new asset prop arrives, update immediately on render #1
  if (asset && asset.id !== prevAssetId) {
    setPrevAssetId(asset.id);
    setCurrentAsset(asset);
    setHistoryStack([]);
    setRelatedVisibleCount(20);
    setZoom(1);
    setDownloadSuccess(false);
    setShowGifModal(false);
    setTransparencyNotice('');
  }

  // Ensure scroll top is reset on external asset change
  useEffect(() => {
    if (asset) {
      if (pageScrollRef.current) {
        pageScrollRef.current.scrollTop = 0;
      }
    }
  }, [asset]);


  // Open next asset as a fresh new page with entry animation and history
  const handleOpenNextAsset = (nextAsset) => {
    if (!nextAsset || nextAsset.id === currentAsset?.id) return;
    setHistoryStack(prev => [...prev, currentAsset]);
    setCurrentAsset(nextAsset);
    setRelatedVisibleCount(20);
    setZoom(1);
    setDownloadSuccess(false);
    setShowGifModal(false);
    setTransparencyNotice('');
    // Instant snap to top for clean fresh-page feeling (no slow scroll)
    if (pageScrollRef.current) {
      pageScrollRef.current.scrollTop = 0;
    }
  };

  // Back button handler: Go back to previous asset in stack, or close to gallery
  const handleBack = () => {
    if (historyStack.length > 0) {
      const prevAsset = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      setCurrentAsset(prevAsset);
      setRelatedVisibleCount(20);
      setZoom(1);
      setDownloadSuccess(false);
      setShowGifModal(false);
      setTransparencyNotice('');
      if (pageScrollRef.current) {
        pageScrollRef.current.scrollTop = 0;
      }
    } else {
      onClose();
    }
  };


  // Freeze background scrolling, pause background CSS animations, and pause SVG SMIL animations
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-backdrop-paused');
      // Pause all SVG animations in the background gallery
      try {
        const bgSvgs = document.querySelectorAll('.gallery-card-preview svg');
        bgSvgs.forEach((svg) => {
          if (typeof svg.pauseAnimations === 'function') {
            svg.pauseAnimations();
          }
        });
      } catch (_) {}
    } else {
      document.body.classList.remove('modal-backdrop-paused');
      // Resume all SVG animations
      try {
        const bgSvgs = document.querySelectorAll('.gallery-card-preview svg');
        bgSvgs.forEach((svg) => {
          if (typeof svg.unpauseAnimations === 'function') {
            svg.unpauseAnimations();
          }
        });
      } catch (_) {}
    }

    return () => {
      document.body.classList.remove('modal-backdrop-paused');
      try {
        const bgSvgs = document.querySelectorAll('.gallery-card-preview svg');
        bgSvgs.forEach((svg) => {
          if (typeof svg.unpauseAnimations === 'function') {
            svg.unpauseAnimations();
          }
        });
      } catch (_) {}
    };
  }, [isOpen]);

  // Handle ESC key to go back or close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showGifModal) {
          setShowGifModal(false);
        } else if (historyStack.length > 0) {
          handleBack();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showGifModal, historyStack, onClose]);


  // Clean SVG code
  const cleanSvgCode = useMemo(() => {
    if (!currentAsset) return '';
    const raw = currentAsset.originalSvgCode || currentAsset.svgCode || '';
    return normalizeForeignObjectSvg(raw);
  }, [currentAsset]);

  // Smart, dynamic related assets: Ranked by tag/title keyword similarity + deterministic per-asset shuffle
  const allRelatedAssets = useMemo(() => {
    if (!currentAsset || !allAssets || allAssets.length === 0) return [];
    
    const extractTagsStr = (tags) => {
      if (!tags) return '';
      if (Array.isArray(tags)) return tags.join(' ');
      return String(tags);
    };

    // Extract keywords and tokens from current asset
    const rawTokens = `${currentAsset.title || ''} ${extractTagsStr(currentAsset.tags)} ${currentAsset.category || ''}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(w => w.length > 2);
    const currentTokens = new Set(rawTokens);

    // Fast deterministic hash function to give every asset a unique seed
    const getSeedScore = (idA, idB) => {
      const s = `${String(idA)}__${String(idB)}`;
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h + s.charCodeAt(i)) | 0;
      }
      return Math.abs(h % 100);
    };

    const scored = allAssets
      .filter(a => a && a.id !== currentAsset.id)
      .map(candidate => {
        let score = 0;

        // 1. Same category bonus
        if (candidate.category === currentAsset.category) {
          score += 40;
        }

        // 2. Keyword/tags similarity bonus
        const candTokens = `${candidate.title || ''} ${extractTagsStr(candidate.tags)}`
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(w => w.length > 2);

        for (const token of candTokens) {
          if (currentTokens.has(token)) {
            score += 25;
          }
        }

        // 3. Unique per-asset seed jitter so every icon has a completely different selection and order
        const seedJitter = getSeedScore(currentAsset.id, candidate.id);
        score += seedJitter;

        return { asset: candidate, score };
      });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored.map(s => s.asset);
  }, [currentAsset, allAssets]);



  // Paginated related assets to display (initially 20, +20 on Load More)
  const displayedRelatedAssets = useMemo(() => {
    return allRelatedAssets.slice(0, relatedVisibleCount);
  }, [allRelatedAssets, relatedVisibleCount]);


  if (!isOpen || !currentAsset) return null;

  const handleSelectFormat = (fmtId) => {
    if (fmtId === 'gif') {
      setShowGifModal(true);
      return;
    }

    setFormat(fmtId);
    setTransparencyNotice('');

    // If user picks JPEG, inform that JPEG does not support transparency
    if (fmtId === 'jpeg') {
      setIsTransparent(false);
      setTransparencyNotice('Note: JPEG does not support transparency (solid background).');
    } else {
      setIsTransparent(true);
    }
  };

  const handleToggleTransparency = () => {
    if (format === 'jpeg') {
      // User explicitly wants transparent background, but is currently on JPEG!
      // Auto-switch to PNG so they actually get transparency!
      setFormat('png');
      setIsTransparent(true);
      setTransparencyNotice('Switched format to .PNG to support transparent background!');
      setTimeout(() => setTransparencyNotice(''), 3500);
      return;
    }
    setIsTransparent(!isTransparent);
  };

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(cleanSvgCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = cleanSvgCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleDirectDownload = async () => {
    if (!currentAsset || isDownloading) return;

    if (format === 'gif') {
      setShowGifModal(true);
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      const sanitizedName = (currentAsset.title || 'icon')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/_+/g, '_');

      // Calculate auto-fit viewBox if option checked
      let autoFitViewBox = null;
      if (fitToCanvas && previewContainerRef.current) {
        try {
          autoFitViewBox = calculateArtworkBounds(previewContainerRef.current);
        } catch (_) {}
      }

      await downloadAsset({
        svgCode: cleanSvgCode,
        filename: sanitizedName,
        format: format,
        size: format === 'svg' ? 512 : resolution,
        isTransparent: format === 'jpeg' ? false : isTransparent,
        quality: 0.95,
        adjustments: {
          autoFitViewBox,
          autoFitToElements: Boolean(autoFitViewBox)
        }
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Direct download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentAsset.title,
        text: `Download ${currentAsset.title} icon on Iconderry`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isDark = appTheme === 'dark';

  const resDisplay = resolution >= 1024 ? `${resolution / 1024}K` : `${resolution}px`;
  const resHeaderLabel = resolution >= 1024 ? `${resolution / 1024}K` : `${resolution}PX`;

  let primaryDownloadText = `Download .${format.toUpperCase()} (${resDisplay})`;
  if (format === 'svg') {
    primaryDownloadText = isTransparent ? 'Download .SVG (Vector Transparent)' : 'Download .SVG (Vector)';
  } else if (format === 'jpeg') {
    primaryDownloadText = `Download .JPEG (${resDisplay}) (Solid Color)`;
  } else if (isTransparent) {
    primaryDownloadText = `Download .${format.toUpperCase()} (${resDisplay}) (Transparent)`;
  }

  return (
    <div 
      ref={pageScrollRef}
      className={`fixed inset-0 z-[100] w-full max-w-full h-full min-h-screen overflow-y-auto overflow-x-hidden flex flex-col transition-all duration-200 animate-in fade-in ${
        isDark
          ? 'bg-[#101217] text-slate-100'
          : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Top Full-Width Sticky Navigation Bar (Native Status Bar Safe Spaced) */}
      <header className={`app-detail-header sticky top-0 z-50 w-full border-b transition-colors ${
        isDark ? 'border-slate-800 bg-[#101217] shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'border-slate-200 bg-[#f8fafc] shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
          {/* Left: Back to Gallery / Previous Asset Button & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Back button visible on desktop; on mobile, hardware back button or X closes modal cleanly */}
            <button
              type="button"
              onClick={handleBack}
              className={`hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 flex-shrink-0 ${
                isDark
                  ? 'border-slate-700/80 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white shadow-sm'
                  : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title={historyStack.length > 0 ? "Back to Previous Icon (Esc)" : "Return to Gallery (Esc)"}
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>
                {historyStack.length > 0
                  ? `Back to ${historyStack[historyStack.length - 1]?.title || 'Previous'}`
                  : 'Back to Gallery'}
              </span>
            </button>

            {/* Mobile Asset Info Header (removes cramped back button on mobile) */}
            <div className="sm:hidden flex items-center gap-1.5 min-w-0">
              <span className={`text-xs font-bold truncate max-w-[140px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentAsset.title}
              </span>
              <span className="text-[9px] text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 truncate">
                {currentAsset.category}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium pl-3 border-l border-slate-700/40">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Gallery</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-cyan-400 font-semibold">{currentAsset.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[240px] font-semibold">{currentAsset.title}</span>
            </div>
          </div>

          {/* Right Action Icons (Theme Toggle, Favorite, Share, Close) */}
          <div className="flex items-center gap-2">
            {/* Quick Dark / Light Mode Toggle Button (identical to Gallery Home) */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer active:scale-95 ${
                  isDark
                    ? 'bg-[#18191f] border-[#22242c] text-cyan-400 hover:text-white hover:border-[#38bdf8]/40'
                    : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 hover:border-slate-300 shadow-sm'
                }`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleFavorite && onToggleFavorite(currentAsset.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isFavorite
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                  : isDark
                    ? 'border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-rose-400'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-rose-500'
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Share Icon"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-white'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Body Container */}
      <div 
        key={currentAsset.id} 
        className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-0 sm:pt-6 pb-36 sm:pb-44 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            
            {/* Left 7 Columns: Big Half-Screen Artwork Stage (Scrolls naturally on mobile and PC) */}
            <div className={`lg:col-span-7 flex flex-col items-center relative w-full transition-colors ${
              isDark ? 'bg-[#101217]' : 'bg-[#f8fafc]'
            } pt-1 pb-3 sm:mx-0 sm:px-0 border-b lg:border-b-0`}>
              <div 
                ref={previewContainerRef}
                className={`w-full h-[240px] xs:h-[270px] sm:h-[340px] lg:h-auto lg:aspect-square lg:max-h-[580px] rounded-2xl sm:rounded-3xl border flex items-center justify-center relative overflow-hidden transition-all shadow-inner ${
                  bgPreview === 'dark' 
                    ? 'bg-[#0d1017] border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Floating Action Buttons at Top Right of Preview */}
                <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-20 flex items-center gap-2">
                  {isGalleryAdminMode && onEditDetails && (
                    <button
                      type="button"
                      onClick={() => onEditDetails(currentAsset)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 backdrop-blur-md text-xs font-bold shadow-lg shadow-purple-900/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      title="Edit Item Details (Title, Description, Category, Tags)"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-purple-200" />
                      <span>Edit Details</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenInStudio && onOpenInStudio(currentAsset, 'colors')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-blue-600 text-white border border-white/20 hover:border-blue-400 backdrop-blur-md text-xs font-bold shadow-lg shadow-black/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
                    title="Customize & Edit in Studio"
                  >
                    <Palette className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
                    <span>Edit in Studio</span>
                  </button>
                </div>

                {/* The Big SVG Artwork */}
                <div 
                  className="w-full h-full flex items-center justify-center p-4 sm:p-8 lg:p-10 transition-transform duration-200 ease-out select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[170px] xs:[&>svg]:max-w-[200px] sm:[&>svg]:max-w-[280px] lg:[&>svg]:max-w-[380px] [&>svg]:max-h-[170px] xs:[&>svg]:max-h-[200px] sm:[&>svg]:max-h-[280px] lg:[&>svg]:max-h-[380px] [&>svg]:block [&>svg]:overflow-visible"
                  style={{ transform: `scale(${zoom})` }}
                  dangerouslySetInnerHTML={{ __html: cleanSvgCode }}
                />

                {/* Combined Single Dark / Light Toggle at Bottom Left */}
                <button
                  type="button"
                  onClick={() => setBgPreview(prev => prev === 'dark' ? 'light' : 'dark')}
                  className={`absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-95 select-none ${
                    bgPreview === 'dark'
                      ? 'bg-black/60 hover:bg-black/80 text-white border border-white/15'
                      : 'bg-white/95 hover:bg-white text-slate-800 border border-slate-300 shadow-md'
                  }`}
                  title={bgPreview === 'dark' ? 'Switch to Light background' : 'Switch to Dark background'}
                >
                  {bgPreview === 'dark' ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light</span>
                    </>
                  )}
                </button>

                {/* Zoom controls at Bottom Right */}
                <div className={`absolute bottom-3 right-3 flex items-center gap-1 p-1 rounded-xl backdrop-blur-md ${
                  bgPreview === 'dark'
                    ? 'bg-black/60 border border-white/10'
                    : 'bg-white/95 border border-slate-300 shadow-md'
                }`}>
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.max(0.7, prev - 0.2))}
                    className={`p-1 rounded-lg cursor-pointer ${
                      bgPreview === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className={`text-[10px] font-mono px-1 ${
                    bgPreview === 'dark' ? 'text-slate-300' : 'text-slate-800 font-bold'
                  }`}>{Math.round(zoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom(prev => Math.min(2.5, prev + 0.2))}
                    className={`p-1 rounded-lg cursor-pointer ${
                      bgPreview === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {zoom !== 1 && (
                    <button
                      type="button"
                      onClick={() => setZoom(1)}
                      className={`p-1 rounded-lg cursor-pointer ${
                        bgPreview === 'dark'
                          ? 'text-cyan-400 hover:text-cyan-300 hover:bg-white/10'
                          : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                      }`}
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Details Pills beneath Hero */}
              <div className="flex items-center justify-between w-full mt-3 px-1 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Free Commercial & Personal License</span>
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {currentAsset.downloads || 0} Downloads
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Specs, Target Format, Resolution & Download Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              {/* Asset Info Header */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {currentAsset.category}
                  </span>
                  {currentAsset.isNew && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      NEW
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5">
                  {currentAsset.title}
                </h1>
                
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentAsset.description || 'Fully vector crafted asset. Choose your target format and resolution below for instant high-speed export.'}
                </p>
              </div>

              {/* 1. TARGET FORMAT SECTION */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  TARGET FORMAT
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {FORMATS.map(f => {
                    const isSelected = format === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleSelectFormat(f.id)}
                        className={`px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30 border border-blue-500 scale-[1.03]'
                            : isDark
                              ? 'bg-[#181d2a] hover:bg-[#20273a] text-slate-300 border border-slate-700/70'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. EXPORT RESOLUTION SECTION */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  EXPORT RESOLUTION ({resHeaderLabel} STANDARD)
                </label>
                
                {/* 2-Row Resolution Grid matching screenshot */}
                <div className="space-y-2">
                  {/* Row 1: 128px, 256px, 512px, 1K */}
                  <div className="grid grid-cols-4 gap-2">
                    {RESOLUTIONS.slice(0, 4).map(r => {
                      const isSelected = resolution === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setResolution(r.id)}
                          className={`py-2 px-2 text-center rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30 border border-blue-500'
                              : isDark
                                ? 'bg-[#181d2a] hover:bg-[#20273a] text-slate-300 border border-slate-700/60'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: 2K, 4K, 8K */}
                  <div className="grid grid-cols-4 gap-2">
                    {RESOLUTIONS.slice(4).map(r => {
                      const isSelected = resolution === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setResolution(r.id)}
                          className={`py-2 px-2 text-center rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2563eb] text-white shadow-md shadow-blue-600/30 border border-blue-500'
                              : isDark
                                ? 'bg-[#181d2a] hover:bg-[#20273a] text-slate-300 border border-slate-700/60'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. OPTION CARDS (Transparent Background & Fit Canvas) */}
              <div className="space-y-2.5">
                
                {/* Transparent Background Option */}
                <label 
                  onClick={handleToggleTransparency}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition select-none ${
                    isDark
                      ? 'bg-[#141722] hover:bg-[#1a1e2d] border-slate-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="pr-3">
                    <div className="flex items-center gap-2">
                      <span className="block font-semibold text-xs sm:text-sm leading-tight">
                        Transparent Background
                      </span>
                      {format === 'jpeg' && (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          (Click to switch to PNG)
                        </span>
                      )}
                    </div>
                    <span className={`block text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {format === 'jpeg' 
                        ? 'JPEG format cannot be transparent (solid white). Click here to auto-switch to PNG for transparency.'
                        : 'Renders transparent background without solid color.'}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition ${
                    isTransparent && format !== 'jpeg'
                      ? 'bg-[#2563eb] text-white' 
                      : isDark ? 'border border-slate-600 bg-slate-800' : 'border border-slate-300 bg-white'
                  }`}>
                    {isTransparent && format !== 'jpeg' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </label>

                {/* Transparency Notice Toast */}
                {transparencyNotice && (
                  <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                    <span>{transparencyNotice}</span>
                  </div>
                )}

                {/* Fit Canvas to All Elements Option */}
                <label 
                  onClick={() => setFitToCanvas(!fitToCanvas)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition select-none ${
                    isDark
                      ? 'bg-[#141722] hover:bg-[#1a1e2d] border-slate-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center flex-shrink-0">
                      <Maximize2 className="w-4 h-4 text-slate-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm leading-tight">
                          Fit Canvas to All Elements
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          Illustrator Auto-Fit
                        </span>
                      </div>
                      <span className={`block text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Fits all elements into frame without clipping, even when widely spaced.
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition ${
                    fitToCanvas 
                      ? 'bg-[#2563eb] text-white' 
                      : isDark ? 'border border-slate-600 bg-slate-800' : 'border border-slate-300 bg-white'
                  }`}>
                    {fitToCanvas && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </label>
              </div>

              {/* 4. PRIMARY GREEN DOWNLOAD BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleDirectDownload}
                  disabled={isDownloading}
                  className="w-full bg-[#009b63] hover:bg-[#008755] active:scale-[0.99] disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 transition cursor-pointer text-sm sm:text-base"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating {format.toUpperCase()}...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>{primaryDownloadText}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 5. SECONDARY STUDIO & COPY ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Customize in Studio - Flagship Gradient Action */}
                <button
                  type="button"
                  onClick={() => onOpenInStudio && onOpenInStudio(currentAsset, 'colors')}
                  className="relative group overflow-hidden py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 shadow-md hover:shadow-lg shadow-indigo-500/25 active:scale-[0.98] border border-white/20"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out pointer-events-none" />
                  <div className="p-1 rounded-lg bg-white/15 backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                    <Wand2 className="w-4 h-4 text-cyan-200" />
                  </div>
                  <span className="tracking-wide">Customize in Studio</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </button>

                {/* Copy Raw SVG */}
                <button
                  type="button"
                  onClick={handleCopySvg}
                  className={`py-3 px-4 rounded-xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
                    isCopied
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-bold'
                      : isDark
                        ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>Copy SVG Code</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Bottom Section: "More Like This" Related Assets (20 initial items + 20 on Load More) */}
            {displayedRelatedAssets.length > 0 && (
              <div className={`lg:col-span-12 pt-8 sm:pt-10 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2.5">
                    <span>More Like This</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      {allRelatedAssets.length} assets
                    </span>
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Handpicked related assets in <span className="text-cyan-400 font-bold">{currentAsset.category}</span>
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-xl self-start sm:self-auto border border-slate-700/50 bg-slate-800/60 text-slate-300">
                  Showing {displayedRelatedAssets.length} of {allRelatedAssets.length}
                </span>
              </div>

              {/* Responsive Grid of Similar Items (2 cards per row on mobile, 3-5 on desktop) */}
              <div className="gallery-grid-responsive">
                {displayedRelatedAssets.map((relItem) => (
                  <button
                    key={relItem.id}
                    type="button"
                    onClick={() => handleOpenNextAsset(relItem)}
                    className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border text-center flex flex-col items-center justify-between group transition-all duration-150 cursor-pointer active:scale-95 touch-manipulation w-full min-w-0 ${
                      isDark
                        ? 'bg-[#18191f] border-[#22242c] hover:border-[#38bdf8]/60 hover:bg-[#1e2029] shadow-sm hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.7)]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-white shadow-sm'
                    }`}
                  >
                    <div 
                      className="w-full h-20 sm:h-24 flex items-center justify-center p-1.5 sm:p-2 mb-1.5 transition-transform duration-200 group-hover:scale-105 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:overflow-visible overflow-visible"
                      dangerouslySetInnerHTML={{
                        __html: normalizeForeignObjectSvg(relItem.originalSvgCode || relItem.svgCode)
                      }}
                    />
                    <span className={`text-[11px] sm:text-xs font-semibold truncate w-full group-hover:text-cyan-400 transition-colors ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {relItem.title}
                    </span>
                    <div className="flex items-center justify-between w-full mt-1 px-0.5 text-[9px] sm:text-[10px] text-slate-400">
                      <span className="truncate">{relItem.category}</span>
                      <span className="flex-shrink-0 ml-1">{relItem.downloads || 0} dl</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Load More Button (+20 more items) - Plentiful padding ensures 100% full visibility on PC and all devices */}
              {relatedVisibleCount < allRelatedAssets.length && (
                <div className="flex flex-col items-center justify-center pt-10 pb-16">
                  <button
                    type="button"
                    onClick={() => setRelatedVisibleCount(prev => prev + 20)}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2.5 border transition-all duration-200 shadow-xl active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-cyan-400/40 shadow-cyan-950/60'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400 shadow-blue-500/20'
                    }`}
                  >
                    <Layers className="w-4 h-4 text-white animate-pulse" />
                    <span>Load More Related Items (+20)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 text-white ml-1 font-extrabold">
                      {Math.min(20, allRelatedAssets.length - relatedVisibleCount)} more
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>


      {/* 🚀 GIF ANIMATION STUDIO POPUP MODAL */}
      {showGifModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowGifModal(false)}
        >
          <div 
            className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 relative transition-all animate-in zoom-in-95 duration-150 ${
              isDark 
                ? 'bg-[#161926] border-purple-500/40 text-slate-100 shadow-purple-950/50' 
                : 'bg-white border-purple-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close */}
            <button
              type="button"
              onClick={() => setShowGifModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Animation Icon Header */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-600/30">
              <Film className="w-7 h-7 animate-pulse" />
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2">
              Animated GIF Studio
            </h3>

            <p className={`text-xs sm:text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              GIF exports generate dynamic frame animations (like continuous 360° spin, floating hover, bounce, or color pulse).
              <br /><br />
              Open this asset in <strong>Studio</strong> to configure animation speed, frames, loop modes, and preview live before exporting!
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowGifModal(false);
                  onOpenInStudio && onOpenInStudio(currentAsset, 'gif');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in Studio & Configure GIF</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowGifModal(false);
                  setFormat('png');
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Cancel & Stay on PNG
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
