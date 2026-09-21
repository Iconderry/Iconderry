import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Download, PlusCircle, LayoutGrid, Search, Trash2, CheckCircle2, 
  Zap, UploadCloud, Sliders, Palette, RotateCw, 
  FlipHorizontal, FlipVertical, RefreshCw, Sparkles, Sun, Droplet,
  Paintbrush, Undo2, Redo2, Layers, Check, ArrowLeft, X, ChevronDown, ChevronUp,
  Settings, Moon, RotateCcw, SlidersHorizontal, HardDrive, Monitor,
  ZoomIn, ZoomOut, Maximize2, Link2, Unlink2, Wand2, Scan,
  Heart, History, Shapes, MessageSquarePlus, Shield, FileText, Info,
  Eye, EyeOff, Box, Compass, Move3d, Film, Play, Activity, GripVertical
} from 'lucide-react';
import { INITIAL_ELEMENTS } from './initialData';
import { downloadAsset } from './converter';
import { extractSvgColors, replaceSvgColors, scopeSvgIds, normalizeColor, getLinkedGradientColors, adjustColorBrightness, applyUniversalStroke } from './colorUtils';
import { STYLE_RENDER_MODES, transformSvgStyle } from './styleTransformer';
import { supabase } from './supabaseClient';

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
  perspective: 800,
  skewX: 0,
  skewY: 0,
  depth3D: 0,
  depth3DColor: '#000000',
  is3DFloating: false,
  animPreset: 'float',
  animSpeed: 2.2,
  animHeight: 16,
  animShadowSync: true,
  customColor: '',
  colorReplacements: {}
};

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
  '3d_crystal_gemstone'
]);

