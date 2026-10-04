import { YOUTUBE_MOTION_ELEMENTS } from './motionGraphicsData.js';
import { COMPOSITE_SCENE_ELEMENTS } from './compositeScenesData.js';
import { FROSTED_GLASS_ELEMENTS } from './frostedGlassData.js';
import { STICKMAN_ELEMENTS } from './stickmanData.js';
import { SVG_ASSET_ITEMS } from './svgAssetItemsData.js';

export const CORE_INITIAL_ELEMENTS = [
  {
    id: 'elem-iconderry-official',
    title: 'Iconderry Prism Gem',
    category: 'Brand Logos',
    tags: 'iconderry, logo, prism, diamond, glass, rainbow, vector',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b0764"/>
      <stop offset="0.5" stop-color="#1e1b4b"/>
      <stop offset="1" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="glassDiamondGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="0.3" stop-color="#c084fc" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#a855f7" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="prismRainbow" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4ade80"/>
      <stop offset="0.3" stop-color="#facc15"/>
      <stop offset="0.65" stop-color="#fb923c"/>
      <stop offset="1" stop-color="#f43f5e"/>
    </linearGradient>
    <filter id="glassGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect x="36" y="36" width="128" height="128" rx="38" transform="rotate(45 100 100)" fill="url(#glassDiamondGrad)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.8" filter="url(#glassGlow)"/>
  <path d="M 64 64 C 84 44 116 44 136 64 C 110 75 90 75 64 64 Z" fill="#ffffff" fill-opacity="0.4"/>
  <rect x="58" y="58" width="84" height="84" rx="22" transform="rotate(45 100 100)" fill="url(#prismRainbow)"/>
  <line x1="52" y1="100" x2="148" y2="100" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
  <line x1="100" y1="52" x2="100" y2="148" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
  <circle cx="52" cy="100" r="4.5" fill="#ffffff"/>
  <circle cx="148" cy="100" r="4.5" fill="#ffffff"/>
  <circle cx="100" cy="52" r="4.5" fill="#ffffff"/>
  <circle cx="100" cy="148" r="4.5" fill="#ffffff"/>
</svg>`
  },
  {
    id: 'elem-1',
    title: 'Glowing Folder',
    category: 'UI Icons',
    tags: 'folder, storage, file, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="folderGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3B82F6"/>
      <stop offset="1" stop-color="#1D4ED8"/>
    </linearGradient>
    <filter id="folderGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <rect x="25" y="45" width="60" height="25" rx="6" fill="#60A5FA"/>
  <rect x="25" y="60" width="150" height="95" rx="14" fill="url(#folderGrad)" filter="url(#folderGlow)"/>
  <rect x="45" y="90" width="60" height="8" rx="4" fill="#FFFFFF" fill-opacity="0.9"/>
  <rect x="45" y="110" width="40" height="8" rx="4" fill="#93C5FD"/>
</svg>`
  },
  {
    id: 'elem-2',
    title: 'Verified Shield',
    category: 'Badges & Stickers',
    tags: 'shield, check, security, green',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="shieldGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10B981"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
    <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <path d="M100 25 C145 25 170 50 170 95 C170 145 100 175 100 175 C100 175 30 145 30 95 C30 50 55 25 100 25 Z" fill="url(#shieldGrad)" filter="url(#shieldGlow)"/>
  <path d="M72 102 L90 120 L132 78" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'elem-3',
    title: 'Golden Trophy',
    category: 'Awards',
    tags: 'trophy, win, award, gold, star',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FBBF24"/>
      <stop offset="1" stop-color="#D97706"/>
    </linearGradient>
    <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <path d="M50 45 H150 V95 C150 122 128 145 100 145 C72 145 50 122 50 95 V45 Z" fill="url(#goldGrad)" filter="url(#goldGlow)"/>
  <path d="M50 60 H30 C30 90 50 100 50 100" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
  <path d="M150 60 H170 C170 90 150 100 150 100" stroke="#F59E0B" stroke-width="8" stroke-linecap="round"/>
  <rect x="90" y="145" width="20" height="25" fill="#D97706"/>
  <rect x="70" y="170" width="60" height="12" rx="4" fill="#FBBF24"/>
  <polygon points="100,75 105,90 120,90 108,100 112,115 100,105 88,115 92,100 80,90 95,90" fill="#FFFFFF"/>
</svg>`
  },

  // =========================================================================
  // 20 NEW PROFESSIONAL MULTI-LAYER VECTOR ELEMENTS
  // =========================================================================

  // 1. Cyber Rocket Ship (3D Elements)
  {
    id: 'elem-rocket',
    title: 'Cyber Rocket Ship',
    category: '3D Elements',
    tags: 'rocket, space, launch, cyber, startup, flight, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="rocketBody" x1="70" y1="30" x2="130" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="rocketFin" x1="40" y1="110" x2="90" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="flameGrad" x1="100" y1="140" x2="100" y2="195" gradientUnits="userSpaceOnUse">
      <stop stop-color="#facc15"/>
      <stop offset="0.4" stop-color="#f97316"/>
      <stop offset="1" stop-color="#ef4444" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Flame Exhaust -->
  <path d="M85 145 Q100 195 100 195 Q100 195 115 145 Z" fill="url(#flameGrad)"/>
  <path d="M92 145 Q100 178 100 178 Q100 178 108 145 Z" fill="#ffffff" fill-opacity="0.9"/>
  <!-- Left & Right Fins -->
  <path d="M68 115 L42 152 Q62 155 76 142 Z" fill="url(#rocketFin)"/>
  <path d="M132 115 L158 152 Q138 155 124 142 Z" fill="url(#rocketFin)"/>
  <!-- Fuselage Body -->
  <path d="M100 25 C75 60 72 115 75 145 H125 C128 115 125 60 100 25 Z" fill="url(#rocketBody)"/>
  <!-- Nose Cone Accent -->
  <path d="M100 25 C88 45 84 62 82 72 H118 C116 62 112 45 100 25 Z" fill="#f43f5e"/>
  <!-- Cockpit Porch Porthole -->
  <circle cx="100" cy="92" r="16" fill="#0f172a" stroke="#e0f2fe" stroke-width="3"/>
  <circle cx="100" cy="92" r="11" fill="#38bdf8"/>
  <path d="M95 86 A8 8 0 0 1 105 86" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
</svg>`
  },

  // 2. Neon Lightning Bolt (UI Icons)
  {
    id: 'elem-lightning',
    title: 'Neon Lightning Bolt',
    category: 'UI Icons',
    tags: 'lightning, energy, power, bolt, neon, flash, electrical',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="boltGrad" x1="120" y1="20" x2="70" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.3" stop-color="#facc15"/>
      <stop offset="0.8" stop-color="#eab308"/>
      <stop offset="1" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="boltCore" x1="110" y1="30" x2="80" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="1" stop-color="#fef08a"/>
    </linearGradient>
    <filter id="boltGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <!-- Ambient Backdrop Glow Bolt -->
  <polygon points="118,20 54,106 102,106 78,180 146,94 100,94" fill="#facc15" fill-opacity="0.3" filter="url(#boltGlow)"/>
  <!-- Main Golden Body -->
  <polygon points="118,20 54,106 102,106 78,180 146,94 100,94" fill="url(#boltGrad)"/>
  <!-- High Voltage Inner Specular Core -->
  <polygon points="112,32 66,102 100,102 85,160 134,98 100,98" fill="url(#boltCore)" fill-opacity="0.75"/>
</svg>`
  },

  // 3. Diamond Gemstone (UI Icons)
  {
    id: 'elem-diamond',
    title: 'Crystal Diamond',
    category: 'UI Icons',
    tags: 'diamond, crystal, gem, jewelry, luxury, premium, vip',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gemCrown" x1="30" y1="45" x2="170" y2="85" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="gemPavilion" x1="100" y1="85" x2="100" y2="165" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563eb"/>
      <stop offset="0.7" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <!-- Crown Top Facets -->
  <polygon points="65,45 135,45 170,85 30,85" fill="url(#gemCrown)"/>
  <!-- Table Top Reflection -->
  <polygon points="75,48 125,48 148,82 52,82" fill="#ffffff" fill-opacity="0.35"/>
  <polygon points="65,45 100,85 135,45" fill="#e0f2fe" fill-opacity="0.5"/>
  <polygon points="30,85 65,45 60,85" fill="#0284c7"/>
  <polygon points="170,85 135,45 140,85" fill="#4f46e5"/>
  <!-- Lower Pavilion Point -->
  <polygon points="30,85 170,85 100,165" fill="url(#gemPavilion)"/>
  <polygon points="60,85 100,165 100,85" fill="#38bdf8" fill-opacity="0.6"/>
  <polygon points="140,85 100,165 100,85" fill="#818cf8" fill-opacity="0.6"/>
  <!-- Sparkle Glint -->
  <circle cx="68" cy="55" r="3.5" fill="#ffffff"/>
  <circle cx="140" cy="72" r="2.5" fill="#ffffff"/>
</svg>`
  },

  // 4. Crown of Royalty (Awards)
  {
    id: 'elem-crown',
    title: 'Imperial Royal Crown',
    category: 'Awards',
    tags: 'crown, king, queen, royal, gold, luxury, award, winner',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="crownGold" x1="30" y1="50" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.3" stop-color="#f59e0b"/>
      <stop offset="0.8" stop-color="#d97706"/>
      <stop offset="1" stop-color="#78350f"/>
    </linearGradient>
    <linearGradient id="velvetGrad" x1="100" y1="135" x2="100" y2="165" gradientUnits="userSpaceOnUse">
      <stop stop-color="#be123c"/>
      <stop offset="1" stop-color="#4c0519"/>
    </linearGradient>
  </defs>
  <!-- Velvet Headband Cushion -->
  <rect x="36" y="138" width="128" height="24" rx="8" fill="url(#velvetGrad)"/>
  <!-- Main Golden Peaks Body -->
  <path d="M34 142 L42 68 L72 108 L100 52 L128 108 L158 68 L166 142 Z" fill="url(#crownGold)"/>
  <!-- Beaded Golden Peak Spheres -->
  <circle cx="42" cy="66" r="7" fill="#fef08a"/>
  <circle cx="72" cy="106" r="6" fill="#fde047"/>
  <circle cx="100" cy="50" r="9" fill="#ffffff"/>
  <circle cx="128" cy="106" r="6" fill="#fde047"/>
  <circle cx="158" cy="66" r="7" fill="#fef08a"/>
  <!-- Ruby & Emerald Inset Jewels -->
  <circle cx="100" cy="120" r="8" fill="#ef4444" stroke="#fef08a" stroke-width="2"/>
  <circle cx="68" cy="126" r="6" fill="#10b981" stroke="#fef08a" stroke-width="1.5"/>
  <circle cx="132" cy="126" r="6" fill="#3b82f6" stroke="#fef08a" stroke-width="1.5"/>
  <circle cx="56" cy="150" r="4" fill="#fef08a"/>
  <circle cx="100" cy="150" r="4" fill="#ffffff"/>
  <circle cx="144" cy="150" r="4" fill="#fef08a"/>
</svg>`
  },

  // 5. Quantum Atom Orbit (Illustrations)
  {
    id: 'elem-atom',
    title: 'Quantum Atom Core',
    category: 'Illustrations',
    tags: 'atom, science, physics, nuclear, quantum, chemistry, tech',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="nucleusGrad" x1="85" y1="85" x2="115" y2="115" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f43f5e"/>
      <stop offset="0.6" stop-color="#e11d48"/>
      <stop offset="1" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <!-- Elliptical Orbit Rings -->
  <ellipse cx="100" cy="100" rx="72" ry="24" transform="rotate(0 100 100)" stroke="#06b6d4" stroke-width="4.5" stroke-opacity="0.85"/>
  <ellipse cx="100" cy="100" rx="72" ry="24" transform="rotate(60 100 100)" stroke="#a855f7" stroke-width="4.5" stroke-opacity="0.85"/>
  <ellipse cx="100" cy="100" rx="72" ry="24" transform="rotate(120 100 100)" stroke="#10b981" stroke-width="4.5" stroke-opacity="0.85"/>
  <!-- Central Proton/Neutron Nucleus -->
  <circle cx="100" cy="100" r="18" fill="url(#nucleusGrad)"/>
  <circle cx="95" cy="95" r="7" fill="#ffffff" fill-opacity="0.65"/>
  <!-- Orbiting Electrons -->
  <circle cx="172" cy="100" r="6" fill="#22d3ee"/>
  <circle cx="64" cy="38" r="6" fill="#c084fc"/>
  <circle cx="64" cy="162" r="6" fill="#34d399"/>
</svg>`
  },

  // 6. Vintage Game Controller (UI Icons)
  {
    id: 'elem-gamepad',
    title: 'Arcade Gamepad',
    category: 'UI Icons',
    tags: 'gamepad, controller, gaming, joystick, console, play, arcade',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="padBody" x1="40" y1="60" x2="160" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#334155"/>
      <stop offset="0.8" stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Ergonomic Controller Chassis -->
  <path d="M50 72 C32 72 24 100 28 140 C31 160 52 162 65 145 L82 122 H118 L135 145 C148 162 169 160 172 140 C176 100 168 72 150 72 Z" fill="url(#padBody)" stroke="#475569" stroke-width="3"/>
  <!-- D-Pad Directional Cross -->
  <rect x="52" y="98" width="24" height="8" rx="2.5" fill="#64748b"/>
  <rect x="60" y="90" width="8" height="24" rx="2.5" fill="#64748b"/>
  <!-- Action Buttons X, Y, A, B -->
  <circle cx="140" cy="94" r="5" fill="#f43f5e"/>
  <circle cx="152" cy="102" r="5" fill="#3b82f6"/>
  <circle cx="140" cy="110" r="5" fill="#10b981"/>
  <circle cx="128" cy="102" r="5" fill="#eab308"/>
  <!-- Select & Start Pills -->
  <rect x="88" y="103" width="9" height="4" rx="2" fill="#94a3b8"/>
  <rect x="103" y="103" width="9" height="4" rx="2" fill="#94a3b8"/>
</svg>`
  },

  // 7. Shield with Swords (Badges & Stickers)
  {
    id: 'elem-warrior-shield',
    title: 'Knight Crest Shield',
    category: 'Badges & Stickers',
    tags: 'shield, sword, knight, defense, crest, warrior, security, badge',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="shieldPlate" x1="50" y1="40" x2="150" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="0.6" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="swordBlade" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#94a3b8"/>
    </linearGradient>
  </defs>
  <!-- Crossed Dual Swords -->
  <line x1="35" y1="35" x2="165" y2="165" stroke="url(#swordBlade)" stroke-width="8" stroke-linecap="round"/>
  <line x1="165" y1="35" x2="35" y2="165" stroke="url(#swordBlade)" stroke-width="8" stroke-linecap="round"/>
  <circle cx="35" cy="35" r="8" fill="#f59e0b"/>
  <circle cx="165" cy="35" r="8" fill="#f59e0b"/>
  <!-- Steel Crest Shield -->
  <path d="M100 42 C138 42 152 64 152 102 C152 142 100 168 100 168 C100 168 48 142 48 102 C48 64 62 42 100 42 Z" fill="url(#shieldPlate)" stroke="#38bdf8" stroke-width="4.5"/>
  <!-- Gold Heraldic Star Emblem -->
  <polygon points="100,75 106,94 125,94 110,105 116,124 100,112 84,124 90,105 75,94 94,94" fill="#facc15"/>
</svg>`
  },

  // 8. Digital Bitcoin Token (3D Elements)
  {
    id: 'elem-crypto-coin',
    title: 'Crypto Gold Token',
    category: '3D Elements',
    tags: 'crypto, coin, bitcoin, gold, blockchain, money, currency, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="rimGrad" x1="25" y1="25" x2="175" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.4" stop-color="#eab308"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
    <linearGradient id="coinFace" x1="45" y1="45" x2="155" y2="155" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fbbf24"/>
      <stop offset="0.8" stop-color="#d97706"/>
      <stop offset="1" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <!-- Heavy Rim Base -->
  <circle cx="100" cy="100" r="75" fill="url(#rimGrad)"/>
  <!-- Inner Coin Surface -->
  <circle cx="100" cy="100" r="63" fill="url(#coinFace)" stroke="#fde047" stroke-width="2.5"/>
  <!-- Embossed Bitcoin Symbol -->
  <path d="M88 64 V136 M98 64 V136 M84 76 H112 C122 76 126 84 126 90 C126 96 120 100 110 100 C122 100 128 106 128 114 C128 124 120 128 108 128 H84" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Specular Reflection Arc -->
  <path d="M52 100 A48 48 0 0 1 148 100" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-opacity="0.45"/>
</svg>`
  },

  // 9. Flaming Campfire (Illustrations)
  {
    id: 'elem-campfire',
    title: 'Warm Campfire',
    category: 'Illustrations',
    tags: 'campfire, fire, flame, wood, warm, camping, outdoor, burn',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="outerFlame" x1="100" y1="35" x2="100" y2="155" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f97316"/>
      <stop offset="0.5" stop-color="#ea580c"/>
      <stop offset="1" stop-color="#dc2626"/>
    </linearGradient>
    <linearGradient id="innerFlame" x1="100" y1="70" x2="100" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.6" stop-color="#facc15"/>
      <stop offset="1" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <!-- Crossed Fire Logs -->
  <path d="M42 145 L158 172" stroke="#78350f" stroke-width="14" stroke-linecap="round"/>
  <path d="M158 145 L42 172" stroke="#92400e" stroke-width="14" stroke-linecap="round"/>
  <!-- Large Outer Flame -->
  <path d="M100 35 C125 75 145 105 145 138 C145 162 125 168 100 168 C75 168 55 162 55 138 C55 105 75 75 100 35 Z" fill="url(#outerFlame)"/>
  <!-- Middle Yellow Flame -->
  <path d="M100 70 C116 95 128 118 128 142 C128 160 114 164 100 164 C86 164 72 160 72 142 C72 118 84 95 100 70 Z" fill="url(#innerFlame)"/>
  <!-- Hot White Core -->
  <path d="M100 110 C108 125 114 138 114 150 C114 158 108 160 100 160 C92 160 86 158 86 150 C86 138 92 125 100 110 Z" fill="#ffffff"/>
  <!-- Flying Sparks -->
  <circle cx="104" cy="24" r="3" fill="#facc15"/>
  <circle cx="132" cy="46" r="2.5" fill="#f97316"/>
  <circle cx="70" cy="52" r="2.5" fill="#facc15"/>
</svg>`
  },

  // 10. Acoustic Guitar (Illustrations)
  {
    id: 'elem-guitar',
    title: 'Acoustic Guitar',
    category: 'Illustrations',
    tags: 'guitar, music, acoustic, instrument, sound, song, melody',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="guitarWood" x1="55" y1="70" x2="145" y2="185" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f59e0b"/>
      <stop offset="0.6" stop-color="#d97706"/>
      <stop offset="1" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <!-- Neck & Fretboard -->
  <rect x="94" y="25" width="12" height="70" fill="#292524"/>
  <!-- Headstock with Tuning Pegs -->
  <rect x="92" y="14" width="16" height="20" rx="3" fill="#78350f"/>
  <circle cx="88" cy="18" r="3" fill="#cbd5e1"/>
  <circle cx="88" cy="26" r="3" fill="#cbd5e1"/>
  <circle cx="112" cy="18" r="3" fill="#cbd5e1"/>
  <circle cx="112" cy="26" r="3" fill="#cbd5e1"/>
  <!-- Hourglass Resonant Body -->
  <path d="M100 78 C122 78 132 94 130 112 C128 126 118 132 128 148 C138 164 126 182 100 182 C74 182 62 164 72 148 C82 132 72 126 70 112 C68 94 78 78 100 78 Z" fill="url(#guitarWood)" stroke="#451a03" stroke-width="3"/>
  <!-- Sound Hole & Rosette -->
  <circle cx="100" cy="120" r="14" fill="#1c1917" stroke="#fef3c7" stroke-width="2.5"/>
  <!-- Bridge & Saddle -->
  <rect x="85" y="156" width="30" height="7" rx="2" fill="#451a03"/>
  <!-- Silver Strings -->
  <line x1="97" y1="25" x2="97" y2="156" stroke="#f8fafc" stroke-width="1.2" stroke-opacity="0.8"/>
  <line x1="100" y1="25" x2="100" y2="156" stroke="#f8fafc" stroke-width="1.2" stroke-opacity="0.8"/>
  <line x1="103" y1="25" x2="103" y2="156" stroke="#f8fafc" stroke-width="1.2" stroke-opacity="0.8"/>
</svg>`
  },

  // 11. Heart with Wings (Badges & Stickers)
  {
    id: 'elem-winged-heart',
    title: 'Angelic Winged Heart',
    category: 'Badges & Stickers',
    tags: 'heart, wings, angel, love, halo, flying, romance, badge',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="heartGrad" x1="100" y1="65" x2="100" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fb7185"/>
      <stop offset="0.4" stop-color="#e11d48"/>
      <stop offset="1" stop-color="#881337"/>
    </linearGradient>
    <linearGradient id="wingGrad" x1="30" y1="50" x2="170" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.7" stop-color="#cbd5e1"/>
      <stop offset="1" stop-color="#94a3b8"/>
    </linearGradient>
  </defs>
  <!-- Angelic Golden Halo -->
  <ellipse cx="100" cy="46" rx="28" ry="7" stroke="#facc15" stroke-width="4" fill="none"/>
  <!-- Left Wing Feathers -->
  <path d="M78 92 C54 74 32 76 22 96 C16 108 26 122 44 126 C56 128 68 122 75 112 Z" fill="url(#wingGrad)"/>
  <path d="M72 84 C48 62 25 68 16 88 C25 92 38 92 52 96 Z" fill="#e2e8f0"/>
  <!-- Right Wing Feathers -->
  <path d="M122 92 C146 74 168 76 178 96 C184 108 174 122 156 126 C144 128 132 122 125 112 Z" fill="url(#wingGrad)"/>
  <path d="M128 84 C152 62 175 68 184 88 C175 92 162 92 148 96 Z" fill="#e2e8f0"/>
  <!-- Central Crimson Heart -->
  <path d="M100 86 C88 66 62 68 62 92 C62 118 100 152 100 152 C100 152 138 118 138 92 C138 68 112 66 100 86 Z" fill="url(#heartGrad)"/>
  <!-- Specular Curve Highlight -->
  <path d="M74 84 C70 92 72 104 78 110" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.6"/>
</svg>`
  },

  // 12. Coffee Cup with Steam (UI Icons)
  {
    id: 'elem-coffee-cup',
    title: 'Hot Espresso Cup',
    category: 'UI Icons',
    tags: 'coffee, tea, espresso, mug, cup, morning, breakfast, cafe',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cupGrad" x1="40" y1="80" x2="140" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0284c7"/>
      <stop offset="0.7" stop-color="#0369a1"/>
      <stop offset="1" stop-color="#0c4a6e"/>
    </linearGradient>
  </defs>
  <!-- Steam Trails -->
  <path d="M75 58 C72 46 80 40 76 28" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M98 62 C95 48 105 40 100 25" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M120 58 C117 46 125 40 121 28" stroke="#94a3b8" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Saucer Plate -->
  <ellipse cx="98" cy="162" rx="66" ry="10" fill="#0369a1"/>
  <!-- Handle -->
  <path d="M138 98 C158 98 162 132 138 136" stroke="#0284c7" stroke-width="9" stroke-linecap="round" fill="none"/>
  <!-- Ceramic Cup Body -->
  <path d="M48 82 H148 V126 C148 148 126 156 98 156 C70 156 48 148 48 126 Z" fill="url(#cupGrad)"/>
  <!-- Coffee Foam Surface -->
  <ellipse cx="98" cy="82" rx="48" ry="11" fill="#78350f"/>
  <ellipse cx="98" cy="82" rx="38" ry="8" fill="#451a03"/>
  <path d="M98 78 C94 74 88 74 88 80 C88 86 98 90 98 90 C98 90 108 86 108 80 C108 74 102 74 98 78 Z" fill="#fde68a"/>
</svg>`
  },

  // 13. Howling Wolf Silhouette (Silhouettes)
  {
    id: 'elem-wolf-silhouette',
    title: 'Howling Wolf Night',
    category: 'Silhouettes',
    tags: 'wolf, silhouette, moon, wild, mountain, night, howling, animal',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <radialGradient id="moonGlow" cx="120" cy="80" r="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.6" stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#94a3b8"/>
    </radialGradient>
  </defs>
  <!-- Full Moon Disc -->
  <circle cx="120" cy="82" r="54" fill="url(#moonGlow)"/>
  <!-- Moon Craters -->
  <circle cx="102" cy="62" r="7" fill="#cbd5e1" fill-opacity="0.6"/>
  <circle cx="140" cy="94" r="9" fill="#cbd5e1" fill-opacity="0.5"/>
  <circle cx="126" cy="116" r="6" fill="#cbd5e1" fill-opacity="0.5"/>
  <!-- Mountain Cliff Peak -->
  <path d="M20 185 L90 148 L140 185 Z" fill="#0f172a"/>
  <!-- Howling Wolf Silhouette -->
  <path d="M72 150 C76 138 74 126 72 118 C70 110 74 102 82 92 C86 86 92 78 94 68 C95 62 101 64 104 68 C108 74 106 82 102 88 C104 94 108 98 114 104 C120 110 124 120 122 134 C120 144 116 150 112 152 Z" fill="#020617"/>
  <!-- Snout & Ears Detail -->
  <polygon points="98,62 102,68 95,68" fill="#020617"/>
</svg>`
  },

  // 14. Flying Eagle Silhouette (Silhouettes)
  {
    id: 'elem-eagle-silhouette',
    title: 'Soaring Eagle Silhouette',
    category: 'Silhouettes',
    tags: 'eagle, bird, silhouette, fly, freedom, predator, sky, wings',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Dynamic Majestic Eagle Silhouette in Mid-Flight -->
  <path d="M100 78 C94 65 92 56 100 48 C108 52 106 64 102 78 C120 72 152 64 182 52 C176 72 158 88 138 98 C158 102 182 108 190 118 C174 122 152 118 132 114 C142 126 154 136 158 144 C142 142 126 130 116 122 C114 136 112 156 108 168 C104 168 100 158 98 146 C94 158 90 168 86 168 C82 156 80 136 78 122 C68 130 52 142 36 144 C40 136 52 126 62 114 C42 118 20 122 4 118 C12 108 36 102 56 98 C36 88 18 72 12 52 C42 64 74 72 92 78 Z" fill="#0f172a"/>
  <!-- Hooked Beak Silhouette Accent -->
  <path d="M100 48 L106 52 L99 55 Z" fill="#facc15"/>
</svg>`
  },

  // 15. Smart Compass Rose (UI Icons)
  {
    id: 'elem-compass-rose',
    title: 'Navigation Compass Rose',
    category: 'UI Icons',
    tags: 'compass, navigate, direction, travel, map, gps, explore',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="compassRing" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Outer Degree Rim -->
  <circle cx="100" cy="100" r="76" stroke="url(#compassRing)" stroke-width="4.5"/>
  <circle cx="100" cy="100" r="68" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- Cardinal Tick Markers -->
  <line x1="100" y1="28" x2="100" y2="38" stroke="#38bdf8" stroke-width="3"/>
  <line x1="100" y1="162" x2="100" y2="172" stroke="#38bdf8" stroke-width="3"/>
  <line x1="28" y1="100" x2="38" y2="100" stroke="#38bdf8" stroke-width="3"/>
  <line x1="162" y1="100" x2="172" y2="100" stroke="#38bdf8" stroke-width="3"/>
  <!-- 8-Point Compass Star Facets -->
  <!-- North Arrow (Red) -->
  <polygon points="100,34 100,100 86,100" fill="#ef4444"/>
  <polygon points="100,34 100,100 114,100" fill="#dc2626"/>
  <!-- South Arrow (Silver) -->
  <polygon points="100,166 100,100 86,100" fill="#94a3b8"/>
  <polygon points="100,166 100,100 114,100" fill="#cbd5e1"/>
  <!-- East & West Arrows -->
  <polygon points="166,100 100,100 100,86" fill="#0284c7"/>
  <polygon points="166,100 100,100 100,114" fill="#0369a1"/>
  <polygon points="34,100 100,100 100,86" fill="#0284c7"/>
  <polygon points="34,100 100,100 100,114" fill="#0369a1"/>
  <!-- Center Brass Pivot Pin -->
  <circle cx="100" cy="100" r="8" fill="#facc15" stroke="#78350f" stroke-width="2"/>
</svg>`
  },

  // 16. Artificial Intelligence Brain (Brand Logos)
  {
    id: 'elem-ai-brain',
    title: 'Neural AI Brain',
    category: 'Brand Logos',
    tags: 'ai, brain, neural, chip, intelligence, cyber, smart, tech',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="brainLobe" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#c084fc"/>
      <stop offset="0.5" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <!-- Left Cerebral Lobe -->
  <path d="M96 42 C72 40 50 56 48 80 C44 94 50 104 46 118 C42 134 52 152 74 158 C84 160 92 156 96 152 Z" fill="url(#brainLobe)" fill-opacity="0.2" stroke="#8b5cf6" stroke-width="3"/>
  <!-- Right Cerebral Lobe -->
  <path d="M104 42 C128 40 150 56 152 80 C156 94 150 104 154 118 C158 134 148 152 126 158 C116 160 108 156 104 152 Z" fill="url(#brainLobe)" fill-opacity="0.2" stroke="#8b5cf6" stroke-width="3"/>
  <!-- Neural Circuit Pathways -->
  <path d="M96 60 H72 V82 H55" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M96 100 H76 L62 118 H50" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M96 138 H80 V122" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M104 60 H128 V82 H145" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M104 100 H124 L138 118 H150" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <path d="M104 138 H120 V122" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <!-- Synaptic Nodes -->
  <circle cx="55" cy="82" r="4.5" fill="#22d3ee"/>
  <circle cx="50" cy="118" r="4.5" fill="#22d3ee"/>
  <circle cx="80" cy="122" r="4.5" fill="#22d3ee"/>
  <circle cx="145" cy="82" r="4.5" fill="#22d3ee"/>
  <circle cx="150" cy="118" r="4.5" fill="#22d3ee"/>
  <circle cx="120" cy="122" r="4.5" fill="#22d3ee"/>
</svg>`
  },

  // 17. Camera Lens Shutter (Brand Logos)
  {
    id: 'elem-camera-aperture',
    title: 'Aperture Lens Iris',
    category: 'Brand Logos',
    tags: 'camera, lens, photo, aperture, shutter, photography, studio',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="apertureRing" x1="25" y1="25" x2="175" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Outer Lens Bezel -->
  <circle cx="100" cy="100" r="76" stroke="url(#apertureRing)" stroke-width="6"/>
  <circle cx="100" cy="100" r="70" fill="#0f172a"/>
  <!-- 6 Interlocking Aperture Blades -->
  <polygon points="100,32 148,46 122,86" fill="#1e293b"/>
  <polygon points="148,46 166,92 128,110" fill="#334155"/>
  <polygon points="166,92 136,138 98,116" fill="#1e293b"/>
  <polygon points="136,138 88,154 84,108" fill="#334155"/>
  <polygon points="88,154 44,124 74,90" fill="#1e293b"/>
  <polygon points="44,124 54,68 94,84" fill="#334155"/>
  <!-- Central Spectral Light Flare -->
  <circle cx="100" cy="100" r="18" fill="#ec4899" fill-opacity="0.6"/>
  <circle cx="100" cy="100" r="8" fill="#38bdf8"/>
  <circle cx="96" cy="96" r="3" fill="#ffffff"/>
</svg>`
  },

  // 18. First Place Medal Ribbon (Awards)
  {
    id: 'elem-medal-ribbon',
    title: 'Championship Medal',
    category: 'Awards',
    tags: 'medal, ribbon, champion, winner, 1st, award, gold, sports',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="medalGold" x1="50" y1="80" x2="150" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.4" stop-color="#facc15"/>
      <stop offset="0.8" stop-color="#eab308"/>
      <stop offset="1" stop-color="#a16207"/>
    </linearGradient>
  </defs>
  <!-- V-Shape Rosette Ribbons -->
  <polygon points="72,25 90,95 62,95 44,25" fill="#ef4444"/>
  <polygon points="128,25 110,95 138,95 156,25" fill="#3b82f6"/>
  <!-- Golden Medallion Body -->
  <circle cx="100" cy="130" r="44" fill="url(#medalGold)" stroke="#fde047" stroke-width="3"/>
  <circle cx="100" cy="130" r="36" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
  <!-- Embossed Star of Victory -->
  <polygon points="100,108 107,122 122,122 110,131 115,145 100,136 85,145 90,131 78,122 93,122" fill="#ffffff"/>
</svg>`
  },

  // 19. Hourglass of Time (3D Elements)
  {
    id: 'elem-hourglass',
    title: 'Antique Hourglass',
    category: '3D Elements',
    tags: 'hourglass, time, sand, clock, wait, history, timer, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="brassCap" x1="45" y1="25" x2="155" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.5" stop-color="#d97706"/>
      <stop offset="1" stop-color="#78350f"/>
    </linearGradient>
    <linearGradient id="sandGrad" x1="100" y1="80" x2="100" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="1" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <!-- Top and Bottom Brass Plates -->
  <rect x="52" y="26" width="96" height="12" rx="4" fill="url(#brassCap)"/>
  <rect x="52" y="162" width="96" height="12" rx="4" fill="url(#brassCap)"/>
  <!-- Support Pillars -->
  <line x1="60" y1="38" x2="60" y2="162" stroke="#b45309" stroke-width="6" stroke-linecap="round"/>
  <line x1="140" y1="38" x2="140" y2="162" stroke="#b45309" stroke-width="6" stroke-linecap="round"/>
  <!-- Glass Bulb Contour -->
  <path d="M68 38 H132 C132 75 110 95 104 100 C110 105 132 125 132 162 H68 C68 125 90 105 96 100 C90 95 68 75 68 38 Z" fill="#38bdf8" fill-opacity="0.12" stroke="#bae6fd" stroke-width="3"/>
  <!-- Flowing Sand Particles -->
  <polygon points="76,46 124,46 104,95 96,95" fill="url(#sandGrad)"/>
  <line x1="100" y1="98" x2="100" y2="140" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
  <polygon points="78,158 122,158 100,132" fill="url(#sandGrad)"/>
</svg>`
  },

  // 20. Magic Potion Flask (Badges & Stickers)
  {
    id: 'elem-potion-flask',
    title: 'Mystic Potion Flask',
    category: 'Badges & Stickers',
    tags: 'potion, magic, alchemy, flask, science, elixir, witch, fantasy',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="potionLiquid" x1="100" y1="95" x2="100" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#c084fc"/>
      <stop offset="0.4" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#6b21a8"/>
    </linearGradient>
  </defs>
  <!-- Wooden Cork Stopper -->
  <polygon points="90,26 110,26 106,42 94,42" fill="#92400e"/>
  <!-- Glass Flask Neck & Rim -->
  <rect x="88" y="38" width="24" height="6" rx="2" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
  <rect x="92" y="44" width="16" height="26" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2"/>
  <!-- Round Bottom Flask Body -->
  <circle cx="100" cy="124" r="50" fill="#38bdf8" fill-opacity="0.08" stroke="#38bdf8" stroke-width="4"/>
  <!-- Bubbling Violet Liquid -->
  <path d="M54 134 C64 126 78 138 90 130 C102 122 116 136 128 128 C138 122 144 126 146 134 C146 158 126 172 100 172 C74 172 54 158 54 134 Z" fill="url(#potionLiquid)"/>
  <!-- Floating Elixir Bubbles -->
  <circle cx="82" cy="146" r="4.5" fill="#f0abfc"/>
  <circle cx="112" cy="150" r="3.5" fill="#f0abfc"/>
  <circle cx="98" cy="136" r="3" fill="#ffffff" fill-opacity="0.8"/>
  <circle cx="120" cy="116" r="3" fill="#c084fc"/>
  <!-- Glass Specular Reflection Highlight -->
  <path d="M66 102 A42 42 0 0 1 92 80" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.65"/>
</svg>`
  }
];

export const INITIAL_ELEMENTS = [
  ...CORE_INITIAL_ELEMENTS,
  ...YOUTUBE_MOTION_ELEMENTS,
  ...COMPOSITE_SCENE_ELEMENTS,
  ...FROSTED_GLASS_ELEMENTS,
  ...STICKMAN_ELEMENTS,
  ...SVG_ASSET_ITEMS
];