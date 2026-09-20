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
    activeStyleMode: 'original'
  }
}) {
  const safeFilename = filename.toLowerCase().replace(/\s+/g, '-');
  const targetWidth = width || size;
  const targetHeight = height || size;

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

      // Solid background handling
      if (format === 'jpeg' || !isTransparent) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Comprehensive Canvas CSS Filters
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

      // Transformations (Rotation, Scale & Positioning)
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.scale(adjustments.flipH ? -1 : 1, adjustments.flipV ? -1 : 1);

      // Padding offset taaki blur ya shadow canvas se bahar na kate
      const paddingRatio = adjustments.shadowBlur > 0 ? 0.82 : 0.9;
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