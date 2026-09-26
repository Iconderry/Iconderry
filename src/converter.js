import { replaceSvgColors, applyUniversalStroke } from './colorUtils';
import { transformSvgStyle } from './styleTransformer';
import { applyLayerTransforms, extractSvgLayers } from './layerUtils';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export async function downloadAsset({
  svgCode,
  filename,
  format = 'png',
  size = 512,
  width,
  height,
  isTransparent = true,
  quality = 0.92,
  customFilename = '',
  autoTagDimensions = true,
  customBg = null,
  adjustments = {
    hue: 0,
    brightness: 100,
    saturation: 100,
    contrast: 100,
    sepia: 0,
    invert: 0,
    opacity: 100,
    blur: 0,
    shadowBlur: 0,
    shadowColor: '#00ffff',
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
    customColor: '',
    colorReplacements: {},
    activeStyleMode: 'original',
    strokeMultiplier: 1,
    strokeColorMode: 'auto',
    customStrokeColor: '#ffffff',
    bgShape: 'none',
    bgShapeColor: '#1e293b',
    bgShapePadding: 20,
    bgShapeBorder: 0,
    bgShapeBorderColor: '#38bdf8'
  }
}) {
  const cleanName = (customFilename || filename || 'icon')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');
  const safeFilename = cleanName || 'icon';

  // Mobile Hardware Safety Clamp:
  // Mobile browsers (iOS Safari & Android Chrome) have hard hardware limits on canvas memory (4096 max texture size & 16MP canvas area).
  // Creating an 8192x8192 canvas (268MB raw uncompressed GPU RAM per canvas) crashes mobile tabs immediately with OOM.
  // We clamp mobile exports to 4096 (4K Ultra-HD), ensuring rock-solid stability and zero mobile tab crashes.
  const isMobile = typeof window !== 'undefined' && (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (window.innerWidth < 768 && 'ontouchstart' in window)
  );
  const maxSafeDim = isMobile ? 4096 : 8192;
  const targetWidth = Math.min(width || size, maxSafeDim);
  const targetHeight = Math.min(height || size, maxSafeDim);
  const baseFilename = autoTagDimensions ? `${safeFilename}-${targetWidth}x${targetHeight}` : safeFilename;

  // DIRECT PURE VECTOR SVG EXPORT
  if (format === 'svg') {
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight, true);

    // If not transparent and no shape, embed custom solid/gradient background
    if (!isTransparent && (!adjustments.bgShape || adjustments.bgShape === 'none')) {
      let bgDef = '';
      let bgFill = (customBg && customBg.solidColor) || '#0b0f19';
      if (customBg && customBg.type === 'gradient' && customBg.gradient) {
        const gradId = 'iconderry-custom-bg-grad';
        bgDef = `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${customBg.gradient.from || '#060a12'}"/><stop offset="100%" stop-color="${customBg.gradient.to || '#1e293b'}"/></linearGradient></defs>`;
        bgFill = `url(#${gradId})`;
      }
      const bgRect = `${bgDef}<rect width="100%" height="100%" fill="${bgFill}"/>`;
      preparedSvg = preparedSvg.replace(/<svg([^>]*)>/, `<svg$1>${bgRect}`);
    }

    // If background badge shape is active, embed container shape into SVG
    if (adjustments.bgShape && adjustments.bgShape !== 'none') {
      preparedSvg = embedSvgBgShape(preparedSvg, adjustments, targetWidth, targetHeight);
    }

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    await triggerDownload(blob, `${baseFilename}.svg`);
    return true;
  }

  return new Promise((resolve, reject) => {
    // Pass targetWidth and targetHeight so SVG root element has native resolution attributes
    // forVectorSvgExport is false so raster image has clean, untransformed vector paths
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight, false);

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Canvas context error'));
        return;
      }

      // Enable pristine high-quality subpixel vector smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Solid or gradient canvas background (if not transparent or jpeg)
      if (format === 'jpeg' || (!isTransparent && (!adjustments.bgShape || adjustments.bgShape === 'none'))) {
        if (customBg && customBg.type === 'gradient' && customBg.gradient) {
          const angleRad = ((customBg.gradient.angle || 135) * Math.PI) / 180;
          const cx = targetWidth / 2;
          const cy = targetHeight / 2;
          const dist = Math.sqrt(cx * cx + cy * cy);
          const x1 = cx - Math.cos(angleRad) * dist;
          const y1 = cy - Math.sin(angleRad) * dist;
          const x2 = cx + Math.cos(angleRad) * dist;
          const y2 = cy + Math.sin(angleRad) * dist;
          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          grad.addColorStop(0, customBg.gradient.from || '#060a12');
          grad.addColorStop(1, customBg.gradient.to || '#1e293b');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = (customBg && customBg.solidColor) ? customBg.solidColor : (format === 'jpeg' ? '#FFFFFF' : '#0b0f19');
        }
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // 2. Background Badge Shape (Circle, Squircle, Rounded Square, Hexagon)
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        drawCanvasBgShape(ctx, targetWidth, targetHeight, adjustments);
      }

      // 3. Scale blur and glow relative to preview baseline (384px) with safe hardware kernel caps
      // Massive unconstrained blur kernels at 8K crash Chromium/Safari's Skia 2D rasterizer due to OOM
      const scaleFactor = Math.max(targetWidth, targetHeight) / 384;
      const maxGlowRadius = Math.min(72, 18 + scaleFactor * 2.5);
      const scaledGlow = adjustments.shadowBlur > 0 
        ? Math.min(adjustments.shadowBlur * scaleFactor, maxGlowRadius)
        : 0;
      const maxBlurRadius = Math.min(48, (adjustments.blur || 0) * scaleFactor);
      const scaledBlur = adjustments.blur > 0 ? maxBlurRadius : 0;

      const filterRules = [
        `hue-rotate(${adjustments.hue}deg)`,
        `brightness(${adjustments.brightness}%)`,
        `saturate(${adjustments.saturation}%)`,
        `contrast(${adjustments.contrast}%)`,
        `sepia(${adjustments.sepia}%)`,
        `invert(${adjustments.invert}%)`,
        `opacity(${adjustments.opacity}%)`,
        scaledBlur > 0 ? `blur(${scaledBlur}px)` : '',
        scaledGlow > 0 
          ? `drop-shadow(0px 0px ${scaledGlow}px ${adjustments.shadowColor || '#38bdf8'}) drop-shadow(0px 0px ${Math.max(1, Math.round(scaledGlow * 0.4))}px ${adjustments.shadowColor || '#38bdf8'})` 
          : ''
      ].filter(Boolean).join(' ');

      // Animated GIF Export Branch
      if (format === 'gif') {
        exportAnimatedGif({
          img,
          targetWidth,
          targetHeight,
          adjustments,
          isTransparent,
          safeFilename,
          filterRules,
          blobUrl
        }).then(() => resolve(true)).catch((err) => {
          URL.revokeObjectURL(blobUrl);
          reject(err);
        });
        return;
      }

      // 4. Transformations (Rotation, Scale, 3D Perspective & Skew)
      const rotX = adjustments.rotateX || 0;
      const rotY = adjustments.rotateY || 0;
      const rotZ = adjustments.rotation || 0;
      const skX = adjustments.skewX || 0;
      const skY = adjustments.skewY || 0;
      const has3D = rotX !== 0 || rotY !== 0 || skX !== 0 || skY !== 0;

      // Icon Padding / Inset:
      // Default to 1.0 (edge-to-edge, zero artificial white padding/shrinkage).
      // Only reduce padding when shadow blur, container badge shapes, or 3D tilt would otherwise clip outside canvas.
      let paddingRatio = 1.0;
      const hasAnyBlurOrGlow = Boolean(
        adjustments.shadowBlur > 0 ||
        adjustments.blur > 0 ||
        (adjustments.layerStyles && Object.values(adjustments.layerStyles).some(s => (s?.glow?.enabled && (s.glow.radius || 12) > 0) || (s?.blur && Number(s.blur) > 0)))
      );
      if (hasAnyBlurOrGlow) {
        paddingRatio = 0.90;
      }
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        const shapePad = Number(adjustments.bgShapePadding || 20) / 100;
        paddingRatio = Math.max(0.2, (1 - shapePad * 1.5));
      }
      if (has3D) {
        paddingRatio = Math.min(paddingRatio, 0.82); // Margin so 3D perspective tilted corners and glow don't get clipped by canvas bounds
      }

      const drawWidth = targetWidth * paddingRatio;
      const drawHeight = targetHeight * paddingRatio;

      if (!has3D) {
        // Fast 2D Vector Path: zero 3D matrix needed
        ctx.save();
        ctx.filter = filterRules || 'none';
        ctx.translate(targetWidth / 2, targetHeight / 2);
        ctx.rotate((rotZ * Math.PI) / 180);
        ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
      } else {
        // True 3D Hardware Perspective Path:
        // Provide generous glowPad margin (28% of dimension) around img in offCanvas so diffuse glow fades completely to 0 alpha before reaching texture edges.
        // Cap intermediate offCanvas to max 3072 to avoid GPU VRAM exhaustion at 8K while retaining razor-sharp bicubic 8K output.
        const glowPad = Math.round(Math.max(drawWidth, drawHeight) * 0.28);
        const rawTexW = Math.round(drawWidth + glowPad * 2);
        const rawTexH = Math.round(drawHeight + glowPad * 2);

        const maxIntermediate = 3072;
        const texScale = Math.min(1, maxIntermediate / Math.max(rawTexW, rawTexH));
        const texW = Math.round(rawTexW * texScale);
        const texH = Math.round(rawTexH * texScale);
        const innerDrawW = Math.round(drawWidth * texScale);
        const innerDrawH = Math.round(drawHeight * texScale);
        const innerPad = Math.round(glowPad * texScale);

        const offCanvas = document.createElement('canvas');
        offCanvas.width = texW;
        offCanvas.height = texH;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.imageSmoothingEnabled = true;
          offCtx.imageSmoothingQuality = 'high';
          offCtx.filter = filterRules || 'none';
          offCtx.drawImage(img, innerPad, innerPad, innerDrawW, innerDrawH);
        }

        // Render 3D perspective quad via WebGL with zero slicing and seamless borderless glow
        const webglCanvas = render3DWithWebGL(offCtx ? offCanvas : img, targetWidth, targetHeight, adjustments, rawTexW, rawTexH);

        if (webglCanvas) {
          // 3. Optional 3D elevation shadow (single-pass continuous blur, zero streaks)
          if ((adjustments.depth3D || 0) > 0) {
            const depth = (adjustments.depth3D || 0) * (targetWidth / 384);
            const radX = (rotX * Math.PI) / 180;
            const radY = (rotY * Math.PI) / 180;
            const offX = -Math.sin(radY) * depth * 1.5;
            const offY = Math.sin(radX) * depth * 1.5 + (depth * 0.8);
            const sColor = adjustments.depth3DColor || 'rgba(0,0,0,0.55)';

            ctx.save();
            const safeShadowBlur = Math.min(36, Math.max(2, Math.round(depth * 0.5)));
            ctx.filter = `blur(${safeShadowBlur}px) drop-shadow(0 0 ${Math.min(32, Math.round(depth * 0.4))}px ${sColor})`;
            ctx.globalAlpha = 0.55;
            ctx.drawImage(webglCanvas, offX, offY, targetWidth, targetHeight);
            ctx.restore();
          }

          // 4. Draw pristine 3D icon
          ctx.drawImage(webglCanvas, 0, 0, targetWidth, targetHeight);

          // Free intermediate textures immediately from GPU memory
          try {
            webglCanvas.width = 0;
            webglCanvas.height = 0;
            offCanvas.width = 0;
            offCanvas.height = 0;
          } catch (_) {}
        } else {
          // Fallback if WebGL unavailable: 2D affine perspective (zero slices)
          ctx.save();
          ctx.filter = filterRules || 'none';
          ctx.translate(targetWidth / 2, targetHeight / 2);
          const cosY = Math.cos((rotY * Math.PI) / 180);
          const cosX = Math.cos((rotX * Math.PI) / 180);
          ctx.rotate((rotZ * Math.PI) / 180);
          ctx.scale(adjustments.flipH ? -cosY : cosY, adjustments.flipV ? -cosX : cosX);
          ctx.transform(1, Math.tan((skY * Math.PI) / 180), Math.tan((skX * Math.PI) / 180), 1, 0, 0);
          ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
          ctx.restore();
        }
      }

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const compressionQuality = Math.max(0.1, Math.min(1.0, Number(quality) || 0.92));

      canvas.toBlob(async (resBlob) => {
        URL.revokeObjectURL(blobUrl);
        if (resBlob) {
          try {
            await triggerDownload(resBlob, `${baseFilename}.${format}`);
            resolve(true);
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error('Conversion failed'));
        }
      }, mimeType, compressionQuality);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(blobUrl);
      reject(err);
    };

    img.src = blobUrl;
  });
}

