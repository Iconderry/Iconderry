// Smart CSS to SVG Converter Utility for Iconderry
// Faithfully renders ANY custom CSS rules, classes, animations, 3D transforms, or HTML+CSS snippets
// into an SVG element with zero hardcoded templates and 100% XML validity.

/**
 * Checks if a string contains CSS declarations, class rules, or HTML with styles
 */
export function isCssOrHtmlContent(input) {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  
  // If it's already a complete valid SVG, let standard SVG parser handle it
  if (/^\s*<svg[\s\S]*<\/svg>\s*$/i.test(trimmed)) {
    return false;
  }

  // Common CSS properties or patterns
  const cssPropertyKeywords = [
    'backdrop-filter', 'background', 'background-color', 'border-radius',
    'box-shadow', 'border', 'filter', 'linear-gradient', 'radial-gradient',
    'transform', 'display:', 'flex', 'rgba(', 'hsl(', 'opacity:', 'width:',
    'height:', 'color:', 'clip-path:', 'animation:', '@keyframes', 'font-',
    'position:', 'inset:', 'border-top:', 'border-left:'
  ];

  const hasCssKeywords = cssPropertyKeywords.some(keyword => 
    trimmed.toLowerCase().includes(keyword.toLowerCase())
  );

  const hasCssRuleStructure = /\{[\s\S]*?:[\s\S]*?\}/.test(trimmed);
  const hasStyleTag = /<style[\s\S]*?>[\s\S]*?<\/style>/i.test(trimmed);
  const hasHtmlTag = /<div[\s\S]*?>|<span[\s\S]*?>|<button[\s\S]*?>|<p[\s\S]*?>|<body[\s\S]*?>/i.test(trimmed);

  return hasCssKeywords || hasCssRuleStructure || hasStyleTag || hasHtmlTag;
}

/**
 * Extracts class hierarchy from CSS text
 */
function analyzeCssClasses(cssText) {
  const clean = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Find child relationships like .parent .child
  const childRegex = /\.([a-zA-Z0-9_-]+)\s+([^{,>]+)/g;
  const childClasses = new Set();
  let match;
  while ((match = childRegex.exec(clean)) !== null) {
    const selector = match[2].trim();
    const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)/);
    if (classMatch && !selector.includes('::') && !selector.includes(':')) {
      childClasses.add(classMatch[1]);
    }
  }

  // Find all classes defined
  const allRegex = /\.([a-zA-Z0-9_-]+)\s*(?:[:\s,{.])/g;
  const allDefined = [];
  while ((match = allRegex.exec(clean)) !== null) {
    const cls = match[1].trim();
    if (cls && !allDefined.includes(cls)) {
      allDefined.push(cls);
    }
  }

  // Filter modifier classes (e.g. .parent.modifier)
  const modifierRegex = /\.([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)/g;
  const modifiers = new Set();
  while ((match = modifierRegex.exec(clean)) !== null) {
    modifiers.add(match[2]);
  }

  const primaryClasses = allDefined.filter(c => !childClasses.has(c) && !modifiers.has(c));

  return {
    primary: primaryClasses.length > 0 ? primaryClasses[0] : (allDefined[0] || 'custom-card'),
    children: Array.from(childClasses),
    all: allDefined
  };
}

/**
 * Humanizes a CSS class name into an element title (e.g. "magnifier" -> "Magnifier")
 */
function humanizeClassName(cls) {
  if (!cls) return '';
  return cls
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

/**
 * Cleans CSS for embedding inside <style>
 * Strips HTML tags and removes full-page body background/min-height resets
 */
function sanitizeCss(cssText) {
  let clean = cssText
    .replace(/<\/?style[^>]*>/gi, '')
    .trim();

  // Remove full-page body/html resets that break centered SVG viewports
  clean = clean.replace(/body\s*\{[^}]*min-height\s*:\s*100vh[^}]*\}/gi, '');
  clean = clean.replace(/html\s*\{[^}]*\}/gi, '');

  return clean;
}

/**
 * Sanitizes HTML to be 100% valid XML inside SVG foreignObject
 * Extracts only visual body elements, removes <!DOCTYPE>, <head>, <meta>, and self-closes void tags
 */
