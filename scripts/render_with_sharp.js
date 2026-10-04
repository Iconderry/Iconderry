import sharp from 'sharp';
import fs from 'fs';

const svg = fs.readFileSync('public/favicon.svg');

sharp(svg)
  .resize(1024, 1024)
  .png()
  .toFile('sharp_icon.png')
  .then(() => console.log('Successfully rendered sharp_icon.png'))
  .catch(err => console.error(err));