function drawCanvasBgShape(ctx, w, h, adjustments) {
  const shape = adjustments.bgShape;
  const color = adjustments.bgShapeColor || '#1e293b';
  const borderWidth = Number(adjustments.bgShapeBorder || 0);
  const borderColor = adjustments.bgShapeBorderColor || '#38bdf8';

  ctx.save();
  ctx.fillStyle = color;
  if (borderWidth > 0) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
  }

  const pad = 4;
  const rx = pad;
  const ry = pad;
  const rw = w - pad * 2;
  const rh = h - pad * 2;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(rw, rh) / 2;

  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  } else if (shape === 'squircle') {
    // iOS Squircle curve
    const r = Math.min(rw, rh) * 0.28;
    ctx.roundRect(rx, ry, rw, rh, r);
  } else if (shape === 'rounded-square') {
    const r = Math.min(rw, rh) * 0.16;
    ctx.roundRect(rx, ry, rw, rh, r);
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else {
    ctx.rect(0, 0, w, h);
  }

  ctx.fill();
  if (borderWidth > 0) {
    ctx.stroke();
  }
  ctx.restore();
}

function embedSvgBgShape(svgCode, adjustments, width, height) {
  const shape = adjustments.bgShape;
  const color = adjustments.bgShapeColor || '#1e293b';
  const borderWidth = Number(adjustments.bgShapeBorder || 0);
  const borderColor = adjustments.bgShapeBorderColor || '#38bdf8';
  const padPercent = Number(adjustments.bgShapePadding || 20);

  let shapeElement = '';
  if (shape === 'circle') {
    shapeElement = `<circle cx="50%" cy="50%" r="48%" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
  } else if (shape === 'squircle') {
    shapeElement = `<rect x="2%" y="2%" width="96%" height="96%" rx="28%" ry="28%" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
  } else if (shape === 'rounded-square') {
    shapeElement = `<rect x="2%" y="2%" width="96%" height="96%" rx="16%" ry="16%" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
  } else if (shape === 'hexagon') {
    shapeElement = `<polygon points="50,2 96,25 96,75 50,98 4,75 4,25" fill="${color}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
  }

  // Wrap inside outer SVG with background shape
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${width}" height="${height}">
  ${shapeElement}
  <g transform="translate(${padPercent/2}, ${padPercent/2}) scale(${(100 - padPercent)/100})">
    ${svgCode.replace(/<svg[^>]*>|<\/svg>/gi, '')}
  </g>
</svg>`;
}

function prepareSvgWithAdjustments(svgCode, adjustments = {}, targetWidth, targetHeight, forVectorSvgExport = false) {
  let res = svgCode;
  if (!res.includes('xmlns=')) {
    res = res.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Apply individual multi-color replacements
  if (adjustments.colorReplacements && Object.keys(adjustments.colorReplacements).length > 0) {
    res = replaceSvgColors(res, adjustments.colorReplacements);
  }

  // Ensure all visual elements have stable data-layer-id tags before applying styles & transforms
  const { taggedSvg } = extractSvgLayers(res);
  res = taggedSvg;

  // Apply real material/look style transformation (supports per-layer styles and global style)
  const layersWithCustomStyles = Object.entries(adjustments.layerStyles || {})
    .filter(([_, s]) => s && s.styleMode && s.styleMode !== 'original');

  if (layersWithCustomStyles.length > 0) {
    const styledLayerIds = new Set(layersWithCustomStyles.map(([id]) => String(id).replace(/^pf_studio_/i, '')));
    if (adjustments.activeStyleMode && adjustments.activeStyleMode !== 'original') {
      const allIds = adjustments.layerOrder || [];
      const remaining = allIds.filter(id => !styledLayerIds.has(String(id).replace(/^pf_studio_/i, '')));
      if (remaining.length > 0) {
        res = transformSvgStyle(res, adjustments.activeStyleMode, remaining);
      }
    }
    layersWithCustomStyles.forEach(([layerId, style]) => {
      res = transformSvgStyle(res, style.styleMode, [layerId]);
    });
  } else if (adjustments.activeStyleMode && adjustments.activeStyleMode !== 'original') {
    res = transformSvgStyle(res, adjustments.activeStyleMode);
  }

  // Adjust stroke thickness (universal for both stroke icons and filled shapes)
  if (adjustments.strokeMultiplier && adjustments.strokeMultiplier !== 1) {
    res = applyUniversalStroke(res, adjustments.strokeMultiplier, adjustments.strokeColorMode, adjustments.customStrokeColor);
  }

  // Apply individual vector layer moves, rotations, DOM reordering, and per-layer custom styles
  if ((adjustments.layerTransforms && Object.keys(adjustments.layerTransforms).length > 0) || 
      (adjustments.layerOrder && adjustments.layerOrder.length > 0) ||
      (adjustments.layerStyles && Object.keys(adjustments.layerStyles).length > 0) ||
      (adjustments.deletedLayerIds && adjustments.deletedLayerIds.length > 0) ||
      (adjustments.duplicatedLayers && adjustments.duplicatedLayers.length > 0)) {
    res = applyLayerTransforms(
      res, 
      adjustments.layerTransforms || {}, 
      adjustments.layerOrder || [], 
      false, 
      adjustments.layerStyles || {},
      adjustments.deletedLayerIds || [],
      adjustments.duplicatedLayers || []
    );
  }

  // Auto-Fit ViewBox: If enabled or explicit box provided, update viewBox strictly on root <svg>
  if (adjustments.autoFitViewBox) {
    const { minX, minY, width, height } = adjustments.autoFitViewBox;
    const newVb = `${minX} ${minY} ${width} ${height}`;
    res = res.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
      let updated = attrs;
      if (/viewBox="[^"]*"/i.test(updated)) {
        updated = updated.replace(/viewBox="[^"]*"/i, `viewBox="${newVb}"`);
      } else {
        updated += ` viewBox="${newVb}"`;
      }
      return `<svg${updated}>`;
    });
  }

  // Ensure viewBox exists for responsive scaling before updating width/height
  res = res.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    let updated = attrs;
    if (!/viewBox=/i.test(updated)) {
      const wMatch = updated.match(/\bwidth="([0-9.]+)(?:px)?"/i);
      const hMatch = updated.match(/\bheight="([0-9.]+)(?:px)?"/i);
      if (wMatch && hMatch) {
        updated += ` viewBox="0 0 ${wMatch[1]} ${hMatch[1]}"`;
      } else {
        updated += ' viewBox="0 0 100 100"';
      }
    }
    return `<svg${updated}>`;
  });

  // Preserve aspect ratio cleanly & ensure overflow: visible STRICTLY on root <svg>
  const aspectRule = 'xMidYMid meet';
  res = res.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    let updated = attrs;
    if (/preserveAspectRatio="[^"]*"/i.test(updated)) {
      updated = updated.replace(/preserveAspectRatio="[^"]*"/i, `preserveAspectRatio="${aspectRule}"`);
    } else {
      updated += ` preserveAspectRatio="${aspectRule}"`;
    }
    if (/overflow="[^"]*"/i.test(updated)) {
      updated = updated.replace(/overflow="[^"]*"/i, 'overflow="visible"');
    } else {
      updated += ' overflow="visible"';
    }
    return `<svg${updated}>`;
  });

  // Expand native SVG filter boundaries so diffuse blur/glow effects never clip against tight filter bounds
  res = res.replace(/<filter\b([^>]*)>/gi, (match, attrs) => {
    let updated = attrs;
    if (/x="[^"]*"/i.test(updated)) {
      updated = updated.replace(/x="[^"]*"/i, 'x="-60%"');
    } else {
      updated += ' x="-60%"';
    }
    if (/y="[^"]*"/i.test(updated)) {
      updated = updated.replace(/y="[^"]*"/i, 'y="-60%"');
    } else {
      updated += ' y="-60%"';
    }
    if (/width="[^"]*"/i.test(updated)) {
      updated = updated.replace(/width="[^"]*"/i, 'width="220%"');
    } else {
      updated += ' width="220%"';
    }
    if (/height="[^"]*"/i.test(updated)) {
      updated = updated.replace(/height="[^"]*"/i, 'height="220%"');
    } else {
      updated += ' height="220%"';
    }
    return `<filter${updated}>`;
  });

  // Set explicit width and height STRICTLY on root <svg> element
  // (CRITICAL: NEVER replace width/height globally across the SVG, which mutates child <rect>, <path>, or shapes!)
  if (targetWidth && targetHeight) {
    res = res.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
      let updated = attrs;
      if (/\bwidth="[^"]*"/i.test(updated)) {
        updated = updated.replace(/\bwidth="[^"]*"/i, `width="${targetWidth}"`);
      } else {
        updated += ` width="${targetWidth}"`;
      }
      if (/\bheight="[^"]*"/i.test(updated)) {
        updated = updated.replace(/\bheight="[^"]*"/i, `height="${targetHeight}"`);
      } else {
        updated += ` height="${targetHeight}"`;
      }
      return `<svg${updated}>`;
    });
  }

  if (adjustments.customColor) {
    res = res.replace(/fill="((?!none|url)[^"]+)"/gi, `fill="${adjustments.customColor}"`);
    res = res.replace(/stroke="((?!none|url)[^"]+)"/gi, `stroke="${adjustments.customColor}"`);
  }

  // 3D & 2D Vector Transform Embedding ONLY for Direct SVG Export
  if (forVectorSvgExport) {
    const rotX = adjustments.rotateX || 0;
    const rotY = adjustments.rotateY || 0;
    const rotZ = adjustments.rotation || 0;
    const skX = adjustments.skewX || 0;
    const skY = adjustments.skewY || 0;
    const persp = adjustments.perspective || 800;
    const flipH = adjustments.flipH ? -1 : 1;
    const flipV = adjustments.flipV ? -1 : 1;

    if (rotX !== 0 || rotY !== 0 || rotZ !== 0 || skX !== 0 || skY !== 0 || flipH !== 1 || flipV !== 1) {
      const inner = res.replace(/<svg[^>]*>|<\/svg>/gi, '');
      const svgOpenMatch = res.match(/<svg[^>]*>/i);
      const svgOpen = svgOpenMatch ? svgOpenMatch[0] : '<svg>';
      res = `${svgOpen}
  <g style="transform-box: fill-box; transform-origin: center; transform: perspective(${persp}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(${rotZ}deg) skew(${skX}deg, ${skY}deg) scale(${flipH}, ${flipV});">
    ${inner}
  </g>
</svg>`;
    }
  }

  return res;
}

// Hardware GPU 3D Perspective Texture Mapping via WebGL (zero slicing, zero lines, anti-aliased)
function mat4Multiply(out, a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}

let _sharedGlCanvas = null;
let _sharedGl = null;
let _sharedGlProgram = null;
let _sharedPosBuf = null;
let _sharedTexBuf = null;
let _sharedTexture = null;
let _uMatrixLoc = null;

function render3DWithWebGL(imageSource, targetWidth, targetHeight, adjustments, drawWidth, drawHeight) {
  let maxTexSize = 4096;
  if (!_sharedGlCanvas || !_sharedGl || _sharedGl.isContextLost()) {
    _sharedGlCanvas = document.createElement('canvas');
    _sharedGl = _sharedGlCanvas.getContext('webgl', { 
      antialias: true, 
      alpha: true, 
      premultipliedAlpha: false,
      preserveDrawingBuffer: true 
    });
    if (_sharedGl) {
      const gl = _sharedGl;
      maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;

      const vsSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        uniform mat4 u_matrix;
        varying vec2 v_texCoord;
        void main() {
          gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
          v_texCoord = a_texCoord;
        }
      `;
      const fsSource = `
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_texCoord;
        void main() {
          gl_FragColor = texture2D(u_texture, v_texCoord);
        }
      `;

      function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      }

      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      _sharedGlProgram = gl.createProgram();
      gl.attachShader(_sharedGlProgram, vs);
      gl.attachShader(_sharedGlProgram, fs);
      gl.linkProgram(_sharedGlProgram);
      gl.useProgram(_sharedGlProgram);

      _sharedPosBuf = gl.createBuffer();
      _sharedTexBuf = gl.createBuffer();
      _sharedTexture = gl.createTexture();
      _uMatrixLoc = gl.getUniformLocation(_sharedGlProgram, 'u_matrix');
    }
  }

  const gl = _sharedGl;
  const canvas = _sharedGlCanvas;
  if (!gl || !canvas) return null;

  maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
  const renderW = Math.min(targetWidth, maxTexSize, 3840);
  const renderH = Math.min(targetHeight, maxTexSize, 3840);
  if (canvas.width !== renderW || canvas.height !== renderH) {
    canvas.width = renderW;
    canvas.height = renderH;
  }
  const scale = renderW / targetWidth;

  gl.viewport(0, 0, renderW, renderH);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(_sharedGlProgram);

  // Quad geometry (2 triangles) scaled to WebGL buffer
  const hw = (drawWidth * scale) / 2;
  const hh = (drawHeight * scale) / 2;

  const positions = new Float32Array([
    -hw, -hh,
     hw, -hh,
    -hw,  hh,
    -hw,  hh,
     hw, -hh,
     hw,  hh
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, _sharedPosBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
  const aPos = gl.getAttribLocation(_sharedGlProgram, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texCoords = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, _sharedTexBuf);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.DYNAMIC_DRAW);
  const aTex = gl.getAttribLocation(_sharedGlProgram, 'a_texCoord');
  gl.enableVertexAttribArray(aTex);
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

  // Texture upload
  gl.bindTexture(gl.TEXTURE_2D, _sharedTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSource);

  // Compute CSS 3D compatible matrix
  const rx = ((adjustments.rotateX || 0) * Math.PI) / 180;
  const ry = ((adjustments.rotateY || 0) * Math.PI) / 180;
  const rz = ((adjustments.rotation || 0) * Math.PI) / 180;
  const tanSkX = Math.tan(((adjustments.skewX || 0) * Math.PI) / 180);
  const tanSkY = Math.tan(((adjustments.skewY || 0) * Math.PI) / 180);
  const scaleX = adjustments.flipH ? -1 : 1;
  const scaleY = adjustments.flipV ? -1 : 1;
  const persp = (adjustments.perspective || 800) * (renderW / 384);

  // Flip
  const Sflip = new Float32Array([
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  // Skew
  const Mskew = new Float32Array([
    1, tanSkY, 0, 0,
    tanSkX, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  // Rotate Z
  const Rz = new Float32Array([
    Math.cos(rz), Math.sin(rz), 0, 0,
    -Math.sin(rz), Math.cos(rz), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  // Rotate X
  const Rx = new Float32Array([
    1, 0, 0, 0,
    0, Math.cos(rx), Math.sin(rx), 0,
    0, -Math.sin(rx), Math.cos(rx), 0,
    0, 0, 0, 1
  ]);

  // Rotate Y
  const Ry = new Float32Array([
    Math.cos(ry), 0, -Math.sin(ry), 0,
    0, 1, 0, 0,
    Math.sin(ry), 0, Math.cos(ry), 0,
    0, 0, 0, 1
  ]);

  // Perspective & NDC projection (maps to [-1, 1] device coordinates)
  const P = new Float32Array([
    2 / targetWidth, 0, 0, 0,
    0, -2 / targetHeight, 0, 0,
    0, 0, 1 / persp, -1 / persp,
    0, 0, 0, 1
  ]);

  const m1 = new Float32Array(16);
  mat4Multiply(m1, Mskew, Sflip);

  const m2 = new Float32Array(16);
  mat4Multiply(m2, Rz, m1);

  const m3 = new Float32Array(16);
  mat4Multiply(m3, Rx, m2);

  const m4 = new Float32Array(16);
  mat4Multiply(m4, Ry, m3);

  const M = new Float32Array(16);
  mat4Multiply(M, P, m4);

  gl.uniformMatrix4fv(_uMatrixLoc, false, M);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  return canvas;
}

// 8x8 Bayer matrix for flicker-free, continuous-tone ordered dithering
const BAYER_8X8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21]
];

// High-fidelity Median Cut color quantization in full 8-bit RGB color space (eliminates 5-bit color banding lines)
function generateMedianCutPalette(sampledSolidPixels, maxColors = 256) {
  const colorMap = new Map();
  for (let i = 0; i < sampledSolidPixels.length; i += 4) {
    const r = sampledSolidPixels[i];
    const g = sampledSolidPixels[i + 1];
    const b = sampledSolidPixels[i + 2];
    const key = (r << 16) | (g << 8) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  const colors = [];
  for (const [key, count] of colorMap.entries()) {
    colors.push({
      r: (key >> 16) & 255,
      g: (key >> 8) & 255,
      b: key & 255,
      count
    });
  }

  if (colors.length === 0) {
    return [[255, 255, 255], [0, 0, 0]];
  }

  if (colors.length <= maxColors) {
    const pal = colors.map(c => [c.r, c.g, c.b]);
    while (pal.length < 2) pal.push([0, 0, 0]);
    return pal;
  }

  let boxes = [colors];
  while (boxes.length < maxColors) {
    let bestBoxIdx = -1;
    let maxRange = -1;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.length <= 1) continue;
      let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
      for (let j = 0; j < box.length; j++) {
        const c = box[j];
        if (c.r < minR) minR = c.r;
        if (c.r > maxR) maxR = c.r;
        if (c.g < minG) minG = c.g;
        if (c.g > maxG) maxG = c.g;
        if (c.b < minB) minB = c.b;
        if (c.b > maxB) maxB = c.b;
      }
      const range = Math.max(maxR - minR, maxG - minG, maxB - minB);
      if (range > maxRange) {
        maxRange = range;
        bestBoxIdx = i;
      }
    }

    if (bestBoxIdx === -1 || maxRange <= 0) break;

    const boxToSplit = boxes.splice(bestBoxIdx, 1)[0];
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    for (let j = 0; j < boxToSplit.length; j++) {
      const c = boxToSplit[j];
      if (c.r < minR) minR = c.r;
      if (c.r > maxR) maxR = c.r;
      if (c.g < minG) minG = c.g;
      if (c.g > maxG) maxG = c.g;
      if (c.b < minB) minB = c.b;
      if (c.b > maxB) maxB = c.b;
    }
    const rRange = maxR - minR;
    const gRange = maxG - minG;
    const bRange = maxB - minB;
    const channel = (rRange >= gRange && rRange >= bRange) ? 'r' : (gRange >= bRange ? 'g' : 'b');

    boxToSplit.sort((a, b) => a[channel] - b[channel]);
    const mid = Math.floor(boxToSplit.length / 2);
    boxes.push(boxToSplit.slice(0, mid));
    boxes.push(boxToSplit.slice(mid));
  }

  return boxes.map(box => {
    let totalR = 0, totalG = 0, totalB = 0, totalCount = 0;
    for (let j = 0; j < box.length; j++) {
      const c = box[j];
      totalR += c.r * c.count;
      totalG += c.g * c.count;
      totalB += c.b * c.count;
      totalCount += c.count;
    }
    return [
      Math.round(totalR / totalCount),
      Math.round(totalG / totalCount),
      Math.round(totalB / totalCount)
    ];
  });
}

// Precomputes a 65,536-entry RGB565 LUT for ultra-fast (O(1)) nearest palette index matching
function buildColorLUT(palette) {
  const lut = new Uint8Array(65536);
  for (let key = 0; key < 65536; key++) {
    const r5 = (key >> 11) & 31;
    const g6 = (key >> 5) & 63;
    const b5 = key & 31;
    const r = (r5 * 255) / 31;
    const g = (g6 * 255) / 63;
    const b = (b5 * 255) / 31;

    let bestIdx = 0;
    let bestDist = Infinity;
    for (let p = 0; p < palette.length; p++) {
      const pal = palette[p];
      const dr = r - pal[0];
      const dg = g - pal[1];
      const db = b - pal[2];
      const dist = dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114;
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = p;
      }
    }
    lut[key] = bestIdx;
  }
  return lut;
}

async function exportAnimatedGif({
  img,
  targetWidth,
  targetHeight,
  adjustments,
  isTransparent,
  safeFilename,
  filterRules,
  blobUrl
}) {
  // Respect user-selected resolution (e.g. 512, 1024, 2048, 4096, 8192)
  const gifW = targetWidth || 512;
  const gifH = targetHeight || 512;

  // Animate if 3D floating is toggled OR if an animation preset is active (unless explicitly 'none')
  const isAnimated = Boolean(adjustments.is3DFloating) ||
    (adjustments.animPreset && adjustments.animPreset !== 'none');

  const fps = Number(adjustments.animFps || 60);
  const speed = Math.max(0.4, Number(adjustments.animSpeed || 2.2));
  const animHeight = Number(adjustments.animHeight || 16);
  const ampScale = animHeight / 16;
  const animPreset = adjustments.animPreset || 'float';
  const animShadowSync = adjustments.animShadowSync !== false;

  // Target frame delay in milliseconds (rounded to GIF tick accuracy)
  let frameDelayMs = 20;
  if (fps <= 25) {
    frameDelayMs = 42;
  } else if (fps <= 35) {
    frameDelayMs = 33;
  } else {
    frameDelayMs = 20;
  }

  // Calculate total frames strictly required for duration = speed * 1000 ms
  // Adapt maximum frames at massive resolutions (4K/8K) to protect client memory & encoding time
  const maxFramesCap = gifW >= 4096 ? 24 : (gifW >= 2048 ? 36 : (fps >= 60 ? 120 : (fps >= 30 ? 75 : 48)));
  let totalFrames = isAnimated
    ? Math.max(16, Math.min(maxFramesCap, Math.round((speed * 1000) / frameDelayMs)))
    : 1;

  // Recalculate exact frame delay to ensure total duration matches speed down to the millisecond
  const delay = Math.max(10, Math.round((speed * 1000) / totalFrames));

  const gif = GIFEncoder();

  const fCanvas = document.createElement('canvas');
  fCanvas.width = gifW;
  fCanvas.height = gifH;
  const fCtx = fCanvas.getContext('2d', { willReadFrequently: true });
  if (!fCtx) {
    throw new Error('Canvas 2D context unavailable for GIF export');
  }
  fCtx.imageSmoothingEnabled = true;
  fCtx.imageSmoothingQuality = 'high';

  // For transparent GIF, avoid diffuse drop-shadows because 1-bit binary alpha cannot fade to transparent and turns into solid contour rings
  const gifFilterRules = [
    `hue-rotate(${adjustments.hue || 0}deg)`,
    `brightness(${adjustments.brightness ?? 100}%)`,
    `saturate(${adjustments.saturation ?? 100}%)`,
    `contrast(${adjustments.contrast ?? 100}%)`,
    `sepia(${adjustments.sepia || 0}%)`,
    `invert(${adjustments.invert || 0}%)`,
    `opacity(${adjustments.opacity ?? 100}%)`,
    (!isTransparent && adjustments.blur > 0) ? `blur(${adjustments.blur * (gifW / 384)}px)` : '',
    (!isTransparent && adjustments.shadowBlur > 0)
      ? `drop-shadow(0px 0px ${adjustments.shadowBlur * (gifW / 384)}px ${adjustments.shadowColor || '#38bdf8'})`
      : ''
  ].filter(Boolean).join(' ');

  // Helper to render a specific animation frame state (t: 0..1)
  function renderFrameAtProgress(t) {
    fCtx.clearRect(0, 0, gifW, gifH);

    // 1. Background
    if (!isTransparent && adjustments.bgShape === 'none') {
      fCtx.fillStyle = '#FFFFFF';
      fCtx.fillRect(0, 0, gifW, gifH);
    }
    if (adjustments.bgShape && adjustments.bgShape !== 'none') {
      drawCanvasBgShape(fCtx, gifW, gifH, adjustments);
    }

    // 2. Compute motion state for this frame across all 14 presets
    let frameAdj = { ...adjustments };
    let offsetY = 0;
    let offsetX = 0;
    let scalePulse = 1;

    if (isAnimated) {
      if (animPreset === 'float') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        offsetY = -sinVal * (animHeight * 1.0) * (gifH / 384);
        if (animShadowSync && (frameAdj.depth3D || 0) > 0) {
          frameAdj.depth3D = (adjustments.depth3D || 10) * Math.max(0.2, (1 - sinVal * 0.35));
        }
      } else if (animPreset === 'bounce') {
        const bounceSin = Math.abs(Math.sin(t * Math.PI));
        offsetY = -bounceSin * (animHeight * 1.5) * (gifH / 384);
        if (bounceSin < 0.25) {
          scalePulse = 1 + (0.25 - bounceSin) * (ampScale * 0.5);
        }
      } else if (animPreset === 'pulse') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        scalePulse = 1 + sinVal * (ampScale * 0.18);
      } else if (animPreset === 'heartbeat') {
        let hb = 0;
        if (t < 0.15) hb = Math.sin((t / 0.15) * Math.PI) * (ampScale * 0.22);
        else if (t >= 0.25 && t < 0.45) hb = Math.sin(((t - 0.25) / 0.2) * Math.PI) * (ampScale * 0.28);
        scalePulse = 1 + hb;
      } else if (animPreset === 'spin360') {
        frameAdj.rotateY = ((adjustments.rotateY || 0) + t * 360) % 360;
        offsetY = -Math.sin(t * 2 * Math.PI) * (animHeight * 0.25) * (gifH / 384);
      } else if (animPreset === 'flip3d') {
        frameAdj.rotateX = ((adjustments.rotateX || 0) + t * 360) % 360;
        offsetY = -Math.sin(t * 2 * Math.PI) * (animHeight * 0.25) * (gifH / 384);
      } else if (animPreset === 'wobble') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        frameAdj.rotateY = (adjustments.rotateY || 0) + sinVal * (ampScale * 18);
        frameAdj.rotateX = (adjustments.rotateX || 0) + cosVal * (ampScale * 12);
      } else if (animPreset === 'twist') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        frameAdj.rotation = (adjustments.rotation || 0) + sinVal * (ampScale * 18);
        frameAdj.rotateY = (adjustments.rotateY || 0) + sinVal * (ampScale * 25);
      } else if (animPreset === 'wave') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetY = -sinVal * (animHeight * 1.0) * (gifH / 384);
        frameAdj.rotation = (adjustments.rotation || 0) + cosVal * (ampScale * 8);
      } else if (animPreset === 'swing') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        frameAdj.rotation = (adjustments.rotation || 0) + sinVal * (ampScale * 16);
        offsetX = sinVal * (animHeight * 0.8) * (gifW / 384);
        offsetY = (1 - Math.cos(t * 2 * Math.PI)) * (animHeight * 0.3) * (gifH / 384);
      } else if (animPreset === 'orbit') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetX = cosVal * (animHeight * 1.0) * (gifW / 384);
        offsetY = -sinVal * (animHeight * 1.0) * (gifH / 384);
        frameAdj.rotation = (adjustments.rotation || 0) + sinVal * (ampScale * 5);
      } else if (animPreset === 'hover3d') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetY = -sinVal * (animHeight * 0.8) * (gifH / 384);
        frameAdj.rotateX = (adjustments.rotateX || 0) + cosVal * (ampScale * 10);
        frameAdj.rotateY = (adjustments.rotateY || 0) - sinVal * (ampScale * 10);
      } else if (animPreset === 'jiggle') {
        const sinVal = Math.sin(t * 6 * Math.PI);
        frameAdj.rotation = (adjustments.rotation || 0) + sinVal * (ampScale * 8);
        scalePulse = 1 + Math.abs(sinVal) * (ampScale * 0.06);
      } else if (animPreset === 'glitch') {
        const gPhase = (t * 3) % 1;
        if (gPhase > 0.65 && gPhase < 0.95) {
          const step = Math.floor((gPhase - 0.65) / 0.05);
          offsetX = (step % 2 === 0 ? -1 : 1) * (animHeight * 0.6) * (gifW / 384);
          offsetY = (step % 2 === 0 ? 1 : -1) * (animHeight * 0.3) * (gifH / 384);
          frameAdj.skewX = (step % 2 === 0 ? -1 : 1) * (ampScale * 8);
        }
      }
    }

    // 3. Render icon for this frame (activates 3D for depth3D, perspective rotation, or 3D presets)
    const rotX = frameAdj.rotateX || 0;
    const rotY = frameAdj.rotateY || 0;
    const rotZ = frameAdj.rotation || 0;
    const skX = frameAdj.skewX || 0;
    const skY = frameAdj.skewY || 0;
    const has3D = rotX !== 0 || rotY !== 0 || skX !== 0 || skY !== 0 ||
      (frameAdj.depth3D || 0) > 0 ||
      (isAnimated && (animPreset === 'spin360' || animPreset === 'wobble' || animPreset === 'flip3d' || animPreset === 'twist' || animPreset === 'hover3d'));

    let paddingRatio = frameAdj.shadowBlur > 0 ? 0.82 : 0.9;
    if (frameAdj.bgShape && frameAdj.bgShape !== 'none') {
      const shapePad = Number(frameAdj.bgShapePadding || 20) / 100;
      paddingRatio = Math.max(0.2, (1 - shapePad * 1.5));
    }
    if (has3D) {
      paddingRatio *= 0.82; // Margin for 3D rotation
    }

    const drawW = gifW * paddingRatio * scalePulse;
    const drawH = gifH * paddingRatio * scalePulse;

    if (has3D) {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = drawW;
      offCanvas.height = drawH;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        offCtx.imageSmoothingEnabled = true;
        offCtx.imageSmoothingQuality = 'high';
        offCtx.filter = gifFilterRules || 'none';
        offCtx.drawImage(img, 0, 0, drawW, drawH);
      }

      const webglCanvas = render3DWithWebGL(offCtx ? offCanvas : img, gifW, gifH, frameAdj, drawW, drawH);
      if (webglCanvas) {
        // Shadow only on solid background or badge shape to avoid 1-bit alpha stepping
        if ((frameAdj.depth3D || 0) > 0 && (!isTransparent || adjustments.bgShape !== 'none')) {
          const depth = (frameAdj.depth3D || 0) * (gifW / 384);
          const radX = (rotX * Math.PI) / 180;
          const radY = (rotY * Math.PI) / 180;
          const shadowOffX = -Math.sin(radY) * depth * 1.5 + offsetX;
          const shadowOffY = Math.sin(radX) * depth * 1.5 + (depth * 0.8) + offsetY;
          const sColor = frameAdj.depth3DColor || 'rgba(0,0,0,0.55)';

          fCtx.save();
          fCtx.filter = `blur(${Math.max(2, Math.round(depth * 0.5))}px) drop-shadow(0 0 ${Math.round(depth * 0.4)}px ${sColor})`;
          fCtx.globalAlpha = 0.55;
          fCtx.drawImage(webglCanvas, shadowOffX, shadowOffY);
          fCtx.restore();
        }

        // Icon with levitation offsetX & offsetY
        fCtx.save();
        fCtx.drawImage(webglCanvas, offsetX, offsetY);
        fCtx.restore();
      }
    } else {
      // 2D frame
      fCtx.save();
      fCtx.filter = gifFilterRules || 'none';
      fCtx.translate(gifW / 2 + offsetX, gifH / 2 + offsetY);
      fCtx.rotate((rotZ * Math.PI) / 180);
      fCtx.scale(frameAdj.flipH ? -1 : 1, frameAdj.flipV ? -1 : 1);
      fCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      fCtx.restore();
    }
  }

  // 1. Pre-pass Palette Sampling:
  // Sample keyframes across the animation cycle without holding all full-resolution frames in memory
  const sampleTimes = isAnimated ? [0, 0.25, 0.5, 0.75, 0.9] : [0];
  const sampledSolidPixels = [];
  const pixelStep = Math.max(4, Math.round(gifW / 128));

  sampleTimes.forEach((sampleT) => {
    renderFrameAtProgress(sampleT);
    const imgData = fCtx.getImageData(0, 0, gifW, gifH);
    const rgba = imgData.data;
    const totalPixels = rgba.length >> 2;
    for (let p = 0; p < totalPixels; p += pixelStep) {
      const i = p << 2;
      const a = rgba[i + 3];
      if (!isTransparent || a >= 128) {
        sampledSolidPixels.push(rgba[i], rgba[i + 1], rgba[i + 2], 255);
      }
    }
  });

  const maxColors = isTransparent ? 255 : 256;
  const rawPalette = generateMedianCutPalette(
    sampledSolidPixels.length ? sampledSolidPixels : [255, 255, 255, 255],
    maxColors
  );
  const globalPalette = isTransparent ? [[0, 0, 0], ...rawPalette] : rawPalette;

  // Precompute 65,536 RGB565 LUT for ultra-fast color matching (~40ms once)
  const lut = buildColorLUT(rawPalette);

  // 2. Stream-Encode Each Frame Directly:
  // Processes one frame at a time into the GIF stream so 2K, 4K, and 8K never exhaust browser RAM
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = isAnimated ? (frame / totalFrames) : 0;
    renderFrameAtProgress(t);

    const imgData = fCtx.getImageData(0, 0, gifW, gifH);
    const rgba = imgData.data;
    const index = new Uint8Array(gifW * gifH);

    for (let y = 0; y < gifH; y++) {
      const rowOffset = y * gifW;
      const bayerRow = BAYER_8X8[y & 7];
      for (let x = 0; x < gifW; x++) {
        const pixelIdx = rowOffset + x;
        const i = pixelIdx << 2;
        const a = rgba[i + 3];

        if (isTransparent && a < 128) {
          index[pixelIdx] = 0; // Reserved transparent slot
          continue;
        }

        // Ordered dither: deterministic offset per screen pixel (eliminates banding lines without temporal flicker)
        const dither = (bayerRow[x & 7] / 64 - 0.5) * 8;
        const r = Math.min(255, Math.max(0, rgba[i] + dither));
        const g = Math.min(255, Math.max(0, rgba[i + 1] + dither * 0.7));
        const b = Math.min(255, Math.max(0, rgba[i + 2] + dither));

        const key = ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3);
        const palIdx = lut[key];

        index[pixelIdx] = isTransparent ? (palIdx + 1) : palIdx;
      }
    }

    gif.writeFrame(index, gifW, gifH, { 
      palette: globalPalette, 
      delay: isAnimated ? delay : 100, 
      transparent: isTransparent,
      transparentIndex: isTransparent ? 0 : -1,
      dispose: 2
    });
  }

  gif.finish();
  const buffer = gif.bytes();
  const blob = new Blob([buffer], { type: 'image/gif' });
  await triggerDownload(blob, `${safeFilename}-${gifW}x${gifH}.gif`);
  URL.revokeObjectURL(blobUrl);
  return true;
}

