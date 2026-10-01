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

export function hslToHex(h, s, l) {
  let normH = ((h % 360) + 360) % 360;
  let normS = s > 1 ? s / 100 : s;
  let normL = l > 1 ? l / 100 : l;
  normS = Math.max(0, Math.min(1, normS));
  normL = Math.max(0, Math.min(1, normL));

  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = normL - c / 2;
  let r = 0, g = 0, b = 0;

  if (normH >= 0 && normH < 60) {
    r = c; g = x; b = 0;
  } else if (normH >= 60 && normH < 120) {
    r = x; g = c; b = 0;
  } else if (normH >= 120 && normH < 180) {
    r = 0; g = c; b = x;
  } else if (normH >= 180 && normH < 240) {
    r = 0; g = x; b = c;
  } else if (normH >= 240 && normH < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = val => Math.round((val + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToHsl(hexStr) {
  const norm = normalizeColor(hexStr) || '#38bdf8';
  let r = parseInt(norm.slice(1, 3), 16) / 255;
  let g = parseInt(norm.slice(3, 5), 16) / 255;
  let b = parseInt(norm.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    } else if (max === g) {
      h = ((b - r) / delta + 2) * 60;
    } else {
      h = ((r - g) / delta + 4) * 60;
    }
  }

  return {
    h: Math.round(((h % 360) + 360) % 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
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
 * Strictly inspects visible elements and referenced gradients/patterns to avoid extracting unused colors.
 * Returns an array of objects: [{ color: '#3b82f6', count: 2 }, ...]
 */
export function extractSvgColors(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return [];

  const colorCounts = new Map();

  const addColor = (rawVal) => {
    if (!rawVal) return;
    const normalized = normalizeColor(rawVal);
    if (normalized) {
      colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
    }
  };

  try {
    if (typeof window !== 'undefined' && window.DOMParser) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) return [];

      // 1. Parse <style> tags to map CSS class selectors -> color properties & extract embedded colors
      const cssRulesMap = new Map();
      const styleTags = doc.querySelectorAll('style');
      styleTags.forEach(styleTag => {
        const cssText = styleTag.textContent || '';

        // Extract direct colors from CSS (hex, rgb/rgba, hsl/hsla)
        const hexes = cssText.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
        hexes.forEach(h => addColor(h));
        const rgbs = cssText.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+%?)?\s*\)/gi) || [];
        rgbs.forEach(r => addColor(r));
        const hsls = cssText.match(/hsla?\([^)]+\)/gi) || [];
        hsls.forEach(h => addColor(h));

        const ruleRegex = /([^{]+)\{([^}]+)\}/g;
        let match;
        while ((match = ruleRegex.exec(cssText)) !== null) {
          const selector = match[1].trim();
          const body = match[2].trim();
          const fillM = body.match(/fill\s*:\s*([^;]+)/i);
          const strokeM = body.match(/stroke\s*:\s*([^;]+)/i);
          const colorM = body.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
          const stopM = body.match(/stop-color\s*:\s*([^;]+)/i);
          cssRulesMap.set(selector, {
            fill: fillM ? fillM[1].trim() : null,
            stroke: strokeM ? strokeM[1].trim() : null,
            color: colorM ? colorM[1].trim() : null,
            stopColor: stopM ? stopM[1].trim() : null,
          });
        }
      });

      // 2. Collect referenced URL IDs (e.g. gradients, patterns)
      const referencedUrlIds = new Set();
      const checkUrlRef = (val) => {
        if (!val || typeof val !== 'string') return;
        const m = val.match(/url\(["']?#([^"'\)]+)["']?\)/i);
        if (m) referencedUrlIds.add(m[1]);
      };

      // 3. Find only VISIBLE rendering nodes (ignore non-rendering defs, masks, clipPaths, metadata)
      const visualElements = svgEl.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, line, text, g');

      visualElements.forEach(node => {
        // Skip elements nested inside non-rendering containers
        if (node.closest('defs, clipPath, mask, filter, metadata, style, title, desc')) {
          return;
        }
        const display = node.getAttribute('display') || node.style?.display;
        const visibility = node.getAttribute('visibility') || node.style?.visibility;
        if (display === 'none' || visibility === 'hidden') {
          return;
        }

        // Direct attributes
        const fill = node.getAttribute('fill');
        const stroke = node.getAttribute('stroke');
        const color = node.getAttribute('color');

        if (fill) {
          checkUrlRef(fill);
          addColor(fill);
        }
        if (stroke) {
          checkUrlRef(stroke);
          addColor(stroke);
        }
        if (color) addColor(color);

        // Inline styles
        const style = node.getAttribute('style');
        if (style) {
          const fillM = style.match(/fill\s*:\s*([^;]+)/i);
          if (fillM) {
            checkUrlRef(fillM[1]);
            addColor(fillM[1]);
          }
          const strokeM = style.match(/stroke\s*:\s*([^;]+)/i);
          if (strokeM) {
            checkUrlRef(strokeM[1]);
            addColor(strokeM[1]);
          }
          const colorM = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
          if (colorM) addColor(colorM[1]);
        }

        // CSS Classes applied to this node
        const classAttr = node.getAttribute('class');
        if (classAttr) {
          const classes = classAttr.split(/\s+/);
          classes.forEach(cls => {
            const rule = cssRulesMap.get(`.${cls}`) || cssRulesMap.get(cls);
            if (rule) {
              if (rule.fill) {
                checkUrlRef(rule.fill);
                addColor(rule.fill);
              }
              if (rule.stroke) {
                checkUrlRef(rule.stroke);
                addColor(rule.stroke);
              }
              if (rule.color) addColor(rule.color);
            }
          });
        }
      });

      // 4. Extract stop-colors ONLY from referenced linearGradient/radialGradient elements
      referencedUrlIds.forEach(id => {
        const gradEl = doc.getElementById(id);
        if (gradEl && (gradEl.tagName.toLowerCase().includes('gradient') || gradEl.tagName.toLowerCase() === 'pattern')) {
          const stops = gradEl.querySelectorAll('stop');
          stops.forEach(stop => {
            const stopColor = stop.getAttribute('stop-color') || stop.style?.stopColor;
            if (stopColor) addColor(stopColor);

            // Inline style on stop
            const stopStyle = stop.getAttribute('style');
            if (stopStyle) {
              const stopColorM = stopStyle.match(/stop-color\s*:\s*([^;]+)/i);
              if (stopColorM) addColor(stopColorM[1]);
            }
          });
        }
      });

      // If we found colors using DOMParser, return them
      if (colorCounts.size > 0) {
        return Array.from(colorCounts.entries())
          .map(([color, count]) => ({ color, count }))
          .sort((a, b) => b.count - a.count);
      }
    }
  } catch (err) {
    console.warn('DOMParser failed to extract colors, using fallback:', err);
  }

  // Fallback ONLY if DOMParser couldn't find any (clean regex on direct fill/stroke/stop-color & CSS colors)
  const attrRegex = /(?:fill|stroke|stop-color|color)=["']([^"']+)["']/gi;
  let match;
  while ((match = attrRegex.exec(svgCode)) !== null) {
    addColor(match[1]);
  }

  // Also extract colors from <style> blocks in fallback
  const styleBlocks = svgCode.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleBlocks) {
    styleBlocks.forEach(block => {
      const hexes = block.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
      hexes.forEach(h => addColor(h));
      const rgbs = block.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+%?)?\s*\)/gi) || [];
      rgbs.forEach(r => addColor(r));
      const hsls = block.match(/hsla?\([^)]+\)/gi) || [];
      hsls.forEach(h => addColor(h));
    });
  }

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

  // Find all id="..." in the SVG (strictly match id="...", not data-layer-id="..." or other data-* attrs)
  const idRegex = /(?:^|[\s<])id=["']([^"']+)["']/g;
  const ids = new Set();
  let match;
  while ((match = idRegex.exec(svgCode)) !== null) {
    const val = match[1];
    if (val && !val.startsWith(prefix) && !val.startsWith('layer_') && !val.startsWith('pf_')) {
      ids.add(val);
    }
  }

  if (ids.size === 0) return svgCode;

  let scopedSvg = svgCode;

  ids.forEach(id => {
    const scopedId = `${prefix}${id}`;
    // 1. Replace id definitions: id="xyz" or id='xyz' (strictly preceded by whitespace or <, not -)
    const defRegex = new RegExp(`(^|[\\s<])id=(["'])${escapeRegExp(id)}\\2`, 'g');
    scopedSvg = scopedSvg.replace(defRegex, `$1id=$2${scopedId}$2`);

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
            // Replace in style e.g. fill: #3b82f6 or fill:#3b82f6 or background: #3b82f6
            const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const styleRegex = new RegExp(escapedOrig, 'gi');
            updatedStyle = updatedStyle.replace(styleRegex, repl);
          }
          node.setAttribute('style', updatedStyle);
        }
      });

      // Also replace colors inside <style> tags (CSS rules)
      const styleTags = doc.querySelectorAll('style');
      styleTags.forEach(styleTag => {
        let text = styleTag.textContent || '';
        for (const [orig, repl] of Object.entries(activeReplacements)) {
          const escapedOrig = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedOrig, 'gi');
          text = text.replace(regex, repl);
        }
        styleTag.textContent = text;
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

export function applyUniversalStroke(svgCode, strokeMultiplier, strokeColorMode = 'auto', customStrokeColor = '#38bdf8') {
  if (!svgCode || !strokeMultiplier || strokeMultiplier === 1) return svgCode;

  let res = svgCode;
  const hasStrokes = /stroke="((?!none)[^"]+)"/i.test(res) || /stroke:\s*([^;]+)/i.test(res);

  if (hasStrokes) {
    // 1. Scale existing stroke-width
    res = res.replace(/stroke-width="([0-9.]+)"/gi, (match, val) => {
      return `stroke-width="${(parseFloat(val) * strokeMultiplier).toFixed(2)}"`;
    });
    res = res.replace(/stroke-width:\s*([0-9.]+)(px)?/gi, (match, val) => {
      return `stroke-width:${(parseFloat(val) * strokeMultiplier).toFixed(2)}px`;
    });

    // 2. If elements have stroke but no stroke-width, give them explicit scaled stroke-width
    res = res.replace(/(<(?:path|rect|circle|ellipse|line|polyline|polygon)[^>]*?\sstroke="((?!none)[^"]+)")(?![^>]*\bstroke-width=)([^>]*>)/gi, (match, p1, strokeVal, p2) => {
      return `${p1} stroke-width="${(2 * strokeMultiplier).toFixed(2)}" ${p2}`;
    });
  }

  // 3. For filled icons without strokes (or when strokeMultiplier > 1):
  if (!hasStrokes && strokeMultiplier > 1) {
    const extraWidth = Math.max(0.5, ((strokeMultiplier - 1) * 6)).toFixed(1);
    res = res.replace(/(<(?:path|rect|circle|ellipse|polygon)(?![^>]*\bstroke=)[^>]*?)(\/?>)/gi, (match, p1, p2) => {
      let elStroke = customStrokeColor || '#38bdf8';
      if (strokeColorMode === 'auto') {
        const fillMatch = p1.match(/fill="([^"]+)"/i);
        if (fillMatch && fillMatch[1] !== 'none' && !fillMatch[1].startsWith('url(')) {
          elStroke = fillMatch[1];
        } else {
          elStroke = '#38bdf8';
        }
      } else if (strokeColorMode === 'white') {
        elStroke = '#ffffff';
      } else if (strokeColorMode === 'dark') {
        elStroke = '#0f172a';
      }

      return `${p1} stroke="${elStroke}" stroke-width="${extraWidth}" stroke-linejoin="round" stroke-linecap="round" style="paint-order: stroke fill;" ${p2}`;
    });
  }

  return res;
}
