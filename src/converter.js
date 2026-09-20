import { replaceSvgColors, applyUniversalStroke } from './colorUtils';
import { transformSvgStyle } from './styleTransformer';

export async function downloadAsset({
  svgCode,
  filename,
  format = 'png',
  size = 512,
  width,
  height,
  isTransparent = true,
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
  const safeFilename = filename.toLowerCase().replace(/\s+/g, '-');
  const targetWidth = width || size;
  const targetHeight = height || size;

  // DIRECT PURE VECTOR SVG EXPORT
  if (format === 'svg') {
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight);

    // If background badge shape is active, embed container shape into SVG
    if (adjustments.bgShape && adjustments.bgShape !== 'none') {
      preparedSvg = embedSvgBgShape(preparedSvg, adjustments, targetWidth, targetHeight);
    }

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, `${safeFilename}-${targetWidth}x${targetHeight}.svg`);
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    // Pass targetWidth and targetHeight so SVG root element has native resolution attributes
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight);

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.crossOrigin = 'anonymous';

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

      // 1. Solid canvas background (if not transparent or jpeg)
      if (format === 'jpeg' || (!isTransparent && adjustments.bgShape === 'none')) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // 2. Background Badge Shape (Circle, Squircle, Rounded Square, Hexagon)
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        drawCanvasBgShape(ctx, targetWidth, targetHeight, adjustments);
      }

      // 3. Scale blur and glow relative to preview baseline (384px) for exact visual parity at any resolution (1K to 8K)
      const scaleFactor = Math.max(targetWidth, targetHeight) / 384;
      const scaledGlow = adjustments.shadowBlur > 0 
        ? adjustments.shadowBlur * scaleFactor 
        : 0;

      const filterRules = [
        `hue-rotate(${adjustments.hue}deg)`,
        `brightness(${adjustments.brightness}%)`,
        `saturate(${adjustments.saturation}%)`,
        `contrast(${adjustments.contrast}%)`,
        `sepia(${adjustments.sepia}%)`,
        `invert(${adjustments.invert}%)`,
        `opacity(${adjustments.opacity}%)`,
        adjustments.blur > 0 ? `blur(${adjustments.blur * scaleFactor}px)` : '',
        scaledGlow > 0 
          ? `drop-shadow(0px 0px ${scaledGlow}px ${adjustments.shadowColor || '#38bdf8'}) drop-shadow(0px 0px ${Math.max(1, Math.round(scaledGlow * 0.4))}px ${adjustments.shadowColor || '#38bdf8'})` 
          : ''
      ].filter(Boolean).join(' ');

      ctx.filter = filterRules || 'none';

      // 4. Transformations (Rotation, Scale, 3D Perspective & Skew)
      const rotX = adjustments.rotateX || 0;
      const rotY = adjustments.rotateY || 0;
      const rotZ = adjustments.rotation || 0;
      const skX = adjustments.skewX || 0;
      const skY = adjustments.skewY || 0;
      const has3D = rotX !== 0 || rotY !== 0 || skX !== 0 || skY !== 0;

      // Icon Padding / Inset
      let paddingRatio = adjustments.shadowBlur > 0 ? 0.82 : 0.9;
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        const shapePad = Number(adjustments.bgShapePadding || 20) / 100;
        paddingRatio = Math.max(0.2, (1 - shapePad * 1.5));
      }
      if (has3D) {
        paddingRatio *= 0.88;
      }

      const drawWidth = targetWidth * paddingRatio;
      const drawHeight = targetHeight * paddingRatio;

      // 3D Depth / Elevation Shadow
      if ((adjustments.depth3D || 0) > 0) {
        draw3DDepthShadow(ctx, img, drawWidth, drawHeight, adjustments, targetWidth);
      }

      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);

      if (!has3D) {
        ctx.rotate((rotZ * Math.PI) / 180);
        ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      } else {
        render3DPerspectiveImage(ctx, img, drawWidth, drawHeight, adjustments, targetWidth);
      }
      ctx.restore();

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';

      canvas.toBlob((resBlob) => {
        URL.revokeObjectURL(blobUrl);
        if (resBlob) {
          triggerDownload(resBlob, `${safeFilename}-${targetWidth}x${targetHeight}.${format}`);
          resolve(true);
        } else {
          reject(new Error('Conversion failed'));
        }
      }, mimeType, 0.95);
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

