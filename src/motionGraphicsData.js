// 50 High-End 3D Motion Graphics Vector Elements for YouTube & Video Creators
// Designed specifically for motion design b-roll, 3D callouts, thumbnails, and explainer animations

export const YOUTUBE_MOTION_ELEMENTS = [
  // 1. YouTube Creator Play Button
  {
    id: 'yt-play-button',
    title: '3D Creator Play Button',
    category: '3D Elements',
    tags: 'youtube, play, button, video, streaming, creator, award, 3d, red',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="ytRedGrad" x1="30" y1="40" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ff0033"/>
      <stop offset="0.6" stop-color="#cc0000"/>
      <stop offset="1" stop-color="#800000"/>
    </linearGradient>
    <linearGradient id="ytSilverPlate" x1="80" y1="70" x2="135" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.7" stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#cbd5e1"/>
    </linearGradient>
    <filter id="ytShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#ff0033" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect x="25" y="48" width="150" height="104" rx="28" fill="url(#ytRedGrad)" filter="url(#ytShadow)"/>
  <rect x="28" y="51" width="144" height="48" rx="24" fill="#ffffff" fill-opacity="0.22"/>
  <polygon points="84,74 134,100 84,126" fill="url(#ytSilverPlate)"/>
  <polygon points="84,74 134,100 84,100" fill="#ffffff" fill-opacity="0.4"/>
</svg>`
  },

  // 2. Notification Bell with Sound Waves
  {
    id: 'yt-subscribe-bell',
    title: 'Subscribe Alert Bell',
    category: 'UI Icons',
    tags: 'bell, notification, subscribe, alert, reminder, youtube, sound',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="bellGold" x1="60" y1="30" x2="140" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.4" stop-color="#eab308"/>
      <stop offset="0.8" stop-color="#ca8a04"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="38" r="9" fill="#eab308"/>
  <path d="M100 48 C72 48 64 80 60 120 C54 138 42 142 42 148 H158 C158 142 146 138 140 120 C136 80 128 48 100 48 Z" fill="url(#bellGold)"/>
  <circle cx="100" cy="162" r="14" fill="#ca8a04"/>
  <path d="M168 85 C176 95 176 110 168 120" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <path d="M180 72 C194 90 194 116 180 134" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <path d="M32 85 C24 95 24 110 32 120" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <path d="M20 72 C6 90 6 116 20 134" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
</svg>`
  },

  // 3. 3D Thumbs Up Like Badge
  {
    id: 'yt-thumbs-up',
    title: '3D Like Thumbs Up',
    category: '3D Elements',
    tags: 'like, thumb, agree, youtube, vote, engagement, viral, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="likeBlue" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect x="36" y="90" width="28" height="68" rx="8" fill="#0284c7"/>
  <rect x="40" y="94" width="20" height="24" rx="4" fill="#38bdf8"/>
  <path d="M68 102 H124 C138 102 148 108 144 122 C148 124 150 134 146 142 C150 144 150 154 142 160 C138 162 130 162 118 162 H68 Z" fill="url(#likeBlue)"/>
  <path d="M68 102 L98 52 C104 42 114 44 116 54 C118 70 106 88 106 102 H68 Z" fill="url(#likeBlue)"/>
  <circle cx="104" cy="52" r="3" fill="#ffffff"/>
</svg>`
  },

  // 4. Gold Bullion Bar Stack
  {
    id: 'yt-gold-bars',
    title: 'Gold Bullion Stack',
    category: '3D Elements',
    tags: 'gold, bar, bullion, wealth, money, finance, rich, investment',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="barTop" x1="30" y1="90" x2="150" y2="90" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="1" stop-color="#facc15"/>
    </linearGradient>
    <linearGradient id="barSide" x1="50" y1="120" x2="150" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#eab308"/>
      <stop offset="1" stop-color="#a16207"/>
    </linearGradient>
  </defs>
  <!-- Lower Left Bar -->
  <polygon points="40,135 110,135 130,120 60,120" fill="url(#barTop)"/>
  <polygon points="40,135 110,135 105,155 35,155" fill="url(#barSide)"/>
  <polygon points="110,135 130,120 125,140 105,155" fill="#ca8a04"/>
  <!-- Lower Right Bar -->
  <polygon points="80,135 150,135 170,120 100,120" fill="url(#barTop)"/>
  <polygon points="80,135 150,135 145,155 75,155" fill="url(#barSide)"/>
  <polygon points="150,135 170,120 165,140 145,155" fill="#ca8a04"/>
  <!-- Top Stack Bar -->
  <polygon points="60,95 130,95 150,80 80,80" fill="#fef9c3"/>
  <polygon points="60,95 130,95 125,115 55,115" fill="url(#barSide)"/>
  <polygon points="130,95 150,80 145,100 125,115" fill="#ca8a04"/>
  <text x="82" y="102" font-size="10" font-weight="900" fill="#713f12" opacity="0.6">999.9</text>
</svg>`
  },

  // 5. Stock Market Candlestick Growth Chart
  {
    id: 'yt-candlestick-chart',
    title: 'Trading Candlestick Bull Run',
    category: 'UI Icons',
    tags: 'stock, market, trading, crypto, candlestick, bull, growth, finance',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Grid Axis -->
  <line x1="30" y1="165" x2="175" y2="165" stroke="#334155" stroke-width="2.5"/>
  <line x1="30" y1="30" x2="30" y2="165" stroke="#334155" stroke-width="2.5"/>
  <!-- Bear Candle 1 (Red) -->
  <line x1="55" y1="90" x2="55" y2="150" stroke="#ef4444" stroke-width="3"/>
  <rect x="47" y="105" width="16" height="32" rx="2" fill="#ef4444"/>
  <!-- Bull Candle 2 (Green) -->
  <line x1="85" y1="80" x2="85" y2="140" stroke="#10b981" stroke-width="3"/>
  <rect x="77" y="92" width="16" height="36" rx="2" fill="#10b981"/>
  <!-- Bull Candle 3 (Green) -->
  <line x1="115" y1="60" x2="115" y2="120" stroke="#10b981" stroke-width="3"/>
  <rect x="107" y="70" width="16" height="42" rx="2" fill="#10b981"/>
  <!-- Giant Bull Breakout Candle 4 -->
  <line x1="145" y1="35" x2="145" y2="95" stroke="#10b981" stroke-width="3"/>
  <rect x="137" y="42" width="16" height="46" rx="2" fill="#34d399"/>
  <!-- Trend Arrow -->
  <path d="M45 130 Q90 100 155 35" stroke="#facc15" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <polygon points="160,32 146,36 154,46" fill="#facc15"/>
</svg>`
  },

  // 6. Flying Money with Wings
  {
    id: 'yt-flying-cash',
    title: 'Flying Dollar Cash',
    category: '3D Elements',
    tags: 'money, cash, dollar, wings, fly, inflation, spend, rich',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cashGreen" x1="50" y1="70" x2="150" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#4ade80"/>
      <stop offset="0.6" stop-color="#22c55e"/>
      <stop offset="1" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <!-- Left Wing -->
  <path d="M60 85 C36 65 14 74 24 100 C34 114 54 106 62 100 Z" fill="#e2e8f0"/>
  <path d="M56 75 C34 55 10 65 18 90 C30 92 48 88 56 84 Z" fill="#ffffff"/>
  <!-- Right Wing -->
  <path d="M140 85 C164 65 186 74 176 100 C166 114 146 106 138 100 Z" fill="#e2e8f0"/>
  <path d="M144 75 C166 55 190 65 182 90 C170 92 152 88 144 84 Z" fill="#ffffff"/>
  <!-- Green Cash Banknote -->
  <rect x="48" y="76" width="104" height="60" rx="8" fill="url(#cashGreen)" stroke="#166534" stroke-width="3"/>
  <rect x="54" y="82" width="92" height="48" rx="5" fill="none" stroke="#86efac" stroke-width="1.5" stroke-dasharray="4 2"/>
  <circle cx="100" cy="106" r="16" fill="#166534"/>
  <circle cx="100" cy="106" r="13" fill="#86efac"/>
  <text x="94" y="112" font-size="16" font-weight="900" fill="#15803d">$</text>
</svg>`
  },

  // 7. Security Safe Vault Door
  {
    id: 'yt-safe-vault',
    title: 'Heavy Vault Door',
    category: '3D Elements',
    tags: 'vault, safe, bank, security, secret, money, protected, locked',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <radialGradient id="vaultDoor" cx="100" cy="100" r="75" gradientUnits="userSpaceOnUse">
      <stop stop-color="#64748b"/>
      <stop offset="0.6" stop-color="#334155"/>
      <stop offset="1" stop-color="#0f172a"/>
    </radialGradient>
  </defs>
  <!-- Outer Frame -->
  <rect x="25" y="25" width="150" height="150" rx="20" fill="#1e293b" stroke="#475569" stroke-width="5"/>
  <!-- Vault Round Door -->
  <circle cx="100" cy="100" r="62" fill="url(#vaultDoor)" stroke="#94a3b8" stroke-width="4"/>
  <!-- Locking Bolts -->
  <circle cx="100" cy="48" r="4.5" fill="#f8fafc"/>
  <circle cx="152" cy="100" r="4.5" fill="#f8fafc"/>
  <circle cx="100" cy="152" r="4.5" fill="#f8fafc"/>
  <circle cx="48" cy="100" r="4.5" fill="#f8fafc"/>
  <!-- Spin Wheel Handle -->
  <circle cx="100" cy="100" r="24" stroke="#facc15" stroke-width="5" fill="#1e293b"/>
  <line x1="100" y1="70" x2="100" y2="130" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <line x1="70" y1="100" x2="130" y2="100" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="9" fill="#fef08a"/>
</svg>`
  },

  // 8. Money Bag Sack
  {
    id: 'yt-money-bag',
    title: 'Billionaire Money Bag',
    category: 'Badges & Stickers',
    tags: 'money, bag, sack, rich, gold, dollar, cash, treasure',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="sackGrad" x1="60" y1="70" x2="140" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#d97706"/>
      <stop offset="0.6" stop-color="#b45309"/>
      <stop offset="1" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <!-- Gathered Top Frill -->
  <polygon points="100,52 82,34 118,34" fill="#d97706"/>
  <circle cx="82" cy="34" r="8" fill="#f59e0b"/>
  <circle cx="100" cy="32" r="8" fill="#f59e0b"/>
  <circle cx="118" cy="34" r="8" fill="#f59e0b"/>
  <!-- Golden Tie String -->
  <rect x="80" y="52" width="40" height="8" rx="4" fill="#fde047"/>
  <!-- Bulbous Sack Body -->
  <path d="M85 58 C60 70 38 108 42 144 C46 172 74 176 100 176 C126 176 154 172 158 144 C162 108 140 70 115 58 Z" fill="url(#sackGrad)"/>
  <!-- Big Dollar Badge -->
  <circle cx="100" cy="120" r="24" fill="#15803d" stroke="#86efac" stroke-width="3"/>
  <text x="92" y="128" font-size="24" font-weight="900" fill="#ffffff">$</text>
</svg>`
  },

  // 9. Piggy Bank with Gold Coin Drop
  {
    id: 'yt-piggy-bank',
    title: 'Savings Piggy Bank',
    category: 'Illustrations',
    tags: 'piggy, bank, savings, coin, invest, budget, cute, finance',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="pigPink" x1="50" y1="60" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f472b6"/>
      <stop offset="0.7" stop-color="#ec4899"/>
      <stop offset="1" stop-color="#be185d"/>
    </linearGradient>
  </defs>
  <!-- Dropping Gold Coin -->
  <circle cx="98" cy="40" r="14" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
  <text x="94" y="45" font-size="14" font-weight="900" fill="#713f12">$</text>
  <!-- Pig Body -->
  <ellipse cx="100" cy="122" rx="58" ry="46" fill="url(#pigPink)"/>
  <!-- Coin Slot -->
  <rect x="86" y="74" width="24" height="5" rx="2.5" fill="#831843"/>
  <!-- Snout -->
  <ellipse cx="44" cy="125" rx="14" ry="18" fill="#fbcfe8"/>
  <circle cx="40" cy="122" r="3" fill="#be185d"/>
  <circle cx="40" cy="128" r="3" fill="#be185d"/>
  <!-- Eye -->
  <circle cx="68" cy="105" r="4.5" fill="#0f172a"/>
  <circle cx="67" cy="103" r="1.5" fill="#ffffff"/>
  <!-- Ear -->
  <polygon points="80,82 72,58 96,70" fill="#fbcfe8"/>
  <!-- Stubby Legs -->
  <rect x="68" y="156" width="16" height="18" rx="6" fill="#be185d"/>
  <rect x="116" y="156" width="16" height="18" rx="6" fill="#be185d"/>
</svg>`
  },

  // 10. AI Neural Processor Chip
  {
    id: 'yt-ai-microchip',
    title: 'AI Neural Superchip',
    category: 'Brand Logos',
    tags: 'chip, cpu, processor, ai, tech, hardware, cyber, silicon',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="chipBody" x1="45" y1="45" x2="155" y2="155" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b"/>
      <stop offset="0.6" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <!-- External Connector Pins -->
  <line x1="60" y1="24" x2="60" y2="44" stroke="#38bdf8" stroke-width="4"/>
  <line x1="100" y1="24" x2="100" y2="44" stroke="#38bdf8" stroke-width="4"/>
  <line x1="140" y1="24" x2="140" y2="44" stroke="#38bdf8" stroke-width="4"/>
  <line x1="60" y1="156" x2="60" y2="176" stroke="#38bdf8" stroke-width="4"/>
  <line x1="100" y1="156" x2="100" y2="176" stroke="#38bdf8" stroke-width="4"/>
  <line x1="140" y1="156" x2="140" y2="176" stroke="#38bdf8" stroke-width="4"/>
  <line x1="24" y1="60" x2="44" y2="60" stroke="#38bdf8" stroke-width="4"/>
  <line x1="24" y1="100" x2="44" y2="100" stroke="#38bdf8" stroke-width="4"/>
  <line x1="24" y1="140" x2="44" y2="140" stroke="#38bdf8" stroke-width="4"/>
  <line x1="156" y1="60" x2="176" y2="60" stroke="#38bdf8" stroke-width="4"/>
  <line x1="156" y1="100" x2="176" y2="100" stroke="#38bdf8" stroke-width="4"/>
  <line x1="156" y1="140" x2="176" y2="140" stroke="#38bdf8" stroke-width="4"/>
  <!-- Main Silicon Die Body -->
  <rect x="44" y="44" width="112" height="112" rx="16" fill="url(#chipBody)" stroke="#06b6d4" stroke-width="3.5"/>
  <!-- Core Hologram Center -->
  <rect x="74" y="74" width="52" height="52" rx="10" fill="#06b6d4" fill-opacity="0.15" stroke="#a855f7" stroke-width="2.5"/>
  <text x="86" y="106" font-size="20" font-weight="900" fill="#22d3ee">AI</text>
</svg>`
  },

  // 11. Holographic Cyber Skull
  {
    id: 'yt-cyber-skull',
    title: 'Neon Cyber Skull',
    category: 'Illustrations',
    tags: 'skull, cyber, neon, punk, danger, dead, warning, gaming',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="skullCyan" x1="40" y1="30" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#22d3ee"/>
      <stop offset="0.6" stop-color="#06b6d4"/>
      <stop offset="1" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <!-- Cranium Silhouette -->
  <path d="M52 102 C42 60 74 35 100 35 C126 35 158 60 148 102 C146 118 138 126 138 140 H62 C62 126 54 118 52 102 Z" fill="#0f172a" stroke="url(#skullCyan)" stroke-width="4.5"/>
  <!-- Teeth Jaw -->
  <rect x="72" y="142" width="56" height="26" rx="6" fill="#0f172a" stroke="url(#skullCyan)" stroke-width="3.5"/>
  <line x1="86" y1="142" x2="86" y2="168" stroke="url(#skullCyan)" stroke-width="2.5"/>
  <line x1="100" y1="142" x2="100" y2="168" stroke="url(#skullCyan)" stroke-width="2.5"/>
  <line x1="114" y1="142" x2="114" y2="168" stroke="url(#skullCyan)" stroke-width="2.5"/>
  <!-- Angular Glowing Eye Sockets -->
  <polygon points="68,82 90,86 82,106 66,98" fill="#f43f5e"/>
  <polygon points="132,82 110,86 118,106 134,98" fill="#f43f5e"/>
  <!-- Inverted Heart Nose Cavity -->
  <polygon points="100,112 92,128 108,128" fill="#22d3ee"/>
</svg>`
  },

  // 12. Futuristic VR Headset
  {
    id: 'yt-vr-headset',
    title: 'Metaverse VR Goggles',
    category: 'UI Icons',
    tags: 'vr, ar, headset, metaverse, virtual, gaming, 3d, future',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="vrVisor" x1="40" y1="70" x2="160" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#06b6d4"/>
      <stop offset="0.5" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <!-- Head Strap -->
  <rect x="25" y="94" width="22" height="16" rx="4" fill="#334155"/>
  <rect x="153" y="94" width="22" height="16" rx="4" fill="#334155"/>
  <!-- Main Chassis Mask -->
  <rect x="42" y="72" width="116" height="64" rx="20" fill="#0f172a" stroke="#475569" stroke-width="4"/>
  <!-- Curved Mirror Visor Screen -->
  <rect x="52" y="80" width="96" height="48" rx="14" fill="url(#vrVisor)"/>
  <!-- Specular Lens Glare -->
  <path d="M62 86 H112" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.6"/>
  <!-- Status LED Point -->
  <circle cx="140" cy="88" r="2.5" fill="#4ade80"/>
</svg>`
  },

  // 13. High-Tension Stopwatch Countdown Timer
  {
    id: 'yt-stopwatch-timer',
    title: 'Countdown Stopwatch',
    category: 'UI Icons',
    tags: 'stopwatch, timer, time, hurry, countdown, clock, fast, sports',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="watchBody" x1="40" y1="40" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.7" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Top Push Buttons -->
  <rect x="94" y="24" width="12" height="16" rx="3" fill="#cbd5e1"/>
  <rect x="88" y="20" width="24" height="6" rx="3" fill="#facc15"/>
  <rect x="134" y="38" width="10" height="12" rx="2" transform="rotate(45 134 38)" fill="#cbd5e1"/>
  <!-- Outer Casing -->
  <circle cx="100" cy="112" r="62" fill="url(#watchBody)" stroke="#e2e8f0" stroke-width="4"/>
  <circle cx="100" cy="112" r="50" fill="#0f172a"/>
  <!-- Dial Tick Marks -->
  <circle cx="100" cy="70" r="3" fill="#ef4444"/>
  <circle cx="142" cy="112" r="3" fill="#38bdf8"/>
  <circle cx="100" cy="154" r="3" fill="#38bdf8"/>
  <circle cx="58" cy="112" r="3" fill="#38bdf8"/>
  <!-- Tension Red Pointer Hand -->
  <line x1="100" y1="112" x2="128" y2="84" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
  <circle cx="100" cy="112" r="6" fill="#facc15"/>
</svg>`
  },

  // 14. Movie Clapperboard Director Board
  {
    id: 'yt-movie-clapper',
    title: 'Cinema Clapperboard',
    category: 'UI Icons',
    tags: 'movie, film, cinema, clapperboard, video, action, cut, production',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Bottom Main Board -->
  <rect x="35" y="80" width="130" height="90" rx="8" fill="#0f172a" stroke="#334155" stroke-width="3"/>
  <line x1="45" y1="110" x2="155" y2="110" stroke="#475569" stroke-width="2"/>
  <line x1="45" y1="140" x2="155" y2="140" stroke="#475569" stroke-width="2"/>
  <line x1="95" y1="110" x2="95" y2="160" stroke="#475569" stroke-width="2"/>
  <text x="50" y="102" font-size="12" font-weight="900" fill="#38bdf8">SCENE 01</text>
  <text x="50" y="132" font-size="11" font-weight="800" fill="#facc15">TAKE 03</text>
  <!-- Angled Clapper Top Stick -->
  <g transform="rotate(-14 35 75)">
    <rect x="35" y="52" width="130" height="24" rx="4" fill="#1e293b"/>
    <polygon points="50,52 65,52 45,76 35,76" fill="#f8fafc"/>
    <polygon points="80,52 95,52 75,76 60,76" fill="#f8fafc"/>
    <polygon points="110,52 125,52 105,76 90,76" fill="#f8fafc"/>
    <polygon points="140,52 155,52 135,76 120,76" fill="#f8fafc"/>
  </g>
</svg>`
  },

  // 15. Eye Scanner Analytics Tracker
  {
    id: 'yt-analytic-eye',
    title: 'Cyber View Scanner',
    category: 'UI Icons',
    tags: 'eye, view, views, watch, scan, analytics, audience, youtube',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="eyeIris" x1="80" y1="80" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <!-- Outer Eye Arc Contour -->
  <path d="M25 100 C55 55 145 55 175 100 C145 145 55 145 25 100 Z" stroke="#38bdf8" stroke-width="5" fill="#0f172a"/>
  <!-- Iris Circle -->
  <circle cx="100" cy="100" r="30" fill="url(#eyeIris)" stroke="#e0f2fe" stroke-width="2.5"/>
  <!-- Pupil -->
  <circle cx="100" cy="100" r="14" fill="#020617"/>
  <circle cx="94" cy="94" r="5" fill="#ffffff"/>
  <!-- Crosshair Reticle -->
  <line x1="100" y1="52" x2="100" y2="64" stroke="#f43f5e" stroke-width="3"/>
  <line x1="100" y1="136" x2="100" y2="148" stroke="#f43f5e" stroke-width="3"/>
  <line x1="52" y1="100" x2="64" y2="100" stroke="#f43f5e" stroke-width="3"/>
  <line x1="136" y1="100" x2="148" y2="100" stroke="#f43f5e" stroke-width="3"/>
</svg>`
  },

  // 16. Viral Fire Trend Flame
  {
    id: 'yt-fire-trend',
    title: 'Viral Trending Flame',
    category: 'Badges & Stickers',
    tags: 'fire, flame, trend, trending, hot, viral, heat, youtube',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="viralFire" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f97316"/>
      <stop offset="0.5" stop-color="#ef4444"/>
      <stop offset="1" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <!-- Outer Flame Body -->
  <path d="M100 24 C118 64 148 88 148 128 C148 160 126 178 100 178 C74 178 52 160 52 128 C52 98 84 80 84 48 Z" fill="url(#viralFire)"/>
  <!-- Inner Yellow Flame -->
  <path d="M100 68 C112 94 130 114 130 138 C130 162 116 172 100 172 C84 172 70 162 70 138 C70 118 90 102 90 84 Z" fill="#facc15"/>
  <!-- Core White Specular -->
  <path d="M100 112 C108 126 116 138 116 150 C116 162 108 166 100 166 C92 166 84 162 84 150 C84 138 94 126 100 112 Z" fill="#ffffff"/>
</svg>`
  },

  // 17. 3D Megaphone Loudspeaker
  {
    id: 'yt-megaphone',
    title: 'Marketing Megaphone',
    category: '3D Elements',
    tags: 'megaphone, speaker, announce, marketing, sound, shout, promotion',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="hornGrad" x1="60" y1="60" x2="150" y2="140" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f43f5e"/>
      <stop offset="0.6" stop-color="#e11d48"/>
      <stop offset="1" stop-color="#881337"/>
    </linearGradient>
  </defs>
  <!-- Handle -->
  <path d="M72 124 L62 165 C60 172 68 176 74 172 L84 134 Z" fill="#475569"/>
  <!-- Horn Body -->
  <polygon points="55,84 135,52 135,148 55,116" fill="url(#hornGrad)"/>
  <!-- Back Cylinder -->
  <rect x="36" y="86" width="22" height="28" rx="6" fill="#38bdf8"/>
  <!-- Front Horn Bell Ring -->
  <ellipse cx="135" cy="100" rx="14" ry="48" fill="#e11d48" stroke="#facc15" stroke-width="4"/>
  <!-- Sound Blast Beams -->
  <path d="M158 80 C168 90 168 110 158 120" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <path d="M174 68 C190 85 190 115 174 132" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
</svg>`
  },

  // 18. Target Bullseye with Arrow Hit
  {
    id: 'yt-target-bullseye',
    title: 'Goal Bullseye Arrow',
    category: 'UI Icons',
    tags: 'target, bullseye, arrow, goal, success, accuracy, focus',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Concentric Target Circles -->
  <circle cx="95" cy="105" r="70" fill="#ef4444"/>
  <circle cx="95" cy="105" r="54" fill="#ffffff"/>
  <circle cx="95" cy="105" r="38" fill="#ef4444"/>
  <circle cx="95" cy="105" r="22" fill="#ffffff"/>
  <circle cx="95" cy="105" r="10" fill="#ef4444"/>
  <!-- Arrow Shaft Hitting Center -->
  <line x1="165" y1="35" x2="95" y2="105" stroke="#facc15" stroke-width="6" stroke-linecap="round"/>
  <!-- Arrow Fletching Feathers -->
  <polygon points="160,30 175,25 170,40" fill="#f97316"/>
  <polygon points="160,50 175,45 150,55" fill="#f97316"/>
  <circle cx="95" cy="105" r="4" fill="#ffffff"/>
</svg>`
  },

  // 19. Chess King Piece (Grand Strategy)
  {
    id: 'yt-chess-king',
    title: 'Strategic Chess King',
    category: '3D Elements',
    tags: 'chess, king, strategy, game, tactics, mastermind, checkmate',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="kingGold" x1="60" y1="40" x2="140" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.4" stop-color="#eab308"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Top Cross -->
  <line x1="100" y1="26" x2="100" y2="46" stroke="#fef08a" stroke-width="5" stroke-linecap="round"/>
  <line x1="90" y1="36" x2="110" y2="36" stroke="#fef08a" stroke-width="5" stroke-linecap="round"/>
  <!-- Crown Head -->
  <ellipse cx="100" cy="52" rx="20" ry="8" fill="#eab308"/>
  <!-- Pillar Column -->
  <path d="M84 56 C80 90 70 125 64 148 H136 C130 125 120 90 116 56 Z" fill="url(#kingGold)"/>
  <!-- Mid-collar Ring -->
  <ellipse cx="100" cy="74" rx="24" ry="6" fill="#fde047"/>
  <!-- Base Pedestal -->
  <rect x="52" y="148" width="96" height="14" rx="4" fill="#ca8a04"/>
  <rect x="42" y="162" width="116" height="14" rx="5" fill="url(#kingGold)"/>
</svg>`
  },

  // 20. Chess Knight Piece (Tactical Pivot)
  {
    id: 'yt-chess-knight',
    title: 'Tactical Chess Knight',
    category: '3D Elements',
    tags: 'chess, knight, horse, tactics, plan, game, strategy, piece',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="knightWood" x1="50" y1="40" x2="150" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0c4a6e"/>
    </linearGradient>
  </defs>
  <!-- Horse Head Contour -->
  <path d="M72 152 C70 125 58 105 58 84 C58 64 74 44 98 44 C116 44 126 56 122 72 C134 76 148 86 144 102 C136 106 126 104 120 98 C116 112 122 135 128 152 Z" fill="url(#knightWood)"/>
  <!-- Snout & Mouth -->
  <polygon points="144,102 126,104 132,112 144,106" fill="#0369a1"/>
  <!-- Eye -->
  <circle cx="104" cy="68" r="4.5" fill="#facc15"/>
  <!-- Mane Ridges -->
  <path d="M76 56 L64 68" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  <path d="M68 76 L56 88" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  <!-- Base Pedestal -->
  <rect x="52" y="152" width="96" height="14" rx="4" fill="#0369a1"/>
  <rect x="44" y="166" width="112" height="12" rx="4" fill="url(#knightWood)"/>
</svg>`
  },

  // 21. Mountain Peak with Victory Flag
  {
    id: 'yt-peak-flag',
    title: 'Summit Victory Flag',
    category: 'Illustrations',
    tags: 'mountain, summit, peak, flag, victory, win, goal, achievement',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="mtnGrad" x1="100" y1="50" x2="100" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#475569"/>
      <stop offset="0.7" stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Main Mountain Silhouette -->
  <polygon points="100,52 175,175 25,175" fill="url(#mtnGrad)"/>
  <!-- Snow Cap Peak -->
  <polygon points="100,52 125,92 110,86 100,94 90,86 75,92" fill="#ffffff"/>
  <!-- Secondary Shadow Ridge -->
  <polygon points="100,52 175,175 100,175" fill="#0f172a" fill-opacity="0.35"/>
  <!-- Flagpole & Red Flag -->
  <line x1="100" y1="22" x2="100" y2="52" stroke="#facc15" stroke-width="3.5" stroke-linecap="round"/>
  <polygon points="100,24 135,34 100,44" fill="#ef4444"/>
</svg>`
  },

  // 22. Lightbulb Innovation Idea
  {
    id: 'yt-idea-lightbulb',
    title: 'Eureka Idea Lightbulb',
    category: 'UI Icons',
    tags: 'lightbulb, idea, genius, think, brain, invent, electric, yellow',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <radialGradient id="bulbGlow" cx="100" cy="80" r="55" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#fef08a"/>
      <stop offset="0.8" stop-color="#facc15"/>
      <stop offset="1" stop-color="#eab308"/>
    </radialGradient>
  </defs>
  <!-- Radiant Rays -->
  <line x1="100" y1="18" x2="100" y2="28" stroke="#facc15" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="152" y1="42" x2="144" y2="50" stroke="#facc15" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="48" y1="42" x2="56" y2="50" stroke="#facc15" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Glass Bulb Head -->
  <path d="M100 35 C70 35 52 56 52 82 C52 104 68 116 74 130 H126 C132 116 148 104 148 82 C148 56 130 35 100 35 Z" fill="url(#bulbGlow)"/>
  <!-- Filament Wire -->
  <path d="M86 95 L94 72 L106 72 L114 95" stroke="#ca8a04" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Screw Base -->
  <rect x="78" y="134" width="44" height="8" rx="3" fill="#94a3b8"/>
  <rect x="82" y="145" width="36" height="8" rx="3" fill="#64748b"/>
  <rect x="88" y="156" width="24" height="6" rx="3" fill="#334155"/>
</svg>`
  },

  // 23. Warning Hazard Triangle
  {
    id: 'yt-warning-hazard',
    title: 'Critical Warning Triangle',
    category: 'Badges & Stickers',
    tags: 'warning, alert, danger, hazard, caution, risk, error, yellow',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="warnYellow" x1="100" y1="30" x2="100" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.6" stop-color="#facc15"/>
      <stop offset="1" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <!-- Outer Triangle -->
  <polygon points="100,28 178,165 22,165" fill="url(#warnYellow)" stroke="#ca8a04" stroke-width="5" stroke-linejoin="round"/>
  <!-- Exclamation Mark -->
  <rect x="94" y="68" width="12" height="48" rx="6" fill="#0f172a"/>
  <circle cx="100" cy="136" r="7" fill="#0f172a"/>
</svg>`
  },

  // 24. Radioactive Nuclear Symbol
  {
    id: 'yt-radioactive',
    title: 'Nuclear Hazard Core',
    category: 'UI Icons',
    tags: 'nuclear, radioactive, toxic, hazard, danger, power, energy, atom',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <circle cx="100" cy="100" r="75" fill="#facc15"/>
  <!-- Center Core Dot -->
  <circle cx="100" cy="100" r="16" fill="#0f172a"/>
  <!-- 3 Trefoil Blades -->
  <path d="M100 100 L80 45 A62 62 0 0 1 120 45 Z" fill="#0f172a"/>
  <path d="M100 100 L148 128 A62 62 0 0 1 128 162 Z" fill="#0f172a"/>
  <path d="M100 100 L52 128 A62 62 0 0 0 72 162 Z" fill="#0f172a"/>
  <circle cx="100" cy="100" r="75" stroke="#ca8a04" stroke-width="4" fill="none"/>
</svg>`
  },

  // 25. Broken Chain Link (Breaking Freedom)
  {
    id: 'yt-broken-chain',
    title: 'Broken Freedom Chain',
    category: 'Illustrations',
    tags: 'chain, break, freedom, unlock, prisoner, escape, power, motion',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="chainSteel" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#cbd5e1"/>
      <stop offset="0.6" stop-color="#64748b"/>
      <stop offset="1" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <!-- Left Intact Link -->
  <rect x="25" y="80" width="60" height="40" rx="18" fill="none" stroke="url(#chainSteel)" stroke-width="12"/>
  <!-- Right Intact Link -->
  <rect x="115" y="80" width="60" height="40" rx="18" fill="none" stroke="url(#chainSteel)" stroke-width="12"/>
  <!-- Snapped Center Broken Halves -->
  <path d="M85 86 L98 72" stroke="#f43f5e" stroke-width="12" stroke-linecap="round"/>
  <path d="M115 114 L102 128" stroke="#f43f5e" stroke-width="12" stroke-linecap="round"/>
  <!-- Sparks of Breakage -->
  <circle cx="100" cy="92" r="3.5" fill="#facc15"/>
  <circle cx="108" cy="80" r="2.5" fill="#facc15"/>
  <circle cx="92" cy="108" r="2.5" fill="#facc15"/>
</svg>`
  },

  // 26. Interlocking Gears of Progress
  {
    id: 'yt-cogs-gears',
    title: 'Cogs Engine Gears',
    category: 'UI Icons',
    tags: 'gears, cogs, machine, system, work, engine, settings, progress',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gearBlue" x1="30" y1="30" x2="130" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="gearGold" x1="100" y1="90" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#facc15"/>
      <stop offset="1" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Big Gear -->
  <circle cx="80" cy="80" r="44" fill="url(#gearBlue)"/>
  <rect x="74" y="28" width="12" height="104" rx="3" fill="url(#gearBlue)"/>
  <rect x="28" y="74" width="104" height="12" rx="3" fill="url(#gearBlue)"/>
  <rect x="74" y="28" width="12" height="104" rx="3" transform="rotate(45 80 80)" fill="url(#gearBlue)"/>
  <rect x="74" y="28" width="12" height="104" rx="3" transform="rotate(-45 80 80)" fill="url(#gearBlue)"/>
  <circle cx="80" cy="80" r="20" fill="#0f172a"/>
  <!-- Small Interlocking Gear -->
  <circle cx="138" cy="132" r="30" fill="url(#gearGold)"/>
  <rect x="133" y="96" width="10" height="72" rx="2" fill="url(#gearGold)"/>
  <rect x="102" y="127" width="72" height="10" rx="2" fill="url(#gearGold)"/>
  <circle cx="138" cy="132" r="14" fill="#0f172a"/>
</svg>`
  },

  // 27. Golden Trophy 1st Place Podium
  {
    id: 'yt-podium-stand',
    title: 'Victory 1st Place Podium',
    category: 'Awards',
    tags: 'podium, 1st, victory, winner, gold, champion, rank, awards',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- 2nd Place Block -->
  <rect x="25" y="105" width="46" height="65" rx="4" fill="#475569"/>
  <text x="43" y="142" font-size="20" font-weight="900" fill="#ffffff">2</text>
  <!-- 1st Place Center Block -->
  <rect x="75" y="75" width="50" height="95" rx="5" fill="#f59e0b" stroke="#fde047" stroke-width="2"/>
  <text x="93" y="120" font-size="26" font-weight="900" fill="#78350f">1</text>
  <!-- 3rd Place Block -->
  <rect x="129" y="120" width="46" height="50" rx="4" fill="#64748b"/>
  <text x="147" y="152" font-size="18" font-weight="900" fill="#ffffff">3</text>
  <!-- Floating Star above 1st -->
  <polygon points="100,38 105,52 120,52 108,62 112,76 100,66 88,76 92,62 80,52 95,52" fill="#facc15"/>
</svg>`
  },

  // 28. Speedometer Max Tachometer
  {
    id: 'yt-speedometer',
    title: 'Overdrive Speedometer',
    category: 'UI Icons',
    tags: 'speed, fast, speedometer, gauge, tachometer, turbo, rush, rapid',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Gauge Arc Background -->
  <path d="M40 140 A68 68 0 1 1 160 140" stroke="#334155" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Active High Speed Arc -->
  <path d="M100 32 A68 68 0 0 1 160 140" stroke="#f43f5e" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M40 140 A68 68 0 0 1 100 32" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Needle in Overdrive Redline -->
  <line x1="100" y1="120" x2="148" y2="72" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="100" cy="120" r="10" fill="#f43f5e" stroke="#ffffff" stroke-width="2"/>
</svg>`
  },

  // 29. Holographic Credit Card
  {
    id: 'yt-credit-card',
    title: 'Titanium Black Card',
    category: '3D Elements',
    tags: 'card, credit, bank, payment, visa, mastercard, luxury, finance',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cardDark" x1="25" y1="45" x2="175" y2="155" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="0.6" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <!-- Card Rectangle -->
  <rect x="25" y="55" width="150" height="92" rx="14" fill="url(#cardDark)" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Gold Smart Chip -->
  <rect x="45" y="80" width="26" height="20" rx="4" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>
  <!-- Magnetic Stripe / Details -->
  <rect x="45" y="118" width="60" height="6" rx="2" fill="#64748b"/>
  <!-- Contactless NFC Wave -->
  <path d="M80 82 C84 86 84 94 80 98" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Dual Circles Logo (Mastercard Style) -->
  <circle cx="140" cy="120" r="10" fill="#ef4444" fill-opacity="0.8"/>
  <circle cx="152" cy="120" r="10" fill="#f59e0b" fill-opacity="0.8"/>
</svg>`
  },

  // 30. Golden Crown with Laurel Wreath
  {
    id: 'yt-laurel-wreath',
    title: 'Victory Laurel Wreath',
    category: 'Awards',
    tags: 'laurel, wreath, victory, crown, roman, champion, gold, honor',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="laurelGold" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.5" stop-color="#facc15"/>
      <stop offset="1" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Center Star -->
  <polygon points="100,56 105,70 120,70 108,80 112,94 100,84 88,94 92,80 80,70 95,70" fill="#ffffff"/>
  <!-- Left Laurel Leaves Branch -->
  <path d="M96 160 C55 155 35 120 45 75" stroke="url(#laurelGold)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="45" cy="85" rx="10" ry="5" transform="rotate(-30 45 85)" fill="url(#laurelGold)"/>
  <ellipse cx="42" cy="108" rx="10" ry="5" transform="rotate(-15 42 108)" fill="url(#laurelGold)"/>
  <ellipse cx="50" cy="130" rx="10" ry="5" transform="rotate(10 50 130)" fill="url(#laurelGold)"/>
  <ellipse cx="68" cy="148" rx="10" ry="5" transform="rotate(35 68 148)" fill="url(#laurelGold)"/>
  <!-- Right Laurel Leaves Branch -->
  <path d="M104 160 C145 155 165 120 155 75" stroke="url(#laurelGold)" stroke-width="4.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="155" cy="85" rx="10" ry="5" transform="rotate(30 155 85)" fill="url(#laurelGold)"/>
  <ellipse cx="158" cy="108" rx="10" ry="5" transform="rotate(15 158 108)" fill="url(#laurelGold)"/>
  <ellipse cx="150" cy="130" rx="10" ry="5" transform="rotate(-10 150 130)" fill="url(#laurelGold)"/>
  <ellipse cx="132" cy="148" rx="10" ry="5" transform="rotate(-35 132 148)" fill="url(#laurelGold)"/>
</svg>`
  },

  // 31. Supercharged 100% Battery
  {
    id: 'yt-turbo-battery',
    title: 'Supercharged Battery',
    category: 'UI Icons',
    tags: 'battery, energy, charge, power, turbo, boost, green, 100',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Terminal Cap -->
  <rect x="174" y="88" width="10" height="24" rx="4" fill="#94a3b8"/>
  <!-- Outer Shell -->
  <rect x="22" y="60" width="152" height="80" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
  <!-- Full Charge Bars -->
  <rect x="32" y="70" width="30" height="60" rx="6" fill="#22c55e"/>
  <rect x="68" y="70" width="30" height="60" rx="6" fill="#22c55e"/>
  <rect x="104" y="70" width="30" height="60" rx="6" fill="#22c55e"/>
  <rect x="140" y="70" width="24" height="60" rx="6" fill="#4ade80"/>
  <!-- Lightning Bolt Overload -->
  <polygon points="108,68 84,104 102,104 92,132 116,96 98,96" fill="#facc15"/>
</svg>`
  },

  // 32. Golden Key of Success
  {
    id: 'yt-master-key',
    title: 'Master Golden Key',
    category: 'UI Icons',
    tags: 'key, unlock, secret, access, password, master, success, gold',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="keyGold" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.5" stop-color="#facc15"/>
      <stop offset="1" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Bow Handle Head -->
  <circle cx="68" cy="74" r="28" fill="none" stroke="url(#keyGold)" stroke-width="10"/>
  <circle cx="68" cy="74" r="12" fill="url(#keyGold)"/>
  <!-- Shaft -->
  <line x1="88" y1="94" x2="155" y2="161" stroke="url(#keyGold)" stroke-width="10" stroke-linecap="round"/>
  <!-- Bit Teeth -->
  <line x1="140" y1="146" x2="152" y2="134" stroke="url(#keyGold)" stroke-width="9" stroke-linecap="round"/>
  <line x1="154" y1="160" x2="168" y2="146" stroke="url(#keyGold)" stroke-width="9" stroke-linecap="round"/>
</svg>`
  },

  // 33. Cloud Database Sync with Lightning
  {
    id: 'yt-cloud-sync',
    title: 'Cloud Data Sync',
    category: 'Brand Logos',
    tags: 'cloud, sync, database, upload, storage, network, lightning, tech',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cloudBlue" x1="50" y1="60" x2="150" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.7" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <!-- Fluffy Vector Cloud -->
  <path d="M68 140 C44 140 28 124 28 104 C28 86 42 72 60 70 C68 46 92 35 116 42 C134 46 148 62 150 78 C166 82 176 96 176 112 C176 128 162 140 144 140 Z" fill="url(#cloudBlue)"/>
  <!-- High Speed Arrow / Lightning -->
  <path d="M100 80 V124 M100 80 L84 96 M100 80 L116 96" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },

  // 34. Scales of Justice & Law
  {
    id: 'yt-scales-justice',
    title: 'Scales of Truth',
    category: 'Illustrations',
    tags: 'scales, justice, law, court, balance, judge, legal, ethics',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Central Column -->
  <line x1="100" y1="45" x2="100" y2="165" stroke="#facc15" stroke-width="6"/>
  <!-- Balance Beam -->
  <line x1="42" y1="65" x2="158" y2="65" stroke="#facc15" stroke-width="5" stroke-linecap="round"/>
  <!-- Left Pan -->
  <line x1="42" y1="65" x2="28" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <line x1="42" y1="65" x2="56" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <path d="M22 110 C22 126 62 126 62 110 Z" fill="#facc15"/>
  <!-- Right Pan -->
  <line x1="158" y1="65" x2="144" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <line x1="158" y1="65" x2="172" y2="110" stroke="#94a3b8" stroke-width="2"/>
  <path d="M138 110 C138 126 178 126 178 110 Z" fill="#facc15"/>
  <!-- Base Pedestal -->
  <rect x="70" y="165" width="60" height="12" rx="4" fill="#ca8a04"/>
</svg>`
  },

  // 35. 3D Lock of Cybersecurity
  {
    id: 'yt-cyber-padlock',
    title: 'Cyber Vault Padlock',
    category: '3D Elements',
    tags: 'lock, padlock, security, cyber, password, safe, privacy, shield',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="lockBody" x1="40" y1="80" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.7" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Hardened Steel Shackle -->
  <path d="M68 90 V55 C68 36 82 24 100 24 C118 24 132 36 132 55 V90" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round" fill="none"/>
  <!-- Heavy Padlock Body -->
  <rect x="44" y="82" width="112" height="88" rx="20" fill="url(#lockBody)" stroke="#38bdf8" stroke-width="3"/>
  <!-- Glowing Keyhole -->
  <circle cx="100" cy="118" r="9" fill="#020617"/>
  <polygon points="96,118 104,118 106,138 94,138" fill="#020617"/>
  <circle cx="100" cy="118" r="5" fill="#facc15"/>
</svg>`
  },

  // 36. Satellite Communications Orbit
  {
    id: 'yt-satellite-dish',
    title: 'Satellite Uplink Array',
    category: 'Illustrations',
    tags: 'satellite, space, uplink, broadcast, antenna, signal, radar',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Parabolic Dish Body -->
  <path d="M50 145 C65 100 115 65 160 55 C150 100 100 150 50 145 Z" fill="#334155" stroke="#38bdf8" stroke-width="3"/>
  <!-- Feed Horn Rod -->
  <line x1="105" y1="100" x2="135" y2="130" stroke="#facc15" stroke-width="4"/>
  <circle cx="138" cy="133" r="6" fill="#ef4444"/>
  <!-- Mount Tripod Stand -->
  <line x1="55" y1="140" x2="35" y2="175" stroke="#64748b" stroke-width="5"/>
  <line x1="75" y1="145" x2="85" y2="175" stroke="#64748b" stroke-width="5"/>
  <!-- Radio Waves Broadcast -->
  <path d="M155 45 C170 60 170 85 155 100" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M170 30 C195 55 195 95 170 120" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`
  },

  // 37. On-Air Live Broadcast Sign
  {
    id: 'yt-live-onair',
    title: 'On-Air Studio Broadcast',
    category: 'Badges & Stickers',
    tags: 'live, onair, stream, streaming, studio, broadcast, mic, red',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Rounded Badge -->
  <rect x="25" y="65" width="150" height="70" rx="16" fill="#ef4444" stroke="#ffffff" stroke-width="4"/>
  <!-- Pulsing Live Dot -->
  <circle cx="56" cy="100" r="10" fill="#ffffff"/>
  <circle cx="56" cy="100" r="6" fill="#ef4444"/>
  <!-- LIVE Text -->
  <text x="78" y="109" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="2">LIVE</text>
</svg>`
  },

  // 38. Viral Share Infinity Network Loop
  {
    id: 'yt-infinity-share',
    title: 'Infinity Loop Network',
    category: 'Brand Logos',
    tags: 'infinity, loop, share, viral, connections, endless, node, flow',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="infGrad" x1="30" y1="70" x2="170" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <path d="M65 72 C42 72 26 86 26 100 C26 114 42 128 65 128 C88 128 112 100 135 100 C158 100 174 114 174 100 C174 86 158 72 135 72 C112 72 88 100 65 100" stroke="url(#infGrad)" stroke-width="14" stroke-linecap="round" fill="none"/>
  <!-- Network Node Dots -->
  <circle cx="65" cy="100" r="8" fill="#ffffff"/>
  <circle cx="100" cy="100" r="8" fill="#ffffff"/>
  <circle cx="135" cy="100" r="8" fill="#ffffff"/>
</svg>`
  },

  // 39. Executive VIP Briefcase
  {
    id: 'yt-vip-briefcase',
    title: 'Executive VIP Briefcase',
    category: 'UI Icons',
    tags: 'briefcase, executive, business, work, money, deal, corporate, suitcase',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="caseLeather" x1="40" y1="70" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#334155"/>
      <stop offset="0.6" stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Handle -->
  <path d="M80 70 V52 C80 46 86 42 92 42 H108 C114 42 120 46 120 52 V70" stroke="#facc15" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Main Case -->
  <rect x="35" y="70" width="130" height="95" rx="14" fill="url(#caseLeather)" stroke="#475569" stroke-width="3.5"/>
  <!-- Gold Straps & Locks -->
  <rect x="62" y="70" width="8" height="95" fill="#facc15"/>
  <rect x="130" y="70" width="8" height="95" fill="#facc15"/>
  <rect x="58" y="100" width="16" height="12" rx="3" fill="#ffffff"/>
  <rect x="126" y="100" width="16" height="12" rx="3" fill="#ffffff"/>
</svg>`
  },

  // 40. Solving the Maze Brain Labyrinth
  {
    id: 'yt-maze-solution',
    title: 'Labyrinth Brain Riddle',
    category: 'Illustrations',
    tags: 'maze, labyrinth, puzzle, problem, solve, solution, strategy, smart',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Concentric Maze Rings -->
  <rect x="30" y="30" width="140" height="140" rx="18" stroke="#38bdf8" stroke-width="4.5" fill="#0f172a"/>
  <rect x="50" y="50" width="100" height="100" rx="12" stroke="#64748b" stroke-width="4"/>
  <rect x="70" y="70" width="60" height="60" rx="8" stroke="#38bdf8" stroke-width="4"/>
  <!-- Center Goal Core -->
  <circle cx="100" cy="100" r="10" fill="#f43f5e"/>
  <!-- Maze Openings & Pathway -->
  <rect x="88" y="26" width="24" height="8" fill="#0f172a"/>
  <rect x="146" y="88" width="8" height="24" fill="#0f172a"/>
  <rect x="88" y="146" width="24" height="8" fill="#0f172a"/>
</svg>`
  },

  // 41. Golden Microphone Podcast
  {
    id: 'yt-vintage-mic',
    title: 'Studio Vintage Mic',
    category: 'UI Icons',
    tags: 'microphone, podcast, audio, vocal, music, radio, sound, record',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="micGrad" x1="75" y1="35" x2="125" y2="115" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.6" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Capsule Head -->
  <rect x="75" y="32" width="50" height="80" rx="25" fill="url(#micGrad)" stroke="#fde047" stroke-width="3"/>
  <line x1="75" y1="62" x2="125" y2="62" stroke="#78350f" stroke-width="2.5"/>
  <line x1="75" y1="82" x2="125" y2="82" stroke="#78350f" stroke-width="2.5"/>
  <!-- U-Shaped Cradle Stand -->
  <path d="M60 76 V95 C60 120 80 134 100 134 C120 134 140 120 140 95 V76" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round" fill="none"/>
  <!-- Stem & Base -->
  <line x1="100" y1="134" x2="100" y2="165" stroke="#e2e8f0" stroke-width="8"/>
  <rect x="65" y="165" width="70" height="12" rx="4" fill="#64748b"/>
</svg>`
  },

  // 42. Verified Blue Checkmark Badge
  {
    id: 'yt-verified-badge',
    title: 'Official Verified Starburst',
    category: 'Badges & Stickers',
    tags: 'verified, badge, checkmark, authentic, official, trust, proof, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="verifyCyan" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.6" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <!-- 12-Point Scalloped Starburst Seal -->
  <path d="M100 25 L118 36 L139 33 L149 49 L169 58 L168 79 L180 96 L168 113 L169 134 L149 143 L139 159 L118 156 L100 167 L82 156 L61 159 L51 143 L31 134 L32 113 L20 96 L32 79 L31 58 L51 49 L61 33 L82 36 Z" fill="url(#verifyCyan)"/>
  <!-- Thick White Checkmark -->
  <path d="M68 98 L90 120 L136 74" stroke="#ffffff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },

  // 43. 3D Question Mark Curiosity Mark
  {
    id: 'yt-question-mark',
    title: 'Curiosity Question Mark',
    category: '3D Elements',
    tags: 'question, ask, mystery, why, curiosity, solve, quiz, help',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="qMarkGrad" x1="60" y1="30" x2="140" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#c084fc"/>
      <stop offset="0.6" stop-color="#a855f7"/>
      <stop offset="1" stop-color="#6b21a8"/>
    </linearGradient>
  </defs>
  <!-- Curved Upper Hook -->
  <path d="M65 65 C65 42 80 28 100 28 C122 28 138 44 138 65 C138 82 124 94 112 104 C104 112 100 120 100 132" stroke="url(#qMarkGrad)" stroke-width="18" stroke-linecap="round" fill="none"/>
  <!-- Lower Dot -->
  <circle cx="100" cy="162" r="10" fill="#a855f7"/>
</svg>`
  },

  // 44. Retro Vintage Film Reel
  {
    id: 'yt-film-reel',
    title: 'Cinema Celluloid Reel',
    category: 'UI Icons',
    tags: 'film, reel, cinema, movie, celluloid, tape, tape, record',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Wheel -->
  <circle cx="100" cy="100" r="74" fill="#334155" stroke="#94a3b8" stroke-width="6"/>
  <!-- Inner Cutout Circle -->
  <circle cx="100" cy="100" r="62" fill="#0f172a"/>
  <!-- Circular Film Holes -->
  <circle cx="100" cy="55" r="14" fill="#334155"/>
  <circle cx="138" cy="80" r="14" fill="#334155"/>
  <circle cx="138" cy="120" r="14" fill="#334155"/>
  <circle cx="100" cy="145" r="14" fill="#334155"/>
  <circle cx="62" cy="120" r="14" fill="#334155"/>
  <circle cx="62" cy="80" r="14" fill="#334155"/>
  <!-- Center Spindle Pin -->
  <circle cx="100" cy="100" r="18" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
</svg>`
  },

  // 45. Target Sniper Reticle Crosshair
  {
    id: 'yt-sniper-crosshair',
    title: 'Sniper Precision Reticle',
    category: 'UI Icons',
    tags: 'sniper, crosshair, aim, target, precision, scope, fps, shooter',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Ring -->
  <circle cx="100" cy="100" r="72" stroke="#ef4444" stroke-width="4.5"/>
  <circle cx="100" cy="100" r="42" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 6"/>
  <!-- Crosshairs -->
  <line x1="20" y1="100" x2="80" y2="100" stroke="#ef4444" stroke-width="4"/>
  <line x1="120" y1="100" x2="180" y2="100" stroke="#ef4444" stroke-width="4"/>
  <line x1="100" y1="20" x2="100" y2="80" stroke="#ef4444" stroke-width="4"/>
  <line x1="100" y1="120" x2="100" y2="180" stroke="#ef4444" stroke-width="4"/>
  <!-- Center Dot -->
  <circle cx="100" cy="100" r="4" fill="#ef4444"/>
</svg>`
  },

  // 46. 3D Notification Heart Bubble
  {
    id: 'yt-heart-bubble',
    title: 'Social Heart Pop Bubble',
    category: 'Badges & Stickers',
    tags: 'heart, like, love, notification, bubble, instagram, viral, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="heartBubble" x1="30" y1="30" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f43f5e"/>
      <stop offset="0.6" stop-color="#e11d48"/>
      <stop offset="1" stop-color="#9f1239"/>
    </linearGradient>
  </defs>
  <!-- Rounded Chat Bubble Body -->
  <rect x="25" y="32" width="150" height="120" rx="32" fill="url(#heartBubble)"/>
  <polygon points="100,168 85,150 115,150" fill="#e11d48"/>
  <!-- Gloss Top Arc -->
  <rect x="35" y="38" width="130" height="40" rx="20" fill="#ffffff" fill-opacity="0.2"/>
  <!-- Pure White Heart -->
  <path d="M100 82 C90 62 65 64 65 88 C65 112 100 134 100 134 C100 134 135 112 135 88 C135 64 110 62 100 82 Z" fill="#ffffff"/>
</svg>`
  },

  // 47. Stage Spotlight Cone
  {
    id: 'yt-spotlight-beam',
    title: 'Stage Spotlight Beam',
    category: 'Illustrations',
    tags: 'spotlight, light, beam, show, stage, actor, performance, cinema',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="lightCone" x1="100" y1="40" x2="100" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a" stop-opacity="0.75"/>
      <stop offset="0.6" stop-color="#fde047" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#fde047" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Luminaire Fixture -->
  <rect x="80" y="24" width="40" height="20" rx="4" fill="#334155"/>
  <ellipse cx="100" cy="44" rx="24" ry="8" fill="#fef08a"/>
  <!-- Light Beam Cone -->
  <polygon points="76,44 124,44 175,180 25,180" fill="url(#lightCone)"/>
  <!-- Floor Highlight Ellipse -->
  <ellipse cx="100" cy="180" rx="75" ry="12" fill="#fde047" fill-opacity="0.4"/>
</svg>`
  },

  // 48. Speed Warp Energy Portal
  {
    id: 'yt-warp-portal',
    title: 'Quantum Warp Vortex',
    category: 'Illustrations',
    tags: 'portal, warp, vortex, tunnel, speed, travel, dimension, sci-fi',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Concentric Spiraling Ellipses -->
  <ellipse cx="100" cy="100" rx="80" ry="40" stroke="#06b6d4" stroke-width="4.5" transform="rotate(15 100 100)"/>
  <ellipse cx="100" cy="100" rx="64" ry="32" stroke="#8b5cf6" stroke-width="4" transform="rotate(-25 100 100)"/>
  <ellipse cx="100" cy="100" rx="48" ry="24" stroke="#ec4899" stroke-width="3.5" transform="rotate(45 100 100)"/>
  <ellipse cx="100" cy="100" rx="32" ry="16" stroke="#facc15" stroke-width="3" transform="rotate(-65 100 100)"/>
  <circle cx="100" cy="100" r="12" fill="#ffffff"/>
</svg>`
  },

  // 49. Cybernetic Bionic Hand
  {
    id: 'yt-bionic-hand',
    title: 'Cybernetic Robotic Hand',
    category: 'Illustrations',
    tags: 'robot, cyborg, hand, arm, bionic, mechanical, touch, future',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Wrist Forearm Section -->
  <rect x="80" y="142" width="40" height="42" rx="8" fill="#334155" stroke="#38bdf8" stroke-width="3"/>
  <!-- Palm Joint Plate -->
  <path d="M68 96 H132 V142 H68 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <!-- Mechanical Finger Segments -->
  <rect x="62" y="42" width="12" height="50" rx="6" fill="#64748b"/>
  <rect x="78" y="32" width="12" height="60" rx="6" fill="#94a3b8"/>
  <rect x="94" y="28" width="12" height="64" rx="6" fill="#cbd5e1"/>
  <rect x="110" y="34" width="12" height="58" rx="6" fill="#94a3b8"/>
  <rect x="126" y="52" width="12" height="40" rx="6" fill="#64748b"/>
  <!-- Glowing Synaptic Knuckle Nodes -->
  <circle cx="68" cy="92" r="3.5" fill="#38bdf8"/>
  <circle cx="84" cy="92" r="3.5" fill="#38bdf8"/>
  <circle cx="100" cy="92" r="3.5" fill="#38bdf8"/>
  <circle cx="116" cy="92" r="3.5" fill="#38bdf8"/>
  <circle cx="132" cy="92" r="3.5" fill="#38bdf8"/>
</svg>`
  },

  // 50. Cyber Shield of Invulnerability
  {
    id: 'yt-hyper-shield',
    title: 'Hyperdrive Cyber Shield',
    category: 'Badges & Stickers',
    tags: 'shield, defense, security, cyber, neon, safe, armor, badge',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="hyperShield" x1="40" y1="30" x2="160" y2="175" gradientUnits="userSpaceOnUse">
      <stop stop-color="#06b6d4"/>
      <stop offset="0.5" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <!-- Outer Neon Bevel Shield -->
  <path d="M100 26 C144 26 168 50 168 96 C168 144 100 176 100 176 C100 176 32 144 32 96 C32 50 56 26 100 26 Z" fill="url(#hyperShield)" stroke="#67e8f9" stroke-width="4.5"/>
  <!-- Inner Faceted Core -->
  <path d="M100 48 C128 48 145 66 145 100 C145 132 100 156 100 156 C100 156 55 132 55 100 C55 66 72 48 100 48 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Central Glowing Vector Star -->
  <polygon points="100,74 107,92 125,92 111,104 116,122 100,111 84,122 89,104 75,92 93,92" fill="#67e8f9"/>
</svg>`
  }
];
