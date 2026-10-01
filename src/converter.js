import { replaceSvgColors, applyUniversalStroke } from './colorUtils';
import { transformSvgStyle } from './styleTransformer';
import { applyLayerTransforms, extractSvgLayers } from './layerUtils';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/**
 * Converts a 2D canvas to a Uint8Array containing pure PNG binary data
 */
export function canvasToPngBytes(canvas) {
  const dataUrl = canvas.toDataURL('image/png');
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Packs multiple PNG images into a standard Microsoft Windows .ICO file blob
 * Fully valid in all modern browsers, Windows Explorer, and design software
 * @param {Array<{ width: number, height: number, data: Uint8Array }>} images
 * @returns {Blob}
 */
export function createIcoBlob(images) {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  let totalSize = headerSize;
  for (const img of images) {
    totalSize += img.data.byteLength;
  }

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // 1. ICONDIR Header (6 bytes)
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Type 1 = Icon (.ico)
  view.setUint16(4, count, true); // Number of images

  // 2. ICONDIRENTRY list (16 bytes each)
  let currentOffset = headerSize;
  let entryOffset = 6;

  for (const img of images) {
    const w = img.width >= 256 ? 0 : img.width;
    const h = img.height >= 256 ? 0 : img.height;
    view.setUint8(entryOffset + 0, w); // Width
    view.setUint8(entryOffset + 1, h); // Height
    view.setUint8(entryOffset + 2, 0); // Color palette count (0 = no palette / 32bpp)
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes (1)
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel (32-bit RGBA)
    view.setUint32(entryOffset + 8, img.data.byteLength, true); // Size of image data
    view.setUint32(entryOffset + 12, currentOffset, true); // File offset of image data

    // Copy PNG data into the buffer
    new Uint8Array(buffer, currentOffset, img.data.byteLength).set(img.data);

    currentOffset += img.data.byteLength;
    entryOffset += 16;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}

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
  onProgress = null,
  shouldCancel = null,
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
  const isIco = format === 'ico';
  const requestedSize = Math.min(width || size, maxSafeDim);
  // For ICO, always render the master SVG raster canvas at a high-res 1024x1024
  // so downscaled icon mipmaps (512, 256, 128, 64, 48, 32, 16) have crystal-clear vector fidelity!
  const targetWidth = isIco ? 1024 : requestedSize;
  const targetHeight = isIco ? 1024 : Math.min(height || size, maxSafeDim);
  const baseFilename = autoTagDimensions ? `${safeFilename}-${requestedSize}x${requestedSize}` : safeFilename;

  // DIRECT PURE VECTOR SVG EXPORT
  if (format === 'svg') {
    if (shouldCancel && shouldCancel()) throw new Error('EXPORT_CANCELLED');
    if (onProgress) onProgress({ percent: 30, stage: 'Preparing Pure Vector SVG...', details: `${targetWidth}×${targetHeight} SVG` });
    await new Promise(r => setTimeout(r, 0));

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

    // Note: Background badge shape is now embedded directly in prepareSvgWithAdjustments

    if (onProgress) onProgress({ percent: 85, stage: 'Generating SVG File...', details: `${baseFilename}.svg` });
    await new Promise(r => setTimeout(r, 0));

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    await triggerDownload(blob, `${baseFilename}.svg`);

    if (onProgress) onProgress({ percent: 100, stage: 'Export Complete!', details: 'Vector SVG saved successfully' });
    return true;
  }

  return new Promise((resolve, reject) => {
    if (shouldCancel && shouldCancel()) {
      reject(new Error('EXPORT_CANCELLED'));
      return;
    }
    if (onProgress) onProgress({ percent: 15, stage: 'Preparing Artwork Canvas...', details: `${targetWidth}×${targetHeight}` });

    // Pass targetWidth and targetHeight so SVG root element has native resolution attributes
    // forVectorSvgExport is false so raster image has clean, untransformed vector paths
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight, false);

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = async () => {
      if (onProgress) onProgress({ percent: 25, stage: 'Rasterizing Vector Elements...', details: `${targetWidth}×${targetHeight}` });
      await new Promise(r => setTimeout(r, 0));

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
      if (format === 'jpeg' || !isTransparent) {
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
      // Note: Background Badge Shape is embedded directly into the SVG artwork composite

      // 3. Scale blur and glow relative to preview baseline (384px) with safe hardware kernel caps
      // Massive unconstrained blur kernels at 8K crash Chromium/Safari's Skia 2D rasterizer due to OOM
      const scaleFactor = Math.max(targetWidth, targetHeight) / 384;
      const maxGlowRadius = Math.min(72, 18 + scaleFactor * 2.5);
      const scaledGlow = adjustments.shadowBlur > 0 
        ? Math.min(adjustments.shadowBlur * scaleFactor, maxGlowRadius)
        : 0;
      const maxBlurRadius = Math.min(48, (adjustments.blur || 0) * scaleFactor);
      const scaledBlur = adjustments.blur > 0 ? maxBlurRadius : 0;

      const filterRulesArr = [
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
      ];

      if ((adjustments.extrusionDepth || 0) > 0) {
        const extDepth = Math.min(40, Math.round(adjustments.extrusionDepth * (targetWidth / 384)));
        const extColor = adjustments.extrusionColor || 'rgba(0,0,0,0.65)';
        const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
        const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
        let dirX = -Math.sin(radY) * 1.2 || 0.7;
        let dirY = Math.sin(radX) * 1.2 || 0.7;
        const len = Math.hypot(dirX, dirY) || 1;
        const normX = dirX / len;
        const normY = dirY / len;
        const steps = extDepth <= 4
          ? Array.from({ length: extDepth }, (_, i) => i + 1)
          : [1, Math.round(extDepth * 0.35), Math.round(extDepth * 0.7), extDepth];
        steps.forEach(s => {
          const sx = (normX * s).toFixed(1);
          const sy = (normY * s).toFixed(1);
          filterRulesArr.push(`drop-shadow(${sx}px ${sy}px 0px ${extColor})`);
        });
        const endX = (normX * extDepth).toFixed(1);
        const endY = (normY * extDepth + 2).toFixed(1);
        const blur = Math.max(2, Math.round(extDepth * 0.35));
        filterRulesArr.push(`drop-shadow(${endX}px ${endY}px ${blur}px rgba(0,0,0,0.45))`);
      }

      const filterRules = filterRulesArr.filter(Boolean).join(' ');

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
          blobUrl,
          onProgress,
          shouldCancel
        }).then(() => resolve(true)).catch((err) => {
          URL.revokeObjectURL(blobUrl);
          reject(err);
        });
        return;
      }

      // 4. Transformations (Rotation, Scale, 3D Perspective & Skew, XYZ Translation)
      const rotX = adjustments.rotateX || 0;
      const rotY = adjustments.rotateY || 0;
      const rotZ = adjustments.rotation || 0;
      const skX = adjustments.skewX || 0;
      const skY = adjustments.skewY || 0;
      const trX = adjustments.translateX || 0;
      const trY = adjustments.translateY || 0;
      const trZ = adjustments.translateZ || 0;
      const has3D = rotX !== 0 || rotY !== 0 || skX !== 0 || skY !== 0 || trZ !== 0;

      // Icon Padding / Inset:
      // Default to 1.0 (edge-to-edge, zero artificial white padding/shrinkage).
      // Only reduce padding when shadow blur, container badge shapes, or 3D tilt would otherwise clip outside canvas.
      let paddingRatio = 1.0;
      const hasAnyBlurOrGlow = Boolean(
        adjustments.shadowBlur > 0 ||
        adjustments.blur > 0 ||
        (adjustments.extrusionDepth && adjustments.extrusionDepth > 0) ||
        (adjustments.layerStyles && Object.values(adjustments.layerStyles).some(s => (s?.glow?.enabled && (s.glow.radius || 12) > 0) || (s?.blur && Number(s.blur) > 0)))
      );
      if (format === 'ico') {
        paddingRatio = has3D ? 0.85 : 0.98; // Desktop icons fill 98% of the canvas edge-to-edge!
      } else if (hasAnyBlurOrGlow) {
        paddingRatio = 0.92;
      }
      if (has3D) {
        // Tilted 3D corners expand along Z-perspective; 0.76 ensures zero edge clipping
        paddingRatio = Math.min(paddingRatio, (adjustments.extrusionDepth > 0 ? 0.72 : 0.76));
      } else if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        paddingRatio = hasAnyBlurOrGlow ? 0.92 : 0.96;
      }

      const drawWidth = targetWidth * paddingRatio;
      const drawHeight = targetHeight * paddingRatio;

      if (!has3D) {
        // Fast 2D Vector Path: zero 3D matrix needed
        const scaleFactor = targetWidth / 384;
        ctx.save();
        ctx.filter = filterRules || 'none';
        ctx.translate((targetWidth / 2) + (trX * scaleFactor), (targetHeight / 2) + (trY * scaleFactor));
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

      // ICO Multi-Resolution Windows / Favicon Package Branch
      if (format === 'ico') {
        if (shouldCancel && shouldCancel()) {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('EXPORT_CANCELLED'));
          return;
        }

        if (onProgress) onProgress({ percent: 88, stage: 'Building High-Definition .ICO Package...', details: '512px, 256px, 128px, 64px, 48px, 32px, 16px' });
        await new Promise(r => setTimeout(r, 0));

        try {
          // Standard Windows & Web Favicon sizes in DESCENDING order (largest first!)
          // Crucial: Image #0 must be the highest resolution (512px / 256px) so image viewers, Photos app, and browsers display Full HD!
          const allIcoSizes = [512, 256, 128, 64, 48, 32, 16];
          const targetSz = Math.min(512, Math.max(16, requestedSize || 256));
          const icoSizes = allIcoSizes.filter(s => s <= targetSz);
          if (icoSizes.length === 0) icoSizes.push(targetSz);

          // Step-down downsampling canvas map for ultra-crisp mipmapping (prevents bilinear skip blur)
          const sizeCanvases = {};
          let prevCanvas = canvas; // Master canvas is 1024x1024

          for (const s of allIcoSizes) {
            const sc = document.createElement('canvas');
            sc.width = s;
            sc.height = s;
            const sCtx = sc.getContext('2d');
            sCtx.imageSmoothingEnabled = true;
            sCtx.imageSmoothingQuality = 'high';
            // Downsample in smooth 2x steps (or from 128 for 48px)
            const src = (s === 48) ? (sizeCanvases[128] || canvas) : prevCanvas;
            sCtx.drawImage(src, 0, 0, s, s);
            sizeCanvases[s] = sc;
            if (s !== 48) {
              prevCanvas = sc;
            }
          }

          const images = [];
          for (const sz of icoSizes) {
            const sc = sizeCanvases[sz];
            if (sc) {
              const pngBytes = canvasToPngBytes(sc);
              images.push({ width: sz, height: sz, data: pngBytes });
            }
          }

          if (images.length === 0) {
            const pngBytes = canvasToPngBytes(canvas);
            images.push({ width: targetSz, height: targetSz, data: pngBytes });
          }

          const icoBlob = createIcoBlob(images);
          URL.revokeObjectURL(blobUrl);

          const icoFilename = autoTagDimensions
            ? (targetSz >= 256 ? `${safeFilename}-favicon.ico` : `${safeFilename}-${targetSz}x${targetSz}.ico`)
            : `${safeFilename}.ico`;

          if (onProgress) onProgress({ percent: 96, stage: 'Saving High-Res .ICO File...', details: icoFilename });
          await triggerDownload(icoBlob, icoFilename);
          if (onProgress) onProgress({ percent: 100, stage: 'Export Complete!', details: 'High-Res .ICO icon saved successfully' });
          resolve(true);
          return;
        } catch (err) {
          URL.revokeObjectURL(blobUrl);
          reject(err);
          return;
        }
      }

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const compressionQuality = Math.max(0.1, Math.min(1.0, Number(quality) || 0.92));

      if (shouldCancel && shouldCancel()) {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('EXPORT_CANCELLED'));
        return;
      }

      if (onProgress) onProgress({ percent: 85, stage: `Generating ${format.toUpperCase()} (${targetWidth >= 1024 ? `${targetWidth / 1024}K` : `${targetWidth}px`})...`, details: 'Encoding raster data' });
      await new Promise(r => setTimeout(r, 0));

      canvas.toBlob(async (resBlob) => {
        URL.revokeObjectURL(blobUrl);
        if (resBlob) {
          try {
            if (onProgress) onProgress({ percent: 96, stage: 'Saving File...', details: `${baseFilename}.${format}` });
            await triggerDownload(resBlob, `${baseFilename}.${format}`);
            if (onProgress) onProgress({ percent: 100, stage: 'Export Complete!', details: 'File saved successfully' });
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

function embedBadgeShapeIntoSvg(svgCode, adjustments, width, height) {
  const shape = adjustments.bgShape;
  if (!shape || shape === 'none') return svgCode;

  const color = adjustments.bgShapeColor || '#1e293b';
  const borderWidth = Number(adjustments.bgShapeBorder || 0);
  const borderColor = adjustments.bgShapeBorderColor || '#38bdf8';
  // Matches App.jsx padding formula: bgShapePadding * 0.7 %
  const padPercent = Math.max(0, Math.min(45, Number(adjustments.bgShapePadding ?? 20) * 0.7));
  const baseDim = 1000;
  const strokeW = borderWidth > 0 ? Math.max(1, (borderWidth * baseDim) / (width || 384)) : 0;
  const halfStroke = strokeW / 2;

  let shapeElement = '';
  let clipDef = '';
  let clipAttr = '';

  if (shape === 'circle') {
    const r = baseDim / 2 - halfStroke;
    shapeElement = `<circle cx="500" cy="500" r="${r}" fill="${color}" ${strokeW > 0 ? `stroke="${borderColor}" stroke-width="${strokeW}"` : ''}/>`;
  } else if (shape === 'squircle') {
    // 28% radius squircle accurately mirrors the screen's iOS squircle
    const r = baseDim * 0.28;
    shapeElement = `<rect x="${halfStroke}" y="${halfStroke}" width="${baseDim - strokeW}" height="${baseDim - strokeW}" rx="${r}" ry="${r}" fill="${color}" ${strokeW > 0 ? `stroke="${borderColor}" stroke-width="${strokeW}"` : ''}/>`;
  } else if (shape === 'rounded-square') {
    // 16% radius rounded square
    const r = baseDim * 0.16;
    shapeElement = `<rect x="${halfStroke}" y="${halfStroke}" width="${baseDim - strokeW}" height="${baseDim - strokeW}" rx="${r}" ry="${r}" fill="${color}" ${strokeW > 0 ? `stroke="${borderColor}" stroke-width="${strokeW}"` : ''}/>`;
  } else if (shape === 'hexagon') {
    const pts = `500,${halfStroke} ${baseDim - halfStroke},250 ${baseDim - halfStroke},750 500,${baseDim - halfStroke} ${halfStroke},750 ${halfStroke},250`;
    clipDef = `<clipPath id="iconderry-hex-clip"><polygon points="${pts}"/></clipPath>`;
    clipAttr = `clip-path="url(#iconderry-hex-clip)"`;
    shapeElement = `<polygon points="${pts}" fill="${color}" ${strokeW > 0 ? `stroke="${borderColor}" stroke-width="${strokeW}"` : ''}/>`;
  } else {
    // Standard rectangle
    shapeElement = `<rect x="${halfStroke}" y="${halfStroke}" width="${baseDim - strokeW}" height="${baseDim - strokeW}" fill="${color}" ${strokeW > 0 ? `stroke="${borderColor}" stroke-width="${strokeW}"` : ''}/>`;
  }

  // Calculate inner SVG padding offset and dimension
  const padOffset = Math.round((baseDim * padPercent) / 100);
  const innerDim = Math.max(10, baseDim - padOffset * 2);

  // Nest the inner SVG without stripping child elements, preserving inner viewBox and coordinate systems
  let innerSvg = svgCode.replace(/<svg\b([^>]*)>/i, (m, attrs) => {
    let cleanAttrs = attrs
      .replace(/\b(x|y|width|height)="[^"]*"/gi, '')
      .replace(/\b(x|y|width|height)=[^\s>]+/gi, '');
    return `<svg x="${padOffset}" y="${padOffset}" width="${innerDim}" height="${innerDim}" overflow="visible"${cleanAttrs}>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseDim} ${baseDim}" width="${width || 512}" height="${height || 512}" overflow="visible" ${clipAttr}>
  <defs>${clipDef}</defs>
  ${shapeElement}
  ${innerSvg}
</svg>`;
}

function prepareSvgWithAdjustments(svgCode, adjustments = {}, targetWidth, targetHeight, forVectorSvgExport = false) {
  let res = svgCode;
  if (!res.includes('xmlns=')) {
    res = res.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Embed Google Fonts stylesheet into SVG when text elements are present
  if (res.includes('<text') && !res.includes('fonts.googleapis.com')) {
    const fontImport = `<defs><style>@import url('https://fonts.googleapis.com/css2?family=Bangers&amp;family=Bebas+Neue&amp;family=Cinzel:wght@600;800&amp;family=Fredoka:wght@600;700&amp;family=Inter:wght@600;800&amp;family=Montserrat:wght@600;800&amp;family=Orbitron:wght@600;800&amp;family=Outfit:wght@600;800&amp;family=Pacifico&amp;family=Permanent+Marker&amp;family=Playfair+Display:wght@700&amp;family=Righteous&amp;family=Russo+One&amp;family=Space+Grotesk:wght@600;700&amp;display=swap');</style></defs>`;
    res = res.replace(/<svg\b([^>]*)>/i, `<svg$1>${fontImport}`);
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

  // Embed Background Badge Shape directly into the SVG composite before 3D transformations
  if (adjustments.bgShape && adjustments.bgShape !== 'none') {
    res = embedBadgeShapeIntoSvg(res, adjustments, targetWidth, targetHeight);
  }

  // 3D & 2D Vector Transform & Filter Embedding for Direct SVG Export
  if (forVectorSvgExport) {
    const rotX = adjustments.rotateX || 0;
    const rotY = adjustments.rotateY || 0;
    const rotZ = adjustments.rotation || 0;
    const skX = adjustments.skewX || 0;
    const skY = adjustments.skewY || 0;
    const trX = adjustments.translateX || 0;
    const trY = adjustments.translateY || 0;
    const trZ = adjustments.translateZ || 0;
    const persp = adjustments.perspective || 800;
    const flipH = adjustments.flipH ? -1 : 1;
    const flipV = adjustments.flipV ? -1 : 1;

    const svgFilterParts = [];
    if (adjustments.hue) svgFilterParts.push(`hue-rotate(${adjustments.hue}deg)`);
    if (adjustments.brightness !== undefined && adjustments.brightness !== 100) svgFilterParts.push(`brightness(${adjustments.brightness}%)`);
    if (adjustments.saturation !== undefined && adjustments.saturation !== 100) svgFilterParts.push(`saturate(${adjustments.saturation}%)`);
    if (adjustments.contrast !== undefined && adjustments.contrast !== 100) svgFilterParts.push(`contrast(${adjustments.contrast}%)`);
    if (adjustments.sepia) svgFilterParts.push(`sepia(${adjustments.sepia}%)`);
    if (adjustments.invert) svgFilterParts.push(`invert(${adjustments.invert}%)`);
    if (adjustments.opacity !== undefined && adjustments.opacity !== 100) svgFilterParts.push(`opacity(${adjustments.opacity}%)`);
    if (adjustments.blur > 0) svgFilterParts.push(`blur(${adjustments.blur}px)`);
    if (adjustments.shadowBlur > 0) {
      svgFilterParts.push(`drop-shadow(0 0 ${adjustments.shadowBlur}px ${adjustments.shadowColor || '#38bdf8'})`);
    }
    if ((adjustments.extrusionDepth || 0) > 0) {
      const extDepth = Math.min(40, Math.round(adjustments.extrusionDepth));
      const extColor = adjustments.extrusionColor || 'rgba(0,0,0,0.65)';
      const radX = (rotX * Math.PI) / 180;
      const radY = (rotY * Math.PI) / 180;
      let dirX = -Math.sin(radY) * 1.2 || 0.7;
      let dirY = Math.sin(radX) * 1.2 || 0.7;
      const len = Math.hypot(dirX, dirY) || 1;
      const normX = dirX / len;
      const normY = dirY / len;
      const steps = extDepth <= 4
        ? Array.from({ length: extDepth }, (_, i) => i + 1)
        : [1, Math.round(extDepth * 0.35), Math.round(extDepth * 0.7), extDepth];
      steps.forEach(s => {
        const sx = (normX * s).toFixed(1);
        const sy = (normY * s).toFixed(1);
        svgFilterParts.push(`drop-shadow(${sx}px ${sy}px 0px ${extColor})`);
      });
      const endX = (normX * extDepth).toFixed(1);
      const endY = (normY * extDepth + 2).toFixed(1);
      const blur = Math.max(2, Math.round(extDepth * 0.35));
      svgFilterParts.push(`drop-shadow(${endX}px ${endY}px ${blur}px rgba(0,0,0,0.45))`);
    }
    const svgFilterStr = svgFilterParts.filter(Boolean).join(' ');

    const hasAnyTransform = trX !== 0 || trY !== 0 || trZ !== 0 || rotX !== 0 || rotY !== 0 || rotZ !== 0 || skX !== 0 || skY !== 0 || flipH !== 1 || flipV !== 1;
    if (hasAnyTransform || svgFilterStr) {
      const firstClose = res.indexOf('>');
      const lastOpen = res.lastIndexOf('</svg>');
      if (firstClose !== -1 && lastOpen !== -1) {
        const svgOpen = res.substring(0, firstClose + 1);
        const inner = res.substring(firstClose + 1, lastOpen);
        const transformCss = hasAnyTransform
          ? `transform-box: fill-box; transform-origin: center; transform: translate(${trX}px, ${trY}px) perspective(${persp}px) translateZ(${trZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(${rotZ}deg) skew(${skX}deg, ${skY}deg) scale(${flipH}, ${flipV});`
          : '';
        const filterCss = svgFilterStr ? `filter: ${svgFilterStr};` : '';
        res = `${svgOpen}
  <g style="${transformCss} ${filterCss}">
    ${inner}
  </g>
</svg>`;
      }
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
          vec4 p = u_matrix * vec4(a_position, 0.0, 1.0);
          float safeW = max(p.w, 0.001);
          gl_Position = vec4(p.xy, 0.0, safeW);
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

  // Translation XYZ (normalized to canvas resolution)
  const trX = (adjustments.translateX || 0) * (targetWidth / 384);
  const trY = (adjustments.translateY || 0) * (targetHeight / 384);
  const trZ = (adjustments.translateZ || 0) * (targetWidth / 384);
  const Txyz = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    trX, trY, trZ, 1
  ]);

  // Perspective & NDC projection (maps to [-1, 1] device coordinates without clipping Z)
  const P = new Float32Array([
    2 / targetWidth, 0, 0, 0,
    0, -2 / targetHeight, 0, 0,
    0, 0, 0, -1 / persp,
    0, 0, 0, 1
  ]);

  const m1 = new Float32Array(16);
  mat4Multiply(m1, Mskew, Sflip);

  const m2 = new Float32Array(16);
  mat4Multiply(m2, Rz, m1);

  const m3 = new Float32Array(16);
  mat4Multiply(m3, Ry, m2);

  const m4 = new Float32Array(16);
  mat4Multiply(m4, Rx, m3);

  const m5 = new Float32Array(16);
  mat4Multiply(m5, Txyz, m4);

  const M = new Float32Array(16);
  mat4Multiply(M, P, m5);

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

// Precomputed 1D Bayer dither lookup table for 5x faster inner-loop pixel dithering
const BAYER_DITHER = new Float32Array(64);
for (let r = 0; r < 8; r++) {
  for (let c = 0; c < 8; c++) {
    BAYER_DITHER[(r << 3) | c] = (BAYER_8X8[r][c] / 64 - 0.5) * 8;
  }
}

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
  blobUrl,
  onProgress,
  shouldCancel
}) {
  // GIF Resolution & Performance Optimizer:
  // GIF uses an 8-bit palette with uncompressed frame streams. Capping to 1280px (Super HD)
  // keeps rendering ultra-fast (2-3 seconds total), avoids any browser hang, keeps file sizes
  // under 8-12MB for instant sharing, and renders ultra-crisp vectors on all 4K/Retina displays.
  const rawTargetW = targetWidth || 512;
  const rawTargetH = targetHeight || 512;
  const maxGifDim = 1280;
  const gifScale = Math.min(1, maxGifDim / Math.max(rawTargetW, rawTargetH));
  const gifW = Math.round(rawTargetW * gifScale);
  const gifH = Math.round(rawTargetH * gifScale);

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
  // Optimized frame count for silky smooth looping while rendering 5x faster
  const maxFramesCap = gifW >= 1024 ? 20 : (fps >= 60 ? 36 : (fps >= 30 ? 28 : 20));
  let totalFrames = isAnimated
    ? Math.max(14, Math.min(maxFramesCap, Math.round((speed * 1000) / frameDelayMs)))
    : 1;

  // Recalculate exact frame delay to ensure total duration matches speed down to the millisecond
  const delay = Math.max(10, Math.round((speed * 1000) / totalFrames));

  if (onProgress) {
    onProgress({
      percent: 5,
      stage: 'Initializing GIF Engine...',
      details: `${gifW}×${gifH} · ${totalFrames} frames`
    });
  }
  await new Promise(resolve => setTimeout(resolve, 0));

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
  const gifFilterRulesArr = [
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
  ];

  if ((adjustments.extrusionDepth || 0) > 0) {
    const extDepth = Math.min(40, Math.round(adjustments.extrusionDepth * (gifW / 384)));
    const extColor = adjustments.extrusionColor || 'rgba(0,0,0,0.65)';
    const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
    const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
    let dirX = -Math.sin(radY) * 1.2 || 0.7;
    let dirY = Math.sin(radX) * 1.2 || 0.7;
    const len = Math.hypot(dirX, dirY) || 1;
    const normX = dirX / len;
    const normY = dirY / len;
    const steps = extDepth <= 4
      ? Array.from({ length: extDepth }, (_, i) => i + 1)
      : [1, Math.round(extDepth * 0.35), Math.round(extDepth * 0.7), extDepth];
    steps.forEach(s => {
      const sx = (normX * s).toFixed(1);
      const sy = (normY * s).toFixed(1);
      gifFilterRulesArr.push(`drop-shadow(${sx}px ${sy}px 0px ${extColor})`);
    });
    const endX = (normX * extDepth).toFixed(1);
    const endY = (normY * extDepth + 2).toFixed(1);
    const blur = Math.max(2, Math.round(extDepth * 0.35));
    gifFilterRulesArr.push(`drop-shadow(${endX}px ${endY}px ${blur}px rgba(0,0,0,0.45))`);
  }

  const gifFilterRules = gifFilterRulesArr.filter(Boolean).join(' ');

  // Intermediate texture canvas holding the complete rasterized graphic with filters (glow, extrusion wall shadow)
  const is3DActive = (adjustments.rotateX || 0) !== 0 || (adjustments.rotateY || 0) !== 0 || (adjustments.skewX || 0) !== 0 || (adjustments.skewY || 0) !== 0;
  const paddingRatio = is3DActive ? (adjustments.extrusionDepth > 0 ? 0.72 : 0.76) : 0.90;
  const drawW = gifW * paddingRatio;
  const drawH = gifH * paddingRatio;
  const glowPad = Math.round(Math.max(drawW, drawH) * 0.18);
  const rawTexW = Math.round(drawW + glowPad * 2);
  const rawTexH = Math.round(drawH + glowPad * 2);

  const gifOffCanvas = document.createElement('canvas');
  gifOffCanvas.width = rawTexW;
  gifOffCanvas.height = rawTexH;
  const gifOffCtx = gifOffCanvas.getContext('2d');
  if (gifOffCtx) {
    gifOffCtx.imageSmoothingEnabled = true;
    gifOffCtx.imageSmoothingQuality = 'high';
    gifOffCtx.filter = gifFilterRules || 'none';
    gifOffCtx.drawImage(img, glowPad, glowPad, drawW, drawH);
  }

  // Helper to render a specific animation frame state (t: 0..1)
  function renderFrameAtProgress(t) {
    fCtx.clearRect(0, 0, gifW, gifH);

    // 1. Background
    if (!isTransparent) {
      fCtx.fillStyle = '#FFFFFF';
      fCtx.fillRect(0, 0, gifW, gifH);
    }

    // 2. Compute motion state for this frame across all presets
    let frameAdj = { ...adjustments };
    let offsetY = 0;
    let offsetX = 0;
    let scalePulseX = 1;
    let scalePulseY = 1;
    let rotZ = frameAdj.rotation || 0;
    let skewX = 0;

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
          const squash = (0.25 - bounceSin) * (ampScale * 0.5);
          scalePulseX = 1 + squash;
          scalePulseY = 1 - squash;
        }
      } else if (animPreset === 'pulse') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        scalePulseX = 1 + sinVal * (ampScale * 0.18);
        scalePulseY = scalePulseX;
      } else if (animPreset === 'heartbeat') {
        let hb = 0;
        if (t < 0.14) {
          hb = Math.sin((t / 0.14) * Math.PI) * (ampScale * 0.22);
        } else if (t >= 0.28 && t < 0.42) {
          hb = Math.sin(((t - 0.28) / 0.14) * Math.PI) * (ampScale * 0.28);
        }
        scalePulseX = 1 + hb;
        scalePulseY = 1 + hb;
      } else if (animPreset === 'spin360') {
        offsetY = -Math.sin(t * 2 * Math.PI) * (animHeight * 0.2) * (gifH / 384);
      } else if (animPreset === 'flip3d') {
        offsetY = -Math.sin(t * 2 * Math.PI) * (animHeight * 0.2) * (gifH / 384);
      } else if (animPreset === 'wobble') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        rotZ = (frameAdj.rotation || 0) + sinVal * (ampScale * 8);
        scalePulseX = 1 + sinVal * (ampScale * 0.12);
        scalePulseY = 1 + cosVal * (ampScale * 0.08);
        skewX = sinVal * (ampScale * 6);
        offsetY = -cosVal * (animHeight * 0.3) * (gifH / 384);
      } else if (animPreset === 'twist') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        rotZ = (frameAdj.rotation || 0) + sinVal * (ampScale * 18);
        scalePulseX = 1 - Math.abs(sinVal) * (ampScale * 0.22);
        scalePulseY = 1 + Math.abs(sinVal) * (ampScale * 0.08);
        offsetY = -sinVal * (animHeight * 0.2) * (gifH / 384);
      } else if (animPreset === 'wave') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetY = -sinVal * (animHeight * 1.0) * (gifH / 384);
        rotZ = (frameAdj.rotation || 0) + cosVal * (ampScale * 8);
      } else if (animPreset === 'swing') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        rotZ = (frameAdj.rotation || 0) + sinVal * (ampScale * 16);
      } else if (animPreset === 'orbit') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetX = cosVal * (animHeight * 1.0) * (gifW / 384);
        offsetY = -sinVal * (animHeight * 1.0) * (gifH / 384);
        curRotZ = (frameAdj.rotation || 0) + sinVal * (ampScale * 5);
      } else if (animPreset === 'hover3d') {
        const sinVal = Math.sin(t * 2 * Math.PI);
        const cosVal = Math.cos(t * 2 * Math.PI);
        offsetY = -sinVal * (animHeight * 0.8) * (gifH / 384);
        rotZ = (frameAdj.rotation || 0) - sinVal * (ampScale * 4);
      } else if (animPreset === 'jiggle') {
        const sinVal = Math.sin(t * 6 * Math.PI);
        rotZ = (frameAdj.rotation || 0) + sinVal * (ampScale * 8);
        scalePulseX = 1 + Math.abs(sinVal) * (ampScale * 0.06);
        scalePulseY = scalePulseX;
      } else if (animPreset === 'glitch') {
        const gPhase = (t * 3) % 1;
        if (gPhase > 0.65 && gPhase < 0.95) {
          const step = Math.floor((gPhase - 0.65) / 0.05);
          offsetX = (step % 2 === 0 ? -1 : 1) * (animHeight * 0.6) * (gifW / 384);
          offsetY = (step % 2 === 0 ? 1 : -1) * (animHeight * 0.3) * (gifH / 384);
          skewX = (step % 2 === 0 ? -1 : 1) * (ampScale * 8);
        }
      }
    }

    // 3. Current 3D Orientation
    let curRotX = adjustments.rotateX || 0;
    let curRotY = adjustments.rotateY || 0;
    let curRotZ = rotZ;
    let totalSkewX = skewX + (adjustments.skewX || 0);
    let totalSkewY = adjustments.skewY || 0;

    if (animPreset === 'spin360') {
      curRotY += t * 360;
    } else if (animPreset === 'flip3d') {
      curRotX += t * 360;
    } else if (animPreset === 'hover3d') {
      curRotX += Math.sin(t * 2 * Math.PI) * 12;
      curRotY += Math.cos(t * 2 * Math.PI) * 12;
    }

    const hasFrame3D = curRotX !== 0 || curRotY !== 0 || totalSkewX !== 0 || totalSkewY !== 0;

    if (hasFrame3D) {
      const frameAdj3D = {
        ...adjustments,
        rotateX: curRotX,
        rotateY: curRotY,
        rotation: curRotZ,
        skewX: totalSkewX,
        skewY: totalSkewY,
        flipH: adjustments.flipH,
        flipV: adjustments.flipV
      };

      const webglCanvas = render3DWithWebGL(gifOffCtx ? gifOffCanvas : img, gifW, gifH, frameAdj3D, rawTexW, rawTexH);
      if (webglCanvas) {
        if ((frameAdj.depth3D || 0) > 0) {
          const depth = (frameAdj.depth3D || 0) * (gifW / 384);
          const radX = (curRotX * Math.PI) / 180;
          const radY = (curRotY * Math.PI) / 180;
          const shadowOffX = -Math.sin(radY) * depth * 1.5 + offsetX;
          const shadowOffY = Math.sin(radX) * depth * 1.5 + (depth * 0.8) + offsetY;
          const sColor = frameAdj.depth3DColor || 'rgba(0,0,0,0.55)';

          fCtx.save();
          fCtx.filter = `blur(${Math.max(2, Math.round(depth * 0.4))}px) drop-shadow(0 0 ${Math.round(depth * 0.3)}px ${sColor})`;
          fCtx.globalAlpha = 0.55;
          fCtx.drawImage(webglCanvas, shadowOffX, shadowOffY, gifW, gifH);
          fCtx.restore();
        }

        fCtx.save();
        if (offsetX !== 0 || offsetY !== 0 || scalePulseX !== 1 || scalePulseY !== 1) {
          fCtx.translate(gifW / 2 + offsetX, gifH / 2 + offsetY);
          fCtx.scale(scalePulseX, scalePulseY);
          fCtx.translate(-gifW / 2, -gifH / 2);
        }
        fCtx.drawImage(webglCanvas, 0, 0, gifW, gifH);
        fCtx.restore();
      }
    } else {
      // 2D frame drawing
      if ((frameAdj.depth3D || 0) > 0) {
        const depth = (frameAdj.depth3D || 0) * (gifW / 384);
        const sColor = frameAdj.depth3DColor || 'rgba(0,0,0,0.55)';
        fCtx.save();
        fCtx.filter = `blur(${Math.max(2, Math.round(depth * 0.4))}px) drop-shadow(0 0 ${Math.round(depth * 0.3)}px ${sColor})`;
        fCtx.globalAlpha = 0.55;
        fCtx.translate(gifW / 2 + offsetX, gifH / 2 + offsetY + depth * 0.8);
        if (curRotZ !== 0) fCtx.rotate((curRotZ * Math.PI) / 180);
        fCtx.scale(scalePulseX * (frameAdj.flipH ? -1 : 1), scalePulseY * (frameAdj.flipV ? -1 : 1));
        fCtx.drawImage(gifOffCtx ? gifOffCanvas : img, -rawTexW / 2, -rawTexH / 2, rawTexW, rawTexH);
        fCtx.restore();
      }

      fCtx.save();
      fCtx.translate(gifW / 2 + offsetX, gifH / 2 + offsetY);
      if (curRotZ !== 0) fCtx.rotate((curRotZ * Math.PI) / 180);
      fCtx.scale(scalePulseX * (frameAdj.flipH ? -1 : 1), scalePulseY * (frameAdj.flipV ? -1 : 1));
      fCtx.drawImage(gifOffCtx ? gifOffCanvas : img, -rawTexW / 2, -rawTexH / 2, rawTexW, rawTexH);
      fCtx.restore();
    }
  }

  // 1. Pre-pass Palette Sampling:
  // Sample keyframes across the animation cycle without holding all full-resolution frames in memory
  const sampleTimes = isAnimated ? [0, 0.25, 0.5, 0.75, 0.9] : [0];
  const sampledSolidPixels = [];
  const pixelStep = Math.max(4, Math.round(gifW / 128));

  for (let sIdx = 0; sIdx < sampleTimes.length; sIdx++) {
    const sampleT = sampleTimes[sIdx];
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
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  if (onProgress) {
    onProgress({
      percent: 12,
      stage: 'Building High-Fidelity 3D Palette...',
      details: 'Quantizing 256 colors'
    });
  }
  await new Promise(resolve => setTimeout(resolve, 0));

  const maxColors = isTransparent ? 255 : 256;
  const rawPalette = generateMedianCutPalette(
    sampledSolidPixels.length ? sampledSolidPixels : [255, 255, 255, 255],
    maxColors
  );
  const globalPalette = isTransparent ? [[0, 0, 0], ...rawPalette] : rawPalette;

  // Precompute 65,536 RGB565 LUT for ultra-fast color matching (~40ms once)
  const lut = buildColorLUT(rawPalette);

  // 2. Stream-Encode Each Frame Asynchronously:
  // Yields to event loop between frames so browser UI stays 100% responsive, never hangs or shows "not responding" dialog
  for (let frame = 0; frame < totalFrames; frame++) {
    // Check if user clicked Cancel
    if (shouldCancel && shouldCancel()) {
      URL.revokeObjectURL(blobUrl);
      throw new Error('EXPORT_CANCELLED');
    }

    // Crucial: yield to the event loop so browser watchdog timer is constantly refreshed and UI repaints
    await new Promise(resolve => setTimeout(resolve, 0));

    const pct = Math.round(15 + ((frame + 1) / totalFrames) * 80);
    if (onProgress) {
      onProgress({
        percent: pct,
        stage: `Rendering Frame ${frame + 1} of ${totalFrames}`,
        details: `${gifW}×${gifH} · Frame ${frame + 1}/${totalFrames}`
      });
    }

    const t = isAnimated ? (frame / totalFrames) : 0;
    renderFrameAtProgress(t);

    const imgData = fCtx.getImageData(0, 0, gifW, gifH);
    const rgba = imgData.data;
    const rgba32 = new Uint32Array(rgba.buffer);
    const index = new Uint8Array(gifW * gifH);

    for (let y = 0; y < gifH; y++) {
      const rowOffset = y * gifW;
      const bayerRowOffset = (y & 7) << 3;
      for (let x = 0; x < gifW; x++) {
        const pixelIdx = rowOffset + x;
        const pixel32 = rgba32[pixelIdx];

        // Super-fast alpha skip: if transparent pixel (alpha < 128), skip dithering and color matching completely!
        if (isTransparent && ((pixel32 >>> 24) < 128)) {
          index[pixelIdx] = 0; // Reserved transparent slot
          continue;
        }

        // Fast precomputed Bayer dither lookup
        const dither = BAYER_DITHER[bayerRowOffset | (x & 7)];
        const i = pixelIdx << 2;
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

  if (shouldCancel && shouldCancel()) {
    URL.revokeObjectURL(blobUrl);
    throw new Error('EXPORT_CANCELLED');
  }

  if (onProgress) {
    onProgress({
      percent: 96,
      stage: 'Assembling Looping GIF...',
      details: 'Compiling GIF stream'
    });
  }
  await new Promise(resolve => setTimeout(resolve, 0));

  gif.finish();
  const buffer = gif.bytes();
  const blob = new Blob([buffer], { type: 'image/gif' });
  await triggerDownload(blob, `${safeFilename}-${gifW}x${gifH}.gif`);
  URL.revokeObjectURL(blobUrl);

  if (onProgress) {
    onProgress({
      percent: 100,
      stage: 'Export Complete!',
      details: 'GIF downloaded successfully'
    });
  }
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