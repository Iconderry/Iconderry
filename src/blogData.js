// Blog content data for Iconderry articles, guides, and tutorials
export const BLOG_CATEGORIES = ['All', 'Developer Guides', 'Design Trends', 'Studio Tutorials', 'Best Practices'];

export const BLOG_POSTS = [
  {
    id: 'styling-animating-svg-react',
    slug: 'styling-animating-svg-react',
    title: 'How to Style & Animate Multi-Layer SVGs in React & Tailwind CSS',
    excerpt: 'Master advanced SVG manipulation in modern web applications. Learn how to control individual vector layers, inject dynamic gradients, and build silky 60fps animations.',
    category: 'Developer Guides',
    author: {
      name: 'Iconderry Engineering',
      role: 'Core Team',
      avatar: '/app-icon.png'
    },
    publishedAt: 'October 2, 2026',
    readTime: '6 min read',
    tags: ['React', 'TailwindCSS', 'SVG Animation', 'Frontend'],
    coverGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    coverIcon: 'Zap',
    content: `
### Why SVGs Are Essential for Modern Web Interfaces

Scalable Vector Graphics (SVG) are the gold standard for icons, badges, and illustrations on the web. Unlike raster images (PNG, JPEG, WebP), SVGs are written in pure XML geometry. This means:
- **Infinite Scalability**: Zero pixelation whether viewed on an Apple Watch, iPhone Retina screen, or an 8K workstation monitor.
- **Microscopic Payload**: A typical UI icon in SVG is between 500 bytes and 2 KB.
- **Programmable Control**: Every vector path, stroke, and fill can be manipulated dynamically using CSS variables and React state.

---

### Step 1: Importing and Scoping SVG in React

When loading SVGs dynamically in React, you want to avoid ID collisions (for example, when multiple icons define a linear gradient with \`id="gradient-1"\`).

Here is how you can render an inline SVG safely with tailored Tailwind styling:

\`\`\`jsx
import React from 'react';

export function DynamicIcon({ color = '#38bdf8', secondaryColor = '#818cf8', size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 hover:scale-110"
    >
      <defs>
        <linearGradient id="iconGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Outer Glow Halo */}
      <circle cx="12" cy="12" r="9" stroke="url(#iconGlow)" strokeWidth="2" className="opacity-40 animate-pulse" />
      
      {/* Primary Vector Path */}
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="url(#iconGlow)"
        className="transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]"
      />
    </svg>
  );
}
\`\`\`

---

### Step 2: Layer-by-Layer Animation with Tailwind

With Iconderry's multi-layer export, you can target child paths individually:

\`\`\`css
/* Example: Floating foreground with pulsing backdrop */
@keyframes floatLayer {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
}

.svg-layer-badge {
  transform-origin: center;
  animation: floatLayer 3.5s ease-in-out infinite;
}
\`\`\`

> **Pro Tip**: Use \`transform-box: fill-box\` and \`transform-origin: center\` on SVG elements so CSS transformations rotate around the center of the individual shape rather than the top-left of the entire SVG canvas!

---

### Step 3: Best Practices for Production
1. **Always set \`preserveAspectRatio="xMidYMid meet"\`** to ensure your responsive containers don't stretch non-square artwork.
2. **Minify with SVGO** before production bundling to strip unnecessary editor metadata.
3. **Use Iconderry Studio** to adjust colors, 3D tilts, and multi-layer drop shadows with zero manual coding.
    `
  },
  {
    id: 'vector-icon-trends-2026',
    slug: 'vector-icon-trends-2026',
    title: 'Vector Icon Trends 2026: 3D Depth, Neon Glows & Micro-Interactions',
    excerpt: 'Explore the major visual trends shaping digital product design this year. From volumetric lighting and frosted glass badges to animated micro-gestures.',
    category: 'Design Trends',
    author: {
      name: 'Design Curators',
      role: 'Visual Systems',
      avatar: '/app-icon.png'
    },
    publishedAt: 'September 28, 2026',
    readTime: '5 min read',
    tags: ['UI/UX', '3D Design', 'Glassmorphism', 'Trends'],
    coverGradient: 'from-pink-500 via-rose-500 to-amber-500',
    coverIcon: 'Sparkles',
    content: `
### The Evolution of Digital Iconography

Icon design has transitioned through several distinct visual eras over the last two decades:
1. **Skeuomorphism (2007–2012)**: Heavy leather textures, realistic gloss, bevels, and physical metaphors.
2. **Ultra-Flat Minimalism (2013–2019)**: Extreme simplification, single-color line weights, and zero shadow.
3. **Neumorphism & Glassmorphism (2020–2024)**: Frosted blur filters, soft double-shadows, and semi-transparent cards.
4. **Volumetric 3D & Spatial Vectors (2025–2026+)**: The modern synthesis—clean vector geometry enhanced by isometric perspective, directional ambient lighting, and interactive physics.

---

### 1. Spatial 3D Perspective & Volumetric Layers
Flat 2D icons are being upgraded with dynamic isometric perspective. Instead of static flat stamps, modern SaaS hero sections and feature grids utilize icons that feel like tangible physical objects suspended in space.

Key characteristics:
- **Z-Axis Extrusion**: Shapes possess perceptible thickness and side edge bevels.
- **Multi-Planar Parallax**: Foreground symbols float 12px to 24px above background shields or badges.
- **Directional Highlights**: Top-left ambient illumination paired with subtle rim lights on the edges.

---

### 2. Neon Matrix & Cyber Radiance
High-contrast dark modes have become the preferred aesthetic for AI tools, developer platforms, and fintech dashboards. To stand out against deep slate and jet black canvas backgrounds, designers are adopting:
- **Luminescent Core Gradients**: Gradients transitioning from cyan (\`#06b6d4\`) to electric violet (\`#8b5cf6\`).
- **Glow Halos (\`feGaussianBlur\`)**: Soft SVG filter blurs that generate an ethereal neon radiance without degrading vector crispness.

---

### 3. Micro-Interactive Living Icons
Static assets are increasingly perceived as lifeless. In 2026, user engagement relies on subtle micro-animations:
- **Breathing / Levitation**: Gentle vertical harmonic oscillations (1.5s to 3s cycle).
- **Hover Snap Tilts**: Cursor hover triggering realistic 3D trackball tilts based on mouse position.
- **Success Pop Explosions**: Badges that expand with a bouncy spring curve upon user validation.

> **Design Insight**: In Iconderry Studio, you can preview all 14 living motion presets (Floating, Bouncing, 3D Tilt, Orbit, Wave) and export directly as clean SVG, WebP, or GIF animations.
    `
  },
  {
    id: 'svg-vs-png-web-performance',
    slug: 'svg-vs-png-web-performance',
    title: 'SVG vs PNG: Why Vector Graphics Win for Web Performance & Core Web Vitals',
    excerpt: 'Detailed benchmark comparison of vector vs raster formats. How switching to optimized SVGs improves your Largest Contentful Paint (LCP) and saves bandwidth.',
    category: 'Best Practices',
    author: {
      name: 'Iconderry Engineering',
      role: 'Performance Lab',
      avatar: '/app-icon.png'
    },
    publishedAt: 'September 22, 2026',
    readTime: '4 min read',
    tags: ['Web Performance', 'Core Web Vitals', 'SVG', 'SEO'],
    coverGradient: 'from-emerald-500 via-teal-600 to-cyan-700',
    coverIcon: 'Activity',
    content: `
### The True Cost of Raster Icons on the Web

When developers build user interfaces, choosing between raster formats (PNG, WebP) and vector formats (SVG) directly impacts page load speed, memory footprint, and Google Core Web Vitals scores.

Let's look at the real-world benchmarks:

| Metric | High-Res PNG (Retina 3x) | Optimized SVG |
|---|---|---|
| **File Size (Single Icon)** | 24 KB – 85 KB | 0.8 KB – 2.4 KB |
| **HTTP Request Count** | 1 per icon (unless sprited) | 0 (Inline) or 1 (Cached) |
| **LCP (Largest Contentful Paint)** | Slower (network decode) | Instant (parsed with DOM) |
| **Memory Usage on GPU** | High (uncompressed raster bitmap) | Minimal (vector mathematics) |
| **Dark Mode Adaptation** | Requires 2 separate image assets | 1 line of CSS (\`fill: currentColor\`) |

---

### Why SVG Inlining Boosts Core Web Vitals

1. **Zero Layout Shifts (CLS = 0)**:
   Because SVGs define explicit \`viewBox\` coordinate ratios, the browser layout engine calculates exact dimensions before child elements load, completely eliminating Cumulative Layout Shifts.
2. **Eliminating the Network Roundtrip**:
   By embedding critical UI icons directly in HTML or React JSX, your interface paints on the very first render frame without waiting for external asset downloads.
3. **Sharper Rendering on Mobile**:
   Modern smartphones feature 3x and 4x device pixel ratios. Raster PNGs look blurry unless served in massive sizes, whereas SVGs remain mathematically crisp on any hardware.

---

### When Should You Still Use PNG or WebP?
Raster formats remain the best choice only for:
- Complex photographic imagery with millions of continuous color variations.
- Pre-rendered 3D ray-traced scenes with photorealistic glass refractions that cannot be mapped to vector paths.

For all buttons, badges, brand logos, navigational symbols, and UI status indicators, **SVG is unequivocally superior**.
    `
  },
  {
    id: 'crafting-pro-badges-iconderry',
    slug: 'crafting-pro-badges-iconderry',
    title: 'Creating Production-Grade App Badges with 3D Depth in Iconderry Studio',
    excerpt: 'Step-by-step masterclass on transforming any flat icon into a multi-layered, glowing app badge ready for iOS, Android, and web SaaS dashboards.',
    category: 'Studio Tutorials',
    author: {
      name: 'Iconderry Team',
      role: 'Tutorial Lead',
      avatar: '/app-icon.png'
    },
    publishedAt: 'September 15, 2026',
    readTime: '5 min read',
    tags: ['Iconderry Studio', 'App Badges', 'Tutorial', 'Vector Art'],
    coverGradient: 'from-amber-500 via-orange-600 to-red-600',
    coverIcon: 'Layers',
    content: `
### What Makes a Badge Look "Premium"?

Top applications like Linear, Stripe, Raycast, and Apple Fitness don't use flat single-tone icons for their achievement and verification badges. Instead, they combine four visual layers:
1. **Background Shield or Tile**: Geometric foundation (hexagonal, circular, or squircle).
2. **Depth Shadow & Ambient Glow**: High-radius diffusion separating the emblem from dark canvas surfaces.
3. **Primary Silhouette Symbol**: High-contrast icon positioned in the center.
4. **Specular Edge Highlight**: Subtle top-lit stroke accentuating the curvature.

---

### Step-by-Step Workflow in Iconderry Studio

#### Step 1: Pick or Upload Your Base Symbol
Browse the **Iconderry Gallery** and pick an icon (e.g. *Verified Shield*, *Diamond*, or *Crown*) or drag your own SVG directly into the canvas.

#### Step 2: Customize Multi-Layer Palette
Click on individual paths directly on the canvas to inspect layer colors:
- Select the outer shield layer and apply a deep gradient like **Sunset Flare** or **Neon Emerald**.
- Select the foreground symbol and apply pure white (\`#ffffff\`) with a 0.5px subtle outline.

#### Step 3: Inject Volumetric 3D Tilt
Switch to the **Transform & 3D** sidebar tab:
- Drag the **3D Trackball** to add a subtle 15° isometric rotation.
- Increase **Z-Depth Extrusion** to give the badge a physical 3D side rim.
- Enable **3D Floating Motion** to preview how the badge breathes in living UI environments.

#### Step 4: One-Click 8K Multi-Format Export
When your design is finalized:
- Click **Export Badge**.
- Choose your target format:
  - **SVG**: For interactive web applications.
  - **PNG @ 4x (1024px or 4096px)**: For iOS / Android app store assets and marketing pitch decks.
  - **Transparent WebP**: For ultra-compact modern web performance.
    `
  }
];
