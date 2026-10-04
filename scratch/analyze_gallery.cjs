const fs = require('fs');

async function run() {
  const mg = await import('../src/motionGraphicsData.js');
  const cs = await import('../src/compositeScenesData.js');
  const fg = await import('../src/frostedGlassData.js');
  const sm = await import('../src/stickmanData.js');
  
  // read initialData.js text to parse CORE_INITIAL_ELEMENTS
  const initText = fs.readFileSync('./src/initialData.js', 'utf8');
  const coreMatches = [...initText.matchAll(/title:\s*['"]([^'"]+)['"],\s*category:\s*['"]([^'"]+)['"]/g)];
  
  console.log('Core elements:', coreMatches.length);
  console.log('Composite scenes:', cs.COMPOSITE_SCENE_ELEMENTS.length);
  console.log('Frosted glass:', fg.FROSTED_GLASS_ELEMENTS.length);
  console.log('Motion graphics:', mg.YOUTUBE_MOTION_ELEMENTS.length);
  console.log('Stickman:', sm.STICKMAN_ELEMENTS.length);

  const allCategories = new Set();
  coreMatches.forEach(m => allCategories.add(m[2]));
  cs.COMPOSITE_SCENE_ELEMENTS.forEach(e => allCategories.add(e.category));
  fg.FROSTED_GLASS_ELEMENTS.forEach(e => allCategories.add(e.category));
  mg.YOUTUBE_MOTION_ELEMENTS.forEach(e => allCategories.add(e.category));
  sm.STICKMAN_ELEMENTS.forEach(e => allCategories.add(e.category));

  console.log('All categories currently:', Array.from(allCategories));
}

run().catch(console.error);
