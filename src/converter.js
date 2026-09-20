import { replaceSvgColors } from './colorUtils';
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
    customColor: '',
    colorReplacements: {},
    activeStyleMode: 'original',
    strokeMultiplier: 1,
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
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments);

    // If background badge shape is active, embed container shape into SVG
    if (adjustments.bgShape && adjustments.bgShape !== 'none') {
      preparedSvg = embedSvgBgShape(preparedSvg, adjustments, targetWidth, targetHeight);
    }

    const blob = new Blob([preparedSvg], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, `${safeFilename}-${targetWidth}x${targetHeight}.svg`);
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments);

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

      // 1. Solid canvas background (if not transparent or jpeg)
      if (format === 'jpeg' || (!isTransparent && adjustments.bgShape === 'none')) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // 2. Background Badge Shape (Circle, Squircle, Rounded Square, Hexagon)
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        drawCanvasBgShape(ctx, targetWidth, targetHeight, adjustments);
      }

      // 3. Comprehensive Canvas CSS Filters
      const maxDim = Math.max(targetWidth, targetHeight);
      const scaledGlow = adjustments.shadowBlur > 0 
        ? Math.max(2, (adjustments.shadowBlur / 40) * (maxDim * 0.04)) 
        : 0;

      const filterRules = [
        `hue-rotate(${adjustments.hue}deg)`,
        `brightness(${adjustments.brightness}%)`,
        `saturate(${adjustments.saturation}%)`,
        `contrast(${adjustments.contrast}%)`,
        `sepia(${adjustments.sepia}%)`,
        `invert(${adjustments.invert}%)`,
        `opacity(${adjustments.opacity}%)`,
        adjustments.blur > 0 ? `blur(${(adjustments.blur / 100) * (maxDim * 0.02)}px)` : '',
        scaledGlow > 0 ? `drop-shadow(0px 0px ${scaledGlow}px ${adjustments.shadowColor || '#00ffff'})` : ''
      ].filter(Boolean).join(' ');

      ctx.filter = filterRules || 'none';

      // 4. Transformations (Rotation, Scale & Positioning)
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);

      // Icon Padding / Inset
      let paddingRatio = adjustments.shadowBlur > 0 ? 0.82 : 0.9;
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        const shapePad = Number(adjustments.bgShapePadding || 20) / 100;
        paddingRatio = Math.max(0.2, (1 - shapePad * 1.5));
      }

      const drawWidth = targetWidth * paddingRatio;
      const drawHeight = targetHeight * paddingRatio;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
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

function prepareSvgWithAdjustments(svgCode, adjustments = {}) {
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

  // Adjust stroke thickness
  if (adjustments.strokeMultiplier && adjustments.strokeMultiplier !== 1) {
    res = res.replace(/stroke-width="([0-9.]+)"/gi, (match, val) => {
      return `stroke-width="${(parseFloat(val) * adjustments.strokeMultiplier).toFixed(2)}"`;
    });
    res = res.replace(/stroke-width:\s*([0-9.]+)(px)?/gi, (match, val) => {
      return `stroke-width:${(parseFloat(val) * adjustments.strokeMultiplier).toFixed(2)}px`;
    });
  }

  // Ensure viewBox exists for responsive scaling
  if (!res.includes('viewBox=') && !res.includes('viewbox=')) {
    const wMatch = res.match(/width="([0-9.]+)(?:px)?"/i);
    const hMatch = res.match(/height="([0-9.]+)(?:px)?"/i);
    if (wMatch && hMatch) {
      const w = wMatch[1];
      const h = hMatch[1];
      res = res.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
    }
  }

  // Ensure preserveAspectRatio="none" so it stretches to targetWidth and targetHeight independently
  if (res.includes('preserveAspectRatio=')) {
    res = res.replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="none"');
  } else {
    res = res.replace('<svg', '<svg preserveAspectRatio="none"');
  }

  if (adjustments.customColor) {
    res = res.replace(/fill="((?!none|url)[^"]+)"/gi, `fill="${adjustments.customColor}"`);
    res = res.replace(/stroke="((?!none|url)[^"]+)"/gi, `stroke="${adjustments.customColor}"`);
  }

  return res;
}

function triggerDownload(blob, fullFilename) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}