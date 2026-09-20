// SVG Color Extraction and Replacement Utility for Iconderry

const NAMED_COLORS = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  gray: '#808080',
  grey: '#808080',
  orange: '#ffa500',
  purple: '#800080',
  pink: '#ffc0cb',
  gold: '#ffd700',
  silver: '#c0c0c0',
  navy: '#000080',
  teal: '#008080',
  lime: '#00ff00',
  maroon: '#800000',
  olive: '#808000',
  aqua: '#00ffff',
  fuchsia: '#ff00ff'
};

/**
 * Normalizes any color representation into a standard 6-digit lowercase hex code (#rrggbb).
 * Returns null if the color is invalid, "none", "transparent", or a "url(...)".
 */
export function normalizeColor(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') return null;

  const trimmed = colorStr.trim().toLowerCase();

  if (
    trimmed === 'none' ||
    trimmed === 'transparent' ||
    trimmed === 'currentcolor' ||
    trimmed === 'inherit' ||
    trimmed.startsWith('url(')
  ) {
    return null;
  }

  // Check named colors
  if (NAMED_COLORS[trimmed]) {
    return NAMED_COLORS[trimmed];
  }

  // Check Hex format
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return '#' + hex.split('').map(c => c + c).join('');
    }
    if (hex.length === 6) {
      return '#' + hex;
    }
    if (hex.length === 8) {
      return '#' + hex.slice(0, 6); // discard alpha for color picker standard
    }
    if (hex.length === 4) {
      return '#' + hex.slice(0, 3).split('').map(c => c + c).join('');
    }
  }

  // Check rgb/rgba format: rgb(59, 130, 246) or rgba(59, 130, 246, 0.5)
  const rgbMatch = trimmed.match(/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgbMatch) {
    const r = Math.min(255, parseInt(rgbMatch[1], 10)).toString(16).padStart(2, '0');
    const g = Math.min(255, parseInt(rgbMatch[2], 10)).toString(16).padStart(2, '0');
    const b = Math.min(255, parseInt(rgbMatch[3], 10)).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  // Check hsl format: hsl(210, 100%, 50%)
  const hslMatch = trimmed.match(/^hsla?\((\d+)[,\s]+(\d+)%?[,\s]+(\d+)%/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10) / 360;
    const s = parseInt(hslMatch[2], 10) / 100;
    const l = parseInt(hslMatch[3], 10) / 100;
    return hslToHex(h, s, l);
  }

  return null;
}

