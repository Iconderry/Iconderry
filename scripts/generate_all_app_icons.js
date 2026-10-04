import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAll() {
  const svg = fs.readFileSync('public/favicon.svg');

  // 1. Base 1024x1024 icon
  const icon1024 = await sharp(svg)
    .resize(1024, 1024)
    .png()
    .toBuffer();

  // Save to public web assets
  fs.writeFileSync('public/app-icon.png', icon1024);
  fs.writeFileSync('public/app-icon-rounded.png', icon1024);
  fs.writeFileSync('public/logo.png', icon1024);

  // 2. PWA icons
  await sharp(icon1024).resize(512, 512).png().toFile('public/pwa-512x512.png');
  await sharp(icon1024).resize(512, 512).png().toFile('public/pwa-maskable-512x512.png');
  await sharp(icon1024).resize(192, 192).png().toFile('public/pwa-192x192.png');
  await sharp(icon1024).resize(192, 192).png().toFile('public/pwa-maskable-192x192.png');
  await sharp(icon1024).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(icon1024).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(icon1024).resize(192, 192).png().toFile('public/favicon.png');

  // 3. Android 12+ Splash Icon (512x512 canvas, icon centered in safe zone ~320x320)
  // Android 12 enforces a circular mask of diameter 160dp within 288dp (approx 66% width).
  // Placing a 330x330 rounded icon in the center of a 512x512 transparent canvas guarantees
  // that Android's circular/squircle mask never cuts off the corners!
  const splashIconInner = await sharp(icon1024)
    .resize(330, 330)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: splashIconInner, left: (512 - 330) / 2, top: (512 - 330) / 2 }])
    .png()
    .toFile('android/app/src/main/res/drawable/splash_icon.png');

  console.log('Generated android/app/src/main/res/drawable/splash_icon.png');

  // 4. Portrait & Landscape Splash Screens for Capacitor
  // Dark background #030712 matching styles.xml and capacitor.config.json
  const BG_COLOR = { r: 3, g: 7, b: 18, alpha: 1.0 };

  const portSizes = [
    { dir: 'drawable', w: 1080, h: 2400, iconSize: 340 },
    { dir: 'drawable-port-xxxhdpi', w: 1280, h: 1920, iconSize: 360 },
    { dir: 'drawable-port-xxhdpi', w: 960, h: 1600, iconSize: 300 },
    { dir: 'drawable-port-xhdpi', w: 640, h: 960, iconSize: 220 },
    { dir: 'drawable-port-hdpi', w: 480, h: 800, iconSize: 180 },
    { dir: 'drawable-port-mdpi', w: 320, h: 480, iconSize: 130 }
  ];

  for (const item of portSizes) {
    const resizedIcon = await sharp(icon1024)
      .resize(item.iconSize, item.iconSize)
      .png()
      .toBuffer();

    const targetDir = path.join('android/app/src/main/res', item.dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await sharp({
      create: {
        width: item.w,
        height: item.h,
        channels: 4,
        background: BG_COLOR
      }
    })
      .composite([{
        input: resizedIcon,
        left: Math.round((item.w - item.iconSize) / 2),
        top: Math.round((item.h - item.iconSize) / 2)
      }])
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`Generated ${item.dir}/splash.png (${item.w}x${item.h})`);
  }

  const landSizes = [
    { dir: 'drawable-land-xxxhdpi', w: 1920, h: 1280, iconSize: 340 },
    { dir: 'drawable-land-xxhdpi', w: 1600, h: 960, iconSize: 280 },
    { dir: 'drawable-land-xhdpi', w: 960, h: 640, iconSize: 200 },
    { dir: 'drawable-land-hdpi', w: 800, h: 480, iconSize: 160 },
    { dir: 'drawable-land-mdpi', w: 480, h: 320, iconSize: 120 }
  ];

  for (const item of landSizes) {
    const resizedIcon = await sharp(icon1024)
      .resize(item.iconSize, item.iconSize)
      .png()
      .toBuffer();

    const targetDir = path.join('android/app/src/main/res', item.dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await sharp({
      create: {
        width: item.w,
        height: item.h,
        channels: 4,
        background: BG_COLOR
      }
    })
      .composite([{
        input: resizedIcon,
        left: Math.round((item.w - item.iconSize) / 2),
        top: Math.round((item.h - item.iconSize) / 2)
      }])
      .png()
      .toFile(path.join(targetDir, 'splash.png'));

    console.log(`Generated ${item.dir}/splash.png (${item.w}x${item.h})`);
  }

  console.log('All icons and splash screens successfully generated!');
}

generateAll().catch(console.error);