async function triggerDownload(blob, fullFilename) {
  // Helper to convert Blob to pure base64 string
  const getBase64 = () => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = typeof dataUrl === 'string' && dataUrl.includes(',')
        ? dataUrl.split(',')[1]
        : dataUrl;
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });

  // 1. Android APK Native Direct Download: saves straight to device's public Downloads folder without any share screen!
  if (typeof window !== 'undefined' && window.AndroidNativeDownloader && typeof window.AndroidNativeDownloader.downloadFile === 'function') {
    try {
      const base64Data = await getBase64();
      window.AndroidNativeDownloader.downloadFile(base64Data, fullFilename, blob.type || 'image/png');
      return;
    } catch (err) {
      console.warn('AndroidNativeDownloader error, falling back:', err);
    }
  }

  // 2. Native Capacitor Filesystem fallback (save directly to Documents without share dialog)
  const isNative = typeof window !== 'undefined' && (
    window.Capacitor?.isNativePlatform?.() ||
    document.documentElement.classList.contains('is-native-capacitor')
  );

  if (isNative) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const base64Data = await getBase64();
      await Filesystem.writeFile({
        path: fullFilename,
        data: base64Data,
        directory: Directory.Documents
      });
      return;
    } catch (nativeErr) {
      console.warn('Capacitor Filesystem direct save error:', nativeErr);
    }
  }

  // 3. Default for all devices (PC, Mac, Linux, Android/iOS Browsers):
  // Directly downloads straight to the device's default Downloads folder without any share sheet!
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }, 250);
}