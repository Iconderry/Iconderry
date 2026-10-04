// Script to generate another batch of 50 unique stickmen (total reaching 120)
import fs from 'fs';
import path from 'path';

export const BATCH_2_STICKMEN = [
  // 1. Skateboarding
  {
    id: 'stickman-skateboarding',
    title: 'Stickman Skateboarding',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 115,
    tags: 'stickman, silhouette, skateboard, skater, street, extreme sports, skate park, ride, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Skateboard Deck & Wheels -->
  <rect x="130" y="420" width="250" height="16" rx="8" fill="#000000" transform="rotate(-5 255 428)"/>
  <circle cx="165" cy="445" r="14" fill="#000000"/>
  <circle cx="345" cy="430" r="14" fill="#000000"/>
  <!-- Head -->
  <circle cx="270" cy="110" r="44" fill="#000000"/>
  <!-- Torso (athletic crouch) -->
  <path d="M260 165 L245 285" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms (balanced wide for speed) -->
  <path d="M260 175 L180 200 L140 230" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M260 175 L330 195 L370 215" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Bent Knees on Skateboard -->
  <path d="M245 285 L200 345 L175 415" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M245 285 L295 340 L335 410" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 2. Downhill Skiing
  {
    id: 'stickman-skiing-slopes',
    title: 'Stickman Downhill Skiing',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 108,
    tags: 'stickman, silhouette, skiing, skier, winter, snow, alps, mountain, slopes, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Skis (Tilted 25 degrees) -->
  <line x1="80" y1="410" x2="380" y2="450" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <line x1="120" y1="430" x2="410" y2="470" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="280" cy="115" r="44" fill="#000000"/>
  <!-- Torso (Crouched Tuck) -->
  <path d="M275 165 L230 280" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms holding ski poles -->
  <path d="M275 175 L220 230 L190 270" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M275 175 L310 230 L290 275" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Ski Poles -->
  <line x1="190" y1="270" x2="150" y2="430" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <line x1="290" y1="275" x2="250" y2="445" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <!-- Deeply Bent Legs -->
  <path d="M230 280 L180 340 L230 420" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M230 280 L220 345 L270 435" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 3. Snowboarding
  {
    id: 'stickman-snowboarding',
    title: 'Stickman Snowboarding Air',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 118,
    tags: 'stickman, silhouette, snowboard, winter sports, halfpipe, mountain, snow, trick, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Snowboard Deck (Tilted airborne) -->
  <rect x="100" y="380" width="280" height="20" rx="10" fill="#000000" transform="rotate(-25 240 390)"/>
  <!-- Head -->
  <circle cx="280" cy="110" r="44" fill="#000000"/>
  <!-- Torso (Twisted for grab) -->
  <path d="M270 160 L240 275" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Left Arm (Reaching down for board grab) -->
  <path d="M270 170 L240 240 L200 320" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Balance in air) -->
  <path d="M270 170 L340 160 L380 180" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs locked in bindings -->
  <path d="M240 275 L180 310 L150 360" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M240 275 L280 310 L270 380" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 4. Surfing Ocean Wave
  {
    id: 'stickman-surfing-wave',
    title: 'Stickman Surfing Wave',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 122,
    tags: 'stickman, silhouette, surfing, surfboard, ocean, beach, summer, wave, water sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Surfboard -->
  <path d="M90 440 Q256 410 420 420 Q256 460 90 440 Z" fill="#000000"/>
  <!-- Wave spray curves -->
  <path d="M60 460 Q120 420 180 460" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="265" cy="115" r="44" fill="#000000"/>
  <!-- Torso (low center of gravity) -->
  <path d="M255 165 L245 285" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms balancing on wave -->
  <path d="M255 175 L170 195 L120 220" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M255 175 L330 185 L390 195" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Surfer Stance Legs -->
  <path d="M245 285 L180 340 L160 425" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M245 285 L310 340 L330 420" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 5. Rock Climbing / Bouldering
  {
    id: 'stickman-rock-climbing',
    title: 'Stickman Rock Climber',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 104,
    tags: 'stickman, silhouette, rock climbing, climber, bouldering, mountain, extreme, grip, scaling, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Vertical Wall Profile on Right -->
  <line x1="390" y1="40" x2="390" y2="480" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="260" cy="130" r="44" fill="#000000"/>
  <!-- Torso (Clinging to rock face) -->
  <path d="M265 180 L290 305" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms reaching for holds on wall -->
  <path d="M265 190 L320 130 L380 90" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M265 200 L335 210 L380 180" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs braced against rock -->
  <path d="M290 305 L340 330 L380 340" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M290 305 L260 380 L380 430" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 6. Archery Aiming Bow
  {
    id: 'stickman-archery-bow',
    title: 'Stickman Archer Aiming Bow',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 111,
    tags: 'stickman, silhouette, archery, bow and arrow, hunter, target, robin hood, olympics, aim, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Bow Arc & String on Left -->
  <path d="M120 70 Q70 200 120 330" fill="none" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <line x1="120" y1="70" x2="220" y2="190" stroke="#000000" stroke-width="3"/>
  <line x1="120" y1="330" x2="220" y2="190" stroke="#000000" stroke-width="3"/>
  <!-- Arrow -->
  <line x1="90" y1="190" x2="240" y2="190" stroke="#000000" stroke-width="6"/>
  <polygon points="85,190 100,183 100,197" fill="#000000"/>
  <!-- Head (profile focus) -->
  <circle cx="256" cy="115" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="230" y="170" width="55" height="130" rx="26" fill="#000000"/>
  <!-- Left Arm (Extended holding bow) -->
  <line x1="235" y1="190" x2="105" y2="195" stroke="#000000" stroke-width="22" stroke-linecap="round"/>
  <!-- Right Arm (Drawn back pulling string to cheek) -->
  <path d="M280 190 L320 185 L225 190" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Stable Archer Legs -->
  <line x1="245" y1="300" x2="220" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="275" y1="300" x2="300" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 7. Boxing Punch
  {
    id: 'stickman-boxing-punch',
    title: 'Stickman Boxer Throwing Punch',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 125,
    tags: 'stickman, silhouette, boxing, boxer, punch, knockout, fight, martial arts, sparring, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (Chinned down guard) -->
  <circle cx="210" cy="105" r="44" fill="#000000"/>
  <!-- Torso (Coiled forward) -->
  <path d="M205 160 L185 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Left Arm (Guard protecting chin) -->
  <path d="M200 175 L220 195 L225 140" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="225" cy="135" r="18" fill="#000000"/>
  <!-- Right Arm (Straight jab / cross punch) -->
  <line x1="210" y1="170" x2="360" y2="155" stroke="#000000" stroke-width="24" stroke-linecap="round"/>
  <circle cx="375" cy="155" r="22" fill="#000000"/>
  <!-- Boxing Stance Legs -->
  <path d="M185 295 L145 360 L125 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M195 295 L245 365 L275 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 8. Karate High Kick
  {
    id: 'stickman-karate-kick',
    title: 'Stickman Karate High Kick',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 130,
    tags: 'stickman, silhouette, karate, kick, taekwondo, martial arts, judo, fighter, high kick, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (leaning back for counter-balance) -->
  <circle cx="160" cy="170" r="44" fill="#000000"/>
  <!-- Torso (leaning 45 deg back) -->
  <path d="M175 220 L240 310" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms in guard -->
  <path d="M180 230 L220 220 L240 180" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M170 235 L140 260 L160 290" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Standing Leg (Firm plant) -->
  <path d="M240 310 L250 375 L245 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <!-- High Side Kick Leg (Reaching high in air) -->
  <path d="M240 310 L330 220 L420 130" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 9. Jump Rope Workout
  {
    id: 'stickman-jumping-rope',
    title: 'Stickman Jump Rope Cardio',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 98,
    tags: 'stickman, silhouette, jump rope, skipping, cardio, boxing workout, fitness, leap, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Jump Rope Arc looping overhead -->
  <path d="M180 230 Q256 20 332 230" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="256" cy="115" r="44" fill="#000000"/>
  <!-- Torso (mid-air suspension) -->
  <rect x="226" y="170" width="60" height="120" rx="26" fill="#000000"/>
  <!-- Arms holding rope handles at hips -->
  <path d="M226 185 L180 230" stroke="#000000" stroke-width="22" stroke-linecap="round"/>
  <path d="M286 185 L332 230" stroke="#000000" stroke-width="22" stroke-linecap="round"/>
  <!-- Legs bent leaping off ground -->
  <path d="M240 290 L230 365 L245 420" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M272 290 L282 365 L267 420" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 10. Pullup Bar Workout
  {
    id: 'stickman-pullup-bar',
    title: 'Stickman Pull-Up Bar',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 105,
    tags: 'stickman, silhouette, pullup, chinup, calisthenics, gym, bar, fitness, back workout, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Horizontal Pull-up Bar -->
  <line x1="80" y1="80" x2="432" y2="80" stroke="#000000" stroke-width="16" stroke-linecap="round"/>
  <!-- Head positioned above / at bar height -->
  <circle cx="256" cy="100" r="44" fill="#000000"/>
  <!-- Arms grasping bar -->
  <path d="M200 80 L220 145" stroke="#000000" stroke-width="24" stroke-linecap="round"/>
  <path d="M312 80 L292 145" stroke="#000000" stroke-width="24" stroke-linecap="round"/>
  <!-- Torso hanging -->
  <rect x="226" y="145" width="60" height="135" rx="26" fill="#000000"/>
  <!-- Legs bent backwards in air -->
  <path d="M240 280 L225 355 L255 415" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M272 280 L260 355 L290 415" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 11. Firefighter with Water Hose
  {
    id: 'stickman-firefighter-hose',
    title: 'Stickman Firefighter Water Hose',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 116,
    tags: 'stickman, silhouette, firefighter, fire, hose, rescue, hero, water, emergency, service, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Firefighter Helmet Brim -->
  <ellipse cx="205" cy="85" rx="35" ry="10" fill="#000000"/>
  <!-- Head -->
  <circle cx="205" cy="105" r="42" fill="#000000"/>
  <!-- Torso (Braced for pressure) -->
  <path d="M200 160 L180 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms holding brass nozzle hose -->
  <path d="M195 180 L240 215 L310 205" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Water Hose Nozzle -->
  <rect x="300" y="195" width="35" height="18" rx="4" fill="#000000"/>
  <!-- Powerful Water Jet Stream -->
  <path d="M335 204 L440 185 L445 225 Z" fill="#000000" opacity="0.85"/>
  <!-- Braced Power Legs -->
  <path d="M180 295 L140 365 L115 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M190 295 L230 365 L265 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 12. Police Officer with Handcuffs
  {
    id: 'stickman-police-handcuffs',
    title: 'Stickman Police Officer',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 110,
    tags: 'stickman, silhouette, police, officer, handcuffs, cop, law enforcement, security, patrol, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Police Visor Cap -->
  <rect x="220" y="60" width="72" height="20" rx="6" fill="#000000"/>
  <line x1="210" y1="80" x2="270" y2="80" stroke="#000000" stroke-width="6"/>
  <!-- Head -->
  <circle cx="256" cy="110" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="165" width="60" height="135" rx="26" fill="#000000"/>
  <!-- Left Arm (Akimbo on duty belt) -->
  <path d="M286 185 L330 235 L286 270" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding up handcuffs) -->
  <path d="M226 185 L180 215 L180 160" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Handcuffs silhouette -->
  <circle cx="170" cy="145" r="14" fill="none" stroke="#000000" stroke-width="6"/>
  <circle cx="195" cy="145" r="14" fill="none" stroke="#000000" stroke-width="6"/>
  <!-- Duty Legs -->
  <line x1="240" y1="300" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="300" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 13. Painter with Paint Roller
  {
    id: 'stickman-painter-roller',
    title: 'Stickman Wall Painter',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 95,
    tags: 'stickman, silhouette, painter, painting, paint roller, wall, decor, home improvement, renovation, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head looking up at wall -->
  <circle cx="230" cy="130" r="44" fill="#000000"/>
  <!-- Torso (reaching high) -->
  <path d="M225 185 L220 310" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms reaching high holding paint roller handle -->
  <path d="M225 195 L270 140 L310 90" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Paint Roller Cylinder & Fresh Paint Stripe -->
  <line x1="310" y1="90" x2="340" y2="70" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <rect x="335" y="45" width="22" height="50" rx="4" fill="#000000"/>
  <line x1="355" y1="45" x2="355" y2="120" stroke="#000000" stroke-width="12" opacity="0.3"/>
  <!-- Legs -->
  <line x1="210" y1="310" x2="195" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="235" y1="310" x2="250" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 14. Carpenter Sawing Wood
  {
    id: 'stickman-carpenter-saw',
    title: 'Stickman Carpenter Sawing Wood',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 99,
    tags: 'stickman, silhouette, carpenter, woodworking, saw, lumber, workshop, craftsman, builder, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Sawhorse Workbench on Left -->
  <line x1="80" y1="330" x2="240" y2="330" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <line x1="110" y1="330" x2="90" y2="445" stroke="#000000" stroke-width="10"/>
  <line x1="210" y1="330" x2="230" y2="445" stroke="#000000" stroke-width="10"/>
  <!-- Head -->
  <circle cx="280" cy="130" r="44" fill="#000000"/>
  <!-- Torso (bent over lumber) -->
  <path d="M275 185 L260 310" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Left Hand holding wood down -->
  <path d="M265 200 L200 260 L180 320" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm sawing with hand saw -->
  <path d="M280 200 L240 265 L170 300" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Hand Saw Blade -->
  <polygon points="170,295 110,345 130,355 180,310" fill="#000000"/>
  <!-- Legs -->
  <path d="M260 310 L280 375 L300 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M250 310 L230 375 L220 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 15. Fine Dining Waiter Balancing Tray
  {
    id: 'stickman-waiter-tray',
    title: 'Stickman Waiter Serving Platter',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 120,
    tags: 'stickman, silhouette, waiter, restaurant, server, food, platter, tray, dining, hospitality, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Serving Tray with Dome Cloche -->
  <line x1="280" y1="120" x2="380" y2="120" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <path d="M305 120 Q330 80 355 120 Z" fill="#000000"/>
  <circle cx="330" cy="78" r="5" fill="#000000"/>
  <!-- Head -->
  <circle cx="230" cy="115" r="44" fill="#000000"/>
  <!-- Torso (formal upright walk) -->
  <rect x="200" y="170" width="55" height="130" rx="26" fill="#000000"/>
  <!-- Left Arm (Holding serving towel over forearm) -->
  <path d="M200 185 L160 230 L180 270" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="165" y="240" width="22" height="40" rx="4" fill="#000000"/>
  <!-- Right Arm (Balancing tray with fingertips) -->
  <path d="M245 185 L290 190 L330 130" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (dignified walking step) -->
  <line x1="215" y1="300" x2="200" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="300" x2="265" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 16. Gardener with Watering Can
  {
    id: 'stickman-gardener-watering',
    title: 'Stickman Gardener Watering Plants',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 101,
    tags: 'stickman, silhouette, gardener, watering can, plants, garden, flowers, nature, eco, growth, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="105" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="180" y="160" width="58" height="130" rx="26" fill="#000000"/>
  <!-- Arms holding watering can -->
  <path d="M225 180 L280 210 L310 240" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Watering Can Silhouette -->
  <rect x="290" y="225" width="45" height="35" rx="6" fill="#000000"/>
  <path d="M290 230 Q275 220 290 210" stroke="#000000" stroke-width="6" fill="none"/>
  <!-- Spout pouring drops -->
  <line x1="335" y1="235" x2="380" y2="210" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <circle cx="395" cy="225" r="3" fill="#000000"/>
  <circle cx="405" cy="240" r="3" fill="#000000"/>
  <circle cx="390" cy="255" r="3" fill="#000000"/>
  <!-- Sprouting flower on right -->
  <line x1="400" y1="360" x2="400" y2="445" stroke="#000000" stroke-width="6"/>
  <circle cx="400" cy="350" r="12" fill="#000000"/>
  <!-- Legs -->
  <line x1="195" y1="290" x2="185" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="225" y1="290" x2="240" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 17. Scientist with Microscope
  {
    id: 'stickman-scientist-microscope',
    title: 'Stickman Scientist Microscope',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 114,
    tags: 'stickman, silhouette, scientist, laboratory, research, biology, microscope, medical, chemistry, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Microscope on Desk -->
  <rect x="110" y="320" width="80" height="15" rx="3" fill="#000000"/>
  <line x1="165" y1="320" x2="165" y2="240" stroke="#000000" stroke-width="12"/>
  <path d="M165 240 Q150 200 130 220" fill="none" stroke="#000000" stroke-width="10"/>
  <rect x="115" y="210" width="22" height="35" rx="3" fill="#000000" transform="rotate(30 126 227)"/>
  <!-- Head (peering closely into eyepiece) -->
  <circle cx="175" cy="160" r="44" fill="#000000"/>
  <!-- Torso (bent forward examining slide) -->
  <path d="M185 210 L230 315" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arm adjusting focus dial -->
  <path d="M190 225 L165 260 L145 275" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Sitting on lab stool) -->
  <path d="M230 315 L260 375 L250 445" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M220 315 L200 380 L190 445" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 18. Judge with Gavel
  {
    id: 'stickman-judge-gavel',
    title: 'Stickman Judge Striking Gavel',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 109,
    tags: 'stickman, silhouette, judge, courtroom, gavel, justice, law, legal, order in court, verdict, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Bench & Sound Block on Right -->
  <rect x="290" y="260" width="100" height="20" rx="4" fill="#000000"/>
  <!-- Head -->
  <circle cx="210" cy="115" r="44" fill="#000000"/>
  <!-- Torso (Formal robe robe shape) -->
  <path d="M170 170 L250 170 L265 310 L155 310 Z" fill="#000000"/>
  <!-- Left Hand on bench -->
  <path d="M175 185 L140 240 L160 270" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Raising wooden gavel high to strike) -->
  <path d="M245 180 L290 150 L330 120" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Gavel Mallet & Handle -->
  <line x1="330" y1="120" x2="360" y2="90" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <rect x="345" y="65" width="30" height="18" rx="4" fill="#000000" transform="rotate(-45 360 74)"/>
  <!-- Legs behind bench -->
  <line x1="195" y1="310" x2="195" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="225" y1="310" x2="225" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 19. Barista Pouring Latte Art
  {
    id: 'stickman-barista-latte',
    title: 'Stickman Barista Pouring Coffee',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 118,
    tags: 'stickman, silhouette, barista, cafe, coffee shop, latte art, espresso, brewing, culinary, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down watching pour -->
  <circle cx="230" cy="115" r="44" fill="#000000"/>
  <!-- Torso (apron bib profile) -->
  <rect x="200" y="170" width="58" height="130" rx="26" fill="#000000"/>
  <!-- Left Hand holding cup & saucer -->
  <path d="M200 185 L160 230 L200 260" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M190 260 Q215 275 240 260 Z" fill="#000000"/>
  <!-- Right Arm tilting milk pitcher -->
  <path d="M245 185 L280 200 L250 230" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <polygon points="250,220 270,210 265,240" fill="#000000"/>
  <!-- Legs -->
  <line x1="215" y1="300" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="300" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 20. Drummer with Drumsticks
  {
    id: 'stickman-musician-drummer',
    title: 'Stickman Drummer Jamming',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 124,
    tags: 'stickman, silhouette, drummer, drums, percussion, rock band, concert, rhythm, sticks, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Snare & Tom Drums & Cymbals -->
  <line x1="120" y1="200" x2="190" y2="180" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <line x1="330" y1="180" x2="400" y2="200" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="170" cy="270" rx="35" ry="12" fill="#000000"/>
  <ellipse cx="340" cy="270" rx="35" ry="12" fill="#000000"/>
  <!-- Head rocking back -->
  <circle cx="256" cy="120" r="44" fill="#000000"/>
  <!-- Torso (Seated rocking) -->
  <rect x="226" y="175" width="60" height="120" rx="26" fill="#000000"/>
  <!-- Arms raised high with drumsticks -->
  <path d="M226 190 L160 140 L140 100" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="140" y1="100" x2="160" y2="70" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <path d="M286 190 L352 140 L372 100" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="372" y1="100" x2="352" y2="70" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <!-- Seated Drummer Legs -->
  <path d="M235 295 L190 350 L180 435" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M275 295 L320 350 L330 435" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 21. Airport Traveler with Rolling Suitcase
  {
    id: 'stickman-traveller-luggage',
    title: 'Stickman Airport Traveler Suitcase',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 135,
    tags: 'stickman, silhouette, luggage, suitcase, travel, vacation, airport, tourist, holiday, flight, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Rolling Suitcase behind traveler -->
  <rect x="90" y="320" width="55" height="90" rx="8" fill="#000000"/>
  <circle cx="100" cy="420" r="8" fill="#000000"/>
  <circle cx="135" cy="420" r="8" fill="#000000"/>
  <line x1="120" y1="320" x2="165" y2="245" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso (forward stride) -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Hand holding luggage handle behind -->
  <path d="M226 175 L180 220 L165 245" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm swinging forward -->
  <path d="M286 175 L325 225 L345 220" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Walking Stride Legs -->
  <path d="M240 290 L215 365 L200 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M272 290 L290 365 L315 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 22. Hiker with Big Trekking Backpack
  {
    id: 'stickman-backpacking-hiker',
    title: 'Stickman Trekking Hiker',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 122,
    tags: 'stickman, silhouette, hiker, backpack, trekking, camping, outdoor, mountain, trail, journey, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Big Trekking Backpack on Back -->
  <rect x="130" y="160" width="70" height="110" rx="14" fill="#000000"/>
  <rect x="140" y="140" width="50" height="20" rx="6" fill="#000000"/>
  <!-- Head -->
  <circle cx="240" cy="105" r="44" fill="#000000"/>
  <!-- Torso (leaning into uphill climb) -->
  <path d="M235 160 L210 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arm holding trekking pole -->
  <path d="M235 180 L290 220 L310 240" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Trekking Pole -->
  <line x1="310" y1="200" x2="330" y2="445" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Hiking Striding Legs -->
  <path d="M210 295 L170 365 L150 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M220 295 L260 365 L290 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 23. Listening to Music with Headphones
  {
    id: 'stickman-listening-headphones',
    title: 'Stickman Listening Headphones',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 138,
    tags: 'stickman, silhouette, headphones, music, audio, podcast, jamming, tunes, beats, lifestyle, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Over-Ear Headphones Arc -->
  <path d="M205 95 Q256 35 307 95" fill="none" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <rect x="195" y="85" width="16" height="26" rx="6" fill="#000000"/>
  <rect x="301" y="85" width="16" height="26" rx="6" fill="#000000"/>
  <!-- Head nodding with rhythm -->
  <circle cx="256" cy="95" r="44" fill="#000000"/>
  <!-- Floating Music Notes -->
  <path d="M340 50 L360 40 L360 70 M340 80 A5 5 0 1 1 340 70 A5 5 0 1 1 340 80" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Hands holding headphone cups vibing -->
  <path d="M226 175 L180 150 L200 100" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 175 L332 150 L312 100" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs groove tapping -->
  <line x1="240" y1="290" x2="230" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <path d="M272 290 L290 375 L315 440" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 24. Virtual Reality VR Headset
  {
    id: 'stickman-vr-headset',
    title: 'Stickman VR Metaverse Headset',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 129,
    tags: 'stickman, silhouette, vr, virtual reality, metaverse, gaming, headset, future, tech, oculus, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="44" fill="#000000"/>
  <!-- VR Goggles / Headset mounted on face -->
  <rect x="250" y="80" width="45" height="26" rx="6" fill="#000000"/>
  <path d="M230 92 L250 92" stroke="#000000" stroke-width="6"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms reaching out feeling virtual 3D space -->
  <path d="M286 175 L350 170 L390 150" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M226 175 L170 190 L130 180" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Tentative cautious step) -->
  <line x1="240" y1="290" x2="225" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="290" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 25. Drone Pilot with Remote Controller
  {
    id: 'stickman-drone-pilot',
    title: 'Stickman Drone Pilot',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 106,
    tags: 'stickman, silhouette, drone, pilot, quadcopter, remote control, technology, aerial, fly, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Flying Quadcopter Drone overhead on Right -->
  <line x1="360" y1="65" x2="430" y2="65" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <line x1="395" y1="40" x2="395" y2="90" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <circle cx="395" cy="65" r="10" fill="#000000"/>
  <!-- Head tilted up observing flight -->
  <circle cx="230" cy="115" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="200" y="170" width="58" height="135" rx="26" fill="#000000"/>
  <!-- Hands holding two-handed drone remote -->
  <path d="M200 185 L230 230 L260 215" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M255 185 L260 220" stroke="#000000" stroke-width="22" stroke-linecap="round" fill="none"/>
  <rect x="240" y="205" width="35" height="24" rx="4" fill="#000000"/>
  <line x1="250" y1="205" x2="245" y2="185" stroke="#000000" stroke-width="4"/>
  <!-- Legs -->
  <line x1="215" y1="305" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="305" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 26. Eating Noodles / Ramen with Chopsticks
  {
    id: 'stickman-eating-noodles',
    title: 'Stickman Eating Ramen Noodles',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 121,
    tags: 'stickman, silhouette, eating, noodles, ramen, bowl, chopsticks, food, dinner, delicious, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down over bowl -->
  <circle cx="230" cy="110" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="200" y="165" width="58" height="130" rx="26" fill="#000000"/>
  <!-- Left Hand cradling noodle bowl -->
  <path d="M200 180 L160 230 L195 240" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Noodle Bowl -->
  <path d="M190 235 Q225 270 260 235 Z" fill="#000000"/>
  <!-- Right Arm with Chopsticks lifting noodles -->
  <path d="M255 180 L290 200 L245 160" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="240" y1="170" x2="225" y2="135" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
  <line x1="245" y1="170" x2="230" y2="135" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
  <!-- Legs (Sitting or standing) -->
  <line x1="215" y1="295" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="295" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 27. Eating a Slice of Pizza
  {
    id: 'stickman-eating-pizza',
    title: 'Stickman Eating Pizza Slice',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 134,
    tags: 'stickman, silhouette, pizza, eating, food, fast food, cheese, slice, hungry, lunch, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted back savoring slice -->
  <circle cx="230" cy="110" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="200" y="165" width="58" height="130" rx="26" fill="#000000"/>
  <!-- Left Arm (Akimbo satisfied) -->
  <path d="M200 185 L160 235 L200 265" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm lifting pizza slice to mouth -->
  <path d="M255 180 L290 190 L260 135" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Triangle Pizza Slice -->
  <polygon points="255,130 280,105 295,125" fill="#000000"/>
  <!-- Legs -->
  <line x1="215" y1="295" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="295" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 28. Carrying Shopping Bags
  {
    id: 'stickman-shopping-bags',
    title: 'Stickman Retail Shopping Bags',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 142,
    tags: 'stickman, silhouette, shopping, mall, retail, bags, buyer, spree, consumer, fashion, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm with Shopping Bag -->
  <path d="M286 175 L330 230 L330 280" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Shopping Bag Left -->
  <rect x="310" y="280" width="55" height="65" rx="6" fill="#000000"/>
  <path d="M325 280 Q337 260 350 280" stroke="#000000" stroke-width="6" fill="none"/>
  <!-- Right Arm with Shopping Bag -->
  <path d="M226 175 L180 230 L180 280" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Shopping Bag Right -->
  <rect x="145" y="280" width="55" height="65" rx="6" fill="#000000"/>
  <path d="M160 280 Q172 260 185 280" stroke="#000000" stroke-width="6" fill="none"/>
  <!-- Legs (Happy walking stride) -->
  <line x1="240" y1="290" x2="225" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="285" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 29. Screaming in Terror / Horror (The Scream)
  {
    id: 'stickman-screaming-horror',
    title: 'Stickman Screaming Shock Horror',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 126,
    tags: 'stickman, silhouette, scream, fear, shock, terror, horror, panic, hands on face, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head with open mouth -->
  <circle cx="256" cy="100" r="46" fill="#000000"/>
  <ellipse cx="256" cy="115" rx="14" ry="20" fill="#ffffff"/>
  <!-- Torso (trembling waviness) -->
  <rect x="226" y="160" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Hands clutching both cheeks in panic -->
  <path d="M226 175 L190 140 L220 105" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 175 L322 140 L292 105" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Shaking Legs -->
  <path d="M240 295 L225 365 L240 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M272 295 L285 365 L270 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 30. Laughing Hysterically Holding Belly
  {
    id: 'stickman-laughing-belly',
    title: 'Stickman Laughing Hysterically',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 131,
    tags: 'stickman, silhouette, laughing, lol, comedy, hilarious, holding belly, joke, funny, humor, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted back laughing -->
  <circle cx="270" cy="105" r="44" fill="#000000"/>
  <!-- Torso (doubled over in laughter) -->
  <path d="M260 160 L230 280" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms wrapped around belly clutching stomach -->
  <path d="M260 170 L200 230 L240 260" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M260 170 L280 230 L250 260" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Bent Laughing Knees -->
  <path d="M230 280 L195 355 L215 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M230 280 L265 355 L285 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 31. Tiptoeing Sneakily
  {
    id: 'stickman-tiptoe-sneaking',
    title: 'Stickman Tiptoe Sneaking',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 99,
    tags: 'stickman, silhouette, tiptoe, sneak, stealth, quiet, ninja, secret, burglar, creepy, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head looking around cautiously -->
  <circle cx="280" cy="115" r="44" fill="#000000"/>
  <!-- Torso (hunched forward stealth) -->
  <path d="M270 170 L235 290" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms held up delicately for balance -->
  <path d="M270 180 L220 200 L200 170" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M270 180 L310 200 L330 170" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Tiptoe High Heel-Lifted Legs -->
  <path d="M235 290 L185 355 L160 440" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M235 290 L265 355 L300 440" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 32. Falling Backward / Slipping
  {
    id: 'stickman-falling-backward',
    title: 'Stickman Slipping Falling Backward',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 145,
    tags: 'stickman, silhouette, slip, trip, falling, caution wet floor, accident, banana peel, warning, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (flung backward) -->
  <circle cx="160" cy="180" r="44" fill="#000000"/>
  <!-- Torso (tilted 45 deg falling back) -->
  <path d="M195 210 L300 280" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms flailing in air -->
  <path d="M210 215 L220 130 L250 80" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M230 230 L170 180 L130 150" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs kicking up in air -->
  <path d="M300 280 L370 250 L430 200" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M300 280 L350 340 L390 390" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 33. Yawning and Morning Stretch
  {
    id: 'stickman-yawning-stretching',
    title: 'Stickman Yawning Morning Stretch',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 112,
    tags: 'stickman, silhouette, yawn, stretch, morning, waking up, tired, sleepy, bedtime, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted up yawning -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <ellipse cx="256" cy="110" rx="10" ry="14" fill="#ffffff"/>
  <!-- Torso (stretched long) -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms reaching high overhead interlocked -->
  <path d="M226 175 L180 100 L235 50" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 175 L332 100 L277 50" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="256" cy="48" r="14" fill="#000000"/>
  <!-- Legs (Arching stretch) -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 34. Clapping Hands in Applause
  {
    id: 'stickman-clapping-applause',
    title: 'Stickman Clapping Applause',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 128,
    tags: 'stickman, silhouette, clapping, applause, bravo, audience, celebrate, cheering, praise, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms bent in front clapping together -->
  <path d="M226 175 L190 220 L245 200" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 175 L322 220 L267 200" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Clap Spark Impact Lines -->
  <line x1="245" y1="180" x2="245" y2="165" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
  <line x1="265" y1="180" x2="265" y2="165" stroke="#000000" stroke-width="4" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 35. Crossed Arms Defiant / Confident
  {
    id: 'stickman-crossed-arms-defiant',
    title: 'Stickman Crossed Arms Confident',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 136,
    tags: 'stickman, silhouette, crossed arms, defiant, bouncer, bodyguard, confident, tough, attitude, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso (Broad chest) -->
  <rect x="220" y="155" width="72" height="135" rx="28" fill="#000000"/>
  <!-- Arms crossed over chest -->
  <path d="M220 180 L180 230 L310 230" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M292 180 L332 230 L220 230" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Solid Bouncer Stance Legs -->
  <line x1="235" y1="290" x2="210" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="277" y1="290" x2="302" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 36. Whispering a Secret
  {
    id: 'stickman-whispering-secret',
    title: 'Stickman Whispering Secret',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 94,
    tags: 'stickman, silhouette, whisper, secret, gossip, confidential, quiet, speak softly, mystery, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head leaning sideways -->
  <circle cx="265" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="235" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Hand cupping mouth to whisper -->
  <path d="M235 175 L200 200 L240 120" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <ellipse cx="240" cy="115" rx="14" ry="18" fill="#000000"/>
  <!-- Left Arm at side -->
  <path d="M295 175 L315 240 L310 295" stroke="#000000" stroke-width="24" stroke-linecap="round" fill="none"/>
  <!-- Legs -->
  <line x1="245" y1="290" x2="240" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="275" y1="290" x2="280" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 37. Pulling Heavy Rope (Tug of War)
  {
    id: 'stickman-pulling-rope',
    title: 'Stickman Pulling Rope',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 119,
    tags: 'stickman, silhouette, pulling, rope, tug of war, effort, strength, haul, team, resistance, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Taut Heavy Rope across canvas -->
  <line x1="50" y1="220" x2="460" y2="220" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <!-- Head (leaning 45 deg back) -->
  <circle cx="160" cy="140" r="44" fill="#000000"/>
  <!-- Torso (leaning back fighting tension) -->
  <path d="M180 185 L260 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms gripping rope tightly -->
  <path d="M180 195 L220 220 L270 220" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Planted Braced Straining Legs -->
  <path d="M260 295 L310 365 L360 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M260 295 L230 365 L210 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 38. Vlogger / Influencer with Selfie Stick
  {
    id: 'stickman-selfie-stick',
    title: 'Stickman Vlogger Selfie Stick',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 130,
    tags: 'stickman, silhouette, selfie stick, vlogger, youtube, creator, camera, filming, influencer, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (smiling angle) -->
  <circle cx="210" cy="115" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="180" y="165" width="58" height="135" rx="26" fill="#000000"/>
  <!-- Left Hand waving to camera -->
  <path d="M180 185 L140 170 L130 120" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm holding out long selfie stick -->
  <path d="M238 185 L300 170" stroke="#000000" stroke-width="22" stroke-linecap="round"/>
  <!-- Selfie Stick Extension & Smartphone -->
  <line x1="300" y1="170" x2="390" y2="90" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <rect x="380" y="70" width="28" height="16" rx="4" fill="#000000" transform="rotate(35 394 78)"/>
  <!-- Legs (Walking towards camera) -->
  <line x1="195" y1="300" x2="185" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="225" y1="300" x2="245" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 39. Baseball Batter Ready Stance
  {
    id: 'stickman-baseball-batter',
    title: 'Stickman Baseball Batter',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 104,
    tags: 'stickman, silhouette, baseball, batter, home run, mlb, bat, athlete, sports, swing, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Batting Helmet Cap Peak -->
  <path d="M210 90 L260 90" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="210" cy="115" r="44" fill="#000000"/>
  <!-- Torso (Coiled stance) -->
  <path d="M210 170 L210 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms holding baseball bat cocked back over shoulder -->
  <path d="M210 180 L160 180 L150 130" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Baseball Bat -->
  <polygon points="145,130 90,40 105,30 155,120" fill="#000000"/>
  <!-- Wide Athletic Batter Squat Legs -->
  <path d="M210 295 L160 365 L145 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M210 295 L260 365 L275 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 40. Playing Handheld Gaming Console
  {
    id: 'stickman-gamer-handheld',
    title: 'Stickman Handheld Gamer',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 133,
    tags: 'stickman, silhouette, gaming, nintendo switch, console, handheld, gamer, portable, play, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down focused on screen -->
  <circle cx="256" cy="105" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="165" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms holding console in front of chest -->
  <path d="M226 185 L180 230 L220 220" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 185 L332 230 L292 220" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Handheld Console (Switch shape) -->
  <rect x="210" y="205" width="92" height="40" rx="8" fill="#000000"/>
  <rect x="226" y="212" width="60" height="26" rx="3" fill="#ffffff"/>
  <!-- Legs -->
  <line x1="240" y1="300" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="300" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 41. Plumber with Large Pipe Wrench
  {
    id: 'stickman-plumber-wrench',
    title: 'Stickman Plumber Pipe Wrench',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 98,
    tags: 'stickman, silhouette, plumber, wrench, pipe, repair, tools, handyman, maintenance, trade, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Pipe System on Left -->
  <line x1="80" y1="40" x2="80" y2="445" stroke="#000000" stroke-width="16"/>
  <line x1="80" y1="230" x2="160" y2="230" stroke="#000000" stroke-width="16"/>
  <!-- Head -->
  <circle cx="256" cy="115" r="44" fill="#000000"/>
  <!-- Torso (reaching forward) -->
  <rect x="226" y="170" width="58" height="130" rx="26" fill="#000000"/>
  <!-- Arms holding big pipe wrench onto pipe -->
  <path d="M230 185 L180 200 L140 220" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Big Pipe Wrench -->
  <line x1="140" y1="220" x2="200" y2="250" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <rect x="125" y="210" width="25" height="22" rx="4" fill="#000000"/>
  <!-- Legs braced for torque -->
  <path d="M235 300 L200 375 L185 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M265 300 L290 375 L315 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 42. Electrician Inspecting Wiring
  {
    id: 'stickman-electrician-wires',
    title: 'Stickman Electrician Wires',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 92,
    tags: 'stickman, silhouette, electrician, wires, voltage, tool, electrical, repair, circuit, trade, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Breaker Panel on Wall Right -->
  <rect x="360" y="120" width="70" height="90" rx="6" fill="none" stroke="#000000" stroke-width="10"/>
  <circle cx="395" cy="165" r="8" fill="#000000"/>
  <!-- Head -->
  <circle cx="230" cy="115" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="200" y="170" width="58" height="135" rx="26" fill="#000000"/>
  <!-- Arms using wire strippers on panel -->
  <path d="M245 185 L300 170 L360 165" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Pliers / Stripper Tool -->
  <line x1="330" y1="160" x2="360" y2="165" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="215" y1="305" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="305" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 43. Teacher Writing on Chalkboard
  {
    id: 'stickman-teacher-chalkboard',
    title: 'Stickman Teacher Chalkboard',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 111,
    tags: 'stickman, silhouette, teacher, school, chalkboard, education, math, lesson, classroom, blackboard, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Blackboard on Left -->
  <rect x="60" y="60" width="150" height="160" rx="8" fill="none" stroke="#000000" stroke-width="12"/>
  <text x="80" y="130" font-family="sans-serif" font-weight="bold" font-size="28" fill="#000000">E=mc²</text>
  <!-- Head -->
  <circle cx="270" cy="115" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="240" y="170" width="58" height="135" rx="26" fill="#000000"/>
  <!-- Left Arm (Writing on board with chalk) -->
  <path d="M240 185 L180 150 L140 150" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding book / textbook) -->
  <path d="M298 185 L330 230 L300 250" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="290" y="240" width="30" height="40" rx="4" fill="#000000"/>
  <!-- Legs -->
  <line x1="255" y1="305" x2="245" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="285" y1="305" x2="295" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 44. Farmer with Pitchfork
  {
    id: 'stickman-farmer-pitchfork',
    title: 'Stickman Farmer Pitchfork',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 93,
    tags: 'stickman, silhouette, farmer, agriculture, pitchfork, hay, countryside, harvest, farm, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Straw Hat Brim -->
  <ellipse cx="230" cy="80" rx="40" ry="10" fill="#000000"/>
  <!-- Head -->
  <circle cx="230" cy="105" r="42" fill="#000000"/>
  <!-- Torso (Overalls) -->
  <rect x="200" y="160" width="58" height="135" rx="26" fill="#000000"/>
  <!-- Left Arm holding pitchfork pole -->
  <path d="M200 180 L160 210 L140 230" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Long Pitchfork Pole & Prongs -->
  <line x1="140" y1="60" x2="140" y2="445" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <path d="M120 70 L120 40 L160 40 L160 70" fill="none" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <line x1="140" y1="40" x2="140" y2="20" stroke="#000000" stroke-width="6"/>
  <!-- Right Arm (Akimbo) -->
  <path d="M258 180 L295 220 L258 255" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs -->
  <line x1="215" y1="295" x2="205" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="245" y1="295" x2="255" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 45. Rollerblading / Inline Skating
  {
    id: 'stickman-rollerblading',
    title: 'Stickman Rollerblading Speed',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 102,
    tags: 'stickman, silhouette, rollerblades, inline skating, skater, park, speed, wheels, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (tilted forward speed) -->
  <circle cx="280" cy="110" r="44" fill="#000000"/>
  <!-- Torso (low speed skating angle) -->
  <path d="M270 160 L220 275" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms swinging for momentum -->
  <path d="M270 170 L210 190 L160 170" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M270 170 L340 180 L390 190" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Rollerblade Wheels on Feet -->
  <path d="M220 275 L180 345 L150 415" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <circle cx="130" cy="435" r="9" fill="#000000"/>
  <circle cx="150" cy="435" r="9" fill="#000000"/>
  <circle cx="170" cy="435" r="9" fill="#000000"/>
  <path d="M220 275 L280 345 L320 405" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <circle cx="305" cy="425" r="9" fill="#000000"/>
  <circle cx="325" cy="425" r="9" fill="#000000"/>
  <circle cx="345" cy="425" r="9" fill="#000000"/>
</svg>`
  },

  // 46. Ice Skating Figure Gliding
  {
    id: 'stickman-ice-skating',
    title: 'Stickman Ice Skating Glide',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 107,
    tags: 'stickman, silhouette, ice skating, figure skating, winter, rink, glide, elegant, olympics, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="280" cy="115" r="44" fill="#000000"/>
  <!-- Torso (Graceful forward arabesque lean) -->
  <path d="M270 165 L220 260" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arms spread wide gracefully -->
  <path d="M270 175 L350 150 L400 130" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M250 185 L180 170 L130 180" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Gliding Front Leg with Skate Blade -->
  <path d="M220 260 L230 350 L220 435" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <line x1="190" y1="445" x2="250" y2="445" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Extended Rear Leg in Air -->
  <path d="M220 260 L140 280 L70 290" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 47. Badminton Jumping Smash
  {
    id: 'stickman-badminton-smash',
    title: 'Stickman Badminton Jump Smash',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 115,
    tags: 'stickman, silhouette, badminton, shuttlecock, smash, racket, jump, court, athlete, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Shuttlecock airborne -->
  <polygon points="320,60 305,40 335,40" fill="#000000"/>
  <!-- Head -->
  <circle cx="230" cy="115" r="44" fill="#000000"/>
  <!-- Torso (airborne arch) -->
  <path d="M230 165 L215 285" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Right Arm (High jumping overhead smash with racket) -->
  <path d="M240 175 L280 120 L300 70" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Badminton Racket -->
  <line x1="300" y1="70" x2="330" y2="40" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="350" cy="25" rx="20" ry="14" fill="none" stroke="#000000" stroke-width="6" transform="rotate(30 350 25)"/>
  <!-- Left Arm (Balance) -->
  <path d="M220 180 L170 220 L150 250" stroke="#000000" stroke-width="22" stroke-linecap="round" fill="none"/>
  <!-- Scissor Kick Legs in Air -->
  <path d="M215 285 L170 340 L140 395" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
  <path d="M215 285 L260 340 L290 390" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 48. Ping Pong / Table Tennis
  {
    id: 'stickman-table-tennis',
    title: 'Stickman Table Tennis Ping Pong',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 110,
    tags: 'stickman, silhouette, table tennis, ping pong, paddle, paddle ball, indoor sports, fast, smash, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Table Tennis Table Surface on Left -->
  <line x1="50" y1="310" x2="220" y2="310" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <line x1="120" y1="310" x2="120" y2="445" stroke="#000000" stroke-width="10"/>
  <line x1="210" y1="270" x2="210" y2="310" stroke="#000000" stroke-width="8"/>
  <!-- Head (crouched over table) -->
  <circle cx="280" cy="130" r="44" fill="#000000"/>
  <!-- Torso (low athletic crouch) -->
  <path d="M275 180 L270 300" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Right Arm with Ping Pong Paddle swinging forward -->
  <path d="M265 190 L220 240 L180 260" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Paddle & Ball -->
  <circle cx="165" cy="265" r="16" fill="#000000"/>
  <line x1="175" y1="275" x2="190" y2="290" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <circle cx="140" cy="245" r="8" fill="#000000"/>
  <!-- Deep Knees Bent Stance -->
  <path d="M270 300 L230 365 L220 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M270 300 L310 365 L330 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 49. Crying Tears Sitting (Sad)
  {
    id: 'stickman-crying-river',
    title: 'Stickman Crying Knees Hugged',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 120,
    tags: 'stickman, silhouette, crying, sad, sorrow, tears, heartbreak, grief, emotional, depressed, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head bowed over knees -->
  <circle cx="200" cy="180" r="44" fill="#000000"/>
  <!-- Teardrops falling -->
  <circle cx="165" cy="240" r="6" fill="#000000"/>
  <circle cx="155" cy="270" r="8" fill="#000000"/>
  <circle cx="150" cy="310" r="10" fill="#000000"/>
  <!-- Torso (curled into fetal ball) -->
  <path d="M230 220 L270 340" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms wrapping tight around knees -->
  <path d="M225 240 L160 270 L180 340 L240 350" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Knees tucked up to chest -->
  <path d="M270 340 L210 310 L180 370 L250 435" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 50. Tripping and Stumbling Forward
  {
    id: 'stickman-tripping-forward',
    title: 'Stickman Tripping Stumbling Forward',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 127,
    tags: 'stickman, silhouette, tripping, stumbling, clumsiness, obstacle, fall, oops, losing balance, accident, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Small Obstacle Rock on Ground -->
  <circle cx="180" cy="430" r="16" fill="#000000"/>
  <!-- Head thrown forward -->
  <circle cx="360" cy="190" r="44" fill="#000000"/>
  <!-- Torso (pitched forward at 40 degrees) -->
  <path d="M320 220 L220 290" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms flailing forward to break fall -->
  <path d="M310 225 L380 250 L430 270" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M300 230 L320 300 L370 330" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Front Leg reaching out frantically -->
  <path d="M220 290 L290 350 L340 430" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Back Leg caught on obstacle -->
  <path d="M220 290 L170 340 L160 415" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  }
];

// Append to stickmanData.js
const stickmanDataPath = path.resolve('src/stickmanData.js');
let currentContent = fs.readFileSync(stickmanDataPath, 'utf8');

const lastBracketIndex = currentContent.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing bracket in stickmanData.js");
  process.exit(1);
}

const newElementsCode = BATCH_2_STICKMEN.map(el => {
  return `  {
    id: ${JSON.stringify(el.id)},
    title: ${JSON.stringify(el.title)},
    category: ${JSON.stringify(el.category)},
    pack: ${JSON.stringify(el.pack)},
    assetType: ${JSON.stringify(el.assetType)},
    downloads: ${el.downloads},
    tags: ${JSON.stringify(el.tags)},
    svgCode: \`${el.svgCode}\`
  }`;
}).join(',\n');

const updatedContent = currentContent.slice(0, lastBracketIndex) + ',\n' + newElementsCode + '\n];\n';

fs.writeFileSync(stickmanDataPath, updatedContent, 'utf8');
console.log(`SUCCESS: Appended ${BATCH_2_STICKMEN.length} MORE unique stickmen to stickmanData.js!`);
