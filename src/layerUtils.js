// SVG Layer Extraction, Reordering, and Transformation Utilities for Iconderry

import { normalizeColor } from './colorUtils.js';

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
        let layerId = el.getAttribute('data-layer-id');
        if (!layerId) {
          layerId = `layer_${layerIndex}`;
          el.setAttribute('data-layer-id', layerId);
        }

        // Determine primary color
        let rawColor = el.getAttribute('fill') || el.getAttribute('stroke') || el.style.fill || el.style.stroke;
        let color = normalizeColor(rawColor) || '#38bdf8';

        // Descriptive layer name
        let name = el.getAttribute('data-layer-name') ||
                   (el.getAttribute('id') ? el.getAttribute('id').replace(/[-_]/g, ' ') : `${tag.charAt(0).toUpperCase() + tag.slice(1)} ${layerIndex + 1}`);

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
 * Applies position offsets (translate), rotation, scaling, DOM layer reordering, deletions, duplications, and per-element custom styles/effects to an SVG string.
 * Preserves SVG viewBox, filters, gradients, and styling.
 */
export function applyLayerTransforms(
  svgCode,
  layerTransforms = {},
  layerOrder = [],
  ensureTagged = false,
  layerStyles = {},
  deletedLayerIds = [],
  duplicatedLayers = []
) {
  if (!svgCode || typeof svgCode !== 'string') return svgCode;
  const hasTransforms = layerTransforms && Object.keys(layerTransforms).length > 0;
  const hasOrder = layerOrder && layerOrder.length > 0;
  const hasStyles = layerStyles && Object.keys(layerStyles).length > 0;
  const hasDeletes = deletedLayerIds && deletedLayerIds.length > 0;
  const hasDuplicates = duplicatedLayers && duplicatedLayers.length > 0;

  if (!hasTransforms && !hasOrder && !ensureTagged && !hasStyles && !hasDeletes && !hasDuplicates) {
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

    // Ensure all visual elements have data-layer-id so transforms, deletes, and styles map accurately
    tagSvgElements(svgEl);

    // 0. Handle duplicated layers (clone original element with new ID)
    if (hasDuplicates) {
      duplicatedLayers.forEach(dup => {
        if (!dup || !dup.id || !dup.sourceId) return;
        const sourceEl = svgEl.querySelector(`[data-layer-id="${dup.sourceId}"]`) ||
                         svgEl.querySelector(`[data-layer-id="${String(dup.sourceId).replace(/^pf_studio_/i, '')}"]`);
        if (sourceEl && !svgEl.querySelector(`[data-layer-id="${dup.id}"]`)) {
          const clone = sourceEl.cloneNode(true);
          clone.setAttribute('data-layer-id', dup.id);
          if (clone.hasAttribute('id')) {
            clone.setAttribute('id', `${clone.getAttribute('id')}_copy`);
          }
          sourceEl.parentNode.insertBefore(clone, sourceEl.nextSibling);
        }
      });
    }

    // 1. Handle deleted layers (remove from SVG DOM)
    if (hasDeletes) {
      deletedLayerIds.forEach(rawId => {
        const cleanId = String(rawId).replace(/^pf_studio_/i, '');
        const numOnly = cleanId.replace(/\D/g, '');
        const el = svgEl.querySelector(`[data-layer-id="${rawId}"]`) ||
                   svgEl.querySelector(`[data-layer-id="${cleanId}"]`) ||
                   (numOnly ? svgEl.querySelector(`[data-layer-id="layer_${numOnly}"]`) : null);
        if (el) {
          el.remove();
        }
      });
    }

    // 2. Reorder DOM nodes according to layerOrder
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

    // 3. Apply transforms to targeted layer nodes (translate, rotate, scale around center)
    if (hasTransforms) {
      Object.entries(layerTransforms).forEach(([rawId, transform]) => {
        if (!transform) return;
        const {
          x = 0,
          y = 0,
          rotate = 0,
          scaleX = 1,
          scaleY = 1,
          cx = 0,
          cy = 0
        } = transform;

        if (x === 0 && y === 0 && rotate === 0 && scaleX === 1 && scaleY === 1) return;

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

        const origAttr = el.getAttribute('data-orig-transform') || '';
        const transformParts = [];

        // Center origin calculation: if cx, cy are provided, translate to origin, rotate & scale, then translate back
        const hasScale = scaleX !== 1 || scaleY !== 1;
        const hasRotate = rotate !== 0;

        if (x !== 0 || y !== 0) {
          transformParts.push(`translate(${x} ${y})`);
        }
        if (hasRotate || hasScale) {
          if (cx !== 0 || cy !== 0) {
            transformParts.push(`translate(${cx} ${cy})`);
            if (hasRotate) transformParts.push(`rotate(${rotate})`);
            if (hasScale) transformParts.push(`scale(${scaleX} ${scaleY})`);
            transformParts.push(`translate(${-cx} ${-cy})`);
          } else {
            if (hasRotate) transformParts.push(`rotate(${rotate})`);
            if (hasScale) transformParts.push(`scale(${scaleX} ${scaleY})`);
          }
        }
        if (origAttr) {
          transformParts.push(origAttr);
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

/**
 * Calculates the bounding box of all active/visible artwork elements inside an SVG container
 * in native SVG viewBox coordinate space.
 * Includes all translated, rotated, scaled, duplicated elements so they can be auto-fitted
 * onto the exported canvas without any clipping.
 */
export function calculateArtworkBounds(svgContainerEl, paddingPercent = 0.04, deletedLayerIds = [], keepSquare = false) {
  if (!svgContainerEl) return null;
  const svgEl = svgContainerEl.querySelector('svg');
  if (!svgEl) return null;

  const svgRect = svgEl.getBoundingClientRect();
  if (!svgRect || svgRect.width <= 0 || svgRect.height <= 0) return null;

  // Read native viewBox of the SVG
  let vbX = 0, vbY = 0, vbW = 100, vbH = 100;
  const vbAttr = svgEl.getAttribute('viewBox');
  if (vbAttr) {
    const parts = vbAttr.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(n => !isNaN(n))) {
      [vbX, vbY, vbW, vbH] = parts;
    }
  }

  const scaleX = vbW / svgRect.width;
  const scaleY = vbH / svgRect.height;

  // Find all leaf visual nodes (shapes, paths, rects, circles, texts, etc.)
  const visualTags = ['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line', 'text'];
  const nodes = Array.from(svgEl.querySelectorAll('*')).filter(el => {
    const tag = el.tagName.toLowerCase();
    if (['defs', 'clippath', 'mask', 'filter', 'metadata', 'style', 'title', 'desc'].includes(tag)) return false;
    if (el.getAttribute('display') === 'none' || el.getAttribute('visibility') === 'hidden') return false;
    if (el.getAttribute('opacity') === '0' || el.style.opacity === '0') return false;

    // Check if element is in deletedLayerIds
    const rawId = el.getAttribute('data-layer-id');
    if (rawId && deletedLayerIds && deletedLayerIds.includes(rawId)) return false;

    // Filter out invisible guide rects and full-canvas background rects with no visible fill or stroke
    const fill = el.getAttribute('fill') || el.style.fill || '';
    const stroke = el.getAttribute('stroke') || el.style.stroke || '';
    const isNoneFill = !fill || fill === 'none' || fill === 'transparent';
    const isNoneStroke = !stroke || stroke === 'none' || stroke === 'transparent' || el.getAttribute('stroke-width') === '0';
    if (isNoneFill && isNoneStroke) return false;

    // Filter out elements that are pure full-size transparent background rects
    if (tag === 'rect') {
      const w = el.getAttribute('width');
      const h = el.getAttribute('height');
      if ((w === '100%' || w === String(vbW)) && (h === '100%' || h === String(vbH)) && isNoneFill) {
        return false;
      }
    }

    return visualTags.includes(tag) && el.children.length === 0;
  });

  if (nodes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const r = node.getBoundingClientRect();
    if (r.width > 0 || r.height > 0) {
      if (r.left < minX) minX = r.left;
      if (r.top < minY) minY = r.top;
      if (r.right > maxX) maxX = r.right;
      if (r.bottom > maxY) maxY = r.bottom;
    }
  });

  if (!isFinite(minX) || !isFinite(minY)) return null;

  // Convert screen coordinates to native SVG viewBox coordinates
  const svgMinX = vbX + (minX - svgRect.left) * scaleX;
  const svgMinY = vbY + (minY - svgRect.top) * scaleY;
  const svgMaxX = vbX + (maxX - svgRect.left) * scaleX;
  const svgMaxY = vbY + (maxY - svgRect.top) * scaleY;

  const contentWidth = svgMaxX - svgMinX;
  const contentHeight = svgMaxY - svgMinY;

  if (contentWidth <= 0 || contentHeight <= 0) return null;

  // Tight breathing padding: just 4% of dimension (minimum 4 SVG units) so frame ends closely around elements
  const pad = Math.max(Math.max(contentWidth, contentHeight) * paddingPercent, 4);
  const paddedMinX = svgMinX - pad;
  const paddedMinY = svgMinY - pad;
  const paddedW = contentWidth + (pad * 2);
  const paddedH = contentHeight + (pad * 2);

  if (keepSquare) {
    const maxDim = Math.max(paddedW, paddedH);
    const squareMinX = paddedMinX - ((maxDim - paddedW) / 2);
    const squareMinY = paddedMinY - ((maxDim - paddedH) / 2);
    return {
      minX: Number(squareMinX.toFixed(2)),
      minY: Number(squareMinY.toFixed(2)),
      width: Number(maxDim.toFixed(2)),
      height: Number(maxDim.toFixed(2)),
      contentWidth: Number(contentWidth.toFixed(2)),
      contentHeight: Number(contentHeight.toFixed(2))
    };
  }

  // TIGHT CROPPED BOUNDS: Frame ends right where the outermost elements end (no massive empty void!)
  return {
    minX: Number(paddedMinX.toFixed(2)),
    minY: Number(paddedMinY.toFixed(2)),
    width: Number(paddedW.toFixed(2)),
    height: Number(paddedH.toFixed(2)),
    contentWidth: Number(contentWidth.toFixed(2)),
    contentHeight: Number(contentHeight.toFixed(2))
  };
}

