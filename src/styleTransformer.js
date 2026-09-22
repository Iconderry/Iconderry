// SVG Visual Style Transformer for Iconderry
// Transforms SVGs into pristine stylized looks:
// 2D Silhouette, Glassmorphism, Neon Glow, 3D Inflated, Claymorphism Soft, Chrome Mirror,
// Holographic Rainbow, Clear Water Droplets, Paper Cutout, Isometric 3D, Duotone Halftone,
// Pixel Art, Hand-Drawn Sketch, Liquid Chrome Bubble, Long Shadow, Luxury Gold Foil, Cyber Wireframe,
// Dark Obsidian, Diamond Crystal, Velvet Leather, Molten Mercury, Aurora Wireframe,
// Carved Wood, Origami Paper, Aurora Bubble Glass, Cyber PCB Circuit, Fluffy Cloud, etc.

export const STYLE_RENDER_MODES = [
  {
    id: 'original',
    name: 'Original Default Vector',
    category: 'All',
    desc: 'Reset all material style transformations back to clean original vector',
    icon: '🔄',
    badge: 'Original',
    previewBg: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderAccent: '#38bdf8',
    texture: 'none',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 0, shadowColor: '#38bdf8', brightness: 100, contrast: 100, saturation: 100, hue: 0, sepia: 0, invert: 0 }
  },
  // 1. New Material Styles from reference
  {
    id: 'splash_water',
    name: 'Splash Water & Ice Droplets',
    category: 'Glass & Water',
    desc: 'Crystal clear liquid water with splashing ripples, bubbles & refraction',
    icon: '🌊',
    badge: 'Splash Water',
    previewBg: 'linear-gradient(135deg, #0ea5e9, #0284c7, #38bdf8)',
    borderAccent: '#38bdf8',
    texture: 'water',
    adjustments: { customColor: '', opacity: 90, blur: 0, shadowBlur: 28, shadowColor: '#38bdf8', brightness: 130, contrast: 135, saturation: 140 }
  },
  {
    id: 'foil_balloon',
    name: 'Glossy Inflatable Foil Balloon',
    category: '3D & Inflatable',
    desc: 'Puffy vinyl foil cushion with crimped heat-sealed seam edges & shiny glare',
    icon: '🎈',
    badge: 'Foil Balloon',
    previewBg: 'linear-gradient(135deg, #1d4ed8, #3b82f6, #60a5fa)',
    borderAccent: '#60a5fa',
    texture: 'balloon',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#1d4ed8', brightness: 118, contrast: 130, saturation: 150 }
  },
  {
    id: 'frosted_ice',
    name: 'Frosted Winter Ice Crystals',
    category: 'Glass & Water',
    desc: 'Chilled frosty glass with branching ice crystal dendrites & snowflakes',
    icon: '❄️',
    badge: 'Frosted Ice',
    previewBg: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #7dd3fc)',
    borderAccent: '#bae6fd',
    texture: 'frost',
    adjustments: { customColor: '', opacity: 92, blur: 0, shadowBlur: 26, shadowColor: '#7dd3fc', brightness: 135, contrast: 125, saturation: 110 }
  },
  {
    id: 'molten_lava',
    name: 'Molten Magma Volcanic Lava',
    category: 'Fire & Metal',
    desc: 'Charred basalt volcanic crust with glowing neon orange-red magma fissures',
    icon: '🔥',
    badge: 'Molten Lava',
    previewBg: 'linear-gradient(135deg, #18181b, #7f1d1d, #ff4500, #ffea00)',
    borderAccent: '#f97316',
    texture: 'lava',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 32, shadowColor: '#ff4500', brightness: 125, contrast: 160, saturation: 180 }
  },
  {
    id: 'knitted_wool',
    name: 'Cozy Knitted Wool Sweater',
    category: 'Craft & Texture',
    desc: 'Ribbed tactile oatmeal knit sweater with woven yarn loop stitch texture',
    icon: '🧶',
    badge: 'Knit Wool',
    previewBg: 'linear-gradient(135deg, #e7ded0, #d5c6b1, #a38f78)',
    borderAccent: '#d5c6b1',
    texture: 'wool',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#78350f', brightness: 105, contrast: 120, saturation: 110 }
  },
  {
    id: 'lego_bricks',
    name: 'Lego Toy Building Blocks',
    category: 'Craft & Texture',
    desc: 'Interlocking primary plastic toy bricks with iconic round stud cylinders',
    icon: '🧱',
    badge: 'Lego Bricks',
    previewBg: 'linear-gradient(135deg, #ffd500, #0055bf, #e60012, #d1d5db)',
    borderAccent: '#ffd500',
    texture: 'lego',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#0055bf', brightness: 110, contrast: 130, saturation: 160 }
  },
  {
    id: 'carrara_marble',
    name: 'Luxury Carrara Gold Marble',
    category: 'Craft & Texture',
    desc: 'Polished white marble slab with organic golden-brown & slate mineral veins',
    icon: '🏛️',
    badge: 'Gold Marble',
    previewBg: 'linear-gradient(135deg, #ffffff, #f8fafc, #e2e8f0)',
    borderAccent: '#d97706',
    texture: 'marble',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#b48a4d', brightness: 115, contrast: 125, saturation: 120 }
  },
  {
    id: 'neon_tube_glass',
    name: 'Luminescent Glass Neon Tube',
    category: 'Cyber & Neon',
    desc: 'Electric ice-blue glowing luminescent neon light tube glass contour',
    icon: '💡',
    badge: 'Neon Tube',
    previewBg: 'linear-gradient(135deg, #030712, #083344, #00f0ff)',
    borderAccent: '#00f0ff',
    texture: 'neon_tube',
    adjustments: { customColor: '', opacity: 95, blur: 0, shadowBlur: 35, shadowColor: '#00f0ff', brightness: 135, contrast: 155, saturation: 180 }
  },
  {
    id: 'gummy_bear_jelly',
    name: 'Pink Gummy Bear Jelly Candy',
    category: 'Silhouette & Vector',
    desc: 'Translucent strawberry gelatin gummy candy with glossy specular shine',
    icon: '🍬',
    badge: 'Gummy Jelly',
    previewBg: 'linear-gradient(135deg, #f43f5e, #fb7185, #fda4af)',
    borderAccent: '#f43f5e',
    texture: 'gummy',
    adjustments: { customColor: '', opacity: 90, blur: 0, shadowBlur: 28, shadowColor: '#fb7185', brightness: 125, contrast: 135, saturation: 160 }
  },

  // 2. Previously created curated styles
  {
    id: 'silhouette_2d',
    name: 'Flat 2D Silhouette',
    category: 'Silhouette & Vector',
    desc: 'Solid pitch black body with crisp pure white inner details',
    icon: '🖤',
    badge: 'Silhouette',
    previewBg: 'linear-gradient(135deg, #09090b, #18181b)',
    borderAccent: '#52525b',
    texture: 'silhouette',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 0, invert: 0, sepia: 0, hue: 0, brightness: 100, saturation: 100, contrast: 100 }
  },
  {
    id: 'diamond_crystal',
    name: 'Faceted Diamond Prism',
    category: 'Glass & Water',
    desc: 'Brilliant cut geometric diamond facets with iridescent caustic sparkles',
    icon: '💎',
    badge: 'Diamond Prism',
    previewBg: 'linear-gradient(135deg, #f8fafc, #bae6fd, #e0e7ff)',
    borderAccent: '#93c5fd',
    texture: 'diamond',
    adjustments: { customColor: '', opacity: 98, blur: 0, shadowBlur: 28, shadowColor: '#93c5fd', brightness: 135, contrast: 140, saturation: 130 }
  },
  {
    id: 'velvet_leather',
    name: 'Matte Dark Velvet Leather',
    category: 'Craft & Texture',
    desc: 'Pitch black luxury suede velvet with deep stamped tactile grooves',
    icon: '🖤',
    badge: 'Velvet Noir',
    previewBg: 'linear-gradient(135deg, #27272a, #09090b)',
    borderAccent: '#3f3f46',
    texture: 'velvet',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 0, shadowColor: '#18181b', brightness: 100, contrast: 120, saturation: 90 }
  },
  {
    id: 'molten_mercury',
    name: 'Molten Fluid Mercury Chrome',
    category: 'Fire & Metal',
    desc: 'Liquid flowing metal fluid frame with high-sheen specular reflections',
    icon: '🥈',
    badge: 'Fluid Mercury',
    previewBg: 'linear-gradient(135deg, #e2e8f0, #475569)',
    borderAccent: '#cbd5e1',
    texture: 'mercury',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 26, shadowColor: '#cbd5e1', brightness: 125, contrast: 155, saturation: 110 }
  },
  {
    id: 'aurora_wireframe',
    name: 'Aurora Neon Wireframe Mesh',
    category: 'Cyber & Neon',
    desc: '3D glowing cyber grid with vivid Aurora Borealis rainbow luminescence',
    icon: '🌌',
    badge: 'Aurora Mesh',
    previewBg: 'linear-gradient(135deg, #06b6d4, #a855f7, #22c55e)',
    borderAccent: '#22c55e',
    texture: 'aurora',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 32, shadowColor: '#22c55e', brightness: 130, contrast: 150, saturation: 180 }
  },
  {
    id: 'carved_wood',
    name: 'Carved Walnut Wood Grain',
    category: 'Craft & Texture',
    desc: 'Warm organic walnut wood grain texture with deeply carved beveled edges',
    icon: '🪵',
    badge: 'Carved Wood',
    previewBg: 'linear-gradient(135deg, #92400e, #451a03)',
    borderAccent: '#b45309',
    texture: 'wood',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#451a03', brightness: 105, contrast: 125, saturation: 140 }
  },
  {
    id: 'origami_paper',
    name: 'Geometric Origami Folded Paper',
    category: 'Craft & Texture',
    desc: 'Sharp geometric folded paper parchment with crisp crease facets & shadows',
    icon: '📐',
    badge: 'Origami Craft',
    previewBg: 'linear-gradient(135deg, #fef3c7, #b45309)',
    borderAccent: '#f59e0b',
    texture: 'origami',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#78350f', brightness: 105, contrast: 120, saturation: 115 }
  },
  {
    id: 'aurora_bubble_glass',
    name: 'Iridescent Soap Bubble Glass',
    category: 'Glass & Water',
    desc: 'Translucent chromatic soap bubble with oil-slick swirls and glass glow',
    icon: '🫧',
    badge: 'Soap Bubble',
    previewBg: 'linear-gradient(135deg, rgba(244,114,182,0.8), rgba(56,189,248,0.8))',
    borderAccent: '#f472b6',
    texture: 'bubble',
    adjustments: { customColor: '', opacity: 92, blur: 0.5, shadowBlur: 30, shadowColor: '#f472b6', brightness: 125, contrast: 125, saturation: 170 }
  },
  {
    id: 'cyber_circuit_pcb',
    name: 'Cyberpunk PCB Circuit Board',
    category: 'Cyber & Neon',
    desc: 'Glass PCB motherboard with glowing electric cyan circuit tracks & CPU core',
    icon: '⚡',
    badge: 'PCB Microchip',
    previewBg: 'linear-gradient(135deg, #083344, #00f0ff)',
    borderAccent: '#00f0ff',
    texture: 'pcb',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 32, shadowColor: '#00f0ff', brightness: 130, contrast: 145, saturation: 180 }
  },
  {
    id: 'fluffy_cloud',
    name: 'Fluffy Soft Cotton Cloud',
    category: '3D & Inflatable',
    desc: 'Organic fluffy white cumulus cloud with soft procedural volumetric texture',
    icon: '☁️',
    badge: 'Puffy Cloud',
    previewBg: 'linear-gradient(135deg, #f8fafc, #94a3b8)',
    borderAccent: '#cbd5e1',
    texture: 'cloud',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#94a3b8', brightness: 110, contrast: 115, saturation: 90 }
  },
  {
    id: 'claymorphism_soft',
    name: 'Claymorphism Soft Puffy 3D',
    category: '3D & Inflatable',
    desc: 'Tactile pastel blue puffy clay with organic wavy marshmallow dough contour',
    icon: '🏺',
    badge: 'Soft Clay',
    previewBg: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
    borderAccent: '#60a5fa',
    texture: 'clay',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#1e3a8a', brightness: 108, contrast: 115, saturation: 125 }
  },
  {
    id: 'isometric_3d',
    name: 'Isometric 3D Extrusion',
    category: '3D & Inflatable',
    desc: '3D architectural isometric extrusion with deep side bevel walls & angle',
    icon: '📦',
    badge: 'Isometric 3D',
    previewBg: 'linear-gradient(135deg, #2563eb, #1e40af)',
    borderAccent: '#3b82f6',
    texture: 'isometric',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#172554', brightness: 108, contrast: 125, saturation: 135 }
  },
  {
    id: 'glassmorphism',
    name: 'Transparent Glassmorphism',
    category: 'Glass & Water',
    desc: 'Translucent frosted glass with soft blur & white rim highlights',
    icon: '💎',
    badge: 'Glassy Blur',
    previewBg: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(148,163,184,0.25))',
    borderAccent: '#38bdf8',
    texture: 'glass',
    adjustments: { customColor: '', opacity: 85, blur: 0.5, shadowBlur: 24, shadowColor: '#38bdf8', brightness: 120, saturation: 110, contrast: 110 }
  },
  {
    id: 'neon_glow',
    name: 'Neon Glowing Blue',
    category: 'Cyber & Neon',
    desc: 'Electric blue body with intense radiant cyan neon contours',
    icon: '⚡',
    badge: 'Neon Blue',
    previewBg: 'linear-gradient(135deg, #0284c7, #00f0ff)',
    borderAccent: '#00f0ff',
    texture: 'neon',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 32, shadowColor: '#00f0ff', brightness: 125, contrast: 140, saturation: 160 }
  },
  {
    id: 'inflated_3d',
    name: '3D Glossy Inflated Plastic',
    category: '3D & Inflatable',
    desc: 'Puffed glossy pillow 3D material with specular highlights',
    icon: '🎈',
    badge: '3D Glossy',
    previewBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderAccent: '#3b82f6',
    texture: 'inflated',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#1d4ed8', brightness: 110, contrast: 120, saturation: 140 }
  },
  {
    id: 'chrome_mirror',
    name: 'Chrome Metallic Mirror',
    category: 'Fire & Metal',
    desc: 'Liquid silver chrome mirror with crisp specular horizon reflections',
    icon: '🪞',
    badge: 'Liquid Chrome',
    previewBg: 'linear-gradient(135deg, #f8fafc, #475569)',
    borderAccent: '#e2e8f0',
    texture: 'chrome',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#e2e8f0', brightness: 120, contrast: 145, saturation: 110 }
  },
  {
    id: 'holographic_rainbow',
    name: 'Holographic Rainbow Chrome',
    category: 'Fire & Metal',
    desc: 'Prism rainbow iridescent sheen with metallic specular reflections',
    icon: '🌈',
    badge: 'Holo Prism',
    previewBg: 'linear-gradient(135deg, #f472b6, #38bdf8, #a855f7)',
    borderAccent: '#c084fc',
    texture: 'holo',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 26, shadowColor: '#c084fc', brightness: 115, contrast: 130, saturation: 170 }
  },
  {
    id: 'water_droplets',
    name: 'Clear Water Droplets',
    category: 'Glass & Water',
    desc: 'Ultra-clear refractive ice with liquid surface bubbles & caustics',
    icon: '💧',
    badge: 'Water Drops',
    previewBg: 'linear-gradient(135deg, #0284c7, #bae6fd)',
    borderAccent: '#38bdf8',
    texture: 'water_drops',
    adjustments: { customColor: '', opacity: 92, blur: 0.5, shadowBlur: 28, shadowColor: '#38bdf8', brightness: 130, contrast: 120, saturation: 140 }
  },
  {
    id: 'paper_cutout',
    name: 'Paper Cutout Shadow Layers',
    category: 'Craft & Texture',
    desc: 'Multi-layered stacked craft paper sheets with soft drop shadows',
    icon: '📄',
    badge: 'Paper Craft',
    previewBg: 'linear-gradient(135deg, #bfdbfe, #60a5fa)',
    borderAccent: '#60a5fa',
    texture: 'paper',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#1e3a8a', brightness: 105, contrast: 110, saturation: 120 }
  },
  {
    id: 'duotone_halftone',
    name: 'Duotone Pink & Blue Halftone',
    category: 'Craft & Texture',
    desc: 'Screen-printed pop-art halftone dots with pink top and blue shade',
    icon: '🎨',
    badge: 'Pop Duotone',
    previewBg: 'linear-gradient(135deg, #f472b6, #2563eb)',
    borderAccent: '#f43f5e',
    texture: 'halftone',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#f43f5e', brightness: 105, contrast: 130, saturation: 160 }
  },
  {
    id: 'pixel_art',
    name: 'Pixel Art 8-Bit Retro',
    category: 'Craft & Texture',
    desc: '8-bit arcade pixelated look with pixel dithered lighting',
    icon: '👾',
    badge: '8-Bit Retro',
    previewBg: 'linear-gradient(135deg, #1e1b4b, #3b82f6)',
    borderAccent: '#3b82f6',
    texture: 'pixel',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 12, shadowColor: '#3b82f6', brightness: 105, contrast: 135, saturation: 140 }
  },
  {
    id: 'hand_drawn_sketch',
    name: 'Hand-Drawn Sketch Doodle',
    category: 'Craft & Texture',
    desc: 'Crosshatched blueprint pencil sketch drawing on chalk canvas',
    icon: '✏️',
    badge: 'Pencil Sketch',
    previewBg: 'linear-gradient(135deg, #1e293b, #0f172a)',
    borderAccent: '#64748b',
    texture: 'sketch',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 8, shadowColor: '#38bdf8', brightness: 110, contrast: 125, saturation: 100 }
  },
  {
    id: 'liquid_chrome_bubble',
    name: 'Liquid Chrome Molten Bubble',
    category: 'Fire & Metal',
    desc: 'Molten organic liquid mercury with dripping specular reflections',
    icon: '🫧',
    badge: 'Molten Bubble',
    previewBg: 'linear-gradient(135deg, #e2e8f0, #1e293b)',
    borderAccent: '#94a3b8',
    texture: 'bubble_chrome',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#94a3b8', brightness: 125, contrast: 150, saturation: 120 }
  },
  {
    id: 'gold_luxury',
    name: 'Luxury Gold Foil Mirror',
    category: 'Fire & Metal',
    desc: 'Polished royal gold foil mirror with warm specular luxury sheen',
    icon: '🏆',
    badge: 'Gold Plate',
    previewBg: 'linear-gradient(135deg, #fef08a, #78350f)',
    borderAccent: '#ca8a04',
    texture: 'gold',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#ca8a04', brightness: 115, contrast: 130, saturation: 160 }
  },
  {
    id: 'cyber_wireframe',
    name: 'Cyber Wireframe Grid Matrix',
    category: 'Cyber & Neon',
    desc: 'Glowing cyan 3D wireframe mesh grid hologram perspective',
    icon: '🌐',
    badge: 'Wireframe Grid',
    previewBg: 'linear-gradient(135deg, #0284c7, #00f0ff)',
    borderAccent: '#00f0ff',
    texture: 'wireframe',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 30, shadowColor: '#00f0ff', brightness: 130, contrast: 145, saturation: 170 }
  },
  {
    id: 'dark_obsidian',
    name: 'Dark Obsidian Rim Light',
    category: 'Cyber & Neon',
    desc: 'Pitch dark stealth shell with striking electric cyan rim light',
    icon: '🌑',
    badge: 'Stealth Rim',
    previewBg: 'linear-gradient(135deg, #1e293b, #030712)',
    borderAccent: '#38bdf8',
    texture: 'obsidian',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#38bdf8', brightness: 95, contrast: 130, saturation: 120 }
  },
  {
    id: 'gradient_vibrant',
    name: 'Gradient Colorful Vibrant',
    category: 'Silhouette & Vector',
    desc: 'Lush multi-stop purple-pink-coral gradient with white accents',
    icon: '✨',
    badge: 'Vibrant Mesh',
    previewBg: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f97316)',
    borderAccent: '#ec4899',
    texture: 'gradient',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#ec4899', brightness: 108, contrast: 115, saturation: 150 }
  },
  {
    id: 'outline_stroke',
    name: 'Outline Stroke Line Art',
    category: 'Silhouette & Vector',
    desc: 'Zero-fill minimalist clean vector outline stroke drawing',
    icon: '✏️',
    badge: 'Line Art',
    previewBg: 'linear-gradient(135deg, #0f172a, #1e293b)',
    borderAccent: '#e2e8f0',
    texture: 'outline',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 0, brightness: 100, contrast: 100, saturation: 100 }
  },
  // --- 20 NEW ANIME, CARTOON, 3D & STYLIZED EFFECTS ---
  {
    id: 'anime_cel_shading',
    name: 'Anime Cel-Shading Shonen',
    category: 'Anime & Manga',
    desc: 'Japanese anime hand-drawn 2-tone cel-shading with bold black contour inking',
    icon: '⚡',
    badge: 'Anime Cel',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #f97316, #ef4444, #3b82f6)',
    borderAccent: '#f97316',
    texture: 'anime_cel',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#f97316', brightness: 120, contrast: 155, saturation: 170 }
  },
  {
    id: 'anime_mecha_cyber',
    name: 'Anime Mecha Robot Armor',
    category: 'Anime & Manga',
    desc: 'Sci-fi Gundam anime mecha armor with panel-lines, metallic plating & optic glow',
    icon: '🤖',
    badge: 'Mecha Armor',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #0284c7, #2563eb, #dc2626)',
    borderAccent: '#38bdf8',
    texture: 'mecha',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#00f0ff', brightness: 125, contrast: 145, saturation: 150 }
  },
  {
    id: 'anime_speed_lines',
    name: 'Anime Shonen Battle Flare',
    category: 'Anime & Manga',
    desc: 'Explosive radial speed lines with glowing super-saiyan energy ki aura',
    icon: '💥',
    badge: 'Shonen Battle',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)',
    borderAccent: '#fbbf24',
    texture: 'speed_lines',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 30, shadowColor: '#f59e0b', brightness: 130, contrast: 160, saturation: 180 }
  },
  {
    id: 'anime_chibi_kawaii',
    name: 'Kawaii Pastel Chibi Anime',
    category: 'Anime & Manga',
    desc: 'Sweet bubbly cherry blossom anime pastel tones with cute soft marshmallow blush',
    icon: '🌸',
    badge: 'Kawaii Chibi',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #fbcfe8, #f472b6, #c084fc)',
    borderAccent: '#f472b6',
    texture: 'kawaii',
    adjustments: { customColor: '', opacity: 95, blur: 0.2, shadowBlur: 20, shadowColor: '#f472b6', brightness: 120, contrast: 115, saturation: 140 }
  },
  {
    id: 'anime_cyber_city',
    name: 'Neo-Tokyo Anime Cyber City',
    category: 'Anime & Manga',
    desc: 'Cyberpunk anime aesthetic with neon purple rain reflections & glowing headlights',
    icon: '🌆',
    badge: 'Neo Tokyo',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #1e1b4b, #a855f7, #06b6d4)',
    borderAccent: '#a855f7',
    texture: 'cyber_city',
    adjustments: { customColor: '', opacity: 100, blur: 0.2, shadowBlur: 26, shadowColor: '#a855f7', brightness: 122, contrast: 145, saturation: 170 }
  },
  {
    id: 'cartoon_comic_pop',
    name: 'Retro Comic Pop-Art Halftone',
    category: 'Cartoon & Comic',
    desc: 'Vintage pop-art Ben-Day halftone dot matrix with punchy primary ink',
    icon: '🗯️',
    badge: 'Pop Halftone',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #ef4444, #eab308, #2563eb)',
    borderAccent: '#eab308',
    texture: 'halftone',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#000000', brightness: 115, contrast: 160, saturation: 185 }
  },
  {
    id: 'cartoon_toontown_3d',
    name: 'Toontown Squishy 3D Cartoon',
    category: 'Cartoon & Comic',
    desc: 'Bouncy energetic Saturday morning cartoon with squash-and-stretch highlight',
    icon: '🎨',
    badge: 'Toontown',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #38bdf8, #818cf8, #f43f5e)',
    borderAccent: '#38bdf8',
    texture: 'toontown',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#3b82f6', brightness: 125, contrast: 135, saturation: 165 }
  },
  {
    id: 'cartoon_rubber_hose',
    name: '1930s Rubber Hose Toon',
    category: 'Cartoon & Comic',
    desc: 'Vintage monochrome 1930s animation with film grain & ink-pot line weight',
    icon: '🎞️',
    badge: 'Rubber Hose',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #f8fafc, #64748b, #0f172a)',
    borderAccent: '#94a3b8',
    texture: 'rubber_hose',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 14, shadowColor: '#000000', brightness: 105, contrast: 170, saturation: 0 }
  },
  {
    id: 'cartoon_graffiti_sticker',
    name: 'Street Art Graffiti Sticker',
    category: 'Cartoon & Comic',
    desc: 'Die-cut vinyl sticker with thick white peel-off outline & vibrant spray drips',
    icon: '🛹',
    badge: 'Die-Cut Vinyl',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4)',
    borderAccent: '#ec4899',
    texture: 'sticker',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 24, shadowColor: '#000000', brightness: 120, contrast: 145, saturation: 175 }
  },
  {
    id: 'cartoon_superhero_ink',
    name: 'Noir Graphic Novel Inking',
    category: 'Cartoon & Comic',
    desc: 'Chiaroscuro high-drama comic inking with stark black shadows & angular cuts',
    icon: '🦇',
    badge: 'Graphic Ink',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #09090b, #18181b, #facc15)',
    borderAccent: '#facc15',
    texture: 'graphic_ink',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 16, shadowColor: '#000000', brightness: 110, contrast: 180, saturation: 90 }
  },
  {
    id: 'cartoon_arcade_retro',
    name: '90s Saturday Cartoon Arcade',
    category: 'Cartoon & Comic',
    desc: 'Vibrant 90s cartoon network palette with cheerful bubblegum highlights',
    icon: '👾',
    badge: 'Saturday Toon',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #38bdf8, #f472b6, #fbbf24)',
    borderAccent: '#38bdf8',
    texture: 'cartoon_arcade',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#f472b6', brightness: 120, contrast: 135, saturation: 175 }
  },
  {
    id: '3d_voxel_craft',
    name: '3D Voxel Minecraft Cubes',
    category: '3D & Inflatable',
    desc: 'Chunky isometric cubic voxel blocks with dimensional faceted face lighting',
    icon: '🧊',
    badge: 'Voxel 3D',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #15803d, #16a34a, #854d0e)',
    borderAccent: '#22c55e',
    texture: 'voxel',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 20, shadowColor: '#14532d', brightness: 110, contrast: 135, saturation: 150 }
  },
  {
    id: '3d_inflatable_gold_balloon',
    name: '24K Gold Puffy Mylar Balloon 3D',
    category: '3D & Inflatable',
    desc: 'Puffed reflective 24K yellow gold mylar balloon with crimped heat-sealed seams',
    icon: '🟡',
    badge: 'Gold Mylar',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #fef08a, #eab308, #b45309)',
    borderAccent: '#facc15',
    texture: 'gold_balloon',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 28, shadowColor: '#ca8a04', brightness: 128, contrast: 145, saturation: 160 }
  },
  {
    id: '3d_metallic_chrome_foil',
    name: 'Hyper-Reflective Liquid Chrome 3D',
    category: 'Fire & Metal',
    desc: 'Mirror specular liquid mercury metal sculpture with distortion horizon waves',
    icon: '🪞',
    badge: 'Liquid Mirror',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #f8fafc, #94a3b8, #334155)',
    borderAccent: '#e2e8f0',
    texture: 'chrome_foil',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 28, shadowColor: '#cbd5e1', brightness: 130, contrast: 165, saturation: 110 }
  },
  {
    id: '3d_wooden_toy',
    name: 'Polished Nordic Wooden Toy 3D',
    category: 'Craft & Texture',
    desc: 'Smooth turned birch wood grain with glossy hand-buffed protective lacquer',
    icon: '🪵',
    badge: 'Nordic Wood',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #fde68a, #d97706, #78350f)',
    borderAccent: '#d97706',
    texture: 'wood_toy',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 18, shadowColor: '#78350f', brightness: 112, contrast: 125, saturation: 135 }
  },
  {
    id: '3d_hologram_matrix',
    name: '3D Laser Hologram Matrix',
    category: 'Cyber & Neon',
    badge: 'Laser Holo',
    desc: '3D volumetric floating cyan laser scanlines with concentric ring projection',
    icon: '🌐',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #083344, #06b6d4, #0284c7)',
    borderAccent: '#06b6d4',
    texture: 'holo_matrix',
    adjustments: { customColor: '', opacity: 90, blur: 0.3, shadowBlur: 32, shadowColor: '#00f0ff', brightness: 135, contrast: 140, saturation: 175 }
  },
  {
    id: '3d_glossy_ceramic',
    name: 'Glazed Porcelain Ceramic 3D',
    category: 'Craft & Texture',
    desc: 'Ultra-smooth fired glossy white porcelain with cobalt blue Ming filigree accents',
    icon: '🏺',
    badge: 'Porcelain',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #ffffff, #e0f2fe, #1d4ed8)',
    borderAccent: '#3b82f6',
    texture: 'ceramic',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#1d4ed8', brightness: 125, contrast: 130, saturation: 130 }
  },
  {
    id: '3d_origami_tessellation',
    name: '3D Dimensional Paper Sculpture',
    category: 'Craft & Texture',
    desc: 'Multi-layer shadowbox paper cutouts with realistic depth casting and crisp shadows',
    icon: '📄',
    badge: 'Paper 3D',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #f1f5f9, #cbd5e1, #64748b)',
    borderAccent: '#94a3b8',
    texture: 'paper_sculpture',
    adjustments: { customColor: '', opacity: 100, blur: 0, shadowBlur: 22, shadowColor: '#475569', brightness: 112, contrast: 125, saturation: 105 }
  },
  {
    id: '3d_neon_glass_capsule',
    name: 'Neon Plasma Glass Capsule 3D',
    category: 'Glass & Water',
    desc: 'Translucent glowing glass vial containing swirling energetic neon plasma core',
    icon: '🧪',
    badge: 'Plasma Capsule',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #030712, #052e16, #22c55e)',
    borderAccent: '#22c55e',
    texture: 'plasma_capsule',
    adjustments: { customColor: '', opacity: 95, blur: 0.2, shadowBlur: 32, shadowColor: '#22c55e', brightness: 130, contrast: 155, saturation: 180 }
  },
  {
    id: '3d_crystal_gemstone',
    name: '3D Royal Ruby Gemstone',
    category: 'Glass & Water',
    desc: 'Deep crimson precious ruby with brilliant-cut geometric specular caustic refractions',
    icon: '♦️',
    badge: 'Ruby Gem',
    isNew: true,
    previewBg: 'linear-gradient(135deg, #450a0a, #dc2626, #f87171)',
    borderAccent: '#ef4444',
    texture: 'ruby_gem',
    adjustments: { customColor: '', opacity: 95, blur: 0, shadowBlur: 30, shadowColor: '#ef4444', brightness: 130, contrast: 150, saturation: 185 }
  }
];