// Renders an authentic live visual preview thumbnail showing the look of each filter preset
function FilterCardThumbnail({ preset }) {
  const { colorA, colorB, adjustments, badge } = preset;
  const glowColor = adjustments?.shadowColor || colorA || '#38bdf8';
  const hasGlow = (adjustments?.shadowBlur || 0) > 0;

  return (
    <div 
      className="w-full h-14 rounded-xl mb-2 overflow-hidden relative flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-200 select-none"
      style={{ 
        background: `linear-gradient(135deg, ${colorA}33, ${colorB}55, #0a0f1d 90%)` 
      }}
    >
      {/* Ambient glowing backdrop */}
      <div 
        className="absolute inset-0 opacity-50 blur-md pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${colorA} 0%, ${colorB} 60%, transparent 100%)`
        }}
      />

      {/* Styled Glyph demonstrating this filter's exact look */}
      <div 
        className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
          boxShadow: hasGlow ? `0 0 14px ${glowColor}, 0 0 4px ${glowColor}` : `0 2px 8px rgba(0,0,0,0.6)`,
          filter: `hue-rotate(${adjustments?.hue || 0}deg) saturate(${adjustments?.saturation || 100}%) brightness(${adjustments?.brightness || 100}%) contrast(${adjustments?.contrast || 100}%)`
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-white drop-shadow" />
      </div>

      {/* Filter Category / Tag Badge */}
      <span className="absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/65 backdrop-blur-sm text-white/90 border border-white/10 z-10">
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
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9"/>
            </linearGradient>
          </defs>
          <path d="M0,25 Q25,15 50,25 T100,25 L100,45 L0,45 Z" fill="url(#thumb_water_grad)"/>
          <circle cx="20" cy="18" r="4.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.85"/>
          <circle cx="21" cy="16" r="1.5" fill="#ffffff" opacity="0.9"/>
          <circle cx="75" cy="22" r="3.5" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8"/>
          <circle cx="76" cy="21" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="48" cy="12" r="2.5" fill="#ffffff" opacity="0.75"/>
          <path d="M10,8 Q15,4 20,8 M60,6 Q65,3 70,6" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8"/>
        </svg>
      )}

      {texture === 'balloon' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="12" y="6" width="76" height="33" rx="12" fill="#2563eb" stroke="#93c5fd" strokeWidth="2.5" strokeDasharray="4 2"/>
          <path d="M22,12 Q40,9 60,11" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85"/>
          <ellipse cx="70" cy="16" rx="4" ry="2" fill="#ffffff" opacity="0.75"/>
          <circle cx="12" cy="22" r="3" fill="#1d4ed8"/>
        </svg>
      )}

      {texture === 'frost' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M50,4 L50,41 M30,22 L70,22 M35,7 L65,37 M35,37 L65,7" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
          <path d="M50,12 L44,18 M50,12 L56,18 M50,32 L44,26 M50,32 L56,26 M38,22 L44,16 M38,22 L44,28 M62,22 L56,16 M62,22 L56,28" stroke="#ffffff" strokeWidth="1.2" opacity="0.75"/>
          <circle cx="50" cy="22" r="2" fill="#ffffff"/>
          <circle cx="20" cy="12" r="1" fill="#ffffff" opacity="0.9"/>
          <circle cx="80" cy="30" r="1.5" fill="#ffffff" opacity="0.8"/>
        </svg>
      )}

      {texture === 'lava' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,22 Q25,12 45,28 T100,20" stroke="#ff3b00" strokeWidth="4" fill="none" opacity="0.9"/>
          <path d="M0,22 Q25,12 45,28 T100,20" stroke="#ffea00" strokeWidth="1.8" fill="none"/>
          <path d="M30,0 L35,24 M65,45 L60,22" stroke="#ff5500" strokeWidth="2" fill="none"/>
          <circle cx="22" cy="10" r="1.5" fill="#ffea00" opacity="0.9"/>
          <circle cx="78" cy="14" r="1.8" fill="#ff3b00" opacity="0.9"/>
          <circle cx="45" cy="38" r="1.2" fill="#ffea00" opacity="0.9"/>
        </svg>
      )}

      {texture === 'wool' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0 opacity-85">
          <path d="M0,8 L100,8 M0,16 L100,16 M0,24 L100,24 M0,32 L100,32 M0,40 L100,40" stroke="#8c765c" strokeWidth="1" strokeDasharray="3 3"/>
          <path d="M10,0 L10,45 M30,0 L30,45 M50,0 L50,45 M70,0 L70,45 M90,0 L90,45" stroke="#a38f78" strokeWidth="1.5" opacity="0.5"/>
          <rect x="25" y="14" width="50" height="16" rx="4" fill="#a38f78" opacity="0.35" stroke="#78350f" strokeWidth="1.2" strokeDasharray="2 2"/>
        </svg>
      )}

      {texture === 'lego' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="5" y="12" width="28" height="28" fill="#ffd500" stroke="#ca8a04" strokeWidth="1"/>
          <rect x="33" y="12" width="34" height="28" fill="#0055bf" stroke="#1e40af" strokeWidth="1"/>
          <rect x="67" y="12" width="28" height="28" fill="#e60012" stroke="#991b1b" strokeWidth="1"/>
          <circle cx="19" cy="8" r="4.5" fill="#ffe033" stroke="#ca8a04" strokeWidth="1"/>
          <circle cx="50" cy="8" r="4.5" fill="#2563eb" stroke="#1e40af" strokeWidth="1"/>
          <circle cx="81" cy="8" r="4.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1"/>
        </svg>
      )}

      {texture === 'marble' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M5,5 Q30,35 60,18 T95,38" fill="none" stroke="#b48a4d" strokeWidth="1.8" opacity="0.75"/>
          <path d="M5,5 Q30,35 60,18 T95,38" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5"/>
          <path d="M40,0 Q60,15 75,45" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.6"/>
          <rect x="30" y="15" width="40" height="15" rx="3" fill="none" stroke="#b48a4d" strokeWidth="1" opacity="0.7"/>
        </svg>
      )}

      {texture === 'neon_tube' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <rect x="15" y="8" width="70" height="29" rx="8" fill="rgba(8,51,68,0.7)" stroke="#00f0ff" strokeWidth="3"/>
          <rect x="18" y="11" width="64" height="23" rx="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.85"/>
        </svg>
      )}

      {texture === 'gummy' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <circle cx="42" cy="14" r="5" fill="#ffe4e6" opacity="0.7"/>
          <circle cx="58" cy="14" r="5" fill="#ffe4e6" opacity="0.7"/>
          <ellipse cx="50" cy="22" rx="14" ry="12" fill="#fb7185" stroke="#ffe4e6" strokeWidth="1.5"/>
          <ellipse cx="46" cy="19" rx="2" ry="3" fill="#ffffff" opacity="0.85"/>
        </svg>
      )}

      {texture === 'diamond' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <polygon points="50,4 75,18 50,41 25,18" fill="rgba(255,255,255,0.4)" stroke="#ffffff" strokeWidth="1.5"/>
          <polygon points="50,4 25,18 50,18" fill="rgba(186,230,253,0.5)"/>
          <polygon points="50,4 75,18 50,18" fill="rgba(251,207,232,0.5)"/>
          <polygon points="50,18 25,18 50,41" fill="rgba(254,240,138,0.5)"/>
          <polygon points="50,18 75,18 50,41" fill="rgba(199,210,254,0.5)"/>
        </svg>
      )}

      {texture === 'pcb' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,15 L25,15 L35,28 L70,28 L80,12 L100,12" fill="none" stroke="#00f0ff" strokeWidth="1.5"/>
          <circle cx="25" cy="15" r="2.5" fill="#00f0ff"/>
          <circle cx="70" cy="28" r="2.5" fill="#00f0ff"/>
          <rect x="42" y="10" width="16" height="14" rx="2" fill="#0e7490" stroke="#00f0ff" strokeWidth="1"/>
        </svg>
      )}

      {texture === 'gold' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M0,0 L100,45" stroke="#ffffff" strokeWidth="12" opacity="0.25"/>
          <polygon points="50,6 54,18 66,18 56,26 60,38 50,30 40,38 44,26 34,18 46,18" fill="#fef08a" stroke="#ca8a04" strokeWidth="1"/>
        </svg>
      )}

      {texture === 'mercury' && (
        <svg viewBox="0 0 100 45" className="w-full h-full absolute inset-0">
          <path d="M10,22 Q30,5 50,22 T90,22" fill="none" stroke="#ffffff" strokeWidth="4"/>
          <path d="M10,22 Q30,5 50,22 T90,22" fill="none" stroke="#334155" strokeWidth="1.5"/>
          <circle cx="50" cy="22" r="6" fill="#f8fafc" stroke="#64748b" strokeWidth="1"/>
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

// Interactive 3D Gyro Orbit Trackball
function Trackball3DPad({ rotateX, rotateY, onChange, onReset, appTheme }) {
  const padRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rx: rotateX,
      ry: rotateY
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    // Dragging horizontally changes Yaw (rotateY), dragging vertically changes Pitch (rotateX)
    const newRy = Math.round(Math.max(-85, Math.min(85, dragStartRef.current.ry + dx * 0.75)));
    const newRx = Math.round(Math.max(-85, Math.min(85, dragStartRef.current.rx - dy * 0.75)));
    onChange(newRx, newRy);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Map rotateX [-85, 85] and rotateY [-85, 85] to puck position [-36px, 36px]
  const puckX = Math.round((rotateY / 85) * 36);
  const puckY = Math.round((-rotateX / 85) * 36);

  return (
    <div className={`p-3 rounded-2xl border flex flex-col items-center gap-2 select-none ${
      appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
    }`}>
      <div className="w-full flex items-center justify-between text-[11px]">
        <span className={`font-semibold flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          <Compass className="w-3.5 h-3.5 text-cyan-500" /> 3D Virtual Orbit Pad
        </span>
        <button
          onClick={onReset}
          className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition ${
            appTheme === 'dark'
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
        className={`w-36 h-36 rounded-full relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-shadow ${
          isDragging ? 'ring-2 ring-cyan-400/60 shadow-lg shadow-cyan-500/20' : ''
        } ${
          appTheme === 'dark'
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
            transform: `perspective(200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
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
        <span className="text-cyan-400">Pitch (X): {rotateX > 0 ? `+${rotateX}` : rotateX}&deg;</span>
        <span className="text-blue-400">Yaw (Y): {rotateY > 0 ? `+${rotateY}` : rotateY}&deg;</span>
      </div>
    </div>
  );
}

export default function App() {
  const [elements, setElements] = useState(() => {
    const saved = localStorage.getItem('iconderry_assets') || localStorage.getItem('pixlflow_assets');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (!parsed.some(el => el.id === 'elem-iconderry-official')) {
          return [INITIAL_ELEMENTS[0], ...parsed];
        }
        return parsed;
      } catch (e) { console.error(e); }
    }
    return INITIAL_ELEMENTS.map(el => ({ ...el, downloads: el.downloads || 0 }));
  });

  const [activeTab, setActiveTab] = useState('browse');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Admin form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('UI Icons');
  const [tags, setTags] = useState('');
  const [svgInput, setSvgInput] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // App Theming & Settings Panel
  const [appTheme, setAppTheme] = useState(() => {
    return localStorage.getItem('iconderry_theme') || 'dark';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsToast, setSettingsToast] = useState('');

  // Sync theme changes to html class & localStorage
  useEffect(() => {
    localStorage.setItem('iconderry_theme', appTheme);
    if (appTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [appTheme]);

  // Export controls
  const [exportFormat, setExportFormat] = useState(() => localStorage.getItem('iconderry_default_format') || 'png');
  const [exportSize, setExportSize] = useState(() => Number(localStorage.getItem('iconderry_default_size')) || 1024);
  const [isTransparent, setIsTransparent] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewBg, setPreviewBg] = useState(() => localStorage.getItem('iconderry_default_bg') || 'dark');
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasWorkspaceRef = useRef(null);

  // Studio Resizable Right Sidebar Width (VS Code style)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iconderry_studio_sidebar_width');
      if (saved) {
        const num = Number(saved);
        if (!isNaN(num) && num >= 320 && num <= 900) return num;
      }
    }
    return 480;
  });
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isDesktopScreen, setIsDesktopScreen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopScreen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartResizeSidebar = (e) => {
    e.preventDefault();
    setIsResizingSidebar(true);

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onPointerMove = (moveEvt) => {
      const zoom = window.innerWidth >= 1024 ? 1.1 : 1;
      const deltaX = (startX - moveEvt.clientX) / zoom;
      const newWidth = Math.round(startWidth + deltaX);

      const maxAllowed = Math.max(480, Math.floor((window.innerWidth / zoom) - 340));
      const clamped = Math.min(Math.max(340, newWidth), maxAllowed);
      setSidebarWidth(clamped);
    };

    const onPointerUp = () => {
      setIsResizingSidebar(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setSidebarWidth((finalWidth) => {
        try {
          localStorage.setItem('iconderry_studio_sidebar_width', String(finalWidth));
        } catch {}
        return finalWidth;
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Wheel listener for Ctrl + Scroll (or Trackpad pinch zoom)
  useEffect(() => {
    const el = canvasWorkspaceRef.current;
    if (!el || !selectedAsset) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.12 : -0.12;
        setZoomLevel((prev) => Math.min(5, Math.max(0.2, Number((prev + delta).toFixed(2)))));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [selectedAsset]);

  // Live adjustments state
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);
  const [activeStyleMode, setActiveStyleMode] = useState('original');
  const [effectCategory, setEffectCategory] = useState('All');
  const [effectSearchTerm, setEffectSearchTerm] = useState('');
  const [effectVersionFilter, setEffectVersionFilter] = useState('all'); // 'all' | 'new' | 'old'
  const [studioTab, setStudioTab] = useState('colors'); // 'colors' | 'filters' | 'effects' | 'dimensions' | 'transform' | 'export'
  const [transformSubTab, setTransformSubTab] = useState('3d'); // '3d' | '2d' | 'skew'
  const [effectSubTab, setEffectSubTab] = useState('effects'); // 'effects' | 'adjustment'
  const [filterSubView, setFilterSubView] = useState('presets'); // 'presets' | 'materials' | 'sliders'
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [filterVersionFilter, setFilterVersionFilter] = useState('all'); // 'all' | 'new' | 'old'
  const [activeFilterPreset, setActiveFilterPreset] = useState('original');
  const [activeSelectedColor, setActiveSelectedColor] = useState(null);
  const [isSelectionOutlineVisible, setIsSelectionOutlineVisible] = useState(true);
  const [isLayersListExpanded, setIsLayersListExpanded] = useState(false);
  const canvasSvgContainerRef = useRef(null);

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

      // Filter by category: only match if 'All' or matches mode category
      if (effectCategory !== 'All' && mode.category !== effectCategory) return false;

      const q = effectSearchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        mode.name.toLowerCase().includes(q) || 
        (mode.desc && mode.desc.toLowerCase().includes(q)) || 
        (mode.badge && mode.badge.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [effectCategory, effectSearchTerm, effectVersionFilter]);

  // Icon Dimensions & Aspect Ratio Controls
  const [iconWidth, setIconWidth] = useState(384);
  const [iconHeight, setIconHeight] = useState(384);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);

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

  // Favorites & Recents Persistent State
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('iconderry_favorites')) || [];
    } catch {
      return [];
    }
  });

  const [recentIds, setRecentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('iconderry_recents')) || [];
    } catch {
      return [];
    }
  });

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

  // Compute live SVG markup with all active color replacements, material style transformations, and uniquely scoped IDs
  const currentPreviewSvg = useMemo(() => {
    if (!selectedAsset) return '';
    let colorReplaced = replaceSvgColors(selectedAsset.svgCode, adjustments.colorReplacements);

    // Apply real visual material/style transformations (1: Silhouette, 2: Glassmorphism, 3: Neon Blue, 4: 3D Inflated, 5: Line Art, 6: Vibrant Mesh, etc.)
    if (activeStyleMode && activeStyleMode !== 'original') {
      colorReplaced = transformSvgStyle(colorReplaced, activeStyleMode);
    }

    // Apply vector stroke thickness (works universally for stroke & filled icons)
    if (strokeMultiplier && strokeMultiplier !== 1) {
      colorReplaced = applyUniversalStroke(colorReplaced, strokeMultiplier, strokeColorMode, customStrokeColor);
    }

    // Ensure viewBox exists for responsive freeform scaling/stretching
    if (!colorReplaced.includes('viewBox=') && !colorReplaced.includes('viewbox=')) {
      const wMatch = colorReplaced.match(/width="([0-9.]+)(?:px)?"/i);
      const hMatch = colorReplaced.match(/height="([0-9.]+)(?:px)?"/i);
      if (wMatch && hMatch) {
        const w = wMatch[1];
        const h = hMatch[1];
        colorReplaced = colorReplaced.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
      }
    }

    // Force preserveAspectRatio="none" so height and width stretch independently
    if (colorReplaced.includes('preserveAspectRatio=')) {
      colorReplaced = colorReplaced.replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="none"');
    } else {
      colorReplaced = colorReplaced.replace('<svg', '<svg preserveAspectRatio="none"');
    }

    return scopeSvgIds(colorReplaced, 'pf_studio_');
  }, [selectedAsset, adjustments.colorReplacements, activeStyleMode, strokeMultiplier, strokeColorMode, customStrokeColor]);

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

  // Solid Selection Outline effect on Canvas SVG elements
  // When editing starts, isSelectionOutlineVisible is set to false so user sees the clean, unoutlined icon.
  // When the user taps the canvas icon again, isSelectionOutlineVisible is restored to true.
  useEffect(() => {
    if (!canvasSvgContainerRef.current) return;
    const container = canvasSvgContainerRef.current;
    container.querySelectorAll('.svg-element-selected').forEach(el => el.classList.remove('svg-element-selected'));

    if (activeSelectedColor && isSelectionOutlineVisible) {
      const allEls = container.querySelectorAll('*');
      allEls.forEach(el => {
        if (isElementMatchingColor(el, activeSelectedColor)) {
          el.classList.add('svg-element-selected');
        }
      });
    }
  }, [activeSelectedColor, currentPreviewSvg, isSelectionOutlineVisible]);

  const handleColorChange = (originalColor, newColor) => {
    // Hide selection outline while editing so user can see clean preview of the element
    setIsSelectionOutlineVisible(false);
    const origKey = originalColor.toLowerCase();
    const newNorm = normalizeColor(newColor) || newColor;
    const linkedStops = selectedAsset ? getLinkedGradientColors(selectedAsset.svgCode, origKey) : [];

    setAdjustments(prev => {
      const updated = { ...prev.colorReplacements, [origKey]: newNorm };

      // If this color is part of a gradient with multiple stops, auto-sync the other stops harmoniously
      if (linkedStops.length > 1) {
        linkedStops.forEach((stopColor) => {
          if (stopColor !== origKey) {
            const shade = stopColor === linkedStops[1] ? adjustColorBrightness(newNorm, -20) : newNorm;
            updated[stopColor] = shade;
          }
        });
      }

      return {
        ...prev,
        colorReplacements: updated
      };
    });
  };

  const handleResetSingleColor = (originalColor) => {
    setIsSelectionOutlineVisible(false);
    const origKey = originalColor.toLowerCase();
    const linkedStops = selectedAsset ? getLinkedGradientColors(selectedAsset.svgCode, origKey) : [];

    setAdjustments(prev => {
      const updated = { ...prev.colorReplacements };
      delete updated[origKey];
      linkedStops.forEach(s => delete updated[s]);
      return {
        ...prev,
        colorReplacements: updated
      };
    });
  };

  // Reset Everything back to original upload state
  const handleResetAll = () => {
    recordUndo();
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setActiveStyleMode('original');
    setIconWidth(384);
    setIconHeight(384);
    setLockAspectRatio(true);
    setAspectRatio(1);
    setStrokeMultiplier(1);
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setBgShapePadding(20);
    setBgShapeBorder(0);
    setBgShapeBorderColor('#38bdf8');
    setActiveSelectedColor(null);
    setIsLayersListExpanded(false);
    setEffectCategory('All');
    setZoomLevel(1);
    setExportFormat('png');
    setExportSize(1024);
    setIsTransparent(true);
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
    setActiveStyleMode('original');
    setActiveFilterPreset('original');
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
  };

  // Panel 3: Dimensions Reset
  const handleResetDimensionsPanel = () => {
    recordUndo();
    setIconWidth(384);
    setIconHeight(384);
    setLockAspectRatio(true);
    setAspectRatio(1);
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
      rotation: 0,
      flipH: false,
      flipV: false,
      rotateX: 0,
      rotateY: 0,
      perspective: 800,
      skewX: 0,
      skewY: 0,
      depth3D: 0,
      is3DFloating: false,
      animPreset: 'float',
      animSpeed: 2.2,
      animHeight: 16,
      animShadowSync: true
    }));
  };

  // Panel 5: Export Reset
  const handleResetExportPanel = () => {
    setExportFormat('png');
    setExportSize(1024);
    setIsTransparent(true);
  };

  // Helper to snapshot current Studio state for Undo / Redo
  const getStudioSnapshot = () => ({
    adjustments: { ...adjustments },
    activeStyleMode,
    iconWidth,
    iconHeight,
    strokeMultiplier,
    bgShape,
    bgShapeColor,
    bgShapePadding,
    bgShapeBorder,
    bgShapeBorderColor
  });

  const recordUndo = () => {
    setIsSelectionOutlineVisible(false);
    const snap = getStudioSnapshot();
    setUndoStack(prev => [...prev.slice(-30), snap]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const currentSnap = getStudioSnapshot();
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentSnap]);

    setAdjustments(previous.adjustments);
    setActiveStyleMode(previous.activeStyleMode);
    setIconWidth(previous.iconWidth);
    setIconHeight(previous.iconHeight);
    setStrokeMultiplier(previous.strokeMultiplier);
    setBgShape(previous.bgShape);
    setBgShapeColor(previous.bgShapeColor);
    setBgShapePadding(previous.bgShapePadding);
    setBgShapeBorder(previous.bgShapeBorder);
    setBgShapeBorderColor(previous.bgShapeBorderColor);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const currentSnap = getStudioSnapshot();
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, currentSnap]);

    setAdjustments(next.adjustments);
    setActiveStyleMode(next.activeStyleMode);
    setIconWidth(next.iconWidth);
    setIconHeight(next.iconHeight);
    setStrokeMultiplier(next.strokeMultiplier);
    setBgShape(next.bgShape);
    setBgShapeColor(next.bgShapeColor);
    setBgShapePadding(next.bgShapePadding);
    setBgShapeBorder(next.bgShapeBorder);
    setBgShapeBorderColor(next.bgShapeBorderColor);
  };

  // Favorites handler
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('iconderry_favorites', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Clear recents handler
  const handleClearRecents = () => {
    setRecentIds([]);
    try {
      localStorage.removeItem('iconderry_recents');
    } catch (e) {}
  };

  // Direct Click/Touch on Image SVG elements
  const handleCanvasElementClick = (e) => {
    let target = e.target;
    if (!target || !(target instanceof SVGElement) || target.tagName.toLowerCase() === 'svg') {
      return;
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

    // Check computed style fallback
    if (foundRawColors.length === 0 && typeof window !== 'undefined') {
      try {
        const comp = window.getComputedStyle(target);
        if (comp.fill && comp.fill !== 'none' && !comp.fill.startsWith('url(')) {
          foundRawColors.push(comp.fill);
        } else if (comp.stroke && comp.stroke !== 'none') {
          foundRawColors.push(comp.stroke);
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
        setIsSelectionOutlineVisible(true);
        setStudioTab('colors');
        return;
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('iconderry_assets', JSON.stringify(elements));
  }, [elements]);

  const categories = ['All', 'Favorites', ...new Set(elements.map(item => item.category))];

  const filteredElements = elements.filter(el => {
    const matchesSearch = el.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          el.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All'
      ? true
      : selectedCategory === 'Favorites'
        ? favorites.includes(el.id)
        : el.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentElements = useMemo(() => {
    return recentIds
      .map(id => elements.find(el => el.id === id))
      .filter(Boolean);
  }, [recentIds, elements]);

  const handleOpenAsset = (item) => {
    setSelectedAsset(item);
    setActiveStyleMode('original');
    setAdjustments({
      ...DEFAULT_ADJUSTMENTS,
      colorReplacements: {}
    });
    setIconWidth(384);
    setIconHeight(384);
    setLockAspectRatio(true);
    setAspectRatio(1);
    setStrokeMultiplier(1);
    setBgShape('none');
    setBgShapeColor('#1e293b');
    setBgShapePadding(20);
    setBgShapeBorder(0);
    setBgShapeBorderColor('#38bdf8');
    setActiveSelectedColor(null);
    setIsLayersListExpanded(false);
    setStudioTab('colors');
    setZoomLevel(1);
    setUndoStack([]);
    setRedoStack([]);

    // Record to recents
    setRecentIds(prev => {
      const next = [item.id, ...prev.filter(id => id !== item.id)].slice(0, 8);
      try {
        localStorage.setItem('iconderry_recents', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Keyboard shortcut listener for Ctrl+Z (Undo) and Ctrl+Y / Ctrl+Shift+Z (Redo)
  useEffect(() => {
    if (!selectedAsset) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.ctrlKey || e.metaKey) && 
        (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAsset, undoStack, redoStack, adjustments, activeStyleMode, iconWidth, iconHeight, strokeMultiplier, bgShape, bgShapeColor, bgShapePadding, bgShapeBorder, bgShapeBorderColor]);

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

  const handleFileProcess = (file) => {
    if (!file || !file.name.endsWith('.svg')) {
      alert('Kripya valid .svg file upload karein');
      return;
    }
    const derivedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setTitle(derivedTitle.charAt(0).toUpperCase() + derivedTitle.slice(1));

    const reader = new FileReader();
    reader.onload = (e) => {
      setSvgInput(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Load & sync icons from Supabase if configured
  useEffect(() => {
    if (!supabase) return;
    async function fetchSupabaseIcons() {
      try {
        const { data, error } = await supabase.from('icons').select('*').order('created_at', { ascending: false });
        if (data && data.length > 0 && !error) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            tags: item.tags || '',
            svgCode: item.svg_code,
            downloads: item.downloads || 0
          }));
          setElements(mapped);
          localStorage.setItem('iconderry_assets', JSON.stringify(mapped));
        }
      } catch (err) {
        console.log('Supabase sync notice:', err);
      }
    }
    fetchSupabaseIcons();
  }, []);

  const handlePublishSvg = async (e) => {
    e.preventDefault();
    if (!title.trim() || !svgInput.trim()) return;

    const newElement = {
      id: 'elem-' + Date.now(),
      title: title.trim(),
      category: category.trim() || 'General',
      tags: tags.trim(),
      svgCode: svgInput.trim(),
      downloads: 0
    };

    setElements(prev => [newElement, ...prev]);

    // Save to Supabase DB if client is active
    if (supabase) {
      try {
        await supabase.from('icons').insert([{
          id: newElement.id,
          title: newElement.title,
          category: newElement.category,
          tags: newElement.tags,
          svg_code: newElement.svgCode,
          downloads: 0
        }]);
      } catch (err) {
        console.log('Supabase insert notice:', err);
      }
    }

    setTitle('');
    setSvgInput('');
    setTags('');
    setFormSuccess('Asset Iconderry gallery me publish ho gaya!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Kya aap is element ko delete karna chahte hain?')) {
      setElements(elements.filter(el => el.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
      if (supabase) {
        try {
          await supabase.from('icons').delete().eq('id', id);
        } catch (err) {
          console.log('Supabase delete notice:', err);
        }
      }
    }
  };

  const handleDownload = async () => {
    if (!selectedAsset) return;
    setDownloading(true);
    try {
      // Calculate true export resolution respecting custom aspect ratio
      let finalWidth = exportSize;
      let finalHeight = exportSize;
      if (iconWidth && iconHeight && iconWidth > 0 && iconHeight > 0) {
        if (iconWidth >= iconHeight) {
          finalWidth = exportSize;
          finalHeight = Math.round(exportSize * (iconHeight / iconWidth));
        } else {
          finalHeight = exportSize;
          finalWidth = Math.round(exportSize * (iconWidth / iconHeight));
        }
      }

      await downloadAsset({
        svgCode: selectedAsset.svgCode,
        filename: selectedAsset.title,
        format: exportFormat,
        size: exportSize,
        width: finalWidth,
        height: finalHeight,
        isTransparent,
        adjustments: {
          ...adjustments,
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
      alert('Download error: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportAnimatedGif = async () => {
    if (!selectedAsset || downloading) return;
    setDownloading(true);
    try {
      let finalWidth = 512;
      let finalHeight = 512;
      if (iconWidth && iconHeight) {
        if (iconWidth >= iconHeight) {
          finalWidth = 512;
          finalHeight = Math.round(512 * (iconHeight / iconWidth));
        } else {
          finalHeight = 512;
          finalWidth = Math.round(512 * (iconWidth / iconHeight));
        }
      }

      await downloadAsset({
        svgCode: selectedAsset.svgCode,
        filename: selectedAsset.title,
        format: 'gif',
        size: 512,
        width: finalWidth,
        height: finalHeight,
        isTransparent,
        adjustments: {
          ...adjustments,
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
      alert('GIF export error: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const applyPreset = (preset) => {
    recordUndo();
    setActiveFilterPreset(preset.id || preset.name);
    if (preset.adjustments) {
      setAdjustments(prev => ({
        ...prev,
        ...preset.adjustments
      }));
    } else {
      setAdjustments(prev => ({
        ...prev,
        hue: preset.hue,
        saturation: preset.sat,
        contrast: preset.con,
        sepia: preset.sepia,
        invert: preset.inv
      }));
    }
  };

  const handleSelectStyleLook = (preset) => {
    setActiveStyleMode(preset.id || 'original');
    if (preset.adjustments) {
      setAdjustments(prev => ({
        ...prev,
        ...preset.adjustments,
        colorReplacements: preset.id === 'original' ? {} : prev.colorReplacements
      }));
    }
  };

  const getComputedFilterStyle = () => {
    const rules = [
      `hue-rotate(${adjustments.hue}deg)`,
      `brightness(${adjustments.brightness}%)`,
      `saturate(${adjustments.saturation}%)`,
      `contrast(${adjustments.contrast}%)`,
      `sepia(${adjustments.sepia}%)`,
      `invert(${adjustments.invert}%)`,
      `opacity(${adjustments.opacity}%)`,
      adjustments.blur > 0 ? `blur(${adjustments.blur}px)` : '',
      adjustments.shadowBlur > 0 
        ? `drop-shadow(0px 0px ${adjustments.shadowBlur}px ${adjustments.shadowColor || '#38bdf8'}) drop-shadow(0px 0px ${Math.max(1, Math.round(adjustments.shadowBlur * 0.4))}px ${adjustments.shadowColor || '#38bdf8'})` 
        : ''
    ];

    if ((adjustments.depth3D || 0) > 0) {
      const d = adjustments.depth3D;
      const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
      const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
      const offX = Math.round(-Math.sin(radY) * d * 1.5);
      const offY = Math.round(Math.sin(radX) * d * 1.5 + (d * 0.8));
      const sColor = adjustments.depth3DColor || 'rgba(0,0,0,0.55)';
      rules.push(`drop-shadow(${offX}px ${offY}px ${Math.round(d * 0.6)}px ${sColor}) drop-shadow(${Math.round(offX * 0.5)}px ${Math.round(offY * 0.5)}px ${Math.round(d * 0.3)}px ${sColor})`);
    }

    return rules.filter(Boolean).join(' ');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-blue-500 selection:text-white ${
      appTheme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Bar */}
      <header className={`border-b sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between backdrop-blur transition-colors ${
        appTheme === 'dark' ? 'border-slate-800 bg-[#0d1424]/90' : 'border-slate-200 bg-white/90 shadow-sm'
      }`}>
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
              Iconderry <span className="text-[9px] sm:text-[10px] bg-blue-500/20 text-blue-400 px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-500/30">Pro Studio</span>
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
            className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center justify-center ${
              appTheme === 'dark' 
                ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-white hover:border-slate-700' 
                : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 hover:border-slate-300 shadow-sm'
            }`}
          >
            {appTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Tab Toggle */}
          <div className={`flex gap-1 p-0.5 sm:p-1 rounded-xl border ${
            appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'browse'
                  ? 'bg-blue-600 text-white shadow-md'
                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Upload</span>
            </button>
          </div>

          {/* Settings Panel Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              appTheme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
            title="Open Settings"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'admin' ? (
          /* Admin Upload Panel */
          <div className={`max-w-3xl mx-auto border rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl transition ${
            appTheme === 'dark' ? 'bg-[#131b2e] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
          }`}>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Add New Element</h2>
            <p className={`text-xs sm:text-sm mb-5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Drop `.svg` file or paste XML markup. Users can only download finalized customized images.
            </p>

            {formSuccess && (
              <div className="mb-5 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-2.5 font-medium text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition mb-5 flex flex-col items-center justify-center gap-2 ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : appTheme === 'dark'
                    ? 'border-slate-700 hover:border-slate-600 bg-[#0b0f19]/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".svg"
                onChange={(e) => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                className="hidden"
              />
              <div className={`p-2.5 sm:p-3 rounded-full ${appTheme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-slate-200 text-cyan-600'}`}>
                <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className={`text-xs sm:text-sm font-medium ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                Drag and drop your <span className="text-cyan-500 font-semibold">.svg</span> file here, or browse
              </p>
              <p className={`text-[11px] sm:text-xs ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Auto-populates title and parses code</p>
            </div>

            <form onSubmit={handlePublishSvg} className="space-y-4 sm:space-y-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Element Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Glowing Neon Trophy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-blue-500 transition border ${
                    appTheme === 'dark'
                      ? 'bg-[#0b0f19] border-slate-700 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UI Icons, Badges, Logos"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-blue-500 transition border ${
                      appTheme === 'dark'
                        ? 'bg-[#0b0f19] border-slate-700 text-slate-100 placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tags
                  </label>
                  <input
                    type="text"
                    placeholder="neon, icon, gold, vector"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-blue-500 transition border ${
                      appTheme === 'dark'
                        ? 'bg-[#0b0f19] border-slate-700 text-slate-100 placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Raw SVG Code
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="<svg viewBox='0 0 200 200' ...> ... </svg>"
                  value={svgInput}
                  onChange={(e) => setSvgInput(e.target.value)}
                  className={`w-full font-mono text-xs rounded-xl p-3.5 sm:p-4 focus:outline-none focus:border-blue-500 transition border ${
                    appTheme === 'dark'
                      ? 'bg-[#0b0f19] border-slate-700 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {svgInput.trim() && (
                <div className={`p-3 sm:p-4 rounded-xl border flex items-center gap-4 sm:gap-6 ${
                  appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center p-2 border flex-shrink-0 ${
                    appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-inner'
                  }`}
                       dangerouslySetInnerHTML={{ __html: svgInput }} />
                  <div className="text-xs">
                    <p className={`font-semibold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Live SVG Preview</p>
                    <p className={appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>Make sure SVG me <code>viewBox</code> mojood ho.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 sm:py-3.5 rounded-xl font-medium text-sm transition shadow-lg shadow-blue-600/30"
              >
                Publish to Iconderry
              </button>
            </form>
          </div>
        ) : (
          /* Browse Gallery */
          <div>
            {/* Recently Opened / Edited Icons Strip */}
            {recentElements.length > 0 && (
              <div className={`mb-6 p-3 sm:p-4 rounded-2xl border transition ${
                appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-cyan-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Recently Opened Icons
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      {recentElements.length}
                    </span>
                  </div>
                  <button
                    onClick={handleClearRecents}
                    className="text-[11px] text-slate-500 hover:text-rose-400 transition"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                  {recentElements.map((item) => (
                    <button
                      key={'recent-' + item.id}
                      onClick={() => handleOpenAsset(item)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition hover:scale-105 flex-shrink-0 group ${
                        appTheme === 'dark'
                          ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      <div
                        className="w-5 h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: item.svgCode }}
                      />
                      <span className={`text-xs font-medium truncate max-w-[110px] ${
                        appTheme === 'dark' ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-blue-600'
                      }`}>
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-stretch md:items-center mb-6">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search assets or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full border rounded-xl pl-10 pr-3.5 py-2.5 sm:py-3 text-sm focus:outline-none focus:border-blue-500 transition ${
                    appTheme === 'dark'
                      ? 'bg-[#131b2e] border-slate-800 text-slate-100 placeholder-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none w-full md:w-auto flex-nowrap md:flex-wrap">
                {categories.map((cat) => {
                  const isFavCat = cat === 'Favorites';
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 flex items-center gap-1.5 ${
                        isSelected
                          ? (isFavCat ? 'bg-rose-600 text-white shadow-md' : 'bg-blue-600 text-white shadow-md')
                          : appTheme === 'dark'
                            ? 'bg-[#131b2e] text-slate-400 hover:text-white border border-slate-800'
                            : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                      }`}
                    >
                      {isFavCat ? (
                        <>
                          <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'fill-rose-500 text-rose-500'}`} />
                          <span>Favorites ({favorites.length})</span>
                        </>
                      ) : (
                        <span>{cat}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
              {filteredElements.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenAsset(item)}
                    className={`group border rounded-2xl p-3 sm:p-4 flex flex-col items-center cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 relative ${
                      appTheme === 'dark'
                        ? 'bg-[#131b2e] border-slate-800 hover:border-slate-700/80 shadow-sm hover:shadow-[0_16px_32px_-6px_rgba(255,255,255,0.09),0_6px_16px_-4px_rgba(255,255,255,0.05)]'
                        : 'bg-white border-slate-200 hover:border-slate-300/80 shadow-sm hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.15),0_8px_16px_-4px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {/* Favorite Toggle Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      title={isFav ? "Remove from Favorites" : "Save to Favorites"}
                      className={`absolute top-2.5 left-2.5 p-1.5 rounded-lg transition-all z-10 ${
                        isFav
                          ? 'bg-rose-500/15 text-rose-500 scale-105'
                          : 'opacity-70 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-slate-500/10 text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div
                      className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center p-2 mb-2 sm:mb-3"
                      dangerouslySetInnerHTML={{ __html: item.svgCode }}
                    />
                    <h3 className={`font-medium text-xs sm:text-sm text-center truncate w-full ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.title}
                    </h3>
                    <div className={`flex items-center justify-between w-full mt-1.5 px-1 text-[10px] sm:text-[11px] ${
                      appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      <span>{item.category}</span>
                      <span>{item.downloads || 0} dl</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      title="Delete Element"
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition z-10 ${
                        appTheme === 'dark' ? 'bg-slate-900/80 text-slate-400 hover:text-rose-400' : 'bg-slate-100 text-slate-400 hover:text-rose-500 shadow-sm'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredElements.length === 0 && (
              <div className="text-center py-16 sm:py-20 text-slate-500 text-xs sm:text-sm space-y-2">
                {selectedCategory === 'Favorites' ? (
                  <>
                    <Heart className="w-8 h-8 text-rose-500/40 mx-auto stroke-1" />
                    <p className="font-semibold text-slate-400">Aapka koi favorite icon nahi hai.</p>
                    <p className="text-[11px] text-slate-500">Kisi bhi icon card par ❤️ (Heart) click karke yahan save karein!</p>
                  </>
                ) : (
                  <p>Koi asset nahi mila. Admin Upload par jaakar naya SVG dalein!</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Website Footer */}
      <footer className={`border-t mt-12 py-10 transition-colors ${
        appTheme === 'dark' ? 'bg-[#0a0f1d] border-slate-800/80 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                  <button onClick={() => setActiveLegalModal('license')} className="hover:text-cyan-400 transition">
                    Commercial License
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

          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
            appTheme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
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

      {/* Full-Screen Immersive Studio Workspace */}
      {selectedAsset && (
        <div className={`fixed inset-0 z-50 flex flex-col w-full h-full max-w-full max-h-full overflow-hidden font-sans transition-colors duration-200 ${
          isResizingSidebar ? 'select-none' : ''
        } ${
          appTheme === 'dark' ? 'bg-[#060a12] text-slate-100' : 'bg-slate-100 text-slate-900'
        }`}>
          {/* Top Navigation Bar */}
          <header className={`h-14 sm:h-16 px-3 sm:px-6 border-b flex items-center justify-between z-30 flex-shrink-0 transition-colors ${
            appTheme === 'dark' ? 'bg-[#0d1424] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            {/* Left: Back & Asset Details */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedAsset(null)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  appTheme === 'dark'
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500" />
                <span className="hidden xs:inline">Gallery</span>
              </button>

              <div className={`h-5 w-px ${appTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h2 className={`text-xs sm:text-sm font-bold truncate max-w-[90px] xs:max-w-[140px] sm:max-w-xs ${appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {selectedAsset.title}
                  </h2>
                  <span className="text-[9px] sm:text-[10px] bg-cyan-500/10 text-cyan-500 px-1.5 sm:px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
                    Studio
                  </span>
                </div>
                <span className={`hidden sm:block text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{selectedAsset.category}</span>
              </div>
            </div>



            {/* Right: Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Undo & Redo History Buttons */}
              <div className={`flex items-center gap-0.5 p-0.5 rounded-xl border ${
                appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={handleUndo}
                  disabled={undoStack.length === 0}
                  title="Undo edit (Ctrl + Z)"
                  className={`p-1.5 rounded-lg transition ${
                    undoStack.length === 0 
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
                  className={`p-1.5 rounded-lg transition ${
                    redoStack.length === 0 
                      ? 'opacity-25 cursor-not-allowed text-slate-500' 
                      : appTheme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-white shadow-sm'
                  }`}
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Favorite Toggle inside Studio */}
              <button
                onClick={() => toggleFavorite(selectedAsset.id)}
                title={favorites.includes(selectedAsset.id) ? "Saved to Favorites" : "Save to Favorites"}
                className={`p-1.5 sm:p-2 rounded-xl border transition flex items-center justify-center ${
                  favorites.includes(selectedAsset.id)
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                    : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorites.includes(selectedAsset.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Quick Dark/Light Toggle in Studio Header */}
              <button
                onClick={() => setAppTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                title={appTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-1.5 sm:p-2 rounded-xl border transition flex items-center justify-center ${
                  appTheme === 'dark' 
                    ? 'bg-slate-900 border-slate-800 text-cyan-400 hover:text-white hover:border-slate-700' 
                    : 'bg-slate-100 border-slate-200 text-amber-500 hover:text-amber-600 hover:bg-slate-200'
                }`}
              >
                {appTheme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetAll}
                className={`text-xs flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl border transition ${
                  appTheme === 'dark'
                    ? 'text-slate-300 hover:text-white bg-slate-900/90 border-slate-800 hover:bg-slate-800 hover:border-cyan-500/40'
                    : 'text-slate-700 hover:text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
                title="Reset product 100% to upload state"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
                <span className="hidden sm:inline font-semibold">Reset All</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="bg-emerald-600 hover:bg-emerald-500 px-2.5 sm:px-4 py-1.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 text-white disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? '...' : `Export .${exportFormat.toUpperCase()}`}</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`p-1.5 sm:p-2 rounded-xl border transition ${
                  appTheme === 'dark'
                    ? 'text-slate-400 hover:text-white bg-slate-900/80 border-slate-800 hover:bg-slate-800'
                    : 'text-slate-700 hover:text-slate-900 bg-slate-100 border-slate-200 hover:bg-slate-200'
                }`}
                title="Settings & Themes"
              >
                <Settings className="w-3.5 h-3.5 text-cyan-500" />
              </button>

              <button
                onClick={() => setSelectedAsset(null)}
                className={`p-1.5 rounded-full transition ${
                  appTheme === 'dark'
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
              onClick={() => {
                setActiveSelectedColor(null);
                setIsSelectionOutlineVisible(true);
              }}
              className={`h-[38vh] sm:h-[45vh] lg:h-full lg:flex-1 min-w-0 relative flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden transition-colors border-b lg:border-b-0 ${
                appTheme === 'dark' ? 'bg-[#060a12]' : 'bg-slate-100/90'
              }`}
            >
              {/* Floating Canvas Controls & Direct Selection Indicator */}
              <div className="absolute top-2 inset-x-2 sm:top-4 sm:inset-x-6 flex items-center justify-between z-10 pointer-events-none gap-2">
                {activeSelectedColor ? (
                  <div className={`pointer-events-auto backdrop-blur-md border px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 shadow-xl animate-in fade-in duration-150 ${
                    appTheme === 'dark'
                      ? 'bg-slate-900/95 border-cyan-500/60 text-slate-200'
                      : 'bg-white/95 border-cyan-500/60 text-slate-800'
                  }`}>
                    <span
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-slate-400 shadow ring-2 ring-cyan-400/40"
                      style={{
                        backgroundColor:
                          adjustments.colorReplacements[activeSelectedColor.toLowerCase()] ||
                          activeSelectedColor
                      }}
                    />
                    <span>Selected: <strong className="font-mono text-cyan-500 uppercase">{adjustments.colorReplacements[activeSelectedColor.toLowerCase()] || activeSelectedColor}</strong></span>
                    {!isSelectionOutlineVisible && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Clean View</span>
                    )}
                    <span className={`hidden xs:inline text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>&bull; Tap canvas to deselect</span>
                  </div>
                ) : (
                  <div className={`pointer-events-auto backdrop-blur-md border px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-1.5 shadow-lg ${
                    appTheme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 text-cyan-400'
                      : 'bg-white/90 border-slate-200 text-cyan-600 font-medium'
                  }`}>
                    <Sparkles className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                    <span><strong>Touch/Click</strong> icon to change colors</span>
                  </div>
                )}

                {/* Zoom Controls Pill */}
                <div className={`pointer-events-auto flex items-center border p-0.5 sm:p-1 rounded-xl gap-0.5 sm:gap-1 shadow-lg backdrop-blur-md ${
                  appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
                }`}>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(0.2, Number((prev - 0.15).toFixed(2))))}
                    className={`p-1 sm:p-1.5 rounded-lg transition ${
                      appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-mono font-bold rounded-md transition ${
                      appTheme === 'dark' ? 'hover:bg-slate-800 text-cyan-400' : 'hover:bg-slate-100 text-cyan-600'
                    }`}
                    title="Click to Reset Zoom (100%)"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(5, Number((prev + 0.15).toFixed(2))))}
                    className={`p-1 sm:p-1.5 rounded-lg transition ${
                      appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>



              {/* Floating SVG Icon or Background Badge Shape with Interactive Selection, Custom Dimensions & Smooth Zoom */}
              <div 
                className={
                  adjustments.is3DFloating
                    ? adjustments.animPreset === 'spin360'
                      ? 'animate-spin-3d'
                      : adjustments.animPreset === 'pulse'
                      ? 'animate-pulse-3d'
                      : adjustments.animPreset === 'wobble'
                      ? 'animate-wobble-3d'
                      : adjustments.animPreset === 'wave'
                      ? 'animate-wave-3d'
                      : 'animate-floating-3d'
                    : ''
                }
                style={{
                  '--anim-speed': `${adjustments.animSpeed || 2.2}s`,
                  '--anim-amp': `${adjustments.animHeight || 16}px`
                }}
              >
                <div
                  ref={canvasSvgContainerRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCanvasElementClick(e);
                  }}
                  style={{
                    width: `${iconWidth}px`,
                    height: `${iconHeight}px`,
                    transform: `scale(${zoomLevel}) perspective(${adjustments.perspective || 800}px) rotateX(${adjustments.rotateX || 0}deg) rotateY(${adjustments.rotateY || 0}deg) rotate(${adjustments.rotation || 0}deg) skew(${adjustments.skewX || 0}deg, ${adjustments.skewY || 0}deg) scale(${adjustments.flipH ? -1 : 1}, ${adjustments.flipV ? -1 : 1})`,
                    transformOrigin: 'center center',
                    transformStyle: 'preserve-3d',
                    filter: getComputedFilterStyle(),
                    transition: 'transform 0.08s ease-out, width 0.1s ease, height 0.1s ease',
                    backgroundColor: bgShape !== 'none' ? bgShapeColor : 'transparent',
                    padding: bgShape !== 'none' ? `${bgShapePadding * 0.7}%` : '0px',
                    borderRadius: bgShape === 'circle' ? '9999px' : bgShape === 'squircle' ? '28%' : bgShape === 'rounded-square' ? '1.5rem' : '0px',
                    clipPath: bgShape === 'hexagon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none',
                    border: bgShape !== 'none' && bgShapeBorder > 0 ? `${bgShapeBorder}px solid ${bgShapeBorderColor}` : 'none'
                  }}
                  className={`flex items-center justify-center interactive-svg-canvas cursor-pointer select-none [&>svg]:w-full [&>svg]:h-full [&>svg]:block ${
                    bgShape !== 'none' ? 'shadow-2xl' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: currentPreviewSvg }}
                />
              </div>

              {/* Bottom Floating Bar on Canvas */}
              <div className="absolute bottom-2 inset-x-2 sm:bottom-4 sm:inset-x-6 flex items-center justify-between pointer-events-none gap-2">
                {/* Element colors quick strip */}
                {detectedColors.length > 0 && (
                  <div className={`pointer-events-auto p-1.5 sm:p-2.5 px-2.5 sm:px-4 backdrop-blur-md border rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 shadow-xl ${
                    appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
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
                            onClick={() => {
                              setActiveSelectedColor(c.color);
                              setStudioTab('colors');
                              const el = document.getElementById(`color-card-${c.color.replace('#', '').toLowerCase()}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }}
                            title={`Original: ${c.color} | Current: ${activeColor}${isChanged ? ' (Modified)' : ''}`}
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform hover:scale-125 relative ${
                              isSelected
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

                {/* Resolution & Dimensions Indicator Pill */}
                <div className={`pointer-events-auto hidden sm:flex items-center gap-2 p-2 sm:p-2.5 px-3 sm:px-4 backdrop-blur-md border rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] shadow-xl ml-auto ${
                  appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-600'
                }`}>
                  <span>Export: <strong className={`font-mono text-cyan-500 font-bold`}>{exportSize >= 1024 ? `${exportSize / 1024}K Ultra HD` : `${exportSize}px`}</strong></span>
                  <span>&bull;</span>
                  <span>Format: <strong className={`font-mono uppercase font-bold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>.{exportFormat}</strong></span>
                </div>
              </div>
            </div>

            {/* Draggable Sidebar Resizer Handle (VS Code style - Desktop only) */}
            <div
              onPointerDown={handleStartResizeSidebar}
              onDoubleClick={() => {
                setSidebarWidth(480);
                try { localStorage.setItem('iconderry_studio_sidebar_width', '480'); } catch {}
              }}
              className={`hidden lg:flex items-center justify-center relative select-none cursor-col-resize z-30 transition-all duration-150 group flex-shrink-0 border-l ${
                isResizingSidebar
                  ? 'w-2 bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                  : appTheme === 'dark'
                  ? 'w-2 bg-[#0b0f19] border-slate-800 hover:bg-cyan-500/20 hover:border-cyan-500/60'
                  : 'w-2 bg-slate-100 border-slate-200 hover:bg-cyan-500/20 hover:border-cyan-500/60'
              }`}
              title="Drag left/right to resize panel width • Double-click to reset (480px)"
            >
              {/* Center visual grip pill */}
              <div
                className={`w-1 rounded-full transition-all duration-150 ${
                  isResizingSidebar
                    ? 'h-16 bg-white shadow-md'
                    : appTheme === 'dark'
                    ? 'h-8 bg-slate-600 group-hover:h-12 group-hover:bg-cyan-400'
                    : 'h-8 bg-slate-400 group-hover:h-12 group-hover:bg-cyan-500'
                }`}
              />
            </div>

            {/* Invisible overlay while resizing to prevent mouse event loss */}
            {isResizingSidebar && (
              <div
                onPointerDown={(e) => e.preventDefault()}
                className="fixed inset-0 z-50 cursor-col-resize select-none"
              />
            )}

            {/* Right: Studio Tools & Control Sidebar */}
            <div
              style={isDesktopScreen ? { width: `${sidebarWidth}px`, maxWidth: 'calc(100% - 320px)', minWidth: '340px' } : undefined}
              className={`flex-1 lg:flex-none lg:h-full w-full border-t lg:border-t-0 flex flex-col flex-shrink-0 shadow-2xl z-20 overflow-hidden transition-[background-color,border-color] duration-200 ${
                appTheme === 'dark' ? 'bg-[#0d1424] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Studio Segmented Navigation Tabs */}
              <div className={`p-2 sm:p-4 border-b flex-shrink-0 ${
                appTheme === 'dark' ? 'border-slate-800 bg-[#0b0f19]' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className={`grid grid-cols-6 gap-1 p-0.5 sm:p-1 rounded-xl border ${
                  appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/70 border-slate-300/60'
                }`}>
                  <button
                    onClick={() => setStudioTab('colors')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'colors' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">Colors</span>
                  </button>

                  <button
                    onClick={() => setStudioTab('filters')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'filters' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">Filters</span>
                  </button>

                  <button
                    onClick={() => setStudioTab('effects')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'effects' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">Effects</span>
                  </button>

                  <button
                    onClick={() => setStudioTab('dimensions')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'dimensions' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">Size</span>
                  </button>

                  <button
                    onClick={() => setStudioTab('transform')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'transform' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Move3d className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">3D Rotate</span>
                  </button>

                  <button
                    onClick={() => setStudioTab('export')}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 sm:py-2 px-0.5 sm:px-1 rounded-lg text-xs font-semibold transition ${
                      studioTab === 'export' 
                        ? 'bg-blue-600 text-white shadow' 
                        : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[10px] sm:text-[11px]">Export</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Tools Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 sm:space-y-5 overscroll-contain smooth-scroll">
                {/* TAB 1: ELEMENT COLORS PALETTE */}
                {studioTab === 'colors' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Paintbrush className="w-3.5 h-3.5 text-cyan-500" /> Vector Color Studio
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Image par kisi bhi element ko touch karein ya dropdown se layer select karein
                        </p>
                      </div>

                      <button
                        onClick={handleResetColorsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                          appTheme === 'dark'
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
                    {activeSelectedColor ? (
                      <div className={`p-4 rounded-2xl border-2 shadow-xl space-y-3 animate-in fade-in duration-200 ${
                        appTheme === 'dark' 
                          ? 'bg-slate-900 border-cyan-400/80 shadow-cyan-500/10' 
                          : 'bg-slate-50 border-cyan-500 shadow-cyan-500/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isSelectionOutlineVisible ? 'bg-cyan-500 animate-pulse' : 'bg-emerald-400'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">
                              Active Selected Element
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Outline Toggle / Clean Preview Mode Indicator */}
                            <button
                              onClick={() => setIsSelectionOutlineVisible(!isSelectionOutlineVisible)}
                              className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition border font-semibold ${
                                isSelectionOutlineVisible
                                  ? (appTheme === 'dark' ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-400 hover:bg-cyan-900/40' : 'bg-cyan-50 border-cyan-300 text-cyan-700 hover:bg-cyan-100')
                                  : (appTheme === 'dark' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40' : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100')
                              }`}
                              title={isSelectionOutlineVisible ? 'Click to hide selection outline for clean viewing' : 'Click to show selection outline'}
                            >
                              {isSelectionOutlineVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              <span>{isSelectionOutlineVisible ? 'Outline: On' : 'Clean Preview'}</span>
                            </button>

                            {adjustments.colorReplacements[activeSelectedColor.toLowerCase()] && (
                              <button
                                onClick={() => handleResetSingleColor(activeSelectedColor)}
                                className={`text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-xl transition border ${
                                  appTheme === 'dark'
                                    ? 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'
                                    : 'text-slate-600 hover:text-slate-900 bg-white border-slate-300'
                                }`}
                              >
                                <Undo2 className="w-3 h-3" /> Reset Layer
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Clean Preview status notice when editing */}
                        {!isSelectionOutlineVisible && (
                          <div className={`px-2.5 py-1.5 rounded-xl text-[10px] flex items-center justify-between border ${
                            appTheme === 'dark' 
                              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40' 
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Clean Preview Mode: Editing without outline border.
                            </span>
                            <span className="opacity-80 font-medium">Click icon on canvas to re-show outline</span>
                          </div>
                        )}

                        {/* Color Preview, Picker & Hex */}
                        <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
                          appTheme === 'dark' ? 'bg-[#0b0f19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-xl border-2 border-slate-400 shadow-inner flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor:
                                  adjustments.colorReplacements[activeSelectedColor.toLowerCase()] ||
                                  activeSelectedColor
                              }}
                            />
                            <div>
                              <span className={`font-mono text-sm font-bold uppercase ${
                                appTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                              }`}>
                                {adjustments.colorReplacements[activeSelectedColor.toLowerCase()] ||
                                  activeSelectedColor}
                              </span>
                              <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Original: <span className="font-mono uppercase">{activeSelectedColor}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
                              <input
                                type="color"
                                value={
                                  adjustments.colorReplacements[activeSelectedColor.toLowerCase()] ||
                                  activeSelectedColor
                                }
                                onFocus={() => setIsSelectionOutlineVisible(false)}
                                onInput={() => setIsSelectionOutlineVisible(false)}
                                onChange={(e) => handleColorChange(activeSelectedColor, e.target.value)}
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
                              value={(adjustments.colorReplacements[activeSelectedColor.toLowerCase()] || activeSelectedColor).toUpperCase()}
                              onFocus={() => setIsSelectionOutlineVisible(false)}
                              onChange={(e) => {
                                setIsSelectionOutlineVisible(false);
                                let val = e.target.value;
                                if (!val.startsWith('#')) val = '#' + val;
                                handleColorChange(activeSelectedColor, val);
                              }}
                              className={`w-20 px-2 py-2 rounded-xl text-xs font-mono text-center uppercase focus:outline-none focus:border-cyan-500 border ${
                                appTheme === 'dark'
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
                                onClick={() => {
                                  setIsSelectionOutlineVisible(false);
                                  handleColorChange(activeSelectedColor, swatch.hex);
                                }}
                                title={`${swatch.name} (${swatch.hex})`}
                                className={`w-6 h-6 rounded-full border transition-all hover:scale-125 flex-shrink-0 ${
                                  (adjustments.colorReplacements[activeSelectedColor.toLowerCase()] || activeSelectedColor).toLowerCase() === swatch.hex.toLowerCase()
                                    ? 'border-white scale-110 shadow-lg ring-2 ring-cyan-400'
                                    : appTheme === 'dark' ? 'border-slate-800 hover:border-slate-500' : 'border-slate-300 hover:border-slate-500'
                                }`}
                                style={{ backgroundColor: swatch.hex }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`p-5 rounded-2xl border border-dashed text-center text-xs space-y-1 ${
                        appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-300 text-slate-600'
                      }`}>
                        <Sparkles className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                        <p className={`font-semibold ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>Touch Element on Image</p>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Image ke kisi bhi part ko click karein uska color yahan edit karne ke liye.
                        </p>
                      </div>
                    )}

                    {/* Collapsible Dropdown for All Vector Layers & Colors */}
                    {detectedColors.length > 0 && (
                      <div className={`rounded-2xl border overflow-hidden shadow-md ${
                        appTheme === 'dark' ? 'border-slate-800 bg-[#131b2e]/50' : 'border-slate-200 bg-slate-50'
                      }`}>
                        <button
                          onClick={() => setIsLayersListExpanded(!isLayersListExpanded)}
                          className={`w-full p-3.5 flex items-center justify-between text-left transition text-xs font-semibold ${
                            appTheme === 'dark' ? 'hover:bg-slate-900/60 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-cyan-500" />
                            <span>All Vector Layers & Colors</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              appTheme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
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

                        {/* Collapsible List Container */}
                        {isLayersListExpanded && (
                          <div className={`p-3.5 pt-2 space-y-3 border-t ${
                            appTheme === 'dark' ? 'border-slate-800/60' : 'border-slate-200'
                          }`}>
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
                                    setIsSelectionOutlineVisible(true);
                                  }}
                                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                                    isSelected
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
                                          <span className={`font-mono text-xs font-bold uppercase ${
                                            appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'
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
                                          onFocus={() => setIsSelectionOutlineVisible(false)}
                                          onInput={() => setIsSelectionOutlineVisible(false)}
                                          onChange={(e) => handleColorChange(origColor, e.target.value)}
                                          className="sr-only"
                                        />
                                        <div className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition ${
                                          appTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}>
                                          Pick
                                        </div>
                                      </label>
                                      {isModified && (
                                        <button
                                          onClick={() => handleResetSingleColor(origColor)}
                                          title="Reset layer"
                                          className={`p-1 rounded-lg ${
                                            appTheme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                                          }`}
                                        >
                                          <Undo2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Quick dots */}
                                  <div className={`flex items-center gap-1 pt-1.5 border-t overflow-x-auto no-scrollbar ${
                                    appTheme === 'dark' ? 'border-slate-800/40' : 'border-slate-100'
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
                        )}
                      </div>
                    )}

                    {/* Global Monotone Recolor Override */}
                    <div className={`mt-4 p-3.5 rounded-2xl border ${
                      appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
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
                              className={`text-[10px] px-2 py-1 rounded ${
                                appTheme === 'dark' ? 'text-slate-400 hover:text-white bg-slate-800' : 'text-slate-600 hover:text-slate-900 bg-slate-200'
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

                {/* TAB 2: FILTERS (25+ VISUAL COLOR PRESETS) */}
                {studioTab === 'filters' && (
                  <div className="space-y-3.5">
                    {/* Header & Reset Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Wand2 className="w-3.5 h-3.5 text-cyan-500" /> {EFFECT_PRESETS.length}+ Visual Color Filters
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Click any card to apply instant gradient tone &amp; aura glow
                        </p>
                      </div>

                      <button
                        onClick={handleResetEffectsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                          appTheme === 'dark'
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
                    <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                      appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <button
                        onClick={() => setFilterVersionFilter('all')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                          filterVersionFilter === 'all'
                            ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                            : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        <span>All ({EFFECT_PRESETS.length})</span>
                      </button>

                      <button
                        onClick={() => setFilterVersionFilter('new')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                          filterVersionFilter === 'new'
                            ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-md font-bold'
                            : (appTheme === 'dark' ? 'text-amber-300 hover:text-white' : 'text-amber-700 hover:text-slate-900')
                        }`}
                      >
                        <span>✨ New ({EFFECT_PRESETS.filter(p => p.isNew).length})</span>
                      </button>

                      <button
                        onClick={() => setFilterVersionFilter('old')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                          filterVersionFilter === 'old'
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
                        className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 transition ${
                          appTheme === 'dark'
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
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition whitespace-nowrap ${
                              isCatActive
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
                            className={`p-2.5 rounded-2xl border text-left transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group ${
                              isCurrentActive
                                ? (appTheme === 'dark'
                                    ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_18px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400'
                                    : 'border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-600')
                                : (appTheme === 'dark'
                                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900 shadow-sm hover:shadow-[0_12px_24px_-4px_rgba(255,255,255,0.07)]'
                                    : 'bg-white border-slate-200 hover:border-slate-300/80 hover:shadow-lg hover:shadow-black/10 shadow-sm')
                            }`}
                          >
                            {/* Live Visual Filter Preview Box */}
                            <FilterCardThumbnail preset={pst} />

                            <div className="w-full">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold truncate ${
                                  isCurrentActive
                                    ? (appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-700')
                                    : (appTheme === 'dark' ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600')
                                }`}>
                                  {pst.name}
                                </span>
                                {isCurrentActive && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                )}
                              </div>
                              <p className={`text-[10px] leading-tight line-clamp-2 ${
                                appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
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
                    <div className={`p-3.5 rounded-2xl border space-y-3 ${
                      appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Sliders className="w-3 h-3 text-cyan-500" /> Quick Fine-Tune
                        </span>
                        <button
                          onClick={() => setStudioTab('effects')}
                          className="text-[10px] text-cyan-500 hover:underline font-semibold"
                        >
                          Effects &amp; Sliders &rarr;
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

                {/* TAB 3: EFFECTS (WITH 2 SUB-TABS: EFFECTS & GRADIENT ADJUSTMENT) */}
                {studioTab === 'effects' && (
                  <div className="space-y-4">
                    {/* 2 Sub-Tabs Switcher: [ ✨ Effects ] | [ 🎛️ Gradient Adjustment ] */}
                    <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                      appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <button
                        onClick={() => setEffectSubTab('effects')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          effectSubTab === 'effects'
                            ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'bg-blue-600 text-white shadow-md font-bold')
                            : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Effects</span>
                      </button>

                      <button
                        onClick={() => setEffectSubTab('adjustment')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                          effectSubTab === 'adjustment'
                            ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-md font-bold' : 'bg-blue-600 text-white shadow-md font-bold')
                            : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Gradient Adjustment</span>
                      </button>
                    </div>

                    {/* SUB-TAB 1: 29+ 3D MATERIAL STYLES */}
                    {effectSubTab === 'effects' && (
                      <div className="space-y-4">
                        {/* Header with count and reset */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                            }`}>
                              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> {STYLE_RENDER_MODES.length}+ 3D Material Styles &amp; FX
                            </h4>
                            <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              Diamond, Velvet, Wood, Lava, Clay, Mercury, Origami &amp; more
                            </p>
                          </div>

                          <button
                            onClick={handleResetEffectsPanel}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                              appTheme === 'dark'
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
                        <div className={`p-1 rounded-xl border flex items-center gap-1 ${
                          appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                        }`}>
                          <button
                            onClick={() => setEffectVersionFilter('all')}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                              effectVersionFilter === 'all'
                                ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                                : (appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                            }`}
                          >
                            <span>All ({STYLE_RENDER_MODES.length})</span>
                          </button>

                          <button
                            onClick={() => setEffectVersionFilter('new')}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                              effectVersionFilter === 'new'
                                ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-md font-bold'
                                : (appTheme === 'dark' ? 'text-amber-300 hover:text-white' : 'text-amber-700 hover:text-slate-900')
                            }`}
                          >
                            <span>✨ New ({STYLE_RENDER_MODES.filter(m => m.isNew || NEW_EFFECT_IDS.has(m.id)).length})</span>
                          </button>

                          <button
                            onClick={() => setEffectVersionFilter('old')}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
                              effectVersionFilter === 'old'
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
                            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border focus:outline-none focus:border-cyan-500 transition ${
                              appTheme === 'dark'
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
                          {['All', 'Anime & Manga', 'Cartoon & Comic', '3D & Inflatable', 'Glass & Water', 'Fire & Metal', 'Craft & Texture', 'Cyber & Neon', 'Silhouette & Vector'].map((cat) => {
                            const isCatActive = effectCategory === cat;
                            return (
                              <button
                                key={cat}
                                onClick={() => setEffectCategory(cat)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition whitespace-nowrap ${
                                  isCatActive
                                    ? (appTheme === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold' : 'bg-blue-600 text-white shadow-sm font-bold')
                                    : (appTheme === 'dark' ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200')
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>

                        {/* 2-Column Material & Style Cards with Live Visual Preview */}
                        <div className="grid grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {filteredStyleModes.map((preset) => {
                            const isCurrentActive = activeStyleMode === preset.id;
                            const isNew = preset.isNew || NEW_EFFECT_IDS.has(preset.id);
                            return (
                              <button
                                key={preset.id}
                                onClick={() => handleSelectStyleLook(preset)}
                                className={`p-2.5 rounded-2xl border text-left transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden group ${
                                  isCurrentActive
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
                                    <span className={`text-xs font-bold truncate ${
                                      isCurrentActive
                                        ? (appTheme === 'dark' ? 'text-cyan-300' : 'text-blue-700')
                                        : (appTheme === 'dark' ? 'text-slate-200 group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600')
                                    }`}>
                                      {preset.name}
                                    </span>
                                    {isCurrentActive && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className={`text-[10px] leading-tight line-clamp-2 ${
                                    appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
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

                    {/* SUB-TAB 2: GRADIENT ADJUSTMENT (GRANULAR SLIDERS) */}
                    {effectSubTab === 'adjustment' && (
                      <div className={`p-4 rounded-2xl border space-y-4 ${
                        appTheme === 'dark' ? 'bg-[#131b2e]/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            <Sliders className="w-3.5 h-3.5 text-cyan-500" /> Gradient &amp; Filter Grading Sliders
                          </h5>

                          <button
                            onClick={handleResetEffectsPanel}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                              appTheme === 'dark'
                                ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                                : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                            title="Reset all grading sliders to default"
                          >
                            <Undo2 className="w-3 h-3 text-cyan-500" />
                            <span>Reset</span>
                          </button>
                        </div>

                        {/* Hue (Color Shift) */}
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

                        {/* Saturation & Contrast Grid */}
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

                        {/* Brightness & Opacity Grid */}
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

                        {/* Sepia & Invert Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span>Sepia (Vintage)</span>
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.sepia}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={adjustments.sepia}
                              onChange={(e) => setAdjustments({ ...adjustments, sepia: Number(e.target.value) })}
                              className="theme-slider w-full"
                            />
                          </div>

                          <div>
                            <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                              <span>Invert (Negative)</span>
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.invert}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={adjustments.invert}
                              onChange={(e) => setAdjustments({ ...adjustments, invert: Number(e.target.value) })}
                              className="theme-slider w-full"
                            />
                          </div>
                        </div>

                        {/* Edge-Conforming Glow / Shadow */}
                        <div className={`p-3.5 rounded-2xl border space-y-2 ${
                          appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                        }`}>
                          <div className="flex justify-between text-xs items-center">
                            <span className={`font-semibold flex items-center gap-1.5 ${appTheme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Vector Edge Glow Aura
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={adjustments.shadowColor}
                                onChange={(e) => setAdjustments({ ...adjustments, shadowColor: e.target.value })}
                                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                                title="Glow Color"
                              />
                              <span className="text-cyan-500 font-mono text-xs font-semibold">{adjustments.shadowBlur}px</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            value={adjustments.shadowBlur}
                            onChange={(e) => setAdjustments({ ...adjustments, shadowColor: adjustments.shadowColor, shadowBlur: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                          <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            Glow directly outlines and radiates around transparent vector contours.
                          </p>
                        </div>

                        {/* Soft Blur Slider */}
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
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: DIMENSIONS & SIZE CONTROL */}
                {studioTab === 'dimensions' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-500" /> Icon Dimensions &amp; Scaling
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Set custom width and height with live canvas scaling and aspect ratio lock
                        </p>
                      </div>

                      <button
                        onClick={handleResetDimensionsPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                          appTheme === 'dark'
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
                    <div className={`p-4 rounded-2xl border space-y-4 ${
                      appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {/* Aspect Ratio Lock Banner */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleAspectRatioLock}
                            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-semibold ${
                              lockAspectRatio
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
                              className={`w-20 px-2 py-1 rounded-lg text-xs font-mono text-center border focus:outline-none focus:border-cyan-500 ${
                                appTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
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
                              className={`w-20 px-2 py-1 rounded-lg text-xs font-mono text-center border focus:outline-none focus:border-cyan-500 ${
                                appTheme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
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
                              className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                                isCurrent
                                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                  : appTheme === 'dark'
                                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold">{preset.label}</span>
                                <span className={`text-[9px] px-1 rounded ${
                                  isCurrent ? 'bg-blue-700 text-white' : appTheme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
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
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium transition ${
                          appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium transition ${
                          appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        Make Square (1:1)
                      </button>
                    </div>

                    {/* Outline Stroke & Contour Thickness (Universal Vector Line Weight) */}
                    <div className={`p-4 rounded-2xl border space-y-3.5 ${
                      appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
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
                      <div className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium border ${
                        isStrokeIcon 
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
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition ${
                              strokeMultiplier === s.val
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
                        <div className={`mt-2 pt-2.5 border-t space-y-2 ${
                          appTheme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
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
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                                    strokeColorMode === opt.id
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
                    <div className={`p-4 rounded-2xl border space-y-4 ${
                      appTheme === 'dark' ? 'bg-[#131b2e]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
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
                            className={`py-2 px-1 rounded-xl text-center border text-[11px] font-semibold transition ${
                              bgShape === sh.id
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
                {studioTab === 'transform' && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Move3d className="w-3.5 h-3.5 text-cyan-500" /> 3D Perspective &amp; Transforms
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          3D Pitch, Yaw, Orbit Pad, 2D Angle, Mirror &amp; Skew
                        </p>
                      </div>

                      <button
                        onClick={handleResetTransformPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                          appTheme === 'dark'
                            ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                            : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                        title="Reset all 3D and 2D transforms"
                      >
                        <Undo2 className="w-3 h-3 text-cyan-500" />
                        <span>Reset All</span>
                      </button>
                    </div>

                    {/* Sub-Navigation: 3D Perspective | 2D Angle & Flips | Skew & Shear */}
                    <div className={`grid grid-cols-3 gap-1 p-1 rounded-xl border ${
                      appTheme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300'
                    }`}>
                      <button
                        onClick={() => setTransformSubTab('3d')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          transformSubTab === '3d'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D Rotate</span>
                      </button>

                      <button
                        onClick={() => setTransformSubTab('2d')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          transformSubTab === '2d'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>2D Angle</span>
                      </button>

                      <button
                        onClick={() => setTransformSubTab('skew')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          transformSubTab === 'skew'
                            ? 'bg-blue-600 text-white shadow'
                            : appTheme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Skew &amp; Shear</span>
                      </button>
                    </div>

                    {/* SUB-TAB 1: 3D PERSPECTIVE */}
                    {transformSubTab === '3d' && (
                      <div className="space-y-4">
                        {/* Interactive 3D Orbit Trackball Pad */}
                        <Trackball3DPad
                          rotateX={adjustments.rotateX || 0}
                          rotateY={adjustments.rotateY || 0}
                          onChange={(newRx, newRy) => {
                            setAdjustments(prev => ({
                              ...prev,
                              rotateX: newRx,
                              rotateY: newRy
                            }));
                          }}
                          onReset={() => {
                            recordUndo();
                            setAdjustments(prev => ({ ...prev, rotateX: 0, rotateY: 0 }));
                          }}
                          appTheme={appTheme}
                        />

                        {/* 1-Click 3D Angle Presets */}
                        <div>
                          <div className={`text-xs font-semibold mb-2 flex items-center justify-between ${
                            appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            <span>1-Click 3D Angle Presets</span>
                            <span className="text-[10px] text-cyan-500 font-normal">8 Angles</span>
                          </div>

                          <div className="grid grid-cols-4 gap-1.5">
                            {PRESETS_3D.map(p => {
                              const isActive = (adjustments.rotateX || 0) === p.rx && (adjustments.rotateY || 0) === p.ry;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    recordUndo();
                                    setAdjustments(prev => ({
                                      ...prev,
                                      rotateX: p.rx,
                                      rotateY: p.ry,
                                      rotation: p.rz !== undefined ? p.rz : prev.rotation
                                    }));
                                  }}
                                  title={`${p.name}: ${p.desc} (X: ${p.rx}°, Y: ${p.ry}°)`}
                                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                                    isActive
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
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.rotateX || 0}&deg;</span>
                              {(adjustments.rotateX || 0) !== 0 && (
                                <button
                                  onClick={() => setAdjustments(prev => ({ ...prev, rotateX: 0 }))}
                                  className="text-[9px] px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                >
                                  0&deg;
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAdjustments(prev => ({ ...prev, rotateX: Math.max(-85, (prev.rotateX || 0) - 5) }))}
                              className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                            >
                              -5&deg;
                            </button>
                            <input
                              type="range"
                              min="-85"
                              max="85"
                              step="1"
                              value={adjustments.rotateX || 0}
                              onChange={(e) => setAdjustments({ ...adjustments, rotateX: Number(e.target.value) })}
                              className="theme-slider w-full flex-1"
                            />
                            <button
                              onClick={() => setAdjustments(prev => ({ ...prev, rotateX: Math.min(85, (prev.rotateX || 0) + 5) }))}
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
                              <span className="text-cyan-500 font-mono font-semibold">{adjustments.rotateY || 0}&deg;</span>
                              {(adjustments.rotateY || 0) !== 0 && (
                                <button
                                  onClick={() => setAdjustments(prev => ({ ...prev, rotateY: 0 }))}
                                  className="text-[9px] px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                                >
                                  0&deg;
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAdjustments(prev => ({ ...prev, rotateY: Math.max(-85, (prev.rotateY || 0) - 5) }))}
                              className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                            >
                              -5&deg;
                            </button>
                            <input
                              type="range"
                              min="-85"
                              max="85"
                              step="1"
                              value={adjustments.rotateY || 0}
                              onChange={(e) => setAdjustments({ ...adjustments, rotateY: Number(e.target.value) })}
                              className="theme-slider w-full flex-1"
                            />
                            <button
                              onClick={() => setAdjustments(prev => ({ ...prev, rotateY: Math.min(85, (prev.rotateY || 0) + 5) }))}
                              className="px-2 py-1 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-300 font-mono hover:text-white"
                            >
                              +5&deg;
                            </button>
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
                            onChange={(e) => setAdjustments({ ...adjustments, perspective: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>

                        {/* 3D Elevation / Depth Shadow */}
                        <div className={`p-3 rounded-2xl border ${
                          appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
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

                        {/* 3D Motion, Levitation & Animated GIF Studio */}
                        <div className={`p-3.5 rounded-2xl border transition space-y-3 ${
                          adjustments.is3DFloating
                            ? 'bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-500/5'
                            : appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          {/* Top Header & Live Toggle */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                                appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                              }`}>
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> 3D Motion & Levitation
                              </span>
                              <p className={`text-[10px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Live preview motion & looping GIF generator
                              </p>
                            </div>

                            <button
                              onClick={() => setAdjustments(prev => ({ ...prev, is3DFloating: !prev.is3DFloating }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                                adjustments.is3DFloating
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                  : appTheme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${adjustments.is3DFloating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                              <span>{adjustments.is3DFloating ? 'Live Active' : 'Off'}</span>
                            </button>
                          </div>

                          {/* Motion Presets (5 dynamic motion types) */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                                appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                Motion Preset
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                                {adjustments.animPreset || 'float'}
                              </span>
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {[
                                { id: 'float', name: 'Levitate', icon: '🚀' },
                                { id: 'spin360', name: '360° Spin', icon: '🔄' },
                                { id: 'pulse', name: 'Pulse', icon: '💓' },
                                { id: 'wobble', name: 'Wobble', icon: '🎭' },
                                { id: 'wave', name: 'Wave', icon: '🌊' }
                              ].map((preset) => {
                                const isSel = (adjustments.animPreset || 'float') === preset.id;
                                return (
                                  <button
                                    key={preset.id}
                                    onClick={() => setAdjustments(prev => ({ ...prev, animPreset: preset.id, is3DFloating: true }))}
                                    className={`p-1.5 rounded-xl text-center border transition flex flex-col items-center gap-0.5 ${
                                      isSel
                                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/20'
                                        : appTheme === 'dark'
                                          ? 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:border-slate-600'
                                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <span className="text-sm">{preset.icon}</span>
                                    <span className="text-[9px] font-semibold truncate w-full">{preset.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Controls: Speed & Height Sliders */}
                          <div className="space-y-2.5 pt-1 border-t border-slate-200/20">
                            {/* Animation Speed / Loop Duration */}
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

                            {/* Motion Height / Amplitude */}
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

                            {/* Dynamic Physical Shadow Sync */}
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
                          <div className="pt-2 border-t border-slate-200/20">
                            <button
                              onClick={handleExportAnimatedGif}
                              disabled={downloading}
                              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                                downloading
                                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-[0.99]'
                              }`}
                            >
                              <Film className={`w-3.5 h-3.5 ${downloading ? 'animate-spin' : ''}`} />
                              <span>{downloading ? 'Rendering Looping GIF...' : '✨ Export Animated .GIF (Looping)'}</span>
                            </button>
                            <p className={`text-[9px] text-center mt-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                              512px • Hardware WebGL 3D frames • Clean loop
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: 2D ANGLE & FLIPS */}
                    {transformSubTab === '2d' && (
                      <div className="space-y-4">
                        {/* 2D Angle Slider */}
                        <div>
                          <div className={`flex justify-between text-xs mb-1 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span>Rotation Angle</span>
                            <span className="text-cyan-500 font-mono font-semibold">{adjustments.rotation}&deg;</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                            value={adjustments.rotation}
                            onChange={(e) => setAdjustments({ ...adjustments, rotation: Number(e.target.value) })}
                            className="theme-slider w-full"
                          />
                        </div>

                        {/* Quick Angle Snap Pills */}
                        <div>
                          <span className={`text-[11px] font-medium block mb-1.5 ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                            Quick Angle Snap
                          </span>
                          <div className="grid grid-cols-6 gap-1">
                            {[0, 45, 90, 135, 180, 270].map(deg => (
                              <button
                                key={deg}
                                onClick={() => {
                                  recordUndo();
                                  setAdjustments({ ...adjustments, rotation: deg });
                                }}
                                className={`py-1.5 rounded-lg border text-xs font-mono font-semibold transition ${
                                  adjustments.rotation === deg
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
                            onClick={() => {
                              recordUndo();
                              setAdjustments(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
                            }}
                            className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${
                              appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                            }`}
                          >
                            <RotateCw className="w-4 h-4 text-cyan-500" />
                            <span>Rotate 90&deg; CW</span>
                          </button>

                          <button
                            onClick={() => {
                              recordUndo();
                              setAdjustments(prev => ({ ...prev, rotation: (prev.rotation - 90 + 360) % 360 }));
                            }}
                            className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${
                              appTheme === 'dark'
                                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm'
                            }`}
                          >
                            <RotateCcw className="w-4 h-4 text-cyan-500" />
                            <span>Rotate 90&deg; CCW</span>
                          </button>

                          <button
                            onClick={() => {
                              recordUndo();
                              setAdjustments(prev => ({ ...prev, rotation: (prev.rotation + 180) % 360 }));
                            }}
                            className={`py-3 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-1.5 transition ${
                              appTheme === 'dark'
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
                            onClick={() => {
                              recordUndo();
                              setAdjustments(prev => ({ ...prev, flipH: !prev.flipH }));
                            }}
                            className={`py-3.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                              adjustments.flipH 
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400' 
                                : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <FlipHorizontal className="w-4 h-4 text-cyan-500" />
                            <span>Flip Horizontal {adjustments.flipH ? '(On)' : ''}</span>
                          </button>

                          <button
                            onClick={() => {
                              recordUndo();
                              setAdjustments(prev => ({ ...prev, flipV: !prev.flipV }));
                            }}
                            className={`py-3.5 rounded-2xl border text-xs font-medium flex items-center justify-center gap-2 transition ${
                              adjustments.flipV 
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-1 ring-blue-400' 
                                : appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <FlipVertical className="w-4 h-4 text-cyan-500" />
                            <span>Flip Vertical {adjustments.flipV ? '(On)' : ''}</span>
                          </button>
                        </div>
                      </div>
                    )}

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
                                className={`p-2 rounded-xl border text-[10px] font-semibold transition ${
                                  (adjustments.skewX || 0) === p.sx && (adjustments.skewY || 0) === p.sy
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
                )}

                {/* TAB 5: EXPORT SETTINGS */}
                {studioTab === 'export' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <Download className="w-3.5 h-3.5 text-cyan-500" /> Export Configuration
                        </h4>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Target format, resolution and background options
                        </p>
                      </div>

                      <button
                        onClick={handleResetExportPanel}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 flex-shrink-0 ${
                          appTheme === 'dark'
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
                      <div className="grid grid-cols-4 gap-2">
                        {['png', 'webp', 'jpeg', 'gif'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setExportFormat(fmt)}
                            className={`py-2.5 rounded-xl uppercase text-xs font-bold transition border text-center ${
                              exportFormat === fmt
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : appTheme === 'dark'
                                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                      {exportFormat === 'gif' && (
                        <div className="mt-2 p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-[11px] flex items-center gap-2">
                          <Film className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className={appTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                            Animated looping GIF with active 3D motion & transparency
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Resolution buttons */}
                    <div>
                      <label className={`block text-[11px] font-semibold mb-2 uppercase ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Export Resolution ({exportSize >= 1024 ? `${exportSize / 1024}K Ultra HD` : `${exportSize}px Standard`})
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[128, 256, 512, 1024, 2048, 4096, 8192].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setExportSize(sz)}
                            className={`py-2 rounded-xl text-xs font-semibold transition border text-center ${
                              exportSize === sz
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                : appTheme === 'dark'
                                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sz >= 1024 ? `${sz / 1024}K` : `${sz}px`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Transparency Toggle */}
                    <div className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                      appTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <p className={`text-xs font-semibold ${appTheme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Transparent Background</p>
                        <p className={`text-[11px] ${appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {exportFormat === 'jpeg' 
                            ? 'JPEG transparency support nahi karta (Solid White apply hoga).' 
                            : 'Background transparent rahega bina solid color ke.'}
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

                    {/* Download CTA */}
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 py-3.5 rounded-2xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-white"
                    >
                      <Download className="w-4 h-4" />
                      {downloading ? 'Rendering & Exporting...' : `Download .${exportFormat.toUpperCase()} (${exportSize >= 1024 ? `${exportSize / 1024}K` : exportSize + 'px'})`}
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Fixed Export Bar (Always accessible) */}
              {studioTab !== 'export' && (
                <div className={`p-4 border-t flex items-center justify-between gap-3 ${
                  appTheme === 'dark' ? 'border-slate-800 bg-[#0b0f19]' : 'border-slate-200 bg-slate-50 shadow-inner'
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
            className={`w-full max-w-lg rounded-2xl sm:rounded-3xl border shadow-2xl p-4 sm:p-7 relative transition-all duration-200 max-h-[90vh] overflow-y-auto ${
              appTheme === 'dark' 
                ? 'bg-[#0f172a] border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between pb-3.5 sm:pb-4 border-b mb-4 sm:mb-5 ${
              appTheme === 'dark' ? 'border-slate-800' : 'border-slate-100'
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
                className={`p-1.5 sm:p-2 rounded-xl transition ${
                  appTheme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
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
              <div className={`p-3.5 sm:p-4 rounded-2xl border ${
                appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
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
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none shadow-inner flex-shrink-0 ${
                      appTheme === 'dark' ? 'bg-cyan-500' : 'bg-slate-300'
                    }`}
                    title="Toggle Dark Mode On / Off"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                        appTheme === 'dark' ? 'translate-x-8' : 'translate-x-1'
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
                    className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      appTheme === 'dark'
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
                    className={`p-2.5 sm:p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      appTheme === 'light'
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
              <div className={`p-4 rounded-2xl border ${
                appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Download className="w-3.5 h-3.5 text-cyan-400" /> Default Export Format
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {['png', 'svg', 'jpeg', 'webp', 'pdf'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setExportFormat(fmt);
                        localStorage.setItem('iconderry_default_format', fmt);
                        setSettingsToast(`Default format set to .${fmt.toUpperCase()}`);
                        setTimeout(() => setSettingsToast(''), 2500);
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase transition border ${
                        exportFormat === fmt
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
              <div className={`p-4 rounded-2xl border ${
                appTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      appTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
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
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                    appTheme === 'dark'
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
            <div className={`mt-6 pt-4 border-t flex items-center justify-between ${
              appTheme === 'dark' ? 'border-slate-800' : 'border-slate-100'
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
          <div className={`border rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative max-h-[85vh] overflow-y-auto ${
            appTheme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
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
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
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
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <p><strong>Zero Tracking:</strong> Iconderry does not sell personal data, inject third-party ad trackers, or log your vector designs.</p>
                  <p><strong>Local Storage:</strong> Your preferences, recently opened icons, and favorite items are stored securely inside your browser's local storage.</p>
                  <p><strong>Cloud Assets:</strong> Community assets are served securely via cloud storage for fast global performance.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <FileText className="w-5 h-5" /> Terms of Service
                </div>
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
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
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 ${
                  appTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
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
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                          appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
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
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                          appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
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
                        className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:border-cyan-500 ${
                          appTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
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
    </div>
  );
}