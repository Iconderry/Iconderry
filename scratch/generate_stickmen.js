// Script to generate 50 unique silhouette stickman items and merge them into stickmanData.js
import fs from 'fs';
import path from 'path';

export const NEW_50_STICKMEN = [
  // 1. Hand on Heart (Image 1)
  {
    id: 'stickman-hand-on-heart',
    title: 'Stickman Hand on Heart',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 84,
    tags: 'stickman, silhouette, hand on heart, pledge, gratitude, loyalty, oath, respect, chest, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <path d="M228 155 Q256 150 284 155 Q296 162 296 185 L296 280 Q296 295 284 295 L228 295 Q216 295 216 280 L216 185 Q216 162 228 155 Z" fill="#000000"/>
  <!-- Left Arm (Resting at side) -->
  <path d="M296 175 L314 240 L314 300" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Placed over chest/heart) -->
  <path d="M216 175 L180 215 L252 205" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="252" cy="205" r="16" fill="#000000"/>
  <!-- Legs -->
  <line x1="234" y1="295" x2="234" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="278" y1="295" x2="278" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 2. Chest Pain / Heartfelt Emotion (Image 1)
  {
    id: 'stickman-chest-pain',
    title: 'Stickman Chest Pain',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 65,
    tags: 'stickman, silhouette, chest pain, medical, clutching, heart attack, sorrow, emotion, hurt, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (tilted forward) -->
  <circle cx="270" cy="105" r="46" fill="#000000"/>
  <!-- Torso (hunching slightly) -->
  <path d="M236 165 Q268 160 298 172 Q310 182 306 205 L290 290 Q286 305 272 305 L224 298 Q210 295 214 278 L226 190 Q228 172 236 165 Z" fill="#000000"/>
  <!-- Left Arm (Dangling slightly bent) -->
  <path d="M305 185 L328 250 L320 315" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Grasping tightly at heart) -->
  <path d="M224 185 L182 230 L260 220" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="260" cy="220" r="18" fill="#000000"/>
  <!-- Legs (slight buckling knee) -->
  <path d="M236 300 Q215 370 205 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M280 305 Q295 370 290 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 3. Respectful Bow with Hand on Chest (Image 1)
  {
    id: 'stickman-bow-hand-chest',
    title: 'Stickman Bowing Hand on Chest',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 72,
    tags: 'stickman, silhouette, bow, respect, honor, greeting, Japanese bow, hand on heart, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (bowed lower and forward) -->
  <circle cx="285" cy="120" r="44" fill="#000000"/>
  <!-- Torso (leaning 20 degrees forward) -->
  <path d="M235 175 Q265 165 295 180 Q305 190 298 212 L265 295 Q258 310 242 305 L208 290 Q196 285 205 268 L225 195 Q228 180 235 175 Z" fill="#000000"/>
  <!-- Left Arm (Straight down along back) -->
  <path d="M298 185 L320 250 L310 320" stroke="#000000" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Hand placed gracefully on chest) -->
  <path d="M225 195 L190 235 L260 230" stroke="#000000" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="260" cy="230" r="16" fill="#000000"/>
  <!-- Legs (Upright respectful posture) -->
  <line x1="222" y1="298" x2="225" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="260" y1="305" x2="265" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 4. Standing with Briefcase (Image 2)
  {
    id: 'stickman-standing-briefcase',
    title: 'Stickman Standing with Briefcase',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 95,
    tags: 'stickman, silhouette, businessman, briefcase, office, corporate, standing, professional, work, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Resting straight) -->
  <path d="M286 175 L306 240 L306 295" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding Briefcase) -->
  <path d="M226 175 L190 235 L190 290" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Briefcase Handle & Body -->
  <path d="M180 290 Q190 278 200 290" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
  <rect x="150" y="295" width="80" height="60" rx="8" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="240" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="272" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 5. Walking with Briefcase (Image 2)
  {
    id: 'stickman-walking-briefcase',
    title: 'Stickman Walking with Briefcase',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 110,
    tags: 'stickman, silhouette, walking, briefcase, commuter, pedestrian, work, commute, business, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="265" cy="95" r="46" fill="#000000"/>
  <!-- Torso (slight forward lean) -->
  <path d="M240 155 Q270 150 295 160 Q305 170 300 195 L280 280 Q275 295 260 295 L225 285 Q212 280 220 260 L234 180 Q236 160 240 155 Z" fill="#000000"/>
  <!-- Left Arm (Swinging forward) -->
  <path d="M295 175 L335 215 L360 210" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding Briefcase) -->
  <path d="M234 175 L200 230 L200 285" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Briefcase -->
  <path d="M190 285 Q200 272 210 285" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
  <rect x="160" y="288" width="80" height="60" rx="8" fill="#000000" transform="rotate(-10 200 318)"/>
  <!-- Legs (Walking stride) -->
  <path d="M245 288 L220 365 L210 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M270 290 L285 365 L310 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 6. Fast Stride with Briefcase (Image 2)
  {
    id: 'stickman-stride-briefcase',
    title: 'Stickman Fast Stride with Briefcase',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 88,
    tags: 'stickman, silhouette, fast walk, stride, late, busy, briefcase, rushing, hustle, business, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="275" cy="95" r="46" fill="#000000"/>
  <!-- Torso (Dynamic 15 deg tilt) -->
  <path d="M245 155 Q275 148 305 160 Q315 172 308 198 L285 282 Q280 295 264 295 L228 285 Q215 280 224 260 L240 180 Q242 160 245 155 Z" fill="#000000"/>
  <!-- Left Arm (Swinging high forward) -->
  <path d="M305 175 L355 210 L385 220" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding Briefcase back) -->
  <path d="M235 175 L190 230 L180 280" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Briefcase Tilted Back -->
  <path d="M170 280 Q180 268 190 280" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
  <rect x="140" y="285" width="80" height="60" rx="8" fill="#000000" transform="rotate(-20 180 315)"/>
  <!-- Wide Stride Legs -->
  <path d="M250 288 L205 365 L175 440" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M275 290 L315 365 L360 440" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 7. Hands on Hips Confident (Image 3)
  {
    id: 'stickman-hands-on-hips',
    title: 'Stickman Confident Hands on Hips',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 98,
    tags: 'stickman, silhouette, hands on hips, confident, leader, superhero, power pose, proud, akimbo, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Akimbo on Hip) -->
  <path d="M286 175 L335 225 L286 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Akimbo on Hip) -->
  <path d="M226 175 L177 225 L226 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Straight upright) -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 8. Hands on Hips Wide Stance (Image 3)
  {
    id: 'stickman-hands-hips-wide',
    title: 'Stickman Power Stance Hands on Hips',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 87,
    tags: 'stickman, silhouette, wide stance, strong, ready, defiant, power pose, superhero, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Akimbo) -->
  <path d="M286 175 L335 225 L286 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Akimbo) -->
  <path d="M226 175 L177 225 L226 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Wide Stance Legs -->
  <line x1="240" y1="290" x2="200" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="312" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 9. Leaning on One Leg with Bent Knee (Image 3)
  {
    id: 'stickman-leaning-one-leg',
    title: 'Stickman Relaxed Leaning One Leg',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 92,
    tags: 'stickman, silhouette, casual, relaxed, cool, leaning, cross leg, hands on hips, chill, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso (slight hip tilt) -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000" transform="rotate(3 256 222)"/>
  <!-- Left Arm (Akimbo) -->
  <path d="M288 175 L335 225 L288 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Akimbo) -->
  <path d="M224 175 L177 225 L224 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Main Standing Leg (Straight down supporting weight) -->
  <line x1="245" y1="290" x2="240" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <!-- Resting Bent Leg (Knee bent inward resting foot against ankle) -->
  <path d="M275 290 L295 365 L252 415" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 10. Thinking Pose / Hand on Chin
  {
    id: 'stickman-thinking-chin',
    title: 'Stickman The Thinker',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 104,
    tags: 'stickman, silhouette, thinking, problem solving, idea, genius, rodin, hand on chin, question, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted slightly -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Folded across waist supporting elbow) -->
  <path d="M286 180 L300 245 L215 240" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Elbow resting on folded arm, hand touching chin) -->
  <path d="M226 180 L210 240 L250 142" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="250" cy="140" r="14" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 11. Talking on Phone while Walking
  {
    id: 'stickman-walking-phone',
    title: 'Stickman Walking on Phone',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 89,
    tags: 'stickman, silhouette, smartphone, call, talking, mobile, communication, walking, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="265" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="235" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Right Arm (Holding phone to ear) -->
  <path d="M235 175 L200 215 L228 120" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Smartphone -->
  <rect x="220" y="105" width="12" height="24" rx="3" fill="#000000" transform="rotate(-15 226 117)"/>
  <!-- Left Arm (Swinging natural) -->
  <path d="M295 175 L325 240 L315 295" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Walking) -->
  <path d="M245 290 L225 365 L215 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M275 290 L295 365 L315 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 12. Victory Arms High Celebration
  {
    id: 'stickman-celebration-victory',
    title: 'Stickman Celebration Victory',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 125,
    tags: 'stickman, silhouette, winner, victory, cheer, success, champion, celebration, joy, arms up, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="115" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="175" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Raised High in V) -->
  <path d="M286 195 L345 130 L385 70" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Raised High in V) -->
  <path d="M226 195 L167 130 L127 70" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Wide confident stance) -->
  <line x1="240" y1="310" x2="210" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="310" x2="302" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 13. Athletic Running Sprinter
  {
    id: 'stickman-sprinter-run',
    title: 'Stickman Sprinter Athletic',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 118,
    tags: 'stickman, silhouette, running, sprinter, marathon, athlete, sports, workout, cardio, fast, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (tilted forward aggressively) -->
  <circle cx="320" cy="110" r="44" fill="#000000"/>
  <!-- Torso (forward lean 45 degrees) -->
  <path d="M280 165 L220 270" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Left Arm (bent driving back) -->
  <path d="M275 180 L295 240 L345 250" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (bent pumping forward) -->
  <path d="M290 170 L350 170 L380 135" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Front Leg (high knee drive) -->
  <path d="M220 270 L285 320 L275 410" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Back Leg (extended full extension) -->
  <path d="M220 270 L160 330 L110 375" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 14. Jumping in the Air with Joy
  {
    id: 'stickman-jumping-joy',
    title: 'Stickman Jumping in Air',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 94,
    tags: 'stickman, silhouette, jumping, mid air, ecstatic, excited, happiness, leap, bounce, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="80" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="140" width="60" height="120" rx="28" fill="#000000"/>
  <!-- Arms (reaching up high) -->
  <path d="M226 155 L165 110 L135 65" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 155 L347 110 L377 65" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Tucked up in air) -->
  <path d="M240 260 L200 325 L235 375" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M272 260 L312 325 L277 375" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 15. Sitting on Chair Working at Desk
  {
    id: 'stickman-sitting-chair-work',
    title: 'Stickman Desk Office Worker',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 102,
    tags: 'stickman, silhouette, desk, office, computer, working, seated, chair, productivity, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="140" r="44" fill="#000000"/>
  <!-- Torso (Seated upright) -->
  <path d="M210 190 L210 320" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms (reaching to desk) -->
  <path d="M215 210 L280 260 L330 260" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Seated 90 degrees) -->
  <path d="M210 320 L290 320 L290 440" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Chair Outline -->
  <path d="M170 240 L170 340 L220 340" stroke="#000000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <line x1="170" y1="340" x2="170" y2="440" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <!-- Desk & Laptop -->
  <line x1="310" y1="280" x2="410" y2="280" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <line x1="380" y1="280" x2="380" y2="440" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <path d="M330 280 L355 250" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
</svg>`
  },

  // 16. Reading an Open Book
  {
    id: 'stickman-reading-book',
    title: 'Stickman Reading Book',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 91,
    tags: 'stickman, silhouette, reading, book, student, studying, education, library, knowledge, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down reading -->
  <circle cx="256" cy="105" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="165" width="60" height="130" rx="28" fill="#000000"/>
  <!-- Arms holding open book -->
  <path d="M226 185 L180 230 L235 245" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 185 L332 230 L277 245" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Open Book -->
  <path d="M210 245 L256 255 L302 245 L300 280 L256 290 L212 280 Z" fill="#000000"/>
  <line x1="256" y1="255" x2="256" y2="290" stroke="#ffffff" stroke-width="3"/>
  <!-- Legs -->
  <line x1="240" y1="295" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="295" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 17. Presenting with Pointer at Chart
  {
    id: 'stickman-presenting-board',
    title: 'Stickman Presenter with Pointer',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 112,
    tags: 'stickman, silhouette, presentation, whiteboard, teacher, speaker, meeting, chart, business, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Whiteboard Chart on Left -->
  <rect x="60" y="80" width="130" height="120" rx="10" fill="none" stroke="#000000" stroke-width="12"/>
  <line x1="125" y1="200" x2="125" y2="280" stroke="#000000" stroke-width="10"/>
  <polyline points="80,165 110,135 140,150 170,110" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="280" cy="115" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="250" y="175" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Holding pointer towards board) -->
  <path d="M250 195 L200 175 L160 145" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Pointer Stick -->
  <line x1="180" y1="160" x2="135" y2="125" stroke="#000000" stroke-width="6" stroke-linecap="round"/>
  <!-- Right Arm (Akimbo on Hip) -->
  <path d="M310 195 L345 235 L310 265" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs -->
  <line x1="264" y1="310" x2="258" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="296" y1="310" x2="302" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 18. Carrying Heavy Delivery Box
  {
    id: 'stickman-carrying-box',
    title: 'Stickman Carrying Heavy Box',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 108,
    tags: 'stickman, silhouette, box, package, courier, delivery, moving, heavy, warehouse, worker, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (tilted back slightly with effort) -->
  <circle cx="210" cy="115" r="46" fill="#000000"/>
  <!-- Torso (leaning back against load) -->
  <path d="M205 175 L190 310" stroke="#000000" stroke-width="54" stroke-linecap="round"/>
  <!-- Big Box in Arms -->
  <rect x="250" y="160" width="110" height="95" rx="8" fill="#000000"/>
  <line x1="305" y1="160" x2="305" y2="255" stroke="#ffffff" stroke-width="3"/>
  <!-- Arms wrapping around box -->
  <path d="M205 195 L270 230 L360 230" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Walking forward) -->
  <path d="M190 310 L160 375 L150 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M210 310 L240 375 L270 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 19. Pushing Shopping Cart / Trolley
  {
    id: 'stickman-pushing-cart',
    title: 'Stickman Pushing Cart',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 97,
    tags: 'stickman, silhouette, shopping cart, grocery, supermarket, retail, pushing, trolley, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="170" cy="115" r="46" fill="#000000"/>
  <!-- Torso (forward push angle) -->
  <path d="M165 175 L145 305" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms reaching forward to cart handle -->
  <path d="M165 190 L240 220 L275 220" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Shopping Cart Basket -->
  <path d="M275 220 L290 280 L400 280 L420 200 L275 200" fill="none" stroke="#000000" stroke-width="12" stroke-linejoin="round"/>
  <line x1="330" y1="200" x2="320" y2="280" stroke="#000000" stroke-width="8"/>
  <line x1="370" y1="200" x2="360" y2="280" stroke="#000000" stroke-width="8"/>
  <!-- Cart Wheels -->
  <line x1="300" y1="280" x2="300" y2="330" stroke="#000000" stroke-width="10"/>
  <line x1="390" y1="280" x2="390" y2="330" stroke="#000000" stroke-width="10"/>
  <circle cx="300" cy="340" r="14" fill="#000000"/>
  <circle cx="390" cy="340" r="14" fill="#000000"/>
  <!-- Legs (Walking push stride) -->
  <path d="M145 305 L110 375 L90 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M155 305 L180 375 L210 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 20. Lifting Heavy Dumbbells Overhead
  {
    id: 'stickman-lifting-dumbbells',
    title: 'Stickman Weightlifter Overhead',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 120,
    tags: 'stickman, silhouette, bodybuilding, gym, fitness, workout, dumbbells, muscle, power, lift, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="115" r="46" fill="#000000"/>
  <!-- Torso (solid muscular V) -->
  <rect x="226" y="175" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Pressing dumbbell overhead) -->
  <path d="M286 190 L345 130 L355 75" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Left Dumbbell -->
  <rect x="330" y="65" width="50" height="16" rx="4" fill="#000000"/>
  <circle cx="330" cy="73" r="16" fill="#000000"/>
  <circle cx="380" cy="73" r="16" fill="#000000"/>
  <!-- Right Arm (Pressing dumbbell overhead) -->
  <path d="M226 190 L167 130 L157 75" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Dumbbell -->
  <rect x="132" y="65" width="50" height="16" rx="4" fill="#000000"/>
  <circle cx="132" cy="73" r="16" fill="#000000"/>
  <circle cx="182" cy="73" r="16" fill="#000000"/>
  <!-- Wide Squat Legs -->
  <path d="M236 310 L200 375 L180 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M276 310 L312 375 L332 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 21. Yoga Tree Pose (Balance on One Foot)
  {
    id: 'stickman-yoga-tree-pose',
    title: 'Stickman Yoga Tree Pose',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 98,
    tags: 'stickman, silhouette, yoga, tree pose, balance, meditation, zen, wellness, namaste, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="85" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="145" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms in Anjali Mudra / Prayer overhead -->
  <path d="M226 165 L200 110 L256 50" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M286 165 L312 110 L256 50" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="256" cy="48" r="14" fill="#000000"/>
  <!-- Standing Leg (Solid pillar) -->
  <line x1="256" y1="280" x2="256" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <!-- Bent Leg (Foot tucked onto knee) -->
  <path d="M260 280 L320 340 L265 355" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 22. Yoga Warrior II Pose
  {
    id: 'stickman-yoga-warrior',
    title: 'Stickman Yoga Warrior Pose',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 103,
    tags: 'stickman, silhouette, yoga, warrior, pose, fitness, flexibility, strength, stretching, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head looking forward -->
  <circle cx="256" cy="115" r="46" fill="#000000"/>
  <!-- Torso (Upright centered) -->
  <rect x="226" y="175" width="60" height="130" rx="28" fill="#000000"/>
  <!-- Arms outstretched horizontal parallel -->
  <line x1="100" y1="195" x2="412" y2="195" stroke="#000000" stroke-width="24" stroke-linecap="round"/>
  <!-- Deep Lunge Legs -->
  <path d="M236 305 L160 330 L160 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M276 305 L360 375 L410 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 23. Meditating in Lotus Pose (Zen)
  {
    id: 'stickman-meditating-lotus',
    title: 'Stickman Lotus Meditation',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 115,
    tags: 'stickman, silhouette, meditation, lotus, zen, peace, mindfulness, yoga, spiritual, relax, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="120" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="180" width="60" height="130" rx="28" fill="#000000"/>
  <!-- Arms resting open on knees -->
  <path d="M226 200 L170 270 L140 340" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="140" cy="340" r="12" fill="#000000"/>
  <path d="M286 200 L342 270 L372 340" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="372" cy="340" r="12" fill="#000000"/>
  <!-- Cross-legged Lotus Base -->
  <path d="M140 355 Q256 410 372 355 Q300 420 212 420 Q170 420 140 355 Z" fill="#000000"/>
  <path d="M140 355 Q200 370 256 370 Q312 370 372 355" stroke="#000000" stroke-width="32" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 24. Floor Pushup Workout
  {
    id: 'stickman-pushup-floor',
    title: 'Stickman Floor Pushup',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 88,
    tags: 'stickman, silhouette, pushup, calisthenics, gym, floor workout, fitness, muscle, plank, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Ground reference line -->
  <line x1="60" y1="360" x2="450" y2="360" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="140" cy="225" r="44" fill="#000000"/>
  <!-- Torso & Body Plank Angle -->
  <line x1="175" y1="245" x2="380" y2="335" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms supporting in pushup -->
  <path d="M190 260 L180 310 L195 360" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Feet braced on ground -->
  <circle cx="390" cy="345" r="16" fill="#000000"/>
</svg>`
  },

  // 25. Riding a Bicycle
  {
    id: 'stickman-cycling-bike',
    title: 'Stickman Cycling Bicycle',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 124,
    tags: 'stickman, silhouette, bicycle, cycling, bike, eco, transport, outdoor, sports, commute, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Bike Wheels -->
  <circle cx="130" cy="370" r="55" fill="none" stroke="#000000" stroke-width="12"/>
  <circle cx="380" cy="370" r="55" fill="none" stroke="#000000" stroke-width="12"/>
  <!-- Bike Frame Diamond -->
  <polyline points="130,370 230,370 330,270 230,270 130,370" fill="none" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>
  <line x1="230" y1="370" x2="230" y2="250" stroke="#000000" stroke-width="10"/>
  <line x1="330" y1="270" x2="380" y2="370" stroke="#000000" stroke-width="10"/>
  <line x1="330" y1="270" x2="320" y2="230" stroke="#000000" stroke-width="10"/>
  <line x1="305" y1="230" x2="335" y2="230" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="265" cy="115" r="44" fill="#000000"/>
  <!-- Torso (leaning forward to handlebars) -->
  <line x1="255" y1="165" x2="230" y2="260" stroke="#000000" stroke-width="46" stroke-linecap="round"/>
  <!-- Arm reaching to handlebar -->
  <path d="M260 175 L300 215 L320 230" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs pedaling -->
  <path d="M230 260 L200 315 L230 370" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 26. Freestyle Swimmer
  {
    id: 'stickman-swimming-freestyle',
    title: 'Stickman Freestyle Swimmer',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 92,
    tags: 'stickman, silhouette, swimming, swimmer, pool, water, olympics, sports, freestyle, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Water Waves -->
  <path d="M50 320 Q100 290 150 320 T250 320 T350 320 T450 320" fill="none" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <path d="M70 360 Q120 330 170 360 T270 360 T370 360 T470 360" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head in water breath -->
  <circle cx="340" cy="210" r="44" fill="#000000"/>
  <!-- Body streamlined horizontal -->
  <line x1="310" y1="240" x2="160" y2="280" stroke="#000000" stroke-width="46" stroke-linecap="round"/>
  <!-- Arm reaching forward stroke -->
  <path d="M305 235 L380 215 L430 240" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Arm recovering back -->
  <path d="M280 245 L250 180 L200 195" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Flutter Kick Legs -->
  <path d="M160 280 L110 260 L60 270" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M160 280 L100 305 L50 315" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 27. Soccer Volley Kick
  {
    id: 'stickman-soccer-kick',
    title: 'Stickman Soccer Volley Kick',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 135,
    tags: 'stickman, silhouette, soccer, football, kick, striker, goal, world cup, athlete, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Soccer Ball in Air -->
  <circle cx="390" cy="190" r="32" fill="#000000"/>
  <polygon points="390,175 402,185 397,198 383,198 378,185" fill="#ffffff"/>
  <!-- Head (tilted back looking at ball) -->
  <circle cx="195" cy="115" r="46" fill="#000000"/>
  <!-- Torso (leaning back dynamically) -->
  <path d="M200 170 L210 290" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms balancing kick -->
  <path d="M195 180 L140 210 L110 240" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M210 180 L265 170 L300 200" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Kicking Leg (High horizontal extension) -->
  <path d="M210 290 L280 250 L350 200" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Plant Foot Supporting -->
  <path d="M210 290 L220 375 L210 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 28. Basketball Slam Dunk
  {
    id: 'stickman-basketball-dunk',
    title: 'Stickman Basketball Slam Dunk',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 128,
    tags: 'stickman, silhouette, basketball, dunk, hoop, nba, jump, athlete, sports, slam dunk, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Basketball Hoop & Rim on Left -->
  <line x1="70" y1="120" x2="160" y2="120" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <polyline points="90,120 100,180 140,180 150,120" fill="none" stroke="#000000" stroke-width="6"/>
  <!-- Basketball in Hand -->
  <circle cx="165" cy="85" r="28" fill="#000000"/>
  <!-- Head -->
  <circle cx="280" cy="110" r="44" fill="#000000"/>
  <!-- Torso (flying through air) -->
  <path d="M275 160 L245 280" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Right Arm (Slamming ball down) -->
  <path d="M270 170 L220 115 L175 95" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Left Arm (Flailing for balance) -->
  <path d="M280 175 L345 210 L375 235" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Airborne split) -->
  <path d="M245 280 L200 350 L170 410" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M245 280 L290 340 L340 380" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 29. Golf Swing Follow-Through
  {
    id: 'stickman-golf-drive',
    title: 'Stickman Golf Swing Follow-Through',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 86,
    tags: 'stickman, silhouette, golf, golfer, swing, driver, pga, club, athlete, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head (watching ball in distance) -->
  <circle cx="230" cy="115" r="46" fill="#000000"/>
  <!-- Torso (twisted in follow-through) -->
  <path d="M235 170 L245 300" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms holding golf club over shoulder -->
  <path d="M235 180 L180 150 L160 100" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Golf Club Shaft & Head -->
  <line x1="160" y1="100" x2="110" y2="50" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <rect x="95" y="40" width="22" height="14" rx="4" fill="#000000" transform="rotate(-35 106 47)"/>
  <!-- Legs (weight on front foot, back toe pivoted) -->
  <line x1="240" y1="300" x2="230" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <path d="M255 300 L285 385 L280 445" stroke="#000000" stroke-width="26" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 30. Tennis Player Overhead Serve
  {
    id: 'stickman-tennis-serve',
    title: 'Stickman Tennis Overhead Serve',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 90,
    tags: 'stickman, silhouette, tennis, serve, racket, wimbledon, grand slam, athlete, sports, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Tennis Ball tossed in air -->
  <circle cx="300" cy="55" r="16" fill="#000000"/>
  <!-- Head tilted up -->
  <circle cx="240" cy="130" r="44" fill="#000000"/>
  <!-- Torso arching -->
  <path d="M235 180 L220 305" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Right Arm reaching up high with racket -->
  <path d="M245 190 L260 110 L280 65" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Tennis Racket -->
  <line x1="280" y1="65" x2="310" y2="35" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <ellipse cx="330" cy="20" rx="22" ry="16" fill="none" stroke="#000000" stroke-width="8" transform="rotate(30 330 20)"/>
  <!-- Left Arm (toss follow through) -->
  <path d="M225 190 L185 240 L160 260" stroke="#000000" stroke-width="22" stroke-linecap="round" fill="none"/>
  <!-- Stance Legs -->
  <path d="M220 305 L200 375 L180 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M235 305 L260 375 L280 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 31. Holding an Open Umbrella
  {
    id: 'stickman-holding-umbrella',
    title: 'Stickman Holding Umbrella',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 105,
    tags: 'stickman, silhouette, umbrella, rain, weather, shelter, wet, storm, walking, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Open Umbrella Canopy -->
  <path d="M120 120 Q240 20 360 120 Q320 110 280 120 Q240 110 200 120 Q160 110 120 120 Z" fill="#000000"/>
  <!-- Umbrella Shaft & Handle -->
  <line x1="240" y1="40" x2="240" y2="240" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <path d="M240 240 Q240 260 225 260" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="265" cy="150" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="235" y="205" width="60" height="120" rx="28" fill="#000000"/>
  <!-- Right Arm holding umbrella shaft -->
  <path d="M235 220 L215 240 L240 235" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Left Arm at side -->
  <path d="M295 220 L315 270 L305 320" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Walking) -->
  <line x1="250" y1="325" x2="235" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="280" y1="325" x2="295" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 32. Walking a Pet Dog on Leash
  {
    id: 'stickman-walking-dog',
    title: 'Stickman Walking Dog',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 130,
    tags: 'stickman, silhouette, dog, pet, puppy, leash, walking, animal, outdoor, stroll, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="190" cy="105" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="160" y="165" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Right Arm holding taut leash -->
  <path d="M220 185 L280 230" stroke="#000000" stroke-width="24" stroke-linecap="round"/>
  <!-- Leash -->
  <line x1="280" y1="230" x2="380" y2="350" stroke="#000000" stroke-width="5" stroke-dasharray="8,4"/>
  <!-- Left Arm at side -->
  <path d="M160 185 L140 240 L145 295" stroke="#000000" stroke-width="24" stroke-linecap="round" fill="none"/>
  <!-- Human Legs -->
  <line x1="175" y1="300" x2="160" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="205" y1="300" x2="225" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <!-- Pet Dog Silhouette -->
  <g transform="translate(360, 340)">
    <!-- Dog Head & Snout -->
    <ellipse cx="65" cy="20" rx="16" ry="12" fill="#000000"/>
    <path d="M75 16 L88 22 L75 26 Z" fill="#000000"/>
    <polygon points="56,12 60,0 68,10" fill="#000000"/>
    <!-- Dog Body -->
    <rect x="15" y="20" width="50" height="30" rx="12" fill="#000000"/>
    <!-- Dog Tail wagging up -->
    <path d="M15 25 Q0 15 5 0" stroke="#000000" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Dog Legs -->
    <line x1="25" y1="50" x2="22" y2="100" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
    <line x1="38" y1="50" x2="42" y2="100" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
    <line x1="55" y1="50" x2="52" y2="100" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
    <line x1="65" y1="50" x2="70" y2="100" stroke="#000000" stroke-width="9" stroke-linecap="round"/>
  </g>
</svg>`
  },

  // 33. Relaxing with Hot Coffee Mug
  {
    id: 'stickman-coffee-relax',
    title: 'Stickman Coffee Break',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 114,
    tags: 'stickman, silhouette, coffee, break, morning, mug, tea, espresso, relaxed, chill, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Casual akimbo on hip) -->
  <path d="M286 175 L330 225 L286 260" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Holding coffee mug up) -->
  <path d="M226 175 L180 220 L210 210" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Coffee Mug & Steam -->
  <rect x="180" y="195" width="28" height="32" rx="4" fill="#000000"/>
  <path d="M180 205 Q165 210 180 222" fill="none" stroke="#000000" stroke-width="6"/>
  <!-- Steam Lines -->
  <path d="M188 185 Q184 175 188 165" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
  <path d="M198 185 Q202 175 198 165" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 34. Hand Outstretched "Stop / Halt" Gesture
  {
    id: 'stickman-stop-gesture',
    title: 'Stickman Stop Palm Forward',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 106,
    tags: 'stickman, silhouette, stop, halt, palm, barrier, traffic, security, warning, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="180" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Akimbo on Hip) -->
  <path d="M180 175 L135 225 L180 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Reaching forward with open palm stop) -->
  <line x1="240" y1="185" x2="350" y2="185" stroke="#000000" stroke-width="26" stroke-linecap="round"/>
  <!-- Open Stop Palm Hand -->
  <line x1="355" y1="150" x2="355" y2="210" stroke="#000000" stroke-width="14" stroke-linecap="round"/>
  <!-- Legs (Firm rooted stance) -->
  <line x1="195" y1="290" x2="185" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="225" y1="290" x2="245" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 35. Shrugging "I Don't Know"
  {
    id: 'stickman-shrug-doubt',
    title: 'Stickman Shrugging IDK',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 122,
    tags: 'stickman, silhouette, shrug, shrugging, idk, confused, doubt, whatever, hands up, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted to side -->
  <circle cx="265" cy="95" r="46" fill="#000000"/>
  <!-- Torso with raised shoulders -->
  <path d="M210 160 Q256 170 302 160 L290 290 L222 290 Z" fill="#000000"/>
  <!-- Shrugging Arms (Elbows bent, hands out flat) -->
  <path d="M210 160 L160 210 L120 185" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="120" cy="185" r="12" fill="#000000"/>
  <path d="M302 160 L352 210 L392 185" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="392" cy="185" r="12" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 36. Facepalm Exasperation
  {
    id: 'stickman-facepalm',
    title: 'Stickman Facepalm Exasperated',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 119,
    tags: 'stickman, silhouette, facepalm, frustrated, mistake, head in hand, exhausted, fail, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head slightly bowed -->
  <circle cx="256" cy="105" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="165" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Dangling limp in defeat) -->
  <path d="M286 185 L310 250 L305 320" stroke="#000000" stroke-width="24" stroke-linecap="round" fill="none"/>
  <!-- Right Arm (Hand covering face facepalm) -->
  <path d="M226 185 L200 240 L245 115" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="245" cy="115" r="18" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="300" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="300" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 37. Pointing Forward Dynamically
  {
    id: 'stickman-pointing-forward',
    title: 'Stickman Pointing Forward',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 101,
    tags: 'stickman, silhouette, pointing, direction, leadership, uncle sam, finger, forward, choice, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="180" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Akimbo on Hip) -->
  <path d="M180 175 L135 225 L180 260" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Pointing finger forward straight) -->
  <line x1="240" y1="180" x2="380" y2="180" stroke="#000000" stroke-width="26" stroke-linecap="round"/>
  <!-- Pointing Finger Tip Extension -->
  <line x1="375" y1="180" x2="405" y2="180" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <!-- Legs -->
  <line x1="195" y1="290" x2="185" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="225" y1="290" x2="245" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 38. Military Salute
  {
    id: 'stickman-salute-military',
    title: 'Stickman Military Salute',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 95,
    tags: 'stickman, silhouette, salute, soldier, military, respect, formal, army, navy, officer, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso (Rigid upright attention) -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Rigidly down along leg at attention) -->
  <line x1="286" y1="175" x2="295" y2="290" stroke="#000000" stroke-width="26" stroke-linecap="round"/>
  <!-- Right Arm (Sharp 45 deg salute to temple) -->
  <path d="M226 175 L180 200 L245 90" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Heels clicked together at attention) -->
  <line x1="244" y1="290" x2="244" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="268" y1="290" x2="268" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 39. Friendly Waving Hello
  {
    id: 'stickman-waving-hello',
    title: 'Stickman Friendly Wave',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 110,
    tags: 'stickman, silhouette, waving, hello, hi, friendly, greeting, welcome, goodbye, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Casual at side) -->
  <path d="M286 175 L306 240 L306 295" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Right Arm (Waving high in air) -->
  <path d="M226 175 L170 140 L160 80" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="160" cy="78" r="16" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 40. Construction Worker with Shovel
  {
    id: 'stickman-construction-shovel',
    title: 'Stickman Construction Shovel',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 94,
    tags: 'stickman, silhouette, construction, digging, shovel, worker, builder, hard work, labor, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Hard Hat Helmet -->
  <path d="M190 75 Q210 50 230 75 Z" fill="#000000"/>
  <line x1="180" y1="75" x2="240" y2="75" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Head -->
  <circle cx="210" cy="105" r="44" fill="#000000"/>
  <!-- Torso (Leaning into shovel) -->
  <path d="M205 160 L185 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms grasping shovel shaft -->
  <path d="M205 180 L250 220 L300 240" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M190 190 L220 250 L270 270" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Long Shovel Tool -->
  <line x1="330" y1="180" x2="250" y2="410" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <path d="M250 410 L230 460 L270 460 Z" fill="#000000"/>
  <!-- Legs braced for digging -->
  <path d="M185 295 L145 365 L125 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M195 295 L225 365 L255 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 41. Janitor Sweeping with Push Broom
  {
    id: 'stickman-cleaning-broom',
    title: 'Stickman Janitor Sweeping Broom',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 87,
    tags: 'stickman, silhouette, cleaning, broom, janitor, sweeping, maintenance, housekeeping, housework, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="105" r="46" fill="#000000"/>
  <!-- Torso (slight lean forward) -->
  <path d="M205 165 L190 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms holding broom handle -->
  <path d="M205 180 L250 220 L300 230" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M190 190 L220 250 L270 270" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Push Broom Handle & Bristles -->
  <line x1="330" y1="160" x2="250" y2="430" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <rect x="220" y="430" width="60" height="20" rx="4" fill="#000000"/>
  <!-- Legs (Walking sweeping) -->
  <path d="M190 295 L160 365 L145 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
  <path d="M200 295 L225 365 L250 445" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 42. Chef Cooking / Flipping Pan
  {
    id: 'stickman-chef-cooking',
    title: 'Stickman Chef Cooking Frying Pan',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 112,
    tags: 'stickman, silhouette, chef, cooking, kitchen, food, restaurant, culinary, pan, flipping, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Chef Toque Hat -->
  <path d="M195 55 C190 30 230 30 230 45 C240 25 280 25 285 55 Z" fill="#000000"/>
  <rect x="200" y="55" width="80" height="20" rx="2" fill="#000000"/>
  <!-- Head -->
  <circle cx="240" cy="110" r="44" fill="#000000"/>
  <!-- Torso -->
  <rect x="210" y="165" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Arms holding skillet frying pan -->
  <path d="M210 185 L260 230 L320 230" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Frying Pan Handle & Pan -->
  <line x1="310" y1="230" x2="350" y2="230" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <path d="M350 240 Q400 240 410 220 L350 220 Z" fill="#000000"/>
  <!-- Food Flying in Air -->
  <ellipse cx="380" cy="175" rx="14" ry="8" fill="#000000" transform="rotate(-20 380 175)"/>
  <!-- Legs -->
  <line x1="225" y1="300" x2="215" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="255" y1="300" x2="265" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 43. Doctor with Stethoscope
  {
    id: 'stickman-doctor-stethoscope',
    title: 'Stickman Doctor with Stethoscope',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 126,
    tags: 'stickman, silhouette, doctor, stethoscope, hospital, medicine, healthcare, nurse, clinic, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Stethoscope around neck -->
  <path d="M236 155 Q256 195 276 155" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <line x1="256" y1="180" x2="256" y2="225" stroke="#ffffff" stroke-width="6"/>
  <circle cx="256" cy="230" r="10" fill="#ffffff"/>
  <!-- Right Arm holding stethoscope chest piece forward -->
  <path d="M226 175 L180 220 L245 230" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Left Arm in coat pocket -->
  <path d="M286 175 L320 220 L286 260" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 44. Photographer Aiming Camera
  {
    id: 'stickman-photographer-camera',
    title: 'Stickman Photographer DSLR',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 104,
    tags: 'stickman, silhouette, photographer, camera, dslr, photo, shoot, lens, journalism, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="210" cy="115" r="44" fill="#000000"/>
  <!-- Torso (crouched action stance) -->
  <path d="M205 170 L195 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms holding camera up to eye -->
  <path d="M205 180 L260 170 L280 135" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M190 185 L235 200 L270 145" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Camera Body & Lens -->
  <rect x="260" y="115" width="45" height="32" rx="4" fill="#000000"/>
  <rect x="305" y="121" width="22" height="20" rx="3" fill="#000000"/>
  <!-- Crouched Action Legs -->
  <path d="M195 295 L150 355 L120 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M205 295 L255 355 L285 445" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 45. Musician Sitting on Stool Strumming Guitar
  {
    id: 'stickman-musician-guitar',
    title: 'Stickman Acoustic Guitarist',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 122,
    tags: 'stickman, silhouette, guitar, acoustic, music, musician, song, strum, singer, concert, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down listening -->
  <circle cx="210" cy="115" r="44" fill="#000000"/>
  <!-- Torso (Seated posture) -->
  <path d="M210 170 L210 295" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Acoustic Guitar Body & Neck -->
  <g transform="translate(180, 200) rotate(-25)">
    <path d="M30 60 C10 75 15 110 40 120 C70 130 90 100 80 70 C70 45 45 45 30 60 Z" fill="#000000"/>
    <rect x="50" y="-30" width="8" height="90" fill="#000000"/>
    <circle cx="54" cy="85" r="10" fill="#ffffff"/>
  </g>
  <!-- Arms playing guitar -->
  <path d="M210 180 L280 230 L260 260" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M200 185 L150 170 L140 145" stroke="#000000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Sitting on stool with one foot on rung) -->
  <path d="M210 295 L270 320 L270 445" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M210 295 L170 330 L195 445" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`
  },

  // 46. Looking Through Telescope / Stargazing
  {
    id: 'stickman-stargazing-telescope',
    title: 'Stickman Astronomer Telescope',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 97,
    tags: 'stickman, silhouette, telescope, astronomy, science, stars, looking, future, vision, discovery, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Telescope Tripod Stand -->
  <line x1="330" y1="230" x2="260" y2="445" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <line x1="330" y1="230" x2="330" y2="445" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <line x1="330" y1="230" x2="400" y2="445" stroke="#000000" stroke-width="10" stroke-linecap="round"/>
  <!-- Telescope Barrel tilted 35 degrees up -->
  <rect x="250" y="210" width="160" height="24" rx="6" fill="#000000" transform="rotate(-35 330 222)"/>
  <!-- Head peering into eyepiece -->
  <circle cx="215" cy="180" r="44" fill="#000000"/>
  <!-- Torso (bent forward to eyepiece) -->
  <path d="M205 230 L185 320" stroke="#000000" stroke-width="48" stroke-linecap="round"/>
  <!-- Arm adjusting focus dial -->
  <path d="M205 240 L260 240 L285 220" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs -->
  <line x1="185" y1="320" x2="160" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="195" y1="320" x2="220" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 47. Shouting with Megaphone / Bullhorn
  {
    id: 'stickman-megaphone-announcer',
    title: 'Stickman Megaphone Announcer',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 116,
    tags: 'stickman, silhouette, megaphone, bullhorn, announce, protest, marketing, shout, alert, speaking, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="200" cy="105" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="170" y="165" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Right Arm holding megaphone to mouth -->
  <path d="M230 180 L280 160 L310 140" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Megaphone Cone & Handle -->
  <polygon points="310,140 375,100 375,180" fill="#000000"/>
  <rect x="300" y="132" width="15" height="16" rx="2" fill="#000000"/>
  <!-- Sound Waves -->
  <path d="M395 120 Q415 140 395 160" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <path d="M415 105 Q445 140 415 175" fill="none" stroke="#000000" stroke-width="8" stroke-linecap="round"/>
  <!-- Left Arm (Akimbo on Hip) -->
  <path d="M170 185 L125 235 L170 270" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Wide Stance Legs -->
  <line x1="185" y1="300" x2="160" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="215" y1="300" x2="245" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 48. Tapping Foot Checking Wristwatch Impatient
  {
    id: 'stickman-checking-watch-impatient',
    title: 'Stickman Checking Wristwatch',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 99,
    tags: 'stickman, silhouette, wristwatch, time, waiting, impatient, delay, late, hurry, watch, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head tilted down looking at wrist -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Held up checking watch face) -->
  <path d="M286 175 L330 220 L275 220" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="300" cy="220" r="10" fill="#000000"/>
  <!-- Right Arm (Akimbo on Hip impatient) -->
  <path d="M226 175 L177 225 L226 260" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs (Weight on one leg, tapping other foot) -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <path d="M272 290 L290 375 L315 440" stroke="#000000" stroke-width="28" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 49. Double Thumbs Up Approval
  {
    id: 'stickman-double-thumbs-up',
    title: 'Stickman Double Thumbs Up',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 132,
    tags: 'stickman, silhouette, thumbs up, approval, success, awesome, great job, like, positive, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head -->
  <circle cx="256" cy="95" r="46" fill="#000000"/>
  <!-- Torso -->
  <rect x="226" y="155" width="60" height="135" rx="28" fill="#000000"/>
  <!-- Left Arm (Thumbs up bent upwards) -->
  <path d="M286 175 L345 200 L345 160" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="345" cy="155" r="12" fill="#000000"/>
  <!-- Right Arm (Thumbs up bent upwards) -->
  <path d="M226 175 L167 200 L167 160" stroke="#000000" stroke-width="24" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="167" cy="155" r="12" fill="#000000"/>
  <!-- Legs -->
  <line x1="240" y1="290" x2="236" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
  <line x1="272" y1="290" x2="276" y2="445" stroke="#000000" stroke-width="28" stroke-linecap="round"/>
</svg>`
  },

  // 50. Sitting Relaxed on Office Chair Hands Behind Head
  {
    id: 'stickman-relax-chair-boss',
    title: 'Stickman Reclining Chair Boss',
    category: 'Stickman',
    pack: 'Stickman',
    assetType: 'vector',
    downloads: 140,
    tags: 'stickman, silhouette, reclining, boss, relax, feet up, hands behind head, executive, break, chill, pose',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Head resting back -->
  <circle cx="220" cy="120" r="46" fill="#000000"/>
  <!-- Torso (Reclined 30 degrees back) -->
  <path d="M210 170 L240 295" stroke="#000000" stroke-width="50" stroke-linecap="round"/>
  <!-- Arms clasped behind head -->
  <path d="M215 180 L175 140 L215 125" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M215 180 L265 140 L225 125" stroke="#000000" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Legs crossed relaxing -->
  <path d="M240 295 L310 325 L380 320" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M240 295 L290 355 L350 355" stroke="#000000" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Office Chair Support -->
  <path d="M190 200 L190 340 L240 340" stroke="#000000" stroke-width="12" stroke-linecap="round" fill="none"/>
  <line x1="220" y1="340" x2="220" y2="430" stroke="#000000" stroke-width="12"/>
  <line x1="180" y1="430" x2="260" y2="430" stroke="#000000" stroke-width="12" stroke-linecap="round"/>
</svg>`
  }
];

// Append to stickmanData.js
const stickmanDataPath = path.resolve('src/stickmanData.js');
let currentContent = fs.readFileSync(stickmanDataPath, 'utf8');

// Find insertion point before closing bracket
const lastBracketIndex = currentContent.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error("Could not find closing bracket in stickmanData.js");
  process.exit(1);
}

// Convert new elements to JS objects string
const newElementsCode = NEW_50_STICKMEN.map(el => {
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
console.log(`SUCCESS: Appended ${NEW_50_STICKMEN.length} new unique stickmen to stickmanData.js!`);
