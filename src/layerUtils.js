// SVG Layer Extraction, Reordering, and Transformation Utilities for Iconderry

import { normalizeColor } from './colorUtils';

const visualTagNames = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'text'];

/**
 * Tags all visual shape elements in an SVG DOM element with data-layer-id.
 */
export function tagSvgElements(svgEl) {
  if (!svgEl) return;
  let layerIndex = 0;
  const processElement = (el) => {
    const tag = el.tagName.toLowerCase();
    if (['defs', 'clippath', 'mask', 'filter', 'metadata', 'style', 'title', 'desc'].includes(tag)) {
      return;
    }
    if (visualTagNames.includes(tag)) {
      if (!el.getAttribute('data-layer-id')) {
        el.setAttribute('data-layer-id', `layer_${layerIndex}`);
      }
      layerIndex++;
    } else if (tag === 'g') {
      const children = Array.from(el.children);
      const hasVisualChildren = children.some(c => visualTagNames.includes(c.tagName.toLowerCase()) || c.tagName.toLowerCase() === 'g');
      if (hasVisualChildren) {
        children.forEach(c => processElement(c));
      }
    }
  };
  Array.from(svgEl.children).forEach(child => processElement(child));
}

/**
 * Extracts all movable visual shape layers from an SVG code string.
 * Tags each element with data-layer-id so it can be uniquely selected and transformed.
 */