function prepareSvgWithAdjustments(svgCode, adjustments = {}, targetWidth, targetHeight) {
  let res = svgCode;
  if (!res.includes('xmlns=')) {
    res = res.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Apply individual multi-color replacements
  if (adjustments.colorReplacements && Object.keys(adjustments.colorReplacements).length > 0) {
    res = replaceSvgColors(res, adjustments.colorReplacements);
  }

  // Apply real material/look style transformation (Silhouette, Glass, Neon, 3D Inflated, Line Art, Vibrant Mesh, etc.)
  if (adjustments.activeStyleMode && adjustments.activeStyleMode !== 'original') {
    res = transformSvgStyle(res, adjustments.activeStyleMode);
  }

  // Adjust stroke thickness (universal for both stroke icons and filled shapes)
  if (adjustments.strokeMultiplier && adjustments.strokeMultiplier !== 1) {
    res = applyUniversalStroke(res, adjustments.strokeMultiplier, adjustments.strokeColorMode, adjustments.customStrokeColor);
  }

  // Ensure viewBox exists for responsive scaling before updating width/height
  if (!res.includes('viewBox=') && !res.includes('viewbox=')) {
    const wMatch = res.match(/width="([0-9.]+)(?:px)?"/i);
    const hMatch = res.match(/height="([0-9.]+)(?:px)?"/i);
    if (wMatch && hMatch) {
      const w = wMatch[1];
      const h = hMatch[1];
      res = res.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
    } else {
      res = res.replace('<svg', '<svg viewBox="0 0 100 100"');
    }
  }

  // Ensure preserveAspectRatio="none" so it stretches to targetWidth and targetHeight independently
  if (res.includes('preserveAspectRatio=')) {
    res = res.replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="none"');
  } else {
    res = res.replace('<svg', '<svg preserveAspectRatio="none"');
  }

  // CRITICAL FOR ULTRA HD & 8K VECTOR PURITY:
  // When an SVG is loaded into an Image for canvas rendering, browser engines rasterize
  // the vector paths at the SVG's declared width & height attributes.
  // Setting width and height to match the target canvas resolution ensures the browser
  // rasterizes the vector paths directly at full 4K/8K resolution with zero scaling artifacts!
  if (targetWidth && targetHeight) {
    if (/\bwidth="[^"]*"/i.test(res)) {
      res = res.replace(/\bwidth="[^"]*"/i, `width="${targetWidth}"`);
    } else {
      res = res.replace('<svg', `<svg width="${targetWidth}"`);
    }

    if (/\bheight="[^"]*"/i.test(res)) {
      res = res.replace(/\bheight="[^"]*"/i, `height="${targetHeight}"`);
    } else {
      res = res.replace('<svg', `<svg height="${targetHeight}"`);
    }
  }

  if (adjustments.customColor) {
    res = res.replace(/fill="((?!none|url)[^"]+)"/gi, `fill="${adjustments.customColor}"`);
    res = res.replace(/stroke="((?!none|url)[^"]+)"/gi, `stroke="${adjustments.customColor}"`);
  }

  // 3D & 2D Vector Transform Embedding for Direct SVG Export
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

  return res;
}

// 3D Perspective Projection for HTML5 Canvas Export
function projectPoint3D(x, y, radX, radY, radZ, tanSkX, tanSkY, scaleX, scaleY, persp) {
  const x0 = x * scaleX;
  const y0 = y * scaleY;
  const x1 = x0 + y0 * tanSkX;
  const y1 = y0 + x0 * tanSkY;
  const y2 = y1 * Math.cos(radX);
  const z2 = y1 * Math.sin(radX);
  const x3 = x1 * Math.cos(radY) + z2 * Math.sin(radY);
  const z3 = -x1 * Math.sin(radY) + z2 * Math.cos(radY);
  const x4 = x3 * Math.cos(radZ) - y2 * Math.sin(radZ);
  const y4 = x3 * Math.sin(radZ) + y2 * Math.cos(radZ);
  const fov = persp / Math.max(1, (persp + z3));
  return { x: x4 * fov, y: y4 * fov, z: z3 };
}

function getAffineTransform(u0, v0, u1, v1, u2, v2, x0, y0, x1, y1, x2, y2) {
  const D = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
  if (Math.abs(D) < 1e-6) return null;
  return {
    a: (x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)) / D,
    c: (x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / D,
    e: (x0 * (u1 * v2 - u2 * v1) + x1 * (u2 * v0 - u0 * v2) + x2 * (u0 * v1 - u1 * v0)) / D,
    b: (y0 * (v1 - v2) + y1 * (v2 - v0) + y2 * (v0 - v1)) / D,
    d: (y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)) / D,
    f: (y0 * (u1 * v2 - u2 * v1) + y1 * (u2 * v0 - u0 * v2) + y2 * (u0 * v1 - u1 * v0)) / D
  };
}