/**
 * Transforms an SVG markup string into one of the specialized visual render modes.
 */
export function transformSvgStyle(svgCode, styleMode, targetLayerIds = null) {
  if (!svgCode) return '';
  if (!styleMode || styleMode === 'original' || styleMode === 'default') {
    return svgCode;
  }

  if (typeof DOMParser === 'undefined') {
    return svgCode;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return svgCode;

    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = doc.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }

    const uniqueId = 'pf_style_' + Math.random().toString(36).substring(2, 7);

    // Build target layer ID filter set if specified
    const targetSet = targetLayerIds && (Array.isArray(targetLayerIds) ? targetLayerIds.length > 0 : Boolean(targetLayerIds))
      ? new Set((Array.isArray(targetLayerIds) ? targetLayerIds : [targetLayerIds]).map(id => String(id).replace(/^pf_studio_/i, '').trim()))
      : null;

    // Collect all direct rendering nodes
    let elements = Array.from(svg.querySelectorAll('*')).filter(el => {
      const tag = el.tagName.toLowerCase();
      return !['svg', 'defs', 'lineargradient', 'radialgradient', 'filter', 'clippath', 'mask', 'pattern', 'metadata', 'desc', 'title', 'stop', 'feblend', 'fecolormatrix', 'fecomponenttransfer', 'fecomposite', 'feconvolvematrix', 'fediffuselighting', 'fedisplacementmap', 'fedropshadow', 'feflood', 'fegaussianblur', 'feimage', 'femerge', 'femergenode', 'femorphology', 'feoffset', 'fespecularlighting', 'fetile', 'feturbulence'].includes(tag);
    });

    // If targeted to specific layer(s), filter down to only matching elements
    if (targetSet && targetSet.size > 0) {
      elements = elements.filter(el => {
        let cur = el;
        while (cur && cur !== svg) {
          const rawId = cur.getAttribute('data-layer-id');
          if (rawId) {
            const cleanId = String(rawId).replace(/^pf_studio_/i, '').trim();
            const numOnly = cleanId.replace(/\D/g, '');
            if (targetSet.has(cleanId) || (numOnly && (targetSet.has(numOnly) || targetSet.has(`layer_${numOnly}`)))) {
              return true;
            }
          }
          cur = cur.parentElement;
        }
        return false;
      });
    }

    if (elements.length === 0) return svgCode;

    const elementSizes = elements.map(el => {
      let score = 50;
      if (el.hasAttribute('d')) {
        score = el.getAttribute('d').length;
      } else if (el.tagName.toLowerCase() === 'rect') {
        score = parseFloat(el.getAttribute('width') || '100') * parseFloat(el.getAttribute('height') || '100');
      } else if (el.tagName.toLowerCase() === 'circle') {
        const r = parseFloat(el.getAttribute('r') || '10');
        score = Math.PI * r * r;
      }
      return { el, score };
    });

    const maxScore = Math.max(...elementSizes.map(e => e.score));

    // -------------------------------------------------------------
    // STYLE: SPLASH WATER & LIQUID ICE
    // -------------------------------------------------------------
    if (styleMode === 'splash_water') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.9"/>
          <stop offset="25%" stop-color="#80deea" stop-opacity="0.75"/>
          <stop offset="60%" stop-color="#00bcd4" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0288d1" stop-opacity="0.95"/>
        </linearGradient>
        <pattern id="${uniqueId}_waterBubbles" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="3.5" fill="none" stroke="#ffffff" stroke-width="0.9" opacity="0.85"/>
          <circle cx="10" cy="8" r="1.2" fill="#ffffff" opacity="0.95"/>
          <circle cx="25" cy="20" r="2.5" fill="none" stroke="#e0f7fa" stroke-width="0.7" opacity="0.8"/>
          <circle cx="26" cy="19" r="0.9" fill="#ffffff" opacity="0.9"/>
          <circle cx="16" cy="27" r="1.8" fill="none" stroke="#ffffff" stroke-width="0.6" opacity="0.7"/>
          <path d="M4,15 Q8,12 12,15 M20,6 Q24,4 28,6" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.6"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_waterGrad)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#00bcd4');
          el.setAttribute('stroke-width', '1.8');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: GLOSSY INFLATABLE FOIL BALLOON
    // -------------------------------------------------------------
    else if (styleMode === 'foil_balloon') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_balloonPuff" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#bfdbfe"/>
          <stop offset="25%" stop-color="#60a5fa"/>
          <stop offset="60%" stop-color="#2563eb"/>
          <stop offset="85%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </radialGradient>
        <linearGradient id="${uniqueId}_balloonTab" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd"/>
          <stop offset="50%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1e3a8a"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }, idx) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_balloonPuff)`);
          el.setAttribute('stroke', '#93c5fd');
          el.setAttribute('stroke-width', '3');
          el.setAttribute('stroke-dasharray', '5 2');
          el.removeAttribute('filter');
        } else if (idx === 0) {
          el.setAttribute('fill', `url(#${uniqueId}_balloonTab)`);
          el.setAttribute('stroke', '#60a5fa');
          el.setAttribute('stroke-width', '2');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#dbeafe');
          el.setAttribute('stroke', '#1e40af');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: FROSTED WINTER ICE CRYSTALS
    // -------------------------------------------------------------
    else if (styleMode === 'frosted_ice') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_frostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="#f0f9ff" stop-opacity="0.85"/>
          <stop offset="70%" stop-color="#bae6fd" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.9"/>
        </linearGradient>
        <pattern id="${uniqueId}_frostCrystals" width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M18,6 L18,30 M6,18 L30,18 M10,10 L26,26 M10,26 L26,10" stroke="#ffffff" stroke-width="1.2" opacity="0.8" stroke-linecap="round"/>
          <path d="M18,10 L14,14 M18,10 L22,14 M18,26 L14,22 M18,26 L22,22 M10,18 L14,14 M10,18 L14,22 M26,18 L22,14 M26,18 L22,22" stroke="#ffffff" stroke-width="0.8" opacity="0.75"/>
          <circle cx="18" cy="18" r="1.5" fill="#ffffff" opacity="0.95"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_frostGrad)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '3');
          el.setAttribute('stroke-dasharray', '1 3');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#7dd3fc');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: MOLTEN MAGMA VOLCANIC LAVA
    // -------------------------------------------------------------
    else if (styleMode === 'molten_lava') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_magmaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1c1917"/>
          <stop offset="35%" stop-color="#292524"/>
          <stop offset="70%" stop-color="#450a0a"/>
          <stop offset="100%" stop-color="#18181b"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_fireGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffea00"/>
          <stop offset="40%" stop-color="#ff4500"/>
          <stop offset="80%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#ffea00"/>
        </linearGradient>
        <pattern id="${uniqueId}_magmaFissures" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,15 L12,12 L20,25 L32,18 L40,28 M12,12 L18,0 M20,25 L25,40 M32,18 L40,8" fill="none" stroke="#ff4500" stroke-width="1.8" opacity="0.9"/>
          <path d="M0,15 L12,12 L20,25 L32,18 L40,28 M12,12 L18,0 M20,25 L25,40" fill="none" stroke="#ffea00" stroke-width="0.9" opacity="0.95"/>
          <circle cx="8" cy="30" r="1.2" fill="#ffea00" opacity="0.9"/>
          <circle cx="35" cy="32" r="1.5" fill="#ff5500" opacity="0.9"/>
          <circle cx="28" cy="6" r="1" fill="#ffea00" opacity="0.95"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_magmaGrad)`);
          el.setAttribute('stroke', '#ff4500');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', `url(#${uniqueId}_fireGlow)`);
          el.setAttribute('stroke', '#ffea00');
          el.setAttribute('stroke-width', '2');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: COZY KNITTED WOOL SWEATER
    // -------------------------------------------------------------
    else if (styleMode === 'knitted_wool') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_woolYarn" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f5efe6"/>
          <stop offset="50%" stop-color="#e3d7c3"/>
          <stop offset="100%" stop-color="#cfbea7"/>
        </linearGradient>
        <pattern id="${uniqueId}_knitRibs" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M3,0 C3,5 11,2 11,7 C11,12 3,9 3,14 M11,0 C11,5 3,2 3,7 C3,12 11,9 11,14" fill="none" stroke="#a38f78" stroke-width="1.2" opacity="0.6"/>
          <path d="M7,0 L7,14" fill="none" stroke="#8c765c" stroke-width="0.8" opacity="0.45"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_woolYarn)`);
          el.setAttribute('stroke', '#a38f78');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#78350f');
          el.setAttribute('stroke', '#5c3a21');
          el.setAttribute('stroke-width', '1.5');
          el.setAttribute('stroke-dasharray', '3 2');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: LEGO TOY BUILDING BLOCKS
    // -------------------------------------------------------------
    else if (styleMode === 'lego_bricks') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_legoYellow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffea00"/>
          <stop offset="100%" stop-color="#e5b800"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_legoBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_legoRed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#b91c1c"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }, idx) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_legoYellow)`);
          el.setAttribute('stroke', '#ca8a04');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else if (idx % 2 === 0) {
          el.setAttribute('fill', `url(#${uniqueId}_legoBlue)`);
          el.setAttribute('stroke', '#1e40af');
          el.setAttribute('stroke-width', '1.8');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', `url(#${uniqueId}_legoRed)`);
          el.setAttribute('stroke', '#991b1b');
          el.setAttribute('stroke-width', '1.8');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: LUXURY CARRARA GOLD MARBLE
    // -------------------------------------------------------------
    else if (styleMode === 'carrara_marble') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_marbleBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#f8fafc"/>
          <stop offset="70%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <pattern id="${uniqueId}_marbleVeins" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0,10 Q20,35 35,20 T60,45 M15,0 Q30,15 25,40 T50,60" fill="none" stroke="#b48a4d" stroke-width="1.2" opacity="0.6"/>
          <path d="M0,10 Q20,35 35,20 T60,45" fill="none" stroke="#94a3b8" stroke-width="0.8" opacity="0.4"/>
          <path d="M35,20 Q45,10 60,15 M25,40 Q10,50 5,60" fill="none" stroke="#d97706" stroke-width="0.7" opacity="0.5"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_marbleBase)`);
          el.setAttribute('stroke', '#cbd5e1');
          el.setAttribute('stroke-width', '2');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#b48a4d');
          el.setAttribute('stroke', '#d97706');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: LUMINESCENT GLASS NEON TUBE
    // -------------------------------------------------------------
    else if (styleMode === 'neon_tube_glass') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_glassTint" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(8, 51, 68, 0.65)"/>
          <stop offset="100%" stop-color="rgba(3, 7, 18, 0.85)"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_glassTint)`);
          el.setAttribute('stroke', '#00f0ff');
          el.setAttribute('stroke-width', '3.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#00f0ff');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: PINK GUMMY BEAR JELLY CANDY
    // -------------------------------------------------------------
    else if (styleMode === 'gummy_bear_jelly') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_gummyJelly" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#fda4af" stop-opacity="0.95"/>
          <stop offset="40%" stop-color="#fb7185" stop-opacity="0.88"/>
          <stop offset="80%" stop-color="#f43f5e" stop-opacity="0.92"/>
          <stop offset="100%" stop-color="#be123c" stop-opacity="0.95"/>
        </radialGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_gummyJelly)`);
          el.setAttribute('stroke', '#ffe4e6');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#ffe4e6');
          el.setAttribute('stroke', '#f43f5e');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE 1: FLAT 2D SILHOUETTE
    // -------------------------------------------------------------
    else if (styleMode === 'silhouette_2d') {
      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', '#000000');
          el.setAttribute('stroke', '#000000');
          el.setAttribute('stroke-width', '1');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#FFFFFF');
          el.setAttribute('stroke', '#FFFFFF');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: FACETED DIAMOND PRISM CRYSTAL
    // -------------------------------------------------------------
    else if (styleMode === 'diamond_crystal') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="20%" stop-color="#e0f2fe"/>
          <stop offset="40%" stop-color="#fbcfe8"/>
          <stop offset="60%" stop-color="#fef08a"/>
          <stop offset="80%" stop-color="#c7d2fe"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <pattern id="${uniqueId}_facets" width="32" height="32" patternUnits="userSpaceOnUse">
          <polygon points="0,0 16,16 0,32" fill="rgba(255,255,255,0.4)" stroke="#ffffff" stroke-width="0.8"/>
          <polygon points="16,16 32,0 32,32" fill="rgba(199,210,254,0.3)" stroke="#ffffff" stroke-width="0.8"/>
          <polygon points="0,0 32,0 16,16" fill="rgba(251,207,232,0.35)" stroke="#ffffff" stroke-width="0.8"/>
          <polygon points="0,32 32,32 16,16" fill="rgba(254,240,138,0.35)" stroke="#ffffff" stroke-width="0.8"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_diamondGrad)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#38bdf8');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: MATTE DARK VELVET LEATHER
    // -------------------------------------------------------------
    else if (styleMode === 'velvet_leather') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_velvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#222226"/>
          <stop offset="40%" stop-color="#18181b"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_velvetTab" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2a2a2f"/>
          <stop offset="100%" stop-color="#141416"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }, idx) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_velvetGrad)`);
          el.setAttribute('stroke', '#333338');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        } else if (idx === 0) {
          el.setAttribute('fill', `url(#${uniqueId}_velvetTab)`);
          el.setAttribute('stroke', '#333338');
          el.setAttribute('stroke-width', '1.2');
          el.removeAttribute('filter');
        } else {
          // Stamped leather engraved indent grooves
          el.setAttribute('fill', '#070709');
          el.setAttribute('stroke', '#1f1f23');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: MOLTEN FLUID MERCURY CHROME
    // -------------------------------------------------------------
    else if (styleMode === 'molten_mercury') {
      defs.innerHTML += `
        <filter id="${uniqueId}_liquidMelt" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="fluid" seed="12"/>
          <feDisplacementMap in="SourceGraphic" in2="fluid" scale="12" xChannelSelector="R" yChannelSelector="G" result="melted"/>
        </filter>
        <linearGradient id="${uniqueId}_mercuryChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#cbd5e1"/>
          <stop offset="48%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#1e293b"/>
          <stop offset="75%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_mercuryChrome)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '3');
          el.setAttribute('filter', `url(#${uniqueId}_liquidMelt)`);
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#334155');
          el.setAttribute('stroke-width', '1.5');
          el.setAttribute('filter', `url(#${uniqueId}_liquidMelt)`);
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: AURORA NEON WIREFRAME MESH
    // -------------------------------------------------------------
    else if (styleMode === 'aurora_wireframe') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_auroraBeam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="25%" stop-color="#22c55e"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="75%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
        <pattern id="${uniqueId}_auroraGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="url(#${uniqueId}_auroraBeam)" stroke-width="0.9" opacity="0.8"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_auroraGrid)`);
          el.setAttribute('stroke', `url(#${uniqueId}_auroraBeam)`);
          el.setAttribute('stroke-width', '3');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', `url(#${uniqueId}_auroraBeam)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CARVED WALNUT WOOD GRAIN
    // -------------------------------------------------------------
    else if (styleMode === 'carved_wood') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#92400e"/>
          <stop offset="20%" stop-color="#78350f"/>
          <stop offset="40%" stop-color="#b45309"/>
          <stop offset="60%" stop-color="#78350f"/>
          <stop offset="80%" stop-color="#92400e"/>
          <stop offset="100%" stop-color="#451a03"/>
        </linearGradient>
        <pattern id="${uniqueId}_woodGrain" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0,5 Q20,2 40,5 M0,12 Q20,15 40,12 M0,18 Q20,16 40,18" fill="none" stroke="#451a03" stroke-width="0.75" opacity="0.45"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_woodGrad)`);
          el.setAttribute('stroke', '#451a03');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          // Carved engraving grooves
          el.setAttribute('fill', '#451a03');
          el.setAttribute('stroke', '#b45309');
          el.setAttribute('stroke-width', '1.2');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: GEOMETRIC ORIGAMI FOLDED PAPER
    // -------------------------------------------------------------
    else if (styleMode === 'origami_paper') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_origamiParchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef3c7"/>
          <stop offset="40%" stop-color="#fde68a"/>
          <stop offset="70%" stop-color="#fcd34d"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_origamiParchment)`);
          el.setAttribute('stroke', '#b45309');
          el.setAttribute('stroke-width', '2');
          el.setAttribute('stroke-linejoin', 'bevel');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', '#fef9c3');
          el.setAttribute('stroke', '#78350f');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: IRIDESCENT SOAP BUBBLE GLASS
    // -------------------------------------------------------------
    else if (styleMode === 'aurora_bubble_glass') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_bubbleSwirl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(244, 114, 182, 0.5)"/>
          <stop offset="30%" stop-color="rgba(251, 191, 36, 0.4)"/>
          <stop offset="60%" stop-color="rgba(56, 189, 248, 0.5)"/>
          <stop offset="85%" stop-color="rgba(168, 85, 247, 0.55)"/>
          <stop offset="100%" stop-color="rgba(244, 114, 182, 0.5)"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_bubbleSwirl)`);
          el.setAttribute('stroke', 'rgba(255, 255, 255, 0.85)');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          el.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
          el.setAttribute('stroke', '#f472b6');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CYBERPUNK PCB CIRCUIT BOARD
    // -------------------------------------------------------------
    else if (styleMode === 'cyber_circuit_pcb') {
      defs.innerHTML += `
        <pattern id="${uniqueId}_pcbPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12 h8 v-8 h8 v16 h8 M12 0 v6 h6 v12" fill="none" stroke="#00f0ff" stroke-width="0.8" opacity="0.65"/>
          <circle cx="8" cy="4" r="1.5" fill="#38bdf8"/>
          <circle cx="16" cy="20" r="1.5" fill="#38bdf8"/>
        </pattern>
        <linearGradient id="${uniqueId}_pcbBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#083344"/>
          <stop offset="100%" stop-color="#021f2d"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_pcbPattern)`);
          el.setAttribute('stroke', '#00f0ff');
          el.setAttribute('stroke-width', '2.5');
          el.removeAttribute('filter');
        } else {
          // Central glowing CPU chip
          el.setAttribute('fill', '#00f0ff');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1.5');
          el.removeAttribute('filter');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: FLUFFY SOFT COTTON CLOUD
    // -------------------------------------------------------------
    else if (styleMode === 'fluffy_cloud') {
      defs.innerHTML += `
        <filter id="${uniqueId}_cloudDisplace" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="cloudTurb" seed="15"/>
          <feDisplacementMap in="SourceGraphic" in2="cloudTurb" scale="18" xChannelSelector="R" yChannelSelector="G" result="fluffyShape"/>
          <feGaussianBlur in="fluffyShape" stdDeviation="2" result="blurPuff"/>
          <feMerge>
            <feMergeNode in="blurPuff"/>
            <feMergeNode in="fluffyShape"/>
          </feMerge>
        </filter>
        <linearGradient id="${uniqueId}_cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_cloudGrad)`);
          el.setAttribute('stroke', '#e2e8f0');
          el.setAttribute('stroke-width', '2');
          el.setAttribute('filter', `url(#${uniqueId}_cloudDisplace)`);
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#94a3b8');
          el.setAttribute('stroke-width', '1.5');
          el.setAttribute('filter', `url(#${uniqueId}_cloudDisplace)`);
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CLAYMORPHISM SOFT PUFFY 3D
    // -------------------------------------------------------------
    else if (styleMode === 'claymorphism_soft') {
      defs.innerHTML += `
        <filter id="${uniqueId}_clayPuffyFilter" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" result="noise" seed="9"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="deformedClay"/>
          <feGaussianBlur in="deformedClay" stdDeviation="2.5" result="blurMap"/>
          <feSpecularLighting in="blurMap" surfaceScale="4" specularConstant="0.6" specularExponent="14" lighting-color="#ffffff" result="spec">
            <feDistantLight azimuth="220" elevation="55"/>
          </feSpecularLighting>
          <feComposite in="spec" in2="deformedClay" operator="in" result="specOnClay"/>
          <feMerge>
            <feMergeNode in="deformedClay"/>
            <feMergeNode in="specOnClay"/>
          </feMerge>
        </filter>
        <linearGradient id="${uniqueId}_clayPuffy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#bfdbfe"/>
          <stop offset="50%" stop-color="#93c5fd"/>
          <stop offset="100%" stop-color="#60a5fa"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_clayInner" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#dbeafe"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_clayPuffy)`);
          el.setAttribute('stroke', '#3b82f6');
          el.setAttribute('stroke-width', '2');
          el.setAttribute('filter', `url(#${uniqueId}_clayPuffyFilter)`);
        } else {
          el.setAttribute('fill', `url(#${uniqueId}_clayInner)`);
          el.setAttribute('stroke', '#60a5fa');
          el.setAttribute('stroke-width', '1.5');
          el.setAttribute('filter', `url(#${uniqueId}_clayPuffyFilter)`);
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: ISOMETRIC 3D EXTRUSION
    // -------------------------------------------------------------
    else if (styleMode === 'isometric_3d') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_isoFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa"/>
          <stop offset="50%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>
        <linearGradient id="${uniqueId}_isoDepth" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e40af"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <filter id="${uniqueId}_isoDrop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-10" dy="16" stdDeviation="6" flood-color="#020617" flood-opacity="0.6"/>
        </filter>
      `;

      const renderNodes = Array.from(svg.childNodes).filter(node => node !== defs);
      const isoGroup = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      isoGroup.setAttribute('transform', 'rotate(-10 192 192) skewX(18) scale(0.88, 0.88) translate(22, -8)');
      isoGroup.setAttribute('filter', `url(#${uniqueId}_isoDrop)`);

      const depthLayer = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      depthLayer.setAttribute('transform', 'translate(-8, 14)');

      const midLayer = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
      midLayer.setAttribute('transform', 'translate(-4, 7)');

      const frontLayer = doc.createElementNS('http://www.w3.org/2000/svg', 'g');

      renderNodes.forEach(node => {
        depthLayer.appendChild(node.cloneNode(true));
        midLayer.appendChild(node.cloneNode(true));
        frontLayer.appendChild(node);
      });

      depthLayer.querySelectorAll('*').forEach(el => {
        el.setAttribute('fill', `url(#${uniqueId}_isoDepth)`);
        el.setAttribute('stroke', '#0f172a');
        el.setAttribute('stroke-width', '2');
      });

      midLayer.querySelectorAll('*').forEach(el => {
        el.setAttribute('fill', '#1e40af');
        el.setAttribute('stroke', '#172554');
        el.setAttribute('stroke-width', '1.5');
      });

      const frontSizes = Array.from(frontLayer.querySelectorAll('*')).map(el => {
        let score = 50;
        if (el.hasAttribute('d')) score = el.getAttribute('d').length;
        else if (el.tagName.toLowerCase() === 'rect') score = parseFloat(el.getAttribute('width') || '100') * parseFloat(el.getAttribute('height') || '100');
        return { el, score };
      });
      const fMaxScore = Math.max(...frontSizes.map(e => e.score));

      frontSizes.forEach(({ el, score }) => {
        const isMainBody = score >= fMaxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_isoFront)`);
          el.setAttribute('stroke', '#93c5fd');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', '#dbeafe');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1.5');
        }
      });

      isoGroup.appendChild(depthLayer);
      isoGroup.appendChild(midLayer);
      isoGroup.appendChild(frontLayer);
      svg.appendChild(isoGroup);
    }

    // -------------------------------------------------------------
    // STYLE: TRANSPARENT GLASSMORPHISM
    // -------------------------------------------------------------
    else if (styleMode === 'glassmorphism') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.45)"/>
          <stop offset="50%" stop-color="rgba(255, 255, 255, 0.18)"/>
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0.28)"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_glassGrad)`);
          el.setAttribute('stroke', 'rgba(255, 255, 255, 0.75)');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
          el.setAttribute('stroke', 'rgba(255, 255, 255, 0.9)');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: NEON GLOWING BLUE
    // -------------------------------------------------------------
    else if (styleMode === 'neon_glow') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_neonBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563eb"/>
          <stop offset="60%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#1e40af"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_neonBlueGrad)`);
          el.setAttribute('stroke', '#00f0ff');
          el.setAttribute('stroke-width', '3');
        } else {
          el.setAttribute('fill', '#00f0ff');
          el.setAttribute('stroke', '#67e8f9');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: 3D GLOSSY INFLATED PLASTIC
    // -------------------------------------------------------------
    else if (styleMode === 'inflated_3d') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_inflatedPillow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa"/>
          <stop offset="25%" stop-color="#3b82f6"/>
          <stop offset="75%" stop-color="#2563eb"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_inflatedPillow)`);
          el.setAttribute('stroke', '#1e40af');
          el.setAttribute('stroke-width', '2.5');
        } else {
          el.setAttribute('fill', '#93c5fd');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CHROME METALLIC MIRROR
    // -------------------------------------------------------------
    else if (styleMode === 'chrome_mirror') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#e2e8f0"/>
          <stop offset="48%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#334155"/>
          <stop offset="53%" stop-color="#1e293b"/>
          <stop offset="75%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#f1f5f9"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_chromeGrad)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#334155');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: HOLOGRAPHIC RAINBOW CHROME
    // -------------------------------------------------------------
    else if (styleMode === 'holographic_rainbow') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="20%" stop-color="#fbbf24"/>
          <stop offset="40%" stop-color="#4ade80"/>
          <stop offset="60%" stop-color="#22d3ee"/>
          <stop offset="80%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_holoGrad)`);
          el.setAttribute('stroke', 'rgba(255, 255, 255, 0.9)');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#fef08a');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CLEAR WATER DROPLETS & ICE
    // -------------------------------------------------------------
    else if (styleMode === 'water_droplets') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(186, 230, 253, 0.6)"/>
          <stop offset="40%" stop-color="rgba(255, 255, 255, 0.3)"/>
          <stop offset="80%" stop-color="rgba(56, 189, 248, 0.4)"/>
          <stop offset="100%" stop-color="rgba(14, 165, 233, 0.5)"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_waterGrad)`);
          el.setAttribute('stroke', 'rgba(255, 255, 255, 0.9)');
          el.setAttribute('stroke-width', '2.5');
        } else {
          el.setAttribute('fill', 'rgba(255, 255, 255, 0.85)');
          el.setAttribute('stroke', '#38bdf8');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: PAPER CUTOUT SHADOW LAYERS
    // -------------------------------------------------------------
    else if (styleMode === 'paper_cutout') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_paperTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd"/>
          <stop offset="100%" stop-color="#60a5fa"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_paperTop)`);
          el.setAttribute('stroke', '#bfdbfe');
          el.setAttribute('stroke-width', '1.5');
        } else {
          el.setAttribute('fill', '#dbeafe');
          el.setAttribute('stroke', '#3b82f6');
          el.setAttribute('stroke-width', '1');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: DUOTONE PINK & BLUE HALFTONE
    // -------------------------------------------------------------
    else if (styleMode === 'duotone_halftone') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_duotone" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="60%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_duotone)`);
          el.setAttribute('stroke', '#1e3a8a');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#1e3a8a');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: PIXEL ART 8-BIT RETRO
    // -------------------------------------------------------------
    else if (styleMode === 'pixel_art') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_pixelBlue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa"/>
          <stop offset="50%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#1d4ed8"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_pixelBlue)`);
          el.setAttribute('stroke', '#0f172a');
          el.setAttribute('stroke-width', '3');
        } else {
          el.setAttribute('fill', '#93c5fd');
          el.setAttribute('stroke', '#0f172a');
          el.setAttribute('stroke-width', '2');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: HAND-DRAWN SKETCH DOODLE
    // -------------------------------------------------------------
    else if (styleMode === 'hand_drawn_sketch') {
      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', 'rgba(255, 255, 255, 0.08)');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2');
          el.setAttribute('stroke-dasharray', '8 2 2 2');
        } else {
          el.setAttribute('fill', 'none');
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2.5');
          el.setAttribute('stroke-linecap', 'round');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: LIQUID CHROME MOLTEN BUBBLE
    // -------------------------------------------------------------
    else if (styleMode === 'liquid_chrome_bubble') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_liquidChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="20%" stop-color="#e2e8f0"/>
          <stop offset="40%" stop-color="#94a3b8"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="60%" stop-color="#334155"/>
          <stop offset="80%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_liquidChrome)`);
          el.setAttribute('stroke', '#ffffff');
          el.setAttribute('stroke-width', '2.5');
        } else {
          el.setAttribute('fill', '#ffffff');
          el.setAttribute('stroke', '#0f172a');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: LUXURY GOLD FOIL MIRROR
    // -------------------------------------------------------------
    else if (styleMode === 'gold_luxury') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="25%" stop-color="#fde047"/>
          <stop offset="48%" stop-color="#f59e0b"/>
          <stop offset="50%" stop-color="#78350f"/>
          <stop offset="75%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#fef08a"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_goldGrad)`);
          el.setAttribute('stroke', '#fef08a');
          el.setAttribute('stroke-width', '2');
        } else {
          el.setAttribute('fill', '#fef9c3');
          el.setAttribute('stroke', '#78350f');
          el.setAttribute('stroke-width', '1.2');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: CYBER WIREFRAME GRID MATRIX
    // -------------------------------------------------------------
    else if (styleMode === 'cyber_wireframe') {
      defs.innerHTML += `
        <pattern id="${uniqueId}_gridPattern" width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#00f0ff" stroke-width="0.8" opacity="0.6"/>
        </pattern>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_gridPattern)`);
          el.setAttribute('stroke', '#00f0ff');
          el.setAttribute('stroke-width', '2.5');
        } else {
          el.setAttribute('fill', '#00f0ff');
          el.setAttribute('stroke', '#38bdf8');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: DARK OBSIDIAN RIM LIGHT
    // -------------------------------------------------------------
    else if (styleMode === 'dark_obsidian') {
      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', '#090d16');
          el.setAttribute('stroke', '#38bdf8');
          el.setAttribute('stroke-width', '2.5');
        } else {
          el.setAttribute('fill', '#38bdf8');
          el.setAttribute('stroke', '#67e8f9');
          el.setAttribute('stroke-width', '1.5');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: GRADIENT COLORFUL VIBRANT
    // -------------------------------------------------------------
    else if (styleMode === 'gradient_vibrant') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_vibrantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9333ea"/>
          <stop offset="35%" stop-color="#ec4899"/>
          <stop offset="70%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#14b8a6"/>
        </linearGradient>
      `;

      elementSizes.forEach(({ el, score }) => {
        const isMainBody = score >= maxScore * 0.45;
        if (isMainBody) {
          el.setAttribute('fill', `url(#${uniqueId}_vibrantGrad)`);
          el.removeAttribute('stroke');
        } else {
          el.setAttribute('fill', '#FFFFFF');
          el.setAttribute('fill-opacity', '0.95');
        }
      });
    }

    // -------------------------------------------------------------
    // STYLE: OUTLINE STROKE MINIMAL LINE ART
    // -------------------------------------------------------------
    else if (styleMode === 'outline_stroke') {
      elements.forEach(el => {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', '#FFFFFF');
        el.setAttribute('stroke-width', '2.5');
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('stroke-linejoin', 'round');
      });
    }

    // -------------------------------------------------------------
    // ANIME: CEL-SHADING SHONEN
    // -------------------------------------------------------------
    else if (styleMode === 'anime_cel_shading') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_animeCel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fb923c"/>
          <stop offset="48%" stop-color="#ea580c"/>
          <stop offset="50%" stop-color="#c2410c"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_animeCel)` : '#fef08a');
        el.setAttribute('stroke', '#09090b');
        el.setAttribute('stroke-width', isMain ? '3.5' : '2');
        el.setAttribute('stroke-linejoin', 'miter');
      });
    }

    // -------------------------------------------------------------
    // ANIME: MECHA ROBOT ARMOR
    // -------------------------------------------------------------
    else if (styleMode === 'anime_mecha_cyber') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_mechaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#1d4ed8"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_mechaGrad)` : '#ef4444');
        el.setAttribute('stroke', '#00f0ff');
        el.setAttribute('stroke-width', '2');
        el.setAttribute('stroke-dasharray', isMain ? 'none' : '4 2');
      });
    }

    // -------------------------------------------------------------
    // ANIME: SPEED LINES & BATTLE FLARE
    // -------------------------------------------------------------
    else if (styleMode === 'anime_speed_lines') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_speedBurst" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#fde047"/>
          <stop offset="70%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </radialGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_speedBurst)`);
        el.setAttribute('stroke', '#fef08a');
        el.setAttribute('stroke-width', '2');
      });
    }

    // -------------------------------------------------------------
    // ANIME: KAWAII PASTEL CHIBI
    // -------------------------------------------------------------
    else if (styleMode === 'anime_chibi_kawaii') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_kawaiiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fce7f3"/>
          <stop offset="40%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#c084fc"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_kawaiiGrad)` : '#ffffff');
        el.setAttribute('stroke', '#ec4899');
        el.setAttribute('stroke-width', '2.5');
      });
    }

    // -------------------------------------------------------------
    // ANIME: NEO-TOKYO CYBER CITY
    // -------------------------------------------------------------
    else if (styleMode === 'anime_cyber_city') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_cyberCity" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_cyberCity)` : '#00f0ff');
        el.setAttribute('stroke', '#e0e7ff');
        el.setAttribute('stroke-width', '2');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: RETRO COMIC POP-ART HALFTONE
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_comic_pop') {
      defs.innerHTML += `
        <pattern id="${uniqueId}_halftone" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3" fill="#ef4444" opacity="0.6"/>
        </pattern>
        <linearGradient id="${uniqueId}_popGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#eab308"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_popGrad)` : '#ef4444');
        el.setAttribute('stroke', '#09090b');
        el.setAttribute('stroke-width', '3.5');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: TOONTOWN SQUISHY 3D CARTOON
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_toontown_3d') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_toontown" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#bae6fd"/>
          <stop offset="40%" stop-color="#38bdf8"/>
          <stop offset="80%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </radialGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_toontown)` : '#fbbf24');
        el.setAttribute('stroke', '#0f172a');
        el.setAttribute('stroke-width', '3');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: 1930s RUBBER HOSE TOON
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_rubber_hose') {
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? '#09090b' : '#f8fafc');
        el.setAttribute('stroke', '#09090b');
        el.setAttribute('stroke-width', '3');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: STREET ART GRAFFITI STICKER
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_graffiti_sticker') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_graffiti" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_graffiti)` : '#ffffff');
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '4.5');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: NOIR GRAPHIC NOVEL INKING
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_superhero_ink') {
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? '#09090b' : '#facc15');
        el.setAttribute('stroke', '#09090b');
        el.setAttribute('stroke-width', '3.5');
      });
    }

    // -------------------------------------------------------------
    // CARTOON: 90s SATURDAY CARTOON ARCADE
    // -------------------------------------------------------------
    else if (styleMode === 'cartoon_arcade_retro') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_arcade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#ec4899"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_arcade)` : '#ffffff');
        el.setAttribute('stroke', '#1e1b4b');
        el.setAttribute('stroke-width', '3');
      });
    }

    // -------------------------------------------------------------
    // 3D: VOXEL MINECRAFT CUBES
    // -------------------------------------------------------------
    else if (styleMode === '3d_voxel_craft') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_voxel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22c55e"/>
          <stop offset="50%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#14532d"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_voxel)` : '#854d0e');
        el.setAttribute('stroke', '#14532d');
        el.setAttribute('stroke-width', '2.5');
      });
    }

    // -------------------------------------------------------------
    // 3D: 24K GOLD PUFFY MYLAR BALLOON
    // -------------------------------------------------------------
    else if (styleMode === '3d_inflatable_gold_balloon') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_goldBalloon" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="30%" stop-color="#facc15"/>
          <stop offset="70%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#713f12"/>
        </radialGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_goldBalloon)`);
        el.setAttribute('stroke', '#fef08a');
        el.setAttribute('stroke-width', '2.5');
        el.setAttribute('stroke-dasharray', '4 2');
      });
    }

    // -------------------------------------------------------------
    // 3D: HYPER-REFLECTIVE LIQUID CHROME
    // -------------------------------------------------------------
    else if (styleMode === '3d_metallic_chrome_foil') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_liquidChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="25%" stop-color="#cbd5e1"/>
          <stop offset="50%" stop-color="#475569"/>
          <stop offset="75%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_liquidChrome)`);
        el.setAttribute('stroke', '#ffffff');
        el.setAttribute('stroke-width', '2');
      });
    }

    // -------------------------------------------------------------
    // 3D: NORDIC WOODEN TOY
    // -------------------------------------------------------------
    else if (styleMode === '3d_wooden_toy') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_woodToy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="50%" stop-color="#d97706"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_woodToy)` : '#fde68a');
        el.setAttribute('stroke', '#451a03');
        el.setAttribute('stroke-width', '2');
      });
    }

    // -------------------------------------------------------------
    // 3D: LASER HOLOGRAM MATRIX
    // -------------------------------------------------------------
    else if (styleMode === '3d_hologram_matrix') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_holoMat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.9"/>
          <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.85"/>
        </linearGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_holoMat)`);
        el.setAttribute('stroke', '#a5f3fc');
        el.setAttribute('stroke-width', '1.5');
      });
    }

    // -------------------------------------------------------------
    // 3D: GLAZED PORCELAIN CERAMIC
    // -------------------------------------------------------------
    else if (styleMode === '3d_glossy_ceramic') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_porcelain" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#f1f5f9"/>
          <stop offset="100%" stop-color="#cbd5e1"/>
        </radialGradient>
      `;
      elements.forEach(({ el, score }) => {
        const isMain = score >= maxScore * 0.4;
        el.setAttribute('fill', isMain ? `url(#${uniqueId}_porcelain)` : '#1d4ed8');
        el.setAttribute('stroke', '#1e40af');
        el.setAttribute('stroke-width', '2');
      });
    }

    // -------------------------------------------------------------
    // 3D: DIMENSIONAL PAPER SCULPTURE
    // -------------------------------------------------------------
    else if (styleMode === '3d_origami_tessellation') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_paper3d" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#e2e8f0"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_paper3d)`);
        el.setAttribute('stroke', '#64748b');
        el.setAttribute('stroke-width', '1.8');
      });
    }

    // -------------------------------------------------------------
    // 3D: NEON PLASMA GLASS CAPSULE
    // -------------------------------------------------------------
    else if (styleMode === '3d_neon_glass_capsule') {
      defs.innerHTML += `
        <linearGradient id="${uniqueId}_plasmaCap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="50%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#052e16"/>
        </linearGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_plasmaCap)`);
        el.setAttribute('stroke', '#86efac');
        el.setAttribute('stroke-width', '2.5');
      });
    }

    // -------------------------------------------------------------
    // 3D: ROYAL RUBY GEMSTONE
    // -------------------------------------------------------------
    else if (styleMode === '3d_crystal_gemstone') {
      defs.innerHTML += `
        <radialGradient id="${uniqueId}_rubyGem" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stop-color="#fca5a5"/>
          <stop offset="35%" stop-color="#ef4444"/>
          <stop offset="75%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </radialGradient>
      `;
      elements.forEach(({ el }) => {
        el.setAttribute('fill', `url(#${uniqueId}_rubyGem)`);
        el.setAttribute('stroke', '#fecaca');
        el.setAttribute('stroke-width', '2');
      });
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc.documentElement);
  } catch (err) {
    console.error('Style transformation error:', err);
    return svgCode;
  }
}