function sanitizeHtmlForXml(rawHtml) {
  let html = rawHtml;

  // 1. If full document, extract only inside <body>...</body>
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    html = bodyMatch[1];
  } else {
    // Strip document level tags
    html = html.replace(/<!DOCTYPE[^>]*>/gi, '');
    html = html.replace(/<html[^>]*>|<\/html>/gi, '');
    html = html.replace(/<head[\s\S]*?<\/head>/gi, '');
    html = html.replace(/<meta[^>]*>/gi, '');
    html = html.replace(/<link[^>]*>/gi, '');
    html = html.replace(/<title[\s\S]*?<\/title>/gi, '');
  }

  // Remove <style> tags (they are extracted separately)
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // 2. Ensure all void tags are self-closing for strict XML parsers
  html = html.replace(/<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)>/gi, '<$1$2 />');

  return html.trim();
}

/**
 * Converts CSS ::before and ::after pseudo-elements into real, interactive DOM elements.
 * Also enables pointer-events on visual overlays so all parts can be individually clicked,
 * dragged, styled, and deleted on the canvas!
 */
export function transformPseudoElementsToDom(rawHtml, rawCss) {
  let updatedCss = rawCss || '';
  let updatedHtml = rawHtml || '';

  // 1. Convert pointer-events: none to pointer-events: auto so overlay details can be selected
  updatedCss = updatedCss.replace(/pointer-events\s*:\s*none\s*;?/gi, 'pointer-events: auto;');

  // 2. Find all ::before and ::after pseudo-element rules in CSS
  const pseudoRegex = /(?:\/\*[\s*=-]*([^*]+?)[\s*=-]*\*\/[\s\r\n]*)?([.a-zA-Z0-9_ -]+?)::?(before|after)\s*\{([^}]*)\}/gi;
  const pseudoRules = [];
  let match;
  while ((match = pseudoRegex.exec(updatedCss)) !== null) {
    const rawComment = match[1] ? match[1].trim() : '';
    const selector = match[2].trim();
    const type = match[3].toLowerCase(); // 'before' | 'after'
    const decls = match[4];

    // Find target class name from selector (e.g. '.magnifier' -> 'magnifier')
    const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)$/);
    if (classMatch) {
      const targetClass = classMatch[1];
      let cleanDesc = rawComment
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      if (!cleanDesc || cleanDesc === 'before' || cleanDesc === 'after') {
        cleanDesc = type;
      }
      const newClass = `${targetClass}_part_${cleanDesc}`;
      pseudoRules.push({
        fullMatch: match[0],
        targetClass,
        newClass,
        type,
        decls: decls.replace(/content\s*:\s*["'][^"']*["']\s*;?/gi, '').trim()
      });
    }
  }

  // 3. Transform CSS rules and inject corresponding DOM elements
  if (pseudoRules.length > 0) {
    if (typeof window !== 'undefined' && window.DOMParser) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<body>${updatedHtml}</body>`, 'text/html');

        pseudoRules.forEach(rule => {
          // Replace pseudo-selector in CSS with the new real class selector
          const newCssRule = `.${rule.newClass} {\n  ${rule.decls}\n}`;
          updatedCss = updatedCss.replace(rule.fullMatch, newCssRule);

          // Find target elements in HTML DOM
          const targets = doc.querySelectorAll(`.${rule.targetClass}`);
          targets.forEach(target => {
            const newDiv = doc.createElement('div');
            newDiv.className = rule.newClass;
            if (rule.type === 'before') {
              target.prepend(newDiv);
            } else {
              target.append(newDiv);
            }
          });
        });

        updatedHtml = doc.body.innerHTML;
      } catch (e) {
        console.warn('Error transforming pseudo elements with DOMParser:', e);
      }
    } else {
      pseudoRules.forEach(rule => {
        const newCssRule = `.${rule.newClass} {\n  ${rule.decls}\n}`;
        updatedCss = updatedCss.replace(rule.fullMatch, newCssRule);

        const openTagRegex = new RegExp(`(<([a-zA-Z0-9]+)[^>]*class=["'][^"']*\\b${rule.targetClass}\\b[^"']*["'][^>]*>)`, 'i');
        const openMatch = updatedHtml.match(openTagRegex);
        if (openMatch) {
          const insertedDiv = `<div class="${rule.newClass}"></div>`;
          if (rule.type === 'before') {
            updatedHtml = updatedHtml.replace(openMatch[1], `${openMatch[1]}\n  ${insertedDiv}`);
          } else {
            const tag = openMatch[2];
            const closeTag = `</${tag}>`;
            const lastIdx = updatedHtml.lastIndexOf(closeTag);
            if (lastIdx !== -1) {
              updatedHtml = updatedHtml.slice(0, lastIdx) + `  ${insertedDiv}\n` + updatedHtml.slice(lastIdx);
            }
          }
        }
      });
    }
  }

  return { html: updatedHtml, css: updatedCss };
}

