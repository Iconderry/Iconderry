import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Download, PlusCircle, LayoutGrid, Search, Trash2, CheckCircle2,
  Zap, UploadCloud, Sliders, Palette, RotateCw,
  FlipHorizontal, FlipVertical, RefreshCw, Sparkles, Sun, Droplet,
  Paintbrush, Undo2, Redo2, Layers, Check, ArrowLeft, X, ChevronDown, ChevronUp, ChevronRight,
  Settings, Moon, RotateCcw, SlidersHorizontal, HardDrive, Monitor,
  ZoomIn, ZoomOut, Maximize2, Link2, Unlink2, Wand2, Scan,
  Heart, Shapes, MessageSquarePlus, Shield, FileText, Info,
  Box, Compass, Move3d, Film, Play, Activity, GripVertical,
  Move, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Copy,
  Crosshair, AlignCenter, AlignLeft, AlignRight, Bold, Italic, Type, Square, Highlighter, Eraser, PenTool,
  HelpCircle, Smartphone, MousePointer, Keyboard,
  FolderPlus, Folder, Tag, Edit2, FileUp, Grid2X2, Grid3X3, ArrowUpDown, Filter,
  Save, ClipboardPaste, Loader2, BookOpen, ShieldCheck, User, LogOut, Package,
  Lock, Unlock, KeyRound, Eye, EyeOff
} from 'lucide-react';
import { INITIAL_ELEMENTS } from './initialData';
import { downloadAsset } from './converter';
import { extractSvgColors, replaceSvgColors, scopeSvgIds, normalizeColor, getLinkedGradientColors, adjustColorBrightness, applyUniversalStroke, hslToHex, hexToHsl } from './colorUtils';
import { STYLE_RENDER_MODES, transformSvgStyle } from './styleTransformer';
import { extractSvgLayers, applyLayerTransforms, calculateArtworkBounds, tagSvgElements, isSystemWrapper, getParentTransformMatrix } from './layerUtils';
import { supabase } from './supabaseClient';
import { GOOGLE_FONTS_LIST, TEXT_PRESETS, SHAPES_PRESETS, smoothFreehandPath, injectCanvasObjectsIntoSvg } from './canvasProElements';
import { saveElementsToDB, loadElementsFromDB } from './idbStorage';
import BlogView from './BlogView';
import LicenseView from './LicenseView';
import SettingsView from './SettingsView';
import { isCssOrHtmlContent, convertCssToSvg, normalizeForeignObjectSvg } from './cssToSvgConverter';
import AssetDetailModal from './AssetDetailModal';
import AuthModal from './AuthModal';
import EditAssetDetailsModal from './components/EditAssetDetailsModal';
import { App as CapApp } from '@capacitor/app';


export const GRADIENT_PRESETS = [
  { id: 'cyber_neon', name: 'Cyber Neon', from: '#06b6d4', to: '#3b82f6', angle: 135 },
  { id: 'sunset_flare', name: 'Sunset Flare', from: '#f97316', to: '#ec4899', angle: 45 },
  { id: 'electric_violet', name: 'Electric Violet', from: '#8b5cf6', to: '#d946ef', angle: 90 },
  { id: 'deep_ocean', name: 'Deep Ocean', from: '#0ea5e9', to: '#1e3a8a', angle: 180 },
  { id: 'royal_gold', name: 'Royal Gold', from: '#f59e0b', to: '#ca8a04', angle: 45 },
  { id: 'neon_emerald', name: 'Neon Emerald', from: '#10b981', to: '#059669', angle: 135 },
  { id: 'dark_nebula', name: 'Dark Nebula', from: '#6366f1', to: '#0f172a', angle: 225 },
  { id: 'cotton_candy', name: 'Cotton Candy', from: '#f472b6', to: '#38bdf8', angle: 45 },
  { id: 'coral_sun', name: 'Coral Sun', from: '#fb7185', to: '#f59e0b', angle: 90 },
  { id: 'aurora_borealis', name: 'Aurora Borealis', from: '#34d399', to: '#60a5fa', angle: 120 },
  { id: 'flaming_lava', name: 'Flaming Lava', from: '#ef4444', to: '#f59e0b', angle: 0 },
  { id: 'silver_chrome', name: 'Silver Chrome', from: '#cbd5e1', to: '#475569', angle: 180 },
];

const DEFAULT_ADJUSTMENTS = {
  hue: 0,
  brightness: 100,
  saturation: 100,
  contrast: 100,
  sepia: 0,
  invert: 0,
  opacity: 100,
  blur: 0,
  shadowBlur: 0,
  shadowColor: '#38bdf8',
  rotation: 0,
  flipH: false,
  flipV: false,
  rotateX: 0,
  rotateY: 0,
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  perspective: 800,
  skewX: 0,
  skewY: 0,
  depth3D: 0,
  depth3DColor: '#000000',
  extrusionDepth: 0,
  extrusionColor: 'rgba(0,0,0,0.65)',
  is3DFloating: false,
  animPreset: 'float',
  animSpeed: 2.2,
  animHeight: 16,
  animShadowSync: true,
  animFps: 60,
  customColor: '',
  colorReplacements: {}
};

export const MOTION_PRESETS = [
  { id: 'float', name: 'Levitate', icon: '🚀', desc: 'Smooth vertical floating' },
  { id: 'bounce', name: 'Bounce', icon: '🏀', desc: 'Ground bounce with squash' },
  { id: 'pulse', name: 'Pulse', icon: '💓', desc: 'Rhythmic scale expansion' },
  { id: 'heartbeat', name: 'Heartbeat', icon: '🫀', desc: 'Living double-beat' },
  { id: 'spin360', name: '360° Spin', icon: '🔄', desc: 'Continuous Y-axis spin' },
  { id: 'flip3d', name: '3D Flip', icon: '🔁', desc: 'Vertical flip somersault' },
  { id: 'wobble', name: 'Wobble 3D', icon: '🎭', desc: 'Dual-axis 3D tilt' },
  { id: 'twist', name: '3D Twist', icon: '🌪️', desc: 'Rotational 3D twisting' },
  { id: 'wave', name: 'Wave', icon: '🌊', desc: 'Oceanic swell & tilt' },
  { id: 'swing', name: 'Swing', icon: '🎪', desc: 'Top-anchored pendulum' },
  { id: 'orbit', name: 'Orbit', icon: '🪐', desc: 'Circular floating path' },
  { id: 'hover3d', name: '3D Tilt', icon: '✨', desc: 'Subtle high-end tilt' },
  { id: 'jiggle', name: 'Jiggle', icon: '⚡', desc: 'Rapid playful vibration' },
  { id: 'glitch', name: 'Glitch', icon: '👾', desc: 'Cyberpunk shift jumps' },
  { id: 'none', name: 'Static', icon: '⏸️', desc: 'Single frame still GIF' }
];

export const getPresetAnimClass = (presetId) => {
  switch (presetId) {
    case 'float': return 'animate-floating-3d';
    case 'bounce': return 'animate-bounce-3d';
    case 'pulse': return 'animate-pulse-3d';
    case 'heartbeat': return 'animate-heartbeat-3d';
    case 'spin360': return 'animate-spin-3d';
    case 'flip3d': return 'animate-flip-3d';
    case 'wobble': return 'animate-wobble-3d';
    case 'twist': return 'animate-twist-3d';
    case 'wave': return 'animate-wave-3d';
    case 'swing': return 'animate-swing-3d';
    case 'orbit': return 'animate-orbit-3d';
    case 'hover3d': return 'animate-hover-3d';
    case 'jiggle': return 'animate-jiggle-3d';
    case 'glitch': return 'animate-glitch-3d';
    case 'none': return 'animate-none-3d';
    default: return 'animate-floating-3d';
  }
};

export const STUDIO_TABS = [
  { id: 'colors', label: 'Colors', icon: Sliders },
  { id: 'gradient', label: 'Gradient', icon: Palette },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'shapes', label: 'Shapes', icon: Shapes },
  { id: 'draw', label: 'Draw', icon: PenTool },
  { id: 'filters', label: 'Filters', icon: Wand2 },
  { id: 'effects', label: 'Effects', icon: Sparkles },
  { id: 'dimensions', label: 'Size', icon: Maximize2 },
  { id: 'transform', label: '3D Tilt', icon: Move3d },
  { id: 'gif', label: 'GIF', icon: Film },
  { id: 'export', label: 'Export', icon: Download }
];

const EFFECT_PRESETS = [
  {
    id: 'original',
    name: 'Original Clean',
    category: 'All',
    badge: 'Standard',
    desc: 'Pure original vector colors without any grading',
    colorA: '#94a3b8',
    colorB: '#475569',
    adjustments: { hue: 0, saturation: 100, contrast: 100, brightness: 100, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 0, shadowColor: '#38bdf8' }
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    category: 'Neon & Cyber',
    badge: 'Cyberpunk',
    desc: 'Electric cyan glow with high contrast and radiance',
    colorA: '#06b6d4',
    colorB: '#2563eb',
    adjustments: { hue: 180, saturation: 180, contrast: 130, brightness: 110, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#00f0ff' }
  },
  {
    id: 'neon_synthwave',
    name: 'Neon Synthwave',
    category: 'Neon & Cyber',
    badge: 'Synthwave',
    desc: 'Retro 80s hot-pink & magenta laser radiance',
    colorA: '#d946ef',
    colorB: '#ec4899',
    adjustments: { hue: 290, saturation: 190, contrast: 125, brightness: 108, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 25, shadowColor: '#f43f5e' }
  },
  {
    id: 'acid_lime',
    name: 'Acid Lime Neon',
    category: 'Neon & Cyber',
    badge: 'Radioactive',
    desc: 'High-voltage electric chartreuse yellow-green',
    colorA: '#84cc16',
    colorB: '#10b981',
    adjustments: { hue: 95, saturation: 200, contrast: 135, brightness: 115, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#a3e635' }
  },
  {
    id: 'electric_violet',
    name: 'Electric Ultraviolet',
    category: 'Neon & Cyber',
    badge: 'UV Blacklight',
    desc: 'Deep cosmic purple & ultraviolet fluorescence',
    colorA: '#8b5cf6',
    colorB: '#6366f1',
    adjustments: { hue: 260, saturation: 185, contrast: 125, brightness: 112, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 26, shadowColor: '#a855f7' }
  },
  {
    id: 'tokyo_night',
    name: 'Tokyo Night',
    category: 'Neon & Cyber',
    badge: 'Neo Tokyo',
    desc: 'Cyberpunk teal & deep neon purple rain aesthetic',
    colorA: '#0ea5e9',
    colorB: '#a855f7',
    adjustments: { hue: 215, saturation: 175, contrast: 130, brightness: 105, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#38bdf8' }
  },
  {
    id: 'sunset_radiant',
    name: 'Sunset Radiant',
    category: 'Warm & Golden',
    badge: 'Golden Hour',
    desc: 'Warm sun-drenched amber & fiery orange glow',
    colorA: '#f59e0b',
    colorB: '#ea580c',
    adjustments: { hue: 35, saturation: 175, contrast: 120, brightness: 105, sepia: 15, invert: 0, opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#f97316' }
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare Amber',
    category: 'Warm & Golden',
    badge: 'Solar Corona',
    desc: 'Radiant burning yellow-orange solar flare',
    colorA: '#fbbf24',
    colorB: '#f97316',
    adjustments: { hue: 40, saturation: 190, contrast: 130, brightness: 112, sepia: 20, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#fbbf24' }
  },
  {
    id: 'crimson_plasma',
    name: 'Crimson Plasma',
    category: 'Cinematic & Moody',
    badge: 'Heat Core',
    desc: 'Intense fiery ruby red plasma aura',
    colorA: '#dc2626',
    colorB: '#881337',
    adjustments: { hue: 350, saturation: 200, contrast: 140, brightness: 100, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#ef4444' }
  },
  {
    id: 'emerald_matrix',
    name: 'Emerald Matrix',
    category: 'Neon & Cyber',
    badge: 'Matrix Code',
    desc: 'Luminescent neon green terminal flare',
    colorA: '#10b981',
    colorB: '#0d9488',
    adjustments: { hue: 120, saturation: 170, contrast: 120, brightness: 105, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#10b981' }
  },
  {
    id: 'teal_orange',
    name: 'Cinematic Teal & Orange',
    category: 'Cinematic & Moody',
    badge: 'Hollywood',
    desc: 'Iconic movie blockbuster color grade',
    colorA: '#0d9488',
    colorB: '#ea580c',
    adjustments: { hue: 190, saturation: 160, contrast: 135, brightness: 104, sepia: 10, invert: 0, opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#06b6d4' }
  },
  {
    id: 'gold_luxury',
    name: 'Royal Gold Luxury',
    category: 'Warm & Golden',
    badge: '24K Premium',
    desc: 'Lustrous polished royal gold with warm highlights',
    colorA: '#eab308',
    colorB: '#b45309',
    adjustments: { hue: 45, saturation: 145, contrast: 125, brightness: 112, sepia: 50, invert: 0, opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#facc15' }
  },
  {
    id: 'frosted_glass',
    name: 'Frosted Glass Ethereal',
    category: 'Aesthetic & Pastel',
    badge: 'Aesthetic',
    desc: 'Soft backlit blur and ethereal tone',
    colorA: '#818cf8',
    colorB: '#a855f7',
    adjustments: { hue: 220, saturation: 120, contrast: 95, brightness: 115, sepia: 0, invert: 0, opacity: 90, blur: 0.8, shadowBlur: 24, shadowColor: '#818cf8' }
  },
  {
    id: 'rose_quartz',
    name: 'Rose Quartz Pastel',
    category: 'Aesthetic & Pastel',
    badge: 'Pastel Glow',
    desc: 'Delicate pastel pink and soft dreamy radiance',
    colorA: '#f472b6',
    colorB: '#fb7185',
    adjustments: { hue: 330, saturation: 130, contrast: 105, brightness: 112, sepia: 5, invert: 0, opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#f472b6' }
  },
  {
    id: 'matcha_cream',
    name: 'Matcha Cream',
    category: 'Aesthetic & Pastel',
    badge: 'Organic',
    desc: 'Soothing earthy sage green & creamy tone',
    colorA: '#84cc16',
    colorB: '#059669',
    adjustments: { hue: 85, saturation: 95, contrast: 110, brightness: 108, sepia: 12, invert: 0, opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#65a30d' }
  },
  {
    id: 'nordic_glacier',
    name: 'Nordic Glacier',
    category: 'Aesthetic & Pastel',
    badge: 'Arctic Clean',
    desc: 'Crisp icy arctic blue with diamond clarity',
    colorA: '#38bdf8',
    colorB: '#93c5fd',
    adjustments: { hue: 200, saturation: 140, contrast: 120, brightness: 115, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#38bdf8' }
  },
  {
    id: 'warm_polaroid',
    name: '70s Warm Polaroid',
    category: 'Retro & Vintage',
    badge: 'Nostalgic',
    desc: 'Sun-faded instant print film warmth',
    colorA: '#fbbf24',
    colorB: '#d97706',
    adjustments: { hue: 25, saturation: 115, contrast: 110, brightness: 108, sepia: 38, invert: 0, opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#f59e0b' }
  },
  {
    id: 'retro_vhs',
    name: '80s Retro VHS',
    category: 'Retro & Vintage',
    badge: 'Vaporwave',
    desc: 'Analog saturated magnetic tape nostalgia',
    colorA: '#f43f5e',
    colorB: '#8b5cf6',
    adjustments: { hue: 305, saturation: 180, contrast: 135, brightness: 110, sepia: 8, invert: 0, opacity: 100, blur: 0.4, shadowBlur: 22, shadowColor: '#d946ef' }
  },
  {
    id: 'sci_fi_hologram',
    name: 'Sci-Fi Hologram',
    category: 'Neon & Cyber',
    badge: 'Holo Beam',
    desc: 'Futuristic glowing cyan laser projection',
    colorA: '#38bdf8',
    colorB: '#06b6d4',
    adjustments: { hue: 195, saturation: 160, contrast: 110, brightness: 120, sepia: 0, invert: 0, opacity: 88, blur: 0.4, shadowBlur: 26, shadowColor: '#38bdf8' }
  },
  {
    id: 'cosmic_amethyst',
    name: 'Cosmic Amethyst',
    category: 'Cinematic & Moody',
    badge: 'Galactic',
    desc: 'Deep galactic violet & starry nebula shimmer',
    colorA: '#7c3aed',
    colorB: '#db2777',
    adjustments: { hue: 275, saturation: 170, contrast: 130, brightness: 108, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#8b5cf6' }
  },
  {
    id: 'dark_obsidian',
    name: 'Dark Obsidian',
    category: 'Cinematic & Moody',
    badge: 'Stealth',
    desc: 'Moody muted tone with dark outline aura',
    colorA: '#334155',
    colorB: '#0f172a',
    adjustments: { hue: 0, saturation: 45, contrast: 140, brightness: 90, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#0f172a' }
  },
  {
    id: 'gotham_noir',
    name: 'Gotham Detective Noir',
    category: 'Cinematic & Moody',
    badge: 'Dark Cinema',
    desc: 'Dramatic heavy shadows with desaturated mystery',
    colorA: '#475569',
    colorB: '#1e293b',
    adjustments: { hue: 210, saturation: 25, contrast: 160, brightness: 88, sepia: 10, invert: 0, opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#020617' }
  },
  {
    id: 'monochrome_noir',
    name: 'Monochrome Film Noir',
    category: 'Cinematic & Moody',
    badge: 'B&W Classic',
    desc: 'Pure high-contrast black & white silver gelatin',
    colorA: '#e2e8f0',
    colorB: '#0f172a',
    adjustments: { hue: 0, saturation: 0, contrast: 155, brightness: 102, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#000000' }
  },
  {
    id: 'sepia_antique',
    name: '19th Century Daguerreotype',
    category: 'Retro & Vintage',
    badge: 'Antique',
    desc: 'Historic antique bronze and copper sepia tone',
    colorA: '#d97706',
    colorB: '#78350f',
    adjustments: { hue: 30, saturation: 110, contrast: 125, brightness: 98, sepia: 85, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 14, shadowColor: '#92400e' }
  },
  {
    id: 'negative_invert',
    name: 'Negative Cyber Invert',
    category: 'Neon & Cyber',
    badge: 'Inverted',
    desc: 'Crisp inverted psychedelic spectrum',
    colorA: '#9333ea',
    colorB: '#1e1b4b',
    adjustments: { hue: 180, saturation: 130, contrast: 135, brightness: 100, sepia: 0, invert: 100, opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#c084fc' }
  },
  {
    id: 'cyber_matrix',
    name: 'Cyber Matrix Code',
    category: 'Neon & Cyber',
    badge: 'Matrix 2.0',
    desc: 'Bioluminescent green matrix stream with high phosphor contrast',
    colorA: '#22c55e',
    colorB: '#052e16',
    isNew: true,
    adjustments: { hue: 130, saturation: 220, contrast: 145, brightness: 110, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#22c55e' }
  },
  {
    id: 'holographic_prism',
    name: 'Holographic Prism Flare',
    category: 'Neon & Cyber',
    badge: 'Prism Spectrum',
    desc: 'Multi-spectral chromatic rainbow glow with iridescent violet highlights',
    colorA: '#06b6d4',
    colorB: '#ec4899',
    isNew: true,
    adjustments: { hue: 280, saturation: 190, contrast: 130, brightness: 115, sepia: 0, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 26, shadowColor: '#a855f7' }
  },
  {
    id: 'golden_hour_sunset',
    name: 'Solarium Golden Hour',
    category: 'Warm & Golden',
    badge: 'Warm Solarium',
    desc: 'Golden honey radiance with warm amber twilight backlight',
    colorA: '#f59e0b',
    colorB: '#78350f',
    isNew: true,
    adjustments: { hue: 38, saturation: 185, contrast: 125, brightness: 108, sepia: 25, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#f59e0b' }
  },
  {
    id: 'tokyo_drift_neon',
    name: 'Tokyo Drift Neon City',
    category: 'Neon & Cyber',
    badge: 'Tokyo Drift',
    desc: 'Electric magenta and cyan neon reflections on rain-slick asphalt',
    colorA: '#f43f5e',
    colorB: '#06b6d4',
    isNew: true,
    adjustments: { hue: 310, saturation: 200, contrast: 140, brightness: 112, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 26, shadowColor: '#f43f5e' }
  },
  {
    id: 'manga_screentone',
    name: 'Japanese Manga Ink',
    category: 'Cinematic & Moody',
    badge: 'Manga Ink',
    desc: 'Deep jet black sumi ink aesthetic with sharp graphic tonal balance',
    colorA: '#0f172a',
    colorB: '#334155',
    isNew: true,
    adjustments: { hue: 0, saturation: 10, contrast: 175, brightness: 95, sepia: 5, invert: 0, opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#000000' }
  },
  {
    id: 'pastel_lavender',
    name: 'Pastel Lavender Dream',
    category: 'Aesthetic & Pastel',
    badge: 'Soft Dream',
    desc: 'Dreamy soft lilacs, pale hydrangeas and gentle luminous mist',
    colorA: '#c084fc',
    colorB: '#818cf8',
    isNew: true,
    adjustments: { hue: 255, saturation: 125, contrast: 105, brightness: 118, sepia: 0, invert: 0, opacity: 96, blur: 0.3, shadowBlur: 18, shadowColor: '#c084fc' }
  },
  {
    id: 'crimson_eclipse',
    name: 'Crimson Blood Eclipse',
    category: 'Cinematic & Moody',
    badge: 'Blood Moon',
    desc: 'Super blood moon crimson eclipse with ominous dark vignette',
    colorA: '#ef4444',
    colorB: '#450a0a',
    isNew: true,
    adjustments: { hue: 355, saturation: 210, contrast: 155, brightness: 98, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 28, shadowColor: '#ef4444' }
  },
  {
    id: 'nordic_aurora',
    name: 'Polar Aurora Borealis',
    category: 'Neon & Cyber',
    badge: 'Polar Aurora',
    desc: 'Deep Arctic night shimmering with undulating emerald and violet curtains',
    colorA: '#10b981',
    colorB: '#6366f1',
    isNew: true,
    adjustments: { hue: 160, saturation: 185, contrast: 135, brightness: 110, sepia: 0, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 25, shadowColor: '#10b981' }
  },
  {
    id: 'vintage_sepia_1920',
    name: '1920s Art Deco Copper',
    category: 'Retro & Vintage',
    badge: '1920s Deco',
    desc: 'Opulent vintage copper bronze with velvety aged patina warmth',
    colorA: '#b45309',
    colorB: '#451a03',
    isNew: true,
    adjustments: { hue: 28, saturation: 130, contrast: 135, brightness: 102, sepia: 75, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 16, shadowColor: '#b45309' }
  },
  {
    id: 'vaporwave_sunset',
    name: '80s Miami Vaporwave',
    category: 'Retro & Vintage',
    badge: 'Outrun Wave',
    desc: 'Nostalgic sunset pastel gradient with hot pink and tropical aqua sunset',
    colorA: '#ec4899',
    colorB: '#06b6d4',
    isNew: true,
    adjustments: { hue: 320, saturation: 185, contrast: 125, brightness: 112, sepia: 5, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 24, shadowColor: '#ec4899' }
  },
  {
    id: 'cyberpunk_hazard',
    name: 'Cyber Hazard Acid',
    category: 'Neon & Cyber',
    badge: 'Biohazard',
    desc: 'High-voltage radioactive toxic yellow glow on obsidian carbon',
    colorA: '#facc15',
    colorB: '#84cc16',
    isNew: true,
    adjustments: { hue: 65, saturation: 220, contrast: 150, brightness: 115, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 26, shadowColor: '#facc15' }
  },
  {
    id: 'deep_ocean_bioluminescence',
    name: 'Abyssal Bioluminescence',
    category: 'Cinematic & Moody',
    badge: 'Deep Trench',
    desc: 'Midnight oceanic trench with glowing electric sapphire marine organisms',
    colorA: '#0284c7',
    colorB: '#030712',
    isNew: true,
    adjustments: { hue: 200, saturation: 175, contrast: 145, brightness: 100, sepia: 0, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 24, shadowColor: '#0284c7' }
  },
  {
    id: 'emerald_luxury',
    name: 'Imperial Emerald Crown',
    category: 'Warm & Golden',
    badge: 'Imperial Gem',
    desc: 'Deep royal gem-cut emerald green with polished yellow gold leaf highlights',
    colorA: '#059669',
    colorB: '#ca8a04',
    isNew: true,
    adjustments: { hue: 145, saturation: 170, contrast: 135, brightness: 106, sepia: 15, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#10b981' }
  },
  {
    id: 'desert_dune_sand',
    name: 'Sahara Terracotta Dune',
    category: 'Warm & Golden',
    badge: 'Desert Sun',
    desc: 'Warm sunbaked terracotta clay, desert sands, and earthy canyon glow',
    colorA: '#ea580c',
    colorB: '#7c2d12',
    isNew: true,
    adjustments: { hue: 20, saturation: 160, contrast: 120, brightness: 105, sepia: 30, invert: 0, opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#ea580c' }
  },
  {
    id: 'neon_ultraviolet',
    name: 'Hyperdrive Ultraviolet',
    category: 'Neon & Cyber',
    badge: 'UV Plasma',
    desc: 'Deep indigo & ultraviolet blacklight strobe glow',
    colorA: '#6366f1',
    colorB: '#a855f7',
    isNew: true,
    adjustments: { hue: 250, saturation: 210, contrast: 140, brightness: 114, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 28, shadowColor: '#818cf8' }
  },
  // --- 20 NEW UNIQUE FILTERS (Thermal, Y2K, Glitch, Kintsugi, Sakura & more) ---
  {
    id: 'thermal_infrared',
    name: 'Infrared Thermal Vision',
    category: 'Neon & Cyber',
    badge: 'Thermal Cam',
    desc: 'False-color thermal spectrum heat map with radiant yellow-magenta gradient',
    colorA: '#f43f5e',
    colorB: '#facc15',
    isNew: true,
    adjustments: { hue: 330, saturation: 220, contrast: 155, brightness: 112, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 26, shadowColor: '#f43f5e' }
  },
  {
    id: 'y2k_millennium_chrome',
    name: 'Y2K Cyber Chrome',
    category: 'Neon & Cyber',
    badge: 'Y2K Chrome',
    desc: 'Futuristic year 2000 liquid metal aesthetic with lilac and baby blue gloss',
    colorA: '#c084fc',
    colorB: '#38bdf8',
    isNew: true,
    adjustments: { hue: 270, saturation: 160, contrast: 140, brightness: 118, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 24, shadowColor: '#c084fc' }
  },
  {
    id: 'chromatic_glitch_split',
    name: 'Chromatic Glitch Spectrum',
    category: 'Neon & Cyber',
    badge: 'Glitch Aura',
    desc: 'High-intensity RGB aberration shift with electric cyan & neon crimson fringe',
    colorA: '#00f0ff',
    colorB: '#ff0055',
    isNew: true,
    adjustments: { hue: 180, saturation: 210, contrast: 150, brightness: 110, sepia: 0, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 28, shadowColor: '#00f0ff' }
  },
  {
    id: 'kintsugi_gold',
    name: 'Japanese Kintsugi Gold',
    category: 'Warm & Golden',
    badge: 'Kintsugi',
    desc: 'Lustrous molten 24K gold fracture veins on deep obsidian ceramic glaze',
    colorA: '#fbbf24',
    colorB: '#451a03',
    isNew: true,
    adjustments: { hue: 42, saturation: 195, contrast: 145, brightness: 108, sepia: 40, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#f59e0b' }
  },
  {
    id: 'cyanotype_prussian',
    name: 'Prussian Blue Cyanotype',
    category: 'Retro & Vintage',
    badge: 'Cyanotype',
    desc: 'Historic sun-exposed botanical blueprint in deep rich Prussian cobalt ink',
    colorA: '#0284c7',
    colorB: '#082f49',
    isNew: true,
    adjustments: { hue: 205, saturation: 165, contrast: 150, brightness: 98, sepia: 10, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 18, shadowColor: '#0284c7' }
  },
  {
    id: 'bleach_bypass_cinema',
    name: 'Bleach Bypass Silver',
    category: 'Cinematic & Moody',
    badge: 'Bleach Bypass',
    desc: 'Gritty Hollywood motion-picture silver retention with high dynamic range',
    colorA: '#94a3b8',
    colorB: '#1e293b',
    isNew: true,
    adjustments: { hue: 210, saturation: 40, contrast: 185, brightness: 95, sepia: 5, invert: 0, opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#0f172a' }
  },
  {
    id: 'jellyfish_bioluminescence',
    name: 'Bioluminescent Jellyfish',
    category: 'Neon & Cyber',
    badge: 'Deep Jelly',
    desc: 'Ethereal translucent deep-sea marine organism glowing in magenta and cyan',
    colorA: '#f43f5e',
    colorB: '#06b6d4',
    isNew: true,
    adjustments: { hue: 320, saturation: 205, contrast: 135, brightness: 115, sepia: 0, invert: 0, opacity: 95, blur: 0.3, shadowBlur: 28, shadowColor: '#f43f5e' }
  },
  {
    id: 'sakura_blossom_pink',
    name: 'Sakura Cherry Blossom',
    category: 'Aesthetic & Pastel',
    badge: 'Sakura Bloom',
    desc: 'Soft delicate Japanese spring petals with luminous peach and rose halo',
    colorA: '#fbcfe8',
    colorB: '#f472b6',
    isNew: true,
    adjustments: { hue: 340, saturation: 140, contrast: 110, brightness: 115, sepia: 5, invert: 0, opacity: 98, blur: 0.2, shadowBlur: 20, shadowColor: '#f472b6' }
  },
  {
    id: 'midnight_nebula_galaxy',
    name: 'Midnight Nebula Stardust',
    category: 'Cinematic & Moody',
    badge: 'Nebula Core',
    desc: 'Interstellar gas cloud illuminated by brilliant ultraviolet star clusters',
    colorA: '#8b5cf6',
    colorB: '#1e1b4b',
    isNew: true,
    adjustments: { hue: 275, saturation: 190, contrast: 140, brightness: 106, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 26, shadowColor: '#8b5cf6' }
  },
  {
    id: 'matcha_pistachio_velvet',
    name: 'Kyoto Matcha Cream',
    category: 'Aesthetic & Pastel',
    badge: 'Kyoto Matcha',
    desc: 'Stone-ground ceremonial Uji matcha green blended with soft ivory cream',
    colorA: '#84cc16',
    colorB: '#3f6212',
    isNew: true,
    adjustments: { hue: 90, saturation: 135, contrast: 120, brightness: 108, sepia: 15, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 18, shadowColor: '#65a30d' }
  },
  {
    id: 'electric_plasma_arc',
    name: 'Tesla Coil Electric Arc',
    category: 'Neon & Cyber',
    badge: 'Tesla Arc',
    desc: 'High-voltage atmospheric ionization with crackling violet lightning discharge',
    colorA: '#a855f7',
    colorB: '#3b82f6',
    isNew: true,
    adjustments: { hue: 260, saturation: 220, contrast: 145, brightness: 116, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 30, shadowColor: '#c084fc' }
  },
  {
    id: 'autumn_maple_ember',
    name: 'Autumn Maple Ember',
    category: 'Warm & Golden',
    badge: 'Maple Ember',
    desc: 'Rich New England autumn maple foliage glowing with fire-red & golden amber',
    colorA: '#ef4444',
    colorB: '#b45309',
    isNew: true,
    adjustments: { hue: 15, saturation: 190, contrast: 130, brightness: 106, sepia: 25, invert: 0, opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#ea580c' }
  },
  {
    id: 'technicolor_3strip',
    name: '1950s Technicolor Film',
    category: 'Retro & Vintage',
    badge: 'Technicolor',
    desc: 'Vibrant golden age Hollywood 3-strip color saturation with rich dye density',
    colorA: '#dc2626',
    colorB: '#0284c7',
    isNew: true,
    adjustments: { hue: 350, saturation: 185, contrast: 140, brightness: 105, sepia: 10, invert: 0, opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#e11d48' }
  },
  {
    id: 'amethyst_geode_sparkle',
    name: 'Raw Amethyst Geode',
    category: 'Aesthetic & Pastel',
    badge: 'Geode Crystal',
    desc: 'Crystalline violet gemstone interior with shimmering lavender twilight sheen',
    colorA: '#c084fc',
    colorB: '#581c87',
    isNew: true,
    adjustments: { hue: 280, saturation: 175, contrast: 135, brightness: 110, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 24, shadowColor: '#a855f7' }
  },
  {
    id: 'midnight_neon_rain',
    name: 'Midnight Neon Rain',
    category: 'Cinematic & Moody',
    badge: 'Rain City',
    desc: 'Wet city asphalt reflecting glowing golden amber storefronts in night fog',
    colorA: '#f59e0b',
    colorB: '#0f172a',
    isNew: true,
    adjustments: { hue: 45, saturation: 170, contrast: 150, brightness: 98, sepia: 20, invert: 0, opacity: 100, blur: 0.3, shadowBlur: 22, shadowColor: '#d97706' }
  },
  {
    id: 'opal_iridescent_pearl',
    name: 'Milky Opal Iridescence',
    category: 'Aesthetic & Pastel',
    badge: 'Opal Pearl',
    desc: 'Shimmering Australian fire opal with iridescent pearlescent rainbow facets',
    colorA: '#e0f2fe',
    colorB: '#fce7f3',
    isNew: true,
    adjustments: { hue: 210, saturation: 120, contrast: 115, brightness: 122, sepia: 0, invert: 0, opacity: 98, blur: 0.3, shadowBlur: 22, shadowColor: '#bae6fd' }
  },
  {
    id: 'solar_flare_supernova',
    name: 'Supernova Solar Flare',
    category: 'Warm & Golden',
    badge: 'Supernova',
    desc: 'Blinding thermonuclear core with intense white-hot center and corona flare',
    colorA: '#fef08a',
    colorB: '#ea580c',
    isNew: true,
    adjustments: { hue: 45, saturation: 220, contrast: 150, brightness: 125, sepia: 15, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 30, shadowColor: '#f59e0b' }
  },
  {
    id: 'stealth_carbon_graphite',
    name: 'Stealth Carbon Graphite',
    category: 'Cinematic & Moody',
    badge: 'Carbon Stealth',
    desc: 'Matte composite carbon fiber weave with subtle ice-cyan structural highlight',
    colorA: '#334155',
    colorB: '#030712',
    isNew: true,
    adjustments: { hue: 200, saturation: 50, contrast: 165, brightness: 90, sepia: 0, invert: 0, opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#0ea5e9' }
  },
  {
    id: 'synthwave_miami_horizon',
    name: 'Outrun Miami Horizon',
    category: 'Retro & Vintage',
    badge: 'Miami 84',
    desc: 'Classic 1984 wireframe sunset with blistering orange sun & magenta nightfall',
    colorA: '#f97316',
    colorB: '#ec4899',
    isNew: true,
    adjustments: { hue: 335, saturation: 200, contrast: 135, brightness: 112, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 25, shadowColor: '#f43f5e' }
  },
  {
    id: 'tritium_radioactive_green',
    name: 'Radioactive Tritium Flare',
    category: 'Neon & Cyber',
    badge: 'Tritium Core',
    desc: 'Self-luminous isotopic isotope lime-green glow penetrating pitch darkness',
    colorA: '#a3e635',
    colorB: '#052e16',
    isNew: true,
    adjustments: { hue: 85, saturation: 230, contrast: 150, brightness: 115, sepia: 0, invert: 0, opacity: 100, blur: 0.2, shadowBlur: 30, shadowColor: '#84cc16' }
  }
];

// Set of newly introduced 3D & Stylized Material Effect IDs
const NEW_EFFECT_IDS = new Set([
  'splash_water',
  'foil_balloon',
  'frosted_ice',
  'molten_lava',
  'knitted_wool',
  'lego_bricks',
  'carrara_marble',
  'neon_tube_glass',
  'gummy_bear_jelly',
  'diamond_crystal',
  'velvet_leather',
  'molten_mercury',
  'aurora_wireframe',
  'carved_wood',
  'origami_paper',
  'aurora_bubble_glass',
  'cyber_circuit_pcb',
  'fluffy_cloud',
  // 20 New Anime, Cartoon, 3D and Stylized Effects
  'anime_cel_shading',
  'anime_mecha_cyber',
  'anime_speed_lines',
  'anime_chibi_kawaii',
  'anime_cyber_city',
  'cartoon_comic_pop',
  'cartoon_toontown_3d',
  'cartoon_rubber_hose',
  'cartoon_graffiti_sticker',
  'cartoon_superhero_ink',
  'cartoon_arcade_retro',
  '3d_voxel_craft',
  '3d_inflatable_gold_balloon',
  '3d_metallic_chrome_foil',
  '3d_wooden_toy',
  '3d_hologram_matrix',
  '3d_glossy_ceramic',
  '3d_origami_tessellation',
  '3d_neon_glass_capsule',
  '3d_crystal_gemstone',
  // 10 Trending & Viral Effects
  'y2k_acid_chrome',
  'risograph_indie_print',
  'frosted_spatial_glass',
  'prism_optical_dispersion',
  'vintage_synth_vhs',
  'cyber_matrix_glitch',
  'obsidian_gold_kintsugi',
  'cosmic_stardust_nebula',
  'bioluminescent_abyss',
  'acid_mesh_gradient_grain'
]);

// Renders an authentic live visual preview thumbnail showing the look of each filter preset
function FilterCardThumbnail({ preset, svgCode, activeGlowBlur = 0, activeGlowColor = '#38bdf8' }) {
  const { colorA, colorB, adjustments, badge } = preset;
  const hasGlow = (activeGlowBlur || 0) > 0;
  const glowColor = activeGlowColor || adjustments?.shadowColor || '#38bdf8';

  const filterStyle = [
    adjustments?.hue ? `hue-rotate(${adjustments.hue}deg)` : '',
    adjustments?.brightness !== undefined && adjustments.brightness !== 100 ? `brightness(${adjustments.brightness}%)` : '',
    adjustments?.saturation !== undefined && adjustments.saturation !== 100 ? `saturate(${adjustments.saturation}%)` : '',
    adjustments?.contrast !== undefined && adjustments.contrast !== 100 ? `contrast(${adjustments.contrast}%)` : '',
    adjustments?.sepia ? `sepia(${adjustments.sepia}%)` : '',
    adjustments?.invert ? `invert(${adjustments.invert}%)` : '',
    hasGlow ? `drop-shadow(0 0 ${Math.min(10, Math.round(activeGlowBlur * 0.4))}px ${glowColor})` : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className="w-full h-14 rounded-xl mb-2 overflow-hidden relative flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-200 select-none bg-slate-950/80"
    >
      {/* Ambient glowing backdrop matching filter */}
      <div
        className="absolute inset-0 opacity-25 blur-md pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${colorA}44 0%, ${colorB}22 60%, transparent 100%)`
        }}
      />

      {/* Actual Icon preview with this preset's exact filter style applied */}
      {svgCode ? (
        <div
          className="relative z-10 w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110 pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full [&>svg]:block [shape-rendering:geometricPrecision]"
          style={{ filter: filterStyle || undefined }}
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      ) : (
        <div
          className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
            boxShadow: hasGlow ? `0 0 14px ${glowColor}, 0 0 4px ${glowColor}` : `0 2px 8px rgba(0,0,0,0.6)`,
            filter: filterStyle || undefined
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
        </div>
      )}

      {/* Filter Category / Tag Badge */}
      <span className="absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white/90 border border-white/10 z-10">
        {badge || 'Filter'}
      </span>
    </div>
  );
}

// Renders an authentic live visual preview thumbnail for every material effect card
function EffectCardThumbnail({ preset }) {
  const { texture, icon, previewBg } = preset;

  return (
    <div
      className="w-full h-14 rounded-xl mb-2.5 overflow-hidden relative flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-[1.03] transition-transform duration-200 select-none"
      style={{ background: previewBg || 'linear-gradient(135deg, #1e293b, #0f172a)' }}
    >
      {/* Texture Specific SVG Visual Overlay */}
      {texture === 'water' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0 opacity-90">
          <defs>
            <linearGradient id="thumb_water_grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <path d="M0,25 Q25,15 50,25 T100,25 L100,45 L0,45 Z" fill="url(#thumb_water_grad)" />
          <circle cx="20" cy="18" r="4.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.85" />
          <circle cx="21" cy="16" r="1.5" fill="#ffffff" opacity="0.9" />
          <circle cx="75" cy="22" r="3.5" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
          <circle cx="76" cy="21" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="48" cy="12" r="2.5" fill="#ffffff" opacity="0.75" />
          <path d="M10,8 Q15,4 20,8 M60,6 Q65,3 70,6" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8" />
        </svg>
      )}

      {texture === 'balloon' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="12" y="6" width="76" height="33" rx="12" fill="#2563eb" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="4 2" />
          <path d="M22,12 Q40,9 60,11" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <ellipse cx="70" cy="16" rx="4" ry="2" fill="#ffffff" opacity="0.75" />
          <circle cx="12" cy="22" r="3" fill="#1d4ed8" />
        </svg>
      )}

      {texture === 'frost' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M50,4 L50,41 M30,22 L70,22 M35,7 L65,37 M35,37 L65,7" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
          <path d="M50,12 L44,18 M50,12 L56,18 M50,32 L44,26 M50,32 L56,26 M38,22 L44,16 M38,22 L44,28 M62,22 L56,16 M62,22 L56,28" stroke="#ffffff" strokeWidth="1.2" opacity="0.75" />
          <circle cx="50" cy="22" r="2" fill="#ffffff" />
          <circle cx="20" cy="12" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="80" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
        </svg>
      )}

      {texture === 'lava' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,22 Q25,12 45,28 T100,20" stroke="#ff3b00" strokeWidth="4" fill="none" opacity="0.9" />
          <path d="M0,22 Q25,12 45,28 T100,20" stroke="#ffea00" strokeWidth="1.8" fill="none" />
          <path d="M30,0 L35,24 M65,45 L60,22" stroke="#ff5500" strokeWidth="2" fill="none" />
          <circle cx="22" cy="10" r="1.5" fill="#ffea00" opacity="0.9" />
          <circle cx="78" cy="14" r="1.8" fill="#ff3b00" opacity="0.9" />
          <circle cx="45" cy="38" r="1.2" fill="#ffea00" opacity="0.9" />
        </svg>
      )}

      {texture === 'wool' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0 opacity-85">
          <path d="M0,8 L100,8 M0,16 L100,16 M0,24 L100,24 M0,32 L100,32 M0,40 L100,40" stroke="#8c765c" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M10,0 L10,45 M30,0 L30,45 M50,0 L50,45 M70,0 L70,45 M90,0 L90,45" stroke="#a38f78" strokeWidth="1.5" opacity="0.5" />
          <rect x="25" y="14" width="50" height="16" rx="4" fill="#a38f78" opacity="0.35" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      )}

      {texture === 'lego' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="5" y="12" width="28" height="28" fill="#ffd500" stroke="#ca8a04" strokeWidth="1" />
          <rect x="33" y="12" width="34" height="28" fill="#0055bf" stroke="#1e40af" strokeWidth="1" />
          <rect x="67" y="12" width="28" height="28" fill="#e60012" stroke="#991b1b" strokeWidth="1" />
          <circle cx="19" cy="8" r="4.5" fill="#ffe033" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="50" cy="8" r="4.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
          <circle cx="81" cy="8" r="4.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        </svg>
      )}

      {texture === 'marble' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M5,5 Q30,35 60,18 T95,38" fill="none" stroke="#b48a4d" strokeWidth="1.8" opacity="0.75" />
          <path d="M5,5 Q30,35 60,18 T95,38" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" />
          <path d="M40,0 Q60,15 75,45" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.6" />
          <rect x="30" y="15" width="40" height="15" rx="3" fill="none" stroke="#b48a4d" strokeWidth="1" opacity="0.7" />
        </svg>
      )}

      {texture === 'neon_tube' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="15" y="8" width="70" height="29" rx="8" fill="rgba(8,51,68,0.7)" stroke="#00f0ff" strokeWidth="3" />
          <rect x="18" y="11" width="64" height="23" rx="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.85" />
        </svg>
      )}

      {texture === 'gummy' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <circle cx="42" cy="14" r="5" fill="#ffe4e6" opacity="0.7" />
          <circle cx="58" cy="14" r="5" fill="#ffe4e6" opacity="0.7" />
          <ellipse cx="50" cy="22" rx="14" ry="12" fill="#fb7185" stroke="#ffe4e6" strokeWidth="1.5" />
          <ellipse cx="46" cy="19" rx="2" ry="3" fill="#ffffff" opacity="0.85" />
        </svg>
      )}

      {texture === 'diamond' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <polygon points="50,4 75,18 50,41 25,18" fill="rgba(255,255,255,0.4)" stroke="#ffffff" strokeWidth="1.5" />
          <polygon points="50,4 25,18 50,18" fill="rgba(186,230,253,0.5)" />
          <polygon points="50,4 75,18 50,18" fill="rgba(251,207,232,0.5)" />
          <polygon points="50,18 25,18 50,41" fill="rgba(254,240,138,0.5)" />
          <polygon points="50,18 75,18 50,41" fill="rgba(199,210,254,0.5)" />
        </svg>
      )}

      {texture === 'pcb' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,15 L25,15 L35,28 L70,28 L80,12 L100,12" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
          <circle cx="25" cy="15" r="2.5" fill="#00f0ff" />
          <circle cx="70" cy="28" r="2.5" fill="#00f0ff" />
          <rect x="42" y="10" width="16" height="14" rx="2" fill="#0e7490" stroke="#00f0ff" strokeWidth="1" />
        </svg>
      )}

      {texture === 'gold' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,0 L100,45" stroke="#ffffff" strokeWidth="12" opacity="0.25" />
          <polygon points="50,6 54,18 66,18 56,26 60,38 50,30 40,38 44,26 34,18 46,18" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        </svg>
      )}

      {texture === 'mercury' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M10,22 Q30,5 50,22 T90,22" fill="none" stroke="#ffffff" strokeWidth="4" />
          <path d="M10,22 Q30,5 50,22 T90,22" fill="none" stroke="#334155" strokeWidth="1.5" />
          <circle cx="50" cy="22" r="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        </svg>
      )}

      {/* Center Icon Badge with Backdrop Blur Glass */}
      <div className="relative z-10 px-2.5 py-1 rounded-lg backdrop-blur-md bg-black/40 border border-white/20 flex items-center gap-1.5 shadow-md">
        <span className="text-sm drop-shadow">{icon}</span>
        <span className="text-[10px] font-bold text-white tracking-wide uppercase font-mono">{preset.badge}</span>
      </div>
    </div>
  );
}

const SIZE_PRESETS = [
  { label: '32px', w: 32, h: 32, desc: 'Favicon' },
  { label: '64px', w: 64, h: 64, desc: 'Small' },
  { label: '128px', w: 128, h: 128, desc: 'Standard' },
  { label: '256px', w: 256, h: 256, desc: 'App Icon' },
  { label: '384px', w: 384, h: 384, desc: 'Default' },
  { label: '512px', w: 512, h: 512, desc: 'HD Icon' },
  { label: '1024px', w: 1024, h: 1024, desc: '1K Ultra' },
  { label: '16:9 Banner', w: 512, h: 288, desc: 'Landscape' },
  { label: '9:16 Story', w: 288, h: 512, desc: 'Portrait' },
  { label: '4:3 Card', w: 400, h: 300, desc: 'Presentation' }
];

// Material looks and 6 core visual styles are loaded from STYLE_RENDER_MODES (styleTransformer.js)


const QUICK_SWATCHES = [
  { name: 'Sky Cyan', hex: '#38bdf8' },
  { name: 'Electric Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Neon Pink', hex: '#ec4899' },
  { name: 'Crimson Red', hex: '#ef4444' },
  { name: 'Sunset Orange', hex: '#f97316' },
  { name: 'Gold Amber', hex: '#f59e0b' },
  { name: 'Emerald Green', hex: '#10b981' },
  { name: 'Teal Mint', hex: '#14b8a6' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Dark Slate', hex: '#0f172a' }
];

const PRESETS_XYZ = [
  { id: 'center', name: 'Center Origin', icon: '🎯', x: 0, y: 0, z: 0, desc: 'Reset translation to (0, 0, 0)' },
  { id: 'popout_lg', name: 'Pop-Out Max', icon: '🚀', x: 0, y: 0, z: 140, desc: 'Pops out toward camera in 3D' },
  { id: 'popout_sm', name: 'Gentle Pop', icon: '✨', x: 0, y: 0, z: 60, desc: 'Subtle 3D elevation forward' },
  { id: 'recess_deep', name: 'Deep Recess', icon: '🕳️', x: 0, y: 0, z: -140, desc: 'Pushes deep into screen perspective' },
  { id: 'stage_left', name: 'Left Stage', icon: '◀️', x: -80, y: 0, z: 40, desc: 'Shift left with forward lift' },
  { id: 'stage_right', name: 'Right Stage', icon: '▶️', x: 80, y: 0, z: 40, desc: 'Shift right with forward lift' },
  { id: 'float_high', name: 'Float Up', icon: '🔼', x: 0, y: -70, z: 70, desc: 'Elevate top-center toward user' },
  { id: 'ground_front', name: 'Ground Base', icon: '🔽', x: 0, y: 60, z: 80, desc: 'Drop down-forward grounding' }
];

const PRESETS_3D = [
  { id: 'isometric_left', name: 'Isometric L', icon: '🎲', rx: 30, ry: -30, rz: 0, desc: 'Classic 30° left isometric angle' },
  { id: 'isometric_right', name: 'Isometric R', icon: '📐', rx: 30, ry: 30, rz: 0, desc: 'Classic 30° right isometric angle' },
  { id: 'floating_stand', name: 'Float Stand', icon: '📱', rx: 25, ry: -20, rz: 5, desc: 'Natural perspective showcase slant' },
  { id: 'wall_left', name: 'Wall Left', icon: '🪟', rx: 0, ry: 35, rz: 0, desc: 'Facing right wall perspective' },
  { id: 'wall_right', name: 'Wall Right', icon: '🪞', rx: 0, ry: -35, rz: 0, desc: 'Facing left wall perspective' },
  { id: 'birds_eye', name: "Bird's Eye", icon: '🛸', rx: 55, ry: 0, rz: 0, desc: 'Tabletop top-down perspective' },
  { id: 'dynamic_action', name: 'Action 3D', icon: '⚡', rx: 18, ry: -28, rz: -10, desc: 'Dynamic superhero action tilt' },
  { id: 'flat_front', name: 'Reset Front', icon: '🎯', rx: 0, ry: 0, rz: 0, desc: 'Level 0° front view' }
];

// Interactive 3D Gyro Orbit Trackball with zero-lag direct GPU transforms
function Trackball3DPad({
  rotateX,
  rotateY,
  onChange,
  onLiveChange,
  onDragStart,
  onDragEnd,
  onReset,
  appTheme
}) {
  const padRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [liveX, setLiveX] = useState(rotateX || 0);
  const [liveY, setLiveY] = useState(rotateY || 0);
  const liveXRef = useRef(rotateX || 0);
  const liveYRef = useRef(rotateY || 0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    if (!isDraggingRef.current) {
      setLiveX(rotateX || 0);
      setLiveY(rotateY || 0);
      liveXRef.current = rotateX || 0;
      liveYRef.current = rotateY || 0;
    }
  }, [rotateX, rotateY]);

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rx: liveXRef.current,
      ry: liveYRef.current
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) { }
    onDragStart?.();
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Dragging right (dx > 0) turns icon right (increases rotateY in clockwise orbit)
    // Dragging down (dy > 0) tilts icon top forward (decreases rotateX)
    const newRy = Math.round(Math.max(-85, Math.min(85, dragStartRef.current.ry + dx * 0.5)));
    const newRx = Math.round(Math.max(-85, Math.min(85, dragStartRef.current.rx - dy * 0.5)));
    liveXRef.current = newRx;
    liveYRef.current = newRy;
    setLiveX(newRx);
    setLiveY(newRy);
    onLiveChange?.(newRx, newRy);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    setIsDragging(false);
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) { }
    onDragEnd?.();
    onChange?.(liveXRef.current, liveYRef.current);
  };

  // Map rotateX [-85, 85] and rotateY [-85, 85] to puck position [-36px, 36px]
  const puckX = Math.round((liveY / 85) * 36);
  const puckY = Math.round((-liveX / 85) * 36);

  return (
    <div className={`p-3 rounded-2xl border flex flex-col items-center gap-2 select-none ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
      }`}>
      <div className="w-full flex items-center justify-between text-[11px]">
        <span className={`font-semibold flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          <Compass className="w-3.5 h-3.5 text-cyan-500" /> 3D Virtual Orbit Pad
        </span>
        <button
          onClick={onReset}
          className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition ${appTheme === 'dark'
            ? 'border-slate-700 hover:border-slate-600 text-slate-400 hover:text-white'
            : 'border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-900'
            }`}
          title="Reset 3D tilt to 0° 0°"
        >
          Reset 0&deg;
        </button>
      </div>

      {/* Orbit Sphere Trackpad Area */}
      <div
        ref={padRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-36 h-36 rounded-full relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-shadow ${isDragging ? 'ring-2 ring-cyan-400/60 shadow-lg shadow-cyan-500/20' : ''
          } ${appTheme === 'dark'
            ? 'bg-gradient-to-b from-slate-950 via-[#0c1425] to-slate-950 border border-cyan-500/20 shadow-inner'
            : 'bg-gradient-to-b from-slate-100 via-white to-slate-200 border border-slate-300 shadow-inner'
          }`}
        title="Click & Drag in 3D space to rotate element"
      >
        {/* Concentric Gyro Rings */}
        <div className="absolute inset-2.5 rounded-full border border-dashed border-cyan-500/20 pointer-events-none" />
        <div className="absolute inset-7 rounded-full border border-cyan-500/30 pointer-events-none" />
        <div className="absolute inset-12 rounded-full border border-cyan-500/40 pointer-events-none" />

        {/* Crosshairs */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/25 pointer-events-none" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/25 pointer-events-none" />

        {/* 3D Wireframe Cube in Center */}
        <div
          className="w-10 h-10 rounded-lg border-2 border-cyan-400/80 pointer-events-none transition-transform duration-75 flex items-center justify-center shadow-lg shadow-cyan-500/20"
          style={{
            transform: `perspective(200px) rotateX(${liveX}deg) rotateY(${liveY}deg)`,
            background: appTheme === 'dark' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.25)'
          }}
        >
          <Box className="w-5 h-5 text-cyan-400 drop-shadow" />
        </div>

        {/* Moving Puck Indicator */}
        <div
          className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 pointer-events-none ring-2 ring-white/80 transition-transform duration-75"
          style={{
            transform: `translate(${puckX}px, ${puckY}px)`
          }}
        />
      </div>

      {/* Degree Readout Badges */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono font-semibold px-2">
        <span className="text-cyan-400">Pitch (X): {liveX > 0 ? `+${liveX}` : liveX}&deg;</span>
        <span className="text-blue-400">Yaw (Y): {liveY > 0 ? `+${liveY}` : liveY}&deg;</span>
      </div>
    </div>
  );
}

// Hardware-accelerated fast transform slider with live direct RAF GPU transforms
function FastTransformSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  onLiveChange,
  onDragStart,
  onDragEnd,
  className = "theme-slider w-full",
  accentColor,
  title
}) {
  const [localVal, setLocalVal] = useState(value);
  const isDraggingRef = useRef(false);
  const latestValRef = useRef(value);

  useEffect(() => {
    if (!isDraggingRef.current) {
      setLocalVal(value);
      latestValRef.current = value;
    }
  }, [value]);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) { }
    onDragStart?.();
  };

  const handleInput = (e) => {
    const num = Number(e.target.value);
    latestValRef.current = num;
    setLocalVal(num);
    onLiveChange?.(num);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) { }
    onDragEnd?.();
    onChange?.(latestValRef.current);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={localVal}
      onPointerDown={handlePointerDown}
      onInput={handleInput}
      onChange={handleInput}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={className}
      style={accentColor ? { accentColor } : undefined}
      title={title}
    />
  );
}


const PC_HELP_GUIDE = [
  {
    category: 'Canvas Navigation & View',
    items: [
      { title: 'Pan / Move Canvas', desc: 'Navigate and pan smoothly across the canvas in any direction', keys: ['Ctrl + Shift + Drag', 'Middle Click'] },
      { title: 'Smooth Zoom', desc: 'Scroll your mouse wheel or use +/- buttons to zoom smoothly', keys: ['Mouse Wheel', '+ / - Buttons'] },
      { title: 'Reset Zoom (100%)', desc: 'Reset view to 100% standard zoom and center canvas position', keys: ['Click 100% Pill'] },
      { title: 'Center Item / View', desc: 'Align the selected element or canvas view to center', keys: ['Ctrl + E'] }
    ]
  },
  {
    category: 'Selection & Movement (Fabric.js Engine)',
    items: [
      { title: 'Select Part / Element', desc: 'Click on any vector shape or path to select it', keys: ['Left Click'] },
      { title: 'Marquee Box Selection', desc: 'Drag across empty canvas background to create a selection box', keys: ['Drag Box'] },
      { title: 'Multi-Select Toggle', desc: 'Add or remove multiple parts from your current selection', keys: ['Shift + Click', 'Ctrl + Click'] },
      { title: 'Instant Drag & Move', desc: 'Click and drag any element or group across the canvas at 60 FPS', keys: ['Click & Drag'] },
      { title: 'Sub-select in Group', desc: 'Double-click any part inside a group to move it independently', keys: ['Double Click'] },
      { title: 'Deselect All', desc: 'Click on the empty canvas background to clear selection', keys: ['Click Canvas BG'] }
    ]
  },
  {
    category: 'Keyboard Shortcuts',
    items: [
      { title: 'Select All Elements', desc: 'Select all visual elements on the canvas simultaneously', keys: ['Ctrl + A'] },
      { title: 'Copy Elements', desc: 'Copy selected elements along with their colors and styles', keys: ['Ctrl + C'] },
      { title: 'Paste Elements', desc: 'Paste copied elements with automatic offset to new editable layers', keys: ['Ctrl + V'] },
      { title: 'Cut Elements', desc: 'Cut selected elements to clipboard', keys: ['Ctrl + X'] },
      { title: 'Duplicate Part', desc: 'Create an instant clone of the selected element', keys: ['Ctrl + D'] },
      { title: 'Delete Selected', desc: 'Remove selected element(s) from the canvas', keys: ['Delete', 'Backspace'] },
      { title: 'Undo Action', desc: 'Revert the last change or action', keys: ['Ctrl + Z'] },
      { title: 'Redo Action', desc: 'Re-apply the previously undone action', keys: ['Ctrl + Y', 'Ctrl + Shift + Z'] }
    ]
  },
  {
    category: 'Transform, Handles & Layout',
    items: [
      { title: 'Proportional Resize', desc: 'Drag any of the 4 corner white circles to scale proportionally', keys: ['Corner Circles'] },
      { title: 'Stretch Height / Width', desc: 'Drag top, bottom, left, or right edge pills to stretch', keys: ['Edge Pills'] },
      { title: 'Rotate Element', desc: 'Drag the circular rotate handle on the left of the bounding box', keys: ['Rotate Handle'] },
      { title: 'Quick 90° Rotate', desc: 'Instantly rotate the selected element by 90 degrees', keys: ['90° Button'] },
      { title: 'Tools Panel Resizer', desc: 'Drag the vertical divider line left or right to adjust workspace width', keys: ['Divider Line'] },
      { title: 'Color Wheel', desc: 'Double-click any color swatch to open full HEX/HSL color wheel', keys: ['Double Click Swatch'] }
    ]
  }
];

const MOBILE_HELP_GUIDE = [
  {
    category: 'Touch Gestures & Navigation',
    items: [
      { title: '2-Finger Pinch Zoom', desc: 'Pinch with two fingers on canvas to zoom in or out smoothly', gesture: '2-Finger Pinch' },
      { title: '2-Finger Canvas Pan', desc: 'Slide with two fingers to pan and navigate across the canvas', gesture: '2-Finger Slide' },
      { title: '1-Finger Tap Select', desc: 'Tap on any shape or icon part to select it', gesture: 'Single Tap' },
      { title: 'Touch Drag & Move', desc: 'Touch and slide with one finger to move any selected element', gesture: 'Touch & Drag' },
      { title: 'Deselect', desc: 'Tap on empty canvas background to clear active selection', gesture: 'Tap Canvas' }
    ]
  },
  {
    category: 'Mobile Quick Action Pill',
    items: [
      { title: 'Floating Action Bar', desc: 'Bottom pill appears with Duplicate and Delete options when an element is selected', gesture: 'Bottom Pill' },
      { title: 'Duplicate Part', desc: 'Tap Duplicate button in the bottom quick action bar', gesture: 'Duplicate Tap' },
      { title: 'Delete Part', desc: 'Tap Delete button in the bottom quick action bar', gesture: 'Delete Tap' }
    ]
  },
  {
    category: 'Canvas Height Resizer',
    items: [
      { title: 'Adjust Canvas Space', desc: 'Drag the horizontal glowing handle up or down to adjust canvas height', gesture: 'Drag Grip Bar' },
      { title: 'Reset Canvas Height', desc: 'Double-tap the divider pill to reset to default canvas height', gesture: 'Double Tap Grip' }
    ]
  },
  {
    category: 'Touch Transform & Styling',
    items: [
      { title: 'Corner Resize', desc: 'Drag corner dots with your finger to scale elements', gesture: 'Corner Dots' },
      { title: 'Touch Rotation', desc: 'Touch and rotate the handle on the bounding box', gesture: 'Rotate Handle' },
      { title: 'Color Wheel Modal', desc: 'Double-tap any color swatch to open the mobile color picker', gesture: 'Double Tap Swatch' },
      { title: 'Insert from Library', desc: 'Tap "Add Part" at the top to insert new vector shapes and icons', gesture: 'Top Toolbar' }
    ]
  }
];

export const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      console.warn(`[Storage] LocalStorage quota exceeded for '${key}'. Clearing cache.`);
      try {
        localStorage.removeItem('pixlflow_assets');
      } catch (_) {}
    } else {
      console.error(`[Storage] Error saving to localStorage for '${key}':`, e);
    }
    return false;
  }
};

const ModalPortal = ({ children, isMobile }) => {
  if (isMobile && typeof document !== 'undefined') {
    return createPortal(children, document.body);
  }
  return children;
};

export default function App() {
  const [elements, setElements] = useState(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('iconderry_assets') || localStorage.getItem('pixlflow_assets');
    } catch (_) {}
    const initialMap = new Map(INITIAL_ELEMENTS.map(el => [el.id, el]));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const parsedIds = new Set(parsed.map(p => p.id));
          const sanitized = parsed.map(item => {
            if (initialMap.has(item.id)) {
              const initialItem = initialMap.get(item.id);
              const cleanCode = normalizeForeignObjectSvg(item.originalSvgCode || item.svgCode || initialItem.svgCode);
              return {
                ...initialItem,
                ...item,
                svgCode: cleanCode,
                originalSvgCode: cleanCode
              };
            }
            const cleanCode = normalizeForeignObjectSvg(item.originalSvgCode || item.svgCode);
            return {
              ...item,
              svgCode: cleanCode,
              originalSvgCode: cleanCode
            };
          });

          // Always guarantee that any built-in defaults are present even if localStorage was pruned
          const missingDefaults = INITIAL_ELEMENTS
            .filter(d => !parsedIds.has(d.id))
            .map(d => ({ ...d, originalSvgCode: d.svgCode, downloads: d.downloads || 0 }));

          return [...sanitized, ...missingDefaults];
        }
      } catch (e) { console.error('Failed to parse cached assets:', e); }
    }
    return INITIAL_ELEMENTS.map(el => ({
      ...el,
      originalSvgCode: el.svgCode,
      downloads: el.downloads || 0
    }));
  });

  // Instant load from IndexedDB on startup/refresh (holds all elements with full SVGs, bypassing 5MB localStorage limit)
  useEffect(() => {
    loadElementsFromDB().then((cached) => {
      const initialMap = new Map(INITIAL_ELEMENTS.map(el => [el.id, el]));
      if (Array.isArray(cached) && cached.length > 0) {
        setElements(prev => {
          const cachedIds = new Set(cached.map(c => c.id));
          const normalizedCached = cached.map(item => {
            const initialItem = initialMap.get(item.id);
            const sourceSvg = item.svgCode || item.originalSvgCode || (initialItem ? initialItem.svgCode : '');
            const clean = normalizeForeignObjectSvg(sourceSvg);
            return {
              ...(initialItem || {}),
              ...item,
              svgCode: clean,
              originalSvgCode: clean
            };
          });
          const newFromInitial = INITIAL_ELEMENTS
            .filter(item => !cachedIds.has(item.id))
            .map(el => ({ ...el, originalSvgCode: el.svgCode, downloads: el.downloads || 0 }));

          const merged = newFromInitial.length > 0 ? [...normalizedCached, ...newFromInitial] : normalizedCached;
          saveElementsToDB(merged);
          return merged;
        });
      } else {
        saveElementsToDB(INITIAL_ELEMENTS);
      }
    });
  }, []);

  const isNativeApp = useMemo(() => {
    if (typeof window === 'undefined') return false;
    // Check official Capacitor native platform helper
    if (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function') {
      if (window.Capacitor.isNativePlatform()) return true;
    }
    return Boolean(
      window.IS_NATIVE_CAPACITOR ||
      document.documentElement.classList.contains('is-native-capacitor') ||
      window.AndroidNativeDownloader ||
      window.location.protocol === 'capacitor:' ||
      (/wv/i.test(navigator.userAgent) && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
    );
  }, []);

  const [activeTab, setActiveTab] = useState('browse');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  // Safety fallback for gallery skeleton loader (smooth zero-flicker experience)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGalleryLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic Category System & Custom Categories State
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('iconderry_custom_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return ['UI Icons', 'Brand Logos', 'Silhouettes', 'Badges & Stickers', '3D Elements', 'Illustrations', 'Awards', 'Cyber & Tech', 'Creative Tools'];
  });

  useEffect(() => {
    localStorage.setItem('iconderry_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  // Admin panel tabs & section state
  const [adminSection, setAdminSection] = useState('upload'); // 'upload' | 'categories'
  const [uploadMode, setUploadMode] = useState('single'); // 'single' | 'bulk'
  const [assetType, setAssetType] = useState('filled'); // 'silhouette' | 'linear' | 'filled' | '3d'
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const [detailModalAsset, setDetailModalAsset] = useState(null);

  // Protected Master Admin Section State (.env backed)
  const [isAdminPanelUnlocked, setIsAdminPanelUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('iconderry_admin_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleUnlockAdminPanel = (e) => {
    if (e) e.preventDefault();
    const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD || '@MOHDshahim').trim();
    if (adminPasswordInput.trim() === envPassword) {
      setIsAdminPanelUnlocked(true);
      try {
        sessionStorage.setItem('iconderry_admin_unlocked', 'true');
      } catch (err) {}
      setAdminPasswordError('');
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError('Incorrect password! Please enter the correct master password.');
    }
  };

  const handleLockAdminPanel = () => {
    setIsAdminPanelUnlocked(false);
    try {
      sessionStorage.removeItem('iconderry_admin_unlocked');
    } catch (err) {}
    setAdminSection('upload');
  };

  // Supabase User Auth State
  const [authUser, setAuthUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Listen for Supabase Auth session changes
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // Dynamic URL Deep Linking: (?icon=id) opens modal on initial load or browser back/forward
  useEffect(() => {
    if (!elements || elements.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const iconId = params.get('icon');
    if (iconId && (!detailModalAsset || detailModalAsset.id !== iconId)) {
      const match = elements.find(e => String(e.id) === String(iconId));
      if (match) {
        setDetailModalAsset(match);
      }
    }
  }, [elements]);

  // Sync URL query param & document.title when detailModalAsset changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (detailModalAsset) {
      url.searchParams.set('icon', detailModalAsset.id);
      window.history.replaceState({}, '', url.toString());
      document.title = `${detailModalAsset.title} - Free Icon Download | Iconderry`;
    } else {
      if (url.searchParams.has('icon')) {
        url.searchParams.delete('icon');
        window.history.replaceState({}, '', url.toString());
      }
      document.title = 'Iconderry - Advanced Visual Grading & 8K Multi-Format Engine';
    }
  }, [detailModalAsset]);

  // Bulk Upload State
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkCategory, setBulkCategory] = useState('UI Icons');
  const [bulkTags, setBulkTags] = useState('');
  const [bulkAssetType, setBulkAssetType] = useState('filled');
  const [isBulkPublishing, setIsBulkPublishing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const bulkFileInputRef = useRef(null);

  // Category Manager State
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { oldName: '', newName: '' }
  const [newCategoryManagerInput, setNewCategoryManagerInput] = useState('');

  // Single Admin form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('UI Icons');
  const [tags, setTags] = useState('');
  const [svgInput, setSvgInput] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [detectedShapeNotice, setDetectedShapeNotice] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Gallery Default Overwrite State (Admin Gallery Edit)
  const [isGalleryAdminMode, setIsGalleryAdminMode] = useState(false);
  const [isSavingGalleryDefault, setIsSavingGalleryDefault] = useState(false);
  const [saveDefaultSuccess, setSaveDefaultSuccess] = useState('');
  const [showCardSafeZone, setShowCardSafeZone] = useState(true);
  const [pendingDeletedIds, setPendingDeletedIds] = useState([]);
  const [isSavingGalleryDeletions, setIsSavingGalleryDeletions] = useState(false);
  const [galleryAdminToast, setGalleryAdminToast] = useState('');

  // Admin Item Metadata Edit Modal State (Title, Description, Category, Tags, Pack)
  const [editingModalAsset, setEditingModalAsset] = useState(null);
  const [editAssetTitle, setEditAssetTitle] = useState('');
  const [editAssetDescription, setEditAssetDescription] = useState('');
  const [editAssetCategory, setEditAssetCategory] = useState('');
  const [editAssetTags, setEditAssetTags] = useState('');
  const [editAssetPack, setEditAssetPack] = useState('');
  const [isSavingAssetDetails, setIsSavingAssetDetails] = useState(false);
  const [editAssetError, setEditAssetError] = useState('');
  const [editAssetSuccess, setEditAssetSuccess] = useState('');

  // App Theming & Settings Panel - Default is Light mode
  const [appTheme, setAppTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('iconderry_theme_v2');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    } catch (_) {
      return 'light';
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsToast, setSettingsToast] = useState('');
  const [backToast, setBackToast] = useState('');
  const lastBackPressRef = useRef(0);
  const backStateRef = useRef({});

  // Sync theme changes to html class & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iconderry_theme_v2', appTheme);
      localStorage.setItem('iconderry_theme', appTheme);
    } catch (_) {}
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (appTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#121316');
    }
  }, [appTheme]);

  // Export controls
  const [exportFormat, setExportFormat] = useState(() => localStorage.getItem('iconderry_default_format') || 'png');
  const [exportSize, setExportSize] = useState(() => Number(localStorage.getItem('iconderry_default_size')) || 1024);
  const [isTransparent, setIsTransparent] = useState(true);
  const [autoFitToElements, setAutoFitToElements] = useState(() => localStorage.getItem('iconderry_autofit_elements') !== 'false');
  const [autoFitFrameMode, setAutoFitFrameMode] = useState(() => localStorage.getItem('iconderry_autofit_mode') || 'square');
  const [downloading, setDownloading] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const cancelExportRef = useRef(false);
  const [previewBg, setPreviewBg] = useState(() => {
    try {
      return localStorage.getItem('iconderry_default_bg_v2') || 'light';
    } catch (_) {
      return 'light';
    }
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomLevelRef = useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;

  // Icon Dimensions & Aspect Ratio Controls (Moved to top so all callbacks have access)
  const [iconWidth, setIconWidth] = useState(384);
  const [iconHeight, setIconHeight] = useState(384);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

  const targetZoomRef = useRef(1);
  const currentZoomRef = useRef(1);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const canvasPanRef = useRef({ x: 0, y: 0 });
  canvasPanRef.current = canvasPan;
  const targetPanRef = useRef({ x: 0, y: 0 });
  const animFrameIdRef = useRef(null);

  const [isPanning, setIsPanning] = useState(false);
  const [isCtrlShiftDown, setIsCtrlShiftDown] = useState(false);
  const canvasWorkspaceRef = useRef(null);
  const isDraggingPanRef = useRef(false);
  const startPanPosRef = useRef({ x: 0, y: 0 });
  const startPanOffsetRef = useRef({ x: 0, y: 0 });
  const justFinishedPanRef = useRef(false);

  // Vector Layers & Part Transforms & Multi-Selection & Layer Styles
  const [selectedLayerId, setSelectedLayerId] = useState(null);
  const selectedLayerIdRef = useRef(null);
  selectedLayerIdRef.current = selectedLayerId;
  const [selectedLayerIds, setSelectedLayerIds] = useState([]);
  const selectedLayerIdsRef = useRef([]);
  selectedLayerIdsRef.current = selectedLayerIds;
  const [layerTransforms, setLayerTransforms] = useState({});
  const layerTransformsRef = useRef({});
  layerTransformsRef.current = layerTransforms;
  const [layerStyles, setLayerStyles] = useState({});
  const layerStylesRef = useRef({});
  layerStylesRef.current = layerStyles;
  const [layerOrder, setLayerOrder] = useState([]);
  const layerOrderRef = useRef([]);
  layerOrderRef.current = layerOrder;
  const [svgLayers, setSvgLayers] = useState([]);
  const [layerGroups, setLayerGroups] = useState({}); // { [groupId]: string[] }
  const layerGroupsRef = useRef({});
  layerGroupsRef.current = layerGroups;
  const prevAssetIdRef = useRef(null);
  const assetCustomizationsMapRef = useRef({});
  const [layerListViewMode, setLayerListViewMode] = useState('layers'); // 'layers' | 'colors'
  const [draggedLayerIdx, setDraggedLayerIdx] = useState(null);
  const [dragOverLayerIdx, setDragOverLayerIdx] = useState(null);

  // Canvas Vector Part Dragging & Marquee Selection Refs
  const isDraggingLayerRef = useRef(false);
  const layerDragStartPosRef = useRef({ x: 0, y: 0 });
  const layerDragInitialTransformsRef = useRef({});
  const justFinishedLayerDragRef = useRef(false);
  const recordUndoRef = useRef(null);
  const getStudioSnapshotRef = useRef(null);
  const dragInitialSnapshotRef = useRef(null);
  const handleUndoRef = useRef(null);
  const handleRedoRef = useRef(null);

  // Marquee Selection Box State (Click & Drag over Canvas)
  const [marqueeBox, setMarqueeBox] = useState(null);

  // Multi-Touch & Pinch-Zoom Protection Refs
  const isPinchingRef = useRef(false);
  const activePointersRef = useRef(new Map());
  const activeTargetLayerElRef = useRef(null);
  const activePointerIdRef = useRef(null);

  // Deleted & Duplicated Layers State
  const [deletedLayerIds, setDeletedLayerIds] = useState([]);
  const deletedLayerIdsRef = useRef([]);
  deletedLayerIdsRef.current = deletedLayerIds;

  const [duplicatedLayers, setDuplicatedLayers] = useState([]);
  const duplicatedLayersRef = useRef([]);
  duplicatedLayersRef.current = duplicatedLayers;

  // Interactive Transform Bounding Box State (8 Resize handles & Rotation handle)
  const [transformBox, setTransformBox] = useState(null);
  const transformBoxRef = useRef(null);
  const updateTransformBoxRef = useRef(null);
  const lastCanvasClickRef = useRef({ time: 0, layerId: null, x: 0, y: 0 });
  const clipboardLayersRef = useRef(null);
  const cardGuideRef = useRef(null);
  const canvasViewportRef = useRef(null);

  // Sync refs when zoomLevel is updated externally
  useEffect(() => {
    if (!animFrameIdRef.current) {
      currentZoomRef.current = zoomLevel;
    }
    if (canvasViewportRef.current) {
      canvasViewportRef.current.style.setProperty('--stage-zoom', zoomLevel);
      canvasViewportRef.current.style.setProperty('--inv-zoom', 1 / (zoomLevel || 1));
    }
  }, [zoomLevel]);

  // Butter-smooth inertial LERP animation loop with zero-lag direct GPU transform
  const startSmoothZoomLoop = () => {
    if (animFrameIdRef.current) return;

    if (canvasViewportRef.current) {
      canvasViewportRef.current.style.willChange = 'transform';
    }
    if (canvasSvgContainerRef.current) {
      canvasSvgContainerRef.current.style.pointerEvents = 'none';
    }

    const tick = () => {
      const curZ = currentZoomRef.current;
      const tgtZ = targetZoomRef.current;
      const diffZ = tgtZ - curZ;

      const curPan = canvasPanRef.current;
      const tgtPan = targetPanRef.current;
      const diffPanX = tgtPan.x - curPan.x;
      const diffPanY = tgtPan.y - curPan.y;

      const isZoomDone = Math.abs(diffZ) < 0.003;
      const isPanDone = Math.abs(diffPanX) < 1.0 && Math.abs(diffPanY) < 1.0;

      if (isZoomDone && isPanDone) {
        currentZoomRef.current = tgtZ;
        const finalPan = tgtZ <= 1.05 ? { x: 0, y: 0 } : tgtPan;
        canvasPanRef.current = finalPan;
        targetPanRef.current = finalPan;

        // Final commit to React state once deceleration settles
        setZoomLevel(Number(tgtZ.toFixed(3)));
        setCanvasPan(finalPan);

        if (canvasViewportRef.current) {
          canvasViewportRef.current.style.transform = `translate3d(${finalPan.x}px, ${finalPan.y}px, 0px) scale(${tgtZ})`;
          canvasViewportRef.current.style.setProperty('--stage-zoom', tgtZ);
          canvasViewportRef.current.style.setProperty('--inv-zoom', 1 / tgtZ);
          canvasViewportRef.current.style.willChange = 'auto';
        }
        if (canvasSvgContainerRef.current) {
          canvasSvgContainerRef.current.style.pointerEvents = '';
        }

        const badge = document.getElementById('live-zoom-badge');
        if (badge) badge.textContent = `${Math.round(tgtZ * 100)}%`;

        animFrameIdRef.current = null;
        return;
      }

      // Ultra-snappy 0.55 easing factor (immediate 2-3 frame response for zero sluggishness)
      const ease = 0.55;
      const nextZ = curZ + diffZ * ease;
      currentZoomRef.current = nextZ;

      const nextPanX = curPan.x + diffPanX * ease;
      const nextPanY = curPan.y + diffPanY * ease;
      canvasPanRef.current = {
        x: Math.round(nextPanX),
        y: Math.round(nextPanY)
      };

      // Direct GPU transform update on the 2D viewport container during gliding (pure GPU compositor, zero reflow!)
      if (canvasViewportRef.current) {
        canvasViewportRef.current.style.transform = `translate3d(${canvasPanRef.current.x}px, ${canvasPanRef.current.y}px, 0px) scale(${nextZ})`;
      }

      // Smooth scale card safe zone frame synchronously with canvas
      if (cardGuideRef.current) {
        cardGuideRef.current.style.transform = `translate(-50%, -50%) translate(${canvasPanRef.current.x}px, ${canvasPanRef.current.y}px) scale(${nextZ})`;
      }

      // Live update zoom percentage badge in UI
      const badge = document.getElementById('live-zoom-badge');
      if (badge) badge.textContent = `${Math.round(nextZ * 100)}%`;

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
  };

  // Direct mouse scroll wheel zoom handler (pure wheel - no Ctrl or Shift needed!)
  const handleWheel = (e) => {
    // Prevent document page scroll
    e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    const delta = e.deltaY;
    const clampedDelta = Math.max(-120, Math.min(120, delta));
    // Fast, responsive zoom multiplier (~38% magnification/reduction per notch)
    const zoomIntensity = 0.0038;
    const factor = Math.exp(-clampedDelta * zoomIntensity);

    const prevTarget = targetZoomRef.current;
    const nextTarget = Math.min(6, Math.max(0.4, Number((prevTarget * factor).toFixed(3))));
    targetZoomRef.current = nextTarget;

    // Zoom centered towards mouse cursor position
    const wsEl = canvasWorkspaceRef.current;
    if (wsEl) {
      const wsRect = wsEl.getBoundingClientRect();
      const cx = e.clientX - (wsRect.left + wsRect.width / 2);
      const cy = e.clientY - (wsRect.top + wsRect.height / 2);

      if (nextTarget <= 1.05) {
        targetPanRef.current = { x: 0, y: 0 };
      } else {
        const curPan = targetPanRef.current;
        const zoomRatio = nextTarget / prevTarget;
        targetPanRef.current = {
          x: Math.round(cx - (cx - curPan.x) * zoomRatio),
          y: Math.round(cy - (cy - curPan.y) * zoomRatio)
        };
      }
    }

    startSmoothZoomLoop();
  };

  // Track Ctrl + Shift keyboard state for canvas pan mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        setIsCtrlShiftDown(true);
      }
    };
    const handleKeyUp = (e) => {
      if (!e.ctrlKey || !e.shiftKey) {
        setIsCtrlShiftDown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer down handler to initiate canvas pan (Ctrl+Shift / Middle click) or Vector Part Drag-to-Move (Left click)
  const handleCanvasPointerDown = (e) => {
    // If in Draw mode, never trigger selection box or layer dragging!
    if (studioTab === 'draw') return;
    // Multi-touch tracking to prevent dual-finger gestures from dragging vector parts
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const onGlobalPointerRelease = (releaseEvt) => {
      activePointersRef.current.delete(releaseEvt.pointerId);
      if (activePointersRef.current.size < 2) {
        isPinchingRef.current = false;
      }
    };
    window.addEventListener('pointerup', onGlobalPointerRelease, { once: true });
    window.addEventListener('pointercancel', onGlobalPointerRelease, { once: true });

    // If 2 or more touches/fingers detected or pinch active on mobile, abort layer dragging immediately
    if (activePointersRef.current.size >= 2 || isPinchingRef.current) {
      if (isDraggingLayerRef.current) {
        isDraggingLayerRef.current = false;
        if (layerDragInitialTransformsRef.current) {
          setLayerTransforms(prev => ({
            ...prev,
            ...layerDragInitialTransformsRef.current
          }));
        }
        try {
          if (activeTargetLayerElRef.current?.releasePointerCapture && activePointerIdRef.current !== null) {
            activeTargetLayerElRef.current.releasePointerCapture(activePointerIdRef.current);
          }
        } catch (_) { }
        activeTargetLayerElRef.current = null;
        activePointerIdRef.current = null;
      }
      return;
    }

    // 1. Canvas Viewport Pan mode: Ctrl + Shift or Middle mouse button
    if ((e.ctrlKey && e.shiftKey) || e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      isDraggingPanRef.current = true;
      startPanPosRef.current = { x: e.clientX, y: e.clientY };
      startPanOffsetRef.current = { ...canvasPanRef.current };
      setIsPanning(true);

      const handlePointerMove = (moveEvt) => {
        if (!isDraggingPanRef.current) return;
        moveEvt.preventDefault();
        const dx = moveEvt.clientX - startPanPosRef.current.x;
        const dy = moveEvt.clientY - startPanPosRef.current.y;

        const el = canvasWorkspaceRef.current;
        let maxPanX = Infinity;
        let maxPanY = Infinity;
        const currentZoom = zoomLevelRef.current || 1;
        if (el && currentZoom > 1.05) {
          const rect = el.getBoundingClientRect();
          // Keep element bounded inside workspace so it can never be lost outside screen
          maxPanX = Math.max(60, (rect.width * (currentZoom - 0.85)) / 2);
          maxPanY = Math.max(60, (rect.height * (currentZoom - 0.85)) / 2);
        } else if (currentZoom <= 1.05) {
          maxPanX = 0;
          maxPanY = 0;
        }

        if (e.pointerType === 'mouse' && e.buttons === 0) {
          handlePointerUp();
          return;
        }

        const rawX = startPanOffsetRef.current.x + dx;
        const rawY = startPanOffsetRef.current.y + dy;
        const nextX = Math.round(Math.max(-maxPanX, Math.min(maxPanX, rawX)));
        const nextY = Math.round(Math.max(-maxPanY, Math.min(maxPanY, rawY)));

        targetPanRef.current = { x: nextX, y: nextY };
        setCanvasPan({ x: nextX, y: nextY });
      };

      const handlePointerUp = () => {
        try {
          if (isDraggingPanRef.current) {
            isDraggingPanRef.current = false;
            setIsPanning(false);
            justFinishedPanRef.current = true;
            setTimeout(() => {
              justFinishedPanRef.current = false;
            }, 80);
          }
        } finally {
          window.removeEventListener('pointermove', handlePointerMove, true);
          window.removeEventListener('pointerup', handlePointerUp, true);
          window.removeEventListener('pointercancel', handlePointerUp, true);
          window.removeEventListener('mouseup', handlePointerUp, true);
          window.removeEventListener('touchend', handlePointerUp, true);
          window.removeEventListener('blur', handlePointerUp);
        }
      };

      window.addEventListener('pointermove', handlePointerMove, { capture: true });
      window.addEventListener('pointerup', handlePointerUp, { capture: true });
      window.addEventListener('pointercancel', handlePointerUp, { capture: true });
      window.addEventListener('mouseup', handlePointerUp, { capture: true });
      window.addEventListener('touchend', handlePointerUp, { capture: true });
      window.addEventListener('blur', handlePointerUp);
      return;
    }

    // 2. Direct Left Click on Canvas: Vector Part Drag OR Marquee Drag-to-Select
    if (e.button === 0) {
      // 1. If clicked on a button or UI control, ignore canvas pointer down completely
      const isInsideSvg = Boolean(canvasSvgContainerRef.current && canvasSvgContainerRef.current.contains(e.target));
      if (!isInsideSvg) {
        if (e.target.closest('button') || e.target.closest('.pointer-events-auto') || e.target.closest('[data-no-canvas-click]')) {
          return;
        }
      } else {
        if (e.target.closest('button') || e.target.closest('[data-no-canvas-click]')) {
          return;
        }
      }

      // If dual fingers or pinch active, do not select or drag
      if (e.pointerType === 'touch' && (activePointersRef.current.size >= 2 || isPinchingRef.current)) {
        return;
      }

      let targetLayerEl = e.target.closest('[data-layer-id]');
      if (targetLayerEl && isSystemWrapper(targetLayerEl)) {
        targetLayerEl = null;
      }
      const currentSelected = selectedLayerIdsRef.current || [];

      // Proximity / Direct SVG Shape or HTML Element Hit-Testing
      if (!targetLayerEl && canvasSvgContainerRef.current) {
        const svgContainer = canvasSvgContainerRef.current;
        const svgEl = svgContainer.querySelector('svg');
        if (svgEl) tagSvgElements(svgEl);

        const shapeEl = e.target.closest('path, rect, circle, ellipse, polygon, polyline, line, text, foreignObject div, foreignObject span, foreignObject section, foreignObject p, foreignObject button, foreignObject a');
        if (shapeEl && svgContainer.contains(shapeEl) && !isSystemWrapper(shapeEl)) {
          targetLayerEl = shapeEl.closest('[data-layer-id]') || shapeEl;
        }
      }

      // Proximity Hit-Testing: Fast check for SVG or HTML elements under cursor
      if (!targetLayerEl && canvasSvgContainerRef.current) {
        const svgContainer = canvasSvgContainerRef.current;
        const elsUnderPoint = document.elementsFromPoint ? document.elementsFromPoint(e.clientX, e.clientY) : [];
        for (const el of elsUnderPoint) {
          if (!svgContainer.contains(el) || isSystemWrapper(el)) continue;
          const layer = el.closest('[data-layer-id]') || el.closest('path, rect, circle, ellipse, polygon, polyline, line, text, foreignObject div, foreignObject span, foreignObject section, foreignObject p, foreignObject button, foreignObject a');
          if (layer && !isSystemWrapper(layer)) {
            targetLayerEl = layer.closest('[data-layer-id]') || layer;
            break;
          }
        }
      }

      // Proximity Hit-Testing for thin stroke vector lines (5px cross radius)
      if (!targetLayerEl && canvasSvgContainerRef.current) {
        const svgContainer = canvasSvgContainerRef.current;
        const proximityOffsets = [
          { x: -5, y: 0 }, { x: 5, y: 0 }, { x: 0, y: -5 }, { x: 0, y: 5 },
          { x: -4, y: -4 }, { x: 4, y: -4 }, { x: -4, y: 4 }, { x: 4, y: 4 }
        ];
        for (const off of proximityOffsets) {
          const els = document.elementsFromPoint ? document.elementsFromPoint(e.clientX + off.x, e.clientY + off.y) : [];
          for (const el of els) {
            if (!svgContainer.contains(el) || isSystemWrapper(el)) continue;
            const layer = el.closest('[data-layer-id]') || el.closest('path, rect, circle, ellipse, polygon, polyline, line, text, foreignObject div, foreignObject span, foreignObject section, foreignObject p, foreignObject button, foreignObject a');
            if (layer && !isSystemWrapper(layer)) {
              targetLayerEl = layer.closest('[data-layer-id]') || layer;
              break;
            }
          }
          if (targetLayerEl) break;
        }
      }



      // Check if clicked anywhere inside the active Transform Bounding Box of selected elements
      // (Using exact screen bounding client rect so it works flawlessly across all zoom levels and 3D tilts!)
      let isInsideTransformBox = false;
      if (!targetLayerEl && transformBoxRef.current && currentSelected.length > 0) {
        const bRect = transformBoxRef.current.getBoundingClientRect();
        isInsideTransformBox = (
          e.clientX >= bRect.left &&
          e.clientX <= bRect.right &&
          e.clientY >= bRect.top &&
          e.clientY <= bRect.bottom
        );
      }

      // Case A: Clicked directly on a Vector Shape / Part OR inside the active Bounding Box of selected elements
      if (targetLayerEl || isInsideTransformBox) {
        const rawLayerId = targetLayerEl?.getAttribute('data-layer-id');
        const layerId = rawLayerId ? rawLayerId.replace(/^pf_studio_/i, '') : null;

        // Double-click / double-tap detection on specific layer part
        const now = Date.now();
        const lastClick = lastCanvasClickRef.current;
        const isDoubleClickOnLayer = Boolean(
          layerId && (
            e.detail >= 2 ||
            (lastClick &&
              lastClick.layerId === layerId &&
              now - lastClick.time < 380 &&
              Math.hypot(e.clientX - lastClick.x, e.clientY - lastClick.y) < 25)
          )
        );
        lastCanvasClickRef.current = { time: now, layerId, x: e.clientX, y: e.clientY };

        let activeIds = currentSelected;

        if (layerId) {
          const currentGroups = layerGroupsRef.current || {};
          const belongingGroup = Object.values(currentGroups).find(ids => ids.includes(layerId));

          if (belongingGroup) {
            if (isDoubleClickOnLayer) {
              activeIds = [layerId];
              setSelectedLayerIds([layerId]);
              setSelectedLayerId(layerId);
            } else if (e.shiftKey || e.ctrlKey || e.metaKey) {
              const allSelected = belongingGroup.every(id => currentSelected.includes(id));
              if (allSelected) {
                activeIds = currentSelected.filter(id => !belongingGroup.includes(id));
              } else {
                activeIds = Array.from(new Set([...currentSelected, ...belongingGroup]));
              }
              setSelectedLayerIds(activeIds);
              setSelectedLayerId(activeIds[activeIds.length - 1] || null);
            } else {
              if (currentSelected.length === 1 && currentSelected[0] === layerId) {
                activeIds = [layerId];
              } else {
                activeIds = belongingGroup;
                setSelectedLayerIds(belongingGroup);
                setSelectedLayerId(belongingGroup[0]);
              }
            }
          } else {
            if (e.shiftKey || e.ctrlKey || e.metaKey) {
              activeIds = currentSelected.includes(layerId)
                ? currentSelected.filter(id => id !== layerId)
                : [...currentSelected, layerId];
              setSelectedLayerIds(activeIds);
              setSelectedLayerId(activeIds[activeIds.length - 1] || null);
            } else {
              if (currentSelected.includes(layerId) && currentSelected.length > 1) {
                activeIds = currentSelected;
              } else {
                activeIds = [layerId];
                setSelectedLayerIds([layerId]);
              }
              setSelectedLayerId(layerId);
            }
          }
        } else if (isInsideTransformBox) {
          activeIds = currentSelected;
        }

        if (activeIds.length === 0) return;

        selectedLayerIdsRef.current = activeIds;
        selectedLayerIdRef.current = activeIds[0] || null;

        const freshBox = updateTransformBox(activeIds);

        e.preventDefault();
        e.stopPropagation();

        isDraggingLayerRef.current = true;
        layerDragStartPosRef.current = { x: e.clientX, y: e.clientY };
        dragInitialSnapshotRef.current = getStudioSnapshotRef.current ? getStudioSnapshotRef.current() : null;
        activeTargetLayerElRef.current = targetLayerEl;
        activePointerIdRef.current = e.pointerId;

        try {
          const captureEl = canvasWorkspaceRef.current;
          if (e.pointerId !== undefined && captureEl?.setPointerCapture) {
            captureEl.setPointerCapture(e.pointerId);
          }
        } catch (_) { }

        const initialTransforms = {};
        activeIds.forEach(id => {
          const cleanId = String(id).replace(/^pf_studio_/i, '');
          initialTransforms[cleanId] = layerTransformsRef.current[cleanId] || layerTransformsRef.current[id] || { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 };
          initialTransforms[id] = initialTransforms[cleanId];
        });
        layerDragInitialTransformsRef.current = initialTransforms;

        const svgContainer = canvasSvgContainerRef.current;
        const svgEl = svgContainer?.querySelector('svg');
        const invScreenCTM = svgEl?.getScreenCTM ? svgEl.getScreenCTM()?.inverse() : null;

        const vb = svgEl?.viewBox?.baseVal;
        const vbWidth = (vb && vb.width > 0) ? vb.width : (svgEl?.clientWidth || iconWidth);
        const vbHeight = (vb && vb.height > 0) ? vb.height : (svgEl?.clientHeight || iconHeight);
        const padLeft = parseFloat(getComputedStyle(svgContainer || document.body).paddingLeft) || 0;
        const padRight = parseFloat(getComputedStyle(svgContainer || document.body).paddingRight) || 0;
        const padTop = parseFloat(getComputedStyle(svgContainer || document.body).paddingTop) || 0;
        const padBottom = parseFloat(getComputedStyle(svgContainer || document.body).paddingBottom) || 0;
        const contentW = Math.max(10, iconWidth - padLeft - padRight);
        const contentH = Math.max(10, iconHeight - padTop - padBottom);
        const svgToContainerScaleX = contentW / vbWidth;
        const svgToContainerScaleY = contentH / vbHeight;

        const activeDomNodes = activeIds.map(id => {
          const cleanId = String(id).replace(/^pf_studio_/i, '');
          const numOnly = cleanId.replace(/\D/g, '');
          const node = svgContainer?.querySelector(`[data-layer-id="${id}"]`) ||
            svgContainer?.querySelector(`[data-layer-id="${cleanId}"]`) ||
            (numOnly ? svgContainer?.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
          const origAttr = node ? (node.getAttribute('data-orig-transform') || '') : '';
          const baseTransform = node ? (node.getAttribute('data-base-transform') || '') : '';
          const isHtml = node ? (Boolean(node.closest('foreignObject')) || node.tagName?.toLowerCase() === 'div' || node.tagName?.toLowerCase() === 'span') : false;
          const parentMatrix = (isHtml && node) ? getParentTransformMatrix(node) : null;
          const invParentMatrix = (parentMatrix && !parentMatrix.isIdentity) ? parentMatrix.inverse() : null;
          return { id, cleanId, node, origAttr, baseTransform, isHtml, invParentMatrix };
        }).filter(item => item.node);

        let hasActuallyMoved = false;
        const DRAG_THRESHOLD = e.pointerType === 'touch' ? 8 : 2;
        let dragRafId = null;
        let latestDx = 0;
        let latestDy = 0;
        let latestSvgDx = 0;
        let latestSvgDy = 0;

        const handleLayerMove = (moveEvt) => {
          if (!isDraggingLayerRef.current) return;

          if (moveEvt.pointerType === 'mouse' && moveEvt.buttons === 0) {
            handleLayerUp(moveEvt);
            return;
          }

          if (isPinchingRef.current || activePointersRef.current.size >= 2 || (moveEvt.touches && moveEvt.touches.length >= 2)) {
            isDraggingLayerRef.current = false;
            document.body.classList.remove('is-dragging-layer');
            if (transformBoxRef.current) {
              transformBoxRef.current.style.transform = '';
            }
            if (layerDragInitialTransformsRef.current && hasActuallyMoved) {
              setLayerTransforms(prev => ({
                ...prev,
                ...layerDragInitialTransformsRef.current
              }));
            }
            try {
              if (canvasWorkspaceRef.current?.releasePointerCapture && e.pointerId !== undefined) {
                canvasWorkspaceRef.current.releasePointerCapture(e.pointerId);
              }
            } catch (_) { }
            activeTargetLayerElRef.current = null;
            activePointerIdRef.current = null;
            return;
          }

          const clientX = moveEvt.clientX ?? moveEvt.touches?.[0]?.clientX ?? 0;
          const clientY = moveEvt.clientY ?? moveEvt.touches?.[0]?.clientY ?? 0;
          const rawDx = clientX - layerDragStartPosRef.current.x;
          const rawDy = clientY - layerDragStartPosRef.current.y;

          if (!hasActuallyMoved) {
            if (Math.hypot(rawDx, rawDy) < DRAG_THRESHOLD) {
              return;
            }
            hasActuallyMoved = true;
            document.body.classList.add('is-dragging-layer');
          }

          if (moveEvt.preventDefault) moveEvt.preventDefault();

          latestDx = rawDx;
          latestDy = rawDy;

          if (invScreenCTM && svgEl?.createSVGPoint) {
            const pt0 = svgEl.createSVGPoint();
            pt0.x = 0; pt0.y = 0;
            const pt1 = svgEl.createSVGPoint();
            pt1.x = rawDx; pt1.y = rawDy;
            const p0 = pt0.matrixTransform(invScreenCTM);
            const p1 = pt1.matrixTransform(invScreenCTM);
            latestSvgDx = p1.x - p0.x;
            latestSvgDy = p1.y - p0.y;
          } else {
            const curZoom = currentZoomRef.current || zoomLevel || 1;
            latestSvgDx = (rawDx / curZoom) / svgToContainerScaleX;
            latestSvgDy = (rawDy / curZoom) / svgToContainerScaleY;
          }

          if (dragRafId) return;
          dragRafId = requestAnimationFrame(() => {
            dragRafId = null;
            if (!isDraggingLayerRef.current) return;

            const curSvgDx = latestSvgDx;
            const curSvgDy = latestSvgDy;

            // Direct smooth SVG transform updates on active nodes in viewBox space
            activeDomNodes.forEach(({ id, cleanId, node, origAttr, baseTransform, isHtml, invParentMatrix }) => {
              const init = initialTransforms[cleanId] || initialTransforms[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, rotateX: 0, rotateY: 0, z: 0 };
              
              let effectiveDx = curSvgDx;
              let effectiveDy = curSvgDy;
              if (invParentMatrix) {
                const localDelta = invParentMatrix.transformPoint(new DOMPoint(curSvgDx, curSvgDy));
                effectiveDx = localDelta.x;
                effectiveDy = localDelta.y;
              }

              const targetX = Number((init.x + effectiveDx).toFixed(3));
              const targetY = Number((init.y + effectiveDy).toFixed(3));
              const rx = init.rotateX || 0;
              const ry = init.rotateY || 0;
              const z = init.z || 0;
              const rot = init.rotate || 0;
              const scaleX = init.scaleX ?? 1;
              const scaleY = init.scaleY ?? 1;
              const cx = init.cx || 0;
              const cy = init.cy || 0;
              const has3DLayer = rx !== 0 || ry !== 0 || z !== 0;

              const parts = [];
              if (targetX !== 0 || targetY !== 0) {
                parts.push(`translate(${targetX} ${targetY})`);
              }
              const hasRotate = rot !== 0;
              const hasScale = scaleX !== 1 || scaleY !== 1;
              if (hasRotate || hasScale) {
                if (cx !== 0 || cy !== 0) {
                  parts.push(`translate(${cx} ${cy})`);
                  if (hasRotate) parts.push(`rotate(${rot})`);
                  if (hasScale) parts.push(`scale(${scaleX} ${scaleY})`);
                  parts.push(`translate(${-cx} ${-cy})`);
                } else {
                  if (hasRotate) parts.push(`rotate(${rot})`);
                  if (hasScale) parts.push(`scale(${scaleX} ${scaleY})`);
                }
              }
              if (origAttr) parts.push(origAttr);
              node.setAttribute('transform', parts.join(' '));

              if (isHtml || node.closest('foreignObject') || node.tagName?.toLowerCase() === 'div' || node.tagName?.toLowerCase() === 'span') {
                const transformTokens = [];
                if (targetX !== 0 || targetY !== 0) transformTokens.push(`translate(${targetX}px, ${targetY}px)`);
                if (rot !== 0) transformTokens.push(`rotate(${rot}deg)`);
                if (scaleX !== 1 || scaleY !== 1) transformTokens.push(`scale(${scaleX}, ${scaleY})`);
                if (baseTransform) transformTokens.push(baseTransform);
                node.style.transform = transformTokens.join(' ') || 'none';
                node.style.transformOrigin = 'center center';
              } else if (has3DLayer) {
                node.style.transformBox = 'fill-box';
                node.style.transformOrigin = 'center';
                node.style.transform = `perspective(800px) translate3d(${targetX}px, ${targetY}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg)`;
              } else {
                node.style.transform = '';
              }
            });

            // Direct transform on Transform Bounding Box frame in container space for 1:1 lockstep tracking
            if (transformBoxRef.current) {
              const boxDx = curSvgDx * svgToContainerScaleX;
              const boxDy = curSvgDy * svgToContainerScaleY;
              const base3D = has3D ? ` translate3d(0, 0, ${adjustments.translateZ || 0}px) rotateX(${adjustments.rotateX || 0}deg) rotateY(${adjustments.rotateY || 0}deg)` : '';
              transformBoxRef.current.style.transform = `translate3d(${boxDx}px, ${boxDy}px, 0px)${base3D}`;
            }
          });
        };

        const handleLayerUp = (upEvt) => {
          try {
            document.body.classList.remove('is-dragging-layer');
            activePointersRef.current.delete(e.pointerId);
            activeTargetLayerElRef.current = null;
            activePointerIdRef.current = null;

            if (dragRafId) {
              cancelAnimationFrame(dragRafId);
              dragRafId = null;
            }
            try {
              const captureEl = canvasWorkspaceRef.current;
              if (e.pointerId !== undefined && captureEl?.releasePointerCapture) {
                captureEl.releasePointerCapture(e.pointerId);
              }
            } catch (_) { }

            if (isDraggingLayerRef.current) {
              isDraggingLayerRef.current = false;
              if (hasActuallyMoved) {
                const finalSvgDx = latestSvgDx;
                const finalSvgDy = latestSvgDy;

                // 1. Commit new transforms to layerTransformsRef
                const updatedTransforms = { ...layerTransformsRef.current };
                activeIds.forEach(id => {
                  const cleanId = String(id).replace(/^pf_studio_/i, '');
                  const domInfo = activeDomNodes.find(item => item.id === id || item.cleanId === cleanId);
                  const init = initialTransforms[cleanId] || initialTransforms[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, rotateX: 0, rotateY: 0, z: 0 };
                  
                  let effectiveDx = finalSvgDx;
                  let effectiveDy = finalSvgDy;
                  if (domInfo?.invParentMatrix) {
                    const localDelta = domInfo.invParentMatrix.transformPoint(new DOMPoint(finalSvgDx, finalSvgDy));
                    effectiveDx = localDelta.x;
                    effectiveDy = localDelta.y;
                  }

                  const newX = Number((init.x + effectiveDx).toFixed(3));
                  const newY = Number((init.y + effectiveDy).toFixed(3));
                  updatedTransforms[cleanId] = {
                    ...(layerTransformsRef.current[cleanId] || {}),
                    x: newX,
                    y: newY
                  };
                  if (id !== cleanId) {
                    updatedTransforms[id] = updatedTransforms[cleanId];
                  }
                });
                layerTransformsRef.current = updatedTransforms;

                // 2. Synchronously ensure DOM node transform attribute is finalized
                activeDomNodes.forEach(({ id, cleanId, node, origAttr, baseTransform, isHtml, invParentMatrix }) => {
                  const init = initialTransforms[cleanId] || initialTransforms[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1, rotateX: 0, rotateY: 0, z: 0 };
                  
                  let effectiveDx = finalSvgDx;
                  let effectiveDy = finalSvgDy;
                  if (invParentMatrix) {
                    const localDelta = invParentMatrix.transformPoint(new DOMPoint(finalSvgDx, finalSvgDy));
                    effectiveDx = localDelta.x;
                    effectiveDy = localDelta.y;
                  }

                  const targetX = Number((init.x + effectiveDx).toFixed(3));
                  const targetY = Number((init.y + effectiveDy).toFixed(3));
                  const rx = init.rotateX || 0;
                  const ry = init.rotateY || 0;
                  const z = init.z || 0;
                  const rot = init.rotate || 0;
                  const scaleX = init.scaleX ?? 1;
                  const scaleY = init.scaleY ?? 1;
                  const cx = init.cx || 0;
                  const cy = init.cy || 0;
                  const has3DLayer = rx !== 0 || ry !== 0 || z !== 0;

                  const parts = [];
                  if (targetX !== 0 || targetY !== 0) {
                    parts.push(`translate(${targetX} ${targetY})`);
                  }
                  const hasRotate = rot !== 0;
                  const hasScale = scaleX !== 1 || scaleY !== 1;
                  if (hasRotate || hasScale) {
                    if (cx !== 0 || cy !== 0) {
                      parts.push(`translate(${cx} ${cy})`);
                      if (hasRotate) parts.push(`rotate(${rot})`);
                      if (hasScale) parts.push(`scale(${scaleX} ${scaleY})`);
                      parts.push(`translate(${-cx} ${-cy})`);
                    } else {
                      if (hasRotate) parts.push(`rotate(${rot})`);
                      if (hasScale) parts.push(`scale(${scaleX} ${scaleY})`);
                    }
                  }
                  if (origAttr) parts.push(origAttr);
                  node.setAttribute('transform', parts.join(' '));

                  if (isHtml || node.closest('foreignObject') || node.tagName?.toLowerCase() === 'div' || node.tagName?.toLowerCase() === 'span') {
                    const transformTokens = [];
                    if (targetX !== 0 || targetY !== 0) transformTokens.push(`translate(${targetX}px, ${targetY}px)`);
                    if (rot !== 0) transformTokens.push(`rotate(${rot}deg)`);
                    if (scaleX !== 1 || scaleY !== 1) transformTokens.push(`scale(${scaleX}, ${scaleY})`);
                    if (baseTransform) transformTokens.push(baseTransform);
                    node.style.transform = transformTokens.join(' ') || 'none';
                    node.style.transformOrigin = 'center center';
                  } else if (has3DLayer) {
                    node.style.transformBox = 'fill-box';
                    node.style.transformOrigin = 'center';
                    node.style.transform = `perspective(800px) translate3d(${targetX}px, ${targetY}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg)`;
                  } else {
                    node.style.transform = '';
                  }
                });

                // 3. Clear temporary transform on bounding box frame and update
                if (transformBoxRef.current) {
                  transformBoxRef.current.style.transform = '';
                }
                updateTransformBox(activeIds);

                // 4. Commit to React state
                setLayerTransforms(updatedTransforms);

                justFinishedLayerDragRef.current = true;
                setTimeout(() => {
                  justFinishedLayerDragRef.current = false;
                }, 100);

                if (dragInitialSnapshotRef.current) {
                  setUndoStack(prev => [...prev.slice(-30), dragInitialSnapshotRef.current]);
                  setRedoStack([]);
                }
              } else {
                if (transformBoxRef.current) {
                  transformBoxRef.current.style.transform = '';
                }
                updateTransformBox(activeIds);
              }
            }
          } finally {
            isDraggingLayerRef.current = false;
            updateTransformBox(activeIds);
            window.removeEventListener('pointermove', handleLayerMove, true);
            window.removeEventListener('pointerup', handleLayerUp, true);
            window.removeEventListener('pointercancel', handleLayerUp, true);
            window.removeEventListener('mouseup', handleLayerUp, true);
            window.removeEventListener('touchend', handleLayerUp, true);
            window.removeEventListener('blur', handleLayerUp);
          }
        };

        window.addEventListener('pointermove', handleLayerMove, { passive: false, capture: true });
        window.addEventListener('pointerup', handleLayerUp, { capture: true });
        window.addEventListener('pointercancel', handleLayerUp, { capture: true });
        window.addEventListener('mouseup', handleLayerUp, { capture: true });
        window.addEventListener('touchend', handleLayerUp, { capture: true });
        window.addEventListener('blur', handleLayerUp);
        return;
      }

      // Case B: Clicked on empty canvas background -> Light Blue Marquee Selection Box
      const isAdditive = Boolean(e.shiftKey || e.ctrlKey || e.metaKey);
      if (e.pointerType === 'touch' || !isDesktopScreen) {
        if (!isAdditive) {
          setSelectedLayerIds([]);
          setSelectedLayerId(null);
          setActiveSelectedColor(null);
        }
        return;
      }

      const wsEl = canvasWorkspaceRef.current;
      if (wsEl) {
        const wsRect = wsEl.getBoundingClientRect();
        // Exact physical-to-CSS zoom ratio compensation (handles desktop body zoom: 1.1 with zero offset)
        const zoomScaleX = wsEl.offsetWidth > 0 ? (wsRect.width / wsEl.offsetWidth) : 1;
        const zoomScaleY = wsEl.offsetHeight > 0 ? (wsRect.height / wsEl.offsetHeight) : 1;

        const startClientX = e.clientX;
        const startClientY = e.clientY;
        const startRelX = (e.clientX - wsRect.left) / zoomScaleX;
        const startRelY = (e.clientY - wsRect.top) / zoomScaleY;

        const baseSelection = isAdditive ? [...selectedLayerIds] : [];
        let isMarquee = false;
        let hitLayerIds = [];

        const handleMarqueeMove = (moveEvt) => {
          if (moveEvt.pointerType === 'mouse' && moveEvt.buttons === 0) {
            handleMarqueeUp();
            return;
          }

          const curClientX = moveEvt.clientX;
          const curClientY = moveEvt.clientY;
          const dist = Math.hypot(curClientX - startClientX, curClientY - startClientY);

          if (dist > 4) {
            isMarquee = true;
            moveEvt.preventDefault();
            const curWsRect = wsEl.getBoundingClientRect();
            const zScaleX = wsEl.offsetWidth > 0 ? (curWsRect.width / wsEl.offsetWidth) : 1;
            const zScaleY = wsEl.offsetHeight > 0 ? (curWsRect.height / wsEl.offsetHeight) : 1;

            const curRelX = (curClientX - curWsRect.left) / zScaleX;
            const curRelY = (curClientY - curWsRect.top) / zScaleY;
            setMarqueeBox({
              startX: startRelX,
              startY: startRelY,
              currentX: curRelX,
              currentY: curRelY
            });

            // Find all SVG shape layers intersecting with the marquee rectangle
            const boxLeft = Math.min(startClientX, curClientX);
            const boxRight = Math.max(startClientX, curClientX);
            const boxTop = Math.min(startClientY, curClientY);
            const boxBottom = Math.max(startClientY, curClientY);

            const svgContainer = canvasSvgContainerRef.current;
            if (svgContainer) {
              const layerNodes = Array.from(svgContainer.querySelectorAll('[data-layer-id]'));
              const currentHits = [];
              layerNodes.forEach(node => {
                const rect = node.getBoundingClientRect();
                const intersects = !(rect.right < boxLeft || rect.left > boxRight || rect.bottom < boxTop || rect.top > boxBottom);
                if (intersects) {
                  const rawId = node.getAttribute('data-layer-id');
                  const cleanId = rawId ? rawId.replace(/^pf_studio_/i, '') : null;
                  if (cleanId && !currentHits.includes(cleanId)) currentHits.push(cleanId);
                }
              });
              hitLayerIds = currentHits;
              const combinedHits = isAdditive
                ? Array.from(new Set([...baseSelection, ...currentHits]))
                : currentHits;
              setSelectedLayerIds(combinedHits);
              setSelectedLayerId(combinedHits[0] || null);
            }
          }
        };

        const handleMarqueeUp = () => {
          try {
            setMarqueeBox(null);
            if (isMarquee) {
              justFinishedLayerDragRef.current = true;
              setTimeout(() => { justFinishedLayerDragRef.current = false; }, 80);
              const finalHits = isAdditive
                ? Array.from(new Set([...baseSelection, ...hitLayerIds]))
                : hitLayerIds;
              if (finalHits.length > 0) {
                setSelectedLayerIds(finalHits);
                setSelectedLayerId(finalHits[0]);
              }
            } else {
              // Simple click without drag on canvas background:
              if (!isAdditive) {
                setSelectedLayerIds([]);
                setSelectedLayerId(null);
                setActiveSelectedColor(null);
              }
            }
          } finally {
            window.removeEventListener('pointermove', handleMarqueeMove, true);
            window.removeEventListener('pointerup', handleMarqueeUp, true);
            window.removeEventListener('pointercancel', handleMarqueeUp, true);
            window.removeEventListener('mouseup', handleMarqueeUp, true);
            window.removeEventListener('touchend', handleMarqueeUp, true);
            window.removeEventListener('blur', handleMarqueeUp);
          }
        };

        window.addEventListener('pointermove', handleMarqueeMove, { capture: true });
        window.addEventListener('pointerup', handleMarqueeUp, { capture: true });
        window.addEventListener('pointercancel', handleMarqueeUp, { capture: true });
        window.addEventListener('mouseup', handleMarqueeUp, { capture: true });
        window.addEventListener('touchend', handleMarqueeUp, { capture: true });
        window.addEventListener('blur', handleMarqueeUp);
      }
    }
  };

  // Layer hierarchy and transform helpers
  const handleBringToFront = (layerId) => {
    if (!layerId) return;
    recordUndoRef.current?.();
    setLayerOrder(prev => {
      const filtered = prev.filter(id => id !== layerId);
      return [...filtered, layerId];
    });
  };

  const handleSendToBack = (layerId) => {
    if (!layerId) return;
    recordUndoRef.current?.();
    setLayerOrder(prev => {
      const filtered = prev.filter(id => id !== layerId);
      return [layerId, ...filtered];
    });
  };

  const handleBringForward = (layerId) => {
    if (!layerId) return;
    recordUndoRef.current?.();
    setLayerOrder(prev => {
      const idx = prev.indexOf(layerId);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx + 1];
      next[idx + 1] = temp;
      return next;
    });
  };

  const handleSendBackward = (layerId) => {
    if (!layerId) return;
    recordUndoRef.current?.();
    setLayerOrder(prev => {
      const idx = prev.indexOf(layerId);
      if (idx <= 0) return prev;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[idx - 1];
      next[idx - 1] = temp;
      return next;
    });
  };

  const handleReorderLayers = (fromDisplayIdx, toDisplayIdx) => {
    if (fromDisplayIdx === null || toDisplayIdx === null || fromDisplayIdx === toDisplayIdx) return;
    recordUndoRef.current?.();
    setLayerOrder(prev => {
      // displayOrder is [...prev].reverse()
      // displayIdx 0 is Top (Front), displayIdx (length - 1) is Bottom (Back)
      const currentDisplay = [...prev].reverse();
      const [movedItem] = currentDisplay.splice(fromDisplayIdx, 1);
      currentDisplay.splice(toDisplayIdx, 0, movedItem);
      return [...currentDisplay].reverse();
    });
  };

  const handleResetLayerTransform = (targetIds) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        delete updated[cleanId];
      });
      return updated;
    });
  };

  const handleLayerPositionChange = (targetIds, axis, value) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const cur = updated[cleanId] || { x: 0, y: 0, rotate: 0 };
        updated[cleanId] = { ...cur, [axis]: Number(value) };
      });
      return updated;
    });
  };

  const handleLayerRotationChange = (targetIds, rotateVal) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const cur = updated[cleanId] || { x: 0, y: 0, rotate: 0 };
        updated[cleanId] = { ...cur, rotate: Number(rotateVal) };
      });
      return updated;
    });
  };

  const handleLayer3DRotationChange = (targetIds, rx, ry) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const cur = updated[cleanId] || { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 };
        updated[cleanId] = {
          ...cur,
          ...(rx !== undefined ? { rotateX: Number(rx) } : {}),
          ...(ry !== undefined ? { rotateY: Number(ry) } : {})
        };
      });
      return updated;
    });
  };

  const handleLayerTransformBatch = (targetIds, partialObj) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const cur = updated[cleanId] || { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 };
        updated[cleanId] = { ...cur, ...partialObj };
      });
      return updated;
    });
  };

  // Layer per-element color & effect styling helpers
  const handleLayerColorChange = (targetIds, color) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerStyles(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        updated[cleanId] = {
          ...(updated[cleanId] || {}),
          fill: color,
          stroke: color
        };
      });
      return updated;
    });
  };

  const handleResetLayerColor = (targetIds) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerStyles(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        if (updated[cleanId]) {
          delete updated[cleanId].fill;
          delete updated[cleanId].stroke;
          delete updated[cleanId].strokeWidth;
          if (Object.keys(updated[cleanId]).length === 0) delete updated[cleanId];
        }
      });
      return updated;
    });
  };

  const handleLayerEffectChange = (targetIds, key, val) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    setLayerStyles(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const cur = updated[cleanId] || {};
        if (key === 'glow') {
          updated[cleanId] = {
            ...cur,
            glow: { ...(cur.glow || { color: '#38bdf8', radius: 12 }), ...val }
          };
        } else {
          updated[cleanId] = {
            ...cur,
            [key]: val
          };
        }
      });
      return updated;
    });
  };

  const handleResetLayerEffects = (targetIds) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0) return;
    recordUndoRef.current?.();
    setLayerStyles(prev => {
      const updated = { ...prev };
      ids.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        if (updated[cleanId]) {
          delete updated[cleanId].glow;
          delete updated[cleanId].blur;
          delete updated[cleanId].opacity;
          delete updated[cleanId].brightness;
          delete updated[cleanId].contrast;
          delete updated[cleanId].customFilter;
          if (Object.keys(updated[cleanId]).length === 0) delete updated[cleanId];
        }
      });
      return updated;
    });
  };

  // Combined all active SVG layers (base + duplicates minus deleted)
  const allSvgLayers = useMemo(() => {
    const combined = [...svgLayers];
    duplicatedLayers.forEach(dup => {
      const source = svgLayers.find(l => l.id === dup.sourceId) || {};
      combined.push({
        id: dup.id,
        name: `${source.name || 'Part'} (Copy)`,
        tag: source.tag || 'path',
        color: source.color || '#38bdf8',
        rawColor: source.rawColor || '#38bdf8'
      });
    });
    return combined.filter(l => !deletedLayerIds.includes(l.id));
  }, [svgLayers, duplicatedLayers, deletedLayerIds]);

  const handleDeleteSelectedLayers = (overrideIds = null) => {
    const rawIds = (overrideIds && overrideIds.length > 0)
      ? overrideIds
      : ((selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
        ? selectedLayerIdsRef.current
        : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : [])));
    if (rawIds.length === 0) return;
    recordUndo();
    const cleanIds = rawIds.map(id => String(id).replace(/^pf_studio_/i, ''));
    setDeletedLayerIds(prev => Array.from(new Set([...prev, ...rawIds, ...cleanIds])));

    // Instant direct removal from live DOM for zero-latency feedback
    if (canvasSvgContainerRef.current) {
      rawIds.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const node = canvasSvgContainerRef.current.querySelector(`[data-layer-id="${id}"]`) ||
          canvasSvgContainerRef.current.querySelector(`[data-layer-id="${cleanId}"]`) ||
          (numOnly ? canvasSvgContainerRef.current.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (node) {
          node.remove();
        }
      });
    }

    selectedLayerIdsRef.current = [];
    selectedLayerIdRef.current = null;
    setSelectedLayerIds([]);
    setSelectedLayerId(null);
    setActiveSelectedColor(null);
    setTransformBox(null);
  };

  const handleDuplicateSelectedLayers = (overrideIds = null) => {
    const rawIds = (overrideIds && overrideIds.length > 0)
      ? overrideIds
      : ((selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
        ? selectedLayerIdsRef.current
        : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : [])));
    if (rawIds.length === 0) return;
    recordUndo();
    const newDuplicated = [];
    const newSelectedIds = [];
    const newTransforms = { ...layerTransformsRef.current };

    rawIds.forEach(id => {
      const dupId = `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      newDuplicated.push({ id: dupId, sourceId: id });
      newSelectedIds.push(dupId);

      const orig = layerTransformsRef.current[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
      newTransforms[dupId] = {
        ...orig,
        x: (orig.x || 0) + 15,
        y: (orig.y || 0) + 15
      };
    });

    setDuplicatedLayers(prev => [...prev, ...newDuplicated]);
    setLayerTransforms(newTransforms);
    setSelectedLayerIds(newSelectedIds);
    setSelectedLayerId(newSelectedIds[0]);
    selectedLayerIdsRef.current = newSelectedIds;
    selectedLayerIdRef.current = newSelectedIds[0];
  };

  // Center Selected Element(s) to Canvas Center (or Reset Canvas Pan/Zoom if no element selected)
  const handleCenterSelectedLayers = useCallback(() => {
    recordUndo();
    const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
      ? selectedLayerIdsRef.current
      : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []));

    const svgContainer = canvasSvgContainerRef.current;
    const svgEl = svgContainer?.querySelector('svg');

    if (activeIds.length > 0 && svgEl) {
      // 1. Determine native canvas viewBox dimensions
      let vbWidth = 512;
      let vbHeight = 512;
      const vb = svgEl.viewBox?.baseVal;
      if (vb && vb.width > 0 && vb.height > 0) {
        vbWidth = vb.width;
        vbHeight = vb.height;
      } else {
        const wAttr = parseFloat(svgEl.getAttribute('width'));
        const hAttr = parseFloat(svgEl.getAttribute('height'));
        if (wAttr > 0) vbWidth = wAttr;
        if (hAttr > 0) vbHeight = hAttr;
      }
      const canvasCenterX = vbWidth / 2;
      const canvasCenterY = vbHeight / 2;

      // 2. Measure untransformed bounding box of the active layer(s)
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      activeIds.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const el = svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
          svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
          svgContainer.querySelector(`[data-layer-id="pf_studio_${cleanId}"]`);
        if (el) {
          if (typeof el.getBBox === 'function') {
            try {
              const bbox = el.getBBox();
              if (bbox && (bbox.width > 0 || bbox.height > 0)) {
                minX = Math.min(minX, bbox.x);
                minY = Math.min(minY, bbox.y);
                maxX = Math.max(maxX, bbox.x + bbox.width);
                maxY = Math.max(maxY, bbox.y + bbox.height);
              }
            } catch (_) { }
          } else {
            try {
              const r = el.getBoundingClientRect();
              const svgR = svgEl.getBoundingClientRect();
              if (r && svgR && svgR.width > 0 && svgR.height > 0) {
                const scale = vbWidth / svgR.width;
                const ex = (r.left - svgR.left) * scale;
                const ey = (r.top - svgR.top) * scale;
                const ew = r.width * scale;
                const eh = r.height * scale;
                minX = Math.min(minX, ex);
                minY = Math.min(minY, ey);
                maxX = Math.max(maxX, ex + ew);
                maxY = Math.max(maxY, ey + eh);
              }
            } catch (_) { }
          }
        }
      });

      if (isFinite(minX) && isFinite(maxX)) {
        const groupCenterX = (minX + maxX) / 2;
        const groupCenterY = (minY + maxY) / 2;
        const targetOffsetX = Math.round(canvasCenterX - groupCenterX);
        const targetOffsetY = Math.round(canvasCenterY - groupCenterY);

        setLayerTransforms(prev => {
          const updated = { ...prev };
          activeIds.forEach(id => {
            const orig = prev[id] || { rotate: 0 };
            updated[id] = {
              ...orig,
              x: targetOffsetX,
              y: targetOffsetY
            };
          });
          return updated;
        });

        // Clear any leftover inline transforms and recompute
        if (transformBoxRef.current) {
          transformBoxRef.current.style.transform = '';
        }
        updateTransformBox(activeIds);
        requestAnimationFrame(() => {
          updateTransformBox(activeIds);
        });
        setTimeout(() => {
          updateTransformBox(activeIds);
        }, 40);
        return;
      }
    }

    // Fallback: If no layer selected, reset canvas pan to center
    targetPanRef.current = { x: 0, y: 0 };
    setCanvasPan({ x: 0, y: 0 });
    startSmoothZoomLoop();
  }, [selectedLayerIds, selectedLayerId]);

  // Insert another element/object from the library into current canvas as editable multipart layers
  const handleInsertElementFromLibrary = (assetToAdd) => {
    if (!assetToAdd || !assetToAdd.svgCode) return;

    // If currently on an empty studio canvas, directly load this picked element as the main asset
    if (selectedAsset?.isEmptyCanvas) {
      setIsAddElementModalOpen(false);
      handleOpenAsset(assetToAdd, 'colors');
      return;
    }

    if (!selectedAsset) return;
    recordUndo();

    try {
      const parser = new DOMParser();
      const currentDoc = parser.parseFromString(selectedAsset.svgCode, 'image/svg+xml');
      const currentSvg = currentDoc.querySelector('svg');
      if (!currentSvg) return;

      // Unique prefix to prevent gradient & filter ID collisions
      const prefix = `add_${Date.now()}_`;
      const scopedSvgCode = scopeSvgIds(assetToAdd.svgCode, prefix);
      const addedDoc = parser.parseFromString(scopedSvgCode, 'image/svg+xml');
      const addedSvg = addedDoc.querySelector('svg');
      if (!addedSvg) return;

      // 1. Merge defs (gradients, filters, patterns)
      let currentDefs = currentSvg.querySelector('defs');
      const addedDefs = addedSvg.querySelector('defs');
      if (addedDefs) {
        if (!currentDefs) {
          currentDefs = currentDoc.createElementNS('http://www.w3.org/2000/svg', 'defs');
          currentSvg.insertBefore(currentDefs, currentSvg.firstChild);
        }
        Array.from(addedDefs.children).forEach(defNode => {
          currentDefs.appendChild(currentDoc.importNode(defNode, true));
        });
      }

      // 2. Compute viewBox coordinates to position & scale added element nicely
      const parseVb = (svgNode) => {
        const vb = svgNode.getAttribute('viewBox') || svgNode.getAttribute('viewbox');
        if (vb) {
          const parts = vb.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
          }
        }
        const w = parseFloat(svgNode.getAttribute('width')) || 200;
        const h = parseFloat(svgNode.getAttribute('height')) || 200;
        return { x: 0, y: 0, w, h };
      };

      const baseVb = parseVb(currentSvg);
      const addVb = parseVb(addedSvg);

      // Fit added asset proportionally (~45% of base canvas)
      const scale = Math.min((baseVb.w * 0.45) / addVb.w, (baseVb.h * 0.45) / addVb.h);
      const jitter = (Math.random() * 24) - 12;
      const targetX = baseVb.x + (baseVb.w - (addVb.w * scale)) / 2 + jitter;
      const targetY = baseVb.y + (baseVb.h - (addVb.h * scale)) / 2 + jitter;

      // Create a group wrapper for the imported element
      const groupWrapper = currentDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
      groupWrapper.setAttribute('id', `group_${assetToAdd.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`);
      groupWrapper.setAttribute('transform', `translate(${targetX.toFixed(1)}, ${targetY.toFixed(1)}) scale(${scale.toFixed(4)}) translate(${-addVb.x}, ${-addVb.y})`);

      const visualTags = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'text'];
      const newLayerIds = [];
      let layerCounter = 0;

      // Tag each visual shape with unique data-layer-id so each part becomes individually editable!
      Array.from(addedSvg.children).forEach(child => {
        const tag = child.tagName.toLowerCase();
        if (tag === 'defs' || tag === 'metadata' || tag === 'title' || tag === 'desc') return;

        const importedNode = currentDoc.importNode(child, true);

        const tagVisualNodes = (node) => {
          const nTag = node.tagName?.toLowerCase();
          if (visualTags.includes(nTag)) {
            const lId = `layer_add_${Date.now().toString(36)}_${layerCounter++}`;
            node.setAttribute('data-layer-id', lId);
            newLayerIds.push(lId);
          } else if (node.children) {
            Array.from(node.children).forEach(c => tagVisualNodes(c));
          }
        };

        tagVisualNodes(importedNode);
        groupWrapper.appendChild(importedNode);
      });

      currentSvg.appendChild(groupWrapper);

      const serializer = new XMLSerializer();
      const mergedSvg = serializer.serializeToString(currentDoc);

      setSelectedAsset(prev => ({
        ...prev,
        svgCode: mergedSvg
      }));

      if (newLayerIds.length > 0) {
        const newGroupId = `group_${Date.now()}`;
        setLayerGroups(prev => ({
          ...prev,
          [newGroupId]: [...newLayerIds]
        }));
        setSelectedLayerIds(newLayerIds);
        setSelectedLayerId(newLayerIds[0]);
      }

      setIsAddElementModalOpen(false);
    } catch (err) {
      console.error('Error inserting element from library:', err);
      alert('Could not insert element: ' + err.message);
    }
  };

  const handleQuickRotate90 = () => {
    const activeIds = selectedLayerIds && selectedLayerIds.length > 0
      ? selectedLayerIds
      : (selectedLayerId ? [selectedLayerId] : []);
    if (activeIds.length === 0) return;
    recordUndo();
    setLayerTransforms(prev => {
      const updated = { ...prev };
      activeIds.forEach(id => {
        const orig = prev[id] || { x: 0, y: 0, rotate: 0 };
        updated[id] = {
          ...orig,
          rotate: ((orig.rotate || 0) + 90) % 360
        };
      });
      return updated;
    });
  };


  const handleSelectAllLayers = () => {
    const allIds = allSvgLayers.map(l => l.id);
    setSelectedLayerIds(allIds);
    selectedLayerIdsRef.current = allIds;
    if (allIds.length > 0) {
      setSelectedLayerId(allIds[0]);
      selectedLayerIdRef.current = allIds[0];
    }
    setTimeout(() => {
      updateTransformBox(allIds);
    }, 20);
  };

  const handleDeselectAllLayers = () => {
    setSelectedLayerIds([]);
    selectedLayerIdsRef.current = [];
    setSelectedLayerId(null);
    selectedLayerIdRef.current = null;
    setActiveSelectedColor(null);
    setTransformBox(null);
  };

  // Check if current selection represents an entire group
  const isCurrentGroupSelected = useMemo(() => {
    if (!selectedLayerIds || selectedLayerIds.length <= 1) return false;
    return Object.values(layerGroups).some(ids => {
      if (ids.length !== selectedLayerIds.length) return false;
      const setA = new Set(ids);
      return selectedLayerIds.every(id => setA.has(id));
    });
  }, [selectedLayerIds, layerGroups]);

  // If currently selected part is a member of an existing group
  const activeGroupForSelection = useMemo(() => {
    if (!selectedLayerIds || selectedLayerIds.length === 0) return null;
    const currentGroups = layerGroups || {};
    return Object.values(currentGroups).find(ids =>
      selectedLayerIds.some(id => ids.includes(id))
    ) || null;
  }, [selectedLayerIds, layerGroups]);

  // A single element that belongs to a group is sub-selected (directly editable without ungrouping)
  const isSubSelectedInGroup = useMemo(() => {
    return Boolean(
      activeGroupForSelection &&
      selectedLayerIds &&
      selectedLayerIds.length === 1 &&
      activeGroupForSelection.includes(selectedLayerIds[0])
    );
  }, [activeGroupForSelection, selectedLayerIds]);

  // Group currently selected layers together
  const handleGroupSelected = useCallback(() => {
    const activeIds = selectedLayerIds && selectedLayerIds.length > 1 ? selectedLayerIds : [];
    if (activeIds.length <= 1) return;
    recordUndo();
    const newGroupId = `group_${Date.now()}`;
    setLayerGroups(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(gid => {
        if (updated[gid].some(id => activeIds.includes(id))) {
          delete updated[gid];
        }
      });
      updated[newGroupId] = [...activeIds];
      return updated;
    });
  }, [selectedLayerIds]);

  // Ungroup the selected group so member parts become individually editable
  const handleUngroupSelected = useCallback(() => {
    const activeIds = selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : [];
    if (activeIds.length === 0) return;
    recordUndo();
    setLayerGroups(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(gid => {
        if (updated[gid].some(id => activeIds.includes(id))) {
          delete updated[gid];
        }
      });
      return updated;
    });
  }, [selectedLayerIds]);

  // Studio Resizable Right Sidebar Width (VS Code style - Max 50% screen)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const zoom = window.innerWidth >= 1024 ? 1.1 : 1;
      const halfScreen = Math.floor((window.innerWidth / zoom) * 0.5);
      const saved = localStorage.getItem('iconderry_studio_sidebar_width');
      if (saved) {
        const num = Number(saved);
        if (!isNaN(num) && num >= 320) return Math.min(num, halfScreen);
      }
      return Math.min(480, halfScreen);
    }
    return 480;
  });
  const [isDesktopScreen, setIsDesktopScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);

  // Mobile Canvas vs Tools Vertical Resizer State (Default: 40vh, resizable between 18vh and 75vh)
  const DEFAULT_MOBILE_CANVAS_HEIGHT = 40;
  const [mobileCanvasHeight, setMobileCanvasHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconderry_mobile_canvas_height');
      const num = Number(saved);
      if (!isNaN(num) && num >= 18 && num <= 75) return num;
    }
    return DEFAULT_MOBILE_CANVAS_HEIGHT;
  });
  const [isResizingMobileCanvas, setIsResizingMobileCanvas] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isDesk = window.innerWidth >= 1024;
      setIsDesktopScreen(isDesk);
      if (isDesk) {
        const zoom = 1.1;
        const halfScreen = Math.floor((window.innerWidth / zoom) * 0.5);
        setSidebarWidth(prev => Math.min(prev, halfScreen));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartResizeSidebar = (e) => {
    e.preventDefault();
    setIsResizingSidebar(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;
    let rafResizeId = null;

    const onPointerMove = (moveEvt) => {
      const zoom = window.innerWidth >= 1024 ? 1.1 : 1;
      const deltaX = (startX - moveEvt.clientX) / zoom;
      const newWidth = Math.round(startWidth + deltaX);

      // Max allowed: strictly HALF of screen width (50%)!
      const halfScreenWidth = Math.floor((window.innerWidth / zoom) * 0.5);
      const clamped = Math.min(Math.max(340, newWidth), halfScreenWidth);
      setSidebarWidth(clamped);

      if (rafResizeId) cancelAnimationFrame(rafResizeId);
      rafResizeId = requestAnimationFrame(() => {
        updateTransformBox();
      });
    };

    const onPointerUp = () => {
      setIsResizingSidebar(false);
      if (rafResizeId) cancelAnimationFrame(rafResizeId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setSidebarWidth((finalWidth) => {
        try {
          localStorage.setItem('iconderry_studio_sidebar_width', String(finalWidth));
        } catch { }
        return finalWidth;
      });
      requestAnimationFrame(() => {
        updateTransformBox();
        setTimeout(updateTransformBox, 50);
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Mobile Canvas vs Tools Vertical Resizer Pointer Handler
  const handleStartResizeMobileCanvas = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingMobileCanvas(true);

    const startY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? (e.nativeEvent?.touches && e.nativeEvent.touches[0]?.clientY) ?? 0;
    const startHeight = mobileCanvasHeight;
    const windowH = window.innerHeight || 800;
    let rafMobileResizeId = null;

    const onPointerMove = (moveEvt) => {
      if (moveEvt.cancelable) moveEvt.preventDefault();
      const clientY = moveEvt.clientY ?? (moveEvt.touches && moveEvt.touches[0]?.clientY) ?? 0;
      if (!clientY) return;
      const deltaY = clientY - startY;
      const deltaVh = (deltaY / windowH) * 100;
      const newHeightVh = Math.round(Math.min(75, Math.max(18, startHeight + deltaVh)));
      setMobileCanvasHeight(newHeightVh);

      if (rafMobileResizeId) cancelAnimationFrame(rafMobileResizeId);
      rafMobileResizeId = requestAnimationFrame(() => {
        updateTransformBox();
      });
    };

    const onPointerUp = () => {
      setIsResizingMobileCanvas(false);
      if (rafMobileResizeId) cancelAnimationFrame(rafMobileResizeId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      setMobileCanvasHeight((finalH) => {
        try {
          localStorage.setItem('iconderry_mobile_canvas_height', String(finalH));
        } catch { }
        return finalH;
      });
      requestAnimationFrame(() => {
        updateTransformBox();
        setTimeout(updateTransformBox, 50);
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  };

  // Top Right Export Dropdown Menu State
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    if (!isExportDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isExportDropdownOpen]);

  // Advanced Export Settings States (Solid/Gradient BG, Custom Filename, Quality Compression)
  const [isAdvancedExportOpen, setIsAdvancedExportOpen] = useState(false);
  const [exportCustomFilename, setExportCustomFilename] = useState('');
  const [exportAutoTagDimensions, setExportAutoTagDimensions] = useState(true);
  const [exportQuality, setExportQuality] = useState(92);
  const [exportBgType, setExportBgType] = useState('solid'); // 'solid' | 'gradient'
  const [exportBgSolidColor, setExportBgSolidColor] = useState('#0b0f19');
  const [exportBgGradient, setExportBgGradient] = useState({
    preset: 'cyber',
    from: '#060a12',
    to: '#1e293b',
    angle: 135
  });

  // Native wheel listener for pure scroll wheel zoom (no Ctrl/Shift required, smooth continuous LERP)
  useEffect(() => {
    const el = canvasWorkspaceRef.current;
    if (!el || !selectedAsset) return;

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [selectedAsset]);

  // Native two-finger Pinch-to-Zoom & Fluid Pan Gesture Handler for Mobile Canvas
  useEffect(() => {
    const wsEl = canvasWorkspaceRef.current;
    if (!wsEl || !selectedAsset) return;

    let initialPinchDist = 0;
    let initialZoom = 1;
    let initialPan = { x: 0, y: 0 };
    let initialMid = { x: 0, y: 0 };
    let isPinching = false;

    const handleTouchStart = (e) => {
      if (e.touches.length >= 2) {
        e.preventDefault();
        isPinching = true;
        isPinchingRef.current = true;

        // Instantly abort any active layer drag so dual-finger gesture pinches/pans rather than dragging vector elements!
        if (isDraggingLayerRef.current) {
          isDraggingLayerRef.current = false;
          if (layerDragInitialTransformsRef.current) {
            setLayerTransforms(prev => ({
              ...prev,
              ...layerDragInitialTransformsRef.current
            }));
          }
          try {
            if (activeTargetLayerElRef.current?.releasePointerCapture && activePointerIdRef.current !== null) {
              activeTargetLayerElRef.current.releasePointerCapture(activePointerIdRef.current);
            }
          } catch (_) { }
          activeTargetLayerElRef.current = null;
          activePointerIdRef.current = null;
        }

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        initialZoom = currentZoomRef.current;
        initialPan = { ...canvasPanRef.current };
        initialMid = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length >= 2 && isPinching) {
        e.preventDefault();
        isDraggingLayerRef.current = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        if (initialPinchDist > 0) {
          const scale = dist / initialPinchDist;
          const nextZoom = Math.min(5, Math.max(0.4, Number((initialZoom * scale).toFixed(3))));
          targetZoomRef.current = nextZoom;
          currentZoomRef.current = nextZoom;
          setZoomLevel(nextZoom);

          // Simultaneous two-finger fluid pan
          const midX = (t1.clientX + t2.clientX) / 2;
          const midY = (t1.clientY + t2.clientY) / 2;
          const deltaX = midX - initialMid.x;
          const deltaY = midY - initialMid.y;
          const nextPan = {
            x: Math.round(initialPan.x + deltaX),
            y: Math.round(initialPan.y + deltaY)
          };
          canvasPanRef.current = nextPan;
          targetPanRef.current = nextPan;
          setCanvasPan(nextPan);
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        isPinching = false;
        isPinchingRef.current = false;
        initialPinchDist = 0;
      }
    };

    wsEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    wsEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    wsEl.addEventListener('touchend', handleTouchEnd);
    wsEl.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      wsEl.removeEventListener('touchstart', handleTouchStart);
      wsEl.removeEventListener('touchmove', handleTouchMove);
      wsEl.removeEventListener('touchend', handleTouchEnd);
      wsEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [selectedAsset]);

  // Live adjustments state
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);
  const [activeStyleMode, setActiveStyleMode] = useState('original');
  const [effectCategory, setEffectCategory] = useState('All');
  const [effectSearchTerm, setEffectSearchTerm] = useState('');
  const [effectVersionFilter, setEffectVersionFilter] = useState('all'); // 'all' | 'new' | 'old'
  const [studioTab, setStudioTab] = useState('colors'); // 'colors' | 'gradient' | 'layers' | 'text' | 'shapes' | 'draw' | 'filters' | 'effects' | 'dimensions' | 'transform' | 'gif' | 'export'
  const [isStudioPanelOpen, setIsStudioPanelOpen] = useState(true);

  // Toggle studio tab: click open / click active tab to close drawer
  const handleStudioTabClick = useCallback((tabId) => {
    if (isStudioPanelOpen && studioTab === tabId) {
      setIsStudioPanelOpen(false);
    } else {
      setStudioTab(tabId);
      setIsStudioPanelOpen(true);
    }
  }, [isStudioPanelOpen, studioTab]);

  // Recalculate 8-handle transform box when drawer slides open or closed
  useEffect(() => {
    const t = setTimeout(() => {
      updateTransformBox();
    }, 320);
    return () => clearTimeout(t);
  }, [isStudioPanelOpen]);
  const [gradientFrom, setGradientFrom] = useState('#06b6d4');
  const [gradientTo, setGradientTo] = useState('#3b82f6');
  const [gradientAngle, setGradientAngle] = useState(135);

  // Canva Pro Custom Canvas Objects (Text, Shapes, Brush Strokes)
  const [customCanvasObjects, setCustomCanvasObjects] = useState([]);
  const [drawTool, setDrawTool] = useState('pen'); // 'pen' | 'highlighter' | 'neon' | 'eraser'
  const [drawColor, setDrawColor] = useState('#00f0ff');
  const [drawSize, setDrawSize] = useState(6);
  const [drawOpacity, setDrawOpacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeLiveDrawPath, setActiveLiveDrawPath] = useState(null);
  const drawingPointsRef = useRef([]);
  const drawingOverlaySvgRef = useRef(null);

  // Auto-deselect when switching to Draw tab so selection box never interferes
  useEffect(() => {
    if (studioTab === 'draw') {
      setSelectedLayerId(null);
      setSelectedLayerIds([]);
      setTransformBox(null);
      setActiveSelectedColor(null);
    }
  }, [studioTab]);

  const [iconGradientEnabled, setIconGradientEnabled] = useState(false);
  const [bgGradientEnabled, setBgGradientEnabled] = useState(false);
  const [gradientTarget, setGradientTarget] = useState('icon'); // 'icon' | 'badge'
  const [shapeCategoryFilter, setShapeCategoryFilter] = useState('All');

  // Drawing event handlers for real-time smooth vector path drawing
  const handleDrawPointerDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = drawingOverlaySvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = iconWidth / rect.width;
    const scaleY = iconHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    drawingPointsRef.current = [{ x, y }];
    setIsDrawing(true);
    setActiveLiveDrawPath(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
  }, [iconWidth, iconHeight]);

  const handleDrawPointerMove = useCallback((e) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();
    const svg = drawingOverlaySvgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scaleX = iconWidth / rect.width;
    const scaleY = iconHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    drawingPointsRef.current.push({ x, y });
    const smoothed = smoothFreehandPath(drawingPointsRef.current);
    setActiveLiveDrawPath(smoothed);
  }, [isDrawing, iconWidth, iconHeight]);

  const handleDrawPointerUp = useCallback((e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pts = drawingPointsRef.current;
    drawingPointsRef.current = [];
    if (!pts || pts.length === 0) {
      setActiveLiveDrawPath(null);
      return;
    }
    const pathD = smoothFreehandPath(pts);
    setActiveLiveDrawPath(null);
    if (!pathD) return;

    if (drawTool === 'eraser') {
      // Remove last drawing object
      setCustomCanvasObjects(prev => {
        const lastDrawIdx = prev.map((item, i) => item.type === 'draw' ? i : -1).filter(i => i >= 0).pop();
        if (lastDrawIdx === undefined) return prev;
        return prev.filter((_, idx) => idx !== lastDrawIdx);
      });
      return;
    }

    const newDrawObj = {
      id: `draw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${drawTool.charAt(0).toUpperCase() + drawTool.slice(1)} Stroke`,
      type: 'draw',
      brushType: drawTool,
      pathData: pathD,
      stroke: drawColor,
      strokeWidth: drawSize,
      opacity: drawOpacity
    };

    setCustomCanvasObjects(prev => [...prev, newDrawObj]);
  }, [isDrawing, drawTool, drawColor, drawSize, drawOpacity]);

  // Canva Pro Text & Shape Creation Handlers
  const handleAddTextObject = useCallback((preset = null, customType = 'heading') => {
    // If a text object is currently selected, replace its style instead of creating a duplicate!
    const targetObj = customCanvasObjects.find(
      (obj) => (obj.id === selectedLayerId || (selectedLayerIds && selectedLayerIds.includes(obj.id))) && obj.type === 'text'
    );

    if (targetObj) {
      recordUndoRef.current?.();
      const patch = {};
      if (preset) {
        patch.name = `Text: ${preset.name}`;
        patch.font = preset.font;
        if (preset.fontSize) patch.fontSize = preset.fontSize;
        if (preset.fill) patch.fill = preset.fill;
        patch.stroke = preset.stroke || 'none';
        patch.strokeWidth = preset.strokeWidth !== undefined ? preset.strokeWidth : 0;
        patch.isBold = !!preset.isBold;
        patch.letterSpacing = preset.letterSpacing !== undefined ? preset.letterSpacing : 2;
        patch.transform = preset.transform || 'none';
        patch.filterMode = preset.filterMode || 'none';
        patch.glowColor = preset.glowColor || undefined;
      } else if (customType === 'heading') {
        patch.font = 'Outfit';
        patch.fontSize = 44;
        patch.fill = '#ffffff';
        patch.stroke = '#0f172a';
        patch.strokeWidth = 1.5;
        patch.isBold = true;
        patch.letterSpacing = 2;
        patch.transform = 'none';
      } else if (customType === 'subheading') {
        patch.font = 'Outfit';
        patch.fontSize = 28;
        patch.fill = '#38bdf8';
        patch.stroke = 'none';
        patch.strokeWidth = 0;
        patch.isBold = true;
        patch.letterSpacing = 1;
        patch.transform = 'none';
      } else {
        patch.font = 'Inter';
        patch.fontSize = 18;
        patch.fill = '#94a3b8';
        patch.stroke = 'none';
        patch.strokeWidth = 0;
        patch.isBold = false;
        patch.letterSpacing = 0.5;
        patch.transform = 'none';
      }

      setCustomCanvasObjects(prev => prev.map(obj => obj.id === targetObj.id ? { ...obj, ...patch } : obj));
      setTimeout(() => {
        updateTransformBoxRef.current?.([targetObj.id]);
      }, 50);
      return;
    }

    const newId = `text_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    let newObj;
    if (preset) {
      newObj = {
        id: newId,
        name: `Text: ${preset.name}`,
        type: 'text',
        text: preset.name.toUpperCase(),
        font: preset.font,
        fontSize: preset.fontSize || 38,
        fill: preset.fill || '#38bdf8',
        stroke: preset.stroke || 'none',
        strokeWidth: preset.strokeWidth || 0,
        isBold: !!preset.isBold,
        isItalic: false,
        letterSpacing: preset.letterSpacing || 2,
        transform: preset.transform || 'none',
        filterMode: preset.filterMode || 'none',
        glowColor: preset.glowColor || undefined,
        align: 'center',
        x: iconWidth / 2,
        y: iconHeight * 0.78,
        rotation: 0,
        scale: 1
      };
    } else if (customType === 'heading') {
      newObj = {
        id: newId,
        name: 'Heading',
        type: 'text',
        text: 'Add a heading',
        font: 'Outfit',
        fontSize: 44,
        fill: '#ffffff',
        stroke: '#0f172a',
        strokeWidth: 1.5,
        isBold: true,
        isItalic: false,
        letterSpacing: 2,
        transform: 'none',
        align: 'center',
        x: iconWidth / 2,
        y: iconHeight * 0.75,
        rotation: 0,
        scale: 1
      };
    } else if (customType === 'subheading') {
      newObj = {
        id: newId,
        name: 'Subheading',
        type: 'text',
        text: 'Add a subheading',
        font: 'Outfit',
        fontSize: 28,
        fill: '#38bdf8',
        stroke: 'none',
        strokeWidth: 0,
        isBold: true,
        isItalic: false,
        letterSpacing: 1,
        transform: 'none',
        align: 'center',
        x: iconWidth / 2,
        y: iconHeight * 0.82,
        rotation: 0,
        scale: 1
      };
    } else {
      newObj = {
        id: newId,
        name: 'Body Text',
        type: 'text',
        text: 'Your custom text goes here',
        font: 'Inter',
        fontSize: 18,
        fill: '#94a3b8',
        stroke: 'none',
        strokeWidth: 0,
        isBold: false,
        isItalic: false,
        letterSpacing: 0.5,
        transform: 'none',
        align: 'center',
        x: iconWidth / 2,
        y: iconHeight * 0.88,
        rotation: 0,
        scale: 1
      };
    }

    setCustomCanvasObjects(prev => [...prev, newObj]);
    setSelectedLayerId(newId);
    setSelectedLayerIds([newId]);
    setTimeout(() => {
      updateTransformBoxRef.current?.([newId]);
    }, 50);
  }, [iconWidth, iconHeight, customCanvasObjects, selectedLayerId, selectedLayerIds]);

  const handleAddShapeObject = useCallback((shapePreset) => {
    const newId = `shape_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newObj = {
      id: newId,
      name: shapePreset.name,
      shapeName: shapePreset.name,
      type: 'shape',
      pathData: shapePreset.d,
      fill: '#06b6d4',
      stroke: '#ffffff',
      strokeWidth: 1.5,
      size: 90,
      opacity: 1,
      x: iconWidth / 2 - 45,
      y: iconHeight / 2 - 45,
      rotation: 0,
      scale: 1
    };
    setCustomCanvasObjects(prev => [...prev, newObj]);
    setSelectedLayerId(newId);
    setSelectedLayerIds([newId]);
  }, [iconWidth, iconHeight]);

  const handleUpdateCanvasObject = useCallback((id, patch) => {
    setCustomCanvasObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...patch } : obj));
  }, []);

  const handleDeleteCanvasObject = useCallback((id) => {
    setCustomCanvasObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
      setSelectedLayerIds([]);
      setTransformBox(null);
    }
  }, [selectedLayerId]);
  const [adjustmentSubTab, setAdjustmentSubTab] = useState('gradient'); // 'gradient' | 'colors'
  const [transformSubTab, setTransformSubTab] = useState('xyz'); // 'xyz' | '3d' | '2d' | 'skew'
  const [transformTarget, setTransformTarget] = useState('selected'); // 'selected' | 'all'
  const [xyzStep, setXyzStep] = useState(20); // 5 | 20 | 50
  const [effectSubTab, setEffectSubTab] = useState('effects'); // 'effects'
  const [filterSubView, setFilterSubView] = useState('presets'); // 'presets' | 'materials' | 'sliders'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [filterVersionFilter, setFilterVersionFilter] = useState('all'); // 'all' | 'new' | 'old'
  const [activeFilterPreset, setActiveFilterPreset] = useState('original');
  const [activeSelectedColor, setActiveSelectedColor] = useState(null);
  const [colorWheelPopover, setColorWheelPopover] = useState(null); // { originalColor, currentHex, anchorX, anchorY }
  const lastSwatchClickRef = useRef({ time: 0, color: null });
  const [isLayersListExpanded, setIsLayersListExpanded] = useState(false);
  const [isAddElementModalOpen, setIsAddElementModalOpen] = useState(false);
  const [addElementSearch, setAddElementSearch] = useState('');
  const [addElementCategory, setAddElementCategory] = useState('All');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpSearchQuery, setHelpSearchQuery] = useState('');
  const canvasSvgContainerRef = useRef(null);
  const transformStageRef = useRef(null);
  const liveTransformRafRef = useRef(null);
  const isTransformDraggingRef = useRef(false);
  const adjustmentsRef = useRef(adjustments);
  adjustmentsRef.current = adjustments;

  // Method 1 + 2: Direct GPU hardware transform & pointer hit-test suppression for zero-lag heavy SVG editing
  const startTransformDrag = useCallback(() => {
    isTransformDraggingRef.current = true;
    recordUndoRef.current?.();
    if (canvasSvgContainerRef.current) {
      canvasSvgContainerRef.current.style.pointerEvents = 'none';
    }
  }, []);

  const endTransformDrag = useCallback(() => {
    isTransformDraggingRef.current = false;
    if (liveTransformRafRef.current) {
      cancelAnimationFrame(liveTransformRafRef.current);
      liveTransformRafRef.current = null;
    }
    if (canvasSvgContainerRef.current) {
      canvasSvgContainerRef.current.style.pointerEvents = '';
    }
  }, []);

  const applyLiveStageTransform = useCallback((partial) => {
    if (!transformStageRef.current || !canvasSvgContainerRef.current) return;
    if (liveTransformRafRef.current) {
      cancelAnimationFrame(liveTransformRafRef.current);
    }
    liveTransformRafRef.current = requestAnimationFrame(() => {
      if (!transformStageRef.current || !canvasSvgContainerRef.current) return;
      const curAdj = adjustmentsRef.current || {};
      const tx = partial.translateX !== undefined ? partial.translateX : (curAdj.translateX || 0);
      const ty = partial.translateY !== undefined ? partial.translateY : (curAdj.translateY || 0);
      const tz = partial.translateZ !== undefined ? partial.translateZ : (curAdj.translateZ || 0);
      const rx = partial.rotateX !== undefined ? partial.rotateX : (curAdj.rotateX || 0);
      const ry = partial.rotateY !== undefined ? partial.rotateY : (curAdj.rotateY || 0);
      const rot = partial.rotation !== undefined ? partial.rotation : (curAdj.rotation || 0);
      const skewX = curAdj.skewX || 0;
      const skewY = curAdj.skewY || 0;
      const flipH = curAdj.flipH ? -1 : 1;
      const flipV = curAdj.flipV ? -1 : 1;
      const persp = curAdj.perspective || 1200;
      const is3DActive = (rx !== 0 || ry !== 0 || tz !== 0 || (curAdj.depth3D && curAdj.depth3D > 0));

      transformStageRef.current.style.perspective = is3DActive ? `${persp}px` : '';
      transformStageRef.current.style.perspectiveOrigin = '50% 50%';
      transformStageRef.current.style.transformStyle = 'preserve-3d';
      transformStageRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0px) rotate(${rot}deg) skew(${skewX}deg, ${skewY}deg) scale(${flipH}, ${flipV})`;

      const rot3dCss = is3DActive
        ? `translate3d(0, 0, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`
        : '';
      canvasSvgContainerRef.current.style.transform = rot3dCss;
      canvasSvgContainerRef.current.style.transformOrigin = '50% 50%';
      canvasSvgContainerRef.current.style.transformStyle = 'preserve-3d';
      canvasSvgContainerRef.current.style.backfaceVisibility = 'hidden';

      if (transformBoxRef.current) {
        transformBoxRef.current.style.transform = rot3dCss;
        transformBoxRef.current.style.transformOrigin = '50% 50%';
        transformBoxRef.current.style.transformStyle = 'preserve-3d';
      }
    });
  }, []);

  const applyLiveLayerTransform = useCallback((targetIds, partial) => {
    const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
    if (ids.length === 0 || !canvasSvgContainerRef.current) return;
    if (liveTransformRafRef.current) {
      cancelAnimationFrame(liveTransformRafRef.current);
    }
    liveTransformRafRef.current = requestAnimationFrame(() => {
      ids.forEach(rawId => {
        const cleanId = String(rawId).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = canvasSvgContainerRef.current?.querySelector(`[data-layer-id="${rawId}"]`) ||
          canvasSvgContainerRef.current?.querySelector(`[data-layer-id="${cleanId}"]`) ||
          (numOnly ? canvasSvgContainerRef.current?.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (!el) return;
        const cur = layerTransformsRef.current[cleanId] || { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 };
        const x = partial.x !== undefined ? partial.x : (cur.x || 0);
        const y = partial.y !== undefined ? partial.y : (cur.y || 0);
        const z = partial.z !== undefined ? partial.z : (cur.z || 0);
        const rx = partial.rotateX !== undefined ? partial.rotateX : (cur.rotateX || 0);
        const ry = partial.rotateY !== undefined ? partial.rotateY : (cur.rotateY || 0);
        const rot = partial.rotate !== undefined ? partial.rotate : (cur.rotate || 0);
        const has3DLayer = rx !== 0 || ry !== 0 || z !== 0;

        const cssTransform = has3DLayer
          ? `transform-box: fill-box; transform-origin: center; transform: perspective(800px) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rot}deg);`
          : (x !== 0 || y !== 0 || rot !== 0)
            ? `transform-box: fill-box; transform-origin: center; transform: translate(${x}px, ${y}px) rotate(${rot}deg);`
            : '';

        const origStyle = el.getAttribute('style') || '';
        let cleanStyle = origStyle
          .replace(/transform-box\s*:\s*[^;]+;?/gi, '')
          .replace(/transform-origin\s*:\s*[^;]+;?/gi, '')
          .replace(/transform\s*:\s*[^;]+;?/gi, '')
          .trim();
        if (cssTransform) {
          cleanStyle = `${cleanStyle ? cleanStyle + '; ' : ''}${cssTransform}`;
        }
        el.setAttribute('style', cleanStyle);
      });
    });
  }, []);


  const filteredPresets = useMemo(() => {
    return EFFECT_PRESETS.filter(preset => {
      // Filter by version (All / New / Old)
      if (filterVersionFilter === 'new' && !preset.isNew) return false;
      if (filterVersionFilter === 'old' && preset.isNew) return false;

      // Filter by category: only match if 'All' or matches preset category
      if (filterCategory !== 'All' && preset.category !== filterCategory) return false;

      const q = filterSearchTerm.trim().toLowerCase();
      const matchesSearch = !q ||
        preset.name.toLowerCase().includes(q) ||
        (preset.desc && preset.desc.toLowerCase().includes(q)) ||
        (preset.badge && preset.badge.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [filterCategory, filterSearchTerm, filterVersionFilter]);

  const filteredStyleModes = useMemo(() => {
    return STYLE_RENDER_MODES.filter(mode => {
      const isNew = mode.isNew || NEW_EFFECT_IDS.has(mode.id);
      // Filter by version (All / New / Old)
      if (effectVersionFilter === 'new' && !isNew) return false;
      if (effectVersionFilter === 'old' && isNew) return false;

      // Filter by category: only match if 'All' or matches mode category or matches Trending & Viral
      if (effectCategory !== 'All') {
        if (effectCategory === 'Trending & Viral') {
          if (!isNew) return false;
        } else if (mode.category !== effectCategory) {
          return false;
        }
      }

      const q = effectSearchTerm.trim().toLowerCase();
      const matchesSearch = !q ||
        mode.name.toLowerCase().includes(q) ||
        (mode.desc && mode.desc.toLowerCase().includes(q)) ||
        (mode.badge && mode.badge.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [effectCategory, effectSearchTerm, effectVersionFilter]);

  // Outline Stroke Multiplier (Vector line-weight scaling)
  const [strokeMultiplier, setStrokeMultiplier] = useState(1);
  const [strokeColorMode, setStrokeColorMode] = useState('auto'); // 'auto' | 'white' | 'dark' | 'custom'
  const [customStrokeColor, setCustomStrokeColor] = useState('#38bdf8');

  // App Icon Badge & Container Background Shape
  const [bgShape, setBgShape] = useState('none'); // 'none' | 'circle' | 'squircle' | 'rounded-square' | 'hexagon'
  const [bgShapeColor, setBgShapeColor] = useState('#1e293b');
  const [bgShapePadding, setBgShapePadding] = useState(20);
  const [bgShapeBorder, setBgShapeBorder] = useState(0);
  const [bgShapeBorderColor, setBgShapeBorderColor] = useState('#38bdf8');

  // Favorites Persistent State
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('iconderry_favorites')) || [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('iconderry_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Library Sorting & Grid View Density
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'popular' | 'name'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters Drag-to-Scroll & Independent Wheel Isolation
  const filtersScrollRef = useRef(null);
  const isDraggingFiltersRef = useRef(false);
  const startYFiltersRef = useRef(0);
  const scrollTopFiltersRef = useRef(0);
  const hasDraggedFiltersRef = useRef(false);

  const handleFiltersMouseDown = (e) => {
    if (e.button !== 0 || !filtersScrollRef.current) return;
    isDraggingFiltersRef.current = true;
    hasDraggedFiltersRef.current = false;
    startYFiltersRef.current = e.pageY - filtersScrollRef.current.offsetTop;
    scrollTopFiltersRef.current = filtersScrollRef.current.scrollTop;
  };

  const handleFiltersMouseMove = (e) => {
    if (!isDraggingFiltersRef.current || !filtersScrollRef.current) return;
    const y = e.pageY - filtersScrollRef.current.offsetTop;
    const walk = (y - startYFiltersRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      hasDraggedFiltersRef.current = true;
      e.preventDefault();
      filtersScrollRef.current.scrollTop = scrollTopFiltersRef.current - walk;
    }
  };

  const handleFiltersMouseUp = () => {
    isDraggingFiltersRef.current = false;
  };

  // Undo / Redo History Stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Legal, Info & Feedback Modals
  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'about' | 'license' | 'privacy' | 'terms' | 'feedback'
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '', type: 'icon_request' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Extract all unique colors from the selected SVG
  const detectedColors = useMemo(() => {
    if (!selectedAsset) return [];
    return extractSvgColors(selectedAsset.svgCode);
  }, [selectedAsset]);

  // Extract all visual shape layers on selectedAsset change & isolate customizations per asset
  useEffect(() => {
    if (!selectedAsset || !selectedAsset.svgCode) {
      setSvgLayers([]);
      setLayerOrder([]);
      setSelectedLayerId(null);
      setSelectedLayerIds([]);
      setLayerTransforms({});
      setLayerStyles({});
      setDeletedLayerIds([]);
      setDuplicatedLayers([]);
      setLayerGroups({});
      setTransformBox(null);
      setCustomCanvasObjects([]);
      prevAssetIdRef.current = null;
      return;
    }
    const isNewAsset = prevAssetIdRef.current !== selectedAsset.id;
    prevAssetIdRef.current = selectedAsset.id;

    const { layers } = extractSvgLayers(selectedAsset.svgCode);
    setSvgLayers(layers);

    if (isNewAsset) {
      setCustomCanvasObjects([]);
      setLayerTransforms({});
      setLayerStyles({});
      setDeletedLayerIds([]);
      setDuplicatedLayers([]);
      setLayerGroups({});
      setLayerOrder(layers.map(l => l.id));
      setSelectedLayerId(null);
      setSelectedLayerIds([]);
      setActiveSelectedColor(null);
      setTransformBox(null);
      setAdjustments(prev => ({
        ...prev,
        colorReplacements: {},
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        rotation: 0,
        translateX: 0,
        translateY: 0,
        skewX: 0,
        skewY: 0,
        flipH: false,
        flipV: false
      }));

      // Calculate natural aspect ratio from SVG viewBox
      let natRatio = 1;
      let natW = 384;
      let natH = 384;
      const vbMatch = selectedAsset.svgCode.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
      if (vbMatch) {
        const vbW = parseFloat(vbMatch[3]);
        const vbH = parseFloat(vbMatch[4]);
        if (vbW > 0 && vbH > 0) {
          natRatio = vbW / vbH;
          if (vbW >= vbH) {
            natW = 384;
            natH = Math.max(32, Math.round(384 / natRatio));
          } else {
            natH = 384;
            natW = Math.max(32, Math.round(384 * natRatio));
          }
        }
      } else {
        const wMatch = selectedAsset.svgCode.match(/width=["']\s*([\d.]+)/i);
        const hMatch = selectedAsset.svgCode.match(/height=["']\s*([\d.]+)/i);
        if (wMatch && hMatch) {
          const w = parseFloat(wMatch[1]);
          const h = parseFloat(hMatch[1]);
          if (w > 0 && h > 0) {
            natRatio = w / h;
            if (w >= h) {
              natW = 384;
              natH = Math.max(32, Math.round(384 / natRatio));
            } else {
              natH = 384;
              natW = Math.max(32, Math.round(384 * natRatio));
            }
          }
        }
      }
      setIconWidth(natW);
      setIconHeight(natH);
      setAspectRatio(natRatio);
      setLockAspectRatio(true);
    } else {
      setLayerOrder(prev => (prev.length > 0 ? prev : layers.map(l => l.id)));
    }
  }, [selectedAsset]);

  // Check if any 3D transformation is active to optimize 2D rendering performance
  const has3D = Boolean(
    (adjustments.rotateX && adjustments.rotateX !== 0) ||
    (adjustments.rotateY && adjustments.rotateY !== 0) ||
    (adjustments.translateZ && adjustments.translateZ !== 0) ||
    (adjustments.depth3D && adjustments.depth3D > 0) ||
    (adjustments.extrusionDepth && adjustments.extrusionDepth > 0) ||
    (adjustments.perspective && adjustments.perspective !== 800) ||
    adjustments.is3DFloating
  );

  // Gallery Card Safe Boundary Detection: Computes whether current transforms push element beyond card border
  const cardOverflowInfo = useMemo(() => {
    const tx = adjustments.translateX || 0;
    const ty = adjustments.translateY || 0;
    const tz = adjustments.translateZ || 0;
    const scale = adjustments.scale || 1;

    // Thresholds: In gallery cards, the preview box has padding around the icon.
    // Moving more than ~18% of width/height pushes the icon into the card's outer border area.
    const safeLimitX = Math.round(iconWidth * 0.18);
    const safeLimitY = Math.round(iconHeight * 0.18);
    const safeLimitZ = 160;

    let isOverflowing = Math.abs(tx) > safeLimitX || Math.abs(ty) > safeLimitY || Math.abs(tz) > safeLimitZ || scale > 1.25;
    let overflowReasons = [];

    if (Math.abs(tx) > safeLimitX) overflowReasons.push(`X: ${tx > 0 ? '+' : ''}${tx}px`);
    if (Math.abs(ty) > safeLimitY) overflowReasons.push(`Y: ${ty > 0 ? '+' : ''}${ty}px`);
    if (Math.abs(tz) > safeLimitZ) overflowReasons.push(`Z Depth: ${tz}px`);
    if (scale > 1.25) overflowReasons.push(`Scale: ${Math.round(scale * 100)}%`);

    // Check individual layer transforms
    if (layerTransforms && Object.keys(layerTransforms).length > 0) {
      for (const [layerId, tr] of Object.entries(layerTransforms)) {
        if (tr) {
          const lx = (tr.x || 0) + tx;
          const ly = (tr.y || 0) + ty;
          if (Math.abs(lx) > safeLimitX + 20 || Math.abs(ly) > safeLimitY + 20) {
            isOverflowing = true;
            overflowReasons.push(`Layer '${String(layerId).slice(0, 10)}'`);
            break;
          }
        }
      }
    }

    return {
      isOverflowing,
      reasons: overflowReasons,
      safeLimitX,
      safeLimitY
    };
  }, [adjustments.translateX, adjustments.translateY, adjustments.translateZ, adjustments.scale, layerTransforms, iconWidth, iconHeight]);

  // 1. Base styled SVG memo: Computes heavy XML parsing, style filters, gradients, colors, and canvas objects
  // 1. Base styled SVG memo: Computes heavy XML parsing, style filters, gradients, colors, and canvas objects
  // (Only recomputed when asset, colors, or visual style presets change - NEVER on layer drag or transforms!)
  const baseStyledSvg = useMemo(() => {
    if (!selectedAsset) return '';

    // Normalize foreignObject SVG so it maintains clean 200x200 layout matching viewBox
    let sourceSvg = normalizeForeignObjectSvg(selectedAsset.svgCode || '');

    // Ensure overflow: visible on root <svg> without duplicating style attribute
    sourceSvg = sourceSvg.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
      if (/style="([^"]*)"/i.test(attrs)) {
        return `<svg${attrs.replace(/style="([^"]*)"/i, (sm, s) => `style="${s.includes('overflow') ? s : s + '; overflow: visible;'}"`)}>`;
      }
      return `<svg${attrs} style="overflow: visible;">`;
    });

    // UNIVERSAL XML SANITIZER: Combine any multiple style attributes on the same tag into a single valid style attribute
    // (Prevents any fatal XML parsing error: "Attribute style redefined")
    sourceSvg = sourceSvg.replace(/<([a-zA-Z0-9:_-]+)([^>]*?)>/g, (fullTag, tagName, attrs) => {
      const styleMatches = [...attrs.matchAll(/\bstyle="([^"]*)"/gi)];
      if (styleMatches.length > 1) {
        const combined = styleMatches.map(m => m[1]).filter(Boolean).join('; ');
        const cleanAttrs = attrs.replace(/\bstyle="[^"]*"/gi, '').trim();
        return `<${tagName} ${cleanAttrs} style="${combined}">`;
      }
      return fullTag;
    });

    // 1. Tag layers if not already tagged so every element has a guaranteed data-layer-id
    const { taggedSvg } = extractSvgLayers(sourceSvg);
    let colorReplaced = replaceSvgColors(taggedSvg, adjustments.colorReplacements);

    // 2. Visual material/style transformations (support both per-layer styles and global style mode)
    const layersWithCustomStyles = Object.entries(layerStyles || {})
      .filter(([_, s]) => s && s.styleMode && s.styleMode !== 'original');

    if (layersWithCustomStyles.length > 0) {
      const styledLayerIds = new Set(layersWithCustomStyles.map(([id]) => String(id).replace(/^pf_studio_/i, '')));
      if (activeStyleMode && activeStyleMode !== 'original') {
        const remainingLayerIds = (layerOrder.length > 0 ? layerOrder : svgLayers.map(l => l.id))
          .filter(id => !styledLayerIds.has(String(id).replace(/^pf_studio_/i, '')));
        if (remainingLayerIds.length > 0) {
          colorReplaced = transformSvgStyle(colorReplaced, activeStyleMode, remainingLayerIds);
        }
      }
      layersWithCustomStyles.forEach(([layerId, style]) => {
        colorReplaced = transformSvgStyle(colorReplaced, style.styleMode, [layerId]);
      });
    } else if (activeStyleMode && activeStyleMode !== 'original') {
      colorReplaced = transformSvgStyle(colorReplaced, activeStyleMode);
    }

    // 3. Vector stroke thickness (works universally for stroke & filled icons)
    if (strokeMultiplier && strokeMultiplier !== 1) {
      colorReplaced = applyUniversalStroke(colorReplaced, strokeMultiplier, strokeColorMode, customStrokeColor);
    }

    // 3.4 Vector Icon Gradient Fill & Stroke Mode
    if (iconGradientEnabled) {
      const rad = (gradientAngle * Math.PI) / 180;
      const x1 = Math.round(50 - Math.cos(rad) * 50);
      const y1 = Math.round(50 - Math.sin(rad) * 50);
      const x2 = Math.round(50 + Math.cos(rad) * 50);
      const y2 = Math.round(50 + Math.sin(rad) * 50);
      const gradDef = `<defs><linearGradient id="iconderry_icon_gradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%"><stop offset="0%" stop-color="${gradientFrom}"/><stop offset="100%" stop-color="${gradientTo}"/></linearGradient></defs>`;
      colorReplaced = colorReplaced.replace(/<svg\b([^>]*)>/i, `<svg$1>${gradDef}`);
      colorReplaced = colorReplaced.replace(/\bfill="(?!none)[^"]*"/gi, 'fill="url(#iconderry_icon_gradient)"');
      colorReplaced = colorReplaced.replace(/\bstroke="(?!none)[^"]*"/gi, 'stroke="url(#iconderry_icon_gradient)"');
    }

    // 3.5 Inject Canva Pro Custom Elements (3D Text, Shapes, Brush Drawings)
    if (customCanvasObjects && customCanvasObjects.length > 0) {
      colorReplaced = injectCanvasObjectsIntoSvg(colorReplaced, customCanvasObjects, iconWidth, iconHeight);
    }

    return colorReplaced;
  }, [selectedAsset, layerStyles, activeStyleMode, layerOrder, svgLayers, strokeMultiplier, strokeColorMode, customStrokeColor, customCanvasObjects, iconWidth, iconHeight, iconGradientEnabled, gradientFrom, gradientTo, gradientAngle, adjustments.colorReplacements]);

  // 2. Fast layer transform compositor: Takes pre-styled base SVG and applies position offsets in <2ms!
  const currentPreviewSvg = useMemo(() => {
    if (!baseStyledSvg) return '';

    // 4. Per-layer position offsets, rotations, scaling, deletions, duplications, DOM ordering
    let transformedSvg = applyLayerTransforms(
      baseStyledSvg,
      layerTransforms,
      layerOrder,
      true, // Guarantee data-layer-id on all visual shapes
      layerStyles,
      deletedLayerIds,
      duplicatedLayers
    );

    // Ensure viewBox exists for responsive freeform scaling/stretching
    if (!transformedSvg.includes('viewBox=') && !transformedSvg.includes('viewbox=')) {
      const wMatch = transformedSvg.match(/width="([0-9.]+)(?:px)?"/i);
      const hMatch = transformedSvg.match(/height="([0-9.]+)(?:px)?"/i);
      if (wMatch && hMatch) {
        transformedSvg = transformedSvg.replace('<svg', `<svg viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`);
      }
    }

    // If aspect ratio is locked, preserve authentic geometry (xMidYMid meet); if unlocked, allow freeform stretching (none)
    const targetPreserveAspect = lockAspectRatio ? 'xMidYMid meet' : 'none';
    transformedSvg = transformedSvg.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
      let updated = attrs;
      if (/preserveAspectRatio="[^"]*"/i.test(updated)) {
        updated = updated.replace(/preserveAspectRatio="[^"]*"/i, `preserveAspectRatio="${targetPreserveAspect}"`);
      } else {
        updated += ` preserveAspectRatio="${targetPreserveAspect}"`;
      }
      return `<svg${updated}>`;
    });

    return scopeSvgIds(transformedSvg, 'pf_studio_');
  }, [baseStyledSvg, layerTransforms, layerStyles, layerOrder, deletedLayerIds, duplicatedLayers, lockAspectRatio]);

  // Synchronous SVG viewBox-to-rendered screen pixel ratio (computed immediately on render)
  const svgScaleRatio = useMemo(() => {
    const raw = currentPreviewSvg || selectedAsset?.svgCode || '';
    if (!raw) return 1;
    const vbMatch = raw.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
    let vbWidth = 0;
    if (vbMatch) {
      vbWidth = parseFloat(vbMatch[3]);
    }
    if (!vbWidth || vbWidth <= 0) {
      const wMatch = raw.match(/width=["']\s*([\d.]+)/i);
      if (wMatch) vbWidth = parseFloat(wMatch[1]);
    }
    if (!vbWidth || vbWidth <= 0) vbWidth = 100;
    return vbWidth / (iconWidth || 512);
  }, [currentPreviewSvg, selectedAsset, iconWidth]);

  const finalSvgScale = svgScaleRatio || 1;

  // Detect whether currently selected icon is a stroke-based or filled vector
  const isStrokeIcon = useMemo(() => {
    if (!selectedAsset || !selectedAsset.svgCode) return false;
    return /stroke="((?!none)[^"]+)"/i.test(selectedAsset.svgCode) || /stroke:\s*(?!none)[^;]+/i.test(selectedAsset.svgCode);
  }, [selectedAsset]);

  // Count active color overrides
  const modifiedColorCount = Object.keys(adjustments.colorReplacements || {}).length;

  // Check if an SVG element corresponds to a selected color (supporting gradients, fills, strokes, inline styles)
  const isElementMatchingColor = (el, targetColor) => {
    if (!el || !targetColor || el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'defs') return false;
    const targetLower = targetColor.toLowerCase();
    const currentReplacedTarget = adjustments.colorReplacements[targetLower]?.toLowerCase();

    // Check if a color string matches either original targetColor OR its current replacement
    const matchesColor = (val) => {
      if (!val || val.startsWith('url(')) return false;
      const norm = normalizeColor(val)?.toLowerCase();
      if (!norm) return false;
      return norm === targetLower || (currentReplacedTarget && norm === currentReplacedTarget);
    };

    // Helper to check gradient stops
    const checkGrad = (gradId) => {
      if (!gradId) return false;
      const svgRoot = el.ownerSVGElement || el.closest('svg') || document;
      const grad = svgRoot.querySelector(`#${CSS.escape(gradId)}`) || document.getElementById(gradId);
      if (grad) {
        const stops = grad.querySelectorAll('stop');
        for (const stop of stops) {
          const sc = stop.getAttribute('stop-color') || stop.style.stopColor;
          if (matchesColor(sc)) return true;
        }
      }
      return false;
    };

    // 1. Direct Attributes
    const fill = el.getAttribute('fill');
    const stroke = el.getAttribute('stroke');
    const stopColor = el.getAttribute('stop-color');
    const color = el.getAttribute('color');

    if (fill) {
      const gradMatch = fill.match(/url\(\s*['"]?#([^'")]+)['"]?\s*\)/i);
      if (gradMatch && checkGrad(gradMatch[1])) return true;
      if (matchesColor(fill)) return true;
    }

    if (stroke && matchesColor(stroke)) return true;
    if (stopColor && matchesColor(stopColor)) return true;
    if (color && matchesColor(color)) return true;

    // 2. Inline Style
    const style = el.getAttribute('style') || '';
    if (style) {
      if (style.toLowerCase().includes(targetLower) || (currentReplacedTarget && style.toLowerCase().includes(currentReplacedTarget))) return true;
      const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
      if (fillMatch) {
        const gradMatch = fillMatch[1].match(/url\(\s*['"]?#([^'")]+)['"]?\s*\)/i);
        if (gradMatch && checkGrad(gradMatch[1])) return true;
        if (matchesColor(fillMatch[1])) return true;
      }
    }

    return false;
  };

  // Select color AND select the bodies of all SVG vector elements that have this color
  const handleSelectColorAndElements = useCallback((targetColor) => {
    if (!targetColor) return;
    setActiveSelectedColor(targetColor);
    setStudioTab('colors');

    const matchingLayerIds = [];
    const container = canvasSvgContainerRef.current;
    if (container) {
      const allVisualNodes = container.querySelectorAll('[data-layer-id]');
      allVisualNodes.forEach(el => {
        if (isElementMatchingColor(el, targetColor)) {
          const rawId = el.getAttribute('data-layer-id');
          const cleanId = rawId ? rawId.replace(/^pf_studio_/i, '') : null;
          if (cleanId && !matchingLayerIds.includes(cleanId)) {
            matchingLayerIds.push(cleanId);
          }
        }
      });

      // Fallback: Check shape elements if data-layer-id was not yet tagged
      if (matchingLayerIds.length === 0) {
        const shapes = container.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line, text');
        shapes.forEach((el, idx) => {
          if (isElementMatchingColor(el, targetColor)) {
            let id = el.getAttribute('data-layer-id');
            if (!id) {
              id = `layer_${idx}`;
              el.setAttribute('data-layer-id', id);
            }
            const cleanId = id.replace(/^pf_studio_/i, '');
            if (!matchingLayerIds.includes(cleanId)) {
              matchingLayerIds.push(cleanId);
            }
          }
        });
      }
    }

    // Fallback using allSvgLayers
    if (matchingLayerIds.length === 0 && allSvgLayers.length > 0) {
      const targetNorm = normalizeColor(targetColor)?.toLowerCase();
      allSvgLayers.forEach(l => {
        const rawNorm = normalizeColor(l.rawColor || l.color)?.toLowerCase();
        if (rawNorm === targetNorm && !matchingLayerIds.includes(l.id)) {
          matchingLayerIds.push(l.id);
        }
      });
    }

    if (matchingLayerIds.length > 0) {
      setSelectedLayerIds(matchingLayerIds);
      setSelectedLayerId(matchingLayerIds[0]);
    }

    const el = document.getElementById(`color-card-${targetColor.replace('#', '').toLowerCase()}`);
    if (el) {
      const scrollContainer = el.closest('.overflow-y-auto');
      if (scrollContainer) {
        const cRect = scrollContainer.getBoundingClientRect();
        const eRect = el.getBoundingClientRect();
        if (eRect.top < cRect.top || eRect.bottom > cRect.bottom) {
          scrollContainer.scrollTop += (eRect.top - cRect.top) - (cRect.height / 2);
        }
      }
    }
  }, [allSvgLayers, adjustments.colorReplacements]);

  // Open Color Wheel Popover floating directly above the clicked palette swatch
  const openColorWheelPopover = useCallback((targetEl, color) => {
    if (!targetEl || !color) return;
    const rect = targetEl.getBoundingClientRect();
    const currentHex = adjustments.colorReplacements[color.toLowerCase()] || color;
    setColorWheelPopover({
      originalColor: color,
      currentHex: currentHex,
      anchorX: Math.round(rect.left + rect.width / 2),
      anchorY: Math.round(rect.top)
    });
  }, [adjustments.colorReplacements]);

  // Solid Selection Outline effect on Canvas SVG elements
  useEffect(() => {
    if (!canvasSvgContainerRef.current) return;
    const container = canvasSvgContainerRef.current;
    container.querySelectorAll('.svg-element-selected').forEach(el => el.classList.remove('svg-element-selected'));

    // Multi-selection / single-selection outline on all selected vector parts
    const activeIds = selectedLayerIds && selectedLayerIds.length > 0
      ? selectedLayerIds
      : (selectedLayerId ? [selectedLayerId] : []);

    if (activeIds.length > 0) {
      activeIds.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const targetEl = container.querySelector(`[data-layer-id="${id}"]`) ||
          container.querySelector(`[data-layer-id="${cleanId}"]`) ||
          (numOnly ? container.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (targetEl) {
          targetEl.classList.add('svg-element-selected');
        }
      });
      return;
    }

    if (activeSelectedColor) {
      const allEls = container.querySelectorAll('*');
      allEls.forEach(el => {
        if (isElementMatchingColor(el, activeSelectedColor)) {
          el.classList.add('svg-element-selected');
        }
      });
    }
  }, [selectedLayerId, selectedLayerIds, activeSelectedColor, currentPreviewSvg]);

  // Live calculation of the Transform Bounding Box around selected SVG element(s)
  const updateTransformBox = useCallback((overrideIds = null) => {
    const svgContainer = canvasSvgContainerRef.current;
    if (!svgContainer) {
      setTransformBox(null);
      return null;
    }

    // Always clear temporary translate3d style so measurement and rendering are 100% clean
    if (transformBoxRef.current) {
      transformBoxRef.current.style.transform = '';
    }

    const activeIds = (overrideIds && overrideIds.length > 0)
      ? overrideIds
      : (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0
        ? selectedLayerIdsRef.current
        : (selectedLayerIds && selectedLayerIds.length > 0
          ? selectedLayerIds
          : (selectedLayerIdRef.current ? [selectedLayerIdRef.current] : (selectedLayerId ? [selectedLayerId] : []))));

    if (activeIds.length === 0) {
      setTransformBox(null);
      return null;
    }

    let nodes = activeIds.map(id => {
      const cleanId = String(id).replace(/^pf_studio_/i, '');
      const numOnly = cleanId.replace(/\D/g, '');
      return svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
        svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
        svgContainer.querySelector(`[data-layer-id="pf_studio_${cleanId}"]`) ||
        (numOnly ? svgContainer.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
    }).filter(Boolean);

    if (nodes.length === 0 && activeIds.length > 0) {
      const svgEl = svgContainer.querySelector('svg');
      if (svgEl) tagSvgElements(svgEl);
      nodes = activeIds.map(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        return svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
          svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
          svgContainer.querySelector(`[data-layer-id="pf_studio_${cleanId}"]`) ||
          (numOnly ? svgContainer.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
      }).filter(Boolean);
    }

    if (nodes.length === 0) {
      setTransformBox(null);
      return null;
    }

    const svgEl = svgContainer.querySelector('svg');
    if (!svgEl) {
      setTransformBox(null);
      return null;
    }

    const stageEl = transformStageRef.current;
    if (!stageEl) {
      setTransformBox(null);
      return null;
    }

    const stageRect = stageEl.getBoundingClientRect();
    if (!stageRect || stageRect.width <= 0 || stageRect.height <= 0) {
      setTransformBox(null);
      return null;
    }

    const scaleX = iconWidth / stageRect.width;
    const scaleY = iconHeight / stageRect.height;

    // Accurate visual screen bounding box for any SVG element including stroke thickness and line caps
    // Uses getBBox() + getScreenCTM() to measure true vector geometry WITHOUT filter blur/glow inflation!
    const getVisualRect = (node) => {
      if (!node) return null;
      const tag = node.tagName?.toLowerCase();
      if (tag === 'g') {
        const children = Array.from(node.querySelectorAll('path, line, rect, circle, ellipse, polygon, polyline, text'));
        if (children.length > 0) {
          let gMinL = Infinity, gMinT = Infinity, gMaxR = -Infinity, gMaxB = -Infinity;
          children.forEach(c => {
            const cr = getVisualRect(c);
            if (cr) {
              if (cr.left < gMinL) gMinL = cr.left;
              if (cr.top < gMinT) gMinT = cr.top;
              if (cr.right > gMaxR) gMaxR = cr.right;
              if (cr.bottom > gMaxB) gMaxB = cr.bottom;
            }
          });
          if (isFinite(gMinL) && isFinite(gMinT)) {
            return { left: gMinL, top: gMinT, right: gMaxR, bottom: gMaxB };
          }
        }
      }

      // HTML elements inside foreignObject
      const isHtml = Boolean(node.closest('foreignObject')) || tag === 'div' || tag === 'span' || tag === 'section';
      if (isHtml) {
        // If node has visible child elements, measure the tight union of its children!
        if (node.children && node.children.length > 0) {
          const computed = window.getComputedStyle(node);
          const hasOwnVisual = Boolean(
            (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent') ||
            (computed.borderWidth && parseFloat(computed.borderWidth) > 0 && computed.borderColor && computed.borderColor !== 'transparent') ||
            (computed.boxShadow && computed.boxShadow !== 'none') ||
            (computed.backgroundImage && computed.backgroundImage !== 'none')
          );
          if (!hasOwnVisual) {
            const visualChildren = Array.from(node.querySelectorAll('div, span, section, p, button, a, svg, img')).filter(c => {
              const cs = window.getComputedStyle(c);
              const hasBg = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
              const hasBorder = cs.borderWidth && parseFloat(cs.borderWidth) > 0 && cs.borderColor !== 'transparent';
              const hasShadow = cs.boxShadow && cs.boxShadow !== 'none';
              const hasImage = cs.backgroundImage && cs.backgroundImage !== 'none';
              return hasBg || hasBorder || hasShadow || hasImage || c.tagName.toLowerCase() === 'svg' || c.tagName.toLowerCase() === 'img';
            });
            if (visualChildren.length > 0) {
              let hMinL = Infinity, hMinT = Infinity, hMaxR = -Infinity, hMaxB = -Infinity;
              visualChildren.forEach(c => {
                const cr = c.getBoundingClientRect();
                if (cr && (cr.width > 0 || cr.height > 0)) {
                  if (cr.left < hMinL) hMinL = cr.left;
                  if (cr.top < hMinT) hMinT = cr.top;
                  if (cr.right > hMaxR) hMaxR = cr.right;
                  if (cr.bottom > hMaxB) hMaxB = cr.bottom;
                }
              });
              if (isFinite(hMinL) && isFinite(hMinT)) {
                return { left: hMinL, top: hMinT, right: hMaxR, bottom: hMaxB };
              }
            }
          }
        }
        const r = node.getBoundingClientRect();
        if (r && (r.width > 0 || r.height > 0)) {
          return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
        }
      }

      // 1. High precision pure geometry bounding box via getBBox (immune to filter glow/blur expansion)
      if (typeof node.getBBox === 'function' && typeof node.getScreenCTM === 'function') {
        try {
          const bbox = node.getBBox();
          const ctm = node.getScreenCTM();
          if (bbox && ctm && bbox.width > 0 && bbox.height > 0) {
            const corners = [
              { x: bbox.x, y: bbox.y },
              { x: bbox.x + bbox.width, y: bbox.y },
              { x: bbox.x, y: bbox.y + bbox.height },
              { x: bbox.x + bbox.width, y: bbox.y + bbox.height }
            ];
            let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
            for (const pt of corners) {
              const sx = pt.x * ctm.a + pt.y * ctm.c + ctm.e;
              const sy = pt.x * ctm.b + pt.y * ctm.d + ctm.f;
              if (sx < bMinX) bMinX = sx;
              if (sx > bMaxX) bMaxX = sx;
              if (sy < bMinY) bMinY = sy;
              if (sy > bMaxY) bMaxY = sy;
            }

            let strokeW = 0;
            const style = window.getComputedStyle(node);
            const strokeAttr = node.getAttribute('stroke');
            const strokeStyle = style.stroke;
            const hasStroke = (strokeAttr && strokeAttr !== 'none' && strokeAttr !== 'transparent') ||
                              (strokeStyle && strokeStyle !== 'none' && strokeStyle !== 'transparent');
            if (hasStroke) {
              const rawW = parseFloat(node.getAttribute('stroke-width') || style.strokeWidth || '0') || 0;
              if (rawW > 0) strokeW = rawW;
            }

            const ctmScaleX = Math.hypot(ctm.a, ctm.b) || 1;
            const ctmScaleY = Math.hypot(ctm.c, ctm.d) || 1;
            const halfSwX = (strokeW / 2) * ctmScaleX;
            const halfSwY = (strokeW / 2) * ctmScaleY;

            return {
              left: bMinX - halfSwX,
              top: bMinY - halfSwY,
              right: bMaxX + halfSwX,
              bottom: bMaxY + halfSwY
            };
          }
        } catch (_) {}
      }

      // 2. Fallback: getBoundingClientRect
      const r = node.getBoundingClientRect();
      if (!r) return null;

      const style = window.getComputedStyle(node);
      const strokeAttr = node.getAttribute('stroke');
      const strokeStyle = style.stroke;
      const hasStroke = (strokeAttr && strokeAttr !== 'none' && strokeAttr !== 'transparent') ||
                        (strokeStyle && strokeStyle !== 'none' && strokeStyle !== 'transparent');

      let strokeW = 0;
      if (hasStroke) {
        const rawW = parseFloat(node.getAttribute('stroke-width') || style.strokeWidth || '0') || 0;
        if (rawW > 0) strokeW = rawW;
      }

      if (strokeW <= 0) {
        return {
          left: r.left,
          top: r.top,
          right: r.right,
          bottom: r.bottom
        };
      }

      let ctmScaleX = 1;
      let ctmScaleY = 1;
      try {
        const ctm = node.getScreenCTM ? node.getScreenCTM() : null;
        if (ctm) {
          ctmScaleX = Math.hypot(ctm.a, ctm.b) || 1;
          ctmScaleY = Math.hypot(ctm.c, ctm.d) || 1;
        }
      } catch (_) {}

      const halfSwX = (strokeW / 2) * ctmScaleX;
      const halfSwY = (strokeW / 2) * ctmScaleY;

      return {
        left: r.left - halfSwX,
        top: r.top - halfSwY,
        right: r.right + halfSwX,
        bottom: r.bottom + halfSwY
      };
    };

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    if (nodes.length > 20) {
      const svgEl = svgContainer.querySelector('svg');
      if (nodes.length >= (allSvgLayers?.length || 999999) && svgEl) {
        const svgRect = svgEl.getBoundingClientRect();
        minLeft = svgRect.left;
        minTop = svgRect.top;
        maxRight = svgRect.right;
        maxBottom = svgRect.bottom;
      } else {
        nodes.forEach(node => {
          const r = node.getBoundingClientRect();
          if (r && (r.width > 0 || r.height > 0)) {
            if (r.left < minLeft) minLeft = r.left;
            if (r.top < minTop) minTop = r.top;
            if (r.right > maxRight) maxRight = r.right;
            if (r.bottom > maxBottom) maxBottom = r.bottom;
          }
        });
      }
    } else {
      nodes.forEach(node => {
        const vr = getVisualRect(node);
        if (vr && (vr.right > vr.left || vr.bottom > vr.top)) {
          if (vr.left < minLeft) minLeft = vr.left;
          if (vr.top < minTop) minTop = vr.top;
          if (vr.right > maxRight) maxRight = vr.right;
          if (vr.bottom > maxBottom) maxBottom = vr.bottom;
        }
      });
    }

    if (!isFinite(minLeft) || !isFinite(minTop)) {
      setTransformBox(null);
      return null;
    }

    const x = (minLeft - stageRect.left) * scaleX;
    const y = (minTop - stageRect.top) * scaleY;
    const width = Math.max(8, (maxRight - minLeft) * scaleX);
    const height = Math.max(8, (maxBottom - minTop) * scaleY);

    const box = {
      x,
      y,
      width,
      height,
      minLeft: x,
      minTop: y,
      maxRight: x + width,
      maxBottom: y + height
    };

    if (transformBoxRef.current) {
      transformBoxRef.current.style.left = `${box.x}px`;
      transformBoxRef.current.style.top = `${box.y}px`;
      transformBoxRef.current.style.width = `${box.width}px`;
      transformBoxRef.current.style.height = `${box.height}px`;
      transformBoxRef.current.style.transform = '';
    }

    setTransformBox(box);
    return box;
  }, [selectedLayerIds, selectedLayerId, iconWidth, iconHeight, allSvgLayers]);
  updateTransformBoxRef.current = updateTransformBox;

  useEffect(() => {
    if (isDraggingLayerRef.current || justFinishedLayerDragRef.current) return;
    updateTransformBox();
    const wsEl = canvasWorkspaceRef.current;
    const svgEl = canvasSvgContainerRef.current;

    let animId = null;
    const throttledUpdate = () => {
      if (animId) return;
      animId = requestAnimationFrame(() => {
        animId = null;
        updateTransformBox();
      });
    };

    let ro = null;
    if (wsEl && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(throttledUpdate);
      ro.observe(wsEl);
      if (svgEl) ro.observe(svgEl);
    }

    window.addEventListener('resize', throttledUpdate, { passive: true });
    window.addEventListener('scroll', throttledUpdate, { capture: true, passive: true });

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate, { capture: true });
    };
  }, [
    updateTransformBox,
    currentPreviewSvg,
    layerTransforms,
    sidebarWidth,
    mobileCanvasHeight,
    isResizingSidebar,
    isResizingMobileCanvas
  ]);

  const getSelectedLayerCenter = (id) => {
    const orig = layerTransformsRef.current[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
    if (orig.cx && orig.cy) return { cx: orig.cx, cy: orig.cy };
    const svgContainer = canvasSvgContainerRef.current;
    if (svgContainer) {
      const cleanId = String(id).replace(/^pf_studio_/i, '');
      const numOnly = cleanId.replace(/\D/g, '');
      const el = svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
        svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
        (numOnly ? svgContainer.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
      if (el) {
        if (typeof el.getBBox === 'function') {
          try {
            const bbox = el.getBBox();
            return { cx: bbox.x + bbox.width / 2, cy: bbox.y + bbox.height / 2 };
          } catch (_) { }
        } else {
          try {
            const r = el.getBoundingClientRect();
            const svgEl = svgContainer.querySelector('svg');
            const svgR = svgEl?.getBoundingClientRect();
            const vb = svgEl?.viewBox?.baseVal;
            const vbWidth = (vb && vb.width > 0) ? vb.width : (svgEl?.clientWidth || 512);
            const vbHeight = (vb && vb.height > 0) ? vb.height : (svgEl?.clientHeight || 512);
            if (r && svgR && svgR.width > 0) {
              const scaleX = vbWidth / svgR.width;
              const scaleY = vbHeight / svgR.height;
              const cx = (r.left + r.width / 2 - svgR.left) * scaleX;
              const cy = (r.top + r.height / 2 - svgR.top) * scaleY;
              return { cx, cy };
            }
          } catch (_) { }
        }
      }
    }
    return { cx: 256, cy: 256 };
  };

  const rotateSelectedOrCanvas = (newAngleOrUpdater) => {
    recordUndo();
    const activeIds = selectedLayerIds && selectedLayerIds.length > 0
      ? selectedLayerIds
      : (selectedLayerId ? [selectedLayerId] : []);

    if (activeIds.length > 0) {
      setLayerTransforms(prev => {
        const next = { ...prev };
        activeIds.forEach(id => {
          const cleanId = String(id).replace(/^pf_studio_/i, '');
          const orig = next[cleanId] || next[id] || { x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0, scaleX: 1, scaleY: 1 };
          const { cx, cy } = getSelectedLayerCenter(id);
          const currentRot = orig.rotate || 0;
          const targetRot = typeof newAngleOrUpdater === 'function'
            ? newAngleOrUpdater(currentRot)
            : newAngleOrUpdater;
          const updatedRot = Math.round(((targetRot % 360) + 360) % 360);
          const updated = {
            ...orig,
            rotate: updatedRot,
            cx: orig.cx || cx,
            cy: orig.cy || cy
          };
          next[cleanId] = updated;
          next[id] = updated;
        });
        layerTransformsRef.current = next;
        return next;
      });
      requestAnimationFrame(() => updateTransformBox());
    } else {
      setAdjustments(prev => {
        const currentRot = prev.rotation || 0;
        const targetRot = typeof newAngleOrUpdater === 'function'
          ? newAngleOrUpdater(currentRot)
          : newAngleOrUpdater;
        return {
          ...prev,
          rotation: Math.round(((targetRot % 360) + 360) % 360)
        };
      });
    }
  };

  const flipSelectedOrCanvas = (axis) => {
    recordUndo();
    const activeIds = selectedLayerIds && selectedLayerIds.length > 0
      ? selectedLayerIds
      : (selectedLayerId ? [selectedLayerId] : []);

    if (activeIds.length > 0) {
      setLayerTransforms(prev => {
        const next = { ...prev };
        activeIds.forEach(id => {
          const orig = next[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
          const { cx, cy } = getSelectedLayerCenter(id);
          next[id] = {
            ...orig,
            scaleX: axis === 'h' ? (orig.scaleX !== undefined ? -orig.scaleX : -1) : (orig.scaleX ?? 1),
            scaleY: axis === 'v' ? (orig.scaleY !== undefined ? -orig.scaleY : -1) : (orig.scaleY ?? 1),
            cx: orig.cx || cx,
            cy: orig.cy || cy
          };
        });
        layerTransformsRef.current = next;
        return next;
      });
      requestAnimationFrame(() => updateTransformBox());
    } else {
      setAdjustments(prev => ({
        ...prev,
        flipH: axis === 'h' ? !prev.flipH : prev.flipH,
        flipV: axis === 'v' ? !prev.flipV : prev.flipV
      }));
    }
  };

  // Transform handle pointer down: Handles corner proportional scaling, edge stretching, and rotation
  const handleTransformHandleDown = (e, handleType) => {
    e.preventDefault();
    e.stopPropagation();

    const activeIds = selectedLayerIds && selectedLayerIds.length > 0
      ? selectedLayerIds
      : (selectedLayerId ? [selectedLayerId] : []);

    if (activeIds.length === 0 || !transformBox) return;

    recordUndo();

    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startBox = { ...transformBox };

    const wsEl = canvasWorkspaceRef.current;
    const wsRect = wsEl ? wsEl.getBoundingClientRect() : { width: 1, height: 1 };
    const zoomScaleX = wsEl?.offsetWidth > 0 ? (wsRect.width / wsEl.offsetWidth) : 1;
    const zoomScaleY = wsEl?.offsetHeight > 0 ? (wsRect.height / wsEl.offsetHeight) : 1;

    const boxEl = transformBoxRef.current;
    const bRect = boxEl ? boxEl.getBoundingClientRect() : null;
    const centerClientX = bRect ? (bRect.left + bRect.right) / 2 : startClientX;
    const centerClientY = bRect ? (bRect.top + bRect.bottom) / 2 : startClientY;
    const startAngle = Math.atan2(startClientY - centerClientY, startClientX - centerClientX) * (180 / Math.PI);

    const initialTransforms = {};
    const svgContainer = canvasSvgContainerRef.current;
    const svgEl = svgContainer?.querySelector('svg');
    const vb = svgEl?.viewBox?.baseVal;
    const vbWidth = (vb && vb.width > 0) ? vb.width : (svgEl?.clientWidth || 512);
    const vbHeight = (vb && vb.height > 0) ? vb.height : (svgEl?.clientHeight || 512);

    const activeDomNodes = activeIds.map(id => {
      const cleanId = String(id).replace(/^pf_studio_/i, '');
      const numOnly = cleanId.replace(/\D/g, '');
      const node = svgContainer?.querySelector(`[data-layer-id="${id}"]`) ||
        svgContainer?.querySelector(`[data-layer-id="${cleanId}"]`) ||
        (numOnly ? svgContainer?.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
      const origAttr = node ? (node.getAttribute('data-orig-transform') || '') : '';
      const baseTransform = node ? (node.getAttribute('data-base-transform') || '') : '';
      const isHtml = node ? (Boolean(node.closest('foreignObject')) || node.tagName?.toLowerCase() === 'div' || node.tagName?.toLowerCase() === 'span') : false;
      return { id, cleanId, node, origAttr, baseTransform, isHtml };
    }).filter(item => item.node);

    let groupCx = 0;
    let groupCy = 0;
    if (activeIds.length > 1 && svgContainer) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      activeIds.forEach(id => {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
          svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
          (numOnly ? svgContainer.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (el) {
          if (typeof el.getBBox === 'function') {
            try {
              const bbox = el.getBBox();
              if (bbox && (bbox.width > 0 || bbox.height > 0)) {
                minX = Math.min(minX, bbox.x);
                minY = Math.min(minY, bbox.y);
                maxX = Math.max(maxX, bbox.x + bbox.width);
                maxY = Math.max(maxY, bbox.y + bbox.height);
              }
            } catch (_) { }
          } else {
            try {
              const r = el.getBoundingClientRect();
              const svgR = svgEl?.getBoundingClientRect();
              if (r && svgR && svgR.width > 0) {
                const sX = vbWidth / svgR.width;
                const sY = vbHeight / svgR.height;
                const ex = (r.left - svgR.left) * sX;
                const ey = (r.top - svgR.top) * sY;
                minX = Math.min(minX, ex);
                minY = Math.min(minY, ey);
                maxX = Math.max(maxX, ex + r.width * sX);
                maxY = Math.max(maxY, ey + r.height * sY);
              }
            } catch (_) { }
          }
        }
      });
      if (minX < Infinity && maxX > -Infinity) {
        groupCx = (minX + maxX) / 2;
        groupCy = (minY + maxY) / 2;
      }
    }

    activeIds.forEach(id => {
      const orig = layerTransformsRef.current[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
      let cx = (activeIds.length > 1 && groupCx) ? groupCx : (orig.cx || 0);
      let cy = (activeIds.length > 1 && groupCy) ? groupCy : (orig.cy || 0);
      if (svgContainer && (!cx || !cy)) {
        const cleanId = String(id).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = svgContainer.querySelector(`[data-layer-id="${id}"]`) ||
          svgContainer.querySelector(`[data-layer-id="${cleanId}"]`) ||
          (numOnly ? svgContainer.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (el) {
          if (typeof el.getBBox === 'function') {
            try {
              const bbox = el.getBBox();
              cx = bbox.x + bbox.width / 2;
              cy = bbox.y + bbox.height / 2;
            } catch (_) { }
          } else {
            try {
              const r = el.getBoundingClientRect();
              const svgR = svgEl?.getBoundingClientRect();
              if (r && svgR && svgR.width > 0) {
                const sX = vbWidth / svgR.width;
                const sY = vbHeight / svgR.height;
                cx = (r.left + r.width / 2 - svgR.left) * sX;
                cy = (r.top + r.height / 2 - svgR.top) * sY;
              }
            } catch (_) { }
          }
        }
      }
      initialTransforms[id] = {
        ...orig,
        scaleX: orig.scaleX ?? 1,
        scaleY: orig.scaleY ?? 1,
        cx,
        cy
      };
    });

    let rafId = null;
    let latestTransforms = null;

    const handlePointerMove = (moveEvt) => {
      moveEvt.preventDefault();
      const curClientX = moveEvt.clientX;
      const curClientY = moveEvt.clientY;

      const dx = (curClientX - startClientX) / zoomScaleX;
      const dy = (curClientY - startClientY) / zoomScaleY;

      if (moveEvt.pointerType === 'mouse' && moveEvt.buttons === 0) {
        handlePointerUp();
        return;
      }

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;

        if (handleType === 'rotate') {
          const curAngle = Math.atan2(curClientY - centerClientY, curClientX - centerClientX) * (180 / Math.PI);
          let deltaAngle = curAngle - startAngle;
          if (moveEvt.shiftKey) {
            deltaAngle = Math.round(deltaAngle / 15) * 15;
          }

          const updated = {};
          activeIds.forEach(id => {
            const init = initialTransforms[id];
            const updatedRot = Math.round(((init.rotate || 0) + deltaAngle) % 360);
            updated[id] = {
              ...init,
              rotate: updatedRot
            };
          });
          latestTransforms = updated;

          // Direct DOM live updates for 60fps real-time rotation
          activeDomNodes.forEach(({ id, node, origAttr, baseTransform, isHtml }) => {
            const init = initialTransforms[id];
            if (!init) return;
            const updatedRot = Math.round(((init.rotate || 0) + deltaAngle) % 360);
            if (isHtml) {
              const tokens = [];
              if (init.x || init.y) tokens.push(`translate(${init.x}px, ${init.y}px)`);
              tokens.push(`rotate(${updatedRot}deg)`);
              if ((init.scaleX ?? 1) !== 1 || (init.scaleY ?? 1) !== 1) tokens.push(`scale(${init.scaleX ?? 1}, ${init.scaleY ?? 1})`);
              if (baseTransform) tokens.push(baseTransform);
              node.style.transform = tokens.join(' ');
              node.style.transformOrigin = 'center center';
            } else {
              const parts = [];
              if (init.x || init.y) parts.push(`translate(${init.x} ${init.y})`);
              const cx = init.cx || 0;
              const cy = init.cy || 0;
              if (cx || cy) {
                parts.push(`translate(${cx} ${cy}) rotate(${updatedRot}) scale(${init.scaleX ?? 1} ${init.scaleY ?? 1}) translate(${-cx} ${-cy})`);
              } else {
                parts.push(`rotate(${updatedRot}) scale(${init.scaleX ?? 1} ${init.scaleY ?? 1})`);
              }
              if (origAttr) parts.push(origAttr);
              node.setAttribute('transform', parts.join(' '));
            }
          });

          if (transformBoxRef.current) {
            transformBoxRef.current.style.transform = `rotate(${deltaAngle}deg)`;
          }
          return;
        }

        // Scaling calculations
        let scaleFactorX = 1;
        let scaleFactorY = 1;

        if (handleType === 'se') {
          const newW = Math.max(10, startBox.width + dx);
          const ratio = newW / startBox.width;
          scaleFactorX = ratio;
          scaleFactorY = ratio;
        } else if (handleType === 'nw') {
          const newW = Math.max(10, startBox.width - dx);
          const ratio = newW / startBox.width;
          scaleFactorX = ratio;
          scaleFactorY = ratio;
        } else if (handleType === 'ne') {
          const newW = Math.max(10, startBox.width + dx);
          const ratio = newW / startBox.width;
          scaleFactorX = ratio;
          scaleFactorY = ratio;
        } else if (handleType === 'sw') {
          const newW = Math.max(10, startBox.width - dx);
          const ratio = newW / startBox.width;
          scaleFactorX = ratio;
          scaleFactorY = ratio;
        } else if (handleType === 'e') {
          const newW = Math.max(10, startBox.width + dx);
          scaleFactorX = newW / startBox.width;
          scaleFactorY = 1;
        } else if (handleType === 'w') {
          const newW = Math.max(10, startBox.width - dx);
          scaleFactorX = newW / startBox.width;
          scaleFactorY = 1;
        } else if (handleType === 's') {
          const newH = Math.max(10, startBox.height + dy);
          scaleFactorX = 1;
          scaleFactorY = newH / startBox.height;
        } else if (handleType === 'n') {
          const newH = Math.max(10, startBox.height - dy);
          scaleFactorX = 1;
          scaleFactorY = newH / startBox.height;
        }

        const updated = {};
        activeIds.forEach(id => {
          const init = initialTransforms[id];
          const curScaleX = Number(Math.max(0.05, (init.scaleX ?? 1) * scaleFactorX).toFixed(4));
          const curScaleY = Number(Math.max(0.05, (init.scaleY ?? 1) * scaleFactorY).toFixed(4));
          updated[id] = {
            ...init,
            scaleX: curScaleX,
            scaleY: curScaleY
          };
        });
        latestTransforms = updated;

        // Direct DOM live updates for 60fps real-time scaling/stretching
        activeDomNodes.forEach(({ id, node, origAttr, baseTransform, isHtml }) => {
          const init = initialTransforms[id];
          if (!init) return;
          const curScaleX = Number(Math.max(0.05, (init.scaleX ?? 1) * scaleFactorX).toFixed(4));
          const curScaleY = Number(Math.max(0.05, (init.scaleY ?? 1) * scaleFactorY).toFixed(4));
          if (isHtml) {
            const tokens = [];
            if (init.x || init.y) tokens.push(`translate(${init.x}px, ${init.y}px)`);
            if (init.rotate) tokens.push(`rotate(${init.rotate}deg)`);
            tokens.push(`scale(${curScaleX}, ${curScaleY})`);
            if (baseTransform) tokens.push(baseTransform);
            node.style.transform = tokens.join(' ');
            node.style.transformOrigin = 'center center';
          } else {
            const parts = [];
            if (init.x || init.y) parts.push(`translate(${init.x} ${init.y})`);
            const cx = init.cx || 0;
            const cy = init.cy || 0;
            if (cx || cy) {
              parts.push(`translate(${cx} ${cy}) rotate(${init.rotate || 0}) scale(${curScaleX} ${curScaleY}) translate(${-cx} ${-cy})`);
            } else {
              parts.push(`rotate(${init.rotate || 0}) scale(${curScaleX} ${curScaleY})`);
            }
            if (origAttr) parts.push(origAttr);
            node.setAttribute('transform', parts.join(' '));
          }
        });

        if (transformBoxRef.current) {
          transformBoxRef.current.style.transform = `scale(${scaleFactorX}, ${scaleFactorY})`;
        }
      });
    };

    const handlePointerUp = () => {
      try {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (transformBoxRef.current) {
          transformBoxRef.current.style.transform = '';
        }
        if (latestTransforms && Object.keys(latestTransforms).length > 0) {
          setLayerTransforms(prev => ({
            ...prev,
            ...latestTransforms
          }));
        }
        updateTransformBox(activeIds);
        requestAnimationFrame(() => {
          updateTransformBox(activeIds);
        });
        setTimeout(() => {
          updateTransformBox(activeIds);
        }, 40);
      } finally {
        window.removeEventListener('pointermove', handlePointerMove, true);
        window.removeEventListener('pointerup', handlePointerUp, true);
        window.removeEventListener('pointercancel', handlePointerUp, true);
        window.removeEventListener('mouseup', handlePointerUp, true);
        window.removeEventListener('touchend', handlePointerUp, true);
        window.removeEventListener('blur', handlePointerUp);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false, capture: true });
    window.addEventListener('pointerup', handlePointerUp, { capture: true });
    window.addEventListener('pointercancel', handlePointerUp, { capture: true });
    window.addEventListener('mouseup', handlePointerUp, { capture: true });
    window.addEventListener('touchend', handlePointerUp, { capture: true });
    window.addEventListener('blur', handlePointerUp);
  };

  // Canvas Keyboard Shortcuts Helpers: Copy, Cut, Paste, Select All
  const handleCopySelectedLayers = useCallback(() => {
    const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
      ? selectedLayerIdsRef.current
      : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []));
    if (activeIds.length === 0) return;

    clipboardLayersRef.current = {
      ids: [...activeIds],
      sourceIds: activeIds.map(id => {
        const dup = (duplicatedLayersRef.current || []).find(d => d.id === id);
        return dup ? dup.sourceId : id;
      }),
      transforms: activeIds.reduce((acc, id) => {
        acc[id] = layerTransformsRef.current[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
        return acc;
      }, {}),
      styles: activeIds.reduce((acc, id) => {
        if (layerStylesRef.current && layerStylesRef.current[id]) {
          acc[id] = { ...layerStylesRef.current[id] };
        }
        return acc;
      }, {}),
      pasteCount: 0
    };
  }, [selectedLayerIds, selectedLayerId]);

  const handleCutSelectedLayers = useCallback(() => {
    const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
      ? selectedLayerIdsRef.current
      : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []));
    if (activeIds.length === 0) return;

    // 1. Copy to clipboard
    handleCopySelectedLayers();

    // 2. Delete from canvas
    handleDeleteSelectedLayers();
  }, [handleCopySelectedLayers, handleDeleteSelectedLayers, selectedLayerIds, selectedLayerId]);

  const handlePasteLayers = useCallback(() => {
    if (!clipboardLayersRef.current || !clipboardLayersRef.current.ids || clipboardLayersRef.current.ids.length === 0) {
      return;
    }
    recordUndoRef.current?.();
    const clip = clipboardLayersRef.current;
    clip.pasteCount = (clip.pasteCount || 0) + 1;
    const offset = clip.pasteCount * 18;

    const newDuplicated = [];
    const newSelectedIds = [];
    const newTransforms = { ...layerTransformsRef.current };
    const newStyles = { ...layerStylesRef.current };

    clip.ids.forEach((id, idx) => {
      const dupId = `dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const sourceId = clip.sourceIds[idx] || id;
      newDuplicated.push({ id: dupId, sourceId });
      newSelectedIds.push(dupId);

      const origTrans = clip.transforms[id] || { x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 };
      newTransforms[dupId] = {
        ...origTrans,
        x: (origTrans.x || 0) + offset,
        y: (origTrans.y || 0) + offset
      };

      if (clip.styles[id]) {
        newStyles[dupId] = { ...clip.styles[id] };
      }
    });

    layerTransformsRef.current = newTransforms;
    layerStylesRef.current = newStyles;
    setDuplicatedLayers(prev => [...prev, ...newDuplicated]);
    setLayerTransforms(newTransforms);
    setLayerStyles(newStyles);
    setSelectedLayerIds(newSelectedIds);
    setSelectedLayerId(newSelectedIds[0]);

    setTimeout(() => {
      updateTransformBox(newSelectedIds);
    }, 40);
  }, [updateTransformBox]);

  // Keyboard Shortcuts: Delete/Backspace, Ctrl+D, Ctrl+E, Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      // Delete / Backspace: Delete selected element(s)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
          ? selectedLayerIdsRef.current
          : (selectedLayerIds && selectedLayerIds.length > 0
            ? selectedLayerIds
            : (selectedLayerId ? [selectedLayerId] : []));
        if (activeIds.length > 0) {
          e.preventDefault();
          handleDeleteSelectedLayers(activeIds);
        }
      }

      // Ctrl + D: Duplicate selected part
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        const activeIds = selectedLayerIds && selectedLayerIds.length > 0
          ? selectedLayerIds
          : (selectedLayerId ? [selectedLayerId] : []);
        if (activeIds.length > 0) {
          e.preventDefault();
          handleDuplicateSelectedLayers();
        }
      }

      // Ctrl + C: Copy selected element(s)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'c') {
        const activeIds = selectedLayerIds && selectedLayerIds.length > 0
          ? selectedLayerIds
          : (selectedLayerId ? [selectedLayerId] : []);
        if (activeIds.length > 0) {
          e.preventDefault();
          handleCopySelectedLayers();
        }
      }

      // Ctrl + X: Cut selected element(s)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'x') {
        const activeIds = selectedLayerIds && selectedLayerIds.length > 0
          ? selectedLayerIds
          : (selectedLayerId ? [selectedLayerId] : []);
        if (activeIds.length > 0) {
          e.preventDefault();
          handleCutSelectedLayers();
        }
      }

      // Ctrl + V: Paste copied/cut element(s)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteLayers();
      }

      // Ctrl + A: Select all elements on canvas
      if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSelectAllLayers();
      }

      // Ctrl + E: Center selected element(s) on canvas (or center canvas view if none selected)
      if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleCenterSelectedLayers();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedLayerIds,
    selectedLayerId,
    handleDeleteSelectedLayers,
    handleDuplicateSelectedLayers,
    handleCopySelectedLayers,
    handleCutSelectedLayers,
    handlePasteLayers,
    handleSelectAllLayers,
    handleCenterSelectedLayers
  ]);

  const handleColorChange = (originalColor, newColor) => {
    // Record undo state before color replacement
    recordUndo();
    const origKey = originalColor.toLowerCase();
    const newNorm = normalizeColor(newColor) || newColor;

    setAdjustments(prev => ({
      ...prev,
      colorReplacements: {
        ...prev.colorReplacements,
        [origKey]: newNorm
      }
    }));
  };

  const handleResetSingleColor = (originalColor) => {
    recordUndo();
    const origKey = originalColor.toLowerCase();

    setAdjustments(prev => {
      const updated = { ...prev.colorReplacements };
      delete updated[origKey];
      return {
        ...prev,
        colorReplacements: updated
      };
    });
  };

  // Helper to extract natural aspect ratio and dimensions from SVG viewBox or width/height
  const getSvgNaturalDimensions = (svgCode) => {
    let naturalWidth = 384;
    let naturalHeight = 384;
    let naturalRatio = 1;

    if (!svgCode || typeof svgCode !== 'string') {
      return { naturalWidth, naturalHeight, naturalRatio };
    }

    try {
      const vbMatch = svgCode.match(/viewBox=["']\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*["']/i);
      if (vbMatch) {
        const vbW = parseFloat(vbMatch[3]);
        const vbH = parseFloat(vbMatch[4]);
        if (vbW > 0 && vbH > 0) {
          naturalRatio = vbW / vbH;
          if (Math.abs(naturalRatio - 1) < 0.01) {
            naturalWidth = 384;
            naturalHeight = 384;
          } else if (naturalRatio > 1) {
            naturalWidth = 480;
            naturalHeight = Math.round(480 / naturalRatio);
          } else {
            naturalHeight = 480;
            naturalWidth = Math.round(480 * naturalRatio);
          }
        }
      } else {
        const wMatch = svgCode.match(/\bwidth=["']([0-9.]+)(?:px)?["']/i);
        const hMatch = svgCode.match(/\bheight=["']([0-9.]+)(?:px)?["']/i);
        if (wMatch && hMatch) {
          const w = parseFloat(wMatch[1]);
          const h = parseFloat(hMatch[1]);
          if (w > 0 && h > 0) {
            naturalRatio = w / h;
            if (Math.abs(naturalRatio - 1) < 0.01) {
              naturalWidth = 384;
              naturalHeight = 384;
            } else if (naturalRatio > 1) {
              naturalWidth = 480;
              naturalHeight = Math.round(480 / naturalRatio);
            } else {
              naturalHeight = 480;
              naturalWidth = Math.round(480 * naturalRatio);
            }
          }
        }
      }
    } catch (_) { }

    return { naturalWidth, naturalHeight, naturalRatio };
  };

  // Reset Everything back to original upload state
  const handleResetAll = () => {
    recordUndo();
    if (selectedAsset?.originalSvgCode) {
      setSelectedAsset(prev => ({
        ...prev,
        svgCode: prev.originalSvgCode
      }));
    }
    setAdjustments({
      ...DEFAULT_ADJUSTMENTS,
      colorReplacements: {}
    });
    setActiveStyleMode('original');
    setLayerTransforms({});
    setLayerStyles({});
    setLayerOrder(svgLayers.map(l => l.id));
    setSelectedLayerId(null);
    setSelectedLayerIds([]);
    setActiveSelectedColor(null);
    setTransformBox(null);
    const nat = getSvgNaturalDimensions(selectedAsset?.originalSvgCode || selectedAsset?.svgCode);
    setIconWidth(nat.naturalWidth);
    setIconHeight(nat.naturalHeight);
    setLockAspectRatio(true);
    setAspectRatio(nat.naturalRatio);
    setStrokeMultiplier(1);
    setStrokeColorMode('auto');
    setCustomStrokeColor('#38bdf8');
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setBgShapePadding(20);
    setBgShapeBorder(0);
    setBgShapeBorderColor('#38bdf8');
    setIsLayersListExpanded(false);
    setEffectCategory('All');
    targetZoomRef.current = 1;
    currentZoomRef.current = 1;
    targetPanRef.current = { x: 0, y: 0 };
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setZoomLevel(1);
    setCanvasPan({ x: 0, y: 0 });
    setExportFormat('png');
    setExportSize(1024);
    setIsTransparent(true);
    setMobileCanvasHeight(DEFAULT_MOBILE_CANVAS_HEIGHT);
    try { localStorage.removeItem('iconderry_mobile_canvas_height'); } catch { }
  };

  // Panel 1: Colors Reset
  const handleResetColorsPanel = () => {
    recordUndo();
    setAdjustments(prev => ({
      ...prev,
      customColor: '',
      colorReplacements: {}
    }));
    setActiveSelectedColor(null);
  };

  // Panel 2: Effects Reset
  const handleResetEffectsPanel = () => {
    recordUndo();
    const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
      ? selectedLayerIdsRef.current
      : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []));

    if (activeIds.length > 0) {
      // Reset only the selected part(s)
      setLayerStyles(prev => {
        const next = { ...prev };
        activeIds.forEach(id => {
          const cleanId = String(id).replace(/^pf_studio_/i, '');
          if (next[cleanId]) {
            const cur = { ...next[cleanId] };
            delete cur.styleMode;
            delete cur.glow;
            delete cur.blur;
            delete cur.brightness;
            delete cur.opacity;
            delete cur.customFilter;
            next[cleanId] = cur;
          }
        });
        return next;
      });
    } else {
      // Global reset for entire canvas
      setActiveStyleMode('original');
      setActiveFilterPreset('original');
      setLayerStyles(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          delete next[k].styleMode;
        });
        return next;
      });
      setAdjustments(prev => ({
        ...prev,
        hue: 0,
        saturation: 100,
        contrast: 100,
        brightness: 100,
        sepia: 0,
        invert: 0,
        opacity: 100,
        blur: 0,
        shadowColor: '#000000',
        shadowBlur: 0
      }));
    }
  };

  // Panel 3: Dimensions Reset
  const handleResetDimensionsPanel = () => {
    recordUndo();
    const nat = getSvgNaturalDimensions(selectedAsset?.originalSvgCode || selectedAsset?.svgCode);
    setIconWidth(nat.naturalWidth);
    setIconHeight(nat.naturalHeight);
    setLockAspectRatio(true);
    setAspectRatio(nat.naturalRatio);
    setStrokeMultiplier(1);
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setBgShapePadding(20);
    setBgShapeBorder(0);
    setBgShapeBorderColor('#38bdf8');
  };

  // Panel 4: Transform Reset (3D & 2D)
  const handleResetTransformPanel = () => {
    recordUndo();
    setAdjustments(prev => ({
      ...prev,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      rotation: 0,
      flipH: false,
      flipV: false,
      rotateX: 0,
      rotateY: 0,
      perspective: 1200,
      skewX: 0,
      skewY: 0,
      depth3D: 0,
      is3DFloating: false,
      animPreset: 'float',
      animSpeed: 2.2,
      animHeight: 16,
      animShadowSync: true
    }));
    setLayerTransforms({});
    setSelectedLayerId(null);
    setSelectedLayerIds([]);
    setActiveSelectedColor(null);
    setTransformBox(null);
  };

  // Panel 5: Export Reset
  const handleResetExportPanel = () => {
    setExportFormat('png');
    setExportSize(1024);
    setIsTransparent(true);
    setExportCustomFilename('');
    setExportAutoTagDimensions(true);
    setExportQuality(92);
    setExportBgType('solid');
    setExportBgSolidColor('#0b0f19');
    setExportBgGradient({ preset: 'cyber', from: '#060a12', to: '#1e293b', angle: 135 });
    setIsAdvancedExportOpen(false);
  };

  // Helper to snapshot current Studio state for Undo / Redo (deep cloned to prevent reference mutation)
  const getStudioSnapshot = () => ({
    adjustments: JSON.parse(JSON.stringify(adjustments)),
    layerTransforms: JSON.parse(JSON.stringify(layerTransforms)),
    layerStyles: JSON.parse(JSON.stringify(layerStyles)),
    layerOrder: [...layerOrder],
    deletedLayerIds: [...deletedLayerIds],
    duplicatedLayers: JSON.parse(JSON.stringify(duplicatedLayers)),
    layerGroups: JSON.parse(JSON.stringify(layerGroups)),
    customCanvasObjects: JSON.parse(JSON.stringify(customCanvasObjects)),
    selectedLayerId,
    selectedLayerIds: [...selectedLayerIds],
    activeStyleMode,
    iconWidth,
    iconHeight,
    strokeMultiplier,
    strokeColorMode,
    customStrokeColor,
    bgShape,
    bgShapeColor,
    bgShapePadding,
    bgShapeBorder,
    bgShapeBorderColor
  });
  getStudioSnapshotRef.current = getStudioSnapshot;

  const recordUndo = () => {
    const snap = getStudioSnapshot();
    setUndoStack(prev => [...prev.slice(-30), snap]);
    setRedoStack([]);
  };
  recordUndoRef.current = recordUndo;

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const currentSnap = getStudioSnapshot();
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentSnap]);

    if (previous.adjustments) setAdjustments(previous.adjustments);
    if (previous.layerTransforms) setLayerTransforms(previous.layerTransforms);
    if (previous.layerStyles) setLayerStyles(previous.layerStyles);
    if (previous.layerOrder) setLayerOrder(previous.layerOrder);
    if (previous.deletedLayerIds) setDeletedLayerIds(previous.deletedLayerIds);
    if (previous.duplicatedLayers) setDuplicatedLayers(previous.duplicatedLayers);
    if (previous.layerGroups) setLayerGroups(previous.layerGroups);
    if (previous.customCanvasObjects) setCustomCanvasObjects(previous.customCanvasObjects);
    if (previous.selectedLayerId !== undefined) setSelectedLayerId(previous.selectedLayerId);
    if (previous.selectedLayerIds) setSelectedLayerIds(previous.selectedLayerIds);
    if (previous.activeStyleMode) setActiveStyleMode(previous.activeStyleMode);
    if (previous.iconWidth) setIconWidth(previous.iconWidth);
    if (previous.iconHeight) setIconHeight(previous.iconHeight);
    if (previous.strokeMultiplier !== undefined) setStrokeMultiplier(previous.strokeMultiplier);
    if (previous.strokeColorMode) setStrokeColorMode(previous.strokeColorMode);
    if (previous.customStrokeColor) setCustomStrokeColor(previous.customStrokeColor);
    if (previous.bgShape) setBgShape(previous.bgShape);
    if (previous.bgShapeColor) setBgShapeColor(previous.bgShapeColor);
    if (previous.bgShapePadding !== undefined) setBgShapePadding(previous.bgShapePadding);
    if (previous.bgShapeBorder !== undefined) setBgShapeBorder(previous.bgShapeBorder);
    if (previous.bgShapeBorderColor) setBgShapeBorderColor(previous.bgShapeBorderColor);
  };
  handleUndoRef.current = handleUndo;

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const currentSnap = getStudioSnapshot();
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentSnap]);

    if (next.adjustments) setAdjustments(next.adjustments);
    if (next.layerTransforms) setLayerTransforms(next.layerTransforms);
    if (next.layerStyles) setLayerStyles(next.layerStyles);
    if (next.layerOrder) setLayerOrder(next.layerOrder);
    if (next.deletedLayerIds) setDeletedLayerIds(next.deletedLayerIds);
    if (next.duplicatedLayers) setDuplicatedLayers(next.duplicatedLayers);
    if (next.layerGroups) setLayerGroups(next.layerGroups);
    if (next.customCanvasObjects) setCustomCanvasObjects(next.customCanvasObjects);
    if (next.selectedLayerId !== undefined) setSelectedLayerId(next.selectedLayerId);
    if (next.selectedLayerIds) setSelectedLayerIds(next.selectedLayerIds);
    if (next.activeStyleMode) setActiveStyleMode(next.activeStyleMode);
    if (next.iconWidth) setIconWidth(next.iconWidth);
    if (next.iconHeight) setIconHeight(next.iconHeight);
    if (next.strokeMultiplier !== undefined) setStrokeMultiplier(next.strokeMultiplier);
    if (next.strokeColorMode) setStrokeColorMode(next.strokeColorMode);
    if (next.customStrokeColor) setCustomStrokeColor(next.customStrokeColor);
    if (next.bgShape) setBgShape(next.bgShape);
    if (next.bgShapeColor) setBgShapeColor(next.bgShapeColor);
    if (next.bgShapePadding !== undefined) setBgShapePadding(next.bgShapePadding);
    if (next.bgShapeBorder !== undefined) setBgShapeBorder(next.bgShapeBorder);
    if (next.bgShapeBorderColor) setBgShapeBorderColor(next.bgShapeBorderColor);
  };
  handleRedoRef.current = handleRedo;



  // Direct Click/Touch on Image SVG elements or HTML/CSS elements
  const handleCanvasElementClick = (e) => {
    if (justFinishedLayerDragRef.current) return;
    let target = e.target;
    if (!target || target.tagName.toLowerCase() === 'svg') {
      return;
    }

    const isSvg = target instanceof SVGElement;
    const isForeignHtml = target instanceof HTMLElement && (target.closest('foreignObject') || target.tagName.toLowerCase() === 'div');
    if (!isSvg && !isForeignHtml) {
      return;
    }

    if (isSystemWrapper(target)) {
      return;
    }

    const svgContainer = canvasSvgContainerRef.current;
    if (svgContainer) {
      const svgEl = svgContainer.querySelector('svg');
      if (svgEl) tagSvgElements(svgEl);
    }

    let shapeEl = target.closest('[data-layer-id]') || target.closest('path, rect, circle, ellipse, polygon, polyline, line, text, foreignObject div, foreignObject span, foreignObject section, foreignObject p, foreignObject button, foreignObject a') || target;
    if (isSystemWrapper(shapeEl)) return;

    const rawLayerId = (shapeEl && shapeEl.getAttribute('data-layer-id')) || target.getAttribute('data-layer-id') || target.closest('[data-layer-id]')?.getAttribute('data-layer-id');
    const layerId = rawLayerId ? rawLayerId.replace(/^pf_studio_/, '') : null;

    if (layerId) {
      const currentSelected = selectedLayerIdsRef.current || [];
      let newSelectedIds = [layerId];
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        newSelectedIds = currentSelected.includes(layerId)
          ? currentSelected.filter(id => id !== layerId)
          : [...currentSelected, layerId];
      }
      setSelectedLayerId(newSelectedIds[newSelectedIds.length - 1] || null);
      setSelectedLayerIds(newSelectedIds);
      selectedLayerIdRef.current = newSelectedIds[newSelectedIds.length - 1] || null;
      selectedLayerIdsRef.current = newSelectedIds;
      updateTransformBoxRef.current?.(newSelectedIds);
    }

    let foundRawColors = [];
    const fill = target.getAttribute('fill');
    const stroke = target.getAttribute('stroke');
    const stopColor = target.getAttribute('stop-color');

    // Check linear/radial gradient referenced in fill attribute
    if (fill) {
      const gradMatch = fill.match(/url\(\s*['"]?#([^'")]+)['"]?\s*\)/i);
      if (gradMatch) {
        const gradId = gradMatch[1];
        const svgRoot = target.ownerSVGElement || target.closest('svg') || document;
        const grad = svgRoot.querySelector(`#${CSS.escape(gradId)}`) || document.getElementById(gradId);
        if (grad) {
          const stops = grad.querySelectorAll('stop');
          stops.forEach(stop => {
            const sc = stop.getAttribute('stop-color') || stop.style.stopColor;
            if (sc) foundRawColors.push(sc);
          });
        }
      }
    }

    if (foundRawColors.length === 0) {
      if (fill && fill !== 'none' && fill !== 'transparent' && !fill.startsWith('url(')) {
        foundRawColors.push(fill);
      } else if (stroke && stroke !== 'none' && stroke !== 'transparent') {
        foundRawColors.push(stroke);
      } else if (stopColor) {
        foundRawColors.push(stopColor);
      }
    }

    // Check inline style
    if (foundRawColors.length === 0) {
      const style = target.getAttribute('style') || '';
      const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
      if (fillMatch) {
        const gradMatch = fillMatch[1].match(/url\(\s*['"]?#([^'")]+)['"]?\s*\)/i);
        if (gradMatch) {
          const gradId = gradMatch[1];
          const svgRoot = target.ownerSVGElement || target.closest('svg') || document;
          const grad = svgRoot.querySelector(`#${CSS.escape(gradId)}`) || document.getElementById(gradId);
          if (grad) {
            const stops = grad.querySelectorAll('stop');
            stops.forEach(s => {
              const sc = s.getAttribute('stop-color') || s.style.stopColor;
              if (sc) foundRawColors.push(sc);
            });
          }
        } else if (!fillMatch[1].startsWith('url(')) {
          foundRawColors.push(fillMatch[1]);
        }
      }
      const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i);
      if (strokeMatch) foundRawColors.push(strokeMatch[1]);
    }

    // Check computed style fallback (crucial for HTML/CSS elements)
    if (foundRawColors.length === 0 && typeof window !== 'undefined') {
      try {
        const comp = window.getComputedStyle(target);
        if (comp.fill && comp.fill !== 'none' && !comp.fill.startsWith('url(')) {
          foundRawColors.push(comp.fill);
        } else if (comp.stroke && comp.stroke !== 'none') {
          foundRawColors.push(comp.stroke);
        }
        if (comp.backgroundColor && comp.backgroundColor !== 'transparent' && comp.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          foundRawColors.push(comp.backgroundColor);
        }
        if (comp.borderColor && comp.borderColor !== 'transparent' && comp.borderColor !== 'rgba(0, 0, 0, 0)') {
          foundRawColors.push(comp.borderColor);
        }
        if (comp.color && comp.color !== 'transparent' && comp.color !== 'rgba(0, 0, 0, 0)') {
          foundRawColors.push(comp.color);
        }
        const bg = comp.background || comp.backgroundImage || '';
        const bgMatches = bg.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/g);
        if (bgMatches) {
          bgMatches.forEach(c => foundRawColors.push(c));
        }
      } catch (err) {
        console.warn('Computed style check failed:', err);
      }
    }

    for (const rawCol of foundRawColors) {
      const norm = normalizeColor(rawCol);
      if (norm) {
        // Find which original detectedColor this belongs to (original or replaced)
        const match = detectedColors.find(c => {
          const current = adjustments.colorReplacements[c.color.toLowerCase()] || c.color;
          return c.color.toLowerCase() === norm.toLowerCase() || current.toLowerCase() === norm.toLowerCase();
        });

        const targetOrigColor = match ? match.color : norm;
        setActiveSelectedColor(targetOrigColor);
        return;
      }
    }
  };

  useEffect(() => {
    if (elements && elements.length > 0) {
      saveElementsToDB(elements);
    }
  }, [elements]);

  const allAvailableCategories = useMemo(() => {
    const fromElements = elements.map(item => item.category).filter(Boolean);
    const combined = Array.from(new Set([...customCategories, ...fromElements]));
    return combined;
  }, [customCategories, elements]);

  // Dynamic Icon Packs collection (supports current Stickman and future packs automatically)
  const availablePacks = useMemo(() => {
    const fromElements = elements.map(item => item.pack).filter(Boolean);
    const defaultPacks = ['Stickman'];
    return Array.from(new Set([...defaultPacks, ...fromElements]));
  }, [elements]);

  const categories = useMemo(() => {
    const packSet = new Set(availablePacks.map(p => p.toLowerCase()));
    const regularCats = allAvailableCategories.filter(cat => !packSet.has(cat.toLowerCase()));
    return ['All', 'Favorites', ...regularCats];
  }, [allAvailableCategories, availablePacks]);

  const filteredElements = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    // 1. If searching, or if viewing Favorites, or if viewing a specific pack or specific category:
    if (selectedCategory !== 'All' || q) {
      let list = elements.filter(el => {
        const matchesSearch = !q ||
          el.title.toLowerCase().includes(q) ||
          el.category?.toLowerCase().includes(q) ||
          el.pack?.toLowerCase().includes(q) ||
          (el.tags && el.tags.toLowerCase().includes(q)) ||
          (el.assetType && el.assetType.toLowerCase().includes(q));
        const matchesCategory = selectedCategory === 'All'
          ? true
          : selectedCategory === 'Favorites'
            ? favorites.includes(el.id)
            : (el.category === selectedCategory || el.pack === selectedCategory);
        return matchesSearch && matchesCategory;
      });

      if (sortBy === 'popular') {
        list = [...list].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      } else if (sortBy === 'name') {
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      }
      return list;
    }

    // 2. Special 'All' category view without active search:
    // Separate non-pack elements and pack elements
    const packLowerMap = new Map();
    availablePacks.forEach(p => packLowerMap.set(p.toLowerCase(), p));

    const nonPackElements = [];
    const packElementsMap = {};
    availablePacks.forEach(p => { packElementsMap[p] = []; });

    elements.forEach(el => {
      const packKey = (el.pack && packLowerMap.get(el.pack.toLowerCase())) ||
                      (el.category && packLowerMap.get(el.category.toLowerCase()));
      if (packKey && packElementsMap[packKey]) {
        packElementsMap[packKey].push(el);
      } else {
        nonPackElements.push(el);
      }
    });

    let combined = [...nonPackElements];

    // For each pack, pick exactly 5 distinct sample items and 1 Highlighted Full Pack Card
    availablePacks.forEach((packName) => {
      const packItems = packElementsMap[packName] || [];
      if (packItems.length === 0) return;

      // Select 5 varied items from the pack
      const sampleCount = Math.min(5, packItems.length);
      const step = Math.max(1, Math.floor(packItems.length / sampleCount));
      const sampleItems = [];
      const usedIds = new Set();
      for (let i = 0; i < sampleCount; i++) {
        const idx = Math.min(packItems.length - 1, (i * step + 1) % packItems.length);
        const item = packItems[idx];
        if (item && !usedIds.has(item.id)) {
          sampleItems.push(item);
          usedIds.add(item.id);
        }
      }
      for (let i = 0; i < packItems.length && sampleItems.length < sampleCount; i++) {
        if (!usedIds.has(packItems[i].id)) {
          sampleItems.push(packItems[i]);
          usedIds.add(packItems[i].id);
        }
      }

      // Create the prominent Highlighted Pack Card
      const packCard = {
        id: `pack_showcase_${packName}`,
        isPackCard: true,
        packName: packName,
        title: `${packName} Pack`,
        totalCount: packItems.length,
        previewItems: packItems.slice(0, 4),
        category: packName,
        tags: `pack, ${packName}, curated, full pack, bundle`,
        downloads: packItems.reduce((acc, curr) => acc + (curr.downloads || 0), 0)
      };

      // Place the Highlighted Pack Card at index 6 (prominent 2nd row on desktop, 4th row on mobile)
      const packCardIndex = Math.min(combined.length, 6);
      combined.splice(packCardIndex, 0, packCard);

      // Distribute the 5 sample items randomly / evenly across the general feed
      sampleItems.forEach((item, sIdx) => {
        const insertPos = Math.min(combined.length, 3 + sIdx * 8);
        combined.splice(insertPos, 0, item);
      });
    });

    if (sortBy === 'popular') {
      combined = [...combined].sort((a, b) => {
        if (a.isPackCard) return -1;
        if (b.isPackCard) return 1;
        return (b.downloads || 0) - (a.downloads || 0);
      });
    } else if (sortBy === 'name') {
      combined = [...combined].sort((a, b) => {
        if (a.isPackCard) return -1;
        if (b.isPackCard) return 1;
        return a.title.localeCompare(b.title);
      });
    }

    return combined;
  }, [elements, searchTerm, selectedCategory, favorites, sortBy, availablePacks]);

  // Gallery Pagination: Load 50 images initially, load more on button click
  const [visibleCount, setVisibleCount] = useState(50);

  // Reset to first 50 whenever category, search term or sorting changes
  useEffect(() => {
    setVisibleCount(50);
  }, [selectedCategory, searchTerm, sortBy]);

  // Sliced list of elements currently rendered in the gallery grid
  const displayedElements = useMemo(() => {
    return filteredElements.slice(0, visibleCount);
  }, [filteredElements, visibleCount]);

  // Mobile Pull-to-Refresh: Pull down cards at the top to reload the page
  const [pullDistance, setPullDistance] = useState(0);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const pullTouchStartXRef = useRef(0);
  const pullTouchStartYRef = useRef(0);
  const canPullRefreshRef = useRef(false);
  const isPullingRef = useRef(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const handleTouchStart = (e) => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY <= 8 && !isPullRefreshing && !detailModalAsset) {
        pullTouchStartXRef.current = e.touches[0].clientX;
        pullTouchStartYRef.current = e.touches[0].clientY;
        canPullRefreshRef.current = true;
        isPullingRef.current = false;
      } else {
        canPullRefreshRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!canPullRefreshRef.current || isPullRefreshing) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      if (scrollY > 8) {
        canPullRefreshRef.current = false;
        isPullingRef.current = false;
        setPullDistance(0);
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.clientX - pullTouchStartXRef.current;
      const deltaY = touch.clientY - pullTouchStartYRef.current;

      // Ignore if user is swiping horizontally (like scrolling categories)
      if (Math.abs(deltaX) > Math.abs(deltaY) && !isPullingRef.current) {
        canPullRefreshRef.current = false;
        return;
      }

      if (deltaY > 10) {
        isPullingRef.current = true;
        const distance = Math.min((deltaY - 10) * 0.42, 60);
        setPullDistance(distance);
      } else if (deltaY <= 0) {
        setPullDistance(0);
        isPullingRef.current = false;
      }
    };

    const handleRefreshItemsOnly = async () => {
      setIsPullRefreshing(true);
      setPullDistance(46);
      isPullingRef.current = false;
      
      try {
        // 1. Reload items freshly from IndexedDB / INITIAL_ELEMENTS
        const cached = await loadElementsFromDB();
        const initialMap = new Map(INITIAL_ELEMENTS.map(el => [el.id, el]));
        if (Array.isArray(cached) && cached.length > 0) {
          const cachedIds = new Set(cached.map(c => c.id));
          const normalizedCached = cached.map(item => {
            const initialItem = initialMap.get(item.id);
            const sourceSvg = item.svgCode || item.originalSvgCode || (initialItem ? initialItem.svgCode : '');
            const clean = normalizeForeignObjectSvg(sourceSvg);
            return {
              ...(initialItem || {}),
              ...item,
              svgCode: clean,
              originalSvgCode: clean
            };
          });
          const newFromInitial = INITIAL_ELEMENTS
            .filter(item => !cachedIds.has(item.id))
            .map(el => ({ ...el, originalSvgCode: el.svgCode, downloads: el.downloads || 0 }));

          const merged = newFromInitial.length > 0 ? [...normalizedCached, ...newFromInitial] : normalizedCached;
          setElements(merged);
          await saveElementsToDB(merged);
        } else {
          const fresh = INITIAL_ELEMENTS.map(el => ({ ...el, originalSvgCode: el.svgCode, downloads: el.downloads || 0 }));
          setElements(fresh);
          await saveElementsToDB(fresh);
        }

        // 2. Brief skeleton shimmer on gallery items for tactile visual feedback without page reload
        setIsGalleryLoading(true);
        setTimeout(() => {
          setIsGalleryLoading(false);
        }, 320);

      } catch (err) {
        console.error('Error refreshing items:', err);
      } finally {
        setTimeout(() => {
          setIsPullRefreshing(false);
          setPullDistance(0);
          isPullingRef.current = false;
        }, 500);
      }
    };

    const handleTouchEnd = () => {
      if (!canPullRefreshRef.current || isPullRefreshing) return;
      canPullRefreshRef.current = false;
      if (isPullingRef.current && pullDistance >= 38) {
        handleRefreshItemsOnly();
      } else {
        setPullDistance(0);
        isPullingRef.current = false;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isPullRefreshing, detailModalAsset]);



  const handleOpenAsset = (item, initialTab = 'colors') => {
    const rawSvg = item.originalSvgCode || item.svgCode;
    const cleanSvg = normalizeForeignObjectSvg(rawSvg);
    if (assetCustomizationsMapRef.current) {
      delete assetCustomizationsMapRef.current[item.id];
    }
    setSelectedAsset({
      ...item,
      svgCode: cleanSvg,
      originalSvgCode: cleanSvg
    });
    setActiveStyleMode('original');
    setLayerTransforms({});
    setLayerStyles({});
    setDeletedLayerIds([]);
    setDuplicatedLayers([]);
    setLayerGroups({});
    setLayerOrder([]);
    setCustomCanvasObjects([]);
    setAdjustments({
      ...DEFAULT_ADJUSTMENTS,
      colorReplacements: {}
    });
    setSelectedLayerId(null);
    setSelectedLayerIds([]);
    setTransformBox(null);
    const nat = getSvgNaturalDimensions(cleanSvg);
    setIconWidth(nat.naturalWidth);
    setIconHeight(nat.naturalHeight);
    setLockAspectRatio(true);
    setAspectRatio(nat.naturalRatio);
    setStrokeMultiplier(1);
    setStrokeColorMode('auto');
    setCustomStrokeColor('#38bdf8');
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setBgShapePadding(20);
    setBgShapeBorder(0);
    setBgShapeBorderColor('#38bdf8');
    setActiveSelectedColor(null);
    setIsLayersListExpanded(false);
    setStudioTab(initialTab || 'colors');
    setIsStudioPanelOpen(true);
    targetZoomRef.current = 1;
    currentZoomRef.current = 1;
    targetPanRef.current = { x: 0, y: 0 };
    canvasPanRef.current = { x: 0, y: 0 };
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setZoomLevel(1);
    setCanvasPan({ x: 0, y: 0 });
    if (canvasViewportRef.current) {
      canvasViewportRef.current.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      canvasViewportRef.current.style.setProperty('--stage-zoom', '1');
      canvasViewportRef.current.style.setProperty('--inv-zoom', '1');
      canvasViewportRef.current.style.willChange = 'auto';
    }
    const badge = document.getElementById('live-zoom-badge');
    if (badge) badge.textContent = '100%';
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleCloseStudio = () => {
    prevAssetIdRef.current = null;
    if (assetCustomizationsMapRef.current) {
      assetCustomizationsMapRef.current = {};
    }
    setCustomCanvasObjects([]);
    setTransformBox(null);
    setSelectedLayerId(null);
    setSelectedLayerIds([]);
    setLayerTransforms({});
    setLayerStyles({});
    setDeletedLayerIds([]);
    setDuplicatedLayers([]);
    setLayerGroups({});
    setLayerOrder([]);
    setAdjustments({
      ...DEFAULT_ADJUSTMENTS,
      colorReplacements: {}
    });
    setActiveStyleMode('original');
    setSelectedAsset(null);
  };

  const handleOpenEmptyStudio = () => {
    setSelectedAsset({
      id: 'empty_studio_canvas',
      title: 'Blank Canvas',
      category: 'Studio',
      svgCode: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"></svg>',
      originalSvgCode: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"></svg>',
      isEmptyCanvas: true
    });
    setActiveStyleMode('original');
    setLayerTransforms({});
    setLayerStyles({});
    setDeletedLayerIds([]);
    setDuplicatedLayers([]);
    setLayerGroups({});
    setLayerOrder([]);
    setCustomCanvasObjects([]);
    setAdjustments({
      ...DEFAULT_ADJUSTMENTS,
      colorReplacements: {}
    });
    setSelectedLayerId(null);
    setSelectedLayerIds([]);
    setTransformBox(null);
    setIconWidth(512);
    setIconHeight(512);
    setLockAspectRatio(true);
    setAspectRatio(1);
    setStrokeMultiplier(1);
    setStrokeColorMode('auto');
    setCustomStrokeColor('#38bdf8');
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setActiveSelectedColor(null);
    setIsLayersListExpanded(false);
    setStudioTab('colors');
    setIsStudioPanelOpen(false);
    targetZoomRef.current = 1;
    currentZoomRef.current = 1;
    targetPanRef.current = { x: 0, y: 0 };
    canvasPanRef.current = { x: 0, y: 0 };
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setZoomLevel(1);
    setCanvasPan({ x: 0, y: 0 });
    if (canvasViewportRef.current) {
      canvasViewportRef.current.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      canvasViewportRef.current.style.setProperty('--stage-zoom', '1');
      canvasViewportRef.current.style.setProperty('--inv-zoom', '1');
      canvasViewportRef.current.style.willChange = 'auto';
    }
    const badge = document.getElementById('live-zoom-badge');
    if (badge) badge.textContent = '100%';
    setUndoStack([]);
    setRedoStack([]);
  };

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcut when user is focused inside text input or textarea
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.target && e.target.isContentEditable) return;

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (!isCmdOrCtrl) return;

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleUndoRef.current?.();
      } else if (
        e.key.toLowerCase() === 'y' ||
        (e.key.toLowerCase() === 'z' && e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        handleRedoRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleWidthChange = (val) => {
    const num = Math.max(16, Math.min(4096, Number(val) || 16));
    setIconWidth(num);
    if (lockAspectRatio) {
      setIconHeight(Math.max(16, Math.round(num / (aspectRatio || 1))));
    }
  };

  const handleHeightChange = (val) => {
    const num = Math.max(16, Math.min(4096, Number(val) || 16));
    setIconHeight(num);
    if (lockAspectRatio) {
      setIconWidth(Math.max(16, Math.round(num * (aspectRatio || 1))));
    }
  };

  const toggleAspectRatioLock = () => {
    if (!lockAspectRatio) {
      setAspectRatio((iconWidth / (iconHeight || 1)) || 1);
    }
    setLockAspectRatio(!lockAspectRatio);
  };

  const handleApplySizePreset = (preset) => {
    setIconWidth(preset.w);
    setIconHeight(preset.h);
    setAspectRatio(preset.w / preset.h);
  };

  const handleAddNewCategory = (catName, setAsCurrent = true, target = 'single') => {
    const trimmed = (catName || '').trim();
    if (!trimmed) return;
    if (!customCategories.includes(trimmed)) {
      setCustomCategories(prev => [...prev, trimmed]);
    }
    if (setAsCurrent) {
      if (target === 'bulk') {
        setBulkCategory(trimmed);
      } else {
        setCategory(trimmed);
      }
    }
    setIsAddingNewCat(false);
    setNewCatInput('');
  };

  const handleRenameCategory = async (oldName, newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed || trimmed === oldName) {
      setEditingCategory(null);
      return;
    }

    setCustomCategories(prev => prev.map(c => c === oldName ? trimmed : c));
    setElements(prev => prev.map(el => el.category === oldName ? { ...el, category: trimmed } : el));

    if (category === oldName) setCategory(trimmed);
    if (bulkCategory === oldName) setBulkCategory(trimmed);
    if (selectedCategory === oldName) setSelectedCategory(trimmed);

    if (supabase) {
      try {
        await supabase.from('icons').update({ category: trimmed }).eq('category', oldName);
      } catch (err) {
        console.error('Error updating category in Supabase:', err);
      }
    }

    setEditingCategory(null);
    setFormSuccess(`Category renamed to "${trimmed}" across all assets!`);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const handleDeleteCategory = async (catName) => {
    const count = elements.filter(el => el.category === catName).length;
    const confirmMsg = count > 0
      ? `Category "${catName}" has ${count} icons. Moving them to "General" category. Proceed?`
      : `Delete category "${catName}"?`;

    if (!window.confirm(confirmMsg)) return;

    setCustomCategories(prev => prev.filter(c => c !== catName));
    if (count > 0) {
      setElements(prev => prev.map(el => el.category === catName ? { ...el, category: 'General' } : el));
      if (supabase) {
        try {
          await supabase.from('icons').update({ category: 'General' }).eq('category', catName);
        } catch (err) {
          console.error('Error reassigning in Supabase:', err);
        }
      }
    }

    if (category === catName) setCategory('UI Icons');
    if (bulkCategory === catName) setBulkCategory('UI Icons');
    if (selectedCategory === catName) setSelectedCategory('All');

    setFormSuccess(`Category "${catName}" removed.`);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const detectSvgDetails = (code, filename = '') => {
    const lowerCode = (code || '').toLowerCase();
    const lowerName = (filename || '').toLowerCase();

    const isSilhouetteName = lowerName.includes('silhouette') || lowerName.includes('shadow') || lowerName.includes('stencil');
    const hasGradient = lowerCode.includes('<lineargradient') || lowerCode.includes('<radialgradient');
    const hasFilter = lowerCode.includes('<fegaussianblur') || lowerCode.includes('<fespecularlighting');

    if (isSilhouetteName || (!hasGradient && !hasFilter && (lowerCode.includes('fill="#000') || lowerCode.includes('fill="black"') || lowerCode.includes('fill="#11')))) {
      return { category: 'Silhouettes', assetType: 'silhouette', note: '✨ Silhouette shape detected' };
    }

    if (hasFilter || hasGradient) {
      return { category: '3D Elements', assetType: '3d', note: '✨ 3D / Gradient artwork detected' };
    }

    const hasStroke = /stroke="((?!none)[^"]+)"/i.test(code);
    const hasFill = /fill="((?!none)[^"]+)"/i.test(code);

    if (hasStroke && !hasFill) {
      return { category: 'UI Icons', assetType: 'linear', note: '✨ Linear outline icon detected' };
    }

    return { category: category || 'UI Icons', assetType: 'filled', note: '' };
  };

  // Normalizes SVG attributes: injects missing viewBox from width/height and ensures xmlns
  const normalizeSvgAttributes = (svgStr) => {
    if (!svgStr || typeof svgStr !== 'string') return svgStr;
    let res = svgStr.trim();

    // 1. Ensure xmlns exists
    if (!res.includes('xmlns=')) {
      res = res.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // 2. If no viewBox, construct viewBox from width and height
    const hasViewBox = /viewBox=["'][^"']+["']/i.test(res);
    if (!hasViewBox) {
      const widthMatch = res.match(/\bwidth=["']([0-9.]+)(?:px)?["']/i);
      const heightMatch = res.match(/\bheight=["']([0-9.]+)(?:px)?["']/i);
      if (widthMatch && heightMatch) {
        const w = parseFloat(widthMatch[1]);
        const h = parseFloat(heightMatch[1]);
        if (w > 0 && h > 0) {
          res = res.replace(/<svg\b/i, `<svg viewBox="0 0 ${w} ${h}"`);
        }
      }
    }

    return res;
  };

  // Smart SVG & HTML Extractor - handles SVG tags of any size, HTML snippets, and data URIs
  const extractSvgFromAnyContent = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    let str = raw.trim();

    // 1. Data URI detection: data:image/svg+xml;base64,... or data:image/svg+xml;utf8,...
    if (str.startsWith('data:image/svg+xml')) {
      try {
        if (str.includes(';base64,')) {
          const b64 = str.split(';base64,')[1];
          str = atob(b64).trim();
        } else if (str.includes(',')) {
          const urlEncoded = str.substring(str.indexOf(',') + 1);
          str = decodeURIComponent(urlEncoded).trim();
        }
      } catch (e) {
        console.warn('Failed to parse SVG data URI:', e);
      }
    }

    // 2. Direct string index search - 100% reliable for large files, no regex backtracking
    const lower = str.toLowerCase();
    const svgStart = lower.indexOf('<svg');
    if (svgStart !== -1) {
      const svgEnd = lower.lastIndexOf('</svg>');
      if (svgEnd !== -1 && svgEnd > svgStart) {
        return normalizeSvgAttributes(str.substring(svgStart, svgEnd + 6).trim());
      }
      // Check for self-closing <svg ... />
      const selfClose = lower.indexOf('/>', svgStart);
      if (selfClose !== -1) {
        return normalizeSvgAttributes(str.substring(svgStart, selfClose + 2).trim());
      }
    }

    // 3. Regex fallback
    const svgRegex = /<svg[\s\S]*?<\/svg>/i;
    const match = str.match(svgRegex);
    if (match) {
      return normalizeSvgAttributes(match[0].trim());
    }

    // 4. DOMParser check for nested <svg> inside HTML tags (e.g. <div>, <button>, <span>)
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(str, 'text/html');
      const svgElem = doc.querySelector('svg');
      if (svgElem) {
        const serializer = new XMLSerializer();
        return normalizeSvgAttributes(serializer.serializeToString(svgElem));
      }
    } catch (e) {
      console.warn('DOMParser SVG extraction failed:', e);
    }

    // 5. Smart CSS-to-SVG fallback: converts raw CSS rules, glassmorphism, or HTML snippets
    if (isCssOrHtmlContent(str)) {
      const converted = convertCssToSvg(str);
      if (converted && converted.success && converted.svgCode) {
        return normalizeSvgAttributes(converted.svgCode);
      }
    }

    return null;
  };


  const extractTitleFromContent = (rawText, extractedSvg = '') => {
    try {
      const combined = (extractedSvg || '') + ' ' + (rawText || '');
      // Check <title> tag inside svg or text
      const titleMatch = combined.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]?.trim()) {
        return titleMatch[1].trim();
      }
      // Check desc attribute (e.g. desc="Created with imagetracer.js")
      const descMatch = combined.match(/desc=["']Created with ([^"']+)["']/i);
      if (descMatch && descMatch[1]?.trim()) {
        return 'Vector Artwork';
      }
      // Check aria-label
      const ariaMatch = combined.match(/aria-label=["']([^"']+)["']/i);
      if (ariaMatch && ariaMatch[1]?.trim()) {
        return ariaMatch[1].trim();
      }
      // Check data-name
      const dataNameMatch = combined.match(/data-name=["']([^"']+)["']/i);
      if (dataNameMatch && dataNameMatch[1]?.trim()) {
        return dataNameMatch[1].trim();
      }
      // Check svg id (avoid generic ids like 'Layer_1' or 'svg')
      const idMatch = (extractedSvg || '').match(/<svg[^>]*id=["']([^"']+)["']/i);
      if (idMatch && idMatch[1]?.trim() && !/layer|svg|icon/i.test(idMatch[1])) {
        return idMatch[1].trim().replace(/[-_]/g, ' ');
      }
    } catch (e) { }
    return '';
  };

  const handleProcessPastedContent = (rawText, sourceName = '') => {
    if (!rawText || !rawText.trim()) return false;
    const cleanSvg = extractSvgFromAnyContent(rawText);
    if (!cleanSvg) {
      setFormError('No valid SVG was detected in the copied content. Copy SVG code, an SVG file, or HTML containing an <svg> tag.');
      setTimeout(() => setFormError(''), 5000);
      return false;
    }

    setSvgInput(cleanSvg);

    // Auto title
    let derivedTitle = extractTitleFromContent(rawText, cleanSvg);
    if (!derivedTitle && sourceName && sourceName !== 'clipboard-element' && sourceName !== 'pasted-element' && sourceName !== 'textarea-paste' && sourceName !== 'pasted-svg') {
      derivedTitle = sourceName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
    if (!derivedTitle) {
      const detect = detectSvgDetails(cleanSvg, '');
      const catBase = detect.category ? detect.category.replace(/s$/, '') : 'Vector';
      derivedTitle = `${catBase} Artwork ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (!title.trim() && derivedTitle) {
      setTitle(derivedTitle.charAt(0).toUpperCase() + derivedTitle.slice(1));
    }

    // Auto detect category, assetType, and note
    const detection = detectSvgDetails(cleanSvg, derivedTitle || sourceName || '');
    if (detection.category) {
      if (!customCategories.includes(detection.category)) {
        setCustomCategories(prev => [...prev, detection.category]);
      }
      setCategory(detection.category);
    }
    if (detection.assetType) {
      setAssetType(detection.assetType);
    }
    if (detection.note) {
      setDetectedShapeNotice(detection.note);
      setTimeout(() => setDetectedShapeNotice(''), 5000);
    }

    const isCss = isCssOrHtmlContent(rawText);
    setFormSuccess(isCss 
      ? '✨ Smart CSS-to-Element: Converted raw CSS glassmorphic style into SVG Element! Review & click Publish.'
      : '✨ Smart Paste: SVG extracted & loaded from clipboard! Review & click Publish.');
    setTimeout(() => setFormSuccess(''), 5000);
    return true;
  };

  const handleClipboardPasteClick = async () => {
    try {
      // 1. Try reading clipboard items (handles svg files, html, text)
      if (navigator.clipboard && navigator.clipboard.read) {
        try {
          const items = await navigator.clipboard.read();
          for (const item of items) {
            for (const type of item.types) {
              if (type === 'image/svg+xml' || type === 'text/html' || type === 'text/plain') {
                const blob = await item.getType(type);
                const text = await blob.text();
                if (text && extractSvgFromAnyContent(text)) {
                  handleProcessPastedContent(text, 'clipboard-element');
                  return;
                }
              }
            }
          }
        } catch (readErr) {
          console.warn('clipboard.read() notice, trying readText:', readErr);
        }
      }

      // 2. Fallback to readText
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const handled = handleProcessPastedContent(text, 'clipboard-element');
          if (handled) return;
        }
      }

      alert('Clipboard does not contain SVG or HTML with <svg>. You can also press Ctrl + V on your keyboard.');
    } catch (err) {
      console.warn('Clipboard read error:', err);
      alert('Please grant clipboard permission or simply press Ctrl + V on your keyboard to paste.');
    }
  };

  // Global paste listener when inside Admin panel
  useEffect(() => {
    if (activeTab !== 'admin') return;

    const handleWindowPaste = (e) => {
      // Don't intercept if user is typing inside text inputs (like Title, Tags, Search)
      const tagName = e.target?.tagName;
      if (tagName === 'INPUT' && e.target?.type === 'text') return;

      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) return;

      // 1. Check if files in clipboard (e.g. copied .svg file from explorer)
      if (clipboardData.files && clipboardData.files.length > 0) {
        const file = clipboardData.files[0];
        if (file && (file.type === 'image/svg+xml' || file.name.endsWith('.svg'))) {
          e.preventDefault();
          handleFileProcess(file);
          return;
        }
      }

      // 2. Check HTML or Plain Text
      const htmlData = clipboardData.getData('text/html');
      const textData = clipboardData.getData('text/plain');
      const content = htmlData || textData;

      if (content && extractSvgFromAnyContent(content)) {
        e.preventDefault();
        handleProcessPastedContent(content, 'pasted-element');
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => window.removeEventListener('paste', handleWindowPaste);
  }, [activeTab, customCategories, title]);

  const handleFileProcess = (file) => {
    if (!file || (!file.name?.endsWith('.svg') && file.type !== 'image/svg+xml')) {
      alert('Please upload a valid .svg file');
      return;
    }
    const derivedTitle = (file.name || 'svg-element').replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setTitle(derivedTitle.charAt(0).toUpperCase() + derivedTitle.slice(1));

    const reader = new FileReader();
    reader.onload = (e) => {
      const code = e.target.result;
      setSvgInput(code);

      const detection = detectSvgDetails(code, file.name);
      if (detection.category) {
        if (!customCategories.includes(detection.category)) {
          setCustomCategories(prev => [...prev, detection.category]);
        }
        setCategory(detection.category);
      }
      if (detection.assetType) {
        setAssetType(detection.assetType);
      }
      if (detection.note) {
        setDetectedShapeNotice(detection.note);
        setTimeout(() => setDetectedShapeNotice(''), 5000);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkFilesSelect = (fileList) => {
    const files = Array.from(fileList).filter(f => f.name.endsWith('.svg'));
    if (files.length === 0) {
      alert('Please select valid .svg files.');
      return;
    }

    const loadedFiles = [];
    let processed = 0;

    files.forEach((file) => {
      const derivedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const formattedTitle = derivedTitle.charAt(0).toUpperCase() + derivedTitle.slice(1);
      const reader = new FileReader();

      reader.onload = (e) => {
        const svgContent = e.target.result;
        loadedFiles.push({
          id: 'bulk-' + Math.random().toString(36).substr(2, 9),
          file,
          title: formattedTitle,
          svgCode: svgContent,
          status: 'pending'
        });

        processed++;
        if (processed === files.length) {
          setBulkFiles(prev => [...prev, ...loadedFiles]);
          setUploadMode('bulk');

          if (files.some(f => f.name.toLowerCase().includes('silhouette'))) {
            setBulkCategory('Silhouettes');
            setBulkAssetType('silhouette');
          }
        }
      };

      reader.readAsText(file);
    });
  };

  const handlePublishBulkSvgs = async () => {
    if (bulkFiles.length === 0 || isBulkPublishing) return;

    setIsBulkPublishing(true);
    setFormError('');
    setFormSuccess('');
    setBulkProgress({ current: 0, total: bulkFiles.length });

    const newElementsList = [];
    let successCount = 0;

    for (let i = 0; i < bulkFiles.length; i++) {
      const item = bulkFiles[i];
      const newElem = {
        id: 'elem-' + Date.now() + '-' + i,
        title: item.title.trim() || 'Vector Element ' + (i + 1),
        category: bulkCategory.trim() || 'General',
        tags: (bulkTags ? bulkTags + ', ' : '') + (bulkAssetType ? bulkAssetType + ', ' : '') + 'vector',
        svgCode: item.svgCode.trim(),
        originalSvgCode: item.svgCode.trim(),
        assetType: bulkAssetType,
        downloads: 0,
        isCloud: true
      };

      try {
        if (supabase) {
          const { error } = await supabase.from('icons').insert([{
            id: newElem.id,
            title: newElem.title,
            category: newElem.category,
            tags: newElem.tags,
            svg_code: newElem.svgCode,
            downloads: 0
          }]).select();

          if (error) {
            console.error('Bulk upload error on item:', item.title, error);
            item.status = 'error';
          } else {
            item.status = 'success';
            successCount++;
            newElementsList.push(newElem);
          }
        } else {
          item.status = 'success';
          successCount++;
          newElementsList.push(newElem);
        }
      } catch (err) {
        console.error('Error on bulk item:', err);
        item.status = 'error';
      }

      setBulkProgress({ current: i + 1, total: bulkFiles.length });
    }

    if (newElementsList.length > 0) {
      setElements(prev => [...newElementsList, ...prev]);
      if (!customCategories.includes(bulkCategory)) {
        setCustomCategories(prev => [...prev, bulkCategory]);
      }
    }

    setIsBulkPublishing(false);
    setFormSuccess(`Successfully uploaded ${successCount} of ${bulkFiles.length} icons to library!`);
    if (successCount === bulkFiles.length) {
      setTimeout(() => {
        setBulkFiles([]);
      }, 3000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length === 1 && uploadMode === 'single') {
        handleFileProcess(e.dataTransfer.files[0]);
      } else {
        handleBulkFilesSelect(e.dataTransfer.files);
      }
    }
  };

  // Load & sync icons from Supabase cloud database with Realtime updates
  useEffect(() => {
    if (!supabase) return;
    async function fetchSupabaseIcons() {
      try {
        const { data, error } = await supabase
          .from('icons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error);
          return;
        }

        if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            tags: item.tags || '',
            svgCode: item.svg_code,
            originalSvgCode: item.svg_code,
            downloads: item.downloads || 0,
            isCloud: true
          }));

          // Merge cloud icons with default INITIAL_ELEMENTS so all icons are available to everyone
          setElements(prev => {
            const cloudIds = new Set(mapped.map(m => m.id));
            const defaultNonDuplicates = INITIAL_ELEMENTS
              .filter(d => !cloudIds.has(d.id))
              .map(d => ({ ...d, originalSvgCode: d.svgCode }));
            const combined = [...mapped, ...defaultNonDuplicates];
            saveElementsToDB(combined);
            try {
              localStorage.setItem('iconderry_assets', JSON.stringify(combined.slice(0, 150)));
            } catch (_) {}
            return combined;
          });
        }
      } catch (err) {
        console.error('Supabase sync notice:', err);
      } finally {
        setIsGalleryLoading(false);
      }
    }

    fetchSupabaseIcons();

    // Supabase Realtime subscription so new uploads appear on all devices instantly
    try {
      const channel = supabase
        .channel('public:icons')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'icons' }, (payload) => {
          if (payload.new) {
            const newItem = {
              id: payload.new.id,
              title: payload.new.title,
              category: payload.new.category,
              tags: payload.new.tags || '',
              svgCode: payload.new.svg_code,
              originalSvgCode: payload.new.svg_code,
              downloads: payload.new.downloads || 0,
              isCloud: true
            };
            setElements(prev => [newItem, ...prev.filter(x => x.id !== newItem.id)]);
          }
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'icons' }, (payload) => {
          if (payload.new) {
            setElements(prev => prev.map(x => x.id === payload.new.id ? {
              ...x,
              title: payload.new.title,
              category: payload.new.category,
              tags: payload.new.tags || '',
              svgCode: payload.new.svg_code,
              originalSvgCode: payload.new.svg_code,
              downloads: payload.new.downloads || 0,
              isCloud: true
            } : x));
          }
        })
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'icons' }, (payload) => {
          if (payload.old?.id) {
            setElements(prev => prev.filter(x => x.id !== payload.old.id));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription not active:', e);
    }
  }, []);

  const handlePublishSvg = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const cleanSvg = extractSvgFromAnyContent(svgInput) || svgInput.trim();
    if (!cleanSvg) {
      setFormError('Please paste or provide valid SVG code before publishing.');
      setTimeout(() => setFormError(''), 5000);
      return;
    }

    // Auto-generate title if user didn't type one
    let finalTitle = title.trim();
    if (!finalTitle) {
      finalTitle = extractTitleFromContent(svgInput, cleanSvg);
    }
    if (!finalTitle) {
      const detection = detectSvgDetails(cleanSvg, '');
      const catBase = detection.category ? detection.category.replace(/s$/, '') : 'Vector';
      finalTitle = `${catBase} Artwork ${Date.now().toString().slice(-4)}`;
    }

    setIsPublishing(true);
    setFormSuccess('');
    setFormError('');

    const newElement = {
      id: 'elem-' + Date.now(),
      title: finalTitle,
      category: category.trim() || 'General',
      tags: (tags.trim() ? tags.trim() + ', ' : '') + (assetType ? assetType : ''),
      svgCode: cleanSvg,
      originalSvgCode: cleanSvg,
      assetType,
      downloads: 0,
      isCloud: true
    };

    try {
      if (supabase) {
        const { error } = await supabase.from('icons').insert([{
          id: newElement.id,
          title: newElement.title,
          category: newElement.category,
          tags: newElement.tags,
          svg_code: newElement.svgCode,
          downloads: 0
        }]).select();

        if (error) {
          console.error('Supabase insert error:', error);
          setFormError(`Upload failed: ${error.message || 'Error occurred'}`);
          setIsPublishing(false);
          return;
        }
      }

      setElements(prev => {
        const updated = [newElement, ...prev.filter(x => x.id !== newElement.id)];
        return updated;
      });

      if (!customCategories.includes(newElement.category)) {
        setCustomCategories(prev => [...prev, newElement.category]);
      }

      setTitle('');
      setSvgInput('');
      setTags('');
      setFormSuccess('Vector icon uploaded successfully to library!');
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      console.error('Publish error:', err);
      setFormError('Upload error: ' + (err.message || String(err)));
    } finally {
      setIsPublishing(false);
    }
  };

  // Admin Studio: Overwrite and Save element as permanent Gallery default for all users
  const handleSaveDefaultToGallery = async () => {
    if (!selectedAsset) return;
    const targetId = selectedAsset.id;
    const updatedSvg = currentPreviewSvg || selectedAsset.svgCode;
    if (!updatedSvg) return;

    setIsSavingGalleryDefault(true);
    setSaveDefaultSuccess('');
    try {
      // 1. Update or upsert into Supabase icons table
      if (supabase) {
        const { error } = await supabase
          .from('icons')
          .upsert([{
            id: targetId,
            title: selectedAsset.title,
            category: selectedAsset.category || 'General',
            tags: selectedAsset.tags || '',
            svg_code: updatedSvg,
            downloads: selectedAsset.downloads || 0
          }], { onConflict: 'id' });

        if (error) {
          console.warn('Supabase upsert note:', error);
          // If upsert fails for any reason, try direct update
          const { error: updateErr } = await supabase
            .from('icons')
            .update({ svg_code: updatedSvg })
            .eq('id', targetId);
          if (updateErr) {
            console.error('Supabase update error:', updateErr);
          }
        }
      }

      // 2. Update local elements in state and localStorage
      setElements(prev => {
        const next = prev.map(el => {
          if (el.id === targetId) {
            return {
              ...el,
              svgCode: updatedSvg,
              originalSvgCode: updatedSvg
            };
          }
          return el;
        });
        return next;
      });

      // 3. Reset customizations cache for this asset so new SVG is its pristine base
      if (assetCustomizationsMapRef.current) {
        delete assetCustomizationsMapRef.current[targetId];
      }

      // 4. Update selectedAsset in studio
      setSelectedAsset(prev => prev ? {
        ...prev,
        svgCode: updatedSvg,
        originalSvgCode: updatedSvg
      } : null);

      // 5. Reset transient adjustments/layers so they are clean on top of the new baseline SVG
      setActiveStyleMode('original');
      setLayerTransforms({});
      setLayerStyles({});
      setDeletedLayerIds([]);
      setDuplicatedLayers([]);
      setLayerGroups({});
      setLayerOrder([]);
      setCustomCanvasObjects([]);
      setAdjustments({
        ...DEFAULT_ADJUSTMENTS,
        colorReplacements: {}
      });

      setSaveDefaultSuccess('Saved as permanent gallery default! All users will now see this updated version.');
      setTimeout(() => setSaveDefaultSuccess(''), 6000);
    } catch (err) {
      console.error('Error saving default to gallery:', err);
      alert('Failed to save gallery default: ' + (err.message || String(err)));
    } finally {
      setIsSavingGalleryDefault(false);
    }
  };

  const handleSaveGalleryDeletions = async () => {
    if (pendingDeletedIds.length === 0) return;
    
    const count = pendingDeletedIds.length;
    const confirmMsg = count === 1
      ? 'Are you sure you want to permanently delete this element from Supabase and the Gallery?'
      : `Are you sure you want to permanently delete ${count} elements from Supabase and the Gallery?`;
    
    if (!window.confirm(confirmMsg)) return;

    setIsSavingGalleryDeletions(true);
    try {
      if (supabase) {
        const { error } = await supabase
          .from('icons')
          .delete()
          .in('id', pendingDeletedIds);
        if (error) {
          console.error('Supabase batch delete error:', error);
          throw error;
        }
      }

      // Update local state
      const toDeleteSet = new Set(pendingDeletedIds);
      setElements(prev => {
        const next = prev.filter(el => !toDeleteSet.has(el.id));
        try {
          localStorage.setItem('iconderry_assets', JSON.stringify(next));
        } catch (_) {}
        try {
          saveElementsToDB(next);
        } catch (_) {}
        return next;
      });

      // Clear from favorites if any
      setFavorites(prev => prev.filter(favId => !toDeleteSet.has(favId)));

      setPendingDeletedIds([]);
      setGalleryAdminToast(`Successfully deleted ${count} element${count > 1 ? 's' : ''} from Supabase & Gallery!`);
      setTimeout(() => setGalleryAdminToast(''), 5000);
    } catch (err) {
      console.error('Failed to delete from Supabase:', err);
      alert('Failed to delete from Supabase: ' + (err.message || String(err)));
    } finally {
      setIsSavingGalleryDeletions(false);
    }
  };

  // Admin Item Metadata Edit Handlers (Title, Description, Category, Tags, Pack)
  const handleOpenEditAssetModal = (item) => {
    if (!item) return;
    setEditingModalAsset(item);
    setEditAssetTitle(item.title || '');
    setEditAssetDescription(item.description || '');
    setEditAssetCategory(item.category || 'General');
    const tagsStr = Array.isArray(item.tags)
      ? item.tags.join(', ')
      : typeof item.tags === 'string'
      ? item.tags
      : '';
    setEditAssetTags(tagsStr);
    setEditAssetPack(item.pack || '');
    setEditAssetError('');
    setEditAssetSuccess('');
  };

  const handleCloseEditAssetModal = () => {
    if (isSavingAssetDetails) return;
    setEditingModalAsset(null);
    setEditAssetError('');
    setEditAssetSuccess('');
  };

  const handleSaveAssetDetails = async (e) => {
    if (e) e.preventDefault();
    if (!editingModalAsset) return;
    if (!editAssetTitle.trim()) {
      setEditAssetError('Title / Name is required!');
      return;
    }

    setIsSavingAssetDetails(true);
    setEditAssetError('');
    setEditAssetSuccess('');

    const targetId = editingModalAsset.id;
    const finalTitle = editAssetTitle.trim();
    const finalDescription = editAssetDescription.trim();
    const finalCategory = editAssetCategory.trim() || 'General';
    const finalTags = editAssetTags.trim();
    const finalPack = editAssetPack.trim();

    try {
      // 1. Update in-memory state & persistent IndexedDB
      setElements(prev => {
        const next = prev.map(el => {
          if (el.id === targetId) {
            return {
              ...el,
              title: finalTitle,
              description: finalDescription,
              category: finalCategory,
              tags: finalTags,
              pack: finalPack
            };
          }
          return el;
        });
        saveElementsToDB(next);
        return next;
      });

      // 2. Add to categories if custom category is new
      if (finalCategory && !categories.includes(finalCategory) && !customCategories.includes(finalCategory)) {
        setCustomCategories(prev => [...prev, finalCategory]);
      }

      // 3. Update selectedAsset in Studio if matching
      setSelectedAsset(prev => {
        if (prev && prev.id === targetId) {
          return {
            ...prev,
            title: finalTitle,
            description: finalDescription,
            category: finalCategory,
            tags: finalTags,
            pack: finalPack
          };
        }
        return prev;
      });

      // 4. Update detailModalAsset if matching
      setDetailModalAsset(prev => {
        if (prev && prev.id === targetId) {
          return {
            ...prev,
            title: finalTitle,
            description: finalDescription,
            category: finalCategory,
            tags: finalTags,
            pack: finalPack
          };
        }
        return prev;
      });

      // 5. Update in Supabase if connected
      if (supabase) {
        try {
          const { error } = await supabase
            .from('icons')
            .update({
              title: finalTitle,
              description: finalDescription,
              category: finalCategory,
              tags: finalTags
            })
            .eq('id', targetId);

          if (error) {
            console.warn('Supabase metadata update note:', error);
          }
        } catch (sErr) {
          console.error('Supabase update error:', sErr);
        }
      }

      setEditAssetSuccess('Item details saved successfully!');
      setGalleryAdminToast(`"${finalTitle}" updated in gallery & storage!`);
      setTimeout(() => setGalleryAdminToast(''), 4500);

      setTimeout(() => {
        setEditingModalAsset(null);
        setIsSavingAssetDetails(false);
      }, 600);

    } catch (err) {
      console.error('Failed to update asset details:', err);
      setEditAssetError('Failed to save details: ' + (err.message || String(err)));
      setIsSavingAssetDetails(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this element?')) {
      setElements(prev => prev.filter(el => el.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
      if (supabase) {
        try {
          const { error } = await supabase.from('icons').delete().eq('id', id);
          if (error) console.error('Supabase delete error:', error);
        } catch (err) {
          console.error('Supabase delete notice:', err);
        }
      }
    }
  };

  const handleCancelExport = () => {
    cancelExportRef.current = true;
    setDownloading(false);
    setExportProgress(null);
  };

  // Keep state ref fresh for Android hardware back button handler
  backStateRef.current = {
    exportProgress,
    isExportDropdownOpen,
    isAdvancedExportOpen,
    isAddElementModalOpen,
    isHelpModalOpen,
    isSettingsOpen,
    isAuthModalOpen,
    isUserMenuOpen,
    selectedAsset,
    detailModalAsset,
    activeTab
  };

  // Android Mobile Hardware & Gesture Back Button Handling (Capacitor & Web History)
  useEffect(() => {
    let backListener = null;

    const handleBackPress = () => {
      const s = backStateRef.current;

      // 1. Cancel active export progress modal
      if (s.exportProgress) {
        handleCancelExport();
        return true;
      }
      // 2. Close export dropdowns
      if (s.isExportDropdownOpen) {
        setIsExportDropdownOpen(false);
        return true;
      }
      if (s.isAdvancedExportOpen) {
        setIsAdvancedExportOpen(false);
        return true;
      }
      // 3. Close add element / help modal
      if (s.isAddElementModalOpen) {
        setIsAddElementModalOpen(false);
        return true;
      }
      if (s.isHelpModalOpen) {
        setIsHelpModalOpen(false);
        return true;
      }
      // 4. Close settings modal
      if (s.isSettingsOpen) {
        setIsSettingsOpen(false);
        return true;
      }
      // 5. Close auth modal & user menu
      if (s.isAuthModalOpen) {
        setIsAuthModalOpen(false);
        return true;
      }
      if (s.isUserMenuOpen) {
        setIsUserMenuOpen(false);
        return true;
      }
      // 6. User is inside Studio -> Close Studio and return to previous page/gallery!
      if (s.selectedAsset) {
        handleCloseStudio();
        return true;
      }
      // 7. Icon detail showcase modal is open -> Close detail modal
      if (s.detailModalAsset) {
        setDetailModalAsset(null);
        return true;
      }
      // 8. Other main tabs (blog, license, admin) -> Return to browse gallery
      if (s.activeTab && s.activeTab !== 'browse') {
        setActiveTab('browse');
        return true;
      }

      return false; // Nothing open, at root gallery
    };

    // Register Capacitor Native Android Back Button Listener
    try {
      CapApp.addListener('backButton', () => {
        const handled = handleBackPress();
        if (!handled) {
          const now = Date.now();
          if (now - lastBackPressRef.current < 2000) {
            CapApp.exitApp();
          } else {
            lastBackPressRef.current = now;
            setBackToast('Press back again to exit');
            setTimeout(() => setBackToast(''), 2000);
          }
        }
      }).then(listener => {
        backListener = listener;
      }).catch(err => {
        console.debug('Capacitor backButton not available:', err);
      });
    } catch (e) {
      console.debug('CapApp listener error:', e);
    }

    // Support browser popstate for mobile browser / PWA navigation
    const handlePopState = () => {
      handleBackPress();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (backListener && typeof backListener.remove === 'function') {
        backListener.remove();
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleDownload = async () => {
    if (!selectedAsset) return;
    cancelExportRef.current = false;
    setDownloading(true);
    setExportProgress({
      percent: 5,
      stage: 'Preparing Export Canvas...',
      details: `${exportFormat.toUpperCase()} · ${exportSize >= 1024 ? `${exportSize / 1024}K Ultra-HD` : `${exportSize}px`}`
    });
    try {
      // Auto-fit bounds calculation:
      // If layers are moved, rotated, scaled, duplicated, or have effects (glow/blur), or autoFitToElements is ON,
      // calculate autoFitViewBox encompassing all elements + glow + blur + generous padding ("thodi door").
      let autoFitViewBox = null;
      const hasMovedLayers = Object.values(layerTransforms || {}).some(t => {
        if (!t) return false;
        const hasX = typeof t.x === 'number' && Math.abs(t.x) > 0.5;
        const hasY = typeof t.y === 'number' && Math.abs(t.y) > 0.5;
        const hasRot = (typeof t.rotate === 'number' && Math.abs(t.rotate) > 0.5) ||
          (typeof t.rotation === 'number' && Math.abs(t.rotation) > 0.5);
        const hasScaleX = typeof t.scaleX === 'number' && Math.abs(t.scaleX - 1) > 0.01;
        const hasScaleY = typeof t.scaleY === 'number' && Math.abs(t.scaleY - 1) > 0.01;
        const hasScale = typeof t.scale === 'number' && Math.abs(t.scale - 1) > 0.01;
        return hasX || hasY || hasRot || hasScaleX || hasScaleY || hasScale;
      });
      const hasDuplicatedLayers = (duplicatedLayers || []).length > 0;
      const hasLayerEffects = Object.values(layerStyles || {}).some(s => {
        if (!s) return false;
        const hasGlow = Boolean(s.glow && s.glow.enabled && (s.glow.radius || 12) > 0);
        const hasBlur = Boolean(s.blur && Number(s.blur) > 0);
        return hasGlow || hasBlur;
      });
      const hasGlobalEffects = Boolean(
        (adjustments?.blur && Number(adjustments.blur) > 0) ||
        (adjustments?.shadowBlur && Number(adjustments.shadowBlur) > 0)
      );

      const isIco = exportFormat === 'ico';
      const shouldAutoFit = Boolean(
        isIco || // For ICO desktop/app icons, always auto-fit artwork so it fills the icon boundary full-size!
        autoFitToElements ||
        hasMovedLayers ||
        hasDuplicatedLayers ||
        hasLayerEffects ||
        hasGlobalEffects
      );

      if (shouldAutoFit && canvasSvgContainerRef.current) {
        autoFitViewBox = calculateArtworkBounds(
          canvasSvgContainerRef.current,
          isIco ? 0.03 : 0.08,
          deletedLayerIds,
          isIco || autoFitFrameMode === 'square',
          layerStyles,
          adjustments
        );
      }

      // Calculate true export resolution respecting artwork aspect ratio
      let finalWidth = exportSize;
      let finalHeight = exportSize;
      if (exportFormat === 'ico') {
        // ICO icons must strictly maintain a 1:1 square aspect ratio
        finalWidth = exportSize;
        finalHeight = exportSize;
      } else if (autoFitViewBox && autoFitViewBox.width > 0 && autoFitViewBox.height > 0) {
        if (autoFitFrameMode === 'square') {
          finalWidth = exportSize;
          finalHeight = exportSize;
        } else if (autoFitViewBox.width >= autoFitViewBox.height) {
          finalWidth = exportSize;
          finalHeight = Math.max(32, Math.round(exportSize * (autoFitViewBox.height / autoFitViewBox.width)));
        } else {
          finalHeight = exportSize;
          finalWidth = Math.max(32, Math.round(exportSize * (autoFitViewBox.width / autoFitViewBox.height)));
        }
      } else if (iconWidth && iconHeight && iconWidth > 0 && iconHeight > 0) {
        if (iconWidth >= iconHeight) {
          finalWidth = exportSize;
          finalHeight = Math.round(exportSize * (iconHeight / iconWidth));
        } else {
          finalHeight = exportSize;
          finalWidth = Math.round(exportSize * (iconWidth / iconHeight));
        }
      }

      await downloadAsset({
        svgCode: currentPreviewSvg || selectedAsset.svgCode,
        filename: exportCustomFilename.trim() || selectedAsset.title,
        customFilename: exportCustomFilename.trim(),
        autoTagDimensions: exportAutoTagDimensions,
        format: exportFormat,
        size: exportSize,
        width: finalWidth,
        height: finalHeight,
        isTransparent,
        quality: exportQuality / 100,
        customBg: {
          type: exportBgType,
          solidColor: exportBgSolidColor,
          gradient: exportBgGradient
        },
        onProgress: (p) => setExportProgress(p),
        shouldCancel: () => cancelExportRef.current,
        adjustments: {
          ...adjustments,
          layerTransforms,
          layerOrder,
          layerStyles,
          deletedLayerIds,
          duplicatedLayers,
          autoFitToElements: Boolean(autoFitViewBox) || autoFitToElements,
          autoFitViewBox,
          activeStyleMode,
          strokeMultiplier,
          strokeColorMode,
          customStrokeColor,
          bgShape,
          bgShapeColor,
          bgShapePadding,
          bgShapeBorder,
          bgShapeBorderColor
        }
      });

      setElements(prev => prev.map(item =>
        item.id === selectedAsset.id ? { ...item, downloads: (item.downloads || 0) + 1 } : item
      ));
    } catch (err) {
      if (err.message === 'EXPORT_CANCELLED') return;
      alert('Download error: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setExportProgress(null);
      }, 700);
    }
  };

  const handleExportAnimatedGif = async () => {
    if (!selectedAsset || downloading) return;
    cancelExportRef.current = false;
    setDownloading(true);
    const targetSize = exportSize || 512;
    setExportProgress({
      percent: 5,
      stage: 'Starting GIF Animation Engine...',
      details: `GIF · ${targetSize >= 1024 ? `${targetSize / 1024}K` : `${targetSize}px`} · 3D Loop`
    });
    try {
      let autoFitViewBox = null;
      const hasMovedLayers = Object.values(layerTransforms || {}).some(t => {
        if (!t) return false;
        const hasX = typeof t.x === 'number' && Math.abs(t.x) > 0.5;
        const hasY = typeof t.y === 'number' && Math.abs(t.y) > 0.5;
        const hasRot = (typeof t.rotate === 'number' && Math.abs(t.rotate) > 0.5) ||
          (typeof t.rotation === 'number' && Math.abs(t.rotation) > 0.5);
        const hasScaleX = typeof t.scaleX === 'number' && Math.abs(t.scaleX - 1) > 0.01;
        const hasScaleY = typeof t.scaleY === 'number' && Math.abs(t.scaleY - 1) > 0.01;
        const hasScale = typeof t.scale === 'number' && Math.abs(t.scale - 1) > 0.01;
        return hasX || hasY || hasRot || hasScaleX || hasScaleY || hasScale;
      });
      const hasDuplicatedLayers = (duplicatedLayers || []).length > 0;
      const hasLayerEffects = Object.values(layerStyles || {}).some(s => {
        if (!s) return false;
        const hasGlow = Boolean(s.glow && s.glow.enabled && (s.glow.radius || 12) > 0);
        const hasBlur = Boolean(s.blur && Number(s.blur) > 0);
        return hasGlow || hasBlur;
      });
      const hasGlobalEffects = Boolean(
        (adjustments?.blur && Number(adjustments.blur) > 0) ||
        (adjustments?.shadowBlur && Number(adjustments.shadowBlur) > 0)
      );

      const shouldAutoFit = Boolean(
        autoFitToElements ||
        hasMovedLayers ||
        hasDuplicatedLayers ||
        hasLayerEffects ||
        hasGlobalEffects
      );

      if (shouldAutoFit && canvasSvgContainerRef.current) {
        autoFitViewBox = calculateArtworkBounds(
          canvasSvgContainerRef.current,
          0.08,
          deletedLayerIds,
          autoFitFrameMode === 'square',
          layerStyles,
          adjustments
        );
      }

      let finalWidth = targetSize;
      let finalHeight = targetSize;
      if (autoFitViewBox && autoFitViewBox.width > 0 && autoFitViewBox.height > 0) {
        if (autoFitFrameMode === 'square') {
          finalWidth = targetSize;
          finalHeight = targetSize;
        } else if (autoFitViewBox.width >= autoFitViewBox.height) {
          finalWidth = targetSize;
          finalHeight = Math.max(32, Math.round(targetSize * (autoFitViewBox.height / autoFitViewBox.width)));
        } else {
          finalHeight = targetSize;
          finalWidth = Math.max(32, Math.round(targetSize * (autoFitViewBox.width / autoFitViewBox.height)));
        }
      } else if (iconWidth && iconHeight) {
        if (iconWidth >= iconHeight) {
          finalWidth = targetSize;
          finalHeight = Math.round(targetSize * (iconHeight / iconWidth));
        } else {
          finalHeight = targetSize;
          finalWidth = Math.round(targetSize * (iconWidth / iconHeight));
        }
      }

      await downloadAsset({
        svgCode: currentPreviewSvg || selectedAsset.svgCode,
        filename: selectedAsset.title,
        format: 'gif',
        size: targetSize,
        width: finalWidth,
        height: finalHeight,
        isTransparent,
        onProgress: (p) => setExportProgress(p),
        shouldCancel: () => cancelExportRef.current,
        adjustments: {
          ...adjustments,
          layerTransforms,
          layerOrder,
          layerStyles,
          deletedLayerIds,
          duplicatedLayers,
          autoFitToElements: Boolean(autoFitViewBox) || autoFitToElements,
          autoFitViewBox,
          activeStyleMode,
          strokeMultiplier,
          strokeColorMode,
          customStrokeColor,
          bgShape,
          bgShapeColor,
          bgShapePadding,
          bgShapeBorder,
          bgShapeBorderColor
        }
      });

      setElements(prev => prev.map(item =>
        item.id === selectedAsset.id ? { ...item, downloads: (item.downloads || 0) + 1 } : item
      ));
    } catch (err) {
      if (err.message === 'EXPORT_CANCELLED') return;
      alert('GIF export error: ' + err.message);
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setExportProgress(null);
      }, 700);
    }
  };

  const applyPreset = (preset) => {
    recordUndo();
    setActiveFilterPreset(preset.id || preset.name);
    if (preset.adjustments) {
      setAdjustments(prev => {
        const { shadowBlur, shadowColor, ...cleanAdj } = preset.adjustments;
        return {
          ...prev,
          ...cleanAdj,
          shadowBlur: prev.shadowBlur || 0,
          shadowColor: prev.shadowColor || '#38bdf8'
        };
      });
    } else {
      setAdjustments(prev => ({
        ...prev,
        hue: preset.hue,
        saturation: preset.sat,
        contrast: preset.con,
        sepia: preset.sepia,
        invert: preset.inv,
        shadowBlur: prev.shadowBlur || 0,
        shadowColor: prev.shadowColor || '#38bdf8'
      }));
    }
  };

  const handleSelectStyleLook = (preset) => {
    recordUndo();
    const activeIds = (selectedLayerIdsRef.current && selectedLayerIdsRef.current.length > 0)
      ? selectedLayerIdsRef.current
      : (selectedLayerIds && selectedLayerIds.length > 0 ? selectedLayerIds : (selectedLayerId ? [selectedLayerId] : []));

    if (activeIds.length > 0) {
      // Apply style ONLY to selected part(s)!
      setLayerStyles(prev => {
        const next = { ...prev };
        activeIds.forEach(id => {
          const cleanId = String(id).replace(/^pf_studio_/i, '');
          if (preset.id === 'original') {
            const cur = { ...(next[cleanId] || {}) };
            delete cur.styleMode;
            delete cur.glow;
            next[cleanId] = cur;
          } else {
            next[cleanId] = {
              ...(next[cleanId] || {}),
              styleMode: preset.id,
              glow: next[cleanId]?.glow,
              brightness: preset.adjustments?.brightness !== undefined ? preset.adjustments.brightness : next[cleanId]?.brightness,
              opacity: preset.adjustments?.opacity !== undefined ? preset.adjustments.opacity : next[cleanId]?.opacity
            };
          }
        });
        return next;
      });
    } else {
      // No layer selected: Apply globally to entire artwork
      setActiveStyleMode(preset.id || 'original');
      if (preset.adjustments) {
        setAdjustments(prev => {
          const { shadowBlur, shadowColor, ...cleanAdj } = preset.adjustments;
          return {
            ...prev,
            ...cleanAdj,
            shadowBlur: prev.shadowBlur || 0,
            shadowColor: prev.shadowColor || '#38bdf8',
            colorReplacements: preset.id === 'original' ? {} : prev.colorReplacements
          };
        });
      }
    }
  };

  const getComputedFilterStyle = () => {
    const rules = [];

    if (adjustments.hue && adjustments.hue !== 0) {
      rules.push(`hue-rotate(${adjustments.hue}deg)`);
    }
    if (adjustments.brightness !== undefined && adjustments.brightness !== 100) {
      rules.push(`brightness(${adjustments.brightness}%)`);
    }
    if (adjustments.saturation !== undefined && adjustments.saturation !== 100) {
      rules.push(`saturate(${adjustments.saturation}%)`);
    }
    if (adjustments.contrast !== undefined && adjustments.contrast !== 100) {
      rules.push(`contrast(${adjustments.contrast}%)`);
    }
    if (adjustments.sepia && adjustments.sepia !== 0) {
      rules.push(`sepia(${adjustments.sepia}%)`);
    }
    if (adjustments.invert && adjustments.invert !== 0) {
      rules.push(`invert(${adjustments.invert}%)`);
    }
    if (adjustments.opacity !== undefined && adjustments.opacity !== 100) {
      rules.push(`opacity(${adjustments.opacity}%)`);
    }
    if (adjustments.blur && adjustments.blur > 0) {
      rules.push(`blur(${adjustments.blur}px)`);
    }
    if (adjustments.shadowBlur && adjustments.shadowBlur > 0) {
      rules.push(`drop-shadow(0px 0px ${adjustments.shadowBlur}px ${adjustments.shadowColor || '#38bdf8'})`);
    }

    if ((adjustments.depth3D || 0) > 0) {
      const d = adjustments.depth3D;
      const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
      const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
      const offX = Math.round(-Math.sin(radY) * d * 1.5);
      const offY = Math.round(Math.sin(radX) * d * 1.5 + (d * 0.8));
      const sColor = adjustments.depth3DColor || 'rgba(0,0,0,0.55)';
      rules.push(`drop-shadow(${offX}px ${offY}px ${Math.round(d * 0.6)}px ${sColor})`);
    }

    if ((adjustments.extrusionDepth || 0) > 0) {
      const extDepth = Math.min(30, Math.round(adjustments.extrusionDepth));
      const extColor = adjustments.extrusionColor || 'rgba(0,0,0,0.65)';
      const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
      const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
      let dirX = -Math.sin(radY) * 1.2 || 0.7;
      let dirY = Math.sin(radX) * 1.2 || 0.7;
      const len = Math.hypot(dirX, dirY) || 1;
      const normX = dirX / len;
      const normY = dirY / len;
      const ex = (normX * extDepth).toFixed(1);
      const ey = (normY * extDepth).toFixed(1);
      rules.push(`drop-shadow(${ex}px ${ey}px 1px ${extColor})`);
    }

    return rules.length > 0 ? rules.join(' ') : 'none';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white w-full max-w-full overflow-x-clip ${appTheme === 'dark' ? 'bg-[#121316] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
      {/* Top Bar */}
      <header className={`app-header-main border-b sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 backdrop-blur transition-colors w-full max-w-full overflow-hidden ${appTheme === 'dark' ? 'border-[#1f2128] bg-[#121316]/95' : 'border-slate-200 bg-white/90 shadow-sm'
        }`}>
        <div className="max-w-[1780px] w-full mx-auto flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              onClick={() => setActiveTab('browse')}
              className="cursor-pointer relative group flex-shrink-0"
              title="Iconderry Home"
            >
              <img
                src="/app-icon.png"
                alt="Iconderry Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover shadow-lg shadow-purple-600/30 border border-white/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-purple-500/50"
              />
            </div>
            <div>
              <h1 className={`text-base sm:text-lg font-bold tracking-wide flex items-center gap-1.5 sm:gap-2 ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Iconderry
              </h1>
              <p className={`hidden md:block text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Advanced Visual Grading &bull; 8K Multi-Format Engine</p>
            </div>
          </div>

          {/* Right Header Navigation & Settings Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Dark / Light Mode Toggle Button */}
            <button
              onClick={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              title={appTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center ${appTheme === 'dark'
                ? 'bg-[#18191f] border-[#22242c] text-cyan-400 hover:text-white hover:border-[#38bdf8]/40'
                : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 hover:border-slate-300 shadow-sm'
                }`}
            >
              {appTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Tab Toggle */}
            {/* Tab Toggle (Desktop only: on mobile, handled by Native Bottom Nav) */}
            <div className={`hidden md:flex gap-1 p-0.5 sm:p-1 rounded-xl border ${appTheme === 'dark' ? 'bg-[#18191f] border-[#22242c]' : 'bg-slate-100 border-slate-200'
              }`}>
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'browse'
                  ? 'bg-blue-600 text-white shadow-md'
                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> <span>Gallery</span>
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition relative ${activeTab === 'blog'
                  ? 'bg-blue-600 text-white shadow-md'
                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Blog</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </button>
              <button
                onClick={() => setActiveTab('license')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${activeTab === 'license'
                  ? 'bg-blue-600 text-white shadow-md'
                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> <span>License</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/35 border border-blue-400/40 transition-all cursor-pointer active:scale-95"
                title="Upload elements to Iconderry"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>UPLOAD</span>
              </button>
            </div>

            {/* Settings Panel Button (Full Page View) */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : appTheme === 'dark'
                    ? 'bg-[#18191f] border-[#22242c] text-slate-300 hover:text-white hover:border-[#38bdf8]/40'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
              title="Open Settings"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Settings</span>
            </button>


            {/* Supabase User Authentication Button / Profile Menu */}
            {!authUser ? (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25 border-blue-400/30"
                title="Sign In or Register"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    appTheme === 'dark'
                      ? 'bg-[#18191f] border-[#2b2d37] hover:border-cyan-500/50 text-white'
                      : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-[11px] font-black uppercase shadow-sm">
                    {(authUser.user_metadata?.full_name || authUser.email || 'U')[0]}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline">
                    {authUser.user_metadata?.full_name || authUser.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsUserMenuOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150 ${
                      appTheme === 'dark'
                        ? 'bg-[#18191f] border-[#2b2d37] text-slate-200 shadow-black/80'
                        : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
                    }`}>
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                        <p className="text-xs font-bold truncate text-white">
                          {authUser.user_metadata?.full_name || 'Iconderry Creator'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {authUser.email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('Favorites');
                          setActiveTab('browse');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer text-left"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
                        <span>My Cloud Favorites</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-blue-500/10 hover:text-blue-400 transition cursor-pointer text-left"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                        <span>Upload New Element</span>
                      </button>

                      <div className="my-1 border-t border-slate-800/60" />

                      <button
                        type="button"
                        onClick={async () => {
                          if (supabase) await supabase.auth.signOut();
                          setAuthUser(null);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/15 transition cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>


      {/* Main Page Area */}
      <main className="flex-1 p-2.5 sm:p-6 lg:px-8 max-w-[1780px] w-full max-w-full mx-auto pb-24 md:pb-8 min-w-0 overflow-x-clip">
        {activeTab === 'admin' ? (
          /* Admin Management Panel */
          <div className={`max-w-4xl mx-auto border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl transition ${appTheme === 'dark' ? 'bg-[#18191f] border-[#22242c] text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}>
            {/* Top Header - Back Button when managing categories */}
            {adminSection === 'categories' && (
              <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#22242c]">
                <button
                  type="button"
                  onClick={() => setAdminSection('upload')}
                  className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Upload</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400">Categories Manager (Unlocked)</span>
                </div>
              </div>
            )}

            {/* Notification Messages */}
            {formSuccess && (
              <div className="mb-5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2.5 font-medium text-xs sm:text-sm animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-5 p-3 sm:p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2.5 font-medium text-xs sm:text-sm animate-fadeIn">
                <X className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {detectedShapeNotice && (
              <div className="mb-5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-2.5 text-xs font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>{detectedShapeNotice}</span>
              </div>
            )}

            {adminSection === 'upload' ? (
              <div>
                {/* Upload Mode Switcher: Single vs Bulk */}
                <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">Upload Icon</h2>
                    <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {uploadMode === 'single'
                        ? 'Add a single vector icon with live preview'
                        : 'Upload multiple SVG files at once'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-900/40 border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setUploadMode('single')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                        uploadMode === 'single' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Single Icon
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('bulk')}
                      className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        uploadMode === 'bulk' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Bulk Upload</span>
                      {bulkFiles.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-cyan-300 font-bold">
                          {bulkFiles.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {uploadMode === 'single' ? (
                  /* Single Upload Form */
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {/* Drag & Drop File */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                          isDragging
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : appTheme === 'dark'
                              ? 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept=".svg"
                          onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                          className="hidden"
                        />
                        <div className={`p-2.5 rounded-2xl ${appTheme === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className={`text-xs sm:text-sm font-bold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                          Choose <span className="text-cyan-400">.SVG</span> file or drag here
                        </p>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Tap to select from device
                        </p>
                      </div>

                      {/* Smart Paste from Clipboard */}
                      <div
                        onClick={handleClipboardPasteClick}
                        className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                          appTheme === 'dark'
                            ? 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/40 text-slate-300'
                            : 'border-slate-200 hover:border-indigo-300 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-2.5 rounded-2xl ${appTheme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                          <ClipboardPaste className="w-5 h-5" />
                        </div>
                        <p className="text-xs sm:text-sm font-bold">
                          Paste from Clipboard
                        </p>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Paste copied SVG code
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handlePublishSvg} className="space-y-4">
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Icon Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Star, Shopping Cart, User Profile"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-cyan-400 transition border ${
                            appTheme === 'dark'
                              ? 'bg-[#0b0f19] border-slate-800 text-slate-100 placeholder-slate-500'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      {/* Category Picker */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className={`block text-xs font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                          >
                            <FolderPlus className="w-3.5 h-3.5" />
                            <span>{isAddingNewCat ? 'Close' : '+ New Category'}</span>
                          </button>
                        </div>

                        {/* Inline Create Category Form */}
                        {isAddingNewCat && (
                          <div className="mb-3 p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="New category name..."
                              value={newCatInput}
                              onChange={(e) => setNewCatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddNewCategory(newCatInput, true, 'single');
                                }
                              }}
                              className={`flex-1 rounded-lg px-3 py-1.5 text-xs focus:outline-none border ${appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-700 text-white' : 'bg-white border-slate-300'
                                }`}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddNewCategory(newCatInput, true, 'single')}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => { setIsAddingNewCat(false); setNewCatInput(''); }}
                              className="px-2 py-1.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Clickable Category Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {allAvailableCategories.map((catName) => {
                            const isSelected = category === catName;
                            return (
                              <button
                                key={catName}
                                type="button"
                                onClick={() => setCategory(catName)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold'
                                    : appTheme === 'dark'
                                      ? 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <span>{catName}</span>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Asset Style / Classification */}
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Style
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'silhouette', label: 'Silhouette' },
                            { id: 'linear', label: 'Outline' },
                            { id: 'filled', label: 'Filled' },
                            { id: '3d', label: '3D Style' },
                          ].map((item) => {
                            const isSelected = assetType === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setAssetType(item.id)}
                                className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition cursor-pointer active:scale-95 ${
                                  isSelected
                                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-sm'
                                    : appTheme === 'dark'
                                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Tags (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. interface, modern, logo"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className={`w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-cyan-400 transition border ${
                            appTheme === 'dark'
                              ? 'bg-[#0b0f19] border-slate-800 text-slate-100 placeholder-slate-500'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      {/* Raw SVG Code */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                          <label className={`block text-xs font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            SVG Code
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const sampleCss = `.glass-card {\n  background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%);\n  backdrop-filter: blur(24px) saturate(190%);\n  border: 1px solid rgba(255, 255, 255, 0.25);\n  border-top: 1.5px solid rgba(255, 255, 255, 0.7);\n  box-shadow: inset 0 1px 1px rgba(255,255,255,0.6), 0 20px 40px -15px rgba(0,0,0,0.5);\n  border-radius: 22px;\n}`;
                                const converted = convertCssToSvg(sampleCss);
                                if (converted.success) {
                                  setSvgInput(converted.svgCode);
                                  setTitle('Frosted Glass Card');
                                  setCategory('Productivity Glass');
                                  setTags('css-art, glassmorphism, frosted, acrylic');
                                  setFormSuccess('✨ Loaded Glass CSS sample into SVG!');
                                  setTimeout(() => setFormSuccess(''), 3000);
                                }
                              }}
                              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
                              title="Load a sample CSS glass snippet"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Sample Glass</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleClipboardPasteClick}
                              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer"
                              title="Paste from clipboard"
                            >
                              <ClipboardPaste className="w-3.5 h-3.5" />
                              <span>Paste</span>
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' ...>"
                          value={svgInput}
                          onChange={(e) => {
                            const val = e.target.value;
                            const extracted = extractSvgFromAnyContent(val);
                            if (extracted) {
                              setSvgInput(extracted);
                              if (!title.trim()) {
                                let derived = extractTitleFromContent(val, extracted);
                                if (!derived) {
                                  const detect = detectSvgDetails(extracted, '');
                                  const catBase = detect.category ? detect.category.replace(/s$/, '') : 'Vector';
                                  derived = `${catBase} Icon`;
                                }
                                setTitle(derived);
                              }
                              const detection = detectSvgDetails(extracted, title || '');
                              if (detection.category) {
                                if (!customCategories.includes(detection.category)) {
                                  setCustomCategories(prev => [...prev, detection.category]);
                                }
                                setCategory(detection.category);
                              }
                              if (detection.assetType) {
                                setAssetType(detection.assetType);
                              }
                            } else {
                              setSvgInput(val);
                            }
                          }}
                          onPaste={(e) => {
                            const clipboardData = e.clipboardData || window.clipboardData;
                            const pasted = clipboardData?.getData('text/plain') || clipboardData?.getData('text/html');
                            if (pasted) {
                              const extracted = extractSvgFromAnyContent(pasted);
                              if (extracted) {
                                e.preventDefault();
                                handleProcessPastedContent(pasted, 'textarea-paste');
                              }
                            }
                          }}
                          className={`w-full font-mono text-xs rounded-xl p-3 sm:p-3.5 focus:outline-none focus:border-cyan-400 transition border ${
                            appTheme === 'dark'
                              ? 'bg-[#0b0f19] border-slate-800 text-slate-100 placeholder-slate-600'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>

                      {svgInput.trim() && (
                        <div className={`p-3 sm:p-4 rounded-xl border flex items-center gap-4 ${
                          appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center p-2 border flex-shrink-0 overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain ${
                            appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-inner'
                          }`}
                            dangerouslySetInnerHTML={{ __html: extractSvgFromAnyContent(svgInput) || svgInput }} />
                          <div className="text-xs">
                            <p className={`font-bold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Live Preview</p>
                            <p className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                              {category} &bull; <span className="text-cyan-400 font-semibold">{assetType}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isPublishing}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        {isPublishing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Icon</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Bulk Upload Mode */
                  <div className="space-y-5">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => bulkFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${isDragging
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : appTheme === 'dark'
                            ? 'border-slate-700 hover:border-slate-600 bg-[#0b0f19]/50'
                            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
                        }`}
                    >
                      <input
                        type="file"
                        ref={bulkFileInputRef}
                        accept=".svg"
                        multiple
                        onChange={(e) => e.target.files?.length && handleBulkFilesSelect(e.target.files)}
                        className="hidden"
                      />
                      <div className={`p-3 rounded-full ${appTheme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-slate-200 text-cyan-600'}`}>
                        <FileUp className="w-6 h-6" />
                      </div>
                      <p className={`text-sm font-semibold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        Choose or drag & drop <span className="text-cyan-400">multiple .svg files</span>
                      </p>
                      <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        Upload 10, 20, or 50 icons/silhouettes in a single click!
                      </p>
                    </div>

                    {/* Bulk Common Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Bulk Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                            className="text-[11px] text-cyan-400 hover:underline"
                          >
                            + New Category
                          </button>
                        </div>

                        {isAddingNewCat && (
                          <div className="mb-2 flex gap-1.5">
                            <input
                              type="text"
                              placeholder="New category..."
                              value={newCatInput}
                              onChange={(e) => setNewCatInput(e.target.value)}
                              className="flex-1 rounded-lg px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddNewCategory(newCatInput, true, 'bulk')}
                              className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
                            >
                              Add
                            </button>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {allAvailableCategories.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setBulkCategory(c)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${bulkCategory === c
                                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                                }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Bulk Tags
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. silhouette, icons, pack1"
                            value={bulkTags}
                            onChange={(e) => setBulkTags(e.target.value)}
                            className="w-full rounded-xl px-3 py-2 text-xs bg-[#0b0f19] border border-slate-700 text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Asset Style
                          </label>
                          <div className="flex gap-1.5">
                            {['silhouette', 'linear', 'filled', '3d'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setBulkAssetType(type)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border transition ${bulkAssetType === type
                                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                                    : 'bg-slate-900 border-slate-700 text-slate-400'
                                  }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Files List */}
                    {bulkFiles.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-300">
                            Selected Files ({bulkFiles.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setBulkFiles([])}
                            className="text-xs text-rose-400 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                          {bulkFiles.map((item, idx) => (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-center p-1 flex-shrink-0"
                                dangerouslySetInnerHTML={{ __html: item.svgCode }} />
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...bulkFiles];
                                  updated[idx].title = e.target.value;
                                  setBulkFiles(updated);
                                }}
                                className="flex-1 bg-transparent border-b border-slate-700 focus:border-cyan-400 px-1 py-0.5 text-xs text-slate-200 outline-none"
                              />
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {item.status === 'success' && (
                                  <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Uploaded
                                  </span>
                                )}
                                {item.status === 'error' && (
                                  <span className="text-rose-400 text-[10px] font-semibold">Failed</span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setBulkFiles(bulkFiles.filter(f => f.id !== item.id))}
                                  className="text-slate-500 hover:text-rose-400 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bulk Upload Progress */}
                        {isBulkPublishing && (
                          <div className="mt-4 p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-cyan-300">
                              <span>Uploading...</span>
                              <span>{bulkProgress.current} / {bulkProgress.total}</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-cyan-400 h-full transition-all duration-200"
                                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={handlePublishBulkSvgs}
                          disabled={isBulkPublishing}
                          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          {isBulkPublishing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Uploading {bulkProgress.current} / {bulkProgress.total}...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-4 h-4" />
                              <span>Upload All {bulkFiles.length} Icons</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Category Manager Section */
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">Category Manager</h2>
                  <p className={`text-xs sm:text-sm ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Create, rename, or organize categories. Categories automatically update in the Home Gallery filter bar.
                  </p>
                </div>

                {/* Add New Category Form */}
                <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Create New Category
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Silhouettes, Animal Shapes, Weapons, Cyberpunk, 3D Assets..."
                      value={newCategoryManagerInput}
                      onChange={(e) => setNewCategoryManagerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newCategoryManagerInput.trim()) {
                            handleAddNewCategory(newCategoryManagerInput, false);
                            setNewCategoryManagerInput('');
                          }
                        }
                      }}
                      className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm border focus:outline-none focus:border-cyan-400 transition ${appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-700 text-white' : 'bg-white border-slate-300'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryManagerInput.trim()) {
                          handleAddNewCategory(newCategoryManagerInput, false);
                          setNewCategoryManagerInput('');
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </div>
                </div>

                {/* Search Categories */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Filter categories list..."
                    value={categorySearchTerm}
                    onChange={(e) => setCategorySearchTerm(e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition ${appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300'
                      }`}
                  />
                </div>

                {/* Categories Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {allAvailableCategories
                    .filter(c => c.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                    .map((catName) => {
                      const count = elements.filter(el => el.category === catName).length;
                      const isEditing = editingCategory?.oldName === catName;

                      return (
                        <div
                          key={catName}
                          className={`p-3.5 rounded-2xl border transition flex flex-col justify-between gap-3 ${appTheme === 'dark' ? 'bg-[#0b0f19]/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                autoFocus
                                value={editingCategory.newName}
                                onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleRenameCategory(catName, editingCategory.newName);
                                  }
                                }}
                                className="w-full rounded-lg px-2.5 py-1.5 text-xs bg-slate-900 border border-cyan-400 text-white outline-none font-semibold"
                              />
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRenameCategory(catName, editingCategory.newName)}
                                  className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 font-bold text-[11px]"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCategory(null)}
                                  className="px-2 py-1 text-slate-400 text-[11px] hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0">
                                  <Folder className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-bold truncate text-slate-200">
                                    {catName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium">
                                    {count} {count === 1 ? 'element' : 'elements'}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  title="Rename category"
                                  onClick={() => setEditingCategory({ oldName: catName, newName: catName })}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Delete category"
                                  onClick={() => handleDeleteCategory(catName)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* PROTECTED MASTER ADMIN PANEL AT THE BOTTOM */}
            <div className={`mt-10 pt-8 border-t transition-all ${
              appTheme === 'dark' ? 'border-[#22242c]' : 'border-slate-200'
            }`}>
              {!isAdminPanelUnlocked ? (
                /* LOCKED STATE */
                <div className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all ${
                  appTheme === 'dark' 
                    ? 'bg-[#121316]/95 border-[#22242c] shadow-2xl' 
                    : 'bg-slate-50 border-slate-200 shadow-md'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-700/20">
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 sm:p-3 rounded-2xl ${
                        appTheme === 'dark' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold">Admin Panel</h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                            Password Protected
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Master password enter karein categories aur edit defaults controls unlock karne ke liye
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleUnlockAdminPanel} className="space-y-3.5 max-w-md">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 ${
                        appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Admin Master Password
                      </label>
                      <div className="relative">
                        <input
                          type={showAdminPassword ? "text" : "password"}
                          value={adminPasswordInput}
                          onChange={(e) => {
                            setAdminPasswordInput(e.target.value);
                            if (adminPasswordError) setAdminPasswordError('');
                          }}
                          placeholder="Enter admin password..."
                          className={`w-full px-4 py-2.5 pr-11 rounded-xl text-xs sm:text-sm border outline-none transition ${
                            appTheme === 'dark'
                              ? 'bg-[#18191f] border-[#2b2d37] text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/50'
                          } ${adminPasswordError ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminPassword(!showAdminPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1 cursor-pointer"
                          title={showAdminPassword ? "Hide password" : "Show password"}
                        >
                          {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {adminPasswordError && (
                        <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5 font-medium animate-fadeIn">
                          <span>{adminPasswordError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Unlock Admin Panel</span>
                    </button>
                  </form>
                </div>
              ) : (
                /* UNLOCKED STATE */
                <div className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all ${
                  appTheme === 'dark' 
                    ? 'bg-gradient-to-b from-[#18152e] to-[#121316] border-purple-500/30 shadow-2xl' 
                    : 'bg-purple-50/60 border-purple-200 shadow-md'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 sm:p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/35 shadow-inner">
                        <Unlock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold">Admin Panel</h3>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Unlocked
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Admin controls unlocked. Categories aur defaults edit options active hain.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLockAdminPanel}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
                      title="Lock Admin Panel"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock Panel</span>
                    </button>
                  </div>

                  {/* UNLOCKED ADMIN ACTIONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* ACTION 1: Edit Gallery Defaults */}
                    <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition ${
                      appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#2b2d37]' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            <Palette className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold">Edit Gallery Defaults</h4>
                        </div>
                        <p className={`text-xs mb-4 leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Gallery ke kisi bhi icon ko live edit karke permanently default library me update karein.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsGalleryAdminMode(true);
                          setActiveTab('browse');
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Palette className="w-4 h-4" />
                        <span>Open Gallery Defaults Editor</span>
                      </button>
                    </div>

                    {/* ACTION 2: Manage Categories */}
                    <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition ${
                      appTheme === 'dark' ? 'bg-[#18191f]/90 border-[#2b2d37]' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                              <Folder className="w-4 h-4" />
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold">Manage Categories</h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                            {allAvailableCategories.length} Categories
                          </span>
                        </div>
                        <p className={`text-xs mb-4 leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Custom categories add, rename ya delete karein jisse gallery filter dynamically update ho sake.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminSection(adminSection === 'categories' ? 'upload' : 'categories');
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 ${
                          adminSection === 'categories'
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        <Folder className="w-4 h-4" />
                        <span>{adminSection === 'categories' ? 'Close Categories' : 'Open Categories Manager'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'blog' ? (
          <BlogView
            appTheme={appTheme}
            onOpenStudio={() => setActiveTab('browse')}
          />
        ) : activeTab === 'license' ? (
          <LicenseView
            appTheme={appTheme}
            onOpenStudio={() => setActiveTab('browse')}
          />
        ) : activeTab === 'settings' ? (
          <SettingsView
            appTheme={appTheme}
            setAppTheme={setAppTheme}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            exportSize={exportSize}
            setExportSize={setExportSize}
            elements={elements}
            setElements={setElements}
            onBack={() => setActiveTab('browse')}
            onOpenLicense={() => setActiveTab('license')}
            onOpenStudio={() => {
              handleOpenEmptyStudio();
            }}
          />
        ) : (
          /* Browse Gallery with Left Sidebar Categories/Filters */
          <>
            {isGalleryAdminMode && (
              <div className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/85 via-indigo-950/80 to-slate-900 border-2 border-purple-500/40 shadow-xl flex items-center justify-between flex-wrap gap-4 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <Palette className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">Gallery Admin Edit Mode</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500 text-white shadow-sm">Active</span>
                      {pendingDeletedIds.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-md animate-pulse flex items-center gap-1">
                          <Trash2 className="w-3 h-3" />
                          <span>{pendingDeletedIds.length} marked to delete</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-purple-200/90 mt-0.5">
                      Cards ke top-right me <strong className="text-purple-300">Pencil (Edit)</strong> dabakar Name, Title, Description, Category aur Tags badlein. <strong className="text-rose-400">Trash</strong> dabakar delete mark karein.
                    </p>
                    {galleryAdminToast && (
                      <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5 animate-fadeIn">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{galleryAdminToast}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Save Changes Button (Deletes marked items from local state & cloud) */}
                  <button
                    type="button"
                    onClick={handleSaveGalleryDeletions}
                    disabled={pendingDeletedIds.length === 0 || isSavingGalleryDeletions}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                      pendingDeletedIds.length > 0
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-400/50 cursor-pointer active:scale-95'
                        : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                    }`}
                    title={pendingDeletedIds.length > 0 ? "Save and permanently delete marked items" : "Mark cards using the trash icon to delete"}
                  >
                    {isSavingGalleryDeletions ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes {pendingDeletedIds.length > 0 ? `(${pendingDeletedIds.length})` : ''}</span>
                      </>
                    )}
                  </button>

                  {/* Undo Selection button */}
                  {pendingDeletedIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPendingDeletedIds([])}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                    >
                      Undo Selection
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeletedIds([]);
                      setActiveTab('admin');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                  >
                    Back to Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeletedIds([]);
                      setIsGalleryAdminMode(false);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    Exit Edit Mode
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row items-start justify-center gap-5 lg:gap-6 w-full max-w-full mx-auto min-w-0">
            {/* Left Sidebar: Filters & Categories (Desktop sticky sidebar follows scroll alongside gallery items) */}
            <aside 
              className="hidden md:block w-full md:w-56 lg:w-60 flex-shrink-0 md:sticky md:top-[84px] md:self-start z-20 overscroll-contain"
              onWheel={(e) => {
                if (filtersScrollRef.current) {
                  const el = filtersScrollRef.current;
                  const canScrollUp = el.scrollTop > 0;
                  const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
                  if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
                    el.scrollTop += e.deltaY;
                    e.stopPropagation();
                  }
                }
              }}
            >
              <div className={`rounded-2xl border p-3.5 sm:p-4 transition shadow-sm ${
                appTheme === 'dark'
                  ? 'bg-[#18191f] border-[#22242c] text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}>
                {/* Sidebar Header with Mobile Accordion Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      appTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Filters
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Categories ({categories.length})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {selectedCategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('All')}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg transition-colors ${
                          appTheme === 'dark'
                            ? 'text-cyan-400 hover:bg-cyan-500/10'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        Reset
                      </button>
                    )}
                    {/* Mobile Expand / Collapse Button */}
                    <button
                      type="button"
                      onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                      className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-500/10"
                      aria-label="Toggle categories"
                    >
                      {mobileFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Vertical Category Items (Supports mouse drag-to-scroll & isolated wheel scroll) */}
                <div 
                  ref={filtersScrollRef}
                  onMouseDown={handleFiltersMouseDown}
                  onMouseMove={handleFiltersMouseMove}
                  onMouseUp={handleFiltersMouseUp}
                  onMouseLeave={handleFiltersMouseUp}
                  onWheel={(e) => {
                    const el = e.currentTarget;
                    const canScrollUp = el.scrollTop > 0;
                    const canScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
                    if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
                      e.stopPropagation();
                    }
                  }}
                  className={`${mobileFilterOpen ? 'flex' : 'hidden'} md:flex flex-col gap-1.5 mt-3 max-h-[60vh] md:max-h-[calc(100vh-190px)] overflow-y-auto overscroll-contain pr-1 scrollbar-thin cursor-grab active:cursor-grabbing select-none`}
                >
                  {categories.map((cat) => {
                    const isFavCat = cat === 'Favorites';
                    const isSelected = selectedCategory === cat;
                    const count = cat === 'All'
                      ? elements.length
                      : isFavCat
                        ? favorites.length
                        : elements.filter(e => e.category === cat).length;

                    // Choose an appropriate icon for each category
                    const renderCatIcon = () => {
                      if (isFavCat) return <Heart className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />;
                      if (cat === 'All') return <LayoutGrid className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'UI Icons') return <Box className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'Brand Logos') return <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'Silhouettes') return <Compass className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'Badges & Stickers' || cat === 'Badges') return <Shield className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === '3D Elements') return <Move3d className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'Productivity Glass') return <Layers className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />;
                      if (cat === 'Social Glass') return <MessageSquarePlus className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" />;
                      if (cat === 'Illustrations') return <Palette className="w-3.5 h-3.5 flex-shrink-0" />;
                      if (cat === 'Awards') return <Zap className="w-3.5 h-3.5 flex-shrink-0" />;
                      return <Tag className="w-3.5 h-3.5 flex-shrink-0" />;
                    };

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          if (hasDraggedFiltersRef.current) return;
                          setSelectedCategory(cat);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors duration-150 group text-left ${
                          isSelected
                            ? isFavCat
                              ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                              : 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : appTheme === 'dark'
                              ? 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/80'
                              : 'text-slate-700 border-transparent hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >

                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`${
                            isSelected
                              ? 'text-white'
                              : isFavCat
                                ? 'text-rose-400'
                                : appTheme === 'dark' ? 'text-slate-400 group-hover:text-cyan-400' : 'text-slate-500 group-hover:text-blue-600'
                          } transition-colors`}>
                            {renderCatIcon()}
                          </span>
                          <span className="truncate">{cat}</span>
                        </div>

                        <span className={`text-[10px] sm:text-[11px] min-w-[22px] text-center px-1.5 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 tabular-nums transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isFavCat
                              ? 'bg-rose-500/15 text-rose-400'
                              : appTheme === 'dark'
                                ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  {/* Dedicated Icon Packs Section */}
                  <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center justify-between px-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-purple-400" />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Packs ({availablePacks.length})
                        </h4>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                        Curated
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {availablePacks.map((packName) => {
                        const isSelected = selectedCategory === packName;
                        const count = elements.filter(e => e.pack === packName || e.category === packName).length;
                        return (
                          <button
                            key={packName}
                            type="button"
                            onClick={() => {
                              if (hasDraggedFiltersRef.current) return;
                              setSelectedCategory(packName);
                              setMobileFilterOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-150 group text-left ${
                              isSelected
                                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                                : appTheme === 'dark'
                                  ? 'text-slate-300 border-transparent hover:text-white hover:bg-slate-800/80'
                                  : 'text-slate-700 border-transparent hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`p-1 rounded-lg ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : appTheme === 'dark' ? 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20' : 'bg-purple-50 text-purple-600'
                              } transition-colors`}>
                                {packName === 'Stickman' ? <User className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                              </span>
                              <span className="truncate">{packName}</span>
                            </div>

                            <span className={`text-[10px] sm:text-[11px] min-w-[22px] text-center px-1.5 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 tabular-nums transition-colors ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : appTheme === 'dark'
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                                  : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Content Area: Search Bar + Asset Grid (compact 1180px max-width for narrower cards) */}
            <div className="flex-1 min-w-0 w-full max-w-[1180px] space-y-4 sm:space-y-5">
              {/* Mobile Only: Horizontal Swipeable Category Bar */}
              <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1 mx-0 px-0.5 hide-scrollbar touch-pan-x whitespace-nowrap w-full max-w-full">
                {categories.map((cat) => {
                  const isFavCat = cat === 'Favorites';
                  const isSelected = selectedCategory === cat;
                  const count = cat === 'All'
                    ? elements.length
                    : isFavCat
                      ? favorites.length
                      : elements.filter(e => e.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? isFavCat
                            ? 'bg-rose-600 border-rose-600 text-white shadow-md'
                            : 'bg-blue-600 border-blue-600 text-white shadow-md'
                          : appTheme === 'dark'
                            ? 'bg-[#18191f] border-[#252834] text-slate-300 active:bg-slate-800'
                            : 'bg-white border-slate-200 text-slate-700 active:bg-slate-100 shadow-sm'
                      }`}
                    >
                      {isFavCat && <Heart className={`w-3 h-3 ${isSelected ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />}
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : appTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}

                {/* Mobile Packs Pills */}
                {availablePacks.map((packName) => {
                  const isSelected = selectedCategory === packName;
                  const count = elements.filter(e => e.pack === packName || e.category === packName).length;
                  return (
                    <button
                      key={`mob-pack-${packName}`}
                      type="button"
                      onClick={() => setSelectedCategory(packName)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                          : appTheme === 'dark'
                            ? 'bg-purple-950/40 border-purple-800/40 text-purple-300 active:bg-purple-900/60'
                            : 'bg-purple-50 border-purple-200 text-purple-700 active:bg-purple-100 shadow-sm'
                      }`}
                    >
                      <Package className="w-3 h-3 text-purple-400" />
                      <span>{packName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : appTheme === 'dark' ? 'bg-purple-900/60 text-purple-200' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar & Active Stats */}
              <div
                data-gallery-grid-anchor="true"
                className={`p-3 sm:p-4 rounded-2xl border transition shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full max-w-full min-w-0 ${
                appTheme === 'dark' ? 'bg-[#18191f] border-[#22242c]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search assets or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border rounded-xl pl-10 pr-9 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition ${
                      appTheme === 'dark'
                        ? 'bg-[#121316] border-[#22242c] text-slate-100 placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Active Category / Pack & Results Count Badge */}
                <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap text-xs w-full sm:w-auto min-w-0">
                  <span className={`px-3 py-1.5 rounded-xl font-medium border ${
                    appTheme === 'dark'
                      ? 'bg-[#121316] border-[#22242c] text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {availablePacks.includes(selectedCategory) ? 'Pack: ' : 'Category: '}
                    <strong className={appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{selectedCategory}</strong>
                  </span>
                  <span className={`px-2.5 py-1.5 rounded-xl font-bold ${
                    appTheme === 'dark' ? 'bg-[#0e2736] text-[#38bdf8] border border-cyan-800/40' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {isGalleryLoading ? (
                      <span className="inline-flex items-center gap-1.5 animate-pulse text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        Syncing assets...
                      </span>
                    ) : filteredElements.length > 50 && visibleCount < filteredElements.length
                      ? `Showing ${displayedElements.length} of ${filteredElements.length} elements`
                      : `${filteredElements.length} ${filteredElements.length === 1 ? 'element' : 'elements'}`}
                  </span>
                </div>
              </div>

              {/* Mobile Pull-to-Refresh: Small round animation right below search bar */}
              <div
                className={`md:hidden flex items-center justify-center transition-all duration-300 ease-out overflow-hidden w-full ${
                  pullDistance > 0 || isPullRefreshing
                    ? 'opacity-100 py-1.5'
                    : 'h-0 opacity-0 py-0 pointer-events-none'
                }`}
                style={{
                  height: isPullRefreshing ? '46px' : `${Math.min(pullDistance, 48)}px`,
                }}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg border transition-all duration-150 ${
                    appTheme === 'dark'
                      ? 'bg-[#1e2029] border-[#2f3242] text-cyan-400 shadow-black/60'
                      : 'bg-white border-slate-200 text-blue-600 shadow-slate-300'
                  } ${isPullRefreshing ? (appTheme === 'dark' ? 'ring-2 ring-cyan-500/50 scale-100' : 'ring-2 ring-blue-500/40 scale-100') : 'scale-95'}`}
                  style={{
                    transform: isPullRefreshing
                      ? 'scale(1)'
                      : `rotate(${pullDistance * 6}deg) scale(${Math.min(1, 0.65 + pullDistance / 100)})`,
                  }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isPullRefreshing
                        ? (appTheme === 'dark' ? 'animate-spin text-cyan-400' : 'animate-spin text-blue-600')
                        : (appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500')
                    }`}
                  />
                </div>
              </div>

              {/* Asset Grid: Exactly 2 columns on mobile, 3 on tablet, 4-5 on desktop */}
              <div className="gallery-grid-responsive grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3.5 items-start content-start min-h-[580px] w-full max-w-full min-w-0">

                {isGalleryLoading ? (
                  // Smooth Glass Skeleton Cards (15 placeholders for immediate zero-shift rendering)
                  Array.from({ length: 15 }).map((_, idx) => (
                    <div
                      key={`skeleton-card-${idx}`}
                      className={`border rounded-xl p-2 sm:p-3 flex flex-col items-center relative w-full min-w-0 skeleton-shimmer isolate [contain:paint_layout] transition-all duration-300 ${
                        appTheme === 'dark'
                          ? 'bg-[#18191f] border-[#22242c]'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Top mini placeholder */}
                      <div className="w-full flex justify-between items-center mb-2 px-0.5">
                        <div className={`w-3.5 h-3.5 rounded-md ${appTheme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-100'}`} />
                        <div className={`w-8 h-2.5 rounded-full ${appTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100'}`} />
                      </div>

                      {/* Graphic Artboard Center Placeholder */}
                      <div className={`w-full h-20 sm:h-28 rounded-lg flex items-center justify-center relative overflow-hidden mb-1 ${
                        appTheme === 'dark'
                          ? 'bg-[#14151a]'
                          : 'bg-slate-50'
                      }`}>
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${
                          appTheme === 'dark' ? 'bg-[#22242f]/80' : 'bg-slate-200/90'
                        }`} />
                      </div>

                      {/* Title Bar Placeholder */}
                      <div className={`h-3 w-3/4 rounded-full mt-2 sm:mt-2.5 ${
                        appTheme === 'dark' ? 'bg-slate-700/60' : 'bg-slate-200'
                      }`} />

                      {/* Category / Download Bar Placeholder */}
                      <div className={`h-2.5 w-1/2 rounded-full mt-1.5 ${
                        appTheme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100'
                      }`} />
                    </div>
                  ))
                ) : (
                  displayedElements.map((item) => {
                    // Highlighted Curated Pack Showcase Card
                    if (item.isPackCard) {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedCategory(item.packName);
                            try {
                              const anchorEl = document.querySelector('[data-gallery-grid-anchor]');
                              if (anchorEl) {
                                anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              } else {
                                window.scrollTo({ top: 380, behavior: 'smooth' });
                              }
                            } catch (_) {
                              window.scrollTo({ top: 380, behavior: 'smooth' });
                            }
                          }}
                          className={`group gallery-card-item border-2 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between items-center cursor-pointer transition-all duration-300 ease-out md:hover:-translate-y-2 md:hover:scale-[1.02] md:active:scale-95 touch-manipulation transform-gpu will-change-transform isolate [backface-visibility:hidden] [transform:translateZ(0)] [contain:paint_layout] relative w-full min-w-0 overflow-hidden shadow-lg ${
                            appTheme === 'dark'
                              ? 'bg-gradient-to-br from-[#1d1336] via-[#161726] to-[#0e1628] border-purple-500/70 md:hover:border-purple-400 ring-1 ring-purple-500/30 md:hover:shadow-[0_16px_36px_-6px_rgba(168,85,247,0.45),0_0_24px_rgba(168,85,247,0.3)]'
                              : 'bg-gradient-to-br from-purple-50 via-indigo-50/60 to-blue-50 border-purple-400 md:hover:border-purple-600 ring-1 ring-purple-300/50 md:hover:shadow-[0_16px_32px_-6px_rgba(147,51,234,0.25)]'
                          }`}
                          title={`Click to explore full ${item.packName} Pack (${item.totalCount} icons)`}
                        >
                          {/* Ambient glow effects */}
                          <div className="absolute -top-10 -right-10 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl pointer-events-none md:group-hover:scale-125 transition-transform duration-500" />
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/15 rounded-full blur-xl pointer-events-none md:group-hover:scale-125 transition-transform duration-500" />

                          {/* Top Badges */}
                          <div className="w-full flex items-center justify-between mb-1.5 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-600/30">
                              <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />
                              Full Pack
                            </span>
                            <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              appTheme === 'dark' ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60' : 'bg-purple-100 text-purple-700 border border-purple-200'
                            }`}>
                              {item.totalCount} icons
                            </span>
                          </div>

                          {/* 2x2 Mini Preview Mosaic Artboard */}
                          <div className={`w-full h-20 sm:h-28 rounded-xl p-1 sm:p-1.5 mb-1.5 grid grid-cols-2 gap-1 items-center justify-center relative overflow-hidden transition-colors ${
                            appTheme === 'dark' ? 'bg-[#0b0c13]/90 border border-purple-500/25 md:group-hover:border-purple-500/50' : 'bg-white/95 border border-purple-200/90 shadow-inner'
                          }`}>
                            {(item.previewItems || []).slice(0, 4).map((prevItem, pIdx) => (
                              <div
                                key={`pack-prev-${item.packName}-${pIdx}`}
                                className={`w-full h-full flex items-center justify-center p-0.5 rounded-lg transition-transform md:group-hover:scale-105 duration-200 overflow-hidden ${
                                  appTheme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50'
                                } [&>svg]:w-auto [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block [&>svg]:mx-auto`}
                                dangerouslySetInnerHTML={{
                                  __html: scopeSvgIds(
                                    normalizeForeignObjectSvg(prevItem.originalSvgCode || prevItem.svgCode),
                                    `pack_thumb_${pIdx}_`
                                  )
                                }}
                              />
                            ))}
                          </div>

                          {/* Title & Info */}
                          <div className="w-full text-center z-10 flex flex-col items-center">
                            <h3 className={`font-bold text-[11px] sm:text-[13px] truncate w-full px-0.5 flex items-center justify-center gap-1 ${
                              appTheme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent font-extrabold">
                                {item.title}
                              </span>
                            </h3>

                            {/* Explore Full Pack Button Badge */}
                            <div className="mt-1.5 w-full">
                              <div className="w-full py-1 sm:py-1.5 px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 md:group-hover:from-purple-500 md:group-hover:to-blue-500 text-white shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all">
                                <Package className="w-3 h-3 text-purple-200" />
                                <span>Open Full Pack</span>
                                <ChevronRight className="w-3 h-3 md:group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const isFav = favorites.includes(item.id);
                    const isMarkedForDelete = pendingDeletedIds.includes(item.id);
                    return (
                      <div
                      key={item.id}
                      onClick={() => {
                        if (isMarkedForDelete) {
                          setPendingDeletedIds(prev => prev.filter(x => x !== item.id));
                          return;
                        }
                        if (isGalleryAdminMode) {
                          handleOpenAsset(item);
                        } else {
                          setDetailModalAsset(item);
                        }
                      }}
                      className={`group gallery-card-item border rounded-xl p-2 sm:p-3 flex flex-col items-center cursor-pointer transition-transform transition-shadow duration-200 ease-out md:hover:-translate-y-2 md:active:scale-95 touch-manipulation transform-gpu will-change-transform isolate [backface-visibility:hidden] [transform:translateZ(0)] [contain:paint_layout] relative w-full min-w-0 ${
                        isMarkedForDelete
                          ? 'border-rose-500/90 bg-rose-950/30 opacity-75 ring-2 ring-rose-500/50 scale-[0.98]'
                          : appTheme === 'dark'
                            ? 'bg-[#18191f] border-[#22242c] md:hover:border-[#38bdf8]/60 md:hover:bg-[#1e2029] shadow-sm md:hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.7),0_8px_16px_-4px_rgba(0,0,0,0.5)]'
                            : 'bg-white border-slate-200 md:hover:border-slate-300 md:hover:bg-white shadow-sm md:hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.14),0_8px_16px_-4px_rgba(0,0,0,0.08)]'
                      }`}
                    >
                      {/* Favorite Toggle Button (top-left) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                        className={`absolute top-1.5 left-1.5 p-1 rounded-md transition-opacity duration-150 z-20 ${isFav
                          ? 'bg-rose-500/15 text-rose-500 opacity-100'
                          : 'opacity-60 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-slate-500/10 text-slate-400 hover:text-rose-500'
                          }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      {/* Admin Controls (Shown ONLY when isGalleryAdminMode is true, positioned at top-right) */}
                      {isGalleryAdminMode && (
                        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-20">
                          {/* Edit Details Button (Name, Description, Category, Tags) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditAssetModal(item);
                            }}
                            title="Edit Name, Description, Category & Tags"
                            className="p-1.5 rounded-lg transition-all duration-150 cursor-pointer shadow-md bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 active:scale-95"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-white" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDeletedIds(prev =>
                                prev.includes(item.id)
                                  ? prev.filter(x => x !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                            title={isMarkedForDelete ? "Undo deletion" : "Mark for deletion"}
                            className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer shadow-md ${
                              isMarkedForDelete
                                ? 'bg-rose-600 text-white ring-2 ring-white/50 scale-110 opacity-100'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/40 hover:bg-rose-600 hover:text-white hover:scale-105'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Marked for Delete Visual Overlay Indicator */}
                      {isMarkedForDelete && (
                        <div className="absolute inset-0 bg-rose-950/45 backdrop-blur-[0.5px] rounded-xl z-10 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600 text-white shadow-md">
                            To Delete
                          </span>
                          <span className="text-[9px] text-rose-200 mt-1 font-semibold">
                            Click trash to undo
                          </span>
                        </div>
                      )}

                      {/* Preview Container: Roomy padded box with overflow-visible so soft blur, glow, and 3D tilts never clip */}
                      <div
                        data-gallery-preview="true"
                        className="gallery-card-preview w-full h-20 sm:h-28 flex items-center justify-center p-1.5 sm:p-3 mb-1 pointer-events-none select-none overflow-visible [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:block [&>svg]:overflow-visible [shape-rendering:geometricPrecision]"
                        dangerouslySetInnerHTML={{
                          __html: scopeSvgIds(
                            normalizeForeignObjectSvg(item.originalSvgCode || item.svgCode),
                            `home_${String(item.id).replace(/[^a-zA-Z0-9_-]/g, '_')}_`
                          )
                        }}
                      />
                      <h3 className={`font-semibold text-[11px] sm:text-[13px] text-center truncate w-full px-0.5 pointer-events-none select-none ${appTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {item.title}
                      </h3>
                      <div className={`flex items-center justify-between w-full mt-0.5 px-0.5 text-[9px] sm:text-[11px] pointer-events-none select-none ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                        <span className="truncate">{item.category}</span>
                        <span className="flex-shrink-0 ml-1">{item.downloads || 0} dl</span>
                      </div>
                    </div>
                  );
                })
              )}

              </div>

              {/* Load More Button: Paginate 50 elements at a time */}
              {visibleCount < filteredElements.length && (
                <div className="flex flex-col items-center justify-center pt-6 pb-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 50)}
                    className={`group px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all duration-200 shadow-lg active:scale-95 cursor-pointer ${
                      appTheme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-blue-400/40 shadow-blue-900/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-200 shadow-blue-500/20'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    <span>Load more</span>
                  </button>
                  <p className={`text-[11px] mt-2 font-medium ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Showing {displayedElements.length} of {filteredElements.length} elements
                  </p>
                </div>
              )}

              {filteredElements.length > 50 && visibleCount >= filteredElements.length && (
                <div className="text-center pt-8 pb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    appTheme === 'dark' ? 'bg-slate-900/80 text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    All {filteredElements.length} elements loaded
                  </span>
                </div>
              )}

              {filteredElements.length === 0 && (
                <div className="text-center py-16 sm:py-20 text-slate-500 text-xs sm:text-sm space-y-2">
                  {selectedCategory === 'Favorites' ? (
                    <>
                      <Heart className="w-8 h-8 text-rose-500/40 mx-auto stroke-1" />
                      <p className="font-semibold text-slate-400">No favorite icons yet.</p>
                      <p className="text-[11px] text-slate-500">Click the ❤️ (Heart) on any icon card to save it here!</p>
                    </>
                  ) : (
                    <p>No assets found. Visit Admin Upload to add a new SVG!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      </main>

      {/* Website Footer (Hidden in APK app and on mobile view) */}
      {!isNativeApp && isDesktopScreen && (
        <footer className={`border-t mt-12 py-10 transition-colors ${appTheme === 'dark' ? 'bg-[#121316] border-[#1f2128] text-slate-400' : 'bg-white border-slate-200 text-slate-600'
          }`}>
        <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <img src="/app-icon.png" alt="Iconderry" className="w-7 h-7 rounded-lg shadow-sm" />
                <span className={`text-base font-black tracking-tight ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Icon<span className="text-cyan-500">derry</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  v2.4 PRO
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm text-slate-400">
                Free open vector graphics library &amp; pro studio. Customize colors, 3D material looks, outline stroke weights, and app icon badges directly in your browser.
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free for Commercial Use
                </span>
              </div>
            </div>

            {/* Quick Links / Legal */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                Trust &amp; Legal
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => { setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition font-semibold text-cyan-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Blog &amp; Tutorials
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('license'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-cyan-400 transition flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Commercial License &amp; Terms
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-cyan-400 transition">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLegalModal('terms')} className="hover:text-cyan-400 transition">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveLegalModal('about')} className="hover:text-cyan-400 transition">
                    About Iconderry
                  </button>
                </li>
              </ul>
            </div>

            {/* Community & Feedback */}
            <div className="space-y-2">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                Community
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need a specific icon or feature? Let us know and we'll create it for you!
              </p>
              <button
                onClick={() => {
                  setFeedbackSubmitted(false);
                  setActiveLegalModal('feedback');
                }}
                className="mt-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Request an Icon / Feedback</span>
              </button>
            </div>
          </div>

          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${appTheme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
            }`}>
            <p>&copy; {new Date().getFullYear()} Iconderry Studio. Crafted for creators &amp; developers.</p>
            <div className="flex items-center gap-4">
              <span>Zero tracking cookies</span>
              <span>&bull;</span>
              <span>Fast 60fps Vector Engine</span>
            </div>
          </div>
        </div>
      </footer>
      )}

      {/* Full-Screen Immersive Studio Workspace */}
      {selectedAsset && (
        <div className={`fixed inset-0 z-50 flex flex-col w-full h-full max-w-full max-h-full overflow-hidden font-sans studio-workspace select-none transition-colors duration-200 ${appTheme === 'dark' ? 'bg-[#121316] text-slate-100' : 'bg-slate-100 text-slate-900'
          }`}>
          {/* Gallery Default Saved Toast */}
          {saveDefaultSuccess && (
            <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600/95 border border-emerald-400 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
              <span>{saveDefaultSuccess}</span>
            </div>
          )}

          {/* Top Navigation Bar */}
          <header className={`app-studio-header h-14 sm:h-16 px-2 sm:px-6 border-b flex items-center justify-between z-30 flex-shrink-0 transition-colors ${appTheme === 'dark' ? 'bg-[#121316] border-[#1f2128]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
            {/* Left: Back & Asset Details */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink min-w-0">
              <button
                onClick={handleCloseStudio}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex-shrink-0 ${appTheme === 'dark'
                  ? 'bg-[#18191f] border-[#22242c] hover:border-[#38bdf8]/40 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                  }`}
                title="Back to Gallery"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span className="hidden sm:inline">Gallery</span>
              </button>

              <div className={`hidden sm:block h-5 w-px ${appTheme === 'dark' ? 'bg-[#22242c]' : 'bg-slate-200'}`} />

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className={`text-xs sm:text-sm font-bold truncate max-w-[80px] xs:max-w-[130px] sm:max-w-xs ${appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {selectedAsset.title}
                  </h2>
                  {/* Studio badge - hidden on mobile UI */}
                  <span className="hidden sm:inline-flex text-[9px] sm:text-[10px] bg-cyan-500/10 text-cyan-500 px-1.5 sm:px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
                    Studio
                  </span>
                  {isGalleryAdminMode && (
                    <span className="inline-flex text-[9px] sm:text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40 font-bold items-center gap-1 shadow-sm">
                      <Palette className="w-3 h-3 text-purple-400" />
                      Admin Mode
                    </span>
                  )}
                </div>
                <span className={`hidden sm:block text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{selectedAsset.category}</span>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Undo & Redo History Buttons */}
              <div className={`flex items-center gap-0.5 p-0.5 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                <button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  title="Undo edit (Ctrl + Z)"
                  className={`p-1.5 rounded-lg transition ${undoStack.length === 0
                    ? 'opacity-25 cursor-not-allowed text-slate-500'
                    : appTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm'
                    }`}
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  title="Redo edit (Ctrl + Y / Ctrl + Shift + Z)"
                  className={`p-1.5 rounded-lg transition ${redoStack.length === 0
                    ? 'opacity-25 cursor-not-allowed text-slate-500'
                    : appTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm'
                    }`}
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Dark/Light Toggle in Studio Header (Visible on Mobile & Desktop) */}
              <button
                onClick={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                title={appTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-1.5 sm:p-2 rounded-xl border transition flex items-center justify-center ${appTheme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-white hover:border-slate-700'
                  : 'bg-slate-100 border-slate-200 text-amber-500 hover:text-amber-600 hover:bg-slate-200'
                  }`}
              >
                {appTheme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>

              {/* Favorite Toggle inside Studio (Desktop / Tablet) */}
              {!selectedAsset?.isEmptyCanvas && (
                <button
                  onClick={() => toggleFavorite(selectedAsset.id)}
                  title={favorites.includes(selectedAsset.id) ? "Saved to Favorites" : "Save to Favorites"}
                  className={`hidden sm:flex p-1.5 sm:p-2 rounded-xl border transition items-center justify-center ${favorites.includes(selectedAsset.id)
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                    : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-500'
                    }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(selectedAsset.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              )}

              {/* Reset All button */}
              <button
                onClick={handleResetAll}
                className={`text-xs flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition ${appTheme === 'dark'
                  ? 'text-slate-300 hover:text-white bg-slate-900/90 border-slate-800 hover:bg-slate-800 hover:border-cyan-500/40'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-200'
                  }`}
                title="Reset product 100% to upload state"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
                <span className="hidden sm:inline font-semibold">Reset All</span>
              </button>

              {/* Save Default to Gallery (Admin Feature - Only visible in Gallery Admin Mode) */}
              {!selectedAsset?.isEmptyCanvas && isGalleryAdminMode && (
                <button
                  onClick={handleSaveDefaultToGallery}
                  disabled={isSavingGalleryDefault}
                  className={`text-xs flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border font-bold transition shadow-sm ${saveDefaultSuccess
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : appTheme === 'dark'
                      ? 'bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/35 hover:border-purple-400 hover:text-white'
                      : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                    }`}
                  title="Save current customized edits as the permanent default in the gallery and cloud database for all users"
                >
                  {isSavingGalleryDefault ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  ) : saveDefaultSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-purple-400" />
                  )}
                  <span className="hidden sm:inline">
                    {isSavingGalleryDefault ? 'Saving Default...' : saveDefaultSuccess ? 'Default Saved!' : 'Save as Gallery Default'}
                  </span>
                </button>
              )}

              {/* Add Element from Library Button */}
              <button
                onClick={() => setIsAddElementModalOpen(true)}
                title="Add element from gallery to canvas"
                className={`text-xs flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border font-bold transition ${
                  selectedAsset?.isEmptyCanvas
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : appTheme === 'dark'
                      ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 hover:border-cyan-400'
                      : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <PlusCircle className={`w-3.5 h-3.5 ${selectedAsset?.isEmptyCanvas ? 'text-slate-950 stroke-[2.5]' : 'text-cyan-400'}`} />
                <span className="inline">
                  {selectedAsset?.isEmptyCanvas ? 'Add from Gallery' : 'Add Element'}
                </span>
              </button>

              {/* Export Button with Quality & Resolution Dropdown */}
              <div className="relative flex-shrink-0" ref={exportDropdownRef}>
                <button
                  onClick={() => setIsExportDropdownOpen(prev => !prev)}
                  disabled={downloading}
                  className={`h-8 px-2 sm:px-3.5 rounded-xl font-bold text-xs whitespace-nowrap flex-shrink-0 transition flex items-center gap-1 sm:gap-1.5 shadow-md shadow-emerald-600/20 text-white disabled:opacity-50 ${isExportDropdownOpen ? 'ring-2 ring-emerald-400 bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
                    }`}
                  title="Export Quality & Options"
                >
                  <Download className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{downloading ? '...' : 'Export'}</span>
                  <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-black/25 text-emerald-200">
                    .{exportFormat}
                  </span>
                  <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isExportDropdownOpen ? 'rotate-180 text-emerald-200' : 'text-white/70'}`} />
                </button>

                {isExportDropdownOpen && (
                  <ModalPortal isMobile={!isDesktopScreen}>
                    {!isDesktopScreen && (
                      <div
                        onClick={() => setIsExportDropdownOpen(false)}
                        className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                      />
                    )}
                    <div className={
                      !isDesktopScreen
                        ? `fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar rounded-3xl shadow-2xl border p-4 z-[99999] animate-in zoom-in-95 fade-in duration-200 backdrop-blur-2xl ${
                            appTheme === 'dark'
                              ? 'bg-[#0d1527] border-slate-700/80 text-slate-100 shadow-black/90'
                              : 'bg-white border-slate-200 text-slate-900 shadow-slate-400'
                          }`
                        : `absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl shadow-2xl border p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl ${
                            appTheme === 'dark'
                              ? 'bg-[#0d1527]/98 border-slate-700/80 text-slate-100 shadow-black/80'
                              : 'bg-white/98 border-slate-200 text-slate-900 shadow-slate-300'
                          }`
                    }>
                      {/* Header */}
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700/30">
                        <div>
                          <h4 className="text-xs font-bold flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Select Export Quality</span>
                          </h4>
                          <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Choose resolution from 128px to 8K
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {exportFormat === 'ico' ? (exportSize >= 256 ? 'Multi-Res Favicon' : `${exportSize}px ICO`) : (exportSize >= 1024 ? `${exportSize / 1024}K Ultra HD` : `${exportSize}px`)}
                          </span>
                          {!isDesktopScreen && (
                            <button
                              type="button"
                              onClick={() => setIsExportDropdownOpen(false)}
                              className="p-1 rounded-lg text-slate-400 hover:text-white"
                              title="Close"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                    {/* Format Selector Pills */}
                    <div className="mb-3">
                      <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        Format
                      </label>
                      <div className="grid grid-cols-6 gap-1">
                        {['png', 'svg', 'ico', 'webp', 'jpeg', 'gif'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => {
                              setExportFormat(fmt);
                              if (fmt === 'ico') {
                                setExportSize(256);
                              } else if (exportSize < 128) {
                                setExportSize(512);
                              }
                            }}
                            className={`py-1 text-[10px] font-mono font-bold uppercase rounded-lg border transition ${exportFormat === fmt
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                              : appTheme === 'dark'
                                ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                          >
                            .{fmt}
                          </button>
                        ))}
                      </div>
                      {exportFormat === 'gif' && (
                        <div className="mt-2.5 p-2 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-1.5 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                              <Film className="w-3 h-3" /> GIF Smoothness (FPS)
                            </span>
                            <span className="text-[10px] font-mono text-cyan-300 font-bold">
                              {adjustments.animFps || 60} FPS
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { fps: 24, label: '24 FPS' },
                              { fps: 30, label: '30 FPS' },
                              { fps: 60, label: '60 FPS', badge: '⚡ Best' }
                            ].map((item) => (
                              <button
                                key={item.fps}
                                type="button"
                                onClick={() => setAdjustments(prev => ({ ...prev, animFps: item.fps }))}
                                className={`py-1 px-1 rounded-lg text-[10px] font-semibold border transition text-center ${
                                  (adjustments.animFps || 60) === item.fps
                                    ? 'bg-blue-600 border-blue-400 text-white font-bold shadow'
                                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span>{item.label}</span>
                                {item.badge && <span className="ml-1 text-[8px] px-1 rounded bg-amber-400 text-slate-950 font-bold">{item.badge}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resolution Options Grid */}
                    <div>
                      <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        Resolution ({exportFormat === 'ico' ? `${exportSize}px High-Definition Icon` : (exportSize >= 1024 ? `${exportSize / 1024}K Ultra HD` : `${exportSize}px Standard`)})
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(exportFormat === 'ico'
                          ? [
                              { size: 256, label: '256px', desc: 'Standard HD (Best)', span: true },
                              { size: 512, label: '512px', desc: '★ Ultra-HD (Big & Sharp)', span: true },
                              { size: 128, label: '128px', desc: 'Large Icon' },
                              { size: 64, label: '64px', desc: 'Hi-DPI App' },
                              { size: 32, label: '32px', desc: 'Browser Tab' },
                              { size: 16, label: '16px', desc: 'Small Favicon' }
                            ]
                          : [
                              { size: 128, label: '128px' },
                              { size: 256, label: '256px' },
                              { size: 512, label: '512px' },
                              { size: 1024, label: '1K' },
                              { size: 2048, label: '2K' },
                              { size: 4096, label: '4K' },
                              { size: 8192, label: !isDesktopScreen ? '8K (PC)' : '8K' }
                            ]
                        ).map(({ size, label, desc, span }) => {
                          const isSelected = exportSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => {
                                if (!isDesktopScreen && size === 8192) {
                                  setExportSize(4096);
                                  setSettingsToast('8K requires PC GPU memory. Auto-set to 4K Ultra-HD for mobile stability.');
                                  setTimeout(() => setSettingsToast(''), 3500);
                                  return;
                                }
                                setExportSize(size);
                              }}
                              className={`py-1.5 px-1 rounded-xl text-xs font-bold transition border text-center flex flex-col items-center justify-center ${isSelected
                                ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/40 scale-[1.02]'
                                : appTheme === 'dark'
                                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                                } ${(size === 8192 || (exportFormat === 'ico' && span)) ? 'col-span-2 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-700/50' : ''}`}
                            >
                              <span className={(size === 8192 || (exportFormat === 'ico' && span)) && !isSelected ? 'text-cyan-300' : ''}>{label}</span>
                              <span className="text-[9px] opacity-70 font-normal">{desc || `${size}px`}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Auto-Fit Toggle in Dropdown */}
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-semibold text-slate-300">Fit Canvas to All Elements</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoFitToElements}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setAutoFitToElements(val);
                          localStorage.setItem('iconderry_autofit_elements', String(val));
                        }}
                        className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                      />
                    </div>

                    {/* Prominent Action Button for the Selected Quality */}
                    <button
                      onClick={() => {
                        setIsExportDropdownOpen(false);
                        handleDownload();
                      }}
                      disabled={downloading}
                      className="w-full mt-3.5 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {downloading
                          ? 'Rendering & Downloading...'
                          : exportFormat === 'ico'
                            ? `Export .ICO (${exportSize}px High-Res Bundle)`
                            : `Export ${exportSize >= 1024 ? `${exportSize / 1024}K` : `${exportSize}px`} (.${exportFormat.toUpperCase()})`}
                      </span>
                    </button>
                  </div>
                </ModalPortal>
              )}
            </div>

              {/* Settings Button - always clearly visible */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`p-1.5 sm:p-2 rounded-xl border transition flex-shrink-0 flex items-center justify-center ${appTheme === 'dark'
                  ? 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-800 hover:bg-slate-800 hover:border-cyan-500/40'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-200'
                  }`}
                title="Settings & Themes"
              >
                <Settings className="w-3.5 h-3.5 text-cyan-500" />
              </button>

              {/* Redundant Close button on desktop only (mobile uses Back to Gallery button) */}
              <button
                onClick={handleCloseStudio}
                className={`hidden sm:flex p-1.5 rounded-full transition flex-shrink-0 ${appTheme === 'dark'
                  ? 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300'
                  }`}
                title="Close Studio"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main Full-Screen Body */}
          <div className="flex-1 min-h-0 min-w-0 w-full flex flex-col lg:flex-row overflow-hidden relative">
            {/* Left/Center: Large Canvas Workspace */}
            <div
              ref={canvasWorkspaceRef}
              onPointerDown={handleCanvasPointerDown}
              onClick={() => {
                if (justFinishedPanRef.current || isCtrlShiftDown) return;
                setActiveSelectedColor(null);
              }}
              style={
                !isDesktopScreen && isStudioPanelOpen
                  ? {
                      height: `${mobileCanvasHeight}%`,
                      flex: 'none',
                      transition: isResizingMobileCanvas ? 'none' : 'height 200ms ease'
                    }
                  : undefined
              }
              className={`w-full ${!isDesktopScreen && isStudioPanelOpen ? 'min-h-[140px]' : 'flex-1 h-full'} min-w-0 relative flex flex-col items-center justify-center p-2 sm:p-6 select-none overflow-hidden transition-colors border-0 touch-none ${isPanning
                ? 'cursor-grabbing select-none'
                : isCtrlShiftDown
                  ? 'cursor-grab'
                  : ''
                } ${appTheme === 'dark' ? 'bg-[#121316]' : 'bg-slate-100/90'
                }`}
            >
              {/* Marquee Selection Box (Figma/Illustrator Light Blue Drag Box) */}
              {marqueeBox && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
                    top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
                    width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
                    height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
                  }}
                  className="pointer-events-none z-30 border-2 border-cyan-400 bg-cyan-400/20 rounded shadow-md backdrop-blur-[0.5px]"
                />
              )}



              {/* Floating Canvas Controls & Direct Selection Indicator (Hidden on mobile UI per user request for a completely clean, empty canvas) */}
              <div className="hidden sm:flex absolute top-2 inset-x-2 sm:top-4 sm:inset-x-6 items-center justify-between z-10 pointer-events-none gap-2">
                {isCtrlShiftDown || isPanning ? (
                  <div className="pointer-events-auto border px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 bg-cyan-950 border-cyan-500/60 text-cyan-300 font-semibold animate-pulse">
                    <Move3d className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Pan View Active &bull; Drag mouse to move</span>
                  </div>
                ) : selectedLayerIds && selectedLayerIds.length > 0 ? (
                  <div className={`pointer-events-auto border px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 animate-in fade-in duration-150 ${appTheme === 'dark'
                    ? 'bg-[#0f172a] border-cyan-500/50 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                    }`}>
                    <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>
                      {isSubSelectedInGroup ? (
                        <>
                          <strong className="text-cyan-400 font-bold">Group Child Part</strong> (Directly movable)
                        </>
                      ) : isCurrentGroupSelected ? (
                        <>
                          <strong className="text-amber-400 font-bold">Group</strong> ({selectedLayerIds.length} parts) &bull; Double-click part to isolate
                        </>
                      ) : (
                        <>
                          <strong className="text-cyan-400 font-bold">{selectedLayerIds.length}</strong> {selectedLayerIds.length === 1 ? 'part' : 'parts'} selected
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAllLayers();
                        }}
                        className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[9px] font-semibold transition"
                        title="Select all vector parts"
                      >
                        Select All
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeselectAllLayers();
                        }}
                        className="px-1.5 py-0.5 rounded bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-[9px] font-semibold transition"
                        title="Deselect all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : activeSelectedColor ? (
                  <div className={`pointer-events-auto border px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 animate-in fade-in duration-150 ${appTheme === 'dark'
                    ? 'bg-[#0f172a] border-cyan-500/50 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                    }`}>
                    <span
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-400"
                      style={{
                        backgroundColor:
                          adjustments.colorReplacements[activeSelectedColor.toLowerCase()] ||
                          activeSelectedColor
                      }}
                    />
                    <span>Selected: <strong className="font-mono text-cyan-500 uppercase">{adjustments.colorReplacements[activeSelectedColor.toLowerCase()] || activeSelectedColor}</strong></span>
                    <span className={`hidden xs:inline text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>&bull; Tap canvas to deselect</span>
                  </div>
                ) : (
                  <div className={`pointer-events-auto border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-1.5 ${appTheme === 'dark'
                    ? 'bg-[#0f172a] border-slate-800 text-cyan-400'
                    : 'bg-white border-slate-200 text-cyan-600 font-medium'
                    }`}>
                    <Sparkles className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                    <span><strong>Touch/Click</strong> icon to change colors</span>
                    <span className={`hidden md:inline text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>&bull; Scroll: Smooth Zoom &bull; Drag: Marquee Select</span>
                  </div>
                )}

                {/* Zoom Controls Pill */}
                <div className={`pointer-events-auto flex items-center border p-0.5 sm:p-1 rounded-xl gap-0.5 sm:gap-1 ${appTheme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200'
                  }`}>
                  <button
                    onClick={() => {
                      const prevTarget = targetZoomRef.current;
                      const nextTarget = Math.max(0.4, Number((prevTarget * 0.8).toFixed(2)));
                      targetZoomRef.current = nextTarget;
                      if (nextTarget <= 1.05) {
                        targetPanRef.current = { x: 0, y: 0 };
                      } else {
                        const ratio = Math.max(0, (nextTarget - 1) / Math.max(0.01, prevTarget - 1));
                        targetPanRef.current = {
                          x: Math.round(targetPanRef.current.x * ratio),
                          y: Math.round(targetPanRef.current.y * ratio)
                        };
                      }
                      startSmoothZoomLoop();
                    }}
                    className={`p-1 sm:p-1.5 rounded-lg transition ${appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    title="Zoom Out (Auto-centers towards 100%)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      targetZoomRef.current = 1;
                      currentZoomRef.current = 1;
                      targetPanRef.current = { x: 0, y: 0 };
                      if (animFrameIdRef.current) {
                        cancelAnimationFrame(animFrameIdRef.current);
                        animFrameIdRef.current = null;
                      }
                      setZoomLevel(1);
                      setCanvasPan({ x: 0, y: 0 });
                    }}
                    className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold rounded-md transition ${appTheme === 'dark' ? 'hover:bg-slate-800 text-cyan-400' : 'hover:bg-slate-100 text-cyan-600'
                      }`}
                    title="Click to Reset Zoom (100%) & Center Pan"
                  >
                    <span id="live-zoom-badge">{Math.round(zoomLevel * 100)}%</span>
                  </button>
                  <button
                    onClick={() => {
                      targetZoomRef.current = Math.min(5, Number((targetZoomRef.current * 1.25).toFixed(2)));
                      startSmoothZoomLoop();
                    }}
                    className={`p-1 sm:p-1.5 rounded-lg transition ${appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    title="Zoom In (up to 500%)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                    {/* Circular Help & Navigation Guide Button (?) */}
                    <button
                      onClick={() => {
                        setIsHelpModalOpen(true);
                        setHelpSearchQuery('');
                      }}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all shadow-sm border hover:scale-110 active:scale-95 ml-0.5 ${appTheme === 'dark'
                          ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 border-cyan-400/40 shadow-cyan-950/40'
                          : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-500 hover:text-white border-cyan-300'
                        }`}
                      title="Navigation & Shortcuts Guide (?)"
                    >
                      ?
                    </button>
                  </div>

                  {/* Gallery Card Safe Boundary Guide Toggle (ONLY visible when entered via Admin Edit Gallery Defaults) */}
                  {isGalleryAdminMode && (
                    <div className={`pointer-events-auto flex items-center border p-0.5 sm:p-1 rounded-xl gap-1 shadow-lg backdrop-blur-md ${
                      showCardSafeZone
                        ? 'bg-purple-950/80 border-purple-500/50 shadow-purple-950/30'
                        : appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setShowCardSafeZone(prev => !prev)}
                        className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition ${
                          showCardSafeZone
                            ? 'bg-purple-600 text-white shadow-sm'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Toggle Gallery Card Safe Boundary Guide"
                      >
                        <Scan className="w-3.5 h-3.5 text-purple-300" />
                        <span className="hidden xs:inline">Card Guide</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${showCardSafeZone ? 'bg-purple-900/60 text-purple-200' : 'bg-slate-800 text-slate-400'}`}>
                          {showCardSafeZone ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Gallery Card Safe Boundary Guide Visual Frame (ONLY active in Admin Gallery Edit Mode) */}
                {isGalleryAdminMode && showCardSafeZone && !exportProgress && (
                  <div
                    ref={cardGuideRef}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${zoomLevel})`,
                      width: `${Math.round(iconWidth * 1.34)}px`,
                      height: `${Math.round(iconHeight * 1.52)}px`,
                      pointerEvents: 'none',
                      zIndex: 4
                    }}
                    className={`rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between shadow-2xl backdrop-blur-[0.5px] select-none ${
                      cardOverflowInfo.isOverflowing
                        ? 'border-rose-500/90 bg-rose-500/[0.04] shadow-rose-950/40 ring-4 ring-rose-500/25'
                        : 'border-purple-500/50 bg-purple-500/[0.03] shadow-purple-950/30'
                    }`}
                  >
                    {/* Top Header of Mock Gallery Card */}
                    <div className={`flex items-center justify-between px-3 py-1.5 rounded-t-xl text-[10px] font-bold border-b transition-colors ${
                      cardOverflowInfo.isOverflowing
                        ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                        : 'bg-purple-950/85 text-purple-200 border-purple-500/30'
                    }`}>
                      <span className="flex items-center gap-1.5 font-bold">
                        <Scan className="w-3 h-3 text-purple-400" />
                        <span>Gallery Card Outer Border</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        cardOverflowInfo.isOverflowing
                          ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                          : 'bg-purple-600/50 text-purple-200 border border-purple-400/30'
                      }`}>
                        {cardOverflowInfo.isOverflowing ? '⚠️ Overflow Warning' : 'Card Frame Guide'}
                      </span>
                    </div>

                    {/* Center Safe Zone (Dashed inner boundary matching SVG center bounds) */}
                    <div className="flex-1 flex items-center justify-center p-2 relative">
                      <div
                        style={{
                          width: `${iconWidth}px`,
                          height: `${iconHeight}px`
                        }}
                        className={`rounded-xl border-2 border-dashed transition-all flex items-start justify-center p-1.5 ${
                          cardOverflowInfo.isOverflowing
                            ? 'border-rose-400/80 bg-rose-500/[0.04]'
                            : 'border-emerald-400/60 bg-emerald-500/[0.02]'
                        }`}
                      >
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                          cardOverflowInfo.isOverflowing
                            ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                            : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {cardOverflowInfo.isOverflowing ? '❌ Element Exceeding Card Boundary' : '🟢 Card Safe Zone (Keep Element Inside)'}
                        </span>
                      </div>
                    </div>

                    {/* Mock Card Footer (Title & Category representation) */}
                    <div className={`px-3 py-1.5 rounded-b-xl border-t flex items-center justify-between text-[10px] transition-colors ${
                      cardOverflowInfo.isOverflowing
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                        : 'bg-slate-950/90 text-slate-400 border-purple-500/30'
                    }`}>
                      <span className="font-semibold text-slate-300 truncate max-w-[150px]">
                        {selectedAsset?.title || 'Element Title'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {selectedAsset?.category || 'Badges'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2D Smooth Pan & Zoom Viewport Container (Guarantees razor-sharp vector rasterization in Chromium GPU compositor) */}
                <div
                  ref={canvasViewportRef}
                  style={{
                    transform: `translate3d(${canvasPan.x}px, ${canvasPan.y}px, 0px) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    '--stage-zoom': zoomLevel,
                    '--inv-zoom': 1 / (zoomLevel || 1),
                    overflow: 'visible'
                  }}
                  className="inline-flex items-center justify-center pointer-events-auto overflow-visible"
                >
                  {/* Empty Canvas Prompt / Add From Gallery Placeholder */}
                  {selectedAsset?.isEmptyCanvas && (!customCanvasObjects || customCanvasObjects.length === 0) ? (
                    <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center max-w-[280px] xs:max-w-xs sm:max-w-sm rounded-3xl border-2 border-dashed border-cyan-500/40 bg-slate-900/80 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 sm:mb-4 shadow-lg shadow-cyan-500/15">
                        <PlusCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                        Canvas Khali Hai
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 mb-4 sm:mb-5 leading-relaxed">
                        Gallery se koi bhi item choose karein aur yahan live edit &amp; customize karein
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsAddElementModalOpen(true)}
                        className="px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition cursor-pointer"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Add from Gallery</span>
                      </button>
                    </div>
                  ) : (
                    /* Floating SVG Icon or Background Badge Shape with Interactive Selection, Custom Dimensions & Smooth Zoom */
                    <div
                      className={
                        (!exportProgress && adjustments.is3DFloating && adjustments.animPreset !== 'none')
                          ? getPresetAnimClass(adjustments.animPreset || 'float')
                          : ''
                      }
                    style={{
                      '--anim-speed': `${adjustments.animSpeed || 2.2}s`,
                      '--anim-amp': `${adjustments.animHeight || 16}px`,
                      '--anim-amp-val': `${adjustments.animHeight || 16}`,
                      display: 'inline-block',
                      overflow: 'visible',
                      ...(adjustments.is3DFloating && adjustments.animPreset !== 'none' ? {
                        perspective: '1200px',
                        transformStyle: 'preserve-3d',
                        transformOrigin: adjustments.animPreset === 'swing' ? 'top center' : 'center center'
                      } : {}),
                      animationPlayState: exportProgress ? 'paused' : 'running'
                    }}
                  >
                    {/* 3D & Vector Transform Space: Holds both SVG and Interactive Selection Bounding Box */}
                    <div
                      ref={transformStageRef}
                      style={{
                        position: 'relative',
                        width: `${iconWidth}px`,
                        height: `${iconHeight}px`,
                        perspective: has3D ? `${adjustments.perspective || 1200}px` : undefined,
                        perspectiveOrigin: '50% 50%',
                        transformStyle: 'preserve-3d',
                        transform: `translate3d(${adjustments.translateX || 0}px, ${adjustments.translateY || 0}px, 0px) rotate(${adjustments.rotation || 0}deg) skew(${adjustments.skewX || 0}deg, ${adjustments.skewY || 0}deg) scale(${adjustments.flipH ? -1 : 1}, ${adjustments.flipV ? -1 : 1})`,
                        transformOrigin: '50% 50%',
                        backfaceVisibility: 'visible',
                        overflow: 'visible'
                      }}
                    >
                  <div
                    ref={canvasSvgContainerRef}
                    onPointerDown={handleCanvasPointerDown}
                    onClick={(e) => {
                      if (justFinishedPanRef.current || isCtrlShiftDown || (e.ctrlKey && e.shiftKey)) {
                        e.stopPropagation();
                        return;
                      }
                      e.stopPropagation();
                      handleCanvasElementClick(e);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'copy';
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      try {
                        const raw = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
                        if (!raw) return;
                        const data = JSON.parse(raw);
                        if (data.type === 'preset') {
                          const p = TEXT_PRESETS.find(x => x.id === data.id);
                          if (p) handleAddTextObject(p);
                        } else if (data.type === 'custom') {
                          handleAddTextObject(null, data.customType);
                        }
                      } catch (_) { }
                    }}
                    style={{
                      '--zoom-level': zoomLevel,
                      '--sel-w': `${Math.max(0.02, Number((0.9 / zoomLevel).toFixed(4)))}px`,
                      '--hover-w': `${Math.max(0.015, Number((0.75 / zoomLevel).toFixed(4)))}px`,
                      '--sel-outline-w': `calc(${Math.max(0.001, Number((2 * finalSvgScale).toFixed(5)))}px * var(--inv-zoom, ${1 / zoomLevel}))`,
                      '--sel-outline-off': `calc(${Math.max(0.001, Number((2 * finalSvgScale).toFixed(5)))}px * var(--inv-zoom, ${1 / zoomLevel}))`,
                      '--hover-outline-w': `calc(${Math.max(0.001, Number((1.5 * finalSvgScale).toFixed(5)))}px * var(--inv-zoom, ${1 / zoomLevel}))`,
                      '--hover-outline-off': `calc(${Math.max(0.001, Number((2 * finalSvgScale).toFixed(5)))}px * var(--inv-zoom, ${1 / zoomLevel}))`,
                      width: '100%',
                      height: '100%',
                      overflow: 'visible',
                      transform: has3D ? `translate3d(0, 0, ${adjustments.translateZ || 0}px) rotateX(${adjustments.rotateX || 0}deg) rotateY(${adjustments.rotateY || 0}deg)` : undefined,
                      transformOrigin: '50% 50%',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      filter: getComputedFilterStyle(),
                      backgroundColor: bgShape !== 'none' ? (bgGradientEnabled ? undefined : bgShapeColor) : 'transparent',
                      background: bgShape !== 'none' && bgGradientEnabled ? `linear-gradient(${gradientAngle}deg, ${gradientFrom}, ${gradientTo})` : undefined,
                      padding: bgShape !== 'none' ? `${bgShapePadding * 0.7}%` : '0px',
                      borderRadius: bgShape === 'circle' ? '9999px' : bgShape === 'squircle' ? '28%' : bgShape === 'rounded-square' ? '1.5rem' : '0px',
                      clipPath: bgShape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none',
                      border: bgShape !== 'none' && bgShapeBorder > 0 ? `${bgShapeBorder}px solid ${bgShapeBorderColor}` : 'none'
                    }}
                    className={`flex items-center justify-center interactive-svg-canvas select-none overflow-visible [&>svg]:w-full [&>svg]:h-full [&>svg]:block [shape-rendering:geometricPrecision] [text-rendering:geometricPrecision] ${bgShape !== 'none' ? 'shadow-2xl' : ''
                      } ${studioTab === 'draw' ? 'pointer-events-none' : 'cursor-pointer'}`}
                    dangerouslySetInnerHTML={{ __html: currentPreviewSvg }}
                  />

                  {/* Canva Pro Freehand Vector Drawing Live Overlay */}
                  {studioTab === 'draw' && (
                    <svg
                      ref={drawingOverlaySvgRef}
                      className="absolute inset-0 w-full h-full pointer-events-auto touch-none cursor-crosshair z-50 overflow-visible"
                      viewBox={`0 0 ${iconWidth} ${iconHeight}`}
                      preserveAspectRatio="none"
                      onPointerDown={handleDrawPointerDown}
                      onPointerMove={handleDrawPointerMove}
                      onPointerUp={handleDrawPointerUp}
                      onPointerCancel={handleDrawPointerUp}
                    >
                      {activeLiveDrawPath && (
                        <path
                          d={activeLiveDrawPath}
                          fill="none"
                          stroke={drawTool === 'eraser' ? '#ffffff' : drawColor}
                          strokeWidth={drawSize}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={drawTool === 'highlighter' ? Math.min(0.55, drawOpacity) : drawOpacity}
                          style={drawTool === 'neon' ? { filter: `drop-shadow(0 0 6px ${drawColor}) drop-shadow(0 0 12px ${drawColor})` } : undefined}
                        />
                      )}
                    </svg>
                  )}

                  {/* Interactive Transform Bounding Box with 8 resize handles & rotation button - Unified Frame in 3D Space (Counter-Scaled for Constant Crisp 1x Screen Size) */}
                  {transformBox && !isPanning && studioTab !== 'draw' && (
                    <div
                      ref={transformBoxRef}
                      style={{
                        position: 'absolute',
                        left: `${transformBox.x}px`,
                        top: `${transformBox.y}px`,
                        width: `${transformBox.width}px`,
                        height: `${transformBox.height}px`,
                        transform: has3D ? `translate3d(0, 0, ${adjustments.translateZ || 0}px) rotateX(${adjustments.rotateX || 0}deg) rotateY(${adjustments.rotateY || 0}deg)` : undefined,
                        transformOrigin: '50% 50%',
                        transformStyle: 'preserve-3d',
                        pointerEvents: 'none',
                        borderWidth: `calc(1.5px * var(--inv-zoom, ${1 / zoomLevel}))`,
                        borderStyle: 'solid',
                        borderColor: '#38bdf8',
                        boxShadow: `0 0 calc(8px * var(--inv-zoom, ${1 / zoomLevel})) rgba(56,189,248,0.45)`
                      }}
                      className="z-30 rounded-none"
                    >
                      {/* 4 Corner Proportional Resize Dots (Counter-scaled to stay constant crisp 1x size) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          transform: `translate(-50%, -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'nw')}
                          className="pointer-events-auto w-3.5 h-3.5 bg-white rounded-full border-2 border-[#38bdf8] shadow-md cursor-nwse-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to scale proportionally"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          transform: `translate(50%, -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'ne')}
                          className="pointer-events-auto w-3.5 h-3.5 bg-white rounded-full border-2 border-[#38bdf8] shadow-md cursor-nesw-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to scale proportionally"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          transform: `translate(50%, 50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'se')}
                          className="pointer-events-auto w-3.5 h-3.5 bg-white rounded-full border-2 border-[#38bdf8] shadow-md cursor-nwse-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to scale proportionally"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          bottom: 0,
                          transform: `translate(-50%, 50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'sw')}
                          className="pointer-events-auto w-3.5 h-3.5 bg-white rounded-full border-2 border-[#38bdf8] shadow-md cursor-nesw-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to scale proportionally"
                        />
                      </div>

                      {/* 4 Mid-Edge Stretch Pills/Bars (Counter-scaled to stay constant crisp 1x size) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: 0,
                          transform: `translate(-50%, -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'n')}
                          className="pointer-events-auto w-4 h-2 bg-white rounded-full border border-[#38bdf8] shadow-sm cursor-ns-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to change height"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: 0,
                          transform: `translate(-50%, 50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 's')}
                          className="pointer-events-auto w-4 h-2 bg-white rounded-full border border-[#38bdf8] shadow-sm cursor-ns-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to change height"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: `translate(-50%, -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'w')}
                          className="pointer-events-auto w-2 h-4 bg-white rounded-full border border-[#38bdf8] shadow-sm cursor-ew-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to change width"
                        />
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: `translate(50%, -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'center center',
                          pointerEvents: 'none'
                        }}
                      >
                        <div
                          onPointerDown={(e) => handleTransformHandleDown(e, 'e')}
                          className="pointer-events-auto w-2 h-4 bg-white rounded-full border border-[#38bdf8] shadow-sm cursor-ew-resize hover:scale-125 active:scale-95 transition-transform"
                          title="Drag to change width"
                        />
                      </div>

                      {/* Rotation & Group/Ungroup Controls Container right by the left selection line (Counter-scaled to stay constant crisp 1x size) */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: `translate(calc(-100% - 12px * var(--inv-zoom, ${1 / zoomLevel})), -50%) scale(var(--inv-zoom, ${1 / zoomLevel}))`,
                          transformOrigin: 'right center',
                          pointerEvents: 'none'
                        }}
                        className="z-40"
                      >
                        <div className="pointer-events-auto flex items-center gap-1.5 whitespace-nowrap">
                          {/* If single child inside a group is sub-selected: Provide "Select Group" button */}
                          {isSubSelectedInGroup && activeGroupForSelection && (
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLayerIds([...activeGroupForSelection]);
                                setSelectedLayerId(activeGroupForSelection[0]);
                              }}
                              className="h-6 px-2.5 rounded-full border shadow-lg flex items-center gap-1 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer select-none bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-950/40"
                              title="Click to select all parts in this group together"
                            >
                              <Layers className="w-3 h-3 flex-shrink-0" />
                              <span>Select Group</span>
                            </button>
                          )}

                          {/* Group / Ungroup Button */}
                          {(isCurrentGroupSelected || isSubSelectedInGroup || (selectedLayerIds && selectedLayerIds.length > 1)) && (
                            <button
                              type="button"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrentGroupSelected || isSubSelectedInGroup) {
                                  handleUngroupSelected();
                                } else {
                                  handleGroupSelected();
                                }
                              }}
                              className={`h-6 px-2.5 rounded-full border shadow-lg flex items-center gap-1 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer select-none ${isCurrentGroupSelected || isSubSelectedInGroup
                                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-amber-950/40'
                                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-950/40'
                                }`}
                              title={isCurrentGroupSelected || isSubSelectedInGroup ? "Click to ungroup parts so they become standalone" : "Click to group selected parts"}
                            >
                              {isCurrentGroupSelected || isSubSelectedInGroup ? (
                                <>
                                  <Unlink2 className="w-3 h-3 flex-shrink-0" />
                                  <span>Ungroup</span>
                                </>
                              ) : (
                                <>
                                  <Link2 className="w-3 h-3 flex-shrink-0" />
                                  <span>Group</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Single Rotation Handle Button */}
                          <div
                            onPointerDown={(e) => handleTransformHandleDown(e, 'rotate')}
                            className="w-6 h-6 bg-white rounded-full border-2 border-[#38bdf8] shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-115 hover:border-cyan-300 transition-all text-[#0284c7] hover:text-cyan-500 flex-shrink-0"
                            title="Drag to rotate smoothly (or click to rotate)"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>

              {/* Bottom Floating Bar on Canvas (Hidden on mobile UI per user request, visible on tablet/desktop) */}
              <div className="hidden sm:flex absolute bottom-2 inset-x-2 sm:bottom-4 sm:inset-x-6 items-center justify-between pointer-events-none gap-2">
                {/* Element colors quick strip */}
                {detectedColors.length > 0 && (
                  <div className={`pointer-events-auto p-1.5 sm:p-2.5 px-2.5 sm:px-4 backdrop-blur-md border rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xl ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
                    }`}>
                    <span className={`text-[10px] sm:text-[11px] font-medium ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Palette:</span>
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap max-w-[200px] sm:max-w-none">
                      {detectedColors.map((c) => {
                        const activeColor = adjustments.colorReplacements[c.color.toLowerCase()] || c.color;
                        const isChanged = Boolean(adjustments.colorReplacements[c.color.toLowerCase()]);
                        const isSelected = activeSelectedColor?.toLowerCase() === c.color.toLowerCase();

                        return (
                          <button
                            key={c.color}
                            onClick={(e) => {
                              const now = Date.now();
                              const isDoubleClick = lastSwatchClickRef.current.color === c.color && (now - lastSwatchClickRef.current.time < 380);
                              lastSwatchClickRef.current = { time: now, color: c.color };

                              if (isDoubleClick) {
                                openColorWheelPopover(e.currentTarget, c.color);
                              } else {
                                handleSelectColorAndElements(c.color);
                              }
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              openColorWheelPopover(e.currentTarget, c.color);
                            }}
                            title={`Click: Select Element Body | Double Click: Open Color Wheel\nOriginal: ${c.color} | Current: ${activeColor}${isChanged ? ' (Modified)' : ''}`}
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform hover:scale-125 relative cursor-pointer ${isSelected
                              ? 'border-cyan-400 ring-2 sm:ring-4 ring-cyan-400/40 scale-110'
                              : isChanged
                                ? 'border-cyan-400 ring-1 sm:ring-2 ring-cyan-400/30'
                                : appTheme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                              }`}
                            style={{ backgroundColor: activeColor }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Quick Action Strip when element is selected */}
              {selectedLayerIds && selectedLayerIds.length > 0 && (
                <div
                  data-no-canvas-click="true"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="sm:hidden absolute bottom-3 left-3 z-40 pointer-events-auto flex items-center gap-2 p-1.5 px-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-2 duration-150"
                >
                  <button
                    type="button"
                    title="Duplicate Layer"
                    data-no-canvas-click="true"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateSelectedLayers();
                    }}
                    className="p-2 rounded-xl bg-cyan-500/20 active:bg-cyan-500/40 text-cyan-300 flex items-center justify-center shadow-sm active:scale-90 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete Layer"
                    data-no-canvas-click="true"
                    onPointerDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSelectedLayers();
                    }}
                    className="p-2 rounded-xl bg-rose-500/20 active:bg-rose-500/40 text-rose-300 flex items-center justify-center shadow-sm active:scale-90 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Gallery Card Safe Boundary Real-time Status Alert (ONLY active in Admin Gallery Edit Mode) */}
              {isGalleryAdminMode && showCardSafeZone && !exportProgress && (
                <div
                  className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 pointer-events-auto z-30 flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200"
                  style={{
                    backgroundColor: cardOverflowInfo.isOverflowing ? 'rgba(127, 29, 29, 0.94)' : 'rgba(15, 23, 42, 0.88)',
                    borderColor: cardOverflowInfo.isOverflowing ? '#ef4444' : 'rgba(168, 85, 247, 0.4)'
                  }}
                >
                  {cardOverflowInfo.isOverflowing ? (
                    <>
                      <span className="text-sm">⚠️</span>
                      <span className="text-xs font-semibold text-rose-200">
                        <strong>Card Border Warning:</strong> Element card border se bahar ho raha hai ({cardOverflowInfo.reasons.join(', ')})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          recordUndoRef.current?.();
                          setAdjustments(prev => ({ ...prev, translateX: 0, translateY: 0, translateZ: 0, scale: 1 }));
                          if (layerTransforms && Object.keys(layerTransforms).length > 0) {
                            setLayerTransforms({});
                          }
                        }}
                        className="ml-1 px-2.5 py-0.5 rounded-md bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow transition active:scale-95 cursor-pointer"
                        title="Reset position and scale to center of card"
                      >
                        Auto-Center
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-medium text-emerald-300">
                        <strong>Card Safe Zone:</strong> Element gallery card ke safe bounds me hai
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Draggable Divider Bar between Canvas and Settings (Mobile view only) */}
            {!isDesktopScreen && isStudioPanelOpen && (
              <div
                onPointerDown={handleStartResizeMobileCanvas}
                onTouchStart={handleStartResizeMobileCanvas}
                onDoubleClick={() => {
                  setMobileCanvasHeight(40);
                  try { localStorage.setItem('iconderry_mobile_canvas_height', '40'); } catch { }
                }}
                className={`w-full py-1.5 flex items-center justify-center cursor-row-resize select-none relative z-30 touch-none flex-shrink-0 border-y transition-colors ${
                  isResizingMobileCanvas
                    ? 'bg-cyan-500/25 border-cyan-500/60'
                    : appTheme === 'dark'
                      ? 'bg-[#15171e] border-[#22242c] active:bg-cyan-500/20'
                      : 'bg-slate-100 border-slate-300 active:bg-cyan-500/20'
                }`}
                title="Drag up/down to resize Canvas and Settings • Double-tap to reset (40%)"
              >
                <div
                  className={`rounded-full transition-all ${
                    isResizingMobileCanvas
                      ? 'w-16 h-1.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]'
                      : appTheme === 'dark'
                        ? 'w-12 h-1 bg-slate-500'
                        : 'w-12 h-1 bg-slate-400'
                  }`}
                />
              </div>
            )}

            {/* Draggable Sidebar Resizer Handle (VS Code style - Desktop only, active when drawer is open) */}
            {isDesktopScreen && isStudioPanelOpen && (
              <div
                onPointerDown={handleStartResizeSidebar}
                onDoubleClick={() => {
                  setSidebarWidth(480);
                  try { localStorage.setItem('iconderry_studio_sidebar_width', '480'); } catch { }
                }}
                className={`hidden lg:flex items-center justify-center relative select-none cursor-col-resize z-30 transition-all duration-150 group flex-shrink-0 border-l ${isResizingSidebar
                  ? 'w-2 bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                  : appTheme === 'dark'
                    ? 'w-2 bg-[#0b0f19] border-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500/60'
                    : 'w-2 bg-slate-100 border-slate-200 hover:bg-cyan-500/20 hover:border-cyan-500/60'
                  }`}
                title="Drag left/right to resize panel width • Double-click to reset (480px)"
              >
                {/* Center visual grip pill */}
                <div
                  className={`w-1 rounded-full transition-all duration-150 ${isResizingSidebar
                    ? 'h-16 bg-white shadow-md'
                    : appTheme === 'dark'
                      ? 'h-8 bg-slate-600 group-hover:h-12 group-hover:bg-cyan-400'
                      : 'h-8 bg-slate-400 group-hover:h-12 group-hover:bg-cyan-500'
                    }`}
                />
              </div>
            )}

            {/* Invisible overlay while resizing to prevent mouse/touch event loss */}
            {(isResizingSidebar || isResizingMobileCanvas) && (
              <div
                onPointerDown={(e) => e.preventDefault()}
                className={`fixed inset-0 z-50 select-none touch-none ${
                  isResizingMobileCanvas ? 'cursor-row-resize' : 'cursor-col-resize'
                }`}
              />
            )}

            {/* Studio Tools & Control Panel (Desktop: in-flow sliding width, Mobile: in-flow bottom container) */}
            <div
              style={
                isDesktopScreen
                  ? {
                      width: isStudioPanelOpen ? `${sidebarWidth}px` : '0px',
                      minWidth: isStudioPanelOpen ? '320px' : '0px',
                      maxWidth: '50%',
                      transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease'
                    }
                  : undefined
              }
              className={`flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
                isDesktopScreen
                  ? `h-full flex-shrink-0 z-20 border-l ${
                      isStudioPanelOpen
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8 pointer-events-none border-transparent'
                    }`
                  : `w-full flex-1 min-h-[140px] z-20 border-t ${
                      isStudioPanelOpen
                        ? 'flex opacity-100'
                        : 'hidden opacity-0 pointer-events-none'
                    }`
              } ${
                appTheme === 'dark' ? 'bg-[#0d1424] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Slide-out Drawer Header: Active Tool Title & Close 'X' Button */}
              <div
                className={`p-3 sm:p-3.5 border-b flex items-center justify-between flex-shrink-0 z-10 select-none ${
                  appTheme === 'dark' ? 'bg-[#090e1a] border-slate-800/90' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0 shadow-sm">
                    {(() => {
                      const curTab = STUDIO_TABS.find(t => t.id === studioTab);
                      const TabIcon = curTab?.icon || Sliders;
                      return <TabIcon className="w-4 h-4" />;
                    })()}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-xs sm:text-sm font-bold truncate flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {(() => {
                        switch (studioTab) {
                          case 'colors':
                          case 'adjustment': return 'Vector Colors';
                          case 'gradient': return 'Gradient Studio';
                          case 'layers': return 'Layers & Parts';
                          case 'text': return '3D Typography';
                          case 'shapes': return 'Shapes & Badges';
                          case 'draw': return 'Vector Brush & Draw';
                          case 'filters': return 'Color Filters';
                          case 'effects': return '3D Visual Effects';
                          case 'dimensions': return 'Canvas Dimensions';
                          case 'transform': return '3D Tilt & Perspective';
                          case 'gif': return 'Animated GIF Studio';
                          case 'export': return 'Export & Quality';
                          default: return 'Studio Controls';
                        }
                      })()}
                    </h3>
                    <p className={`text-[10px] truncate ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {(() => {
                        switch (studioTab) {
                          case 'colors':
                          case 'adjustment': return 'Recolor and tune vector paths';
                          case 'gradient': return 'Multi-color gradients & lighting';
                          case 'layers': return 'Order, group, and hierarchy';
                          case 'text': return 'Canva Pro 3D text & Google fonts';
                          case 'shapes': return '16 vector shapes & badges';
                          case 'draw': return 'Freehand vector drawing & glow';
                          case 'filters': return 'Color grading & aesthetic presets';
                          case 'effects': return 'Shadows, glow, and 3D depth';
                          case 'dimensions': return 'Resolution & canvas aspect ratio';
                          case 'transform': return 'Pitch, yaw, roll & isometric 3D';
                          case 'gif': return 'Seamless motion loop export';
                          case 'export': return 'PNG, SVG, WebP, JPEG, GIF (Up to 8K)';
                          default: return 'Adjust elements';
                        }
                      })()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStudioPanelOpen(false)}
                  className={`p-1.5 rounded-xl border transition-all flex items-center justify-center flex-shrink-0 cursor-pointer active:scale-95 ${
                    appTheme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-cyan-500/40'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Close panel (or click active tab in sidebar)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Tools Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-5 overscroll-contain smooth-scroll">
                {/* TAB 1: COLORS / ADJUSTMENT (PURE VECTOR COLOR STUDIO) */}
                {(studioTab === 'colors' || studioTab === 'adjustment') && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                              <Paintbrush className="w-3.5 h-3.5 text-cyan-500" /> Vector Color Studio
                            </h4>
                            <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Touch or click any element on the canvas or select a layer from below
                            </p>
                          </div>

                          <button
                            onClick={handleResetColorsPanel}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                              ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                              : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                              }`}
                            title="Reset all custom color replacements in this panel"
                          >
                            <Undo2 className="w-3 h-3 text-cyan-500" />
                            <span>Reset Colors</span>
                          </button>
                        </div>

                        {/* Active Selected Element Direct Editor Card */}
                        {(() => {
                          const activeIds = (selectedLayerIds && selectedLayerIds.length > 0)
                            ? selectedLayerIds
                            : (selectedLayerId ? [selectedLayerId] : []);
                          const primaryId = activeIds[0];
                          const cleanPrimaryId = primaryId ? String(primaryId).replace(/^pf_studio_/i, '') : null;
                          const numOnly = cleanPrimaryId ? cleanPrimaryId.replace(/\D/g, '') : null;
                          const activeLayer = cleanPrimaryId
                            ? svgLayers.find(l => l.id === cleanPrimaryId || l.id === primaryId || (numOnly && l.id === `layer_${numOnly}`))
                            : null;
                          const layerStyle = cleanPrimaryId ? (layerStyles[cleanPrimaryId] || layerStyles[primaryId] || {}) : {};
                          const currentLayerColor = layerStyle.fill || layerStyle.stroke || (activeLayer ? activeLayer.color : null);

                          const effectiveColor = (activeSelectedColor && adjustments.colorReplacements[activeSelectedColor.toLowerCase()])
                            || activeSelectedColor
                            || currentLayerColor
                            || (activeIds.length > 0 ? '#38bdf8' : null);

                          const originalColorDisplay = activeSelectedColor
                            || (activeLayer ? (activeLayer.color || '#38bdf8') : (effectiveColor || '#38bdf8'));

                          const hasCustomColor = (activeSelectedColor && !!adjustments.colorReplacements[activeSelectedColor.toLowerCase()])
                            || (activeIds.length > 0 && activeIds.some(id => {
                              const cid = String(id).replace(/^pf_studio_/i, '');
                              const s = layerStyles[cid] || layerStyles[id];
                              return s && (s.fill || s.stroke);
                            }));

                          const handleApplyColor = (newCol) => {
                            const norm = normalizeColor(newCol) || newCol;
                            if (activeSelectedColor) {
                              handleColorChange(activeSelectedColor, norm);
                            }
                            if (activeIds.length > 0) {
                              handleLayerColorChange(activeIds, norm);
                            } else if (!activeSelectedColor && originalColorDisplay) {
                              handleColorChange(originalColorDisplay, norm);
                            }
                          };

                          const handleResetEffectiveColor = () => {
                            if (activeSelectedColor) {
                              handleResetSingleColor(activeSelectedColor);
                            }
                            if (activeIds.length > 0) {
                              handleResetLayerColor(activeIds);
                            }
                          };

                          const isAnySelected = !!activeSelectedColor || activeIds.length > 0;

                          if (!isAnySelected || !effectiveColor) {
                            return (
                              <div className={`p-5 rounded-2xl border border-dashed text-center text-xs space-y-1 ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                                }`}>
                                <Sparkles className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                                <p className={`font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>Touch Element on Canvas</p>
                                <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Click or drag any element on the canvas to move, rotate, recolor, and style it.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className={`p-4 rounded-2xl border-2 shadow-xl space-y-3 animate-in fade-in duration-200 ${appTheme === 'dark'
                              ? 'bg-slate-900 border-cyan-400/80 shadow-cyan-500/10'
                              : 'bg-slate-50 border-cyan-500 shadow-cyan-500/10'
                              }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                                    {activeIds.length > 1
                                      ? `${activeIds.length} Parts Selected`
                                      : (activeLayer ? `${activeLayer.name}` : 'Active Selected Element')}
                                  </span>
                                  {activeLayer && activeIds.length <= 1 && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                      &lt;{activeLayer.tag}&gt;
                                    </span>
                                  )}
                                </div>

                                {hasCustomColor && (
                                  <button
                                    onClick={handleResetEffectiveColor}
                                    className={`text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-xl transition border ${appTheme === 'dark'
                                      ? 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'
                                      : 'text-slate-600 hover:text-slate-900 bg-white border-slate-300'
                                      }`}
                                  >
                                    <Undo2 className="w-3 h-3" /> Reset Color
                                  </button>
                                )}
                              </div>

                              {/* Color Preview, Picker & Hex */}
                              <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-11 h-11 rounded-xl border-2 border-slate-400 shadow-inner flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: effectiveColor }}
                                  />
                                  <div>
                                    <span className={`font-mono text-sm font-bold uppercase ${appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                                      }`}>
                                      {effectiveColor}
                                    </span>
                                    <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                      Original: <span className="font-mono uppercase">{originalColorDisplay}</span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <label className="cursor-pointer">
                                    <input
                                      type="color"
                                      value={effectiveColor.startsWith('#') ? effectiveColor : '#38bdf8'}
                                      onChange={(e) => handleApplyColor(e.target.value)}
                                      className="sr-only"
                                    />
                                    <div className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-600/30">
                                      <Paintbrush className="w-3.5 h-3.5" />
                                      <span>Pick</span>
                                    </div>
                                  </label>

                                  <input
                                    type="text"
                                    maxLength={7}
                                    value={effectiveColor.toUpperCase()}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (!val.startsWith('#')) val = '#' + val;
                                      handleApplyColor(val);
                                    }}
                                    className={`w-20 px-2 py-2 rounded-xl text-xs font-mono text-center uppercase focus:outline-none focus:border-cyan-500 border ${appTheme === 'dark'
                                      ? 'bg-slate-950 border-slate-800 text-slate-200'
                                      : 'bg-slate-100 border-slate-300 text-slate-800'
                                      }`}
                                  />
                                </div>
                              </div>

                              {/* 1-Tap Quick Swatches */}
                              <div className="space-y-1.5 pt-1">
                                <span className={`text-[10px] font-medium ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Quick Color Presets:
                                </span>
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                                  {QUICK_SWATCHES.map((swatch) => (
                                    <button
                                      key={swatch.hex}
                                      onClick={() => handleApplyColor(swatch.hex)}
                                      title={`${swatch.name} (${swatch.hex})`}
                                      className={`w-6 h-6 rounded-full border transition-all hover:scale-125 flex-shrink-0 ${effectiveColor.toLowerCase() === swatch.hex.toLowerCase()
                                        ? 'border-white scale-110 shadow-lg ring-2 ring-cyan-400'
                                        : appTheme === 'dark' ? 'border-slate-800 hover:border-slate-500' : 'border-slate-300 hover:border-slate-500'
                                        }`}
                                      style={{ backgroundColor: swatch.hex }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Part Styling, Effects & Transform Card (Single & Multi-Part Selection) */}
                        {(() => {
                          const activeIds = (selectedLayerIds && selectedLayerIds.length > 0)
                            ? selectedLayerIds
                            : (selectedLayerId ? [selectedLayerId] : []);
                          if (activeIds.length === 0) return null;

                          const isMulti = activeIds.length > 1;
                          const primaryId = activeIds[0];
                          const cleanPrimaryId = String(primaryId).replace(/^pf_studio_/i, '');
                          const numOnly = cleanPrimaryId.replace(/\D/g, '');
                          const activeLayer = svgLayers.find(l => l.id === cleanPrimaryId || l.id === primaryId || (numOnly && l.id === `layer_${numOnly}`)) || {
                            id: cleanPrimaryId || 'layer',
                            name: numOnly ? `Layer ${Number(numOnly) + 1}` : (cleanPrimaryId ? cleanPrimaryId.replace('_', ' ').toUpperCase() : 'Layer'),
                            tag: 'shape',
                            color: '#38bdf8'
                          };

                          const firstTransform = layerTransforms[cleanPrimaryId] || layerTransforms[primaryId] || (numOnly ? layerTransforms[`layer_${numOnly}`] : null) || { x: 0, y: 0, rotate: 0 };
                          const hasCustomTransform = activeIds.some(id => {
                            const cid = String(id).replace(/^pf_studio_/i, '');
                            const t = layerTransforms[cid] || layerTransforms[id];
                            return t && (t.x !== 0 || t.y !== 0 || t.rotate !== 0);
                          });

                          const firstStyle = layerStyles[cleanPrimaryId] || layerStyles[primaryId] || {};
                          const hasCustomColor = activeIds.some(id => {
                            const cid = String(id).replace(/^pf_studio_/i, '');
                            const s = layerStyles[cid] || layerStyles[id];
                            return s && (s.fill || s.stroke);
                          });
                          const currentColor = firstStyle.fill || firstStyle.stroke || (isMulti ? '#38bdf8' : (activeLayer.color || '#38bdf8'));

                          const glowEnabled = !!firstStyle.glow?.enabled;
                          const glowColor = firstStyle.glow?.color || '#38bdf8';
                          const glowRadius = firstStyle.glow?.radius !== undefined ? firstStyle.glow.radius : 12;
                          const currentOpacity = firstStyle.opacity !== undefined ? Math.round(Number(firstStyle.opacity) * 100) : 100;
                          const currentBlur = firstStyle.blur !== undefined ? Number(firstStyle.blur) : 0;
                          const currentBrightness = firstStyle.brightness !== undefined ? Number(firstStyle.brightness) : 100;

                          const hasCustomEffects = activeIds.some(id => {
                            const cid = String(id).replace(/^pf_studio_/i, '');
                            const s = layerStyles[cid] || layerStyles[id];
                            return s && (s.glow?.enabled || s.opacity !== undefined || s.blur !== undefined || s.brightness !== undefined);
                          });

                          const currentLayerIdx = layerOrder.findIndex(id => id === cleanPrimaryId || id === primaryId || (numOnly && id === `layer_${numOnly}`));
                          const totalLayers = layerOrder.length || svgLayers.length || 1;

                          // Adaptive coordinate span based on SVG viewBox dimensions
                          const maxOffset = (() => {
                            const vbMatch = selectedAsset?.svgCode?.match(/viewBox=["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
                            if (vbMatch) {
                              const w = parseFloat(vbMatch[3]);
                              const h = parseFloat(vbMatch[4]);
                              if (w > 0 && h > 0) return Math.round(Math.max(w, h) * 0.85);
                            }
                            return 200;
                          })();
                          const offsetStep = maxOffset <= 40 ? 0.5 : 1;

                          return (
                            <div className={`p-4 rounded-2xl border shadow-xl space-y-4 animate-in fade-in duration-200 ${appTheme === 'dark'
                              ? 'bg-slate-900/90 border-cyan-500/40 shadow-cyan-950/20'
                              : 'bg-white border-cyan-400/60 shadow-slate-200'
                              }`}>
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {isMulti ? (
                                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0">
                                      <Layers className="w-4 h-4 text-cyan-400" />
                                    </div>
                                  ) : (
                                    <div
                                      className="w-5 h-5 rounded-full border border-slate-600 shadow-sm flex-shrink-0"
                                      style={{ backgroundColor: currentColor }}
                                    />
                                  )}
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`text-xs font-bold ${appTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        {isMulti ? `${activeIds.length} Parts Selected` : activeLayer.name}
                                      </span>
                                      {!isMulti && (
                                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                          &lt;{activeLayer.tag}&gt;
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                      {isMulti ? 'Bulk edit color, effects & position' : `Layer ${currentLayerIdx >= 0 ? currentLayerIdx + 1 : 1} of ${totalLayers} • Drag on canvas`}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  {isMulti ? (
                                    <>
                                      <button
                                        onClick={handleSelectAllLayers}
                                        className={`text-[9px] px-2 py-1 rounded-lg border transition font-medium ${appTheme === 'dark'
                                          ? 'text-cyan-300 hover:text-white bg-cyan-950/50 border-cyan-700/50'
                                          : 'text-cyan-700 bg-cyan-50 border-cyan-300'
                                          }`}
                                      >
                                        All ({svgLayers.length})
                                      </button>
                                      <button
                                        onClick={handleDeselectAllLayers}
                                        className={`text-[9px] px-2 py-1 rounded-lg border transition font-medium ${appTheme === 'dark'
                                          ? 'text-slate-400 hover:text-white bg-slate-800/80 border-slate-700'
                                          : 'text-slate-600 bg-slate-100 border-slate-200'
                                          }`}
                                      >
                                        Clear
                                      </button>
                                    </>
                                  ) : (
                                    (hasCustomTransform || hasCustomColor || hasCustomEffects) && (
                                      <button
                                        onClick={() => {
                                          handleResetLayerTransform(activeIds);
                                          handleResetLayerColor(activeIds);
                                          handleResetLayerEffects(activeIds);
                                        }}
                                        className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded-lg border transition ${appTheme === 'dark'
                                          ? 'text-slate-400 hover:text-white bg-slate-800/80 border-slate-700'
                                          : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
                                          }`}
                                        title="Reset this part to default style and position"
                                      >
                                        <RotateCcw className="w-3 h-3 text-cyan-400" />
                                        <span>Reset Part</span>
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Canvas Drag Hint */}
                              <div className={`p-2 rounded-xl text-[10px] flex items-center justify-between border ${appTheme === 'dark'
                                ? 'bg-cyan-950/20 text-cyan-300 border-cyan-800/30'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                }`}>
                                <span className="flex items-center gap-1.5 font-medium">
                                  <Move className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                  {isMulti ? 'Drag on canvas — all selected parts will move together!' : 'Click and drag on canvas to reposition this part!'}
                                </span>
                                {(firstTransform.x !== 0 || firstTransform.y !== 0) && (
                                  <span className="font-mono font-bold text-cyan-400">
                                    X: {firstTransform.x}px, Y: {firstTransform.y}px
                                  </span>
                                )}
                              </div>

                              {/* SPECIAL EFFECTS SECTION (Glow Aura, Opacity, Blur, Brightness) */}
                              <div className="space-y-3 pt-1 border-t border-slate-800/60">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className="flex items-center gap-1.5 text-cyan-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Part Special Effects</span>
                                  </span>
                                  {hasCustomEffects && (
                                    <button
                                      onClick={() => handleResetLayerEffects(activeIds)}
                                      className={`text-[9px] px-1.5 py-0.5 rounded border transition ${appTheme === 'dark' ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                      Reset Effects
                                    </button>
                                  )}
                                </div>

                                {/* Part Glow Slider */}
                                <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="text-slate-400 font-medium">Part Glow:</span>
                                    <div className="flex items-center gap-1.5">
                                      <input
                                        type="color"
                                        value={glowColor}
                                        onChange={(e) => handleLayerEffectChange(activeIds, 'glow', { color: e.target.value, enabled: true })}
                                        className="w-3.5 h-3.5 rounded-full cursor-pointer bg-transparent border-0 p-0"
                                        title="Pick Part Glow Color"
                                      />
                                      <span className="font-mono text-cyan-400 font-bold">{glowEnabled ? glowRadius : 0}px</span>
                                    </div>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="60"
                                    value={glowEnabled ? glowRadius : 0}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      handleLayerEffectChange(activeIds, 'glow', {
                                        enabled: val > 0,
                                        radius: val,
                                        color: glowColor
                                      });
                                    }}
                                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                  />
                                </div>

                                {/* Opacity Slider */}
                                <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="text-slate-400 font-medium">Part Opacity:</span>
                                    <span className="font-mono text-cyan-400 font-bold">{currentOpacity}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentOpacity}
                                    onChange={(e) => handleLayerEffectChange(activeIds, 'opacity', Number(e.target.value) / 100)}
                                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                  />
                                </div>

                                {/* Blur Slider */}
                                <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="text-slate-400 font-medium">Part Blur:</span>
                                    <span className="font-mono text-cyan-400 font-bold">{currentBlur}px</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    value={currentBlur}
                                    onChange={(e) => handleLayerEffectChange(activeIds, 'blur', Number(e.target.value))}
                                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                  />
                                </div>

                                {/* Brightness Slider */}
                                <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                  <div className="flex items-center justify-between text-[10px] mb-1">
                                    <span className="text-slate-400 font-medium">Part Brightness:</span>
                                    <span className="font-mono text-cyan-400 font-bold">{currentBrightness}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="20"
                                    max="200"
                                    value={currentBrightness}
                                    onChange={(e) => handleLayerEffectChange(activeIds, 'brightness', Number(e.target.value))}
                                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                  />
                                </div>
                              </div>

                              {/* 3. POSITION (X / Y / Z) CONTROLS */}
                              <div className="space-y-2.5 pt-1 border-t border-slate-800/60">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className={appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                                    {isMulti ? 'Move Selected Parts (Offset X / Y / Depth Z)' : 'Part Position (X / Y / Depth Z)'}
                                  </span>
                                  <button
                                    onClick={() => {
                                      handleLayerPositionChange(activeIds, 'x', 0);
                                      handleLayerPositionChange(activeIds, 'y', 0);
                                      handleLayerPositionChange(activeIds, 'z', 0);
                                    }}
                                    className={`text-[9px] px-1.5 py-0.5 rounded border transition ${appTheme === 'dark' ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-600 hover:text-slate-900'
                                      }`}
                                  >
                                    Center (0, 0, 0)
                                  </button>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5">
                                  {/* X Axis */}
                                  <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center justify-between text-[10px] mb-1">
                                      <span className="text-slate-400 font-medium">Offset X:</span>
                                      <span className="font-mono text-cyan-400 font-bold">{firstTransform.x || 0}px</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={-maxOffset}
                                      max={maxOffset}
                                      step={offsetStep}
                                      value={firstTransform.x || 0}
                                      onChange={(e) => handleLayerPositionChange(activeIds, 'x', e.target.value)}
                                      className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                    />
                                  </div>

                                  {/* Y Axis */}
                                  <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center justify-between text-[10px] mb-1">
                                      <span className="text-slate-400 font-medium">Offset Y:</span>
                                      <span className="font-mono text-emerald-400 font-bold">{firstTransform.y || 0}px</span>
                                    </div>
                                    <input
                                      type="range"
                                      min={-maxOffset}
                                      max={maxOffset}
                                      step={offsetStep}
                                      value={firstTransform.y || 0}
                                      onChange={(e) => handleLayerPositionChange(activeIds, 'y', e.target.value)}
                                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                    />
                                  </div>

                                  {/* Z Axis Depth */}
                                  <div className={`p-2 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center justify-between text-[10px] mb-1">
                                      <span className="text-slate-400 font-medium">Depth Z:</span>
                                      <span className="font-mono text-purple-400 font-bold">{firstTransform.z || 0}px</span>
                                    </div>
                                    <input
                                      type="range"
                                      min="-200"
                                      max="200"
                                      step="2"
                                      value={firstTransform.z || 0}
                                      onChange={(e) => handleLayerPositionChange(activeIds, 'z', e.target.value)}
                                      className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* 4. ROTATION CONTROLS */}
                              <div className="space-y-2 pt-1 border-t border-slate-800/60">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                  <span className={appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                                    {isMulti ? 'Rotate Selected Parts' : 'Part Rotation'}
                                  </span>
                                  <span className="font-mono text-cyan-400 text-xs font-bold">
                                    {firstTransform.rotate || 0}&deg;
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    step="1"
                                    value={firstTransform.rotate || 0}
                                    onChange={(e) => handleLayerRotationChange(activeIds, e.target.value)}
                                    className="flex-1 accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                  />
                                  <div className="flex items-center gap-1">
                                    {[-90, 0, 90].map((deg) => (
                                      <button
                                        key={deg}
                                        onClick={() => handleLayerRotationChange(activeIds, deg)}
                                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border transition ${(firstTransform.rotate || 0) === deg
                                          ? 'bg-cyan-500 text-white border-cyan-400'
                                          : appTheme === 'dark' ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white' : 'bg-slate-100 text-slate-700 border-slate-200'
                                          }`}
                                      >
                                        {deg === 0 ? '0°' : `${deg > 0 ? '+' : ''}${deg}°`}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                            </div>
                          );
                        })()}

                        {/* Detected Vector Colors List */}
                        {detectedColors.length > 0 && (
                          <div className={`rounded-2xl border overflow-hidden shadow-md ${appTheme === 'dark' ? 'border-slate-800 bg-[#131b2e]/50' : 'border-slate-200 bg-slate-50'
                            }`}>
                            <button
                              onClick={() => setIsLayersListExpanded(!isLayersListExpanded)}
                              className={`w-full p-3.5 flex items-center justify-between text-left transition text-xs font-semibold ${appTheme === 'dark' ? 'hover:bg-slate-900/60 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-cyan-500" />
                                <span>Detected Vector Colors</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${appTheme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                  {detectedColors.length}
                                </span>
                              </div>
                              <div className={`flex items-center gap-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                <span className="text-[10px] font-normal">
                                  {isLayersListExpanded ? 'Hide List' : 'Show All'}
                                </span>
                                {isLayersListExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-cyan-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </button>

                            {/* Collapsible Colors List */}
                            {isLayersListExpanded && (
                              <div className={`p-3.5 pt-2 space-y-2 border-t ${appTheme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'
                                }`}>
                                <div className="space-y-2">
                                  {detectedColors.map((item, idx) => {
                                    const origColor = item.color;
                                    const activeColor = adjustments.colorReplacements[origColor.toLowerCase()] || origColor;
                                    const isModified = Boolean(adjustments.colorReplacements[origColor.toLowerCase()]);
                                    const isSelected = activeSelectedColor?.toLowerCase() === origColor.toLowerCase();

                                    return (
                                      <div
                                        key={origColor + idx}
                                        onClick={() => {
                                          setActiveSelectedColor(origColor);
                                        }}
                                        className={`p-3 rounded-xl border transition-all cursor-pointer ${isSelected
                                          ? appTheme === 'dark' ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg' : 'bg-white border-cyan-500 ring-2 ring-cyan-500/30 shadow-md'
                                          : isModified
                                            ? appTheme === 'dark' ? 'bg-slate-900/80 border-cyan-500/40' : 'bg-cyan-50/50 border-cyan-300'
                                            : appTheme === 'dark' ? 'bg-[#0b0f19]/70 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                                          }`}
                                      >
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                          <div className="flex items-center gap-2.5">
                                            <div
                                              className="w-7 h-7 rounded-lg border shadow flex-shrink-0"
                                              style={{ backgroundColor: activeColor }}
                                            />
                                            <div>
                                              <div className="flex items-center gap-1.5">
                                                <span className={`font-mono text-xs font-bold uppercase ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                                                  }`}>
                                                  {activeColor}
                                                </span>
                                                {isSelected && (
                                                  <span className="text-[8px] font-semibold bg-cyan-500/20 text-cyan-600 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                                    Active ✨
                                                  </span>
                                                )}
                                              </div>
                                              <span className={`text-[9px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                Orig: {origColor} &bull; {item.count} layer{item.count > 1 ? 's' : ''}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <label className="cursor-pointer">
                                              <input
                                                type="color"
                                                value={activeColor}
                                                onChange={(e) => handleColorChange(origColor, e.target.value)}
                                                className="sr-only"
                                              />
                                              <div className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${appTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                }`}>
                                                Pick
                                              </div>
                                            </label>
                                            {isModified && (
                                              <button
                                                onClick={() => handleResetSingleColor(origColor)}
                                                title="Reset layer"
                                                className={`p-1 rounded-lg ${appTheme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                                                  }`}
                                              >
                                                <Undo2 className="w-3 h-3" />
                                              </button>
                                            )}
                                          </div>
                                        </div>

                                        {/* Quick dots */}
                                        <div className={`flex items-center gap-1 pt-1.5 border-t overflow-x-auto no-scrollbar ${appTheme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'
                                          }`} onClick={(e) => e.stopPropagation()}>
                                          {QUICK_SWATCHES.map((swatch) => (
                                            <button
                                              key={swatch.hex}
                                              onClick={() => handleColorChange(origColor, swatch.hex)}
                                              className="w-4 h-4 rounded-full border border-slate-400/40 hover:scale-125 transition-transform flex-shrink-0"
                                              style={{ backgroundColor: swatch.hex }}
                                              title={swatch.name}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Global Monotone Recolor Override */}
                        <div className={`mt-4 p-3.5 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>Global Monotone Recolor</p>
                              <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Pure solid monochrome tint for all paths</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={adjustments.customColor || '#38bdf8'}
                                onChange={(e) => setAdjustments({ ...adjustments, customColor: e.target.value })}
                                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                title="Global Custom Color"
                              />
                              {adjustments.customColor && (
                                <button
                                  onClick={() => setAdjustments({ ...adjustments, customColor: '' })}
                                  className={`text-[10px] px-2 py-1 rounded ${appTheme === 'dark' ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-200'
                                    }`}
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                      </div>
                    </div>
                  )}

                                {/* DEDICATED TAB: GRADIENT STUDIO */}
                {studioTab === 'gradient' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Palette className="w-3.5 h-3.5 text-cyan-400" /> Gradient Studio
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Multi-color blend gradients &amp; fine color grading
                        </p>
                      </div>

                      <button
                        onClick={handleResetEffectsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${appTheme === 'dark'
                          ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        title="Reset all gradient and grading sliders"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* Gradient Target Selector: Icon Fill vs Badge Background */}
                    <div className={`p-1 rounded-xl flex items-center border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                      <button
                        type="button"
                        onClick={() => setGradientTarget('icon')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          gradientTarget === 'icon'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Icon Vector Fill</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${iconGradientEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setGradientTarget('badge')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          gradientTarget === 'badge'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Badge Background</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${bgGradientEnabled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      </button>
                    </div>

                    {/* Gradient Target & Toggle Card */}
                    <div className={`p-3.5 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={`text-xs font-bold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                            {gradientTarget === 'icon' ? 'Icon Vector Gradient' : 'Badge Background Gradient'}
                          </span>
                          <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {gradientTarget === 'icon' ? 'Applies smooth gradient fill & stroke directly to the icon artwork' : 'Applies linear gradient to container badge shape'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (gradientTarget === 'icon') {
                              setIconGradientEnabled(!iconGradientEnabled);
                            } else {
                              if (bgShape === 'none') setBgShape('rounded-square');
                              setBgGradientEnabled(!bgGradientEnabled);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                            (gradientTarget === 'icon' ? iconGradientEnabled : bgGradientEnabled)
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                              : appTheme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${(gradientTarget === 'icon' ? iconGradientEnabled : bgGradientEnabled) ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                          <span>{(gradientTarget === 'icon' ? iconGradientEnabled : bgGradientEnabled) ? 'Enabled' : 'Disabled'}</span>
                        </button>
                      </div>

                      {/* 12 One-Click Rich Gradient Presets Grid */}
                      <div className="pt-2 border-t border-slate-700/40">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block mb-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Gradient Presets ({GRADIENT_PRESETS.length})
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {GRADIENT_PRESETS.map((gp) => {
                            const isMatch = gradientFrom === gp.from && gradientTo === gp.to;
                            return (
                              <button
                                key={gp.id}
                                type="button"
                                onClick={() => {
                                  setGradientFrom(gp.from);
                                  setGradientTo(gp.to);
                                  setGradientAngle(gp.angle);
                                  if (gradientTarget === 'icon') {
                                    setIconGradientEnabled(true);
                                  } else {
                                    if (bgShape === 'none') setBgShape('rounded-square');
                                    setBgGradientEnabled(true);
                                  }
                                }}
                                className={`h-11 px-2.5 rounded-xl text-left border transition flex items-center gap-2 group relative overflow-hidden ${isMatch
                                  ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-md'
                                  : appTheme === 'dark' ? 'border-slate-800 hover:border-slate-700 bg-slate-900/60' : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                              >
                                <span
                                  className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border border-white/20"
                                  style={{ background: `linear-gradient(${gp.angle}deg, ${gp.from}, ${gp.to})` }}
                                />
                                <span className="text-[11px] font-semibold truncate text-white">{gp.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Colors & Angle Controls */}
                      <div className="space-y-3 pt-3 border-t border-slate-700/40">
                        <div className="flex items-center justify-between gap-3">
                          {/* Color 1 */}
                          <div className="flex-1">
                            <span className={`text-[10px] font-semibold block mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Start Color
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={gradientFrom}
                                onChange={(e) => {
                                  setGradientFrom(e.target.value);
                                  if (gradientTarget === 'icon') {
                                    setIconGradientEnabled(true);
                                  } else {
                                    if (bgShape === 'none') setBgShape('rounded-square');
                                    setBgGradientEnabled(true);
                                  }
                                }}
                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                              />
                              <input
                                type="text"
                                value={gradientFrom}
                                onChange={(e) => setGradientFrom(e.target.value)}
                                className={`w-20 px-2 py-1 rounded text-xs font-mono uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                              />
                            </div>
                          </div>

                          {/* Swap Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const tmp = gradientFrom;
                              setGradientFrom(gradientTo);
                              setGradientTo(tmp);
                            }}
                            className={`p-2 rounded-xl border mt-3 transition ${appTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                            title="Swap gradient start and end colors"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {/* Color 2 */}
                          <div className="flex-1">
                            <span className={`text-[10px] font-semibold block mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              End Color
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={gradientTo}
                                onChange={(e) => {
                                  setGradientTo(e.target.value);
                                  if (gradientTarget === 'icon') {
                                    setIconGradientEnabled(true);
                                  } else {
                                    if (bgShape === 'none') setBgShape('rounded-square');
                                    setBgGradientEnabled(true);
                                  }
                                }}
                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                              />
                              <input
                                type="text"
                                value={gradientTo}
                                onChange={(e) => setGradientTo(e.target.value)}
                                className={`w-20 px-2 py-1 rounded text-xs font-mono uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Angle Slider & Quick Angle Snaps */}
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Gradient Direction Angle</span>
                            <span className="text-cyan-400 font-mono font-semibold">{gradientAngle}&deg;</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={gradientAngle}
                            onChange={(e) => setGradientAngle(Number(e.target.value))}
                            className="theme-slider w-full mb-2"
                          />
                          <div className="grid grid-cols-6 gap-1">
                            {[0, 45, 90, 135, 180, 270].map(deg => (
                              <button
                                key={deg}
                                type="button"
                                onClick={() => setGradientAngle(deg)}
                                className={`py-1 rounded-lg border text-xs font-mono font-semibold transition ${gradientAngle === deg
                                  ? 'bg-blue-600 text-white border-blue-400 shadow'
                                  : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                              >
                                {deg}&deg;
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fine Color Grading Sliders */}
                    <div className={`p-4 rounded-2xl border space-y-4 ${appTheme === 'dark' ? 'bg-[#131b2e]/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <h5 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        <Sliders className="w-3.5 h-3.5 text-cyan-500" /> Color Grading &amp; Filter Sliders
                      </h5>

                      {/* Hue Shift */}
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span>Hue Shift (Color Spectrum)</span>
                          <span className="text-cyan-500 font-mono font-semibold">{adjustments.hue}&deg;</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={adjustments.hue}
                          onChange={(e) => setAdjustments({ ...adjustments, hue: Number(e.target.value) })}
                          className="hue-slider w-full"
                        />
                      </div>

                      {/* Saturation & Contrast */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Saturation</span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.saturation}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="200"
                            value={adjustments.saturation}
                            onChange={(e) => setAdjustments({ ...adjustments, saturation: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>

                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Contrast</span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.contrast}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="200"
                            value={adjustments.contrast}
                            onChange={(e) => setAdjustments({ ...adjustments, contrast: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>
                      </div>

                      {/* Brightness & Opacity */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Brightness</span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.brightness}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="160"
                            value={adjustments.brightness}
                            onChange={(e) => setAdjustments({ ...adjustments, brightness: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>

                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Opacity</span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.opacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={adjustments.opacity}
                            onChange={(e) => setAdjustments({ ...adjustments, opacity: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>
                      </div>

                      {/* Soft Blur */}
                      <div>
                        <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span>Soft Blur Effect</span>
                          <span className="text-cyan-500 font-mono font-semibold">{adjustments.blur}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={adjustments.blur}
                          onChange={(e) => setAdjustments({ ...adjustments, blur: Number(e.target.value) })}
                          className="theme-slider w-full"
                        />
                      </div>

                      {/* Glow Effect Slider (Supports selected layer / item and overall glow aura) */}
                      {(() => {
                        const activeSelectedIds = (selectedLayerIds && selectedLayerIds.length > 0)
                          ? selectedLayerIds
                          : (selectedLayerId ? [selectedLayerId] : []);
                        const isPartSelected = activeSelectedIds.length > 0;
                        const primarySelectedId = isPartSelected ? activeSelectedIds[0] : null;
                        const cleanPrimaryId = primarySelectedId ? String(primarySelectedId).replace(/^pf_studio_/i, '') : null;
                        const numOnly = cleanPrimaryId ? cleanPrimaryId.replace(/\D/g, '') : '';

                        const primaryStyle = cleanPrimaryId
                          ? (layerStyles[cleanPrimaryId] || layerStyles[primarySelectedId] || (numOnly ? layerStyles[`layer_${numOnly}`] : null) || {})
                          : {};

                        const activeGlowColor = isPartSelected
                          ? (primaryStyle.glow?.color || adjustments.shadowColor || '#38bdf8')
                          : (adjustments.shadowColor || '#38bdf8');

                        const activeGlowRadius = isPartSelected
                          ? (primaryStyle.glow?.radius !== undefined
                              ? (primaryStyle.glow?.enabled !== false ? Number(primaryStyle.glow.radius) : 0)
                              : 0)
                          : (adjustments.shadowBlur || 0);

                        return (
                          <div>
                            <div className={`flex items-center justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span className="flex items-center gap-1.5 font-medium">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                <span>{isPartSelected ? 'Selected Item Glow' : 'Glow Effect (Aura)'}</span>
                                {isPartSelected && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/15 text-cyan-400 font-mono font-semibold">
                                    {activeSelectedIds.length > 1 ? `${activeSelectedIds.length} Selected` : 'Selected'}
                                  </span>
                                )}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1" title="Pick Glow Color">
                                  <input
                                    type="color"
                                    value={activeGlowColor}
                                    onChange={(e) => {
                                      const color = e.target.value;
                                      if (isPartSelected) {
                                        handleLayerEffectChange(activeSelectedIds, 'glow', { color, enabled: true });
                                      } else {
                                        setAdjustments(prev => ({ ...prev, shadowColor: color }));
                                      }
                                    }}
                                    className="w-4 h-4 rounded-full cursor-pointer bg-transparent border-0 p-0"
                                  />
                                </div>
                                <span className="text-cyan-500 font-mono font-semibold">
                                  {activeGlowRadius}px
                                </span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="60"
                              value={activeGlowRadius}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                if (isPartSelected) {
                                  handleLayerEffectChange(activeSelectedIds, 'glow', {
                                    enabled: val > 0,
                                    radius: val,
                                    color: activeGlowColor
                                  });
                                } else {
                                  setAdjustments(prev => ({ ...prev, shadowBlur: val }));
                                }
                              }}
                              className="theme-slider w-full cursor-pointer"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* DEDICATED TAB: LAYERS STUDIO */}
                {studioTab === 'layers' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Layers className="w-3.5 h-3.5 text-cyan-400" /> Vector Parts &amp; Layers
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {svgLayers.length} vector elements • Reorder, duplicate, stack &amp; manage
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsAddElementModalOpen(true)}
                          className={`text-xs px-2.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition ${appTheme === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25'
                            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                            }`}
                          title="Add another element from library"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Add Part</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Selected Layer Z-Index & Hierarchy Controls */}
                    {(() => {
                      const activeIds = (selectedLayerIds && selectedLayerIds.length > 0)
                        ? selectedLayerIds
                        : (selectedLayerId ? [selectedLayerId] : []);
                      const primaryId = activeIds[0];
                      const cleanPrimaryId = primaryId ? String(primaryId).replace(/^pf_studio_/i, '') : null;
                      const currentLayerIdx = cleanPrimaryId ? svgLayers.findIndex(l => l.id === cleanPrimaryId || l.id === primaryId) : -1;
                      const isMulti = activeIds.length > 1;

                      if (!primaryId) {
                        return (
                          <div className={`p-4 rounded-2xl border border-dashed text-center text-xs space-y-1 ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'}`}>
                            <MousePointer className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                            <p className="font-semibold text-slate-200">Tap Any Layer to Reorder &amp; Manage</p>
                            <p className="text-[11px] text-slate-400">Click any layer in canvas or list below to reorder depth, duplicate, transform or delete</p>
                          </div>
                        );
                      }

                      return (
                        <div className={`p-3.5 rounded-2xl border space-y-2.5 ${appTheme === 'dark' ? 'bg-slate-900/80 border-cyan-500/30' : 'bg-slate-50 border-cyan-400'}`}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-cyan-400 flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                              Selected: {isMulti ? `${activeIds.length} Layers Selected` : (svgLayers[currentLayerIdx]?.name || cleanPrimaryId)}
                            </span>
                            {!isMulti && (
                              <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                                Depth {currentLayerIdx + 1} of {svgLayers.length}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            <button
                              onClick={() => handleBringToFront(cleanPrimaryId)}
                              disabled={currentLayerIdx >= svgLayers.length - 1}
                              title="Bring to absolute front"
                              className={`py-2 px-1 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 border transition ${currentLayerIdx >= svgLayers.length - 1
                                ? 'opacity-40 cursor-not-allowed border-transparent'
                                : appTheme === 'dark' ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                            >
                              <ChevronsUp className="w-3.5 h-3.5 text-cyan-400" />
                              <span>To Front</span>
                            </button>

                            <button
                              onClick={() => handleBringForward(cleanPrimaryId)}
                              disabled={currentLayerIdx >= svgLayers.length - 1}
                              title="Bring forward one level"
                              className={`py-2 px-1 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 border transition ${currentLayerIdx >= svgLayers.length - 1
                                ? 'opacity-40 cursor-not-allowed border-transparent'
                                : appTheme === 'dark' ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Forward</span>
                            </button>

                            <button
                              onClick={() => handleSendBackward(cleanPrimaryId)}
                              disabled={currentLayerIdx <= 0}
                              title="Send backward one level"
                              className={`py-2 px-1 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 border transition ${currentLayerIdx <= 0
                                ? 'opacity-40 cursor-not-allowed border-transparent'
                                : appTheme === 'dark' ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Backward</span>
                            </button>

                            <button
                              onClick={() => handleSendToBack(cleanPrimaryId)}
                              disabled={currentLayerIdx <= 0}
                              title="Send to absolute back"
                              className={`py-2 px-1 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 border transition ${currentLayerIdx <= 0
                                ? 'opacity-40 cursor-not-allowed border-transparent'
                                : appTheme === 'dark' ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                            >
                              <ChevronsDown className="w-3.5 h-3.5 text-cyan-400" />
                              <span>To Back</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Vector Shape Layers in Hierarchy Order (Drag & Drop Reorder) */}
                    <div className={`p-3.5 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <GripVertical className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Drag layer up or down to reorder</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-semibold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                            Top = Front
                          </span>
                          <button
                            onClick={() => {
                              setSelectedLayerIds(svgLayers.map(l => l.id));
                              setSelectedLayerId(svgLayers[0]?.id || null);
                            }}
                            className="text-[10px] text-cyan-400 hover:underline font-normal"
                          >
                            Select All
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => {
                              setSelectedLayerIds([]);
                              setSelectedLayerId(null);
                              setTransformBox(null);
                            }}
                            className="text-[10px] text-slate-400 hover:text-white font-normal"
                          >
                            Deselect
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 select-none max-h-[460px] overflow-y-auto pr-1">
                        {[...layerOrder].reverse().filter(id => !deletedLayerIds.includes(id)).map((layerId, displayIdx) => {
                          const layerObj = allSvgLayers.find(l => l.id === layerId) || {
                            id: layerId,
                            name: layerId.replace('_', ' ').toUpperCase(),
                            tag: 'shape',
                            color: '#38bdf8'
                          };
                          const isSelected = selectedLayerId === layerId || (selectedLayerIds && selectedLayerIds.includes(layerId));
                          const transform = layerTransforms[layerId] || { x: 0, y: 0, rotate: 0 };
                          const isMoved = transform.x !== 0 || transform.y !== 0;
                          const isRotated = transform.rotate !== 0;
                          const isDragging = draggedLayerIdx === displayIdx;
                          const isDragOver = dragOverLayerIdx === displayIdx && draggedLayerIdx !== displayIdx;

                          return (
                            <div
                              key={layerId}
                              draggable={true}
                              onDragStart={(e) => {
                                setDraggedLayerIdx(displayIdx);
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', String(displayIdx));
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                if (dragOverLayerIdx !== displayIdx) {
                                  setDragOverLayerIdx(displayIdx);
                                }
                              }}
                              onDragLeave={(e) => {
                                if (e.currentTarget.contains(e.relatedTarget)) return;
                                if (dragOverLayerIdx === displayIdx) {
                                  setDragOverLayerIdx(null);
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleReorderLayers(draggedLayerIdx, displayIdx);
                                setDraggedLayerIdx(null);
                                setDragOverLayerIdx(null);
                              }}
                              onDragEnd={() => {
                                setDraggedLayerIdx(null);
                                setDragOverLayerIdx(null);
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setSelectedLayerId(layerId);
                                setSelectedLayerIds([layerId]);
                              }}
                              onClick={(e) => {
                                const currentGroups = layerGroupsRef.current || {};
                                const belongingGroup = Object.values(currentGroups).find(ids => ids.includes(layerId));
                                if (belongingGroup) {
                                  if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                    setSelectedLayerIds(prev =>
                                      belongingGroup.every(x => prev.includes(x))
                                        ? prev.filter(x => !belongingGroup.includes(x))
                                        : Array.from(new Set([...prev, ...belongingGroup]))
                                    );
                                    setSelectedLayerId(belongingGroup[0]);
                                  } else {
                                    if (selectedLayerIds && selectedLayerIds.length === 1 && selectedLayerIds[0] === layerId) {
                                      setSelectedLayerId(layerId);
                                      setSelectedLayerIds([layerId]);
                                    } else {
                                      setSelectedLayerId(belongingGroup[0]);
                                      setSelectedLayerIds(belongingGroup);
                                    }
                                  }
                                } else {
                                  if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                    setSelectedLayerIds(prev =>
                                      prev.includes(layerId) ? prev.filter(x => x !== layerId) : [...prev, layerId]
                                    );
                                    setSelectedLayerId(layerId);
                                  } else {
                                    setSelectedLayerId(layerId);
                                    setSelectedLayerIds([layerId]);
                                  }
                                }
                              }}
                              className={`p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-2.5 select-none relative ${isDragging
                                ? 'opacity-30 scale-[0.98] border-dashed border-cyan-400 bg-cyan-950/20'
                                : isDragOver
                                  ? 'ring-2 ring-cyan-400 bg-cyan-500/20 border-cyan-400 shadow-lg scale-[1.01]'
                                  : isSelected
                                    ? appTheme === 'dark'
                                      ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                                      : 'bg-white border-cyan-500 ring-2 ring-cyan-500/30 shadow-md'
                                    : isMoved || isRotated
                                      ? appTheme === 'dark' ? 'bg-slate-900/80 border-cyan-500/40' : 'bg-cyan-50/50 border-cyan-300'
                                      : appTheme === 'dark' ? 'bg-[#0b0f19]/70 border-slate-800/80 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pointer-events-none">
                                <GripVertical className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                <div
                                  className="w-5 h-5 rounded-md border shadow flex-shrink-0"
                                  style={{ backgroundColor: layerObj.color || '#38bdf8' }}
                                />
                                <div className="truncate">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`text-xs font-semibold truncate ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                                      {layerObj.name}
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-500">
                                      &lt;{layerObj.tag}&gt;
                                    </span>
                                    {isSelected && (
                                      <span className="text-[8px] font-semibold bg-cyan-500/20 text-cyan-400 px-1 py-0.5 rounded border border-cyan-500/30">
                                        Selected
                                      </span>
                                    )}
                                  </div>
                                  {(isMoved || isRotated) && (
                                    <div className="text-[9px] text-cyan-400 font-mono">
                                      {isMoved ? `Δ(${transform.x}, ${transform.y})` : ''} {isRotated ? `${transform.rotate}°` : ''}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    handleDuplicateSelectedLayers([layerId]);
                                  }}
                                  title="Duplicate part (Ctrl + D)"
                                  className={`p-1 rounded hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition`}
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteSelectedLayers([layerId]);
                                  }}
                                  title="Delete part"
                                  className={`p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleBringForward(layerId)}
                                  title="Move layer up (1 step forward)"
                                  className={`p-1 rounded hover:bg-slate-700/60 ${appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSendBackward(layerId)}
                                  title="Move layer down (1 step backward)"
                                  className={`p-1 rounded hover:bg-slate-700/60 ${appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* DEDICATED TAB: 3D TEXT & TYPOGRAPHY STUDIO */}
                {studioTab === 'text' && (() => {
                  const selectedCanvasText = customCanvasObjects.find(
                    (obj) => obj.id === selectedLayerId && obj.type === 'text'
                  );

                  return (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Type className="w-3.5 h-3.5 text-cyan-400" /> 3D Typography Studio
                          </h4>
                          <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Google Fonts, 3D extruded styling &amp; word art
                          </p>
                        </div>
                      </div>

                      {/* If a Text Layer is currently selected, show Text Inspector */}
                      {selectedCanvasText ? (
                        <div className={`p-4 rounded-2xl border space-y-3.5 ${appTheme === 'dark' ? 'bg-[#131b2e]/70 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'bg-blue-50/50 border-blue-200'}`}>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                              <Type className="w-3.5 h-3.5" /> Editing Selected Text
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const dup = {
                                    ...selectedCanvasText,
                                    id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                                    name: `${selectedCanvasText.name} (Copy)`,
                                    y: selectedCanvasText.y + 20
                                  };
                                  setCustomCanvasObjects(prev => [...prev, dup]);
                                  setSelectedLayerId(dup.id);
                                  setSelectedLayerIds([dup.id]);
                                }}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition ${appTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                                title="Duplicate this text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCanvasObject(selectedCanvasText.id)}
                                className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition"
                                title="Delete this text"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Text Value Input */}
                          <div>
                            <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Text Content
                            </label>
                            <input
                              type="text"
                              value={selectedCanvasText.text || ''}
                              onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { text: e.target.value })}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                              placeholder="Enter text..."
                            />
                          </div>

                          {/* Font Family Dropdown */}
                          <div>
                            <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Google Font Family
                            </label>
                            <select
                              value={selectedCanvasText.font || 'Outfit'}
                              onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { font: e.target.value })}
                              className={`w-full px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                            >
                              {GOOGLE_FONTS_LIST.map((f) => (
                                <option key={f.name} value={f.family}>
                                  {f.name} ({f.category})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Font Size & Letter Spacing Sliders */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Size
                                </span>
                                <span className="font-mono text-cyan-400 text-[11px]">{selectedCanvasText.fontSize || 36}px</span>
                              </div>
                              <input
                                type="range"
                                min="12"
                                max="120"
                                value={selectedCanvasText.fontSize || 36}
                                onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { fontSize: Number(e.target.value) })}
                                className="theme-slider w-full"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Spacing
                                </span>
                                <span className="font-mono text-cyan-400 text-[11px]">{selectedCanvasText.letterSpacing || 0}px</span>
                              </div>
                              <input
                                type="range"
                                min="-2"
                                max="20"
                                value={selectedCanvasText.letterSpacing || 0}
                                onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { letterSpacing: Number(e.target.value) })}
                                className="theme-slider w-full"
                              />
                            </div>
                          </div>

                          {/* Formatting Toolbar: Bold, Italic, Uppercase, Alignment */}
                          <div>
                            <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Style &amp; Alignment
                            </label>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { isBold: !selectedCanvasText.isBold })}
                                className={`w-8 h-8 rounded-lg text-xs font-bold border transition flex items-center justify-center ${selectedCanvasText.isBold ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="Bold"
                              >
                                <Bold className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { isItalic: !selectedCanvasText.isItalic })}
                                className={`w-8 h-8 rounded-lg text-xs italic border transition flex items-center justify-center ${selectedCanvasText.isItalic ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="Italic"
                              >
                                <Italic className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { transform: selectedCanvasText.transform === 'uppercase' ? 'none' : 'uppercase' })}
                                className={`h-8 px-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition flex items-center justify-center ${selectedCanvasText.transform === 'uppercase' ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="All Caps"
                              >
                                TT
                              </button>
                              <div className="h-5 w-px bg-slate-700/60 mx-1" />
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { align: 'start' })}
                                className={`w-8 h-8 rounded-lg text-xs border transition flex items-center justify-center ${selectedCanvasText.align === 'start' ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="Align Left"
                              >
                                <AlignLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { align: 'center' })}
                                className={`w-8 h-8 rounded-lg text-xs border transition flex items-center justify-center ${(!selectedCanvasText.align || selectedCanvasText.align === 'center') ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="Align Center"
                              >
                                <AlignCenter className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { align: 'end' })}
                                className={`w-8 h-8 rounded-lg text-xs border transition flex items-center justify-center ${selectedCanvasText.align === 'end' ? 'bg-cyan-500 text-black border-cyan-400' : appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'}`}
                                title="Align Right"
                              >
                                <AlignRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Color and Outline */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Fill Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedCanvasText.fill || '#ffffff'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { fill: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                  type="text"
                                  value={selectedCanvasText.fill || '#ffffff'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { fill: e.target.value })}
                                  className={`w-20 px-2 py-1 rounded text-xs font-mono uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Outline Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedCanvasText.stroke === 'none' ? '#000000' : selectedCanvasText.stroke || '#000000'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { stroke: e.target.value, strokeWidth: selectedCanvasText.strokeWidth || 1.5 })}
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCanvasObject(selectedCanvasText.id, { stroke: selectedCanvasText.stroke === 'none' ? '#000000' : 'none' })}
                                  className={`px-2 py-1 rounded text-[11px] font-semibold border ${selectedCanvasText.stroke !== 'none' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                                >
                                  {selectedCanvasText.stroke !== 'none' ? 'On' : 'None'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Outline Thickness */}
                          {selectedCanvasText.stroke !== 'none' && (
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Outline Thickness
                                </span>
                                <span className="font-mono text-cyan-400 text-[11px]">{selectedCanvasText.strokeWidth || 1}px</span>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="8"
                                step="0.5"
                                value={selectedCanvasText.strokeWidth || 1}
                                onChange={(e) => handleUpdateCanvasObject(selectedCanvasText.id, { strokeWidth: Number(e.target.value) })}
                                className="theme-slider w-full"
                              />
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Quick Add Typography Buttons */}
                      <div className={`p-4 rounded-2xl border space-y-2.5 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Add Text Elements
                        </span>

                        <div className="space-y-2">
                          <button
                            type="button"
                            draggable={true}
                            onDragStart={(e) => {
                              const payload = JSON.stringify({ type: 'custom', customType: 'heading' });
                              e.dataTransfer.setData('application/json', payload);
                              e.dataTransfer.setData('text/plain', payload);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => handleAddTextObject(null, 'heading')}
                            className={`w-full py-2.5 px-3 rounded-xl border text-left font-bold transition flex items-center justify-between group cursor-grab active:cursor-grabbing ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 text-white' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-900'}`}
                          >
                            <span className="text-base font-extrabold" style={{ fontFamily: 'Outfit' }}>Add a heading</span>
                            <PlusCircle className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 transition" />
                          </button>

                          <button
                            type="button"
                            draggable={true}
                            onDragStart={(e) => {
                              const payload = JSON.stringify({ type: 'custom', customType: 'subheading' });
                              e.dataTransfer.setData('application/json', payload);
                              e.dataTransfer.setData('text/plain', payload);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => handleAddTextObject(null, 'subheading')}
                            className={`w-full py-2 px-3 rounded-xl border text-left font-semibold transition flex items-center justify-between group cursor-grab active:cursor-grabbing ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 text-cyan-300' : 'bg-white border-slate-200 hover:border-blue-400 text-blue-600'}`}
                          >
                            <span className="text-sm font-semibold" style={{ fontFamily: 'Outfit' }}>Add a subheading</span>
                            <PlusCircle className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 transition" />
                          </button>

                          <button
                            type="button"
                            draggable={true}
                            onDragStart={(e) => {
                              const payload = JSON.stringify({ type: 'custom', customType: 'body' });
                              e.dataTransfer.setData('application/json', payload);
                              e.dataTransfer.setData('text/plain', payload);
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            onClick={() => handleAddTextObject(null, 'body')}
                            className={`w-full py-1.5 px-3 rounded-xl border text-left font-medium transition flex items-center justify-between group cursor-grab active:cursor-grabbing ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 text-slate-300' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-600'}`}
                          >
                            <span className="text-xs" style={{ fontFamily: 'Inter' }}>Add a little bit of body text</span>
                            <PlusCircle className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 transition" />
                          </button>
                        </div>
                      </div>

                      {/* Canva Pro 3D Text Presets Grid */}
                      <div className={`p-4 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Canva Pro 3D Styles ({TEXT_PRESETS.length})
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            PRO
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {TEXT_PRESETS.map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              draggable={true}
                              onDragStart={(e) => {
                                const payload = JSON.stringify({ type: 'preset', id: preset.id });
                                e.dataTransfer.setData('application/json', payload);
                                e.dataTransfer.setData('text/plain', payload);
                                e.dataTransfer.effectAllowed = 'copy';
                              }}
                              onClick={() => handleAddTextObject(preset)}
                              className={`p-3 rounded-xl border text-center transition group relative overflow-hidden flex flex-col items-center justify-center min-h-[64px] cursor-grab active:cursor-grabbing ${appTheme === 'dark' ? 'bg-slate-900/70 border-slate-800 hover:border-cyan-400 hover:bg-slate-800/80' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}
                            >
                              <span
                                className="text-sm font-bold block truncate max-w-full"
                                style={{
                                  fontFamily: preset.font,
                                  color: preset.fill,
                                  textShadow: preset.stroke !== 'none' ? `0 0 8px ${preset.stroke}` : undefined,
                                  letterSpacing: `${preset.letterSpacing || 1}px`
                                }}
                              >
                                {preset.name}
                              </span>
                              <span className={`text-[9px] mt-1 ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {preset.font}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DEDICATED TAB: ELEMENTS & SHAPES LIBRARY */}
                {studioTab === 'shapes' && (() => {
                  const selectedCanvasShape = customCanvasObjects.find(
                    (obj) => obj.id === selectedLayerId && obj.type === 'shape'
                  );

                  const filteredShapes = shapeCategoryFilter === 'All'
                    ? SHAPES_PRESETS
                    : SHAPES_PRESETS.filter((s) => s.category.toLowerCase() === shapeCategoryFilter.toLowerCase());

                  return (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            <Shapes className="w-3.5 h-3.5 text-cyan-400" /> Vector Shapes &amp; Badges
                          </h4>
                          <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {SHAPES_PRESETS.length} Canva Pro vector shapes, stars, shields &amp; banners
                          </p>
                        </div>
                      </div>

                      {/* If a Shape is currently selected, show Shape Inspector */}
                      {selectedCanvasShape ? (
                        <div className={`p-4 rounded-2xl border space-y-3.5 ${appTheme === 'dark' ? 'bg-[#131b2e]/70 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'bg-blue-50/50 border-blue-200'}`}>
                          <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                              <Square className="w-3.5 h-3.5" /> Editing Shape: {selectedCanvasShape.name}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const dup = {
                                    ...selectedCanvasShape,
                                    id: `shape_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                                    name: `${selectedCanvasShape.name} (Copy)`,
                                    x: selectedCanvasShape.x + 15,
                                    y: selectedCanvasShape.y + 15
                                  };
                                  setCustomCanvasObjects(prev => [...prev, dup]);
                                  setSelectedLayerId(dup.id);
                                  setSelectedLayerIds([dup.id]);
                                }}
                                className={`p-1.5 rounded-lg border text-xs font-semibold transition ${appTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                                title="Duplicate shape"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCanvasObject(selectedCanvasShape.id)}
                                className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition"
                                title="Delete shape"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Shape Fill & Stroke Color */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Shape Fill
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedCanvasShape.fill || '#06b6d4'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { fill: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                  type="text"
                                  value={selectedCanvasShape.fill || '#06b6d4'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { fill: e.target.value })}
                                  className={`w-20 px-2 py-1 rounded text-xs font-mono uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                                />
                              </div>
                            </div>
                            <div>
                              <label className={`text-[10px] font-semibold uppercase tracking-wider block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Border Stroke
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedCanvasShape.stroke || '#ffffff'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { stroke: e.target.value })}
                                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                />
                                <input
                                  type="text"
                                  value={selectedCanvasShape.stroke || '#ffffff'}
                                  onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { stroke: e.target.value })}
                                  className={`w-20 px-2 py-1 rounded text-xs font-mono uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Shape Size Slider */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                Shape Size
                              </span>
                              <span className="font-mono text-cyan-400 text-[11px]">{selectedCanvasShape.size || 90}px</span>
                            </div>
                            <input
                              type="range"
                              min="20"
                              max="240"
                              value={selectedCanvasShape.size || 90}
                              onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { size: Number(e.target.value) })}
                              className="theme-slider w-full"
                            />
                          </div>

                          {/* Stroke Width & Opacity */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Stroke Width
                                </span>
                                <span className="font-mono text-cyan-400 text-[11px]">{selectedCanvasShape.strokeWidth || 1}px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                value={selectedCanvasShape.strokeWidth || 1}
                                onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { strokeWidth: Number(e.target.value) })}
                                className="theme-slider w-full"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Opacity
                                </span>
                                <span className="font-mono text-cyan-400 text-[11px]">{Math.round((selectedCanvasShape.opacity ?? 1) * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={selectedCanvasShape.opacity ?? 1}
                                onChange={(e) => handleUpdateCanvasObject(selectedCanvasShape.id, { opacity: Number(e.target.value) })}
                                className="theme-slider w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Category Filters */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {['All', 'Basic', 'Badges', 'Symbols', 'Polygons', 'Banners'].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setShapeCategoryFilter(cat)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${shapeCategoryFilter === cat ? 'bg-cyan-500 text-black border-cyan-400 shadow-sm' : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Shapes Grid */}
                      <div className={`p-3.5 rounded-2xl border ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
                          {filteredShapes.map((shape) => (
                            <button
                              key={shape.id}
                              type="button"
                              onClick={() => handleAddShapeObject(shape)}
                              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition group hover:scale-105 ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 shadow-sm'}`}
                              title={`Add ${shape.name}`}
                            >
                              <svg viewBox="0 0 100 100" className="w-8 h-8 transition-transform group-hover:scale-110">
                                <path d={shape.d} fill="currentColor" />
                              </svg>
                              <span className="text-[10px] font-semibold truncate w-full text-center">{shape.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* DEDICATED TAB: FREEHAND VECTOR BRUSH & DRAW */}
                {studioTab === 'draw' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          <PenTool className="w-3.5 h-3.5 text-cyan-400" /> Vector Brush &amp; Drawing
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Draw directly on canvas with smooth vector curves
                        </p>
                      </div>

                      {/* Undo / Clear actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCanvasObjects(prev => {
                              const lastDrawIdx = prev.map((item, i) => item.type === 'draw' ? i : -1).filter(i => i >= 0).pop();
                              if (lastDrawIdx === undefined) return prev;
                              return prev.filter((_, idx) => idx !== lastDrawIdx);
                            });
                          }}
                          className={`p-1.5 rounded-lg border text-xs font-semibold transition ${appTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                          title="Undo last brush stroke"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomCanvasObjects(prev => prev.filter(item => item.type !== 'draw'));
                          }}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition"
                          title="Clear all drawings"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Active Drawing Tool Selector (4 Brushes) */}
                    <div className={`p-1.5 rounded-2xl flex items-center gap-1 border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                      <button
                        type="button"
                        onClick={() => setDrawTool('pen')}
                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex flex-col items-center gap-1 ${drawTool === 'pen' ? 'bg-blue-600 text-white shadow-md' : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                      >
                        <PenTool className="w-4 h-4" />
                        <span>Pen</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDrawTool('highlighter');
                          setDrawOpacity(0.45);
                          setDrawSize(16);
                        }}
                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex flex-col items-center gap-1 ${drawTool === 'highlighter' ? 'bg-blue-600 text-white shadow-md' : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                      >
                        <Highlighter className="w-4 h-4" />
                        <span>Highlighter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDrawTool('neon');
                          setDrawOpacity(1);
                          setDrawSize(8);
                        }}
                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex flex-col items-center gap-1 ${drawTool === 'neon' ? 'bg-blue-600 text-white shadow-md' : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Neon Glow</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDrawTool('eraser')}
                        className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex flex-col items-center gap-1 ${drawTool === 'eraser' ? 'bg-rose-600 text-white shadow-md' : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'}`}
                      >
                        <Eraser className="w-4 h-4" />
                        <span>Eraser</span>
                      </button>
                    </div>

                    {/* Brush Size Slider with Live Dot Preview */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Brush Thickness
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Live Stroke Thickness Dot Preview */}
                          <div
                            className="rounded-full shadow-sm"
                            style={{
                              width: `${Math.min(24, Math.max(4, drawSize))}px`,
                              height: `${Math.min(24, Math.max(4, drawSize))}px`,
                              backgroundColor: drawColor,
                              opacity: drawOpacity
                            }}
                          />
                          <span className="font-mono text-cyan-400 text-xs font-bold">{drawSize}px</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="48"
                        value={drawSize}
                        onChange={(e) => setDrawSize(Number(e.target.value))}
                        className="theme-slider w-full"
                      />
                    </div>

                    {/* Brush Color & Swatches (Only when not in eraser mode) */}
                    {drawTool !== 'eraser' && (
                      <div className={`p-4 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Brush Color
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={drawColor}
                              onChange={(e) => setDrawColor(e.target.value)}
                              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                            />
                            <span className="font-mono text-xs uppercase text-slate-300">{drawColor}</span>
                          </div>
                        </div>

                        {/* 10 Quick Swatches */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#ffffff', '#64748b', '#0f172a'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setDrawColor(c)}
                              className={`w-6 h-6 rounded-full border transition hover:scale-110 ${drawColor === c ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 border-white' : 'border-white/20'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>

                        {/* Opacity Slider */}
                        <div className="pt-2 border-t border-slate-700/40">
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Brush Opacity
                            </span>
                            <span className="font-mono text-cyan-400 text-[11px]">{Math.round(drawOpacity * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={drawOpacity}
                            onChange={(e) => setDrawOpacity(Number(e.target.value))}
                            className="theme-slider w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pro Tip Box */}
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-0.5" />
                      <span>
                        Draw freely on the canvas screen! Strokes automatically convert to smooth vector paths that can be transformed in 3D and exported in full 4K/8K.
                      </span>
                    </div>
                  </div>
                )}

{/* TAB 2: FILTERS (25+ VISUAL COLOR PRESETS) */}
                {studioTab === 'filters' && (
                  <div className="space-y-3.5">
                    {/* Header & Reset Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Wand2 className="w-3.5 h-3.5 text-cyan-500" /> {EFFECT_PRESETS.length}+ Visual Color Filters
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Click any card to apply instant gradient tone &amp; aura glow
                        </p>
                      </div>

                      <button
                        onClick={handleResetEffectsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                          ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        title="Reset all filters to original"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* New vs Classic / Old Version Toggle Bar */}
                    <div className={`p-1 rounded-xl border flex items-center gap-1 ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                      <button
                        onClick={() => setFilterVersionFilter('all')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${filterVersionFilter === 'all'
                          ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                          : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                          }`}
                      >
                        <span>All ({EFFECT_PRESETS.length})</span>
                      </button>

                      <button
                        onClick={() => setFilterVersionFilter('new')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${filterVersionFilter === 'new'
                          ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-md font-bold'
                          : (appTheme === 'dark' ? 'text-amber-300 hover:text-white' : 'text-amber-700 hover:text-slate-900')
                          }`}
                      >
                        <span>✨ New ({EFFECT_PRESETS.filter(p => p.isNew).length})</span>
                      </button>

                      <button
                        onClick={() => setFilterVersionFilter('old')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${filterVersionFilter === 'old'
                          ? (appTheme === 'dark' ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm font-bold' : 'bg-white text-slate-900 border border-slate-300 shadow-sm font-bold')
                          : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                          }`}
                      >
                        <span>📦 Classic</span>
                      </button>
                    </div>

                    {/* Search Bar for Filters */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search filters (e.g. Matrix, Sunset, Prism, Vintage, Gold)..."
                        value={filterSearchTerm}
                        onChange={(e) => setFilterSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 transition ${appTheme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                      />
                      {filterSearchTerm && (
                        <button
                          onClick={() => setFilterSearchTerm('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center"
                          title="Clear search"
                        >
                          &times;
                        </button>
                      )}
                    </div>

                    {/* Filter Category Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {['All', 'Neon & Cyber', 'Cinematic & Moody', 'Warm & Golden', 'Aesthetic & Pastel', 'Retro & Vintage'].map((cat) => {
                        const isCatActive = filterCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition whitespace-nowrap ${isCatActive
                              ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                              : (appTheme === 'dark' ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
                              }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* 2-Column Visual Filter Cards with Live Visual Preview Look on Every Button */}
                    <div className="grid grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {filteredPresets.map((pst) => {
                        const isCurrentActive = activeFilterPreset === pst.id || activeFilterPreset === pst.name;
                        return (
                          <button
                            key={pst.id || pst.name}
                            onClick={() => applyPreset(pst)}
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group ${isCurrentActive
                              ? (appTheme === 'dark'
                                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400'
                                : 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600')
                              : (appTheme === 'dark'
                                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900 shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(255,255,255,0.07)]'
                                : 'bg-white border-slate-200 hover:border-slate-300/80 hover:shadow-lg hover:shadow-black/10 shadow-sm')
                              }`}
                          >
                            {/* Live Visual Filter Preview Box */}
                            <FilterCardThumbnail preset={pst} svgCode={selectedAsset?.svgCode || currentPreviewSvg} activeGlowBlur={adjustments.shadowBlur || 0} activeGlowColor={adjustments.shadowColor || '#38bdf8'} />

                            <div className="w-full">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold truncate ${isCurrentActive
                                  ? (appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-700')
                                  : (appTheme === 'dark' ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600')
                                  }`}>
                                  {pst.name}
                                </span>
                                {isCurrentActive && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className={`text-[10px] leading-tight line-clamp-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                {pst.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      {filteredPresets.length === 0 && (
                        <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                          No filters match "{filterSearchTerm}". Try another search term.
                        </div>
                      )}
                    </div>

                    {/* Quick Fine-Tuning Mini-Sliders under Filters */}
                    <div className={`p-3.5 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Sliders className="w-3 h-3 text-cyan-500" /> Quick Fine-Tune
                        </span>
                        <button
                          onClick={() => {
                            setStudioTab('adjustment');
                            setAdjustmentSubTab('gradient');
                          }}
                          className="text-[10px] text-cyan-500 hover:underline font-semibold"
                        >
                          Adjustment Sliders &rarr;
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className={`flex justify-between text-[11px] mb-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Hue Shift</span>
                            <span className="text-cyan-500 font-mono text-[10px] font-semibold">{adjustments.hue}&deg;</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={adjustments.hue}
                            onChange={(e) => setAdjustments({ ...adjustments, hue: Number(e.target.value) })}
                            className="hue-slider w-full"
                          />
                        </div>
                        <div>
                          <div className={`flex justify-between text-[11px] mb-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Glow Aura</span>
                            <span className="text-cyan-500 font-mono text-[10px] font-semibold">{adjustments.shadowBlur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            value={adjustments.shadowBlur}
                            onChange={(e) => setAdjustments({ ...adjustments, shadowBlur: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: EFFECTS (3D MATERIAL STYLES & FX) */}
                {studioTab === 'effects' && (
                  <div className="space-y-4">
                    {/* Header with count and reset */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> {STYLE_RENDER_MODES.length}+ 3D Material Styles &amp; FX
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Diamond, Velvet, Wood, Lava, Clay, Mercury, Origami &amp; more
                        </p>
                      </div>

                      <button
                        onClick={handleResetEffectsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                          ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        title="Reset all effects to original"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* New vs Classic / Old Version Toggle Bar for Effects */}
                    <div className={`p-1 rounded-xl border flex items-center gap-1 ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                      <button
                        onClick={() => setEffectVersionFilter('all')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${effectVersionFilter === 'all'
                          ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                          : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                          }`}
                      >
                        <span>All ({STYLE_RENDER_MODES.length})</span>
                      </button>

                      <button
                        onClick={() => setEffectVersionFilter('new')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${effectVersionFilter === 'new'
                          ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-md font-bold'
                          : (appTheme === 'dark' ? 'text-amber-300 hover:text-white' : 'text-amber-700 hover:text-slate-900')
                          }`}
                      >
                        <span>✨ New ({STYLE_RENDER_MODES.filter(m => m.isNew || NEW_EFFECT_IDS.has(m.id)).length})</span>
                      </button>

                      <button
                        onClick={() => setEffectVersionFilter('old')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${effectVersionFilter === 'old'
                          ? (appTheme === 'dark' ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-sm font-bold' : 'bg-white text-slate-900 border border-slate-300 shadow-sm font-bold')
                          : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                          }`}
                      >
                        <span>📦 Classic</span>
                      </button>
                    </div>

                    {/* Search Bar for Effects */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search material effects (e.g. Gold, Glass, Neon, Metal)..."
                        value={effectSearchTerm}
                        onChange={(e) => setEffectSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 transition ${appTheme === 'dark'
                          ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
                          : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                      />
                      {effectSearchTerm && (
                        <button
                          onClick={() => setEffectSearchTerm('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs font-bold w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center"
                          title="Clear search"
                        >
                          &times;
                        </button>
                      )}
                    </div>

                    {/* Style Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {['All', 'Trending & Viral', 'Cyber & Neon', 'Glass & Water', 'Fire & Metal', 'Craft & Texture', '3D & Inflatable', 'Anime & Manga', 'Cartoon & Comic', 'Retro & Vintage', 'Silhouette & Vector'].map((cat) => {
                        const isCatActive = effectCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setEffectCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition whitespace-nowrap ${isCatActive
                              ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                              : (appTheme === 'dark' ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
                              }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Status banner: Shows whether effect is applying to Selected Part or Entire Canvas */}
                    {(() => {
                      const targetIds = (selectedLayerIds && selectedLayerIds.length > 0)
                        ? selectedLayerIds
                        : (selectedLayerId ? [selectedLayerId] : []);
                      const isPartSelected = targetIds.length > 0;
                      const primaryId = isPartSelected ? String(targetIds[0]).replace(/^pf_studio_/i, '') : null;
                      const selectedPart = primaryId ? svgLayers.find(l => String(l.id).replace(/^pf_studio_/i, '') === primaryId) : null;

                      return isPartSelected ? (
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${appTheme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-50 border-blue-200'
                          }`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                            <span className={`font-semibold truncate text-[11px] ${appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-800'}`}>
                              Selected Part: <span className="underline">{targetIds.length === 1 ? (selectedPart?.name || 'Part 1') : `${targetIds.length} Parts`}</span> (Effect applies only here)
                            </span>
                          </div>
                          <button
                            onClick={() => { setSelectedLayerIds([]); setSelectedLayerId(null); }}
                            className={`text-[10px] font-bold underline flex-shrink-0 ml-2 ${appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            title="Deselect to apply effect to entire canvas"
                          >
                            Deselect
                          </button>
                        </div>
                      ) : (
                        <div className={`p-2 rounded-xl border flex items-center gap-1.5 text-[11px] ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}>
                          <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>Applying to Entire Canvas. Click any part on canvas to apply effect only to that part.</span>
                        </div>
                      );
                    })()}

                    {/* 2-Column Material & Style Cards with Live Visual Preview */}
                    <div className="grid grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {filteredStyleModes.map((preset) => {
                        const targetIds = (selectedLayerIds && selectedLayerIds.length > 0)
                          ? selectedLayerIds
                          : (selectedLayerId ? [selectedLayerId] : []);
                        const isPartSelected = targetIds.length > 0;
                        const primaryId = isPartSelected ? String(targetIds[0]).replace(/^pf_studio_/i, '') : null;
                        const currentPartLook = primaryId && layerStyles[primaryId]?.styleMode;
                        const effectiveActiveLook = isPartSelected ? (currentPartLook || 'original') : activeStyleMode;
                        const isCurrentActive = effectiveActiveLook === preset.id;
                        const isNew = preset.isNew || NEW_EFFECT_IDS.has(preset.id);
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleSelectStyleLook(preset)}
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group ${isCurrentActive
                              ? (appTheme === 'dark'
                                ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400'
                                : 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600')
                              : (appTheme === 'dark'
                                ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900 shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(255,255,255,0.07)]'
                                : 'bg-white border-slate-200 hover:border-slate-300/80 hover:shadow-lg hover:shadow-black/10 shadow-sm')
                              }`}
                          >
                            <EffectCardThumbnail preset={preset} />

                            <div className="w-full">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold truncate ${isCurrentActive
                                  ? (appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-700')
                                  : (appTheme === 'dark' ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600')
                                  }`}>
                                  {preset.name}
                                </span>
                                {isCurrentActive && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className={`text-[10px] leading-tight line-clamp-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                {preset.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                      {filteredStyleModes.length === 0 && (
                        <div className="col-span-2 py-8 text-center text-xs text-slate-400">
                          No effects match "{effectSearchTerm}". Try another search term.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: DIMENSIONS & SIZE CONTROL */}
                {studioTab === 'dimensions' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-500" /> Icon Dimensions &amp; Scaling
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Set custom width and height with live canvas scaling and aspect ratio lock
                        </p>
                      </div>

                      <button
                        onClick={handleResetDimensionsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                          ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        title="Reset dimensions to default (384x384)"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset Size</span>
                      </button>
                    </div>

                    {/* Width and Height Controls Card */}
                    <div className={`p-4 rounded-2xl border space-y-4 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      {/* Aspect Ratio Lock Banner */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleAspectRatioLock}
                            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${lockAspectRatio
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                              : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                              }`}
                            title={lockAspectRatio ? 'Unlock Aspect Ratio (Freeform sizing)' : 'Lock Aspect Ratio (Proportional sizing)'}
                          >
                            {lockAspectRatio ? <Link2 className="w-3.5 h-3.5" /> : <Unlink2 className="w-3.5 h-3.5" />}
                            <span>{lockAspectRatio ? 'Aspect Ratio Locked' : 'Freeform (Unlocked)'}</span>
                          </button>
                        </div>

                        <span className={`text-xs font-mono font-bold ${appTheme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {iconWidth} &times; {iconHeight} px
                        </span>
                      </div>

                      {/* Width Control */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Width (W)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="16"
                              max="4096"
                              value={iconWidth}
                              onChange={(e) => handleWidthChange(e.target.value)}
                              className={`w-20 px-2 py-1 rounded-lg text-xs font-mono text-center border focus:outline-none focus:border-cyan-500 ${appTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                                }`}
                            />
                            <span className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="32"
                          max="1024"
                          step="8"
                          value={Math.min(1024, iconWidth)}
                          onChange={(e) => handleWidthChange(e.target.value)}
                          className="theme-slider w-full"
                        />
                      </div>

                      {/* Height Control */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Height (H)</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="16"
                              max="4096"
                              value={iconHeight}
                              onChange={(e) => handleHeightChange(e.target.value)}
                              className={`w-20 px-2 py-1 rounded-lg text-xs font-mono text-center border focus:outline-none focus:border-cyan-500 ${appTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                                }`}
                            />
                            <span className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="32"
                          max="1024"
                          step="8"
                          value={Math.min(1024, iconHeight)}
                          onChange={(e) => handleHeightChange(e.target.value)}
                          className="theme-slider w-full"
                        />
                      </div>
                    </div>

                    {/* Quick Size Presets Grid */}
                    <div className="space-y-2">
                      <label className={`block text-[11px] font-semibold uppercase ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Quick Size Presets
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SIZE_PRESETS.map((preset) => {
                          const isCurrent = iconWidth === preset.w && iconHeight === preset.h;
                          return (
                            <button
                              key={preset.label}
                              onClick={() => handleApplySizePreset(preset)}
                              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${isCurrent
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : appTheme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold">{preset.label}</span>
                                <span className={`text-[9px] px-1 rounded ${isCurrent ? 'bg-blue-700 text-white' : appTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                  {preset.w}&times;{preset.h}
                                </span>
                              </div>
                              <span className={`text-[10px] mt-1 ${isCurrent ? 'text-blue-100' : appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {preset.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dimension Helper Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleResetDimensionsPanel}
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium transition ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        Reset to 384&times;384
                      </button>

                      <button
                        onClick={() => {
                          const size = Math.max(iconWidth, iconHeight);
                          setIconWidth(size);
                          setIconHeight(size);
                          setLockAspectRatio(true);
                          setAspectRatio(1);
                        }}
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium transition ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        Make Square (1:1)
                      </button>
                    </div>

                    {/* Outline Stroke & Contour Thickness (Universal Vector Line Weight) */}
                    <div className={`p-4 rounded-2xl border space-y-3.5 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" /> Vector Stroke & Contour
                        </label>
                        <div className="flex items-center gap-2">
                          {strokeMultiplier !== 1 && (
                            <button
                              onClick={() => {
                                recordUndo();
                                setStrokeMultiplier(1);
                              }}
                              className="text-[11px] text-cyan-500 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                          )}
                          <span className="text-xs font-mono font-bold text-cyan-500">
                            {strokeMultiplier}x {strokeMultiplier === 1 ? '(Original)' : strokeMultiplier < 1 ? '(Thin)' : '(Thick)'}
                          </span>
                        </div>
                      </div>

                      {/* Vector Type Status Badge */}
                      <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium border ${isStrokeIcon
                        ? (appTheme === 'dark' ? 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300' : 'bg-cyan-50 border-cyan-200 text-cyan-800')
                        : (appTheme === 'dark' ? 'bg-amber-950/30 border-amber-800/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800')
                        }`}>
                        <span className="flex items-center gap-1.5">
                          {isStrokeIcon ? '✏️ Outline Vector' : '🎨 Solid Filled Shape'}
                        </span>
                        <span className="text-[10px] opacity-80">
                          {isStrokeIcon ? 'Scales line strokes directly' : 'Smart vector contour expansion'}
                        </span>
                      </div>

                      {/* Presets */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { label: '0.5x Thin', val: 0.5 },
                          { label: '0.75x', val: 0.75 },
                          { label: '1x Default', val: 1 },
                          { label: '1.5x Medium', val: 1.5 },
                          { label: '2x Bold', val: 2 },
                          { label: '3x Heavy', val: 3 }
                        ].map((s) => (
                          <button
                            key={s.label}
                            onClick={() => {
                              recordUndo();
                              setStrokeMultiplier(s.val);
                            }}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${strokeMultiplier === s.val
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                              : appTheme === 'dark'
                                ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                              }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="range"
                        min={isStrokeIcon ? 0.2 : 0.5}
                        max="4"
                        step="0.1"
                        value={strokeMultiplier}
                        onPointerDown={recordUndo}
                        onChange={(e) => setStrokeMultiplier(Number(e.target.value))}
                        className="theme-slider w-full"
                      />

                      {/* Contour options for Solid Filled Shapes when thickened */}
                      {!isStrokeIcon && strokeMultiplier > 1 && (
                        <div className={`mt-2 pt-2.5 border-t space-y-2 ${appTheme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
                          }`}>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={appTheme === 'dark' ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>
                              Contour Color:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {[
                                { id: 'auto', label: 'Match Fill' },
                                { id: 'white', label: 'White' },
                                { id: 'dark', label: 'Dark' },
                                { id: 'custom', label: 'Custom' }
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    recordUndo();
                                    setStrokeColorMode(opt.id);
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${strokeColorMode === opt.id
                                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                    : appTheme === 'dark'
                                      ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                              {strokeColorMode === 'custom' && (
                                <input
                                  type="color"
                                  value={customStrokeColor}
                                  onChange={(e) => {
                                    setCustomStrokeColor(e.target.value);
                                  }}
                                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                                  title="Pick custom contour color"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* App Icon Badge & Background Container */}
                    <div className={`p-4 rounded-2xl border space-y-4 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Shapes className="w-3.5 h-3.5 text-cyan-500" /> App Icon Badge &amp; Tile Shape
                        </label>
                        {bgShape !== 'none' && (
                          <button
                            onClick={() => {
                              recordUndo();
                              setBgShape('none');
                            }}
                            className="text-[11px] text-cyan-500 hover:underline font-semibold"
                          >
                            Remove Badge
                          </button>
                        )}
                      </div>

                      {/* Shape Selector Buttons */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {[
                          { id: 'none', label: 'None' },
                          { id: 'squircle', label: 'Squircle' },
                          { id: 'circle', label: 'Circle' },
                          { id: 'rounded-square', label: 'Square' },
                          { id: 'hexagon', label: 'Hexagon' }
                        ].map((sh) => (
                          <button
                            key={sh.id}
                            onClick={() => {
                              recordUndo();
                              setBgShape(sh.id);
                            }}
                            className={`py-2 px-1 rounded-xl text-center border text-[11px] font-semibold transition ${bgShape === sh.id
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                              : appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
                              }`}
                          >
                            {sh.label}
                          </button>
                        ))}
                      </div>

                      {bgShape !== 'none' && (
                        <div className="space-y-3 pt-2 border-t border-slate-800/60">
                          {/* Background Color Picker & Presets */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Badge Color</span>
                              <span className="font-mono text-cyan-500 text-xs font-bold uppercase">{bgShapeColor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={bgShapeColor}
                                onPointerDown={recordUndo}
                                onChange={(e) => setBgShapeColor(e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                              />
                              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                {['#0f172a', '#1e293b', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#059669', '#ffffff'].map(col => (
                                  <button
                                    key={col}
                                    onClick={() => {
                                      recordUndo();
                                      setBgShapeColor(col);
                                    }}
                                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm flex-shrink-0 transition hover:scale-110"
                                    style={{ backgroundColor: col }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Inner Margin / Padding Slider */}
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Icon Margin (Inset)</span>
                              <span className="font-mono text-cyan-500 font-semibold">{bgShapePadding}%</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="35"
                              value={bgShapePadding}
                              onPointerDown={recordUndo}
                              onChange={(e) => setBgShapePadding(Number(e.target.value))}
                              className="theme-slider w-full"
                            />
                          </div>

                          {/* Border Width & Color */}
                          <div className="grid grid-cols-2 gap-3 items-center">
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Border</span>
                                <span className="font-mono text-cyan-500 font-semibold">{bgShapeBorder}px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="8"
                                value={bgShapeBorder}
                                onPointerDown={recordUndo}
                                onChange={(e) => setBgShapeBorder(Number(e.target.value))}
                                className="theme-slider w-full"
                              />
                            </div>

                            {bgShapeBorder > 0 && (
                              <div>
                                <span className={`block text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Border Color</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={bgShapeBorderColor}
                                    onPointerDown={recordUndo}
                                    onChange={(e) => setBgShapeBorderColor(e.target.value)}
                                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                  />
                                  <span className="font-mono text-[10px] text-cyan-500 uppercase">{bgShapeBorderColor}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: TRANSFORM & 3D ROTATION */}
                {studioTab === 'transform' && (() => {
                  const activeSelectedIds = (selectedLayerIds && selectedLayerIds.length > 0)
                    ? selectedLayerIds
                    : (selectedLayerId ? [selectedLayerId] : []);
                  const isPartSelected = activeSelectedIds.length > 0;
                  const primarySelectedId = isPartSelected ? activeSelectedIds[0] : null;
                  const cleanPrimaryId = primarySelectedId ? String(primarySelectedId).replace(/^pf_studio_/i, '') : null;
                  const isTransformingSelected = transformTarget === 'selected' && isPartSelected;

                  const curTransform = cleanPrimaryId ? (layerTransforms[cleanPrimaryId] || layerTransforms[primarySelectedId] || {}) : {};
                  const curX = isTransformingSelected ? (curTransform.x || 0) : (adjustments.translateX || 0);
                  const curY = isTransformingSelected ? (curTransform.y || 0) : (adjustments.translateY || 0);
                  const curZ = isTransformingSelected ? (curTransform.z || 0) : (adjustments.translateZ || 0);
                  const curRx = isTransformingSelected ? (curTransform.rotateX || 0) : (adjustments.rotateX || 0);
                  const curRy = isTransformingSelected ? (curTransform.rotateY || 0) : (adjustments.rotateY || 0);
                  const curRot = isTransformingSelected ? (curTransform.rotate || 0) : (adjustments.rotation || 0);

                  const updateX = (val) => {
                    if (isTransformingSelected) {
                      handleLayerPositionChange(activeSelectedIds, 'x', val);
                    } else {
                      setAdjustments(prev => ({ ...prev, translateX: val }));
                    }
                  };

                  const updateY = (val) => {
                    if (isTransformingSelected) {
                      handleLayerPositionChange(activeSelectedIds, 'y', val);
                    } else {
                      setAdjustments(prev => ({ ...prev, translateY: val }));
                    }
                  };

                  const updateZ = (val) => {
                    if (isTransformingSelected) {
                      handleLayerPositionChange(activeSelectedIds, 'z', val);
                    } else {
                      setAdjustments(prev => ({ ...prev, translateZ: val }));
                    }
                  };

                  const update3DRotation = (rx, ry) => {
                    if (isTransformingSelected) {
                      handleLayer3DRotationChange(activeSelectedIds, rx, ry);
                    } else {
                      setAdjustments(prev => ({
                        ...prev,
                        ...(rx !== undefined ? { rotateX: rx } : {}),
                        ...(ry !== undefined ? { rotateY: ry } : {})
                      }));
                    }
                  };

                  const updateRotation = (val) => {
                    if (isTransformingSelected) {
                      rotateSelectedOrCanvas(val);
                    } else {
                      setAdjustments(prev => ({ ...prev, rotation: val }));
                    }
                  };

                  const apply3DPreset = (p) => {
                    recordUndo();
                    if (isTransformingSelected) {
                      handleLayerTransformBatch(activeSelectedIds, {
                        rotateX: p.rx,
                        rotateY: p.ry,
                        ...(p.rz !== undefined ? { rotate: p.rz } : {})
                      });
                    } else {
                      setAdjustments(prev => ({
                        ...prev,
                        rotateX: p.rx,
                        rotateY: p.ry,
                        rotation: p.rz !== undefined ? p.rz : prev.rotation
                      }));
                    }
                  };

                  const applyXyzPreset = (p) => {
                    recordUndo();
                    if (isTransformingSelected) {
                      handleLayerTransformBatch(activeSelectedIds, {
                        x: p.x,
                        y: p.y,
                        z: p.z
                      });
                    } else {
                      setAdjustments(prev => ({
                        ...prev,
                        translateX: p.x,
                        translateY: p.y,
                        translateZ: p.z
                      }));
                    }
                  };

                  const resetOrigin = () => {
                    recordUndo();
                    if (isTransformingSelected) {
                      handleLayerTransformBatch(activeSelectedIds, { x: 0, y: 0, z: 0 });
                    } else {
                      setAdjustments(prev => ({ ...prev, translateX: 0, translateY: 0, translateZ: 0 }));
                    }
                  };

                  return (
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                            <Move3d className="w-3.5 h-3.5 text-cyan-500" /> 3D Perspective, XYZ Move &amp; Transforms
                          </h4>
                          <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            XYZ Coordinates, 3D Orbit, Pitch/Yaw, 360&deg; Spin &amp; Skew
                          </p>
                        </div>

                        <button
                          onClick={handleResetTransformPanel}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                            ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                            : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          title="Reset all 3D and 2D transforms"
                        >
                          <Undo2 className="w-3 h-3 text-cyan-500" />
                          <span>Reset All</span>
                        </button>
                      </div>

                      {/* Transform Target Switcher Banner: [🌐 Whole Icon] vs [🎯 Selected Item] */}
                      <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-300'}`}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Transforming:</span>
                          <span className="text-xs font-semibold text-cyan-400 truncate">
                            {isTransformingSelected
                              ? `🎯 Selected Part (${activeSelectedIds.length > 1 ? `${activeSelectedIds.length} parts` : (cleanPrimaryId || 'Layer')})`
                              : '🌐 Entire Icon Model'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-lg border border-slate-800 flex-shrink-0">
                          <button
                            onClick={() => setTransformTarget('all')}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition flex items-center gap-1 ${!isTransformingSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>Whole Icon</span>
                          </button>
                          <button
                            onClick={() => {
                              if (!isPartSelected) {
                                if (svgLayers.length > 0) {
                                  setSelectedLayerId(svgLayers[0].id);
                                }
                              }
                              setTransformTarget('selected');
                            }}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition flex items-center gap-1 ${isTransformingSelected
                              ? 'bg-cyan-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                            }`}
                            title={isPartSelected ? 'Transform selected part' : 'Click to select first part or click in preview'}
                          >
                            <span>🎯 Selected Item</span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-Navigation: XYZ Move | 3D Perspective | 2D Angle & Flips | Skew & Shear */}
                      <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300'
                        }`}>
                        <button
                          onClick={() => setTransformSubTab('xyz')}
                          className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${transformSubTab === 'xyz'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <Move className="w-3.5 h-3.5" />
                          <span>XYZ Move</span>
                        </button>

                        <button
                          onClick={() => setTransformSubTab('3d')}
                          className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${transformSubTab === '3d'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>3D Rotate</span>
                        </button>

                        <button
                          onClick={() => setTransformSubTab('2d')}
                          className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${transformSubTab === '2d'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>2D Angle</span>
                        </button>

                        <button
                          onClick={() => setTransformSubTab('skew')}
                          className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${transformSubTab === 'skew'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Skew</span>
                        </button>
                      </div>

                      {/* SUB-TAB 0: XYZ AXIS TRANSLATION & 3D DEPTH */}
                      {transformSubTab === 'xyz' && (
                        <div className="space-y-4">
                          {/* 1. Coordinate Readout Bar & Quick Center */}
                          <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Position:</span>
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                X: {curX}px
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Y: {curY}px
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                Z: {curZ}px
                              </span>
                            </div>

                            <button
                              onClick={resetOrigin}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition flex items-center gap-1 ${appTheme === 'dark'
                                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                                : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                              }`}
                              title={isTransformingSelected ? 'Reset selected part to (0,0,0)' : 'Reset whole icon to (0,0,0)'}
                            >
                              <RotateCcw className="w-2.5 h-2.5 text-cyan-400" />
                              <span>Origin</span>
                            </button>
                          </div>

                          {/* 2. Interactive Tactile D-Pad & 3D Depth Stepper */}
                          <div className={`p-3 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className={`text-xs font-semibold flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                <Move className="w-3.5 h-3.5 text-cyan-400" />
                                <span>XYZ D-Pad {isTransformingSelected ? '(Selected Part)' : '(Whole Icon)'}</span>
                              </span>
                              <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                                <span className="text-slate-400 px-1 font-medium">Step:</span>
                                {[5, 20, 50].map(s => (
                                  <button
                                    key={s}
                                    onClick={() => setXyzStep(s)}
                                    className={`px-1.5 py-0.5 rounded font-mono font-bold transition ${xyzStep === s
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {s}px
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 items-center">
                              {/* D-Pad (X / Y Axis) */}
                              <div className="col-span-2 flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50 border border-slate-800/80">
                                {/* Up */}
                                <button
                                  onClick={() => updateY(curY - xyzStep)}
                                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600/30 active:scale-95 border border-slate-700 hover:border-cyan-500/50 text-slate-200 flex items-center justify-center transition shadow-sm mb-1"
                                  title={`Move Up (-${xyzStep}px Y)`}
                                >
                                  <ArrowUp className="w-4 h-4 text-cyan-400" />
                                </button>

                                {/* Left / Center / Right */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => updateX(curX - xyzStep)}
                                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600/30 active:scale-95 border border-slate-700 hover:border-cyan-500/50 text-slate-200 flex items-center justify-center transition shadow-sm"
                                    title={`Move Left (-${xyzStep}px X)`}
                                  >
                                    <ArrowLeft className="w-4 h-4 text-cyan-400" />
                                  </button>
                                  <button
                                    onClick={() => { updateX(0); updateY(0); }}
                                    className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/80 text-[10px] font-mono font-bold text-slate-300 flex items-center justify-center transition shadow-inner"
                                    title="Reset X and Y to (0,0)"
                                  >
                                    (0,0)
                                  </button>
                                  <button
                                    onClick={() => updateX(curX + xyzStep)}
                                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600/30 active:scale-95 border border-slate-700 hover:border-cyan-500/50 text-slate-200 flex items-center justify-center transition shadow-sm"
                                    title={`Move Right (+${xyzStep}px X)`}
                                  >
                                    <ArrowLeft className="w-4 h-4 text-cyan-400 rotate-180" />
                                  </button>
                                </div>

                                {/* Down */}
                                <button
                                  onClick={() => updateY(curY + xyzStep)}
                                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600/30 active:scale-95 border border-slate-700 hover:border-cyan-500/50 text-slate-200 flex items-center justify-center transition shadow-sm mt-1"
                                  title={`Move Down (+${xyzStep}px Y)`}
                                >
                                  <ArrowDown className="w-4 h-4 text-cyan-400" />
                                </button>
                              </div>

                              {/* 3D Depth Stepper (Z Axis) */}
                              <div className="flex flex-col items-center justify-between h-full p-2 rounded-xl bg-purple-950/20 border border-purple-900/40">
                                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">3D Depth (Z)</span>

                                {/* Z+ (Pop Out Forward) */}
                                <button
                                  onClick={() => updateZ(curZ + xyzStep)}
                                  className="w-full py-2 px-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 active:scale-95 border border-purple-500/40 text-purple-200 flex flex-col items-center justify-center gap-0.5 transition shadow-sm"
                                  title={`Pop Out Forward toward camera (+${xyzStep}px Z)`}
                                >
                                  <ChevronsUp className="w-4 h-4 text-purple-300" />
                                  <span className="text-[10px] font-bold">Pop Out (Z+)</span>
                                </button>

                                {/* Reset Z */}
                                <button
                                  onClick={() => updateZ(0)}
                                  className="text-[9px] font-mono text-purple-400 hover:text-white px-2 py-0.5 rounded bg-purple-900/30"
                                  title="Reset Z Depth to 0"
                                >
                                  Z: {curZ}px
                                </button>

                                {/* Z- (Recess Backward) */}
                                <button
                                  onClick={() => updateZ(curZ - xyzStep)}
                                  className="w-full py-2 px-1 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 active:scale-95 border border-purple-500/40 text-purple-200 flex flex-col items-center justify-center gap-0.5 transition shadow-sm"
                                  title={`Recess Backward away from camera (-${xyzStep}px Z)`}
                                >
                                  <ChevronsDown className="w-4 h-4 text-purple-300" />
                                  <span className="text-[10px] font-bold">Recess (Z-)</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 3. Detailed Axis Sliders with Stepper Buttons */}
                          <div className="space-y-3">
                            {/* X Axis Slider */}
                            <div className={`p-2.5 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold flex items-center gap-1.5 text-cyan-400">
                                  <span>X-Axis</span>
                                  <span className={`text-[10px] font-normal ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    (Left ↔ Right)
                                  </span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <span id="live-x-badge" className="font-mono text-cyan-400 font-bold">{curX}px</span>
                                  <button
                                    onClick={() => updateX(curX - 10)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="-10px"
                                  >
                                    -10
                                  </button>
                                  <button
                                    onClick={() => updateX(curX + 10)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="+10px"
                                  >
                                    +10
                                  </button>
                                  {curX !== 0 && (
                                    <button
                                      onClick={() => updateX(0)}
                                      className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                    >
                                      0
                                    </button>
                                  )}
                                </div>
                              </div>
                              <FastTransformSlider
                                min="-350"
                                max="350"
                                step="1"
                                value={curX}
                                onDragStart={startTransformDrag}
                                onLiveChange={(val) => {
                                  if (isTransformingSelected) {
                                    applyLiveLayerTransform(activeSelectedIds, { x: val });
                                  } else {
                                    applyLiveStageTransform({ translateX: val });
                                  }
                                  const badge = document.getElementById('live-x-badge');
                                  if (badge) badge.textContent = `${val}px`;
                                }}
                                onDragEnd={endTransformDrag}
                                onChange={(val) => updateX(val)}
                                className="theme-slider w-full accent-cyan-500"
                              />
                            </div>

                            {/* Y Axis Slider */}
                            <div className={`p-2.5 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold flex items-center gap-1.5 text-emerald-400">
                                  <span>Y-Axis</span>
                                  <span className={`text-[10px] font-normal ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    (Up ↕ Down)
                                  </span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <span id="live-y-badge" className="font-mono text-emerald-400 font-bold">{curY}px</span>
                                  <button
                                    onClick={() => updateY(curY - 10)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="-10px"
                                  >
                                    -10
                                  </button>
                                  <button
                                    onClick={() => updateY(curY + 10)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="+10px"
                                  >
                                    +10
                                  </button>
                                  {curY !== 0 && (
                                    <button
                                      onClick={() => updateY(0)}
                                      className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                    >
                                      0
                                    </button>
                                  )}
                                </div>
                              </div>
                              <FastTransformSlider
                                min="-350"
                                max="350"
                                step="1"
                                value={curY}
                                onDragStart={startTransformDrag}
                                onLiveChange={(val) => {
                                  if (isTransformingSelected) {
                                    applyLiveLayerTransform(activeSelectedIds, { y: val });
                                  } else {
                                    applyLiveStageTransform({ translateY: val });
                                  }
                                  const badge = document.getElementById('live-y-badge');
                                  if (badge) badge.textContent = `${val}px`;
                                }}
                                onDragEnd={endTransformDrag}
                                onChange={(val) => updateY(val)}
                                className="theme-slider w-full accent-emerald-500"
                              />
                            </div>

                            {/* Z Axis Slider */}
                            <div className={`p-2.5 rounded-xl border ${appTheme === 'dark' ? 'bg-purple-950/30 border-purple-900/50' : 'bg-purple-50 border-purple-200'}`}>
                              <div className="flex items-center justify-between text-xs mb-1.5">
                                <span className="font-semibold flex items-center gap-1.5 text-purple-400">
                                  <span>Z-Axis 3D Depth</span>
                                  <span className={`text-[10px] font-normal ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    (Forward ↔ Backward)
                                  </span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <span id="live-z-badge" className="font-mono text-purple-400 font-bold">{curZ}px</span>
                                  <button
                                    onClick={() => updateZ(curZ - 25)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="-25px"
                                  >
                                    -25
                                  </button>
                                  <button
                                    onClick={() => updateZ(curZ + 25)}
                                    className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    title="+25px"
                                  >
                                    +25
                                  </button>
                                  {curZ !== 0 && (
                                    <button
                                      onClick={() => updateZ(0)}
                                      className="text-[9px] px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                    >
                                      0
                                    </button>
                                  )}
                                </div>
                              </div>
                              <FastTransformSlider
                                min="-400"
                                max="400"
                                step="2"
                                value={curZ}
                                onDragStart={startTransformDrag}
                                onLiveChange={(val) => {
                                  if (isTransformingSelected) {
                                    applyLiveLayerTransform(activeSelectedIds, { z: val });
                                  } else {
                                    applyLiveStageTransform({ translateZ: val });
                                  }
                                  const badge = document.getElementById('live-z-badge');
                                  if (badge) badge.textContent = `${val}px`;
                                }}
                                onDragEnd={endTransformDrag}
                                onChange={(val) => updateZ(val)}
                                className="theme-slider w-full accent-purple-500"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">
                                Positive Z pushes the target forward toward the screen with true 3D perspective; negative Z pushes it deeper into the scene.
                              </p>
                            </div>
                          </div>

                          {/* 4. 1-Click 3D Positioning Presets */}
                          <div>
                            <div className={`text-xs font-semibold mb-2 flex items-center justify-between ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              <span>1-Click 3D XYZ Presets</span>
                              <span className="text-[10px] text-cyan-500 font-normal">8 Presets</span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {PRESETS_XYZ.map(p => {
                                const isActive = curX === p.x && curY === p.y && curZ === p.z;
                                return (
                                  <button
                                    key={p.id}
                                    onClick={() => applyXyzPreset(p)}
                                    title={`${p.name}: ${p.desc} (X: ${p.x}px, Y: ${p.y}px, Z: ${p.z}px)`}
                                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${isActive
                                      ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                                      : appTheme === 'dark'
                                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                                      }`}
                                  >
                                    <span className="text-base leading-none">{p.icon}</span>
                                    <span className="text-[10px] font-medium truncate w-full">{p.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 1: 3D PERSPECTIVE */}
                      {transformSubTab === '3d' && (
                        <div className="space-y-4">
                          {/* Interactive 3D Orbit Trackball Pad */}
                          <Trackball3DPad
                            rotateX={curRx}
                            rotateY={curRy}
                            onDragStart={startTransformDrag}
                            onLiveChange={(rx, ry) => {
                              if (isTransformingSelected) {
                                applyLiveLayerTransform(activeSelectedIds, { rotateX: rx, rotateY: ry });
                              } else {
                                applyLiveStageTransform({ rotateX: rx, rotateY: ry });
                              }
                              const pitchBadge = document.getElementById('live-pitch-badge');
                              if (pitchBadge) pitchBadge.textContent = `${rx}°`;
                              const yawBadge = document.getElementById('live-yaw-badge');
                              if (yawBadge) yawBadge.textContent = `${ry}°`;
                            }}
                            onDragEnd={endTransformDrag}
                            onChange={(newRx, newRy) => update3DRotation(newRx, newRy)}
                            onReset={() => update3DRotation(0, 0)}
                            appTheme={appTheme}
                          />

                          {/* 1-Click 3D Angle Presets */}
                          <div>
                            <div className={`text-xs font-semibold mb-2 flex items-center justify-between ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                              <span>1-Click 3D Angle Presets</span>
                              <span className="text-[10px] text-cyan-500 font-normal">8 Angles</span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {PRESETS_3D.map(p => {
                                const isActive = curRx === p.rx && curRy === p.ry;
                                return (
                                  <button
                                    key={p.id}
                                    onClick={() => apply3DPreset(p)}
                                    title={`${p.name}: ${p.desc} (X: ${p.rx}°, Y: ${p.ry}°)`}
                                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${isActive
                                      ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                                      : appTheme === 'dark'
                                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                                      }`}
                                  >
                                    <span className="text-base leading-none">{p.icon}</span>
                                    <span className="text-[10px] font-medium truncate w-full">{p.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3D Pitch (X-Axis Tilt) Slider */}
                          <div>
                            <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span className="flex items-center gap-1">
                                <strong>3D Tilt X (Pitch)</strong>
                                <span className="text-[10px] text-slate-500 font-normal">(Forward / Backward)</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span id="live-pitch-badge" className="text-cyan-500 font-mono font-semibold">{curRx}&deg;</span>
                                {curRx !== 0 && (
                                  <button
                                    onClick={() => update3DRotation(0, curRy)}
                                    className="text-[9px] px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                  >
                                    0&deg;
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => update3DRotation(Math.max(-85, curRx - 5), curRy)}
                                className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                              >
                                -5&deg;
                              </button>
                              <FastTransformSlider
                                min="-85"
                                max="85"
                                step="1"
                                value={curRx}
                                onDragStart={startTransformDrag}
                                onLiveChange={(val) => {
                                  if (isTransformingSelected) {
                                    applyLiveLayerTransform(activeSelectedIds, { rotateX: val });
                                  } else {
                                    applyLiveStageTransform({ rotateX: val });
                                  }
                                  const badge = document.getElementById('live-pitch-badge');
                                  if (badge) badge.textContent = `${val}°`;
                                }}
                                onDragEnd={endTransformDrag}
                                onChange={(val) => update3DRotation(val, curRy)}
                                className="theme-slider w-full flex-1"
                              />
                              <button
                                onClick={() => update3DRotation(Math.min(85, curRx + 5), curRy)}
                                className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                              >
                                +5&deg;
                              </button>
                            </div>
                          </div>

                          {/* 3D Yaw (Y-Axis Tilt) Slider */}
                          <div>
                            <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span className="flex items-center gap-1">
                                <strong>3D Tilt Y (Yaw)</strong>
                                <span className="text-[10px] text-slate-500 font-normal">(Left / Right Angle)</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span id="live-yaw-badge" className="text-cyan-500 font-mono font-semibold">{curRy}&deg;</span>
                                {curRy !== 0 && (
                                  <button
                                    onClick={() => update3DRotation(curRx, 0)}
                                    className="text-[9px] px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                  >
                                    0&deg;
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => update3DRotation(curRx, Math.max(-85, curRy - 5))}
                                className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                              >
                                -5&deg;
                              </button>
                              <FastTransformSlider
                                min="-85"
                                max="85"
                                step="1"
                                value={curRy}
                                onDragStart={startTransformDrag}
                                onLiveChange={(val) => {
                                  if (isTransformingSelected) {
                                    applyLiveLayerTransform(activeSelectedIds, { rotateY: val });
                                  } else {
                                    applyLiveStageTransform({ rotateY: val });
                                  }
                                  const badge = document.getElementById('live-yaw-badge');
                                  if (badge) badge.textContent = `${val}°`;
                                }}
                                onDragEnd={endTransformDrag}
                                onChange={(val) => update3DRotation(curRx, val)}
                                className="theme-slider w-full flex-1"
                              />
                              <button
                                onClick={() => update3DRotation(curRx, Math.min(85, curRy + 5))}
                                className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                              >
                                +5&deg;
                              </button>
                            </div>
                          </div>

                          {/* 360° Rotation / Roll Angle Slider & Quick Angle Dial */}
                          <div className={`p-3 rounded-2xl border space-y-2.5 ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 font-semibold text-cyan-400">
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>360&deg; Spin &amp; Angle {isTransformingSelected ? '(Selected Part)' : '(Whole Icon)'}</span>
                              </span>
                              <div className="flex items-center gap-1">
                                <span id="live-rot-badge" className="text-cyan-400 font-mono font-bold">{curRot}&deg;</span>
                                <button
                                  onClick={() => updateRotation(curRot - 15)}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                                  title="-15°"
                                >
                                  -15&deg;
                                </button>
                                <button
                                  onClick={() => updateRotation(curRot + 15)}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                                  title="+15°"
                                >
                                  +15&deg;
                                </button>
                                {curRot !== 0 && (
                                  <button
                                    onClick={() => updateRotation(0)}
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                  >
                                    0&deg;
                                  </button>
                                )}
                              </div>
                            </div>

                            <FastTransformSlider
                              min="-180"
                              max="180"
                              step="1"
                              value={curRot}
                              onDragStart={startTransformDrag}
                              onLiveChange={(val) => {
                                if (isTransformingSelected) {
                                  applyLiveLayerTransform(activeSelectedIds, { rotate: val });
                                } else {
                                  applyLiveStageTransform({ rotation: val });
                                }
                                const badge = document.getElementById('live-rot-badge');
                                if (badge) badge.textContent = `${val}°`;
                              }}
                              onDragEnd={endTransformDrag}
                              onChange={(val) => updateRotation(val)}
                              className="theme-slider w-full accent-cyan-500"
                            />

                            {/* Quick 360 Degree Presets */}
                            <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/40">
                              {[0, 45, 90, 135, 180, -90, -45].map(deg => (
                                <button
                                  key={deg}
                                  onClick={() => updateRotation(deg)}
                                  className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold transition ${curRot === deg
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : appTheme === 'dark' ? 'bg-slate-800/80 text-slate-400 hover:text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                  }`}
                                >
                                  {deg}&deg;
                                </button>
                              ))}
                            </div>
                          </div>

                        {/* Camera Perspective Distance Slider */}
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="flex items-center gap-1">
                              <span>3D Focal Depth</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {(adjustments.perspective || 800) <= 500 ? '(Fisheye 3D)' : (adjustments.perspective || 800) >= 1400 ? '(Telephoto)' : '(Studio 3D)'}
                              </span>
                            </span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.perspective || 800}px</span>
                          </div>
                          <input
                            type="range"
                            min="300"
                            max="2000"
                            step="50"
                            value={adjustments.perspective || 800}
                            onChange={(e) => {
                              const newPersp = Number(e.target.value);
                              setAdjustments(prev => {
                                const needsTilt = (!prev.rotateX || prev.rotateX === 0) && (!prev.rotateY || prev.rotateY === 0);
                                return {
                                  ...prev,
                                  perspective: newPersp,
                                  rotateX: needsTilt ? 18 : prev.rotateX,
                                  rotateY: needsTilt ? -18 : prev.rotateY
                                };
                              });
                            }}
                            className="theme-slider w-full"
                          />
                        </div>

                        {/* 3D Solid Thickness / Motai (Extrusion) Slider */}
                        {(() => {
                          const activeTargetIds = (selectedLayerIds && selectedLayerIds.length > 0)
                            ? selectedLayerIds
                            : (selectedLayerId ? [selectedLayerId] : []);
                          const isPartSelected = activeTargetIds.length > 0;
                          const primaryCleanId = isPartSelected ? String(activeTargetIds[0]).replace(/^pf_studio_/i, '') : null;
                          const currentPartExtrusion = primaryCleanId && layerStyles[primaryCleanId]?.extrusion;
                          const currentDepth = isPartSelected
                            ? (currentPartExtrusion?.depth !== undefined ? currentPartExtrusion.depth : (adjustments.extrusionDepth || 0))
                            : (adjustments.extrusionDepth || 0);
                          const currentColor = isPartSelected
                            ? (currentPartExtrusion?.color || adjustments.extrusionColor || 'rgba(0,0,0,0.65)')
                            : (adjustments.extrusionColor || 'rgba(0,0,0,0.65)');

                          const handleExtrusionChange = (newDepth, newColor) => {
                            const d = Math.max(0, Math.min(50, Number(newDepth)));
                            const c = newColor || currentColor;
                            if (isPartSelected) {
                              setLayerStyles(prev => {
                                const next = { ...prev };
                                activeTargetIds.forEach(id => {
                                  const cId = String(id).replace(/^pf_studio_/i, '');
                                  next[cId] = {
                                    ...(next[cId] || {}),
                                    extrusion: { depth: d, color: c }
                                  };
                                });
                                return next;
                              });
                            } else {
                              setAdjustments(prev => ({
                                ...prev,
                                extrusionDepth: d,
                                extrusionColor: c
                              }));
                            }
                          };

                          return (
                            <div className={`p-3 rounded-2xl border transition space-y-2.5 ${currentDepth > 0
                              ? appTheme === 'dark' ? 'bg-cyan-950/25 border-cyan-500/40 shadow-sm' : 'bg-cyan-50/70 border-cyan-300'
                              : appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>3D Thickness / Motai {isPartSelected ? '(Selected Part)' : '(Whole Artwork)'}</span>
                                </span>
                                <span className="text-xs text-cyan-500 font-mono font-bold">{currentDepth}px</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="40"
                                step="1"
                                value={currentDepth}
                                onChange={(e) => handleExtrusionChange(e.target.value)}
                                className="theme-slider w-full"
                              />

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[10px]">
                                <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Thickness Color:</span>
                                <div className="flex items-center gap-1.5">
                                  {['rgba(0,0,0,0.7)', '#0f172a', '#7f1d1d', '#1e3a8a', '#14532d', '#713f12'].map(c => (
                                    <button
                                      key={c}
                                      onClick={() => handleExtrusionChange(currentDepth, c)}
                                      style={{ backgroundColor: c }}
                                      className={`w-3.5 h-3.5 rounded-full border transition ${currentColor === c ? 'ring-2 ring-cyan-400 scale-110' : 'border-slate-700'}`}
                                      title={c}
                                    />
                                  ))}
                                  <input
                                    type="color"
                                    value={currentColor.startsWith('#') ? currentColor : '#000000'}
                                    onChange={(e) => handleExtrusionChange(currentDepth, e.target.value)}
                                    className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0 ml-1"
                                    title="Custom Thickness Color"
                                  />
                                </div>
                              </div>
                              <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isPartSelected
                                  ? 'Selected element ko solid 3D motai aur dimensional blocks deta hai'
                                  : 'Poore icon ko solid 3D extrusion aur physical motai deta hai'}
                              </p>
                            </div>
                          );
                        })()}

                        {/* 3D Elevation / Depth Shadow */}
                        <div className={`p-3 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              3D Elevation &amp; Cast Shadow
                            </span>
                            <span className="text-xs text-cyan-500 font-mono font-semibold">{adjustments.depth3D || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="35"
                            step="1"
                            value={adjustments.depth3D || 0}
                            onChange={(e) => setAdjustments({ ...adjustments, depth3D: Number(e.target.value) })}
                            className="theme-slider w-full mb-2"
                          />
                          <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Projects a realistic physical drop shadow in the direction of the 3D tilt
                          </p>
                        </div>

                        </div>
                    )}

                    {/* SUB-TAB 2: 2D ANGLE & FLIPS */}
                    {transformSubTab === '2d' && (() => {
                      const activeSelectedLayerId = (selectedLayerIds && selectedLayerIds.length > 0)
                        ? selectedLayerIds[0]
                        : selectedLayerId;
                      const activeLayerTransform = activeSelectedLayerId ? layerTransforms[activeSelectedLayerId] : null;
                      const isLayerTargeted = Boolean(activeSelectedLayerId);
                      const currentAngle = isLayerTargeted
                        ? (activeLayerTransform?.rotate || 0)
                        : (adjustments.rotation || 0);
                      const isFlippedH = isLayerTargeted
                        ? (activeLayerTransform?.scaleX !== undefined ? activeLayerTransform.scaleX < 0 : false)
                        : Boolean(adjustments.flipH);
                      const isFlippedV = isLayerTargeted
                        ? (activeLayerTransform?.scaleY !== undefined ? activeLayerTransform.scaleY < 0 : false)
                        : Boolean(adjustments.flipV);

                      return (
                        <div className="space-y-4">
                          {/* 2D Angle Slider */}
                          <div>
                            <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span>Rotation Angle {isLayerTargeted ? '(Selected Part)' : '(Whole Artwork)'}</span>
                              <span className="text-cyan-500 font-mono font-semibold">{currentAngle}&deg;</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              step="1"
                              value={currentAngle}
                              onChange={(e) => rotateSelectedOrCanvas(Number(e.target.value))}
                              className="theme-slider w-full"
                            />
                          </div>

                          {/* Quick Angle Snap Pills */}
                          <div>
                            <span className={`text-[11px] font-medium block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              Quick Angle Snap {isLayerTargeted ? '(Selected Part)' : ''}
                            </span>
                            <div className="grid grid-cols-6 gap-1">
                              {[0, 45, 90, 135, 180, 270].map(deg => (
                                <button
                                  key={deg}
                                  onClick={() => rotateSelectedOrCanvas(deg)}
                                  className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition ${currentAngle === deg
                                    ? 'bg-blue-600 text-white border-blue-400 shadow'
                                    : appTheme === 'dark'
                                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                  {deg}&deg;
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Directional 90° and 180° Rotations */}
                          <div className="grid grid-cols-3 gap-2 pt-1">
                            <button
                              onClick={() => rotateSelectedOrCanvas(prev => prev + 90)}
                              className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                                }`}
                            >
                              <RotateCw className="w-4 h-4 text-cyan-500" />
                              <span>Rotate 90&deg; CW</span>
                            </button>

                            <button
                              onClick={() => rotateSelectedOrCanvas(prev => prev - 90)}
                              className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                                }`}
                            >
                              <RotateCcw className="w-4 h-4 text-cyan-500" />
                              <span>Rotate 90&deg; CCW</span>
                            </button>

                            <button
                              onClick={() => rotateSelectedOrCanvas(prev => prev + 180)}
                              className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                                }`}
                            >
                              <RefreshCw className="w-4 h-4 text-cyan-500" />
                              <span>Invert 180&deg;</span>
                            </button>
                          </div>

                          {/* Mirror Flips */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => flipSelectedOrCanvas('h')}
                              className={`py-3.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-2 transition ${isFlippedH
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400'
                                : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                                }`}
                            >
                              <FlipHorizontal className="w-4 h-4 text-cyan-500" />
                              <span>Flip Horizontal {isFlippedH ? '(On)' : ''}</span>
                            </button>

                            <button
                              onClick={() => flipSelectedOrCanvas('v')}
                              className={`py-3.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-2 transition ${isFlippedV
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400'
                                : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                                }`}
                            >
                              <FlipVertical className="w-4 h-4 text-cyan-500" />
                              <span>Flip Vertical {isFlippedV ? '(On)' : ''}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* SUB-TAB 3: SKEW & SHEAR */}
                    {transformSubTab === 'skew' && (
                      <div className="space-y-4">
                        {/* Quick Presets for Skew */}
                        <div>
                          <span className={`text-[11px] font-semibold block mb-2 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Slant &amp; Shear Presets
                          </span>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { label: 'Italic +15°', sx: 15, sy: 0 },
                              { label: 'Reverse -15°', sx: -15, sy: 0 },
                              { label: 'Isometric 2.5D', sx: 20, sy: -15 },
                              { label: 'Reset (0°)', sx: 0, sy: 0 }
                            ].map(p => (
                              <button
                                key={p.label}
                                onClick={() => {
                                  recordUndo();
                                  setAdjustments(prev => ({ ...prev, skewX: p.sx, skewY: p.sy }));
                                }}
                                className={`p-2 rounded-xl border text-[10px] font-semibold transition ${(adjustments.skewX || 0) === p.sx && (adjustments.skewY || 0) === p.sy
                                  ? 'bg-blue-600 text-white border-blue-400 shadow'
                                  : appTheme === 'dark'
                                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                  }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Skew X */}
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Horizontal Skew (Skew X)</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.skewX || 0}&deg;</span>
                              {(adjustments.skewX || 0) !== 0 && (
                                <button
                                  onClick={() => setAdjustments(prev => ({ ...prev, skewX: 0 }))}
                                  className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                >
                                  0&deg;
                                </button>
                              )}
                            </div>
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={adjustments.skewX || 0}
                            onChange={(e) => setAdjustments({ ...adjustments, skewX: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>

                        {/* Skew Y */}
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Vertical Skew (Skew Y)</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.skewY || 0}&deg;</span>
                              {(adjustments.skewY || 0) !== 0 && (
                                <button
                                  onClick={() => setAdjustments(prev => ({ ...prev, skewY: 0 }))}
                                  className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                >
                                  0&deg;
                                </button>
                              )}
                            </div>
                          </div>
                          <input
                            type="range"
                            min="-45"
                            max="45"
                            step="1"
                            value={adjustments.skewY || 0}
                            onChange={(e) => setAdjustments({ ...adjustments, skewY: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ); })()}

                                {/* DEDICATED TAB: ANIMATED GIF STUDIO (Directly under 3D Transform) */}
                {studioTab === 'gif' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          <Film className="w-3.5 h-3.5 text-cyan-400" /> Animated GIF Studio
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Generate silky 60 FPS looping animated GIFs with 3D physics
                        </p>
                      </div>

                      <button
                        onClick={() => setAdjustments(prev => ({ ...prev, is3DFloating: !prev.is3DFloating }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${adjustments.is3DFloating
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : appTheme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${adjustments.is3DFloating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                        <span>{adjustments.is3DFloating ? 'Live Active' : 'Off'}</span>
                      </button>
                    </div>

                    {/* 15 Looping Motion Presets Grid */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          Motion Style ({MOTION_PRESETS.length})
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold capitalize">
                          {adjustments.animPreset || 'float'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-1 py-1">
                        {MOTION_PRESETS.map((preset) => {
                          const isSel = (adjustments.animPreset || 'float') === preset.id;
                          const animClass = getPresetAnimClass(preset.id);
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              title={`${preset.name}: ${preset.desc}`}
                              onClick={() => setAdjustments(prev => ({ ...prev, animPreset: preset.id, is3DFloating: preset.id !== 'none' }))}
                              className={`h-11 px-2 rounded-xl text-center border transition-all flex items-center justify-center overflow-hidden relative select-none ${isSel
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-400 shadow-md shadow-blue-500/30 ring-1 ring-cyan-300 font-bold'
                                : appTheme === 'dark'
                                  ? 'bg-slate-800/90 border-slate-700/70 text-slate-200 hover:border-cyan-500/50 hover:text-white hover:bg-slate-750'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-900 hover:bg-cyan-50/40'
                                }`}
                              style={{ perspective: '500px' }}
                            >
                              <span
                                className={`text-[11px] font-bold tracking-tight leading-none inline-block ${preset.id !== 'none' ? animClass : ''}`}
                                style={{
                                  '--anim-speed': '2.2s',
                                  '--anim-amp': '6px',
                                  '--anim-amp-val': '6',
                                  transformOrigin: preset.id === 'swing' ? 'top center' : 'center center',
                                  transformStyle: 'preserve-3d',
                                  backfaceVisibility: 'visible'
                                }}
                              >
                                {preset.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* GIF Frame Rate (Smoothness) Selector */}
                    <div className={`p-4 rounded-2xl border space-y-3 ${appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          GIF Frame Rate (Smoothness)
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {adjustments.animFps || 60} FPS
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { fps: 24, label: '24 FPS', desc: 'Standard / Light' },
                          { fps: 30, label: '30 FPS', desc: 'Smooth' },
                          { fps: 60, label: '60 FPS', desc: 'Ultra Fluid', badge: '⚡ 60fps' }
                        ].map((item) => {
                          const isSel = (adjustments.animFps || 60) === item.fps;
                          return (
                            <button
                              key={item.fps}
                              type="button"
                              onClick={() => setAdjustments(prev => ({ ...prev, animFps: item.fps }))}
                              className={`py-1.5 px-2 rounded-xl border text-center transition ${isSel
                                ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                                : appTheme === 'dark' ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <div className="text-xs flex items-center justify-center gap-1 font-semibold">
                                <span>{item.label}</span>
                                {item.badge && <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">{item.badge}</span>}
                              </div>
                              <div className="text-[9px] opacity-75 font-normal">{item.desc}</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Controls: Speed & Height Sliders */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-700/40">
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="flex items-center gap-1">Loop Speed</span>
                            <span className="text-cyan-400 font-mono font-semibold">{adjustments.animSpeed || 2.2}s</span>
                          </div>
                          <input
                            type="range"
                            min="0.8"
                            max="4.0"
                            step="0.2"
                            value={adjustments.animSpeed || 2.2}
                            onChange={(e) => setAdjustments(prev => ({ ...prev, animSpeed: Number(e.target.value) }))}
                            className="theme-slider w-full"
                          />
                        </div>

                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="flex items-center gap-1">Motion Amplitude</span>
                            <span className="text-cyan-400 font-mono font-semibold">{adjustments.animHeight || 16}px</span>
                          </div>
                          <input
                            type="range"
                            min="4"
                            max="32"
                            step="2"
                            value={adjustments.animHeight || 16}
                            onChange={(e) => setAdjustments(prev => ({ ...prev, animHeight: Number(e.target.value) }))}
                            className="theme-slider w-full"
                          />
                        </div>

                        <label className="flex items-center justify-between cursor-pointer pt-0.5">
                          <span className={`text-[11px] font-medium ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Dynamic Drop Shadow Sync
                          </span>
                          <input
                            type="checkbox"
                            checked={adjustments.animShadowSync !== false}
                            onChange={(e) => setAdjustments(prev => ({ ...prev, animShadowSync: e.target.checked }))}
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </label>
                      </div>

                      {/* One-Click Animated GIF Export Button */}
                      <div className="pt-2 border-t border-slate-700/40">
                        <button
                          onClick={handleExportAnimatedGif}
                          disabled={downloading}
                          className={`w-full py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${downloading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-[0.99]'
                            }`}
                        >
                          <Film className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} />
                          <span>{downloading ? 'Rendering Looping GIF...' : '✨ Export Animated .GIF (Looping)'}</span>
                        </button>
                        <p className={`text-[9px] text-center mt-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          512px • Hardware WebGL 3D frames • Clean loop
                        </p>
                      </div>
                    </div>
                  </div>
                )}

{/* TAB 5: EXPORT SETTINGS */}
                {studioTab === 'export' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                          <Download className="w-3.5 h-3.5 text-cyan-500" /> Export Configuration
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Target format, resolution and background options
                        </p>
                      </div>

                      <button
                        onClick={handleResetExportPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${appTheme === 'dark'
                          ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                          : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        title="Reset export configuration"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset Export</span>
                      </button>
                    </div>
                    {/* Format selection */}
                    <div>
                      <label className={`block text-[11px] font-semibold mb-2 uppercase ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Target Format
                      </label>
                      <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
                        {['png', 'svg', 'ico', 'webp', 'jpeg', 'gif'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => {
                              setExportFormat(fmt);
                              if (fmt === 'ico') {
                                setExportSize(256);
                              } else if (exportSize < 128) {
                                setExportSize(512);
                              }
                            }}
                            className={`py-2 rounded-xl uppercase text-xs font-bold transition border text-center ${exportFormat === fmt
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                              : appTheme === 'dark'
                                ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                          >
                            .{fmt}
                          </button>
                        ))}
                      </div>
                      {exportFormat === 'gif' && (
                        <div className="mt-3 p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 animate-fadeIn">
                          {/* Motion Preset Selector */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Motion Preset
                              </span>
                              <span className="text-[10px] font-mono text-cyan-300 font-semibold capitalize">
                                {adjustments.animPreset || 'float'}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1 py-1">
                              {MOTION_PRESETS.map((preset) => {
                                const isSel = (adjustments.animPreset || 'float') === preset.id;
                                const animClass = getPresetAnimClass(preset.id);
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    title={`${preset.name}: ${preset.desc}`}
                                    onClick={() => setAdjustments(prev => ({ ...prev, animPreset: preset.id, is3DFloating: preset.id !== 'none' }))}
                                    className={`h-10 px-1.5 rounded-lg text-center border transition-all flex items-center justify-center overflow-hidden select-none ${isSel
                                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-cyan-400 shadow-md font-bold ring-1 ring-cyan-300'
                                      : appTheme === 'dark'
                                        ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white hover:bg-slate-800'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-cyan-400 hover:bg-slate-100'
                                    }`}
                                    style={{ perspective: '400px' }}
                                  >
                                    <span
                                      className={`text-[10px] font-bold tracking-tight leading-none inline-block ${preset.id !== 'none' ? animClass : ''}`}
                                      style={{
                                        '--anim-speed': '2.2s',
                                        '--anim-amp': '5px',
                                        '--anim-amp-val': '5',
                                        transformOrigin: preset.id === 'swing' ? 'top center' : 'center center',
                                        transformStyle: 'preserve-3d',
                                        backfaceVisibility: 'visible'
                                      }}
                                    >
                                      {preset.name}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Loop Speed & Motion Amplitude Sliders */}
                          <div className="space-y-2 pt-1 border-t border-slate-700/40">
                            <div>
                              <div className={`flex justify-between text-[11px] mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="font-semibold text-slate-300">Loop Speed</span>
                                <span className="text-cyan-400 font-mono font-bold">{adjustments.animSpeed || 2.2}s</span>
                              </div>
                              <input
                                type="range"
                                min="0.8"
                                max="4.0"
                                step="0.2"
                                value={adjustments.animSpeed || 2.2}
                                onChange={(e) => setAdjustments(prev => ({ ...prev, animSpeed: Number(e.target.value) }))}
                                className="theme-slider w-full"
                              />
                            </div>

                            <div>
                              <div className={`flex justify-between text-[11px] mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                <span className="font-semibold text-slate-300">Motion Amplitude</span>
                                <span className="text-cyan-400 font-mono font-bold">{adjustments.animHeight || 16}px</span>
                              </div>
                              <input
                                type="range"
                                min="4"
                                max="32"
                                step="2"
                                value={adjustments.animHeight || 16}
                                onChange={(e) => setAdjustments(prev => ({ ...prev, animHeight: Number(e.target.value) }))}
                                className="theme-slider w-full"
                              />
                            </div>
                          </div>

                          {/* Frame Rate / Smoothness */}
                          <div className="pt-1 border-t border-slate-700/40 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Film className="w-3.5 h-3.5" /> Frame Rate (Smoothness)
                              </span>
                              <span className="text-[10px] font-mono text-cyan-300 font-bold">
                                {adjustments.animFps || 60} FPS
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { fps: 24, label: '24 FPS', desc: 'Standard' },
                                { fps: 30, label: '30 FPS', desc: 'Smooth' },
                                { fps: 60, label: '60 FPS', desc: 'Ultra Fluid', badge: '⚡ 60fps' }
                              ].map((item) => {
                                const isSel = (adjustments.animFps || 60) === item.fps;
                                return (
                                  <button
                                    key={item.fps}
                                    type="button"
                                    onClick={() => setAdjustments(prev => ({ ...prev, animFps: item.fps }))}
                                    className={`p-1.5 rounded-xl text-center border transition ${isSel
                                      ? 'bg-blue-600 border-blue-400 text-white font-bold shadow-md'
                                      : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <div className="text-xs flex items-center justify-center gap-1 font-semibold">
                                      <span>{item.label}</span>
                                      {item.badge && <span className="text-[8px] px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-bold">{item.badge}</span>}
                                    </div>
                                    <div className="text-[9px] opacity-75 font-normal">{item.desc}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Resolution buttons */}
                    <div>
                      <label className={`block text-[11px] font-semibold mb-2 uppercase ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Export Resolution ({exportFormat === 'ico' ? `${exportSize}px High-Definition Icon` : (exportSize >= 1024 ? `${exportSize / 1024}K Ultra HD` : `${exportSize}px Standard`)})
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(exportFormat === 'ico'
                          ? [
                              { sz: 256, label: '256px (Standard HD)', span: true },
                              { sz: 512, label: '★ 512px (Ultra-HD)', span: true },
                              { sz: 128, label: '128px (Large)' },
                              { sz: 64, label: '64px (Hi-DPI)' },
                              { sz: 32, label: '32px (Tab)' },
                              { sz: 16, label: '16px (Favicon)' }
                            ]
                          : [
                              { sz: 128 },
                              { sz: 256 },
                              { sz: 512 },
                              { sz: 1024 },
                              { sz: 2048 },
                              { sz: 4096 },
                              { sz: 8192 }
                            ]
                        ).map((item) => {
                          const sz = item.sz;
                          const isMobile = !isDesktopScreen;
                          const is8K = sz === 8192;
                          const isSelected = exportSize === sz;
                          return (
                            <button
                              key={sz}
                              onClick={() => {
                                if (isMobile && is8K) {
                                  setExportSize(4096);
                                  setSettingsToast('8K requires PC GPU memory. Auto-set to 4K Ultra-HD for mobile stability.');
                                  setTimeout(() => setSettingsToast(''), 3500);
                                  return;
                                }
                                setExportSize(sz);
                              }}
                              className={`py-2 rounded-xl text-xs font-semibold transition border text-center ${isSelected
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/40'
                                : appTheme === 'dark'
                                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                } ${item.span ? 'col-span-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-cyan-700/50' : ''}`}
                            >
                              {item.label || (sz >= 1024 ? (is8K && isMobile ? '8K (PC)' : `${sz / 1024}K`) : `${sz}px`)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Transparency Toggle */}
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div>
                        <p className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Transparent Background</p>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {exportFormat === 'jpeg'
                            ? 'JPEG does not support transparency (solid white will be applied).'
                            : 'Renders transparent background without solid color.'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        disabled={exportFormat === 'jpeg'}
                        checked={exportFormat === 'jpeg' ? false : isTransparent}
                        onChange={(e) => setIsTransparent(e.target.checked)}
                        className="w-5 h-5 accent-blue-600 rounded cursor-pointer disabled:opacity-40"
                      />
                    </div>

                    {/* Auto-Fit Canvas to All Elements Toggle (Illustrator Style) */}
                    <div className={`p-3.5 rounded-2xl border transition-all ${autoFitToElements
                        ? (appTheme === 'dark' ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm' : 'bg-cyan-50/50 border-cyan-300 shadow-sm')
                        : (appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200')
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 pr-2">
                          <div className={`p-2 rounded-xl flex-shrink-0 transition-colors ${autoFitToElements ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                            <Maximize2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className={`text-xs font-bold ${appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                                Fit Canvas to All Elements
                              </p>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                Illustrator Auto-Fit
                              </span>
                            </div>
                            <p className={`text-[11px] leading-tight mt-0.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Fits all elements into frame without clipping, even when widely spaced.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoFitToElements}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setAutoFitToElements(val);
                            localStorage.setItem('iconderry_autofit_elements', String(val));
                          }}
                          className="w-5 h-5 accent-cyan-500 rounded cursor-pointer flex-shrink-0"
                        />
                      </div>

                      {autoFitToElements && (
                        <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                          <span className={`text-[11px] font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Export Frame Cut:
                          </span>
                          <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${appTheme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-inner'}`}>
                            <button
                              type="button"
                              onClick={() => {
                                setAutoFitFrameMode('tight');
                                localStorage.setItem('iconderry_autofit_mode', 'tight');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${autoFitFrameMode === 'tight'
                                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              title="Frame ends closely right where outermost elements end (No empty space)"
                            >
                              Tight Crop (No empty space)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAutoFitFrameMode('square');
                                localStorage.setItem('iconderry_autofit_mode', 'square');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${autoFitFrameMode === 'square'
                                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                }`}
                              title="Pad with equal borders into a 1:1 Square"
                            >
                              Square 1:1
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Download CTA */}
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-white"
                    >
                      <Download className="w-4 h-4" />
                      {downloading ? 'Rendering & Exporting...' : exportFormat === 'ico' ? `Download .ICO (${exportSize}px High-Res Bundle)` : `Download .${exportFormat.toUpperCase()} (${exportSize >= 1024 ? `${exportSize / 1024}K` : exportSize + 'px'})`}
                    </button>

                    {/* Expandable Advanced Export Settings Section */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAdvancedExportOpen(prev => !prev)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${isAdvancedExportOpen
                          ? appTheme === 'dark'
                            ? 'bg-slate-900 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-950/30'
                            : 'bg-white border-cyan-500/50 text-cyan-700 shadow-md'
                          : appTheme === 'dark'
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs font-bold tracking-tight">Advanced Settings</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                            Pro Tools
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAdvancedExportOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
                      </button>

                      {isAdvancedExportOpen && (
                        <div className={`mt-3 p-4 rounded-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-150 ${appTheme === 'dark' ? 'bg-[#090d16] border-slate-800' : 'bg-slate-50/90 border-slate-200'
                          }`}>
                          {/* 1. CUSTOM FILE NAME & AUTO-TAGGING */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                <FileText className="w-3.5 h-3.5 text-cyan-500" />
                                <span>Custom File Name</span>
                              </label>
                              <span className="text-[10px] font-mono text-cyan-400">
                                .{exportFormat}
                              </span>
                            </div>

                            <div className="relative">
                              <input
                                type="text"
                                value={exportCustomFilename}
                                onChange={(e) => setExportCustomFilename(e.target.value)}
                                placeholder={selectedAsset?.title || 'my-custom-icon'}
                                className={`w-full py-2 pl-3 pr-8 rounded-xl text-xs font-medium border transition outline-none ${appTheme === 'dark'
                                  ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-500'
                                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                                  }`}
                              />
                              {exportCustomFilename && (
                                <button
                                  type="button"
                                  onClick={() => setExportCustomFilename('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                  title="Clear custom filename"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Auto Tag Dimensions Toggle */}
                            <div className="flex items-center justify-between pt-1">
                              <label className={`text-[11px] flex items-center gap-2 cursor-pointer ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                <input
                                  type="checkbox"
                                  checked={exportAutoTagDimensions}
                                  onChange={(e) => setExportAutoTagDimensions(e.target.checked)}
                                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                                />
                                <span>Append resolution tag (e.g. -{exportSize}x{exportSize})</span>
                              </label>
                            </div>

                            {/* Live Name Preview */}
                            <div className={`p-2 rounded-xl border text-[11px] font-mono break-all flex items-center gap-1.5 ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                              }`}>
                              <span className="text-cyan-500 font-bold shrink-0">Output:</span>
                              <span className="text-slate-200 font-semibold truncate">
                                {((exportCustomFilename.trim() || selectedAsset?.title || 'icon')
                                  .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '') || 'icon')}
                                {exportAutoTagDimensions ? `-${exportSize}x${exportSize}` : ''}.{exportFormat}
                              </span>
                            </div>
                          </div>

                          {/* 2. FILE SIZE & QUALITY COMPRESSION */}
                          <div className="space-y-2.5 pt-1 border-t border-slate-800/60">
                            <div className="flex items-center justify-between">
                              <label className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>Compression &amp; Quality</span>
                              </label>
                              <span className="text-xs font-mono font-bold text-cyan-400">
                                {exportQuality}%
                              </span>
                            </div>

                            <input
                              type="range"
                              min="10"
                              max="100"
                              step="1"
                              value={exportQuality}
                              onChange={(e) => setExportQuality(Number(e.target.value))}
                              className="theme-slider w-full"
                            />

                            {/* Preset Buttons */}
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { label: 'Ultra 100%', q: 100 },
                                { label: 'High 90%', q: 90 },
                                { label: 'Balance 80%', q: 80 },
                                { label: 'Light 60%', q: 60 }
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => setExportQuality(preset.q)}
                                  className={`py-1 rounded-lg text-[10px] font-semibold border transition ${exportQuality === preset.q
                                    ? 'bg-blue-600 border-blue-400 text-white shadow'
                                    : appTheme === 'dark'
                                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>

                            {/* Estimated File Size Indicator */}
                            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                              }`}>
                              <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
                                Estimated Size:
                              </span>
                              <span className="font-mono font-bold text-emerald-400">
                                {(() => {
                                  if (exportFormat === 'svg') return '~3 - 8 KB (Pure Vector)';
                                  if (exportFormat === 'ico') return '~15 - 45 KB (Multi-Res .ICO)';
                                  const baseK = (exportSize * exportSize) / 1000;
                                  let factor = 0.32;
                                  if (exportFormat === 'webp') factor = 0.12 * (exportQuality / 100);
                                  else if (exportFormat === 'jpeg') factor = 0.18 * (exportQuality / 100);
                                  else factor = 0.40; // PNG
                                  const kb = Math.max(4, Math.round(baseK * factor));
                                  if (kb >= 1024) return `~${(kb / 1024).toFixed(1)} MB`;
                                  return `~${kb} KB`;
                                })()}
                              </span>
                            </div>
                            <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                              * WebP and JPEG compression optimizes files for faster web loading.
                            </p>
                          </div>

                          {/* 3. SOLID / GRADIENT BACKGROUND SELECTOR */}
                          <div className="space-y-3 pt-1 border-t border-slate-800/60">
                            <div className="flex items-center justify-between">
                              <label className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                <Palette className="w-3.5 h-3.5 text-cyan-500" />
                                <span>Export Background Fill</span>
                              </label>
                              {isTransparent && (
                                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  Transparent ON
                                </span>
                              )}
                            </div>

                            <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              {isTransparent
                                ? 'Notice: Uncheck "Transparent Background" above to render this custom background.'
                                : 'Active background: This background will be applied in your downloaded export.'}
                            </p>

                            {/* Solid vs Gradient Switcher */}
                            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
                              <button
                                type="button"
                                onClick={() => {
                                  setExportBgType('solid');
                                  if (isTransparent) setIsTransparent(false);
                                }}
                                className={`py-1.5 rounded-lg text-xs font-semibold transition ${exportBgType === 'solid'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'text-slate-400 hover:text-white'
                                  }`}
                              >
                                Solid Color
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExportBgType('gradient');
                                  if (isTransparent) setIsTransparent(false);
                                }}
                                className={`py-1.5 rounded-lg text-xs font-semibold transition ${exportBgType === 'gradient'
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'text-slate-400 hover:text-white'
                                  }`}
                              >
                                Gradient Fill
                              </button>
                            </div>

                            {/* SOLID COLOR PICKER */}
                            {exportBgType === 'solid' && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {[
                                    '#FFFFFF', '#0b0f19', '#000000', '#082f49',
                                    '#1e1b4b', '#064e3b', '#4c0519', '#7c2d12'
                                  ].map((c) => (
                                    <button
                                      key={c}
                                      type="button"
                                      onClick={() => {
                                        setExportBgSolidColor(c);
                                        if (isTransparent) setIsTransparent(false);
                                      }}
                                      title={c}
                                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 relative ${exportBgSolidColor.toLowerCase() === c.toLowerCase()
                                        ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-110'
                                        : 'border-slate-700'
                                        }`}
                                      style={{ backgroundColor: c }}
                                    />
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={exportBgSolidColor}
                                    onChange={(e) => {
                                      setExportBgSolidColor(e.target.value);
                                      if (isTransparent) setIsTransparent(false);
                                    }}
                                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                                  />
                                  <input
                                    type="text"
                                    value={exportBgSolidColor}
                                    onChange={(e) => {
                                      setExportBgSolidColor(e.target.value);
                                      if (isTransparent) setIsTransparent(false);
                                    }}
                                    className={`w-28 py-1 px-2.5 rounded-lg text-xs font-mono font-bold uppercase border ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                                      }`}
                                  />
                                </div>
                              </div>
                            )}

                            {/* GRADIENT PRESETS PICKER */}
                            {exportBgType === 'gradient' && (
                              <div className="space-y-2.5">
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { id: 'cyber', name: 'Cyber Dark', from: '#060a12', to: '#1e293b' },
                                    { id: 'indigo', name: 'Midnight', from: '#0f172a', to: '#312e81' },
                                    { id: 'crimson', name: 'Sunset', from: '#450a0a', to: '#831843' },
                                    { id: 'emerald', name: 'Forest', from: '#022c22', to: '#065f46' },
                                    { id: 'mesh', name: 'Steel', from: '#18181b', to: '#3f3f46' },
                                    { id: 'frost', name: 'Frost Light', from: '#f8fafc', to: '#cbd5e1' }
                                  ].map((g) => {
                                    const isSelected = exportBgGradient.from === g.from && exportBgGradient.to === g.to;
                                    return (
                                      <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => {
                                          setExportBgGradient(prev => ({ ...prev, from: g.from, to: g.to, preset: g.id }));
                                          if (isTransparent) setIsTransparent(false);
                                        }}
                                        className={`h-12 rounded-xl border p-1 text-left flex flex-col justify-end transition-transform hover:scale-105 ${isSelected
                                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                                          : 'border-slate-800'
                                          }`}
                                        style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                                      >
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md ${g.id === 'frost' ? 'bg-black/60 text-white' : 'bg-black/50 text-white'
                                          }`}>
                                          {g.name}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Gradient Angle Buttons */}
                                <div className="flex items-center justify-between pt-1 text-[10px]">
                                  <span className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Angle:</span>
                                  <div className="flex items-center gap-1">
                                    {[
                                      { label: '90° (Horiz)', angle: 90 },
                                      { label: '135° (Diag)', angle: 135 },
                                      { label: '180° (Vert)', angle: 180 }
                                    ].map((a) => (
                                      <button
                                        key={a.angle}
                                        type="button"
                                        onClick={() => setExportBgGradient(prev => ({ ...prev, angle: a.angle }))}
                                        className={`px-2 py-0.5 rounded border text-[10px] font-semibold transition ${exportBgGradient.angle === a.angle
                                          ? 'bg-cyan-600 text-white border-cyan-400'
                                          : appTheme === 'dark'
                                            ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                                            : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                                          }`}
                                      >
                                        {a.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Fixed Export Bar (Always accessible on Desktop) */}
              {studioTab !== 'export' && (
                <div className={`hidden lg:flex p-4 border-t items-center justify-between gap-3 ${appTheme === 'dark' ? 'border-[#22242c] bg-[#18191f]' : 'border-slate-200 bg-slate-50 shadow-inner'
                  }`}>
                  <div className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className={`font-semibold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>.{exportFormat.toUpperCase()}</span> &bull; {exportSize >= 1024 ? `${exportSize / 1024}K` : `${exportSize}px`}
                  </div>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 text-white disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloading ? 'Exporting...' : 'Export Image'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Studio Tools Dock (Desktop: Right vertical dock; Mobile: Bottom horizontal dock) */}
            <aside
              aria-label="Studio Tools Dock"
              className={`w-full lg:w-14 lg:sm:w-16 h-14 lg:h-full flex flex-row lg:flex-col justify-between items-center py-1 lg:py-2 px-1 lg:px-0 border-t lg:border-t-0 lg:border-l flex-shrink-0 z-30 select-none transition-colors duration-200 ${
                appTheme === 'dark' ? 'bg-[#18191f] border-[#22242c]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="w-full h-full flex flex-row lg:flex-col items-center gap-1 sm:gap-1.5 px-1.5 lg:px-1.5 py-0.5 overflow-x-auto lg:overflow-y-auto no-scrollbar">
                {STUDIO_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = isStudioPanelOpen && studioTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleStudioTabClick(tab.id)}
                      title={`${tab.label}${isActive ? ' (Click to close panel)' : ' (Click to open panel)'}`}
                      className={`h-full lg:h-auto min-w-[58px] lg:min-w-0 lg:w-full py-1 lg:py-2 px-2 lg:px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-150 group relative cursor-pointer active:scale-95 flex-shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-b from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-300/40'
                          : appTheme === 'dark'
                            ? 'text-slate-400 hover:text-slate-100 hover:bg-[#22242c]'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                    >
                      {/* Active indicator bar on left edge for desktop */}
                      {isActive && (
                        <span className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-sm" />
                      )}
                      {/* Active indicator bar on top edge for mobile */}
                      {isActive && (
                        <span className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 h-1 w-6 bg-white rounded-b-full shadow-sm" />
                      )}

                      <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
                      <span className={`text-[9px] sm:text-[10px] font-semibold leading-tight tracking-tight text-center ${
                        isActive ? 'text-white font-bold' : ''
                      }`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* App Settings Modal Panel */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className={`w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-4 sm:p-7 relative transition-all duration-200 max-h-[90vh] overflow-y-auto ${appTheme === 'dark'
              ? 'bg-[#18191f] border-[#22242c] text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between pb-3.5 sm:pb-4 border-b mb-4 sm:mb-5 ${appTheme === 'dark' ? 'border-[#22242c]' : 'border-slate-100'
              }`}>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <img
                  src="/app-icon.png"
                  alt="Iconderry Icon"
                  className="w-10 h-10 rounded-xl object-cover shadow-md shadow-purple-600/30 border border-white/20 flex-shrink-0"
                />
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight">App Settings</h2>
                  <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Customize dark mode, studio presets & preferences
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className={`p-1.5 sm:p-2 rounded-xl transition ${appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification / Toast inside Modal (for library resets/format defaults) */}
            {settingsToast && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{settingsToast}</span>
              </div>
            )}

            <div className="space-y-4 sm:space-y-5">
              {/* 1. DARK MODE ON / OFF TOGGLE */}
              <div className={`p-3.5 sm:p-4 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl ${appTheme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-amber-100 text-amber-600'}`}>
                      {appTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold">Dark Mode (Theme)</h3>
                      <p className={`text-[11px] sm:text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {appTheme === 'dark' ? 'Currently ON (Deep Cyber Dark)' : 'Currently OFF (Clean Studio Light)'}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Sliding Toggle Switch */}
                  <button
                    onClick={() => {
                      const next = appTheme === 'dark' ? 'light' : 'dark';
                      setAppTheme(next);
                    }}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner flex-shrink-0 ${appTheme === 'dark' ? 'bg-cyan-500' : 'bg-slate-300'
                      }`}
                    title="Toggle Dark Mode On / Off"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${appTheme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {/* Theme Selector Cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
                  <button
                    onClick={() => {
                      setAppTheme('dark');
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition ${appTheme === 'dark'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 ring-2 ring-cyan-500/20'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">Dark Mode</span>
                        <span className="text-[10px] opacity-70">Deep OLED</span>
                      </div>
                    </div>
                    {appTheme === 'dark' && <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                  </button>

                  <button
                    onClick={() => {
                      setAppTheme('light');
                    }}
                    className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition ${appTheme === 'light'
                      ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600/20'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-bold block">Light Mode</span>
                        <span className="text-[10px] opacity-70">Crisp White</span>
                      </div>
                    </div>
                    {appTheme === 'light' && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                  </button>
                </div>
              </div>

              {/* 3. DEFAULT EXPORT CONFIGURATION */}
              <div className={`p-4 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  <Download className="w-3.5 h-3.5 text-cyan-400" /> Default Export Format
                </h3>
                <div className="grid grid-cols-6 gap-1.5">
                  {['png', 'svg', 'ico', 'webp', 'jpeg', 'gif'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setExportFormat(fmt);
                        localStorage.setItem('iconderry_default_format', fmt);
                        setSettingsToast(`Default format set to .${fmt.toUpperCase()}`);
                        setTimeout(() => setSettingsToast(''), 2500);
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase transition border ${exportFormat === fmt
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : appTheme === 'dark'
                          ? 'bg-slate-800/80 border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      .{fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. DATA & STORAGE MANAGEMENT */}
              <div className={`p-4 rounded-2xl border ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                      Library Storage
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                    {elements.length} Assets Stored
                  </span>
                </div>
                <p className={`text-xs mb-3 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Custom assets and edits are persisted locally in browser localStorage.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Kya aap default Iconderry icon library ko reload/reset karna chahte hain?')) {
                      const fresh = INITIAL_ELEMENTS.map(el => ({ ...el, downloads: el.downloads || 0 }));
                      setElements(fresh);
                      localStorage.setItem('iconderry_assets', JSON.stringify(fresh));
                      setSettingsToast('Default library successfully restored!');
                      setTimeout(() => setSettingsToast(''), 3000);
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${appTheme === 'dark'
                    ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm'
                    }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset / Reload Default Icon Library</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${appTheme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
              <span className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Iconderry Studio &bull; Pro Suite v2.4
              </span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/30"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal & Feedback Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative max-h-[85vh] overflow-y-auto ${appTheme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}>
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/40 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content Based on activeLegalModal */}
            {activeLegalModal === 'license' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Shield className="w-5 h-5" /> Commercial &amp; Personal License
                </div>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <p><strong>100% Free &amp; Royalty-Free:</strong> All icons customized or downloaded on Iconderry can be used freely in personal and commercial projects without any license fee.</p>
                  <p><strong>Allowed:</strong> Websites, web apps, iOS/Android mobile apps, marketing graphics, presentations, social media, printed merchandise, and UI design kits.</p>
                  <p><strong>Attribution:</strong> Attribution is appreciated but not mandatory.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Shield className="w-5 h-5" /> Privacy Policy
                </div>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <p><strong>Zero Tracking:</strong> Iconderry does not sell personal data, inject third-party ad trackers, or log your vector designs.</p>
                  <p><strong>Local Storage:</strong> Your preferences and favorite items are stored securely inside your browser's local storage.</p>
                  <p><strong>Cloud Assets:</strong> Community assets are served securely via cloud storage for fast global performance.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <FileText className="w-5 h-5" /> Terms of Service
                </div>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <p>Iconderry provides vector icon generation, styling, and export tools "as is".</p>
                  <p>Users are responsible for ensuring any custom SVG assets uploaded do not violate third-party trademarks or copyrights.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'about' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Info className="w-5 h-5" /> About Iconderry
                </div>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <p><strong>Iconderry</strong> is built for creators, software engineers, and product designers who need fast, pixel-perfect, and customizable vector graphics.</p>
                  <p>Unlike traditional static icon libraries, Iconderry provides a full-featured real-time vector studio with 29+ material shaders, granular filter color grading, custom stroke weights, and app icon squircle badges.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'feedback' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <MessageSquarePlus className="w-5 h-5" /> Request an Icon or Send Feedback
                </div>
                {feedbackSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-400" />
                    <p className="font-bold text-sm">Shukriya!</p>
                    <p>Aapka icon request / feedback successfully receive ho gaya hai.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFeedbackSubmitted(true);
                      setTimeout(() => {
                        setActiveLegalModal(null);
                        setFeedbackSubmitted(false);
                      }, 2500);
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="block font-semibold mb-1">Your Name or Handle</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sahil"
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Icon Request or Suggestion</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="e.g. Please add an e-commerce shopping bag or crypto token icons pack..."
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-cyan-500/20"
                    >
                      Submit Request
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800/60 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Element from Library Modal */}
      {isAddElementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-3xl max-h-[85vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${appTheme === 'dark' ? 'bg-[#0d1527] border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-700/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Element from Library</h3>
                  <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Select any object or icon to insert onto your canvas as editable vector parts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddElementModalOpen(false)}
                className={`p-2 rounded-xl border transition ${appTheme === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 border-b border-slate-700/20 flex flex-col sm:flex-row gap-2.5 flex-shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search elements by title or tag..."
                  value={addElementSearch}
                  onChange={(e) => setAddElementSearch(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500 transition ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setAddElementCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${addElementCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                        : appTheme === 'dark' ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Elements */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {elements.filter(el => {
                const matchesSearch = el.title.toLowerCase().includes(addElementSearch.toLowerCase()) ||
                  el.tags?.toLowerCase().includes(addElementSearch.toLowerCase());
                const matchesCategory = addElementCategory === 'All'
                  ? true
                  : addElementCategory === 'Favorites'
                    ? favorites.includes(el.id)
                    : el.category === addElementCategory;
                return matchesSearch && matchesCategory;
              }).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleInsertElementFromLibrary(item)}
                  className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-between transition-all duration-200 hover:-translate-y-1 group relative ${appTheme === 'dark'
                      ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-950/40'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-500 hover:shadow-lg'
                    }`}
                >
                  <div
                    data-gallery-preview="true"
                    className="gallery-card-preview w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-2 mb-2 [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible overflow-visible transition-transform group-hover:scale-105 pointer-events-none"
                    dangerouslySetInnerHTML={{
                      __html: scopeSvgIds(
                        normalizeForeignObjectSvg(item.originalSvgCode || item.svgCode),
                        `modal_${String(item.id).replace(/[^a-zA-Z0-9_-]/g, '_')}_`
                      )
                    }}
                  />
                  <div className="w-full text-center pointer-events-none">
                    <span className={`text-xs font-bold truncate block ${appTheme === 'dark' ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                      {item.title}
                    </span>
                    <span className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-2 w-full py-1 text-[10px] font-semibold text-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                    + Insert to Canvas
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canvas Help & Navigation Guide Modal */}
      {isHelpModalOpen && (
        <div
          onClick={() => setIsHelpModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-3xl max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${appTheme === 'dark' ? 'bg-[#0d1527] border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-700/30 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <span>Navigation & Shortcuts Guide</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Help
                    </span>
                  </h3>
                  <p className={`text-xs ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Complete guide for canvas navigation, gestures, and keyboard shortcuts
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className={`p-2 rounded-xl border transition ${appTheme === 'dark' ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar & Mode Tabs */}
            <div className="p-3.5 sm:p-4 border-b border-slate-700/20 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between flex-shrink-0">
              {/* Real-time Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shortcuts, gestures, or actions (e.g. zoom, copy, drag, rotate)..."
                  value={helpSearchQuery}
                  onChange={(e) => setHelpSearchQuery(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-9 py-2 text-xs focus:outline-none focus:border-cyan-500 transition ${appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  autoFocus
                />
                {helpSearchQuery && (
                  <button
                    onClick={() => setHelpSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 1st Tab: PC (Default), 2nd Tab: Mobile */}
              <div className={`flex items-center p-1 rounded-2xl border flex-shrink-0 ${appTheme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                <button
                  type="button"
                  onClick={() => setHelpActiveTab('pc')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${helpActiveTab === 'pc'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>PC / Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHelpActiveTab('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${helpActiveTab === 'mobile'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile / Touch</span>
                </button>
              </div>
            </div>

            {/* Body Content List */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {(() => {
                const q = helpSearchQuery.trim().toLowerCase();
                const sourceList = helpActiveTab === 'pc' ? PC_HELP_GUIDE : MOBILE_HELP_GUIDE;
                const filtered = sourceList.map(cat => ({
                  ...cat,
                  items: cat.items.filter(item => {
                    if (!q) return true;
                    const matchTitle = item.title.toLowerCase().includes(q);
                    const matchDesc = item.desc.toLowerCase().includes(q);
                    const matchKeys = (item.keys || [item.gesture || '']).some(k => k.toLowerCase().includes(q));
                    const matchCat = cat.category.toLowerCase().includes(q);
                    return matchTitle || matchDesc || matchKeys || matchCat;
                  })
                })).filter(cat => cat.items.length > 0);

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center">
                      <p className="text-sm font-semibold text-slate-400">No shortcuts or commands found matching "{helpSearchQuery}".</p>
                      <button
                        onClick={() => setHelpSearchQuery('')}
                        className="mt-3 text-xs text-cyan-400 hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  );
                }

                return filtered.map((cat, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${appTheme === 'dark' ? 'text-cyan-400/90' : 'text-cyan-700'
                      }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{cat.category}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {cat.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${appTheme === 'dark'
                              ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                              : 'bg-slate-50/80 border-slate-200/90 hover:border-slate-300'
                            }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{item.title}</span>
                            <span className={`text-[11px] block mt-0.5 leading-relaxed ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                              {item.desc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            {item.keys ? (
                              item.keys.map((k, kIdx) => (
                                <span
                                  key={kIdx}
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border shadow-sm ${appTheme === 'dark'
                                      ? 'bg-slate-950 text-cyan-300 border-slate-700'
                                      : 'bg-white text-slate-800 border-slate-300'
                                    }`}
                                >
                                  {k}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shadow-sm ${appTheme === 'dark'
                                    ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/50'
                                    : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                                  }`}
                              >
                                {item.gesture}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Modal Footer Tip */}
            <div className={`p-3.5 px-5 border-t border-slate-700/20 text-center flex items-center justify-between text-xs flex-shrink-0 ${appTheme === 'dark' ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-50 text-slate-600'
              }`}>
              <span>Tip: Click or drag any element on the canvas for instant live editing.</span>
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="font-bold text-cyan-400 hover:text-cyan-300 text-xs px-3 py-1 rounded-lg hover:bg-cyan-500/10 transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Wheel Popover (Opened via double-click on bottom palette swatches) */}
      {colorWheelPopover && (
        <ColorWheelPopover
          popover={colorWheelPopover}
          onClose={() => setColorWheelPopover(null)}
          onColorChange={handleColorChange}
          appTheme={appTheme}
        />
      )}

      {/* Live Rendering & Export Progress Modal */}
      {exportProgress && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-3xl p-6 sm:p-7 border border-cyan-500/30 text-white shadow-2xl shadow-black/95 relative overflow-hidden bg-[#090d18]/96 ring-1 ring-cyan-500/20"
          >
            {/* Ambient Background Glow Flares */}
            <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
                  {exportFormat === 'gif' ? (
                    <Film className="w-5 h-5 text-cyan-400 animate-pulse" />
                  ) : (
                    <Download className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-white">Iconderry Render Engine</h4>
                  <p className="text-[11px] text-cyan-400 font-medium truncate max-w-[190px]">
                    {exportProgress.details || 'Processing high-res output'}
                  </p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider">
                .{exportFormat.toUpperCase()}
              </div>
            </div>

            {/* Central Live Percentage Counter */}
            <div className="my-5 text-center relative z-10">
              <div className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 font-mono drop-shadow-md">
                {Math.min(100, Math.max(0, exportProgress.percent))}%
              </div>
              <div className="mt-2 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{exportProgress.stage || 'Rendering in progress...'}</span>
              </div>
            </div>

            {/* High-Tech Animated Progress Bar */}
            <div className="w-full bg-slate-900/90 rounded-full h-3.5 p-0.5 border border-slate-700/60 overflow-hidden relative shadow-inner mb-3 z-10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-150 ease-out shadow-lg shadow-cyan-500/50 relative overflow-hidden"
                style={{ width: `${Math.min(100, Math.max(3, exportProgress.percent))}%` }}
              >
                <div className="absolute inset-0 bg-white/25 animate-pulse" />
              </div>
            </div>

            {/* GPU Dedicated & Background Paused Indicator */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1.5 border-t border-slate-800/60 relative z-10">
              <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
                <Zap className="w-3 h-3 text-cyan-400" /> 100% Dedicated GPU
              </span>
              <span className="text-emerald-400/90 font-medium">Canvas Animation Paused</span>
            </div>

            {/* Cancel Button */}
            <div className="mt-4 pt-1 relative z-10">
              <button
                type="button"
                onClick={handleCancelExport}
                className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel Export</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Native Mobile Bottom Navigation Bar (Visible only on mobile/tablet < 768px) */}
      <nav 
        aria-label="Mobile Navigation"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-3 py-1.5 flex items-center justify-around shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.3)] ${
          appTheme === 'dark'
            ? 'bg-[#121316]/95 border-[#1f2128] text-slate-400'
            : 'bg-white/95 border-slate-200 text-slate-600 shadow-lg'
        }`}
      >
        {/* 1. Gallery */}
        <button
          type="button"
          onClick={() => setActiveTab('browse')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
            activeTab === 'browse'
              ? 'text-blue-500 font-bold'
              : 'hover:text-slate-200'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 ${activeTab === 'browse' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Gallery</span>
        </button>

        {/* 2. Studio (Swapped with Blog as requested) */}
        <button
          type="button"
          onClick={() => {
            if (selectedAsset) {
              // Studio already open
            } else {
              handleOpenEmptyStudio();
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
            selectedAsset
              ? 'text-cyan-400 font-bold'
              : 'hover:text-slate-200 text-slate-400'
          }`}
          title="Open Studio"
        >
          <Palette className={`w-5 h-5 ${selectedAsset ? 'stroke-[2.5] text-cyan-400' : ''}`} />
          <span className="text-[10px] mt-0.5">Studio</span>
        </button>

        {/* 3. Central Prominent Upload Floating Button (Sleek and compact for mobile) */}
        <button
          type="button"
          onClick={() => {
            if (selectedAsset) handleCloseStudio();
            setActiveTab('admin');
          }}
          className="flex flex-col items-center justify-center -mt-3.5 cursor-pointer group active:scale-95"
          title="Upload Element"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-active:scale-95 transition-transform border-2 border-[#121316]">
            <UploadCloud className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <span className="text-[9px] font-bold mt-0.5 text-blue-400">Upload</span>
        </button>

        {/* 4. Blog (Swapped with Studio as requested) */}
        <button
          type="button"
          onClick={() => {
            if (selectedAsset) handleCloseStudio();
            setActiveTab('blog');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 relative ${
            !selectedAsset && activeTab === 'blog'
              ? 'text-blue-500 font-bold'
              : 'hover:text-slate-200 text-slate-400'
          }`}
          title="Open Blog"
        >
          <BookOpen className={`w-5 h-5 ${!selectedAsset && activeTab === 'blog' ? 'stroke-[2.5] text-blue-500' : ''}`} />
          <span className="text-[10px] mt-0.5">Blog</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-1 right-1.5 animate-pulse" />
        </button>

        {/* 5. Settings (Full Page View) */}
        <button
          type="button"
          onClick={() => {
            if (selectedAsset) handleCloseStudio();
            setActiveTab('settings');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
            !selectedAsset && activeTab === 'settings'
              ? 'text-blue-500 font-bold'
              : 'hover:text-slate-200 text-slate-400'
          }`}
          title="Open Settings"
        >
          <Settings className={`w-5 h-5 ${!selectedAsset && activeTab === 'settings' ? 'stroke-[2.5] text-blue-500' : ''}`} />
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </nav>

      {/* High-Converting Asset Detail Showcase Modal */}
      {detailModalAsset && (
        <AssetDetailModal
          key={detailModalAsset.id}
          isOpen={Boolean(detailModalAsset)}
          asset={detailModalAsset}
          allAssets={elements}
          onClose={() => setDetailModalAsset(null)}
          onOpenInStudio={(item, initialTab) => {
            setDetailModalAsset(null);
            handleOpenAsset(item, initialTab || 'colors');
          }}
          isFavorite={detailModalAsset ? favorites.includes(detailModalAsset.id) : false}
          onToggleFavorite={toggleFavorite}
          appTheme={appTheme}
          onToggleTheme={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        />
      )}

      {/* Gallery Admin Edit Asset Details Modal */}
      {editingModalAsset && (
        <EditAssetDetailsModal
          isOpen={Boolean(editingModalAsset)}
          asset={editingModalAsset}
          title={editAssetTitle}
          setTitle={setEditAssetTitle}
          description={editAssetDescription}
          setDescription={setEditAssetDescription}
          category={editAssetCategory}
          setCategory={setEditAssetCategory}
          tags={editAssetTags}
          setTags={setEditAssetTags}
          pack={editAssetPack}
          setPack={setEditAssetPack}
          isSaving={isSavingAssetDetails}
          error={editAssetError}
          success={editAssetSuccess}
          onClose={handleCloseEditAssetModal}
          onSave={handleSaveAssetDetails}
          appTheme={appTheme}
        />
      )}



      {/* Supabase User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        appTheme={appTheme}
        onAuthSuccess={(user) => {
          setAuthUser(user);
        }}
      />

      {/* Mobile Double-Back Exit Toast */}
      {backToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[999999] px-4 py-2 rounded-full bg-slate-900/95 border border-slate-700/80 backdrop-blur-md text-white text-xs font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none flex items-center gap-2">
          <span>{backToast}</span>
        </div>
      )}
    </div>
  );
}


/**
 * ColorWheelPopover Component
 * Displays a 360-degree interactive circular color wheel, lightness slider,
 * hex input, eyedropper, and quick presets directly floating above the clicked palette swatch.
 */
function ColorWheelPopover({ popover, onClose, onColorChange, appTheme }) {
  const [hexVal, setHexVal] = useState(popover.currentHex || popover.originalColor || '#38bdf8');
  const initialHsl = hexToHsl(hexVal);
  const [hsl, setHsl] = useState(initialHsl);
  const wheelRef = useRef(null);
  const lightnessRef = useRef(null);
  const isDraggingWheelRef = useRef(false);
  const isDraggingLightnessRef = useRef(false);
  const popoverRef = useRef(null);

  // Sync state if popover prop changes
  useEffect(() => {
    const cur = popover.currentHex || popover.originalColor || '#38bdf8';
    setHexVal(cur);
    setHsl(hexToHsl(cur));
  }, [popover.originalColor, popover.currentHex]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handleClickOutside);
    }, 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [onClose]);

  const applyHsl = (newHsl) => {
    setHsl(newHsl);
    const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setHexVal(newHex);
    onColorChange(popover.originalColor, newHex);
  };

  const handleWheelPointer = (e) => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rad = Math.atan2(dy, dx);
    let deg = Math.round((rad * 180) / Math.PI);
    if (deg < 0) deg += 360;
    const dist = Math.hypot(dx, dy);
    const maxR = rect.width / 2;
    const sat = Math.min(100, Math.max(0, Math.round((dist / maxR) * 100)));
    applyHsl({ ...hsl, h: deg, s: sat });
  };

  const handleWheelDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingWheelRef.current = true;
    handleWheelPointer(e);

    const handleMove = (ev) => {
      if (isDraggingWheelRef.current) handleWheelPointer(ev);
    };
    const handleUp = () => {
      isDraggingWheelRef.current = false;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleLightnessPointer = (e) => {
    if (!lightnessRef.current) return;
    const rect = lightnessRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newL = Math.round(5 + ratio * 90);
    applyHsl({ ...hsl, l: newL });
  };

  const handleLightnessDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingLightnessRef.current = true;
    handleLightnessPointer(e);

    const handleMove = (ev) => {
      if (isDraggingLightnessRef.current) handleLightnessPointer(ev);
    };
    const handleUp = () => {
      isDraggingLightnessRef.current = false;
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleHexInput = (e) => {
    const val = e.target.value;
    setHexVal(val);
    const norm = normalizeColor(val);
    if (norm) {
      const parsedHsl = hexToHsl(norm);
      setHsl(parsedHsl);
      onColorChange(popover.originalColor, norm);
    }
  };

  const handleQuickColor = (color) => {
    setHexVal(color);
    const parsedHsl = hexToHsl(color);
    setHsl(parsedHsl);
    onColorChange(popover.originalColor, color);
  };

  const handleReset = () => {
    handleQuickColor(popover.originalColor);
  };

  // Dimensions & Positioning
  const popoverWidth = 250;
  const clampedX = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, popover.anchorX - popoverWidth / 2));
  const bottomPos = Math.max(16, window.innerHeight - popover.anchorY + 14);
  const arrowOffset = Math.max(14, Math.min(popoverWidth - 14, popover.anchorX - clampedX));

  // Wheel indicator handle position
  const wheelRadius = 75; // 150px wheel / 2
  const handleX = wheelRadius + Math.cos((hsl.h * Math.PI) / 180) * ((hsl.s / 100) * wheelRadius);
  const handleY = wheelRadius + Math.sin((hsl.h * Math.PI) / 180) * ((hsl.s / 100) * wheelRadius);
  const lightnessPercent = Math.max(0, Math.min(100, ((hsl.l - 5) / 90) * 100));

  const QUICK_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#10b981', '#06b6d4',
    '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#020617'
  ];

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Color Wheel Popover"
      className={`fixed z-[9999] rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 select-none ${appTheme === 'dark'
          ? 'bg-slate-950/95 border-slate-800 text-slate-100 ring-1 ring-white/10'
          : 'bg-white/95 border-slate-200 text-slate-900 ring-1 ring-black/5'
        }`}
      style={{
        left: `${clampedX}px`,
        bottom: `${bottomPos}px`,
        width: `${popoverWidth}px`
      }}
    >
      {/* Downward pointing arrow directly over the clicked swatch */}
      <div
        className="absolute -bottom-2 w-4 h-4 rotate-45 pointer-events-none"
        style={{
          left: `${arrowOffset - 8}px`,
          backgroundColor: appTheme === 'dark' ? '#020617' : '#ffffff',
          borderRight: appTheme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
          borderBottom: appTheme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-pink-500 via-cyan-400 to-amber-400 shadow-sm" />
          <span className="text-xs font-bold tracking-wide">Color Wheel</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            title="Reset to original color"
            className="text-[10px] px-1.5 py-0.5 rounded font-medium hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            ×
          </button>
        </div>
      </div>

      {/* Circular Color Wheel */}
      <div className="flex justify-center py-1">
        <div
          ref={wheelRef}
          onPointerDown={handleWheelDown}
          className="relative w-[150px] h-[150px] rounded-full cursor-crosshair shadow-inner border border-white/20 select-none touch-none"
          style={{
            background: `radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0) 75%, rgba(0,0,0,0.3) 100%), conic-gradient(from 90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`
          }}
        >
          {/* Wheel handle */}
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
            style={{
              left: `${handleX}px`,
              top: `${handleY}px`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: hexVal
            }}
          />
        </div>
      </div>

      {/* Lightness Slider */}
      <div className="mt-2.5">
        <div className="flex justify-between items-center text-[10px] mb-1 text-slate-400">
          <span>Brightness / Light</span>
          <span className="font-mono">{hsl.l}%</span>
        </div>
        <div
          ref={lightnessRef}
          onPointerDown={handleLightnessDown}
          className="relative w-full h-3.5 rounded-full cursor-pointer shadow-inner border border-white/20 select-none touch-none"
          style={{
            background: `linear-gradient(to right, #000000, ${hslToHex(hsl.h, hsl.s, 50)}, #ffffff)`
          }}
        >
          <div
            className="absolute top-1/2 w-3.5 h-3.5 rounded-full border-2 border-white bg-slate-900 shadow-md pointer-events-none"
            style={{
              left: `${lightnessPercent}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      {/* Hex input & live preview chip */}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={hexVal}
            onChange={handleHexInput}
            maxLength={7}
            placeholder="#38bdf8"
            className={`w-full text-xs font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none focus:border-cyan-400 uppercase ${appTheme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
          />
        </div>
        {/* Native color picker button as quick alternative */}
        <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 shadow-sm flex-shrink-0 cursor-pointer">
          <input
            type="color"
            value={normalizeColor(hexVal) || '#38bdf8'}
            onChange={(e) => handleQuickColor(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Open system color picker"
          />
          <div
            className="w-full h-full"
            style={{ backgroundColor: hexVal }}
          />
        </div>
      </div>

      {/* Quick Color Swatches */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between gap-1">
        {QUICK_COLORS.map(c => (
          <button
            key={c}
            onClick={() => handleQuickColor(c)}
            title={c}
            className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 cursor-pointer ${hexVal.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-cyan-400 scale-110' : 'border-black/20'
              }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
}