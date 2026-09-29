// Canva Pro Elements & 3D Typography Suite for Iconderry
// Provides Google Fonts, 3D Text presets, Vector Shapes Library, and Freehand Vector Draw smoothing

export const GOOGLE_FONTS_LIST = [
  { id: 'Outfit', name: 'Outfit', family: "'Outfit', sans-serif", category: 'Modern' },
  { id: 'Bebas Neue', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'Bold Display' },
  { id: 'Orbitron', name: 'Orbitron', family: "'Orbitron', sans-serif", category: 'Sci-Fi / 3D' },
  { id: 'Montserrat', name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Clean Sans' },
  { id: 'Space Grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'Cyber Tech' },
  { id: 'Playfair Display', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Luxury Serif' },
  { id: 'Cinzel', name: 'Cinzel', family: "'Cinzel', serif", category: 'Royal Gold' },
  { id: 'Bangers', name: 'Bangers', family: "'Bangers', cursive", category: 'Comic Pop' },
  { id: 'Pacifico', name: 'Pacifico', family: "'Pacifico', cursive", category: 'Script' },
  { id: 'Permanent Marker', name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'Graffiti' },
  { id: 'Righteous', name: 'Righteous', family: "'Righteous', cursive", category: 'Retro 3D' },
  { id: 'Russo One', name: 'Russo One', family: "'Russo One', sans-serif", category: 'Heavy Block' },
  { id: 'Fredoka', name: 'Fredoka', family: "'Fredoka', sans-serif", category: 'Soft Rounded' },
  { id: 'Inter', name: 'Inter', family: "'Inter', sans-serif", category: 'Standard' }
];

export const TEXT_PRESETS = [
  {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    icon: '⚡',
    font: 'Orbitron',
    fontSize: 42,
    fill: '#38bdf8',
    stroke: '#0284c7',
    strokeWidth: 1.5,
    isBold: true,
    letterSpacing: 4,
    transform: 'uppercase',
    filterMode: 'glow',
    glowColor: '#38bdf8'
  },
  {
    id: 'luxury_gold',
    name: 'Luxury Gold',
    icon: '👑',
    font: 'Cinzel',
    fontSize: 40,
    fill: '#fbbf24',
    stroke: '#d97706',
    strokeWidth: 1,
    isBold: true,
    letterSpacing: 3,
    transform: 'uppercase',
    filterMode: 'gold',
    glowColor: '#f59e0b'
  },
  {
    id: 'comic_pop',
    name: 'Comic Pop',
    icon: '💥',
    font: 'Bangers',
    fontSize: 48,
    fill: '#facc15',
    stroke: '#000000',
    strokeWidth: 3,
    isBold: false,
    letterSpacing: 2,
    transform: 'uppercase',
    filterMode: 'pop',
    glowColor: '#ef4444'
  },
  {
    id: 'retro_synth',
    name: 'Retro Synth',
    icon: '📼',
    font: 'Righteous',
    fontSize: 44,
    fill: '#f43f5e',
    stroke: '#881337',
    strokeWidth: 2,
    isBold: false,
    letterSpacing: 2,
    transform: 'none',
    filterMode: 'synth',
    glowColor: '#e11d48'
  },
  {
    id: 'bold_impact',
    name: 'Bold Header',
    icon: '🔥',
    font: 'Bebas Neue',
    fontSize: 54,
    fill: '#ffffff',
    stroke: '#0f172a',
    strokeWidth: 2,
    isBold: false,
    letterSpacing: 3,
    transform: 'uppercase',
    filterMode: 'none',
    glowColor: '#38bdf8'
  },
  {
    id: 'soft_pill',
    name: 'Soft Candy',
    icon: '🍬',
    font: 'Fredoka',
    fontSize: 38,
    fill: '#a855f7',
    stroke: '#ffffff',
    strokeWidth: 2,
    isBold: true,
    letterSpacing: 1,
    transform: 'none',
    filterMode: 'soft',
    glowColor: '#c084fc'
  }
];

export const SHAPES_PRESETS = [
  {
    id: 'star5',
    name: '5-Point Star',
    category: 'Badges',
    icon: '⭐',
    d: 'M 50 5 L 63 35 L 95 38 L 71 60 L 78 92 L 50 75 L 22 92 L 29 60 L 5 38 L 37 35 Z'
  },
  {
    id: 'star4',
    name: 'Sparkle Star',
    category: 'Badges',
    icon: '✨',
    d: 'M 50 0 Q 50 50 100 50 Q 50 50 50 100 Q 50 50 0 50 Q 50 50 50 0 Z'
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'Symbols',
    icon: '❤️',
    d: 'M 50 88 C 20 60 5 40 5 25 A 22 22 0 0 1 50 18 A 22 22 0 0 1 95 25 C 95 40 80 60 50 88 Z'
  },
  {
    id: 'shield',
    name: 'Security Shield',
    category: 'Badges',
    icon: '🛡️',
    d: 'M 50 5 L 90 20 L 90 55 C 90 75 70 92 50 98 C 30 92 10 75 10 55 L 10 20 Z'
  },
  {
    id: 'lightning',
    name: 'Lightning Bolt',
    category: 'Symbols',
    icon: '⚡',
    d: 'M 55 2 L 15 55 L 45 55 L 35 98 L 85 45 L 55 45 Z'
  },
  {
    id: 'speech_bubble',
    name: 'Speech Bubble',
    category: 'Callouts',
    icon: '💬',
    d: 'M 10 20 C 10 10 20 5 50 5 C 80 5 90 10 90 20 L 90 60 C 90 70 80 75 50 75 L 30 75 L 15 92 L 20 75 C 10 75 10 70 10 60 Z'
  },
  {
    id: 'ribbon_banner',
    name: 'Ribbon Banner',
    category: 'Banners',
    icon: '🎗️',
    d: 'M 5 25 L 20 40 L 5 55 L 30 55 L 30 65 L 50 75 L 70 65 L 70 55 L 95 55 L 80 40 L 95 25 L 70 25 L 70 15 L 50 5 L 30 15 L 30 25 Z'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    category: 'Polygons',
    icon: '⬡',
    d: 'M 50 3 L 95 26 L 95 74 L 50 97 L 5 74 L 5 26 Z'
  },
  {
    id: 'octagon',
    name: 'Octagon',
    category: 'Polygons',
    icon: '🛑',
    d: 'M 30 5 L 70 5 L 95 30 L 95 70 L 70 95 L 30 95 L 5 70 L 5 30 Z'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    category: 'Polygons',
    icon: '💎',
    d: 'M 50 5 L 95 50 L 50 95 L 5 50 Z'
  },
  {
    id: 'arrow_right',
    name: 'Arrow Right',
    category: 'Arrows',
    icon: '➡️',
    d: 'M 5 40 L 60 40 L 60 20 L 95 50 L 60 80 L 60 60 L 5 60 Z'
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'Symbols',
    icon: '☁️',
    d: 'M 25 75 A 18 18 0 0 1 25 40 A 24 24 0 0 1 70 30 A 20 20 0 0 1 85 55 A 15 15 0 0 1 75 75 Z'
  },
  {
    id: 'circle',
    name: 'Circle',
    category: 'Basic',
    icon: '⚪',
    d: 'M 50 5 A 45 45 0 1 1 49.9 5 Z'
  },
  {
    id: 'rounded_rect',
    name: 'Rounded Square',
    category: 'Basic',
    icon: '🔲',
    d: 'M 20 5 L 80 5 A 15 15 0 0 1 95 20 L 95 80 A 15 15 0 0 1 80 95 L 20 95 A 15 15 0 0 1 5 80 L 5 20 A 15 15 0 0 1 20 5 Z'
  },
  {
    id: 'triangle',
    name: 'Triangle',
    category: 'Basic',
    icon: '▲',
    d: 'M 50 8 L 95 88 L 5 88 Z'
  },
  {
    id: 'divider_line',
    name: 'Decorative Bar',
    category: 'Lines',
    icon: '━',
    d: 'M 5 45 L 95 45 L 95 55 L 5 55 Z'
  }
];

/**
 * Catmull-Rom & Quadratic Bezier smoothing for freehand vector strokes.
 * Converts raw pointer coordinates into a sleek, professional vector path.
 */
export function smoothFreehandPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} L ${(p.x + 0.1).toFixed(1)} ${(p.y + 0.1).toFixed(1)}`;
  }
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} ${xc.toFixed(1)} ${yc.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

/**
 * Injects Custom Text, Shapes, and Drawn Strokes into the SVG DOM.
 * Each object receives its own stable data-layer-id so it can be transformed,
 * styled, selected with bounding box, and exported in full 3D and 4K/8K.
 */
export function injectCanvasObjectsIntoSvg(svgCode, customObjects = [], vbWidth = 512, vbHeight = 512) {
  if (!customObjects || customObjects.length === 0) return svgCode;

  const elementsMarkup = customObjects.map(obj => {
    if (!obj || !obj.id) return '';
    const layerId = obj.id;
    const layerName = obj.name || (obj.type === 'text' ? `Text: ${obj.text}` : obj.type === 'shape' ? `Shape: ${obj.shapeName || 'Shape'}` : 'Draw Stroke');

    if (obj.type === 'text') {
      const font = obj.font || 'Outfit';
      const fontSize = obj.fontSize || 36;
      const fill = obj.fill || '#38bdf8';
      const stroke = obj.stroke || 'none';
      const strokeW = obj.strokeWidth || 0;
      const letterSpacing = obj.letterSpacing || 0;
      const fontWeight = obj.isBold ? '800' : (obj.fontWeight || '600');
      const fontStyle = obj.isItalic ? 'italic' : 'normal';
      const textTransform = obj.transform === 'uppercase' ? 'uppercase' : 'none';
      const x = obj.x !== undefined ? obj.x : vbWidth / 2;
      const y = obj.y !== undefined ? obj.y : vbHeight * 0.82;
      const rot = obj.rotation || 0;
      const scale = obj.scale || 1;
      const anchor = obj.align === 'left' ? 'start' : obj.align === 'right' ? 'end' : 'middle';
      const lines = String(obj.text || 'Text').split('\n');

      return `
  <g data-layer-id="${layerId}" data-layer-name="${escapeXml(layerName)}">
    <g transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" style="transform-box: fill-box; transform-origin: center;">
      <text font-family="'${font}', sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" font-style="${fontStyle}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" letter-spacing="${letterSpacing}" text-anchor="${anchor}" text-transform="${textTransform}" dominant-baseline="middle" style="user-select: none;">
        ${lines.map((line, idx) => `<tspan x="0" dy="${idx === 0 ? 0 : fontSize * 1.2}">${escapeXml(line)}</tspan>`).join('')}
      </text>
    </g>
  </g>`;
    }

    if (obj.type === 'shape') {
      const x = obj.x !== undefined ? obj.x : vbWidth / 2 - 40;
      const y = obj.y !== undefined ? obj.y : vbHeight / 2 - 40;
      const size = obj.size || 80;
      const rot = obj.rotation || 0;
      const scale = obj.scale || 1;
      const fill = obj.fill || '#f59e0b';
      const stroke = obj.stroke || '#ffffff';
      const strokeW = obj.strokeWidth !== undefined ? obj.strokeWidth : 2;
      const opacity = obj.opacity !== undefined ? obj.opacity : 1;
      const shapePath = obj.pathData || 'M 50 5 L 95 88 L 5 88 Z';

      // Shape viewbox is normalized to 100x100; scale to desired canvas size
      const shapeScale = (size / 100).toFixed(4);

      return `
  <g data-layer-id="${layerId}" data-layer-name="${escapeXml(layerName)}">
    <g transform="translate(${x}, ${y}) rotate(${rot}) scale(${scale})" opacity="${opacity}" style="transform-box: fill-box; transform-origin: center;">
      <g transform="scale(${shapeScale})">
        <path d="${shapePath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" stroke-linejoin="round" stroke-linecap="round"/>
      </g>
    </g>
  </g>`;
    }

    if (obj.type === 'draw') {
      const stroke = obj.stroke || '#10b981';
      const strokeW = obj.strokeWidth || 4;
      const opacity = obj.opacity !== undefined ? obj.opacity : 1;
      const isNeon = obj.brushType === 'neon';
      const isHighlighter = obj.brushType === 'highlighter';

      const pathFilter = isNeon ? `filter="drop-shadow(0 0 6px ${stroke}) drop-shadow(0 0 12px ${stroke})"` : '';
      const drawOpacity = isHighlighter ? Math.min(0.55, opacity) : opacity;

      return `
  <g data-layer-id="${layerId}" data-layer-name="${layerName}">
    <path d="${obj.pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="${drawOpacity}" ${pathFilter}/>
  </g>`;
    }

    return '';
  }).filter(Boolean).join('\n');

  // Insert before </svg>
  const lastSvgClose = svgCode.lastIndexOf('</svg>');
  if (lastSvgClose !== -1) {
    return svgCode.substring(0, lastSvgClose) + '\n' + elementsMarkup + '\n</svg>';
  }
  return svgCode + '\n' + elementsMarkup;
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