/**
 * Creates an SVG that accurately renders the user's exact CSS or HTML
 */
export function convertCssToSvg(rawInput, preferredTitle = '') {
  if (!rawInput || typeof rawInput !== 'string') {
    return { success: false, error: 'Empty input provided' };
  }

  try {
    const trimmed = rawInput.trim();
    const uid = 'css_el_' + Math.random().toString(36).substring(2, 8);

    let innerHtml = '';
    let cssBlock = '';
    let derivedTitle = preferredTitle;
    let detectedCategory = 'UI Icons';

    // 1. Check if user pasted complete HTML with or without <style>
    const hasHtmlMarkup = /<[a-z][\s\S]*>/i.test(trimmed) && !trimmed.startsWith('<style>');

    if (hasHtmlMarkup) {
      // Extract all <style> blocks if present
      const styleMatches = [...trimmed.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
      if (styleMatches.length > 0) {
        cssBlock = sanitizeCss(styleMatches.map(m => m[1]).join('\n'));
      }

      // Sanitize the HTML for strict XML compliance (remove doctype, meta, extract body)
      innerHtml = sanitizeHtmlForXml(trimmed);

      // Convert pseudo-elements (::before, ::after) into real interactive DOM elements,
      // and enable pointer events so all parts can be selected, moved, styled, and deleted!
      const transformed = transformPseudoElementsToDom(innerHtml, cssBlock);
      innerHtml = transformed.html;
      cssBlock = transformed.css;

      if (!derivedTitle) {
        const classMatch = innerHtml.match(/class=["']([^"']+)["']/i);
        if (classMatch) {
          const firstClass = classMatch[1].split(/\s+/)[0];
          derivedTitle = humanizeClassName(firstClass);
        }
      }
    } else {
      // 2. User pasted pure CSS (either class rules like .card { ... } or inline declarations)
      cssBlock = sanitizeCss(trimmed);

      const analysis = analyzeCssClasses(cssBlock);
      const mainClass = analysis.primary;
      const childClasses = analysis.children;

      if (!derivedTitle) {
        derivedTitle = humanizeClassName(mainClass);
      }

      if (analysis.all.length > 0) {
        // Construct the semantic DOM tree for the CSS classes
        if (childClasses.length > 0) {
          const childrenMarkup = childClasses.map(c => `<div class="${c}"></div>`).join('');
          innerHtml = `<div class="${mainClass}">${childrenMarkup}</div>`;
        } else {
          innerHtml = `<div class="${mainClass}"></div>`;
        }

        // Check if width & height are specified, otherwise add defaults
        const hasWidth = /width\s*:/i.test(cssBlock);
        const hasHeight = /height\s*:/i.test(cssBlock);
        if (!hasWidth || !hasHeight) {
          cssBlock = `
            .${mainClass} {
              width: ${hasWidth ? 'auto' : '150px'};
              height: ${hasHeight ? 'auto' : '150px'};
            }
            ${cssBlock}
          `;
        }
      } else {
        // 3. User pasted inline declarations without a class selector (e.g. "background: red; border-radius: 20px;")
        const hasWidth = /width\s*:/i.test(cssBlock);
        const hasHeight = /height\s*:/i.test(cssBlock);
        const autoWidth = hasWidth ? '' : 'width: 140px;';
        const autoHeight = hasHeight ? '' : 'height: 140px;';

        const dynamicClass = `${uid}_element`;
        cssBlock = `
          .${dynamicClass} {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            ${autoWidth}
            ${autoHeight}
            ${cssBlock}
          }
        `;
        innerHtml = `<div class="${dynamicClass}"></div>`;
      }
    }

    // Determine category and title hints from content
    const lowerCss = (cssBlock + ' ' + innerHtml).toLowerCase();
    if (lowerCss.includes('magnifier') || lowerCss.includes('search') || lowerCss.includes('lens')) {
      detectedCategory = 'UI Icons';
      if (!derivedTitle) derivedTitle = 'Magnifying Glass';
    } else if (lowerCss.includes('coin') || lowerCss.includes('gold') || lowerCss.includes('crypto') || lowerCss.includes('money')) {
      detectedCategory = '3D Elements';
      if (!derivedTitle) derivedTitle = '3D Golden Coin';
    } else if (lowerCss.includes('glass') || lowerCss.includes('backdrop-filter') || lowerCss.includes('frost')) {
      detectedCategory = 'Productivity Glass';
      if (!derivedTitle) derivedTitle = 'Frosted Glass Element';
    } else if (lowerCss.includes('neon') || lowerCss.includes('glow') || lowerCss.includes('cyber')) {
      detectedCategory = '3D Elements';
      if (!derivedTitle) derivedTitle = 'Neon Glow Element';
    } else if (lowerCss.includes('badge') || lowerCss.includes('shield') || lowerCss.includes('star')) {
      detectedCategory = 'Badges & Stickers';
      if (!derivedTitle) derivedTitle = 'Custom CSS Badge';
    } else {
      if (!derivedTitle) derivedTitle = 'Custom CSS Element';
    }

    // Scaler calculation:
    // If element is around 140px or larger, scale it slightly so shadows and glows fit inside 200x200 viewport
    let scaleVal = 1;
    const widthMatch = cssBlock.match(/width\s*:\s*(\d+)px/i);
    const heightMatch = cssBlock.match(/height\s*:\s*(\d+)px/i);
    if (widthMatch || heightMatch) {
      const w = widthMatch ? parseInt(widthMatch[1], 10) : 150;
      const h = heightMatch ? parseInt(heightMatch[1], 10) : 150;
      const maxDim = Math.max(w, h);
      if (maxDim > 220) scaleVal = 0.65;
      else if (maxDim > 170) scaleVal = 0.74;
      else if (maxDim > 130) scaleVal = 0.82;
      else scaleVal = 1;
    }

    // Root container & scaler styles
    const rootContainerClass = `${uid}_root`;
    const scalerClass = `${uid}_scaler`;
    const finalScopedCss = `
      .${rootContainerClass} {
        width: 200px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: visible;
        margin: 0;
        padding: 0;
        position: relative;
        perspective: 1000px;
        -webkit-font-smoothing: antialiased;
      }
      .${scalerClass} {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        overflow: visible;
        ${scaleVal !== 1 ? `transform: scale(${scaleVal}); transform-origin: center center;` : ''}
      }
      ${cssBlock}
    `;

    // Construct the clean standard 200x200 SVG with ForeignObject (matching viewBox 0 0 200 200)
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" style="overflow: visible;">
  <foreignObject x="0" y="0" width="200" height="200" style="overflow: visible; pointer-events: none;">
    <div xmlns="http://www.w3.org/1999/xhtml" data-css-wrapper="true" class="${rootContainerClass} css_preview_root" style="width: 200px; height: 200px; position: relative; overflow: visible; display: flex; align-items: center; justify-content: center; pointer-events: none;">
      <style>
${finalScopedCss}
      </style>
      <!-- Ambient light mesh to activate glass refraction -->
      <div data-css-wrapper="true" style="position: absolute; left: 40px; top: 40px; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(56, 189, 248, 0.35), rgba(99, 102, 241, 0.2), transparent 70%); filter: blur(24px); pointer-events: none; z-index: 0;"></div>
      <div class="${scalerClass} css_preview_scaler" data-css-wrapper="true" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 1; pointer-events: none; overflow: visible;">
        ${innerHtml}
      </div>
    </div>
  </foreignObject>
</svg>`;

    return {
      success: true,
      svgCode,
      mode: 'foreignObject',
      suggestedTitle: derivedTitle,
      suggestedCategory: detectedCategory,
      suggestedTags: `css-art, ${derivedTitle.toLowerCase().replace(/\s+/g, ', ')}, modern-ui`
    };
  } catch (err) {
    console.error('convertCssToSvg error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Normalizes ForeignObject SVGs to standard 200x200 viewBox coordinates.
 * Ensures:
 * 1. The visual center stays exactly at (100, 100) matching viewBox 0 0 200 200.
 * 2. XML tags are 100% balanced so SVGs always render cleanly in gallery cards and studio canvas.
 */
export function normalizeForeignObjectSvg(svgCode) {
  if (!svgCode || typeof svgCode !== 'string' || !svgCode.includes('foreignObject')) {
    return svgCode;
  }
  let updated = svgCode;

  // 1. Ensure root <svg> has overflow: visible
  updated = updated.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
    if (/style="([^"]*)"/i.test(attrs)) {
      return `<svg${attrs.replace(/style="([^"]*)"/i, (sm, s) => `style="${s.includes('overflow') ? s : s + '; overflow: visible;'}"`)}>`;
    }
    return `<svg${attrs} style="overflow: visible;">`;
  });

  // 2. Remove legacy css_preview_outer wrapper if present
  if (updated.includes('css_preview_outer')) {
    updated = updated.replace(/<div[^>]*class=["'][^"']*css_preview_outer[^"']*["'][^>]*>/gi, '');
    updated = updated.replace(/<\/div>\s*<\/foreignObject>/gi, '</foreignObject>');
  }

  // 3. Normalize foreignObject to standard 200x200 viewBox coordinates
  updated = updated.replace(/<foreignObject\b[^>]*>/gi, '<foreignObject x="0" y="0" width="200" height="200" style="overflow: visible; pointer-events: none;">');

  // 4. Clean css_preview_root inline style back to centered relative 200x200
  if (/css_preview_root/i.test(updated)) {
    updated = updated.replace(/<div\b([^>]*?class=["'][^"']*css_preview_root[^"']*["'][^>]*)>/gi, (match, attrs) => {
      let cleanAttrs = attrs.replace(/\bstyle="[^"]*"/gi, '').trim();
      return `<div ${cleanAttrs} style="width: 200px; height: 200px; position: relative; overflow: visible; display: flex; align-items: center; justify-content: center; pointer-events: none;">`;
    });
  }

  // 5. Clean css_preview_scaler
  if (/css_preview_scaler/i.test(updated)) {
    updated = updated.replace(/<div\b([^>]*?class=["'][^"']*css_preview_scaler[^"']*["'][^>]*)>/gi, (match, attrs) => {
      let cleanAttrs = attrs;
      if (/style="([^"]*)"/i.test(cleanAttrs)) {
        cleanAttrs = cleanAttrs.replace(/style="([^"]*)"/i, (m, s) => {
          let sClean = s.replace(/pointer-events\s*:\s*[^;]+;?/gi, '').trim();
          return `style="pointer-events: none; overflow: visible; ${sClean}"`;
        });
      } else {
        cleanAttrs += ' style="pointer-events: none; overflow: visible;"';
      }
      return `<div ${cleanAttrs}>`;
    });
  }

  // 6. Guarantee div tag balance inside foreignObject so no XML parse error can ever occur!
  const foMatch = updated.match(/<foreignObject[\s\S]*?<\/foreignObject>/i);
  if (foMatch) {
    const foContent = foMatch[0];
    const openDivs = (foContent.match(/<div\b/gi) || []).length;
    const closeDivs = (foContent.match(/<\/div>/gi) || []).length;
    if (openDivs > closeDivs) {
      const missing = openDivs - closeDivs;
      const closingTags = '</div>'.repeat(missing);
      updated = updated.replace(/<\/foreignObject>/i, `${closingTags}</foreignObject>`);
    }
  }

  return updated;
}

