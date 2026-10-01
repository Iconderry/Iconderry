// 20 Complex Multi-Object 3D Scene Compositions & Ensembles
// Each element is composed of multiple distinct interlocking vector objects designed for 3D staging, layer isolation, and motion graphics

export const COMPOSITE_SCENE_ELEMENTS = [
  // 1. 3D Gold Coins Cascade & Shower
  {
    id: 'scene-coin-shower',
    title: '3D Gold Coins Cascade',
    category: '3D Elements',
    tags: 'coins, gold, shower, cascade, money, treasure, wealth, jackpot, 3d, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cGoldTop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#facc15"/>
      <stop offset="100%" stop-color="#ca8a04"/>
    </linearGradient>
    <linearGradient id="cGoldRim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#713f12"/>
    </linearGradient>
  </defs>
  <!-- Base Stack Coin 1 -->
  <ellipse cx="100" cy="162" rx="42" ry="14" fill="url(#cGoldRim)"/>
  <ellipse cx="100" cy="156" rx="42" ry="14" fill="url(#cGoldTop)"/>
  <!-- Base Stack Coin 2 -->
  <ellipse cx="100" cy="148" rx="40" ry="13" fill="url(#cGoldRim)"/>
  <ellipse cx="100" cy="142" rx="40" ry="13" fill="url(#cGoldTop)"/>
  <!-- Base Stack Coin 3 -->
  <ellipse cx="100" cy="134" rx="38" ry="12" fill="url(#cGoldRim)"/>
  <ellipse cx="100" cy="128" rx="38" ry="12" fill="url(#cGoldTop)"/>
  <text x="94" y="132" font-size="12" font-weight="900" fill="#713f12">$</text>
  <!-- Floating Angled Coin Left (Tilted) -->
  <g transform="rotate(-28 52 95)">
    <ellipse cx="52" cy="98" rx="26" ry="10" fill="url(#cGoldRim)"/>
    <ellipse cx="52" cy="94" rx="26" ry="10" fill="url(#cGoldTop)"/>
    <text x="48" y="98" font-size="10" font-weight="900" fill="#713f12">$</text>
  </g>
  <!-- Floating Angled Coin Right (Tilted) -->
  <g transform="rotate(32 148 95)">
    <ellipse cx="148" cy="98" rx="26" ry="10" fill="url(#cGoldRim)"/>
    <ellipse cx="148" cy="94" rx="26" ry="10" fill="url(#cGoldTop)"/>
    <text x="144" y="98" font-size="10" font-weight="900" fill="#713f12">$</text>
  </g>
  <!-- Top Center Spinning Coin -->
  <g transform="rotate(12 100 52)">
    <ellipse cx="100" cy="56" rx="28" ry="16" fill="url(#cGoldRim)"/>
    <ellipse cx="100" cy="52" rx="28" ry="16" fill="url(#cGoldTop)"/>
    <circle cx="100" cy="52" r="10" fill="none" stroke="#713f12" stroke-width="1.5" stroke-dasharray="2 2"/>
    <text x="96" y="56" font-size="12" font-weight="900" fill="#713f12">$</text>
  </g>
  <!-- Floating Micro Coin Droplets & Sparkles -->
  <circle cx="34" cy="62" r="6" fill="#fde047"/>
  <circle cx="166" cy="58" r="6" fill="#fde047"/>
  <polygon points="100,20 102,26 108,26 103,30 105,36 100,32 95,36 97,30 92,26 98,26" fill="#ffffff"/>
  <polygon points="42,125 43,129 47,129 44,132 45,136 42,133 39,136 40,132 37,129 41,129" fill="#ffffff"/>
  <polygon points="158,125 159,129 163,129 160,132 161,136 158,133 155,136 156,132 153,129 157,129" fill="#ffffff"/>
</svg>`
  },

  // 2. 3D Mobile Crypto Trading Desk
  {
    id: 'scene-crypto-portfolio',
    title: 'Crypto Mobile Trading Desk',
    category: '3D Elements',
    tags: 'crypto, phone, mobile, trading, bitcoin, card, chart, desk, scene, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="scPhoneBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="scCardGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <!-- Background Credit Card (Tilted) -->
  <g transform="rotate(-15 130 75)">
    <rect x="90" y="45" width="75" height="46" rx="6" fill="url(#scCardGrad)" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/>
    <rect x="98" y="55" width="14" height="10" rx="2" fill="#facc15"/>
    <line x1="98" y1="75" x2="145" y2="75" stroke="#ffffff" stroke-width="2" stroke-opacity="0.6"/>
  </g>
  <!-- Center 3D Smartphone -->
  <rect x="58" y="32" width="84" height="142" rx="16" fill="url(#scPhoneBody)" stroke="#38bdf8" stroke-width="3"/>
  <!-- Phone Screen -->
  <rect x="64" y="42" width="72" height="122" rx="10" fill="#020617"/>
  <!-- Live Candlestick Graph on Screen -->
  <path d="M70 135 L82 120 L96 128 L112 90 L126 75" stroke="#22c55e" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="78" y="112" width="6" height="16" fill="#22c55e"/>
  <rect x="93" y="122" width="6" height="12" fill="#ef4444"/>
  <rect x="108" y="85" width="6" height="22" fill="#22c55e"/>
  <!-- Floating 3D Gold Bitcoin Coin in Front -->
  <g transform="translate(18, 92)">
    <circle cx="45" cy="45" r="22" fill="#f59e0b" stroke="#fde047" stroke-width="2.5"/>
    <circle cx="45" cy="45" r="17" fill="#d97706"/>
    <text x="40" y="51" font-size="16" font-weight="900" fill="#ffffff">₿</text>
  </g>
  <!-- Floating Ethereum Diamond on Right -->
  <g transform="translate(132, 115)">
    <polygon points="18,5 30,22 18,38 6,22" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
    <polygon points="18,5 30,22 18,18" fill="#e0f2fe"/>
    <polygon points="18,18 30,22 18,38" fill="#0284c7"/>
  </g>
</svg>`
  },

  // 3. 3D Viral Social Explosion
  {
    id: 'scene-social-explosion',
    title: 'Viral Social Explosion',
    category: 'Badges & Stickers',
    tags: 'social, media, viral, notification, heart, like, subscribe, explosion, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Central Smartphone Silhouette -->
  <rect x="68" y="44" width="64" height="118" rx="14" fill="#0f172a" stroke="#475569" stroke-width="3"/>
  <rect x="74" y="54" width="52" height="98" rx="8" fill="#1e293b"/>
  <!-- Heart Bubble (Top-Left) -->
  <g transform="translate(20, 25)">
    <rect x="0" y="0" width="46" height="36" rx="12" fill="#f43f5e"/>
    <path d="M23 11 C20 6 13 7 13 13 C13 19 23 25 23 25 C23 25 33 19 33 13 C33 7 26 6 23 11 Z" fill="#ffffff"/>
  </g>
  <!-- Thumbs Up Bubble (Top-Right) -->
  <g transform="translate(134, 30)">
    <rect x="0" y="0" width="46" height="36" rx="12" fill="#0284c7"/>
    <path d="M16 26 H20 V16 H16 Z M22 26 H31 C34 26 35 24 35 22 L33 16 H26 L28 10 C28 8 26 8 25 9 L22 16 Z" fill="#ffffff"/>
  </g>
  <!-- Golden Bell (Bottom-Left) -->
  <g transform="translate(18, 120)">
    <circle cx="22" cy="22" r="20" fill="#facc15"/>
    <path d="M22 10 C18 10 16 14 16 22 H28 C28 14 26 10 22 10 Z" fill="#713f12"/>
    <circle cx="22" cy="26" r="3" fill="#713f12"/>
  </g>
  <!-- Share Loop Arrow Bubble (Bottom-Right) -->
  <g transform="translate(136, 116)">
    <circle cx="22" cy="22" r="20" fill="#10b981"/>
    <path d="M15 22 L22 15 V19 H28 V25 H22 V29 Z" fill="#ffffff"/>
  </g>
  <!-- Explosive Particle Sparks -->
  <circle cx="100" cy="24" r="3" fill="#facc15"/>
  <circle cx="48" cy="80" r="3" fill="#38bdf8"/>
  <circle cx="156" cy="82" r="3" fill="#f43f5e"/>
  <polygon points="100,172 102,176 106,176 103,179 104,183 100,180 96,183 97,179 94,176 98,176" fill="#facc15"/>
</svg>`
  },

  // 4. 3D Rocket Launchpad Diorama
  {
    id: 'scene-rocket-launchpad',
    title: 'Rocket Launchpad Diorama',
    category: '3D Elements',
    tags: 'rocket, launch, launchpad, smoke, cloud, space, moon, mission, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Distant Moon Planet in Background -->
  <circle cx="152" cy="44" r="22" fill="#334155"/>
  <circle cx="144" cy="38" r="5" fill="#475569"/>
  <circle cx="158" cy="48" r="4" fill="#475569"/>
  <!-- Launch Gantry Scaffolding Tower (Left) -->
  <line x1="48" y1="65" x2="48" y2="165" stroke="#ef4444" stroke-width="4"/>
  <line x1="62" y1="85" x2="62" y2="165" stroke="#ef4444" stroke-width="4"/>
  <line x1="48" y1="85" x2="62" y2="85" stroke="#ef4444" stroke-width="2.5"/>
  <line x1="48" y1="110" x2="62" y2="110" stroke="#ef4444" stroke-width="2.5"/>
  <line x1="48" y1="135" x2="62" y2="135" stroke="#ef4444" stroke-width="2.5"/>
  <line x1="48" y1="85" x2="62" y2="110" stroke="#ef4444" stroke-width="2"/>
  <!-- Heavy Launchpad Base Platform -->
  <rect x="25" y="165" width="150" height="18" rx="4" fill="#1e293b" stroke="#475569" stroke-width="2"/>
  <!-- Billowing Smoke Cloud Rings -->
  <ellipse cx="100" cy="162" rx="48" ry="16" fill="#cbd5e1" fill-opacity="0.4"/>
  <ellipse cx="80" cy="155" rx="28" ry="14" fill="#f8fafc" fill-opacity="0.7"/>
  <ellipse cx="120" cy="155" rx="28" ry="14" fill="#f8fafc" fill-opacity="0.7"/>
  <!-- Rocket Jet Flame -->
  <polygon points="90,135 110,135 100,165" fill="#facc15"/>
  <polygon points="94,135 106,135 100,154" fill="#ffffff"/>
  <!-- Rocket Body -->
  <path d="M100 35 C88 60 84 100 86 135 H114 C116 100 112 60 100 35 Z" fill="#38bdf8"/>
  <path d="M100 35 C92 50 88 65 87 75 H113 C112 65 108 50 100 35 Z" fill="#f43f5e"/>
  <!-- Porthole Window -->
  <circle cx="100" cy="94" r="8" fill="#0f172a" stroke="#ffffff" stroke-width="2"/>
  <!-- Rocket Fins -->
  <polygon points="86,115 70,138 86,135" fill="#0284c7"/>
  <polygon points="114,115 130,138 114,135" fill="#0284c7"/>
</svg>`
  },

  // 5. 3D Filmmaker Studio Ensemble
  {
    id: 'scene-creator-studio-rig',
    title: 'Cinema Filmmaker Studio Rig',
    category: 'Illustrations',
    tags: 'cinema, camera, movie, clapper, tripod, film, studio, creator, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Tripod Stand Legs -->
  <line x1="125" y1="120" x2="90" y2="178" stroke="#475569" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="125" y1="120" x2="125" y2="178" stroke="#475569" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="125" y1="120" x2="160" y2="178" stroke="#475569" stroke-width="4.5" stroke-linecap="round"/>
  <!-- 3D Cinema Camera Head -->
  <rect x="98" y="76" width="54" height="42" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="114" cy="97" r="10" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="136" cy="97" r="10" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>
  <!-- Camera Matte Box Lens -->
  <polygon points="98,82 80,74 80,118 98,110" fill="#334155"/>
  <!-- Top Mounted Microphone -->
  <rect x="110" y="66" width="32" height="8" rx="3" fill="#64748b"/>
  <!-- Clapperboard in Front (Left) -->
  <g transform="translate(25, 95) rotate(-10 35 30)">
    <rect x="0" y="16" width="56" height="42" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="0" y="2" width="56" height="14" rx="2" fill="#334155"/>
    <polygon points="6,2 14,2 6,16 0,16" fill="#ffffff"/>
    <polygon points="20,2 28,2 20,16 12,16" fill="#ffffff"/>
    <polygon points="34,2 42,2 34,16 26,16" fill="#ffffff"/>
  </g>
  <!-- Red Recording ON-AIR Dot -->
  <circle cx="146" cy="74" r="4.5" fill="#ef4444"/>
</svg>`
  },

  // 6. 3D Video Editor Timeline Workspace
  {
    id: 'scene-video-editing-timeline',
    title: 'Video Editor Timeline Rig',
    category: 'UI Icons',
    tags: 'editor, timeline, video, tracks, cutting, scissors, premiere, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Main Monitor Screen -->
  <rect x="35" y="28" width="130" height="84" rx="10" fill="#0f172a" stroke="#475569" stroke-width="3"/>
  <rect x="42" y="35" width="116" height="68" rx="6" fill="#1e293b"/>
  <!-- Screen Video Playback Window -->
  <polygon points="94,56 112,68 94,80" fill="#38bdf8"/>
  <!-- Timeline Multi-Track Dock -->
  <rect x="25" y="122" width="150" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Video Track 1 (Cyan Clips) -->
  <rect x="32" y="130" width="46" height="10" rx="3" fill="#0284c7"/>
  <rect x="82" y="130" width="38" height="10" rx="3" fill="#0284c7"/>
  <rect x="124" y="130" width="44" height="10" rx="3" fill="#0284c7"/>
  <!-- Audio Track 2 (Green Waves) -->
  <rect x="32" y="145" width="70" height="10" rx="3" fill="#16a34a"/>
  <rect x="106" y="145" width="62" height="10" rx="3" fill="#16a34a"/>
  <!-- Playhead Red Needle Cursor -->
  <line x1="98" y1="120" x2="98" y2="174" stroke="#ef4444" stroke-width="3"/>
  <polygon points="94,120 102,120 98,126" fill="#ef4444"/>
  <!-- Cutting Scissors Icon (Top Right) -->
  <g transform="translate(145, 108) scale(0.7)">
    <circle cx="10" cy="10" r="5" stroke="#facc15" stroke-width="2" fill="none"/>
    <circle cx="10" cy="24" r="5" stroke="#facc15" stroke-width="2" fill="none"/>
    <line x1="14" y1="12" x2="28" y2="24" stroke="#facc15" stroke-width="2.5"/>
    <line x1="14" y1="22" x2="28" y2="10" stroke="#facc15" stroke-width="2.5"/>
  </g>
</svg>`
  },

  // 7. 3D Analytics Command Center
  {
    id: 'scene-analytics-dashboard',
    title: 'Analytics Command Center',
    category: 'UI Icons',
    tags: 'analytics, dashboard, chart, bars, pie, growth, metrics, scene, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Angled Glassmorphic Screen Container -->
  <rect x="25" y="32" width="150" height="136" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
  <!-- Top Bar with Traffic Light Dots -->
  <circle cx="42" cy="48" r="4" fill="#ef4444"/>
  <circle cx="54" cy="48" r="4" fill="#facc15"/>
  <circle cx="66" cy="48" r="4" fill="#22c55e"/>
  <!-- Donut Pie Chart (Left) -->
  <circle cx="65" cy="95" r="22" stroke="#334155" stroke-width="8" fill="none"/>
  <circle cx="65" cy="95" r="22" stroke="#38bdf8" stroke-width="8" stroke-dasharray="85 100" fill="none"/>
  <!-- 3D Bar Columns (Right) -->
  <rect x="110" y="105" width="12" height="36" rx="3" fill="#64748b"/>
  <rect x="128" y="85" width="12" height="56" rx="3" fill="#0284c7"/>
  <rect x="146" y="65" width="12" height="76" rx="3" fill="#22c55e"/>
  <!-- Upward Trendline Rocket Curve -->
  <path d="M42 142 Q100 135 158 52" stroke="#facc15" stroke-width="4" stroke-linecap="round" fill="none"/>
  <polygon points="164,48 152,52 158,62" fill="#facc15"/>
</svg>`
  },

  // 8. 3D Championship Trophy & Confetti
  {
    id: 'scene-podium-celebration',
    title: 'Winner Trophy Celebration',
    category: 'Awards',
    tags: 'trophy, win, celebration, confetti, star, award, champion, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Base Pedestal -->
  <rect x="62" y="152" width="76" height="24" rx="5" fill="#713f12" stroke="#facc15" stroke-width="2"/>
  <rect x="74" y="138" width="52" height="14" fill="#b45309"/>
  <!-- Trophy Cup Body -->
  <path d="M68 62 H132 V94 C132 118 116 138 100 138 C84 138 68 118 68 94 Z" fill="#facc15" stroke="#fde047" stroke-width="2"/>
  <!-- Handles -->
  <path d="M68 70 H52 C46 70 42 78 46 94 C50 108 62 110 68 110" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M132 70 H148 C154 70 158 78 154 94 C150 108 138 110 132 110" stroke="#facc15" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Star on Cup -->
  <polygon points="100,82 103,91 112,91 105,97 108,106 100,100 92,106 95,97 88,91 97,91" fill="#ffffff"/>
  <!-- Flying Colorful Confetti Rectangles & Dots -->
  <rect x="42" y="35" width="8" height="4" transform="rotate(25 42 35)" fill="#ef4444"/>
  <rect x="145" y="32" width="8" height="4" transform="rotate(-30 145 32)" fill="#3b82f6"/>
  <rect x="30" y="80" width="8" height="4" transform="rotate(45 30 80)" fill="#10b981"/>
  <rect x="165" y="85" width="8" height="4" transform="rotate(-20 165 85)" fill="#ec4899"/>
  <circle cx="100" cy="38" r="4" fill="#facc15"/>
  <circle cx="65" cy="45" r="3" fill="#a855f7"/>
  <circle cx="132" cy="48" r="3" fill="#f97316"/>
</svg>`
  },

  // 9. 3D Cybersecurity Fortress Shield
  {
    id: 'scene-cyber-fortress',
    title: 'Cyber Security Fortress',
    category: 'Badges & Stickers',
    tags: 'security, shield, lock, cyber, matrix, defense, safe, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Matrix Hexagon Base -->
  <polygon points="100,22 168,60 168,140 100,178 32,140 32,60" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="8 4" fill="#0f172a"/>
  <!-- Heavy Armored Shield -->
  <path d="M100 42 C135 42 152 62 152 102 C152 142 100 164 100 164 C100 164 48 142 48 102 C48 62 65 42 100 42 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="4"/>
  <!-- Digital Padlock in Center -->
  <g transform="translate(76, 75)">
    <path d="M14 24 V14 C14 8 18 4 24 4 C30 4 34 8 34 14 V24" stroke="#ffffff" stroke-width="5" fill="none"/>
    <rect x="6" y="22" width="36" height="30" rx="8" fill="#0f172a" stroke="#facc15" stroke-width="2.5"/>
    <circle cx="24" cy="36" r="4" fill="#facc15"/>
  </g>
</svg>`
  },

  // 10. 3D Money Shower & Treasure Sack
  {
    id: 'scene-flying-cash-cannon',
    title: 'Money Shower Wealth Sack',
    category: '3D Elements',
    tags: 'money, cash, wealth, bag, shower, gold, billionaire, rich, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Central Money Sack -->
  <path d="M85 95 C68 105 52 128 56 156 C60 176 80 180 100 180 C120 180 140 176 144 156 C148 128 132 105 115 95 Z" fill="#b45309" stroke="#78350f" stroke-width="3"/>
  <circle cx="100" cy="142" r="18" fill="#15803d"/>
  <text x="94" y="148" font-size="18" font-weight="900" fill="#ffffff">$</text>
  <!-- Floating Cash Banknote Top Left -->
  <g transform="rotate(-25 55 55)">
    <rect x="25" y="42" width="60" height="32" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <circle cx="55" cy="58" r="7" fill="#86efac"/>
    <text x="52" y="62" font-size="10" font-weight="900" fill="#15803d">$</text>
  </g>
  <!-- Floating Cash Banknote Top Right -->
  <g transform="rotate(28 145 55)">
    <rect x="115" y="42" width="60" height="32" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
    <circle cx="145" cy="58" r="7" fill="#86efac"/>
    <text x="142" y="62" font-size="10" font-weight="900" fill="#15803d">$</text>
  </g>
  <!-- Cascading Gold Coins -->
  <circle cx="45" cy="115" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  <circle cx="155" cy="115" r="9" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
  <circle cx="100" cy="42" r="11" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="97" y="46" font-size="10" font-weight="900" fill="#713f12">$</text>
</svg>`
  },

  // 11. 3D Esports Battle Station
  {
    id: 'scene-pro-gaming-rig',
    title: 'Esports Pro Battle Station',
    category: 'UI Icons',
    tags: 'gaming, esports, battle, station, keyboard, mouse, screen, desk, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Curved Ultrawide Display -->
  <path d="M30 45 Q100 38 170 45 V110 Q100 102 30 110 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
  <!-- Display Stand -->
  <rect x="94" y="108" width="12" height="24" fill="#475569"/>
  <ellipse cx="100" cy="132" rx="30" ry="6" fill="#334155"/>
  <!-- Mechanical RGB Keyboard -->
  <rect x="42" y="144" width="80" height="26" rx="4" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
  <rect x="48" y="148" width="8" height="6" rx="1" fill="#38bdf8"/>
  <rect x="60" y="148" width="8" height="6" rx="1" fill="#38bdf8"/>
  <rect x="72" y="148" width="8" height="6" rx="1" fill="#38bdf8"/>
  <rect x="84" y="148" width="8" height="6" rx="1" fill="#38bdf8"/>
  <rect x="96" y="148" width="18" height="6" rx="1" fill="#22c55e"/>
  <rect x="54" y="158" width="45" height="6" rx="1" fill="#facc15"/>
  <!-- Gaming RGB Mouse -->
  <rect x="134" y="144" width="22" height="30" rx="10" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/>
  <line x1="145" y1="144" x2="145" y2="156" stroke="#06b6d4" stroke-width="1.5"/>
</svg>`
  },

  // 12. 3D E-Commerce Shopping Spree
  {
    id: 'scene-ecom-shopping-cart',
    title: 'E-Commerce Shopping Spree',
    category: 'UI Icons',
    tags: 'shopping, cart, ecommerce, delivery, box, parcel, buy, discount, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Delivery Cardboard Parcel Box in Cart -->
  <rect x="62" y="55" width="44" height="42" rx="4" fill="#d97706" stroke="#b45309" stroke-width="2"/>
  <line x1="84" y1="55" x2="84" y2="97" stroke="#fde68a" stroke-width="3"/>
  <!-- Second Gift Box -->
  <rect x="98" y="65" width="36" height="32" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
  <line x1="98" y1="81" x2="134" y2="81" stroke="#facc15" stroke-width="3"/>
  <!-- Shopping Wire Cart -->
  <path d="M30 52 H48 L65 125 H145 L160 80 H60" stroke="#cbd5e1" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Wire Grid Lines -->
  <line x1="72" y1="100" x2="152" y2="100" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="88" y1="80" x2="88" y2="125" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="116" y1="80" x2="116" y2="125" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="138" y1="80" x2="138" y2="125" stroke="#cbd5e1" stroke-width="2"/>
  <!-- Cart Wheels -->
  <circle cx="75" cy="148" r="9" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
  <circle cx="135" cy="148" r="9" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
  <!-- Floating Discount Percentage Tag -->
  <g transform="translate(135, 35) rotate(15 15 15)">
    <rect x="0" y="0" width="32" height="24" rx="4" fill="#ef4444"/>
    <text x="6" y="16" font-size="12" font-weight="900" fill="#ffffff">%</text>
  </g>
</svg>`
  },

  // 13. 3D AI Cybernetic Interaction
  {
    id: 'scene-ai-robot-hand-core',
    title: 'AI Cybernetic Touch',
    category: 'Brand Logos',
    tags: 'ai, robot, cyborg, touch, spark, neural, tech, futuristic, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Robot Arm (Left) -->
  <rect x="15" y="85" width="46" height="30" rx="6" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <rect x="58" y="90" width="35" height="20" rx="5" fill="#64748b"/>
  <line x1="93" y1="100" x2="110" y2="100" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
  <!-- Floating Holographic Neural Core (Right) -->
  <circle cx="140" cy="100" r="32" fill="#0f172a" stroke="#8b5cf6" stroke-width="3"/>
  <circle cx="140" cy="100" r="20" fill="#8b5cf6" fill-opacity="0.3"/>
  <circle cx="140" cy="100" r="8" fill="#ffffff"/>
  <!-- Connecting Quantum Spark Arc -->
  <path d="M110 100 Q120 85 128 98" stroke="#38bdf8" stroke-width="3" fill="none"/>
  <circle cx="114" cy="94" r="3" fill="#facc15"/>
  <polygon points="120,90 122,94 126,94 123,97 124,101 120,98 116,101 117,97 114,94 118,94" fill="#ffffff"/>
</svg>`
  },

  // 14. 3D Financial Growth Money Tree
  {
    id: 'scene-money-growth-tree',
    title: 'Compound Growth Money Tree',
    category: 'Illustrations',
    tags: 'tree, growth, money, invest, compound, interest, plant, pot, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Clay Planter Pot -->
  <polygon points="65,135 135,135 125,178 75,178" fill="#b45309" stroke="#78350f" stroke-width="2.5"/>
  <rect x="60" y="130" width="80" height="8" rx="2" fill="#d97706"/>
  <!-- Tree Trunk & Branches -->
  <path d="M100 130 V75" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
  <path d="M100 105 Q80 95 72 80" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M100 95 Q120 85 128 70" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none"/>
  <!-- Foliage Dollar Coins Clusters -->
  <circle cx="100" cy="52" r="20" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
  <text x="94" y="58" font-size="16" font-weight="900" fill="#ffffff">$</text>
  <circle cx="68" cy="74" r="15" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="64" y="79" font-size="12" font-weight="900" fill="#713f12">$</text>
  <circle cx="132" cy="65" r="15" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="128" y="70" font-size="12" font-weight="900" fill="#713f12">$</text>
</svg>`
  },

  // 15. 3D Autonomous Delivery Drone
  {
    id: 'scene-delivery-drone-parcel',
    title: 'Cargo Delivery Drone',
    category: '3D Elements',
    tags: 'drone, delivery, quadcopter, parcel, flight, cargo, amazon, future, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- 4 Spinning Rotor Blades -->
  <ellipse cx="45" cy="55" rx="24" ry="4" fill="#38bdf8" fill-opacity="0.8"/>
  <ellipse cx="155" cy="55" rx="24" ry="4" fill="#38bdf8" fill-opacity="0.8"/>
  <!-- Drone Frame Struts -->
  <line x1="55" y1="62" x2="100" y2="82" stroke="#475569" stroke-width="4"/>
  <line x1="145" y1="62" x2="100" y2="82" stroke="#475569" stroke-width="4"/>
  <!-- Central Pod Body -->
  <rect x="80" y="72" width="40" height="26" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="100" cy="85" r="5" fill="#22c55e"/>
  <!-- Cargo Suspension Cables -->
  <line x1="90" y1="98" x2="85" y2="125" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="110" y1="98" x2="115" y2="125" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Suspended Parcel Box -->
  <rect x="74" y="125" width="52" height="42" rx="4" fill="#d97706" stroke="#b45309" stroke-width="2.5"/>
  <line x1="100" y1="125" x2="100" y2="167" stroke="#fde68a" stroke-width="3"/>
  <line x1="74" y1="145" x2="126" y2="145" stroke="#fde68a" stroke-width="3"/>
</svg>`
  },

  // 16. 3D Podcast Studio Console
  {
    id: 'scene-podcast-broadcast-desk',
    title: 'Podcast Studio Setup',
    category: 'UI Icons',
    tags: 'podcast, audio, microphone, headphones, broadcast, voice, studio, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Studio Desk Base -->
  <line x1="25" y1="172" x2="175" y2="172" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
  <!-- Boom Arm Stand -->
  <line x1="50" y1="172" x2="75" y2="110" stroke="#64748b" stroke-width="5" stroke-linecap="round"/>
  <line x1="75" y1="110" x2="105" y2="80" stroke="#64748b" stroke-width="5" stroke-linecap="round"/>
  <!-- Condenser Microphone with Pop Filter -->
  <g transform="translate(100, 52) rotate(25 15 25)">
    <rect x="10" y="10" width="18" height="34" rx="9" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <line x1="10" y1="22" x2="28" y2="22" stroke="#ffffff" stroke-width="1.5"/>
  </g>
  <!-- Over-Ear Studio Headphones (Right) -->
  <g transform="translate(125, 105)">
    <path d="M12 35 C12 18 24 6 42 6 C60 6 72 18 72 35" stroke="#cbd5e1" stroke-width="5" fill="none"/>
    <rect x="6" y="32" width="14" height="26" rx="6" fill="#f43f5e"/>
    <rect x="64" y="32" width="14" height="26" rx="6" fill="#f43f5e"/>
  </g>
</svg>`
  },

  // 17. 3D Cloud Server Rack Datacenter
  {
    id: 'scene-cloud-server-datacenter',
    title: 'Cloud Datacenter Tower',
    category: 'Brand Logos',
    tags: 'server, cloud, datacenter, database, network, rack, hosting, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Floating Top Cloud -->
  <path d="M72 58 C60 58 50 48 50 36 C50 25 58 17 68 16 C74 4 92 -2 106 3 C118 6 126 17 128 28 C138 30 145 38 145 48 C145 58 136 58 125 58 Z" fill="#38bdf8"/>
  <!-- Server Rack Cabinet Base -->
  <rect x="52" y="72" width="96" height="106" rx="8" fill="#0f172a" stroke="#475569" stroke-width="3"/>
  <!-- 3-Tier Blade Servers -->
  <rect x="60" y="82" width="80" height="24" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="70" cy="94" r="3" fill="#22c55e"/>
  <circle cx="80" cy="94" r="3" fill="#22c55e"/>
  <line x1="95" y1="94" x2="130" y2="94" stroke="#64748b" stroke-width="2"/>
  <rect x="60" y="112" width="80" height="24" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="70" cy="124" r="3" fill="#22c55e"/>
  <circle cx="80" cy="124" r="3" fill="#facc15"/>
  <line x1="95" y1="124" x2="130" y2="124" stroke="#64748b" stroke-width="2"/>
  <rect x="60" y="142" width="80" height="24" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="70" cy="154" r="3" fill="#22c55e"/>
  <circle cx="80" cy="154" r="3" fill="#22c55e"/>
  <line x1="95" y1="154" x2="130" y2="154" stroke="#64748b" stroke-width="2"/>
  <!-- Connecting Data Cable -->
  <path d="M100 58 V72" stroke="#38bdf8" stroke-width="3" stroke-dasharray="3 2"/>
</svg>`
  },

  // 18. 3D Creator Creative Workspace
  {
    id: 'scene-creative-designer-desk',
    title: 'Designer Drafting Table',
    category: 'Illustrations',
    tags: 'design, creative, desk, sketch, pencil, coffee, art, studio, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Open Spiral Sketchbook -->
  <rect x="35" y="45" width="105" height="115" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
  <line x1="48" y1="45" x2="48" y2="160" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 4"/>
  <!-- Pen Drawing Vector Curve on Paper -->
  <path d="M60 85 Q80 120 115 80" stroke="#3b82f6" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Angled Drafting Pencil -->
  <g transform="translate(105, 50) rotate(35 8 40)">
    <polygon points="4,0 12,0 8,14" fill="#f59e0b"/>
    <polygon points="7,0 9,0 8,4" fill="#0f172a"/>
    <rect x="4" y="14" width="8" height="50" fill="#facc15"/>
    <rect x="4" y="64" width="8" height="8" fill="#f43f5e"/>
  </g>
  <!-- Coffee Mug (Right) -->
  <ellipse cx="155" cy="138" rx="20" ry="8" fill="#0284c7"/>
  <rect x="142" y="104" width="26" height="32" rx="4" fill="#0284c7"/>
  <ellipse cx="155" cy="104" rx="13" ry="5" fill="#78350f"/>
  <path d="M155 96 C152 88 158 84 154 75" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
</svg>`
  },

  // 19. 3D Wizard Magic Spellbook & Potion
  {
    id: 'scene-magic-spellbook-alchemy',
    title: 'Alchemy Grimoire & Potion',
    category: 'Badges & Stickers',
    tags: 'magic, spellbook, grimoire, alchemy, potion, fantasy, wizard, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Open Heavy Magic Book -->
  <path d="M28 152 C45 142 80 140 100 150 C120 140 155 142 172 152 V90 C155 80 120 78 100 88 C80 78 45 80 28 90 Z" fill="#fef3c7" stroke="#78350f" stroke-width="3.5"/>
  <line x1="100" y1="88" x2="100" y2="150" stroke="#78350f" stroke-width="3"/>
  <!-- Mystic Runes on Pages -->
  <text x="44" y="112" font-size="12" font-family="serif" fill="#78350f">✦ ☽ ✧</text>
  <text x="116" y="112" font-size="12" font-family="serif" fill="#78350f">☿ 🜂 🜁</text>
  <!-- Glass Potion Vial Hovering Above -->
  <g transform="translate(85, 25)">
    <rect x="10" y="4" width="10" height="12" rx="2" fill="#d97706"/>
    <circle cx="15" cy="32" r="16" fill="#a855f7" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="15" cy="32" r="10" fill="#c084fc"/>
    <circle cx="12" cy="28" r="2.5" fill="#ffffff"/>
  </g>
  <!-- Magic Sparkles -->
  <circle cx="68" cy="45" r="3" fill="#facc15"/>
  <circle cx="138" cy="45" r="3" fill="#facc15"/>
</svg>`
  },

  // 20. 3D Time Paradox Clockwork
  {
    id: 'scene-time-chronometer-hourglass',
    title: 'Clockwork Time Chronometer',
    category: '3D Elements',
    tags: 'clock, time, hourglass, chronometer, gear, paradox, history, watch, composite',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Roman Gear Clock Ring -->
  <circle cx="100" cy="100" r="72" stroke="#facc15" stroke-width="5" fill="#0f172a"/>
  <circle cx="100" cy="100" r="62" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- Hour Markers -->
  <text x="96" y="48" font-size="12" font-weight="900" fill="#fde047">XII</text>
  <text x="150" y="104" font-size="11" font-weight="900" fill="#fde047">III</text>
  <text x="96" y="158" font-size="11" font-weight="900" fill="#fde047">VI</text>
  <text x="42" y="104" font-size="11" font-weight="900" fill="#fde047">IX</text>
  <!-- Brass Hourglass in Center Core -->
  <path d="M82 68 H118 C118 85 106 95 102 100 C106 105 118 115 118 132 H82 C82 115 94 105 98 100 C94 95 82 85 82 68 Z" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Golden Sand Stream -->
  <polygon points="88,72 112,72 102,96 98,96" fill="#facc15"/>
  <polygon points="90,130 110,130 100,116" fill="#facc15"/>
  <!-- Top and Bottom Plates -->
  <rect x="78" y="64" width="44" height="6" rx="2" fill="#d97706"/>
  <rect x="78" y="130" width="44" height="6" rx="2" fill="#d97706"/>
</svg>`
  }
];