export function adjustColorBrightness(hex, percent) {
  const norm = normalizeColor(hex);
  if (!norm) return hex;
  const num = parseInt(norm.slice(1), 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Finds all gradient stop colors that share the same gradient definition as the targetColor.
 */
export function getLinkedGradientColors(svgCode, targetColor) {
  if (!svgCode || !targetColor || typeof window === 'undefined' || !window.DOMParser) return [];
  const targetNorm = normalizeColor(targetColor)?.toLowerCase();
  if (!targetNorm) return [];

  const linked = new Set();

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const gradients = doc.querySelectorAll('linearGradient, radialGradient');

    gradients.forEach((grad) => {
      const stops = grad.querySelectorAll('stop');
      const stopColors = [];
      let containsTarget = false;

      stops.forEach((stop) => {
        const sc = stop.getAttribute('stop-color') || stop.style.stopColor;
        const norm = normalizeColor(sc);
        if (norm) {
          stopColors.push(norm.toLowerCase());
          if (norm.toLowerCase() === targetNorm) {
            containsTarget = true;
          }
        }
      });

      if (containsTarget) {
        stopColors.forEach(c => linked.add(c));
      }
    });
  } catch (err) {
    console.warn('getLinkedGradientColors failed:', err);
  }

  return Array.from(linked);
}

/**
 * Extracts all unique colors present in the SVG (from fill, stroke, stop-color, inline styles, etc.)
 * Returns an array of objects: [{ color: '#3b82f6', count: 2 }, ...]
 */
export function extractSvgColors(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return [];

  const colorCounts = new Map();

  const addColor = (rawVal) => {
    const normalized = normalizeColor(rawVal);
    if (normalized) {
      colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
    }
  };

  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const allNodes = doc.querySelectorAll('*');

      allNodes.forEach((node) => {
        // Direct Attributes
        ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color'].forEach((attr) => {
          const val = node.getAttribute(attr);
          if (val) addColor(val);
        });

        // Inline Style Attributes
        const style = node.getAttribute('style');
        if (style) {
          const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
          if (fillMatch) addColor(fillMatch[1]);

          const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i);
          if (strokeMatch) addColor(strokeMatch[1]);

          const stopColorMatch = style.match(/stop-color\s*:\s*([^;]+)/i);
          if (stopColorMatch) addColor(stopColorMatch[1]);

          const colorMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
          if (colorMatch) addColor(colorMatch[1]);
        }
      });
    }
  } catch (err) {
    console.warn('DOMParser failed to extract colors, using regex fallback:', err);
  }

  // Regex fallback / supplement for hex & rgb colors inside SVG markup
  const hexMatches = svgCode.match(/#([0-9a-fA-F]{3,8})\b/g) || [];
  hexMatches.forEach(hex => addColor(hex));

  const rgbMatches = svgCode.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+\s*)?\)/gi) || [];
  rgbMatches.forEach(rgb => addColor(rgb));

  // Convert to sorted array
  return Array.from(colorCounts.entries())
    .map(([color, count]) => ({ color, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Scopes all ID definitions and URL references inside an SVG string to prevent DOM ID collisions.
 */
export function scopeSvgIds(svgCode, prefix = 'pf_studio_') {
  if (!svgCode || typeof svgCode !== 'string') return svgCode;

  // Find all id="..." in the SVG
  const idRegex = /\bid=["']([^"']+)["']/g;
  const ids = new Set();
  let match;
  while ((match = idRegex.exec(svgCode)) !== null) {
    if (match[1] && !match[1].startsWith(prefix)) {
      ids.add(match[1]);
    }
  }

  if (ids.size === 0) return svgCode;

  let scopedSvg = svgCode;

  ids.forEach(id => {
    const scopedId = `${prefix}${id}`;
    // 1. Replace id definitions: id="xyz" or id='xyz'
    const defRegex = new RegExp(`\\bid=(["'])${escapeRegExp(id)}\\1`, 'g');
    scopedSvg = scopedSvg.replace(defRegex, `id=$1${scopedId}$1`);

    // 2. Replace url(#xyz) references (with optional quotes inside url)
    const urlRegex = new RegExp(`url\\(\\s*(["']?)#${escapeRegExp(id)}\\1\\s*\\)`, 'g');
    scopedSvg = scopedSvg.replace(urlRegex, `url($1#${scopedId}$1)`);

    // 3. Replace href="#xyz" and xlink:href="#xyz"
    const hrefRegex = new RegExp(`(\\b(?:xlink:)?href=)(["'])#${escapeRegExp(id)}\\2`, 'g');
    scopedSvg = scopedSvg.replace(hrefRegex, `$1$2#${scopedId}$2`);
  });

  return scopedSvg;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replaces colors in an SVG string based on a mapping object { [originalHex]: newHex }
 */
export function replaceSvgColors(svgCode, colorReplacements) {
  if (!svgCode || !colorReplacements || Object.keys(colorReplacements).length === 0) {
    return svgCode;
  }

  // Filter out identical replacements
  const activeReplacements = {};
  for (const [orig, repl] of Object.entries(colorReplacements)) {
    const origNorm = normalizeColor(orig);
    const replNorm = normalizeColor(repl);
    if (origNorm && replNorm && origNorm.toLowerCase() !== replNorm.toLowerCase()) {
      activeReplacements[origNorm.toLowerCase()] = replNorm.toLowerCase();
    }
  }

  if (Object.keys(activeReplacements).length === 0) {
    return svgCode;
  }

  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const allNodes = doc.querySelectorAll('*');

      allNodes.forEach((node) => {
        // Direct Attributes
        ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color'].forEach((attr) => {
          const val = node.getAttribute(attr);
          if (val) {
            const norm = normalizeColor(val);
            if (norm && activeReplacements[norm.toLowerCase()]) {
              node.setAttribute(attr, activeReplacements[norm.toLowerCase()]);
            }
          }
        });

        // Inline Style Attributes
        const style = node.getAttribute('style');
        if (style) {
          let updatedStyle = style;
          for (const [orig, repl] of Object.entries(activeReplacements)) {
            // Replace in style e.g. fill: #3b82f6 or fill:#3b82f6
            const styleRegex = new RegExp(`(fill|stroke|stop-color|flood-color|color)\\s*:\\s*(${orig.replace('#', '#?')})`, 'gi');
            updatedStyle = updatedStyle.replace(styleRegex, `$1: ${repl}`);
          }
          node.setAttribute('style', updatedStyle);
        }
      });

      const serializer = new XMLSerializer();
      let serialized = serializer.serializeToString(doc);

      // DOMParser serialization sometimes omits xmlns or creates wrapping issues
      if (!serialized.includes('xmlns=') && svgCode.includes('xmlns=')) {
        serialized = serialized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      return serialized;
    }
  } catch (err) {
    console.warn('DOMParser color replacement failed, falling back to regex:', err);
  }

  // Pure regex string replacement fallback
  let result = svgCode;
  for (const [orig, repl] of Object.entries(activeReplacements)) {
    const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(["':])\\s*${escapedOrig}\\b`, 'gi');
    result = result.replace(regex, `$1${repl}`);
  }

  return result;
}