function render3DPerspectiveImage(ctx, img, drawWidth, drawHeight, adjustments, canvasWidth) {
  const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
  const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
  const radZ = ((adjustments.rotation || 0) * Math.PI) / 180;
  const tanSkX = Math.tan(((adjustments.skewX || 0) * Math.PI) / 180);
  const tanSkY = Math.tan(((adjustments.skewY || 0) * Math.PI) / 180);
  const scaleX = adjustments.flipH ? -1 : 1;
  const scaleY = adjustments.flipV ? -1 : 1;
  const persp = (adjustments.perspective || 800) * (canvasWidth / 384);

  const N = 32; // 32 vertical slices for smooth perspective
  const W = drawWidth;
  const H = drawHeight;
  const imgW = img.width || W;
  const imgH = img.height || H;

  for (let i = 0; i < N; i++) {
    const u0 = -W / 2 + (i / N) * W;
    const u1 = -W / 2 + ((i + 1) / N) * W;
    const su0 = (i / N) * imgW;
    const su1 = Math.min(imgW, ((i + 1) / N) * imgW + 0.6); // slight overlap avoids seams

    const pTL = projectPoint3D(u0, -H / 2, radX, radY, radZ, tanSkX, tanSkY, scaleX, scaleY, persp);
    const pTR = projectPoint3D(u1, -H / 2, radX, radY, radZ, tanSkX, tanSkY, scaleX, scaleY, persp);
    const pBR = projectPoint3D(u1, H / 2, radX, radY, radZ, tanSkX, tanSkY, scaleX, scaleY, persp);
    const pBL = projectPoint3D(u0, H / 2, radX, radY, radZ, tanSkX, tanSkY, scaleX, scaleY, persp);

    // Triangle 1: TL, TR, BL
    const m1 = getAffineTransform(su0, 0, su1, 0, su0, imgH, pTL.x, pTL.y, pTR.x, pTR.y, pBL.x, pBL.y);
    if (m1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pTL.x, pTL.y);
      ctx.lineTo(pTR.x, pTR.y);
      ctx.lineTo(pBL.x, pBL.y);
      ctx.closePath();
      ctx.clip();
      ctx.transform(m1.a, m1.b, m1.c, m1.d, m1.e, m1.f);
      ctx.drawImage(img, 0, 0, imgW, imgH);
      ctx.restore();
    }

    // Triangle 2: TR, BR, BL
    const m2 = getAffineTransform(su1, 0, su1, imgH, su0, imgH, pTR.x, pTR.y, pBR.x, pBR.y, pBL.x, pBL.y);
    if (m2) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pTR.x, pTR.y);
      ctx.lineTo(pBR.x, pBR.y);
      ctx.lineTo(pBL.x, pBL.y);
      ctx.closePath();
      ctx.clip();
      ctx.transform(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
      ctx.drawImage(img, 0, 0, imgW, imgH);
      ctx.restore();
    }
  }
}

function draw3DDepthShadow(ctx, img, drawWidth, drawHeight, adjustments, canvasWidth) {
  const depth = (adjustments.depth3D || 0) * (canvasWidth / 384);
  if (depth <= 0) return;

  const radX = ((adjustments.rotateX || 0) * Math.PI) / 180;
  const radY = ((adjustments.rotateY || 0) * Math.PI) / 180;
  const offX = -Math.sin(radY) * depth * 1.5;
  const offY = Math.sin(radX) * depth * 1.5 + (depth * 0.8);
  const color = adjustments.depth3DColor || 'rgba(0,0,0,0.55)';

  ctx.save();
  ctx.translate(canvasWidth / 2 + offX, (canvasWidth / 2) + offY);
  ctx.filter = `blur(${Math.max(2, Math.round(depth * 0.4))}px) drop-shadow(0 0 ${Math.round(depth * 0.5)}px ${color})`;
  ctx.globalAlpha = 0.5;
  render3DPerspectiveImage(ctx, img, drawWidth, drawHeight, adjustments, canvasWidth);
  ctx.restore();
}

function triggerDownload(blob, fullFilename) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}