export function extractSvgLayers(svgCode) {
  if (!svgCode || typeof svgCode !== 'string') return { layers: [], taggedSvg: svgCode };

  try {
    if (typeof window === 'undefined' || !window.DOMParser) {
      return { layers: [], taggedSvg: svgCode };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return { layers: [], taggedSvg: svgCode };

    const layers = [];
    let layerIndex = 0;

    const processElement = (el) => {
      const tag = el.tagName.toLowerCase();
      if (['defs', 'clippath', 'mask', 'filter', 'metadata', 'style', 'title', 'desc'].includes(tag)) {
        return;
      }

      if (visualTagNames.includes(tag)) {
        const layerId = `layer_${layerIndex}`;
        el.setAttribute('data-layer-id', layerId);

        // Determine primary color
        let rawColor = el.getAttribute('fill') || el.getAttribute('stroke') || el.style.fill || el.style.stroke;
        let color = normalizeColor(rawColor) || '#38bdf8';

        // Descriptive layer name
        let name = `${tag.charAt(0).toUpperCase() + tag.slice(1)} ${layerIndex + 1}`;
        if (el.getAttribute('id')) {
          name = el.getAttribute('id').replace(/[-_]/g, ' ');
        }

        layers.push({
          id: layerId,
          index: layerIndex,
          tag,
          name,
          color,
          rawColor: rawColor || color
        });

        layerIndex++;
      } else if (tag === 'g') {
        const children = Array.from(el.children);
        const hasVisualChildren = children.some(c => visualTagNames.includes(c.tagName.toLowerCase()) || c.tagName.toLowerCase() === 'g');
        if (hasVisualChildren) {
          children.forEach(c => processElement(c));
        }
      }
    };

    Array.from(svgEl.children).forEach(child => processElement(child));

    const serializer = new XMLSerializer();
    const taggedSvg = serializer.serializeToString(doc);

    return { layers, taggedSvg };
  } catch (err) {
    console.error('Error extracting SVG layers:', err);
    return { layers: [], taggedSvg: svgCode };
  }
}

/**
 * Applies position offsets (translate), rotation, DOM layer reordering, and per-element custom styles/effects to an SVG string.
 * Preserves SVG viewBox, filters, gradients, and styling.
 */
export function applyLayerTransforms(svgCode, layerTransforms = {}, layerOrder = [], ensureTagged = false, layerStyles = {}) {
  if (!svgCode || typeof svgCode !== 'string') return svgCode;
  const hasTransforms = layerTransforms && Object.keys(layerTransforms).length > 0;
  const hasOrder = layerOrder && layerOrder.length > 0;
  const hasStyles = layerStyles && Object.keys(layerStyles).length > 0;

  if (!hasTransforms && !hasOrder && !ensureTagged && !hasStyles) {
    return svgCode;
  }

  try {
    if (typeof window === 'undefined' || !window.DOMParser) {
      return svgCode;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return svgCode;

    // Ensure elements are tagged if missing
    if (!svgEl.querySelector('[data-layer-id]')) {
      tagSvgElements(svgEl);
    }

    // 1. Reorder DOM nodes according to layerOrder
    // If layerOrder is in default order (not manually reordered by user), preserve original DOM order to avoid breaking groups/layering
    const isDefaultOrder = Boolean(
      layerOrder &&
      layerOrder.length > 0 &&
      layerOrder.every((rawId, idx) => {
        const cleanId = String(rawId).replace(/^pf_studio_/i, '');
        return cleanId === `layer_${idx}`;
      })
    );

    if (hasOrder && !isDefaultOrder) {
      const layersToReorder = layerOrder.map(rawId => {
        const layerId = String(rawId).replace(/^pf_studio_/i, '');
        const numOnly = layerId.replace(/\D/g, '');
        return svgEl.querySelector(`[data-layer-id="${rawId}"]`) ||
               svgEl.querySelector(`[data-layer-id="${layerId}"]`) ||
               (numOnly ? svgEl.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
      }).filter(Boolean);

      const hasMultipleParents = layersToReorder.some(el => el.parentNode !== svgEl);

      if (hasMultipleParents) {
        layersToReorder.forEach(el => {
          let currentParent = el.parentNode;
          while (currentParent && currentParent !== svgEl && currentParent.tagName.toLowerCase() === 'g') {
            ['stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill', 'fill-opacity', 'stroke-opacity', 'opacity'].forEach(attr => {
              if (!el.getAttribute(attr) && currentParent.getAttribute(attr)) {
                el.setAttribute(attr, currentParent.getAttribute(attr));
              }
            });
            const parentTransform = currentParent.getAttribute('transform');
            if (parentTransform) {
              const elTransform = el.getAttribute('transform') || '';
              el.setAttribute('transform', `${parentTransform} ${elTransform}`.trim());
            }
            currentParent = currentParent.parentNode;
          }
          if (el.parentNode !== svgEl) {
            svgEl.appendChild(el);
          }
        });
      }

      layersToReorder.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.appendChild(el);
        }
      });
    }

    // 2. Apply transforms to targeted layer nodes
    if (hasTransforms) {
      Object.entries(layerTransforms).forEach(([rawId, transform]) => {
        if (!transform) return;
        const { x = 0, y = 0, rotate = 0 } = transform;
        if (x === 0 && y === 0 && rotate === 0) return;

        const cleanId = String(rawId).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = svgEl.querySelector(`[data-layer-id="${rawId}"]`) ||
                   svgEl.querySelector(`[data-layer-id="${cleanId}"]`) ||
                   (numOnly ? svgEl.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (!el) return;

        const existingTransform = el.getAttribute('data-orig-transform') || el.getAttribute('transform') || '';
        if (!el.getAttribute('data-orig-transform') && existingTransform) {
          el.setAttribute('data-orig-transform', existingTransform);
        }

        // Clean out any inline style transform that can override the SVG transform attribute
        const origStyle = el.getAttribute('style') || '';
        if (origStyle) {
          const cleanStyle = origStyle
            .replace(/transform-box\s*:\s*[^;]+;?/gi, '')
            .replace(/transform-origin\s*:\s*[^;]+;?/gi, '')
            .replace(/transform\s*:\s*[^;]+;?/gi, '')
            .trim();
          el.setAttribute('style', cleanStyle);
        }

        // SVG transform attribute: standard across SVG canvas rendering, exports, and conversions.
        // Place delta translate before origAttr so screen-space movement translates along screen X/Y without skewing axes,
        // and preserve the element's original rotation/matrix (e.g. rotate(45 100 100)).
        const origAttr = el.getAttribute('data-orig-transform') || '';
        const transformParts = [];
        if (x !== 0 || y !== 0) {
          transformParts.push(`translate(${x} ${y})`);
        }
        if (origAttr) {
          transformParts.push(origAttr);
        }
        if (rotate !== 0) {
          transformParts.push(`rotate(${rotate})`);
        }
        el.setAttribute('transform', transformParts.join(' '));
      });
    }

    // 3. Apply custom per-element styles (fill, stroke, opacity, glow, blur, brightness)
    if (hasStyles) {
      Object.entries(layerStyles).forEach(([rawId, style]) => {
        if (!style) return;
        const cleanId = String(rawId).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = svgEl.querySelector(`[data-layer-id="${rawId}"]`) ||
                   svgEl.querySelector(`[data-layer-id="${cleanId}"]`) ||
                   (numOnly ? svgEl.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (!el) return;

        // Custom Fill Color
        if (style.fill) {
          el.setAttribute('fill', style.fill);
          el.style.setProperty('fill', style.fill, 'important');
        }

        // Custom Stroke Color & Width
        if (style.stroke) {
          el.setAttribute('stroke', style.stroke);
          el.style.setProperty('stroke', style.stroke, 'important');
        }
        if (style.strokeWidth !== undefined && style.strokeWidth !== null && style.strokeWidth !== '') {
          el.setAttribute('stroke-width', String(style.strokeWidth));
          el.style.setProperty('stroke-width', `${style.strokeWidth}px`, 'important');
        }

        // Custom Opacity
        if (style.opacity !== undefined && style.opacity !== null && style.opacity !== '') {
          el.setAttribute('opacity', String(style.opacity));
          el.style.setProperty('opacity', String(style.opacity), 'important');
        }

        // Custom Filters & Effects (Glow, Blur, Brightness)
        const filters = [];
        if (style.glow && style.glow.enabled) {
          const glowColor = style.glow.color || '#38bdf8';
          const glowRadius = style.glow.radius || 12;
          filters.push(`drop-shadow(0 0 ${glowRadius}px ${glowColor})`);
        }
        if (style.blur && Number(style.blur) > 0) {
          filters.push(`blur(${style.blur}px)`);
        }
        if (style.brightness !== undefined && Number(style.brightness) !== 100) {
          filters.push(`brightness(${style.brightness}%)`);
        }
        if (style.customFilter) {
          filters.push(style.customFilter);
        }

        if (filters.length > 0) {
          const filterStr = filters.join(' ');
          el.style.setProperty('filter', filterStr, 'important');
        }
      });
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (err) {
    console.error('Error applying layer transforms and styles:', err);
    return svgCode;
  }
}
