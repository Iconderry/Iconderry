import { replaceSvgColors, applyUniversalStroke } from './colorUtils';
import { transformSvgStyle } from './styleTransformer';
import { applyLayerTransforms } from './layerUtils';
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
  const targetWidth = width || size;
  const targetHeight = height || size;
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
    triggerDownload(blob, `${baseFilename}.svg`);
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    // Pass targetWidth and targetHeight so SVG root element has native resolution attributes
    // forVectorSvgExport is false so raster image has clean, untransformed vector paths
    let preparedSvg = prepareSvgWithAdjustments(svgCode, adjustments, targetWidth, targetHeight, false);

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

      // Icon Padding / Inset
      let paddingRatio = adjustments.shadowBlur > 0 ? 0.82 : 0.9;
      if (adjustments.bgShape && adjustments.bgShape !== 'none') {
        const shapePad = Number(adjustments.bgShapePadding || 20) / 100;
        paddingRatio = Math.max(0.2, (1 - shapePad * 1.5));
      }
      if (has3D) {
        paddingRatio *= 0.86; // Margin so 3D perspective tilted corners don't get clipped
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
        // 1. Render filtered 2D source onto an offscreen canvas
        const offCanvas = document.createElement('canvas');
        offCanvas.width = drawWidth;
        offCanvas.height = drawHeight;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          offCtx.imageSmoothingEnabled = true;
          offCtx.imageSmoothingQuality = 'high';
          offCtx.filter = filterRules || 'none';
          offCtx.drawImage(img, 0, 0, drawWidth, drawHeight);
        }

        // 2. Render 3D perspective quad via WebGL with zero slicing
        const webglCanvas = render3DWithWebGL(offCtx ? offCanvas : img, targetWidth, targetHeight, adjustments, drawWidth, drawHeight);

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
            ctx.filter = `blur(${Math.max(2, Math.round(depth * 0.5))}px) drop-shadow(0 0 ${Math.round(depth * 0.4)}px ${sColor})`;
            ctx.globalAlpha = 0.55;
            ctx.drawImage(webglCanvas, offX, offY);
            ctx.restore();
          }

          // 4. Draw pristine 3D icon
          ctx.drawImage(webglCanvas, 0, 0);
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

      canvas.toBlob((resBlob) => {
        URL.revokeObjectURL(blobUrl);
        if (resBlob) {
          triggerDownload(resBlob, `${baseFilename}.${format}`);
          resolve(true);
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

  // Apply real material/look style transformation (Silhouette, Glass, Neon, 3D Inflated, Line Art, Vibrant Mesh, etc.)
  if (adjustments.activeStyleMode && adjustments.activeStyleMode !== 'original') {
    res = transformSvgStyle(res, adjustments.activeStyleMode);
  }

  // Adjust stroke thickness (universal for both stroke icons and filled shapes)
  if (adjustments.strokeMultiplier && adjustments.strokeMultiplier !== 1) {
    res = applyUniversalStroke(res, adjustments.strokeMultiplier, adjustments.strokeColorMode, adjustments.customStrokeColor);
  }

  // Apply individual vector layer moves, rotations, DOM reordering, and per-layer custom styles
  if ((adjustments.layerTransforms && Object.keys(adjustments.layerTransforms).length > 0) || 
      (adjustments.layerOrder && adjustments.layerOrder.length > 0) ||
      (adjustments.layerStyles && Object.keys(adjustments.layerStyles).length > 0)) {
    res = applyLayerTransforms(res, adjustments.layerTransforms || {}, adjustments.layerOrder || [], false, adjustments.layerStyles || {});
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

  // Set explicit width and height on SVG element
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

function render3DWithWebGL(imageSource, targetWidth, targetHeight, adjustments, drawWidth, drawHeight) {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const gl = canvas.getContext('webgl', { 
    antialias: true, 
    alpha: true, 
    premultipliedAlpha: false,
    preserveDrawingBuffer: true 
  });
  if (!gl) return null;

  gl.viewport(0, 0, targetWidth, targetHeight);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

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

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const vs = createShader(gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Quad geometry (2 triangles)
  const hw = drawWidth / 2;
  const hh = drawHeight / 2;

  const positions = new Float32Array([
    -hw, -hh,
     hw, -hh,
    -hw,  hh,
    -hw,  hh,
     hw, -hh,
     hw,  hh
  ]);

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'a_position');
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

  const texBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuf);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  const aTex = gl.getAttribLocation(program, 'a_texCoord');
  gl.enableVertexAttribArray(aTex);
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);

  // Texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
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
  const persp = (adjustments.perspective || 800) * (targetWidth / 384);

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

  const uMatrix = gl.getUniformLocation(program, 'u_matrix');
  gl.uniformMatrix4fv(uMatrix, false, M);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  return canvas;
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
  // Cap dimensions to max 800px so encoding is fast and GIF file size remains manageable
  const gifW = Math.min(targetWidth, 800);
  const gifH = Math.min(targetHeight, 800);

  const fps = 20;
  const speed = Number(adjustments.animSpeed || 2.2);
  const totalFrames = Math.max(16, Math.min(48, Math.round(fps * speed)));
  const delay = Math.round(1000 / fps);

  const gif = GIFEncoder();

  const fCanvas = document.createElement('canvas');
  fCanvas.width = gifW;
  fCanvas.height = gifH;
  const fCtx = fCanvas.getContext('2d', { willReadFrequently: true });
  if (!fCtx) {
    throw new Error('Canvas 2D context unavailable for GIF export');
  }

  const animPreset = adjustments.animPreset || 'float';
  const animHeight = Number(adjustments.animHeight || 16);
  const animShadowSync = adjustments.animShadowSync !== false;

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

  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / totalFrames; // 0 to 1
    fCtx.clearRect(0, 0, gifW, gifH);

    // 1. Background
    if (!isTransparent && adjustments.bgShape === 'none') {
      fCtx.fillStyle = '#FFFFFF';
      fCtx.fillRect(0, 0, gifW, gifH);
    }
    if (adjustments.bgShape && adjustments.bgShape !== 'none') {
      drawCanvasBgShape(fCtx, gifW, gifH, adjustments);
    }

    // 2. Compute motion state for this frame
    let frameAdj = { ...adjustments };
    let offsetY = 0;
    let offsetX = 0;
    let scalePulse = 1;

    if (animPreset === 'float') {
      const sinVal = Math.sin(t * 2 * Math.PI);
      offsetY = -sinVal * animHeight * (gifH / 384);
      if (animShadowSync && (frameAdj.depth3D || 0) > 0) {
        frameAdj.depth3D = (adjustments.depth3D || 10) * Math.max(0.2, (1 - sinVal * 0.35));
      }
    } else if (animPreset === 'spin360') {
      frameAdj.rotateY = ((adjustments.rotateY || 0) + t * 360) % 360;
    } else if (animPreset === 'pulse') {
      const sinVal = Math.sin(t * 2 * Math.PI);
      scalePulse = 1 + sinVal * 0.10;
    } else if (animPreset === 'wobble') {
      const sinVal = Math.sin(t * 2 * Math.PI);
      const cosVal = Math.cos(t * 2 * Math.PI);
      frameAdj.rotateY = (adjustments.rotateY || 0) + sinVal * 16;
      frameAdj.rotateX = (adjustments.rotateX || 0) + cosVal * 8;
    } else if (animPreset === 'wave') {
      const sinVal = Math.sin(t * 2 * Math.PI);
      const cosVal = Math.cos(t * 2 * Math.PI);
      offsetY = -sinVal * (animHeight * 0.7) * (gifH / 384);
      frameAdj.rotation = (adjustments.rotation || 0) + cosVal * 6;
    }

    // 3. Render icon for this frame
    const rotX = frameAdj.rotateX || 0;
    const rotY = frameAdj.rotateY || 0;
    const rotZ = frameAdj.rotation || 0;
    const skX = frameAdj.skewX || 0;
    const skY = frameAdj.skewY || 0;
    const has3D = rotX !== 0 || rotY !== 0 || skX !== 0 || skY !== 0 || animPreset === 'spin360' || animPreset === 'wobble';

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
          const offX = -Math.sin(radY) * depth * 1.5;
          const offY = Math.sin(radX) * depth * 1.5 + (depth * 0.8) + offsetY;
          const sColor = frameAdj.depth3DColor || 'rgba(0,0,0,0.55)';

          fCtx.save();
          fCtx.filter = `blur(${Math.max(2, Math.round(depth * 0.5))}px) drop-shadow(0 0 ${Math.round(depth * 0.4)}px ${sColor})`;
          fCtx.globalAlpha = 0.55;
          fCtx.drawImage(webglCanvas, offX, offY);
          fCtx.restore();
        }

        // Icon with levitation offsetY
        fCtx.save();
        fCtx.drawImage(webglCanvas, 0, offsetY);
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

    // 4. Clean Alpha Pre-quantization to eliminate ghost halos
    const imgData = fCtx.getImageData(0, 0, gifW, gifH);
    const rgba = imgData.data;

    if (isTransparent) {
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i + 3] < 80) {
          rgba[i] = 0;
          rgba[i + 1] = 0;
          rgba[i + 2] = 0;
          rgba[i + 3] = 0;
        } else {
          rgba[i + 3] = 255;
        }
      }
    }

    const quantFormat = isTransparent ? 'rgba4444' : 'rgb565';
    const palette = quantize(rgba, 256, { format: quantFormat, oneBitAlpha: isTransparent });
    const index = applyPalette(rgba, palette, quantFormat);
    const transparentIndex = isTransparent ? palette.findIndex(c => c[3] === 0) : -1;

    gif.writeFrame(index, gifW, gifH, { 
      palette, 
      delay, 
      transparent: isTransparent && transparentIndex >= 0,
      transparentIndex: Math.max(0, transparentIndex),
      dispose: 2 // CRITICAL FIX: Restore to background to prevent ghost trails between moving frames!
    });
  }

  gif.finish();
  const buffer = gif.bytes();
  const blob = new Blob([buffer], { type: 'image/gif' });
  triggerDownload(blob, `${safeFilename}-${gifW}x${gifH}.gif`);
  URL.revokeObjectURL(blobUrl);
  return true;
}

function triggerDownload(blob, fullFilename) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}