import fs from 'fs';

const SVG_ASSET_ITEMS = [
  // --- 1 to 10: Cyber & Tech & UI Icons ---
  {
    id: 'elem-ai-neural-core',
    title: 'AI Neural Core Processor',
    category: 'Cyber & Tech',
    tags: 'ai, neural network, cpu, processor, chip, tech, cyber, silicon, brain',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="aiChipBg" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="aiCoreGlow" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#c084fc"/>
    </linearGradient>
    <filter id="aiGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Outer Circuit Pins -->
  <path d="M50 24 V38 M80 24 V38 M100 24 V38 M120 24 V38 M150 24 V38" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  <path d="M50 162 V176 M80 162 V176 M100 162 V176 M120 162 V176 M150 162 V176" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  <path d="M24 50 H38 M24 80 H38 M24 100 H38 M24 120 H38 M24 150 H38" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>
  <path d="M162 50 H176 M162 80 H176 M162 100 H176 M162 120 H176 M162 150 H176" stroke="#818cf8" stroke-width="4" stroke-linecap="round"/>
  <!-- Main Silicon Die Base -->
  <rect x="38" y="38" width="124" height="124" rx="18" fill="url(#aiChipBg)" stroke="#6366f1" stroke-width="3"/>
  <!-- Corner Notches -->
  <circle cx="54" cy="54" r="3" fill="#38bdf8"/>
  <circle cx="146" cy="54" r="3" fill="#c084fc"/>
  <circle cx="54" cy="146" r="3" fill="#818cf8"/>
  <circle cx="146" cy="146" r="3" fill="#38bdf8"/>
  <!-- Inner Neural Core -->
  <rect x="68" y="68" width="64" height="64" rx="12" fill="url(#aiCoreGlow)" filter="url(#aiGlowFilter)"/>
  <!-- Neural Synapse Connections -->
  <circle cx="86" cy="86" r="4.5" fill="#ffffff"/>
  <circle cx="114" cy="86" r="4.5" fill="#ffffff"/>
  <circle cx="100" cy="100" r="6" fill="#ffffff"/>
  <circle cx="86" cy="114" r="4.5" fill="#ffffff"/>
  <circle cx="114" cy="114" r="4.5" fill="#ffffff"/>
  <line x1="86" y1="86" x2="100" y2="100" stroke="#ffffff" stroke-width="2.5"/>
  <line x1="114" y1="86" x2="100" y2="100" stroke="#ffffff" stroke-width="2.5"/>
  <line x1="86" y1="114" x2="100" y2="100" stroke="#ffffff" stroke-width="2.5"/>
  <line x1="114" y1="114" x2="100" y2="100" stroke="#ffffff" stroke-width="2.5"/>
  <!-- Radiating Data Traces -->
  <path d="M100 68 V48 M100 132 V152 M68 100 H48 M132 100 H152" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-quantum-cloud',
    title: 'Quantum Computing Cloud',
    category: 'Cyber & Tech',
    tags: 'cloud, quantum, computing, server, data, network, futuristic, cyber',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cloudGrad" x1="40" y1="50" x2="160" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0284c7"/>
      <stop offset="0.6" stop-color="#2563eb"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="orbitGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#f43f5e"/>
    </linearGradient>
  </defs>
  <!-- Orbital Qubit Rings -->
  <ellipse cx="100" cy="105" rx="76" ry="26" stroke="url(#orbitGrad)" stroke-width="2" stroke-dasharray="6 4" transform="rotate(-18 100 105)"/>
  <ellipse cx="100" cy="105" rx="76" ry="26" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" transform="rotate(24 100 105)" stroke-opacity="0.7"/>
  <!-- Floating Qubits -->
  <circle cx="38" cy="90" r="4.5" fill="#38bdf8"/>
  <circle cx="162" cy="120" r="4.5" fill="#f43f5e"/>
  <!-- Main Cloud Silhouette -->
  <path d="M72 135 H138 C158 135 172 120 172 102 C172 86 160 72 144 70 C140 52 122 38 102 38 C84 38 70 48 64 62 C50 64 38 76 38 92 C38 116 52 135 72 135 Z" fill="url(#cloudGrad)"/>
  <!-- Quantum Core Gateway -->
  <circle cx="100" cy="96" r="16" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="100" cy="96" r="6" fill="#a855f7"/>
  <line x1="100" y1="80" x2="100" y2="112" stroke="#38bdf8" stroke-width="2"/>
  <line x1="84" y1="96" x2="116" y2="96" stroke="#38bdf8" stroke-width="2"/>
</svg>`
  },
  {
    id: 'elem-biometric-shield',
    title: 'Biometric Security Shield',
    category: 'UI Icons',
    tags: 'shield, security, biometric, fingerprint, protection, cyber, privacy, safe',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="shieldGrad" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#059669"/>
      <stop offset="0.5" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Outer Shield Shell -->
  <path d="M100 24 L160 48 C160 112 136 156 100 176 C64 156 40 112 40 48 L100 24 Z" fill="url(#shieldGrad)" stroke="#34d399" stroke-width="4" stroke-linejoin="round"/>
  <!-- Inner Shield Glow Rim -->
  <path d="M100 36 L148 56 C148 106 128 142 100 160 C72 142 52 106 52 56 L100 36 Z" stroke="#38bdf8" stroke-width="1.8" stroke-opacity="0.6"/>
  <!-- Fingerprint Ridges -->
  <path d="M100 70 A16 16 0 0 1 116 86 C116 106 96 114 96 128" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <path d="M84 86 A16 16 0 0 1 100 70" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
  <path d="M74 94 A26 26 0 0 1 100 60 A26 26 0 0 1 126 86 C126 112 106 124 106 138" stroke="#6ee7b7" stroke-width="3" stroke-linecap="round"/>
  <path d="M100 80 A6 6 0 0 1 106 86 C106 98 94 106 94 116" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Laser Scan Line -->
  <line x1="56" y1="98" x2="144" y2="98" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="56" cy="98" r="3" fill="#f43f5e"/>
  <circle cx="144" cy="98" r="3" fill="#f43f5e"/>
</svg>`
  },
  {
    id: 'elem-hologram-vault',
    title: 'Holographic Vault Safe',
    category: 'Cyber & Tech',
    tags: 'vault, safe, security, hologram, lock, futuristic, crypto, storage',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="vaultBaseGrad" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="vaultNeonRim" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#06b6d4"/>
      <stop offset="0.5" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <!-- Vault Box -->
  <rect x="36" y="36" width="128" height="128" rx="24" fill="url(#vaultBaseGrad)" stroke="url(#vaultNeonRim)" stroke-width="3.5"/>
  <!-- Bolted Corners -->
  <circle cx="52" cy="52" r="4" fill="#64748b"/>
  <circle cx="148" cy="52" r="4" fill="#64748b"/>
  <circle cx="52" cy="148" r="4" fill="#64748b"/>
  <circle cx="148" cy="148" r="4" fill="#64748b"/>
  <!-- Central Circular Dial Door -->
  <circle cx="100" cy="100" r="46" fill="#1e1b4b" stroke="#06b6d4" stroke-width="3"/>
  <circle cx="100" cy="100" r="36" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6 4"/>
  <!-- Vault Spokes & Handle Wheel -->
  <line x1="100" y1="68" x2="100" y2="132" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <line x1="68" y1="100" x2="132" y2="100" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <line x1="78" y1="78" x2="122" y2="122" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <line x1="78" y1="122" x2="122" y2="78" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <!-- Center Spindle & Glowing Core -->
  <circle cx="100" cy="100" r="14" fill="#06b6d4" stroke="#ffffff" stroke-width="2.5"/>
  <circle cx="100" cy="100" r="5" fill="#ffffff"/>
  <!-- Digital Indicator LEDs -->
  <circle cx="100" cy="46" r="3" fill="#10b981"/>
  <circle cx="112" cy="46" r="3" fill="#3b82f6"/>
  <circle cx="88" cy="46" r="3" fill="#f59e0b"/>
</svg>`
  },
  {
    id: 'elem-cyber-keycard',
    title: 'Cyber RFID Smart Card',
    category: 'UI Icons',
    tags: 'card, keycard, rfid, access, badge, security, nfc, smartcard',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cardGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#18181b"/>
      <stop offset="0.6" stop-color="#27272a"/>
      <stop offset="1" stop-color="#09090b"/>
    </linearGradient>
    <linearGradient id="goldChip" x1="60" y1="70" x2="90" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fbbf24"/>
      <stop offset="1" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <!-- Card Body (Angled Perspective) -->
  <rect x="42" y="32" width="116" height="136" rx="14" fill="url(#cardGrad)" stroke="#3f3f46" stroke-width="2.5"/>
  <!-- Top Lanyard Hole -->
  <rect x="88" y="42" width="24" height="6" rx="3" fill="#09090b" stroke="#71717a" stroke-width="1.5"/>
  <!-- Gold Contact Microchip -->
  <rect x="58" y="66" width="34" height="28" rx="5" fill="url(#goldChip)" stroke="#b45309" stroke-width="1.5"/>
  <line x1="58" y1="80" x2="92" y2="80" stroke="#78350f" stroke-width="1"/>
  <line x1="75" y1="66" x2="75" y2="94" stroke="#78350f" stroke-width="1"/>
  <!-- RFID Wireless Waves -->
  <path d="M124 72 A14 14 0 0 1 124 88" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M132 66 A24 24 0 0 1 132 94" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M140 60 A34 34 0 0 1 140 100" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Holographic Identity Stripe -->
  <rect x="58" y="112" width="84" height="10" rx="3" fill="#a855f7" fill-opacity="0.3" stroke="#c084fc" stroke-width="1"/>
  <rect x="58" y="130" width="56" height="8" rx="2" fill="#52525b"/>
  <rect x="58" y="144" width="40" height="6" rx="2" fill="#3f3f46"/>
</svg>`
  },
  {
    id: 'elem-vr-spatial-headset',
    title: 'Spatial VR Vision Headset',
    category: 'Cyber & Tech',
    tags: 'vr, headset, virtual reality, metaverse, gaming, vision, futuristic, spatial',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="vrVisorGrad" x1="40" y1="80" x2="160" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#f43f5e"/>
    </linearGradient>
    <linearGradient id="vrBodyGrad" x1="30" y1="60" x2="170" y2="140" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Head Strap Loop -->
  <path d="M34 100 C34 60 64 42 100 42 C136 42 166 60 166 100" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
  <path d="M34 100 C34 60 64 42 100 42 C136 42 166 60 166 100" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>
  <!-- Top Audio Band -->
  <path d="M100 42 V70" stroke="#334155" stroke-width="8" stroke-linecap="round"/>
  <!-- Main Chassis Shell -->
  <rect x="36" y="74" width="128" height="66" rx="26" fill="url(#vrBodyGrad)" stroke="#38bdf8" stroke-width="3"/>
  <!-- Curved Mirror Visor Screen -->
  <rect x="46" y="84" width="108" height="46" rx="18" fill="url(#vrVisorGrad)"/>
  <!-- Specular Lens Glare -->
  <path d="M58 92 C74 92 84 96 90 102" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.8"/>
  <circle cx="136" cy="116" r="3" fill="#ffffff" fill-opacity="0.9"/>
  <!-- Spatial Sensors -->
  <circle cx="48" cy="118" r="3" fill="#10b981"/>
  <circle cx="152" cy="118" r="3" fill="#10b981"/>
</svg>`
  },
  {
    id: 'elem-orbital-satellite',
    title: 'Orbital Communication Satellite',
    category: 'Cyber & Tech',
    tags: 'satellite, space, orbit, communication, radar, antenna, signal, science',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="solarPanel" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#1e3a8a"/>
      <stop offset="1" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <!-- Main Bus Body -->
  <rect x="85" y="80" width="30" height="42" rx="4" fill="#cbd5e1" stroke="#475569" stroke-width="2.5" transform="rotate(-30 100 101)"/>
  <!-- Gold Foil Core Shield -->
  <rect x="90" y="88" width="20" height="24" rx="2" fill="#eab308" transform="rotate(-30 100 100)"/>
  <!-- Left Solar Array Wing -->
  <g transform="rotate(-30 100 100)">
    <line x1="85" y1="100" x2="45" y2="100" stroke="#64748b" stroke-width="3"/>
    <rect x="18" y="82" width="28" height="36" rx="2" fill="url(#solarPanel)" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="18" y1="100" x2="46" y2="100" stroke="#38bdf8" stroke-width="1"/>
    <line x1="32" y1="82" x2="32" y2="118" stroke="#38bdf8" stroke-width="1"/>
  </g>
  <!-- Right Solar Array Wing -->
  <g transform="rotate(-30 100 100)">
    <line x1="115" y1="100" x2="155" y2="100" stroke="#64748b" stroke-width="3"/>
    <rect x="154" y="82" width="28" height="36" rx="2" fill="url(#solarPanel)" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="154" y1="100" x2="182" y2="100" stroke="#38bdf8" stroke-width="1"/>
    <line x1="168" y1="82" x2="168" y2="118" stroke="#38bdf8" stroke-width="1"/>
  </g>
  <!-- Parabolic Dish Antenna -->
  <path d="M125 125 Q135 155 160 160 Q145 135 125 125 Z" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
  <circle cx="152" cy="152" r="3" fill="#f43f5e"/>
  <!-- Radiating Transmission Signal Waves -->
  <path d="M145 170 A20 20 0 0 0 175 140" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M152 182 A34 34 0 0 0 187 147" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-iot-smart-hub',
    title: 'Smart Home IoT Hub',
    category: 'Cyber & Tech',
    tags: 'iot, smart home, hub, wifi, automation, connect, network, devices',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="hubGrad" x1="50" y1="100" x2="150" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Concentric IoT Signal Waves -->
  <circle cx="100" cy="80" r="58" stroke="#6366f1" stroke-width="2" stroke-dasharray="6 6" stroke-opacity="0.5"/>
  <circle cx="100" cy="80" r="42" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5" stroke-opacity="0.8"/>
  <circle cx="100" cy="80" r="26" stroke="#22d3ee" stroke-width="2.5"/>
  <!-- Central Smart Node -->
  <circle cx="100" cy="80" r="10" fill="#38bdf8"/>
  <!-- Physical Cylinder Base Hub -->
  <ellipse cx="100" cy="135" rx="52" ry="14" fill="#334155" stroke="#64748b" stroke-width="2"/>
  <path d="M48 135 V155 C48 165 72 174 100 174 C128 174 152 165 152 155 V135 Z" fill="url(#hubGrad)" stroke="#475569" stroke-width="2"/>
  <!-- LED Ring Glow on Base -->
  <ellipse cx="100" cy="148" rx="46" ry="10" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
  <!-- Connected Peripheral Devices -->
  <circle cx="44" cy="70" r="6" fill="#10b981"/>
  <circle cx="156" cy="70" r="6" fill="#ec4899"/>
  <circle cx="100" cy="24" r="6" fill="#f59e0b"/>
</svg>`
  },
  {
    id: 'elem-laser-hud-target',
    title: 'Tactical HUD Reticle',
    category: 'UI Icons',
    tags: 'hud, target, reticle, scope, aim, crosshair, tactical, gaming, ui',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Circular Gauge -->
  <circle cx="100" cy="100" r="70" stroke="#06b6d4" stroke-width="2" stroke-opacity="0.4"/>
  <!-- Segmented Arcs -->
  <path d="M42 70 A70 70 0 0 1 70 42" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <path d="M130 42 A70 70 0 0 1 158 70" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <path d="M158 130 A70 70 0 0 1 130 158" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <path d="M70 158 A70 70 0 0 1 42 130" stroke="#22d3ee" stroke-width="4" stroke-linecap="round"/>
  <!-- Inner Targeting Brackets -->
  <path d="M72 82 H82 V72" stroke="#f43f5e" stroke-width="3" stroke-linecap="square"/>
  <path d="M128 82 H118 V72" stroke="#f43f5e" stroke-width="3" stroke-linecap="square"/>
  <path d="M72 118 H82 V128" stroke="#f43f5e" stroke-width="3" stroke-linecap="square"/>
  <path d="M128 118 H118 V128" stroke="#f43f5e" stroke-width="3" stroke-linecap="square"/>
  <!-- Precision Crosshair & Center Dot -->
  <circle cx="100" cy="100" r="16" stroke="#22d3ee" stroke-width="2" stroke-dasharray="4 3"/>
  <circle cx="100" cy="100" r="4.5" fill="#f43f5e"/>
  <line x1="100" y1="26" x2="100" y2="46" stroke="#06b6d4" stroke-width="3"/>
  <line x1="100" y1="154" x2="100" y2="174" stroke="#06b6d4" stroke-width="3"/>
  <line x1="26" y1="100" x2="46" y2="100" stroke="#06b6d4" stroke-width="3"/>
  <line x1="154" y1="100" x2="174" y2="100" stroke="#06b6d4" stroke-width="3"/>
</svg>`
  },
  {
    id: 'elem-server-cluster',
    title: 'Cloud Datacenter Server Rack',
    category: 'Cyber & Tech',
    tags: 'server, rack, datacenter, cloud, database, hosting, storage, network',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="serverBlade" x1="40" y1="40" x2="160" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Server Cabinet Frame -->
  <rect x="42" y="24" width="116" height="152" rx="10" fill="#090d16" stroke="#334155" stroke-width="3"/>
  <!-- Blade Unit 1 (Top) -->
  <rect x="52" y="36" width="96" height="26" rx="4" fill="url(#serverBlade)" stroke="#475569" stroke-width="1.5"/>
  <line x1="62" y1="49" x2="98" y2="49" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="118" cy="49" r="3" fill="#10b981"/>
  <circle cx="128" cy="49" r="3" fill="#38bdf8"/>
  <circle cx="138" cy="49" r="3" fill="#10b981"/>
  <!-- Blade Unit 2 (Mid-High) -->
  <rect x="52" y="68" width="96" height="26" rx="4" fill="url(#serverBlade)" stroke="#475569" stroke-width="1.5"/>
  <line x1="62" y1="81" x2="98" y2="81" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="118" cy="81" r="3" fill="#10b981"/>
  <circle cx="128" cy="81" r="3" fill="#f59e0b"/>
  <circle cx="138" cy="81" r="3" fill="#10b981"/>
  <!-- Blade Unit 3 (Mid-Low) -->
  <rect x="52" y="100" width="96" height="26" rx="4" fill="url(#serverBlade)" stroke="#475569" stroke-width="1.5"/>
  <line x1="62" y1="113" x2="98" y2="113" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="118" cy="113" r="3" fill="#38bdf8"/>
  <circle cx="128" cy="113" r="3" fill="#38bdf8"/>
  <circle cx="138" cy="113" r="3" fill="#10b981"/>
  <!-- Blade Unit 4 (Bottom) -->
  <rect x="52" y="132" width="96" height="26" rx="4" fill="url(#serverBlade)" stroke="#475569" stroke-width="1.5"/>
  <line x1="62" y1="145" x2="98" y2="145" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="118" cy="145" r="3" fill="#10b981"/>
  <circle cx="128" cy="145" r="3" fill="#10b981"/>
  <circle cx="138" cy="145" r="3" fill="#ec4899"/>
</svg>`
  },

  // --- 11 to 20: Badges & Stickers & Awards ---
  {
    id: 'elem-vip-golden-crown',
    title: 'Royal VIP Golden Crown',
    category: 'Awards',
    tags: 'crown, gold, vip, royal, king, queen, luxury, premium, award',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="crownGold" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.4" stop-color="#eab308"/>
      <stop offset="1" stop-color="#a16207"/>
    </linearGradient>
    <linearGradient id="crownBaseRim" x1="40" y1="130" x2="160" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ca8a04"/>
      <stop offset="0.5" stop-color="#fef08a"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Crown Spire Peaks -->
  <path d="M38 135 L46 64 L76 100 L100 48 L124 100 L154 64 L162 135 Z" fill="url(#crownGold)" stroke="#78350f" stroke-width="3" stroke-linejoin="round"/>
  <!-- Crown Velvet Cushion Arch -->
  <path d="M46 135 Q100 120 154 135" stroke="#78350f" stroke-width="2"/>
  <!-- Crown Headband Base -->
  <rect x="36" y="134" width="128" height="24" rx="6" fill="url(#crownBaseRim)" stroke="#78350f" stroke-width="3"/>
  <!-- Embedded Jewels on Base -->
  <circle cx="56" cy="146" r="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
  <circle cx="78" cy="146" r="4.5" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/>
  <circle cx="100" cy="146" r="6" fill="#10b981" stroke="#064e3b" stroke-width="1.5"/>
  <circle cx="122" cy="146" r="4.5" fill="#3b82f6" stroke="#1e3a8a" stroke-width="1.5"/>
  <circle cx="144" cy="146" r="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"/>
  <!-- Crown Peak Jewels -->
  <circle cx="46" cy="64" r="5.5" fill="#ffffff" stroke="#eab308" stroke-width="2"/>
  <circle cx="100" cy="48" r="7.5" fill="#ffffff" stroke="#eab308" stroke-width="2.5"/>
  <circle cx="154" cy="64" r="5.5" fill="#ffffff" stroke="#eab308" stroke-width="2"/>
</svg>`
  },
  {
    id: 'elem-verified-shield-ribbon',
    title: 'Official Verified Rosette Ribbon',
    category: 'Badges & Stickers',
    tags: 'verified, badge, ribbon, checkmark, trust, official, seal, award',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="rosetteBlue" x1="40" y1="30" x2="160" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#38bdf8"/>
      <stop offset="0.5" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="ribbonTail" x1="60" y1="120" x2="140" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0369a1"/>
      <stop offset="1" stop-color="#075985"/>
    </linearGradient>
  </defs>
  <!-- Hanging Ribbon Tails -->
  <path d="M72 120 L58 176 L86 160 L100 176 L100 120 Z" fill="url(#ribbonTail)"/>
  <path d="M128 120 L142 176 L114 160 L100 176 L100 120 Z" fill="url(#ribbonTail)"/>
  <!-- Rosette Scalloped Outer Seal -->
  <circle cx="100" cy="88" r="54" fill="url(#rosetteBlue)" stroke="#e0f2fe" stroke-width="3"/>
  <circle cx="100" cy="88" r="44" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 4" stroke-opacity="0.8"/>
  <!-- Verified Thick Checkmark -->
  <path d="M76 88 L92 104 L126 70" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'elem-quality-assurance-seal',
    title: '100% Quality Guaranteed Seal',
    category: 'Badges & Stickers',
    tags: 'seal, guarantee, quality, gold, certified, stamp, badge, star, authentic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="goldSealGrad" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.3" stop-color="#f59e0b"/>
      <stop offset="0.7" stop-color="#d97706"/>
      <stop offset="1" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Scalloped Cog / Star Seal Edge -->
  <circle cx="100" cy="100" r="68" fill="url(#goldSealGrad)" stroke="#78350f" stroke-width="3"/>
  <circle cx="100" cy="100" r="58" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 3"/>
  <circle cx="100" cy="100" r="50" fill="#78350f"/>
  <!-- Central 5-Point Star -->
  <polygon points="100,64 107,84 128,84 111,97 117,118 100,105 83,118 89,97 72,84 93,84" fill="#fde047"/>
  <!-- Quality Ribbon Arc Stars -->
  <circle cx="68" cy="100" r="3.5" fill="#fde047"/>
  <circle cx="132" cy="100" r="3.5" fill="#fde047"/>
  <circle cx="76" cy="122" r="3" fill="#fde047"/>
  <circle cx="124" cy="122" r="3" fill="#fde047"/>
  <!-- Guaranteed Banner -->
  <rect x="54" y="128" width="92" height="18" rx="5" fill="#f59e0b" stroke="#fde047" stroke-width="1.5"/>
  <line x1="64" y1="137" x2="136" y2="137" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-trending-flame-badge',
    title: 'Viral Trending Fire Flame',
    category: 'Badges & Stickers',
    tags: 'flame, fire, trending, viral, hot, popular, sticker, badge, spark',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="fireOuterGrad" x1="40" y1="40" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ef4444"/>
      <stop offset="0.6" stop-color="#f97316"/>
      <stop offset="1" stop-color="#facc15"/>
    </linearGradient>
    <linearGradient id="fireInnerGrad" x1="70" y1="80" x2="130" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#facc15"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <!-- Outer Flame Body -->
  <path d="M100 24 C116 54 140 78 140 108 C140 144 116 172 88 172 C60 172 44 148 44 122 C44 92 68 76 74 54 C74 80 92 90 92 90 C92 70 86 52 100 24 Z" fill="url(#fireOuterGrad)" stroke="#b91c1c" stroke-width="3"/>
  <!-- Secondary Flame Tongue -->
  <path d="M110 88 C128 104 132 124 122 144 C114 128 112 116 102 108 C102 124 94 136 86 142 C92 120 100 108 110 88 Z" fill="#ea580c"/>
  <!-- Core Super-Hot Inner Flame -->
  <path d="M88 118 C96 118 104 128 104 140 C104 154 94 164 82 164 C70 164 64 154 64 144 C64 130 76 122 88 118 Z" fill="url(#fireInnerGrad)"/>
  <!-- Spark Floating Particles -->
  <circle cx="146" cy="62" r="4" fill="#facc15"/>
  <circle cx="134" cy="42" r="3" fill="#fb923c"/>
  <circle cx="56" cy="46" r="3.5" fill="#f87171"/>
</svg>`
  },
  {
    id: 'elem-flash-deal-tag',
    title: 'Flash Sale Lightning Tag',
    category: 'Badges & Stickers',
    tags: 'sale, tag, flash, discount, lightning, deal, shop, commerce, promo',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="tagGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#dc2626"/>
      <stop offset="0.8" stop-color="#991b1b"/>
      <stop offset="1" stop-color="#450a0a"/>
    </linearGradient>
  </defs>
  <!-- Angled Price Tag Body -->
  <path d="M52 82 L106 28 L168 90 L114 144 L52 144 Z" fill="url(#tagGrad)" stroke="#f87171" stroke-width="3" stroke-linejoin="round"/>
  <!-- Eyelet Hole & String -->
  <circle cx="76" cy="116" r="7" fill="#ffffff" stroke="#7f1d1d" stroke-width="2"/>
  <path d="M72 112 C60 98 42 102 32 86 C24 72 34 54 48 48" stroke="#fecaca" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Bold Electric Lightning Bolt Cutout -->
  <polygon points="124,52 102,88 120,88 106,124 142,82 122,82" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
  <!-- Sparkles -->
  <circle cx="152" cy="56" r="3" fill="#ffffff"/>
  <circle cx="158" cy="118" r="3" fill="#ffffff"/>
</svg>`
  },
  {
    id: 'elem-laurel-wreath-award',
    title: 'Golden Laurel Wreath Trophy',
    category: 'Awards',
    tags: 'laurel, wreath, trophy, winner, champion, gold, success, victory, rank',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="laurelGold" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fef08a"/>
      <stop offset="0.4" stop-color="#eab308"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Left Laurel Branch Leaves -->
  <g fill="url(#laurelGold)" stroke="#78350f" stroke-width="1.5">
    <ellipse cx="64" cy="54" rx="7" ry="14" transform="rotate(-30 64 54)"/>
    <ellipse cx="48" cy="76" rx="7" ry="14" transform="rotate(-15 48 76)"/>
    <ellipse cx="42" cy="104" rx="7" ry="14" transform="rotate(5 42 104)"/>
    <ellipse cx="48" cy="132" rx="7" ry="14" transform="rotate(30 48 132)"/>
    <ellipse cx="68" cy="154" rx="7" ry="14" transform="rotate(55 68 154)"/>
  </g>
  <!-- Right Laurel Branch Leaves -->
  <g fill="url(#laurelGold)" stroke="#78350f" stroke-width="1.5">
    <ellipse cx="136" cy="54" rx="7" ry="14" transform="rotate(30 136 54)"/>
    <ellipse cx="152" cy="76" rx="7" ry="14" transform="rotate(15 152 76)"/>
    <ellipse cx="158" cy="104" rx="7" ry="14" transform="rotate(-5 158 104)"/>
    <ellipse cx="152" cy="132" rx="7" ry="14" transform="rotate(-30 152 132)"/>
    <ellipse cx="132" cy="154" rx="7" ry="14" transform="rotate(-55 132 154)"/>
  </g>
  <!-- Bottom Ribbon Tie Bow -->
  <ellipse cx="100" cy="164" rx="14" ry="7" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
  <circle cx="100" cy="164" r="5" fill="#fde047"/>
  <!-- Central Big Winner Star -->
  <polygon points="100,74 107,92 126,92 110,104 116,122 100,111 84,122 90,104 74,92 93,92" fill="url(#laurelGold)" stroke="#78350f" stroke-width="2.5"/>
</svg>`
  },
  {
    id: 'elem-limited-edition-crest',
    title: 'Limited Edition Diamond Crest',
    category: 'Awards',
    tags: 'crest, badge, diamond, luxury, premium, limited edition, shield, banner',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="crestDark" x1="50" y1="30" x2="150" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#18181b"/>
      <stop offset="1" stop-color="#27272a"/>
    </linearGradient>
    <linearGradient id="crestGold" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="1" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <!-- Hexagonal Shield Crest -->
  <polygon points="100,32 158,54 158,124 100,166 42,124 42,54" fill="url(#crestDark)" stroke="url(#crestGold)" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Inner Border Line -->
  <polygon points="100,44 146,62 146,118 100,152 54,118 54,62" stroke="#eab308" stroke-width="1.5" stroke-opacity="0.6"/>
  <!-- Faceted Diamond Top -->
  <polygon points="100,64 126,76 100,108 74,76" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>
  <polygon points="100,64 112,76 100,108" fill="#bae6fd"/>
  <polygon points="88,76 100,64 74,76" fill="#7dd3fc"/>
  <!-- Bottom Ribbon Wrap -->
  <path d="M32 140 L100 152 L168 140 L154 162 L100 174 L46 162 Z" fill="#b91c1c" stroke="#fde047" stroke-width="2" stroke-linejoin="round"/>
  <line x1="56" y1="152" x2="144" y2="152" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-express-rocket-shipping',
    title: 'Fast Express Delivery Rocket',
    category: 'Badges & Stickers',
    tags: 'rocket, delivery, express, fast, shipping, package, ecommerce, speed',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="rocketBody" x1="70" y1="40" x2="140" y2="140" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.7" stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="rocketFire" x1="100" y1="140" x2="100" y2="188" gradientUnits="userSpaceOnUse">
      <stop stop-color="#facc15"/>
      <stop offset="0.5" stop-color="#f97316"/>
      <stop offset="1" stop-color="#ef4444"/>
    </linearGradient>
  </defs>
  <!-- Exhaust Flame Trails -->
  <path d="M90 144 Q100 186 100 188 Q100 186 110 144 Z" fill="url(#rocketFire)"/>
  <!-- Left and Right Wing Fins -->
  <path d="M74 116 L48 142 L72 140 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
  <path d="M126 116 L152 142 L128 140 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
  <!-- Main Fuselage Hull -->
  <path d="M100 32 C82 60 74 96 74 138 H126 C126 96 118 60 100 32 Z" fill="url(#rocketBody)" stroke="#475569" stroke-width="3"/>
  <!-- Red Nose Cone Tip -->
  <path d="M100 32 C92 48 84 64 80 76 H120 C116 64 108 48 100 32 Z" fill="#ef4444"/>
  <!-- Circular Porthole Window -->
  <circle cx="100" cy="98" r="14" fill="#0284c7" stroke="#bae6fd" stroke-width="3"/>
  <path d="M94 92 A8 8 0 0 1 106 92" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <!-- Speed Dash Streaks -->
  <line x1="38" y1="74" x2="48" y2="88" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <line x1="162" y1="74" x2="152" y2="88" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-gift-surprise-box',
    title: '3D Luxury Gift Box',
    category: '3D Elements',
    tags: 'gift, surprise, present, box, ribbon, holiday, celebration, birthday',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="boxGrad" x1="40" y1="80" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#8b5cf6"/>
      <stop offset="0.6" stop-color="#6d28d9"/>
      <stop offset="1" stop-color="#4c1d95"/>
    </linearGradient>
    <linearGradient id="goldRibbon" x1="50" y1="40" x2="150" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="1" stop-color="#ca8a04"/>
    </linearGradient>
  </defs>
  <!-- Lower Box Container -->
  <rect x="48" y="94" width="104" height="72" rx="8" fill="url(#boxGrad)" stroke="#4c1d95" stroke-width="3"/>
  <!-- Box Lid (Slightly Wider) -->
  <rect x="42" y="80" width="116" height="20" rx="5" fill="#a78bfa" stroke="#5b21b6" stroke-width="3"/>
  <!-- Vertical Gold Ribbon -->
  <rect x="92" y="80" width="16" height="86" fill="url(#goldRibbon)"/>
  <!-- Horizontal Gold Ribbon on Box -->
  <rect x="48" y="120" width="104" height="14" fill="url(#goldRibbon)"/>
  <!-- Satin Top Bow Loops -->
  <path d="M100 80 C84 56 62 60 74 74 C86 86 98 80 100 80 Z" fill="url(#goldRibbon)" stroke="#a16207" stroke-width="2"/>
  <path d="M100 80 C116 56 138 60 126 74 C114 86 102 80 100 80 Z" fill="url(#goldRibbon)" stroke="#a16207" stroke-width="2"/>
  <circle cx="100" cy="80" r="7" fill="#facc15" stroke="#a16207" stroke-width="2"/>
  <!-- Floating Confetti Stars -->
  <circle cx="44" cy="56" r="3.5" fill="#facc15"/>
  <circle cx="156" cy="62" r="3" fill="#38bdf8"/>
  <circle cx="148" cy="42" r="4" fill="#ec4899"/>
</svg>`
  },
  {
    id: 'elem-mega-discount-starburst',
    title: 'Mega Sale Starburst Badge',
    category: 'Badges & Stickers',
    tags: 'sale, starburst, badge, discount, promo, sticker, retail, shop',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="burstGrad" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f43f5e"/>
      <stop offset="0.5" stop-color="#e11d48"/>
      <stop offset="1" stop-color="#9f1239"/>
    </linearGradient>
  </defs>
  <!-- 16-Point Symmetrical Starburst Polygon -->
  <polygon points="100,26 114,46 138,36 144,60 168,60 164,84 182,98 168,116 178,140 154,146 152,170 128,164 116,182 98,168 80,180 74,156 50,154 54,130 36,116 48,98 38,74 62,68 64,44 88,50" fill="url(#burstGrad)" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- Inner Circular Inset -->
  <circle cx="100" cy="104" r="42" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="2" stroke-dasharray="5 3"/>
  <!-- SALE Text Block Shapes (Stylized Vector Letters) -->
  <!-- Letter S -->
  <path d="M82 88 H72 C68 88 68 96 72 96 H78 C82 96 82 104 78 104 H68" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Letter A -->
  <path d="M88 104 L96 88 L104 104 M90 99 H102" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Letter L -->
  <path d="M114 88 V104 H124" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Letter E -->
  <path d="M132 88 H142 M132 96 H140 M132 104 H142 M132 88 V104" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Percentage Ribbon Banner -->
  <rect x="74" y="114" width="52" height="14" rx="4" fill="#facc15"/>
  <circle cx="86" cy="121" r="2.5" fill="#9f1239"/>
  <circle cx="114" cy="121" r="2.5" fill="#9f1239"/>
  <line x1="94" y1="124" x2="106" y2="118" stroke="#9f1239" stroke-width="2" stroke-linecap="round"/>
</svg>`
  },

  // --- 21 to 30: Creative Tools & Design Pro Elements ---
  {
    id: 'elem-vector-bezier-pen',
    title: 'Bézier Vector Pen Tool',
    category: 'Creative Tools',
    tags: 'pen, bezier, vector, anchor, curve, path, design, illustrator, tool',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="nibMetal" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f8fafc"/>
      <stop offset="0.6" stop-color="#cbd5e1"/>
      <stop offset="1" stop-color="#64748b"/>
    </linearGradient>
  </defs>
  <!-- Dynamic Bézier Curve Path -->
  <path d="M34 166 C40 100 100 80 166 60" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6 4"/>
  <!-- Anchor Handles & Node Squares -->
  <line x1="60" y1="130" x2="140" y2="70" stroke="#f43f5e" stroke-width="2"/>
  <rect x="56" y="126" width="8" height="8" fill="#ffffff" stroke="#f43f5e" stroke-width="2"/>
  <rect x="136" y="66" width="8" height="8" fill="#ffffff" stroke="#f43f5e" stroke-width="2"/>
  <!-- Fountain Pen Nib (Angled) -->
  <g transform="translate(30, 20) rotate(45 50 50)">
    <!-- Pen Barrel -->
    <path d="M40 0 H60 L68 34 H32 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <!-- Gold Nib Body -->
    <path d="M32 34 H68 L60 80 L50 100 L40 80 Z" fill="url(#nibMetal)" stroke="#334155" stroke-width="2.5"/>
    <!-- Nib Center Slit & Breather Hole -->
    <line x1="50" y1="44" x2="50" y2="82" stroke="#0f172a" stroke-width="2"/>
    <circle cx="50" cy="64" r="3.5" fill="#0f172a"/>
  </g>
</svg>`
  },
  {
    id: 'elem-cmyk-color-wheel',
    title: 'Precision Color Wheel Palette',
    category: 'Creative Tools',
    tags: 'color, wheel, cmyk, rgb, palette, swatch, spectrum, art, design',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Chromatic Color Ring Segments -->
  <circle cx="100" cy="100" r="66" stroke="#ef4444" stroke-width="18" stroke-dasharray="35 380"/>
  <circle cx="100" cy="100" r="66" stroke="#f97316" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-35"/>
  <circle cx="100" cy="100" r="66" stroke="#eab308" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-70"/>
  <circle cx="100" cy="100" r="66" stroke="#84cc16" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-105"/>
  <circle cx="100" cy="100" r="66" stroke="#10b981" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-140"/>
  <circle cx="100" cy="100" r="66" stroke="#06b6d4" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-175"/>
  <circle cx="100" cy="100" r="66" stroke="#3b82f6" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-210"/>
  <circle cx="100" cy="100" r="66" stroke="#6366f1" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-245"/>
  <circle cx="100" cy="100" r="66" stroke="#a855f7" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-280"/>
  <circle cx="100" cy="100" r="66" stroke="#ec4899" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-315"/>
  <circle cx="100" cy="100" r="66" stroke="#f43f5e" stroke-width="18" stroke-dasharray="35 380" stroke-dashoffset="-350"/>
  <!-- Center Eyedropper Hub -->
  <circle cx="100" cy="100" r="32" fill="#0f172a" stroke="#ffffff" stroke-width="3"/>
  <!-- Eyedropper Icon -->
  <g transform="translate(82, 82) scale(0.9)">
    <path d="M28 8 L32 12 L22 22 L14 22 L18 18 Z" fill="#38bdf8"/>
    <path d="M14 22 L6 30 L10 34 L18 26 Z" fill="#cbd5e1"/>
    <circle cx="6" cy="34" r="2" fill="#38bdf8"/>
  </g>
</svg>`
  },
  {
    id: 'elem-isometric-layers',
    title: 'Isometric Vector Layers Stack',
    category: 'Creative Tools',
    tags: 'layers, stack, isometric, artboard, canvas, ui, vector, design',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Bottom Layer 1 (Dark Slate) -->
  <polygon points="100,128 162,154 100,180 38,154" fill="#334155" stroke="#64748b" stroke-width="2.5"/>
  <!-- Mid Layer 2 (Indigo Glass) -->
  <polygon points="100,90 162,116 100,142 38,116" fill="#6366f1" fill-opacity="0.75" stroke="#a5b4fc" stroke-width="2.5"/>
  <!-- Top Layer 3 (Cyan Vector Canvas) -->
  <polygon points="100,52 162,78 100,104 38,78" fill="#06b6d4" fill-opacity="0.85" stroke="#67e8f9" stroke-width="3"/>
  <!-- Artwork Shapes on Top Layer -->
  <ellipse cx="100" cy="78" rx="20" ry="10" fill="#ffffff" fill-opacity="0.9"/>
  <circle cx="85" cy="74" r="3" fill="#0e7490"/>
  <circle cx="115" cy="82" r="3" fill="#0e7490"/>
  <!-- Connecting Vertical Ray Guides -->
  <line x1="38" y1="78" x2="38" y2="154" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
  <line x1="162" y1="78" x2="162" y2="154" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
</svg>`
  },
  {
    id: 'elem-magic-spark-wand',
    title: 'Magic Effect Spark Wand',
    category: 'Creative Tools',
    tags: 'magic, wand, spark, effect, fx, filter, star, creator, transform',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="wandShaft" x1="40" y1="160" x2="140" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b"/>
      <stop offset="0.6" stop-color="#4f46e5"/>
      <stop offset="1" stop-color="#818cf8"/>
    </linearGradient>
  </defs>
  <!-- Wand Shaft -->
  <rect x="52" y="106" width="16" height="92" rx="8" fill="url(#wandShaft)" stroke="#312e81" stroke-width="2" transform="rotate(-45 52 106)"/>
  <!-- Wand Glowing Tip -->
  <rect x="110" y="48" width="16" height="26" rx="6" fill="#fde047" stroke="#ca8a04" stroke-width="2" transform="rotate(-45 110 48)"/>
  <!-- Giant 4-Point Magic Star -->
  <path d="M142 22 Q142 46 166 46 Q142 46 142 70 Q142 46 118 46 Q142 46 142 22 Z" fill="#facc15" stroke="#ffffff" stroke-width="2"/>
  <!-- Secondary Sparkles -->
  <path d="M106 20 Q106 32 118 32 Q106 32 106 44 Q106 32 94 32 Q106 32 106 20 Z" fill="#38bdf8"/>
  <path d="M168 76 Q168 86 178 86 Q168 86 168 96 Q168 86 158 86 Q168 86 168 76 Z" fill="#f43f5e"/>
  <circle cx="120" cy="74" r="3" fill="#ffffff"/>
  <circle cx="162" cy="24" r="2.5" fill="#facc15"/>
</svg>`
  },
  {
    id: 'elem-camera-aperture-iris',
    title: 'Camera Shutter Aperture',
    category: 'Creative Tools',
    tags: 'camera, aperture, shutter, lens, photo, video, creator, cinema, optic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="lensRing" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="1" stop-color="#090d16"/>
    </linearGradient>
  </defs>
  <!-- Outer Metal Lens Housing -->
  <circle cx="100" cy="100" r="74" fill="url(#lensRing)" stroke="#475569" stroke-width="4"/>
  <circle cx="100" cy="100" r="66" stroke="#0284c7" stroke-width="2"/>
  <!-- Calibrated Focal Markings -->
  <line x1="100" y1="26" x2="100" y2="34" stroke="#ffffff" stroke-width="2"/>
  <line x1="174" y1="100" x2="166" y2="100" stroke="#ffffff" stroke-width="2"/>
  <line x1="100" y1="174" x2="100" y2="166" stroke="#ffffff" stroke-width="2"/>
  <line x1="26" y1="100" x2="34" y2="100" stroke="#ffffff" stroke-width="2"/>
  <!-- Aperture Blades (6 Interlocking Geometric Blades) -->
  <path d="M100 48 L142 76 L118 126 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
  <path d="M142 76 L142 124 L92 136 Z" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
  <path d="M142 124 L100 152 L76 102 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
  <path d="M100 152 L58 124 L82 74 Z" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
  <path d="M58 124 L58 76 L108 64 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5"/>
  <path d="M58 76 L100 48 L124 98 Z" fill="#475569" stroke="#1e293b" stroke-width="1.5"/>
  <!-- Central Aperture Opening -->
  <polygon points="106,86 116,98 108,112 94,114 84,102 92,88" fill="#0284c7"/>
  <!-- Optical Blue Reflection Flare -->
  <path d="M68 64 A48 48 0 0 1 128 54" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7"/>
</svg>`
  },
  {
    id: 'elem-typography-caliper',
    title: 'Typography Precision Caliper',
    category: 'Creative Tools',
    tags: 'typography, font, letter, caliper, precision, kerning, measure, type',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Large Serif 'A' Letterform -->
  <path d="M82 152 L96 66 H104 L118 152 M88 126 H112" stroke="#e2e8f0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Serif Base Feet -->
  <line x1="72" y1="152" x2="92" y2="152" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round"/>
  <line x1="108" y1="152" x2="128" y2="152" stroke="#e2e8f0" stroke-width="6" stroke-linecap="round"/>
  <!-- Engineering Caliper Ruler Top -->
  <rect x="36" y="38" width="128" height="12" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Caliper Tick Marks -->
  <line x1="50" y1="38" x2="50" y2="44" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="70" y1="38" x2="70" y2="46" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="90" y1="38" x2="90" y2="44" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="110" y1="38" x2="110" y2="46" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="130" y1="38" x2="130" y2="44" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="150" y1="38" x2="150" y2="46" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Caliper Measuring Jaws -->
  <path d="M50 50 V160 L62 160 V50" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
  <path d="M150 50 V160 L138 160 V50" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Dimension Arrow Line -->
  <line x1="66" y1="168" x2="134" y2="168" stroke="#f43f5e" stroke-width="2"/>
  <polygon points="66,168 74,164 74,172" fill="#f43f5e"/>
  <polygon points="134,168 126,164 126,172" fill="#f43f5e"/>
</svg>`
  },
  {
    id: 'elem-digital-canvas-stylus',
    title: 'Stylus Pen & Digital Tablet',
    category: 'Creative Tools',
    tags: 'stylus, tablet, pen, drawing, digital art, sketch, canvas, designer',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="tabletScreen" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#18181b"/>
      <stop offset="1" stop-color="#09090b"/>
    </linearGradient>
  </defs>
  <!-- Drawing Tablet Body -->
  <rect x="34" y="38" width="132" height="124" rx="14" fill="#27272a" stroke="#3f3f46" stroke-width="3"/>
  <!-- Active Active Drawing Display Area -->
  <rect x="56" y="50" width="98" height="100" rx="6" fill="url(#tabletScreen)" stroke="#10b981" stroke-width="1.5"/>
  <!-- Express Shortcut Buttons -->
  <circle cx="45" cy="65" r="4" fill="#52525b"/>
  <circle cx="45" cy="85" r="4" fill="#52525b"/>
  <circle cx="45" cy="105" r="4" fill="#52525b"/>
  <circle cx="45" cy="125" r="4" fill="#52525b"/>
  <!-- Vector Stroke Drawn on Screen -->
  <path d="M70 120 C82 80 110 130 134 80" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
  <!-- Stylus Pen Hovering -->
  <g transform="translate(130, 60) rotate(-35)">
    <rect x="-6" y="-50" width="12" height="60" rx="4" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
    <polygon points="-6,10 6,10 0,22" fill="#0f172a"/>
    <rect x="-4" y="-30" width="8" height="14" rx="2" fill="#3b82f6"/>
  </g>
</svg>`
  },
  {
    id: 'elem-3d-wireframe-sphere',
    title: 'Geodesic Wireframe Sphere',
    category: '3D Elements',
    tags: '3d, wireframe, sphere, globe, geodesic, geometry, mesh, tech, model',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Sphere Rim -->
  <circle cx="100" cy="100" r="66" stroke="#38bdf8" stroke-width="3"/>
  <!-- Longitudinal Ellipses -->
  <ellipse cx="100" cy="100" rx="44" ry="66" stroke="#0284c7" stroke-width="2"/>
  <ellipse cx="100" cy="100" rx="22" ry="66" stroke="#0284c7" stroke-width="2"/>
  <line x1="100" y1="34" x2="100" y2="166" stroke="#38bdf8" stroke-width="2"/>
  <!-- Latitudinal Ellipses -->
  <ellipse cx="100" cy="100" rx="66" ry="22" stroke="#0284c7" stroke-width="2"/>
  <ellipse cx="100" cy="74" rx="60" ry="16" stroke="#0284c7" stroke-width="1.8"/>
  <ellipse cx="100" cy="126" rx="60" ry="16" stroke="#0284c7" stroke-width="1.8"/>
  <line x1="34" y1="100" x2="166" y2="100" stroke="#38bdf8" stroke-width="2"/>
  <!-- Glowing Vertex Nodes -->
  <circle cx="100" cy="100" r="4.5" fill="#f43f5e"/>
  <circle cx="100" cy="74" r="3.5" fill="#38bdf8"/>
  <circle cx="100" cy="126" r="3.5" fill="#38bdf8"/>
  <circle cx="56" cy="100" r="3.5" fill="#38bdf8"/>
  <circle cx="144" cy="100" r="3.5" fill="#38bdf8"/>
  <circle cx="78" cy="74" r="3" fill="#a855f7"/>
  <circle cx="122" cy="74" r="3" fill="#a855f7"/>
  <circle cx="78" cy="126" r="3" fill="#a855f7"/>
  <circle cx="122" cy="126" r="3" fill="#a855f7"/>
</svg>`
  },
  {
    id: 'elem-golden-ratio-spiral',
    title: 'Fibonacci Golden Ratio Spiral',
    category: 'Creative Tools',
    tags: 'golden ratio, fibonacci, spiral, math, geometry, design, proportion, grid',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Golden Rectangles Grid -->
  <rect x="36" y="44" width="128" height="112" stroke="#475569" stroke-width="1.5" fill="#0f172a"/>
  <!-- Sub-divided Golden Quadrants -->
  <line x1="115" y1="44" x2="115" y2="156" stroke="#64748b" stroke-width="1.5"/>
  <line x1="115" y1="113" x2="164" y2="113" stroke="#64748b" stroke-width="1.5"/>
  <line x1="134" y1="113" x2="134" y2="156" stroke="#64748b" stroke-width="1.5"/>
  <!-- Radiant Golden Spiral Arc -->
  <path d="M36 156 A79 79 0 0 1 115 44 A49 49 0 0 1 164 113 A30 30 0 0 1 134 156 A19 19 0 0 1 115 137 A12 12 0 0 1 127 125" stroke="#facc15" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Focus Center Spark -->
  <circle cx="127" cy="125" r="3.5" fill="#f43f5e"/>
</svg>`
  },
  {
    id: 'elem-paint-splatter-palette',
    title: 'Artist Wooden Paint Palette',
    category: 'Creative Tools',
    tags: 'palette, paint, artist, color, oil, brush, wooden, art, creative',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="paletteWood" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#d97706"/>
      <stop offset="0.6" stop-color="#b45309"/>
      <stop offset="1" stop-color="#78350f"/>
    </linearGradient>
  </defs>
  <!-- Kidney Palette Shape with Thumb Hole -->
  <path d="M48 68 C34 94 36 138 68 158 C100 178 144 168 162 144 C176 124 166 94 146 88 C136 86 130 96 118 94 C104 92 108 68 98 54 C82 34 58 48 48 68 Z" fill="url(#paletteWood)" stroke="#451a03" stroke-width="3.5"/>
  <!-- Thumb Hole -->
  <ellipse cx="140" cy="132" rx="10" ry="14" fill="#0f172a" stroke="#451a03" stroke-width="2"/>
  <!-- Paint Dollops / Blobs -->
  <circle cx="58" cy="80" r="8" fill="#ef4444"/>
  <circle cx="68" cy="58" r="7.5" fill="#f97316"/>
  <circle cx="94" cy="48" r="8" fill="#facc15"/>
  <circle cx="70" cy="120" r="8" fill="#10b981"/>
  <circle cx="92" cy="144" r="8" fill="#06b6d4"/>
  <circle cx="120" cy="154" r="7.5" fill="#8b5cf6"/>
</svg>`
  },

  // --- 31 to 40: Finance, Crypto & E-Commerce ---
  {
    id: 'elem-crypto-blockchain-coin',
    title: 'Blockchain Crypto Gold Token',
    category: 'UI Icons',
    tags: 'crypto, bitcoin, blockchain, coin, gold, token, web3, finance, currency',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cryptoGoldGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.5" stop-color="#eab308"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Hexagonal Physical Coin Edge -->
  <polygon points="100,28 162,64 162,136 100,172 38,136 38,64" fill="url(#cryptoGoldGrad)" stroke="#78350f" stroke-width="3" stroke-linejoin="round"/>
  <!-- Inner Rim Inset -->
  <polygon points="100,40 150,69 150,131 100,160 50,131 50,69" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.6"/>
  <!-- Blockchain Distributed Node Network -->
  <circle cx="100" cy="74" r="7" fill="#ffffff" stroke="#78350f" stroke-width="2"/>
  <circle cx="76" cy="116" r="7" fill="#ffffff" stroke="#78350f" stroke-width="2"/>
  <circle cx="124" cy="116" r="7" fill="#ffffff" stroke="#78350f" stroke-width="2"/>
  <circle cx="100" cy="100" r="10" fill="#78350f" stroke="#fde047" stroke-width="2.5"/>
  <line x1="100" y1="74" x2="100" y2="100" stroke="#78350f" stroke-width="3"/>
  <line x1="76" y1="116" x2="100" y2="100" stroke="#78350f" stroke-width="3"/>
  <line x1="124" y1="116" x2="100" y2="100" stroke="#78350f" stroke-width="3"/>
  <line x1="76" y1="116" x2="124" y2="116" stroke="#78350f" stroke-width="2" stroke-dasharray="4 3"/>
</svg>`
  },
  {
    id: 'elem-bull-market-chart',
    title: 'Bullish Market Growth Trend',
    category: 'UI Icons',
    tags: 'chart, bull, market, finance, stock, trend, growth, profit, trading',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="growthArea" x1="100" y1="50" x2="100" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10b981" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#10b981" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Chart Axis Grid -->
  <line x1="36" y1="156" x2="164" y2="156" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="36" y1="36" x2="36" y2="156" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="36" y1="118" x2="164" y2="118" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="36" y1="78" x2="164" y2="78" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- Area Fill Under Trend -->
  <path d="M42 140 L70 120 L96 130 L126 84 L158 48 V156 H42 Z" fill="url(#growthArea)"/>
  <!-- Dynamic Upward Surging Line -->
  <path d="M42 140 L70 120 L96 130 L126 84 L158 48" stroke="#10b981" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Breakout Arrowhead -->
  <polygon points="158,48 142,50 156,64" fill="#10b981"/>
  <!-- Data Milestone Dots -->
  <circle cx="70" cy="120" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
  <circle cx="96" cy="130" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
  <circle cx="126" cy="84" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
  <circle cx="158" cy="48" r="5" fill="#facc15" stroke="#10b981" stroke-width="2.5"/>
</svg>`
  },
  {
    id: 'elem-golden-bank-vault',
    title: 'Heavy Steel Vault Door',
    category: '3D Elements',
    tags: 'vault, bank, safe, gold, steel, security, wealth, storage, lock',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Outer Massive Steel Door Frame -->
  <circle cx="100" cy="100" r="70" fill="#1e293b" stroke="#475569" stroke-width="5"/>
  <!-- Outer Locking Bolted Rim -->
  <circle cx="100" cy="100" r="58" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>
  <!-- Perimeter Locking Pins -->
  <circle cx="100" cy="46" r="4" fill="#cbd5e1"/>
  <circle cx="154" cy="100" r="4" fill="#cbd5e1"/>
  <circle cx="100" cy="154" r="4" fill="#cbd5e1"/>
  <circle cx="46" cy="100" r="4" fill="#cbd5e1"/>
  <circle cx="138" cy="62" r="3.5" fill="#94a3b8"/>
  <circle cx="138" cy="138" r="3.5" fill="#94a3b8"/>
  <circle cx="62" cy="138" r="3.5" fill="#94a3b8"/>
  <circle cx="62" cy="62" r="3.5" fill="#94a3b8"/>
  <!-- Center Handwheel Spindle Base -->
  <circle cx="100" cy="100" r="30" fill="#eab308" stroke="#78350f" stroke-width="3"/>
  <!-- Spoke Handles -->
  <line x1="100" y1="74" x2="100" y2="126" stroke="#78350f" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="74" y1="100" x2="126" y2="100" stroke="#78350f" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="100" cy="74" r="4" fill="#fde047"/>
  <circle cx="100" cy="126" r="4" fill="#fde047"/>
  <circle cx="74" cy="100" r="4" fill="#fde047"/>
  <circle cx="126" cy="100" r="4" fill="#fde047"/>
  <circle cx="100" cy="100" r="10" fill="#78350f"/>
</svg>`
  },
  {
    id: 'elem-piggy-bank-investment',
    title: 'Smart Investment Piggy Bank',
    category: 'UI Icons',
    tags: 'piggy bank, savings, coin, money, finance, investment, gold, wealth',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="pigPink" x1="40" y1="60" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f472b6"/>
      <stop offset="0.6" stop-color="#ec4899"/>
      <stop offset="1" stop-color="#be185d"/>
    </linearGradient>
  </defs>
  <!-- Gold Coin Dropping into Slot -->
  <ellipse cx="100" cy="46" rx="16" ry="12" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="96" y="51" fill="#78350f" font-weight="bold" font-size="12">$</text>
  <!-- Piggy Feet -->
  <rect x="70" y="142" width="16" height="22" rx="4" fill="#be185d"/>
  <rect x="118" y="142" width="16" height="22" rx="4" fill="#be185d"/>
  <!-- Main Piggy Body -->
  <ellipse cx="100" cy="112" rx="56" ry="42" fill="url(#pigPink)" stroke="#9d174d" stroke-width="3"/>
  <!-- Coin Drop Slot -->
  <rect x="88" y="72" width="24" height="5" rx="2.5" fill="#831843"/>
  <!-- Snout -->
  <ellipse cx="50" cy="112" rx="14" ry="12" fill="#fbcfe8" stroke="#9d174d" stroke-width="2.5"/>
  <circle cx="46" cy="112" r="2.5" fill="#9d174d"/>
  <circle cx="54" cy="112" r="2.5" fill="#9d174d"/>
  <!-- Eye -->
  <circle cx="74" cy="96" r="3.5" fill="#0f172a"/>
  <!-- Curly Tail -->
  <path d="M154 110 C166 104 172 116 164 122" stroke="#f472b6" stroke-width="3.5" stroke-linecap="round"/>
</svg>`
  },
  {
    id: 'elem-contactless-credit-card',
    title: 'Platinum Contactless Smart Card',
    category: 'UI Icons',
    tags: 'credit card, payment, contactless, nfc, banking, platinum, money, checkout',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="cardMetallic" x1="30" y1="50" x2="170" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#334155"/>
      <stop offset="0.5" stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Card Plastic Body -->
  <rect x="32" y="52" width="136" height="96" rx="12" fill="url(#cardMetallic)" stroke="#64748b" stroke-width="2.5"/>
  <!-- Gold EMV Contact Chip -->
  <rect x="52" y="74" width="28" height="22" rx="4" fill="#facc15" stroke="#a16207" stroke-width="1.5"/>
  <line x1="52" y1="85" x2="80" y2="85" stroke="#a16207" stroke-width="1"/>
  <line x1="66" y1="74" x2="66" y2="96" stroke="#a16207" stroke-width="1"/>
  <!-- Contactless NFC Wave Icons -->
  <path d="M96 78 A10 10 0 0 1 96 92" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  <path d="M102 74 A16 16 0 0 1 102 96" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  <path d="M108 70 A22 22 0 0 1 108 100" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  <!-- Embossed Cardholder Text Bars -->
  <rect x="52" y="122" width="56" height="8" rx="2" fill="#94a3b8"/>
  <rect x="52" y="108" width="80" height="6" rx="2" fill="#64748b"/>
  <!-- Hologram Payment Brand Logo (Overlapping circles) -->
  <circle cx="138" cy="124" r="10" fill="#ef4444" fill-opacity="0.8"/>
  <circle cx="148" cy="124" r="10" fill="#f59e0b" fill-opacity="0.8"/>
</svg>`
  },
  {
    id: 'elem-diamond-hands-gem',
    title: 'Diamond Hands Sparkling Gem',
    category: '3D Elements',
    tags: 'diamond, gem, crystal, crypto, jewelry, brilliant, luxury, wealth',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="diamondCyan" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#bae6fd"/>
      <stop offset="0.5" stop-color="#38bdf8"/>
      <stop offset="1" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <!-- Faceted Crown & Pavilion -->
  <polygon points="62,60 138,60 166,94 100,164 34,94" fill="url(#diamondCyan)" stroke="#0369a1" stroke-width="3" stroke-linejoin="round"/>
  <!-- Crown Facet Triangles -->
  <polygon points="62,60 86,94 114,94 138,60" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
  <polygon points="62,60 34,94 86,94" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>
  <polygon points="138,60 114,94 166,94" fill="#7dd3fc" stroke="#0284c7" stroke-width="1.5"/>
  <!-- Lower Pavilion Ribs -->
  <polygon points="86,94 100,164 114,94" fill="#ffffff" fill-opacity="0.6"/>
  <line x1="34" y1="94" x2="166" y2="94" stroke="#0284c7" stroke-width="2"/>
  <!-- Sparkle Flashes -->
  <path d="M42 46 Q42 56 52 56 Q42 56 42 66 Q42 56 32 56 Q42 56 42 46 Z" fill="#ffffff"/>
  <path d="M156 40 Q156 50 166 50 Q156 50 156 60 Q156 50 146 50 Q156 50 156 40 Z" fill="#ffffff"/>
</svg>`
  },
  {
    id: 'elem-money-growth-tree',
    title: 'Financial Wealth Money Tree',
    category: 'Illustrations',
    tags: 'money, tree, wealth, growth, finance, coins, investment, eco, success',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Ceramic Planter Pot -->
  <polygon points="74,142 126,142 120,174 80,174" fill="#d97706" stroke="#92400e" stroke-width="3"/>
  <rect x="70" y="136" width="60" height="8" rx="3" fill="#b45309"/>
  <!-- Tree Trunk & Branches -->
  <path d="M100 136 V90 M100 110 C86 96 74 94 66 84 M100 102 C114 90 126 90 134 80" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
  <!-- Lush Green Foliage Pads -->
  <ellipse cx="66" cy="80" rx="16" ry="12" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <ellipse cx="134" cy="76" rx="16" ry="12" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <ellipse cx="100" cy="56" rx="22" ry="16" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <!-- Gold Coins Blooming on Tree -->
  <circle cx="100" cy="56" r="10" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <text x="96" y="60" fill="#78350f" font-weight="bold" font-size="11">$</text>
  <circle cx="66" cy="80" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="1.8"/>
  <circle cx="134" cy="76" r="8" fill="#facc15" stroke="#ca8a04" stroke-width="1.8"/>
</svg>`
  },
  {
    id: 'elem-stacked-gold-bullion',
    title: 'Stacked Pure Gold Bullion Bars',
    category: '3D Elements',
    tags: 'gold, bullion, bars, ingots, wealth, treasure, reserve, bank, luxury',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="barGoldTop" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fef08a"/>
      <stop offset="1" stop-color="#eab308"/>
    </linearGradient>
    <linearGradient id="barGoldSide" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#ca8a04"/>
      <stop offset="1" stop-color="#854d0e"/>
    </linearGradient>
  </defs>
  <!-- Bar 1 (Bottom Left) -->
  <g transform="translate(10, 20)">
    <polygon points="40,110 90,110 102,126 48,126" fill="url(#barGoldTop)"/>
    <polygon points="48,126 102,126 96,144 42,144" fill="url(#barGoldSide)"/>
  </g>
  <!-- Bar 2 (Bottom Right) -->
  <g transform="translate(56, 20)">
    <polygon points="40,110 90,110 102,126 48,126" fill="url(#barGoldTop)"/>
    <polygon points="48,126 102,126 96,144 42,144" fill="url(#barGoldSide)"/>
  </g>
  <!-- Bar 3 (Top Center) -->
  <g transform="translate(33, -14)">
    <polygon points="40,110 90,110 102,126 48,126" fill="url(#barGoldTop)" stroke="#78350f" stroke-width="1"/>
    <polygon points="48,126 102,126 96,144 42,144" fill="url(#barGoldSide)" stroke="#78350f" stroke-width="1"/>
    <!-- Stamp Mark 999.9 -->
    <rect x="58" y="115" width="22" height="6" rx="1" fill="#78350f" fill-opacity="0.5"/>
  </g>
  <!-- Golden Glint Sparkles -->
  <circle cx="82" cy="74" r="3" fill="#ffffff"/>
  <circle cx="146" cy="116" r="3" fill="#ffffff"/>
</svg>`
  },
  {
    id: 'elem-e-wallet-smartphone',
    title: 'Mobile Fintech Digital Wallet',
    category: 'UI Icons',
    tags: 'wallet, fintech, smartphone, mobile, payment, transfer, app, digital',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Smartphone Chassis -->
  <rect x="56" y="26" width="88" height="148" rx="16" fill="#0f172a" stroke="#334155" stroke-width="3"/>
  <!-- Phone Screen -->
  <rect x="64" y="38" width="72" height="124" rx="10" fill="#1e1b4b"/>
  <!-- Speaker Notch -->
  <line x1="90" y1="32" x2="110" y2="32" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
  <!-- Emerging Contactless Credit Card -->
  <rect x="72" y="60" width="56" height="42" rx="6" fill="#3b82f6" stroke="#93c5fd" stroke-width="1.5"/>
  <circle cx="84" cy="74" r="5" fill="#facc15"/>
  <line x1="78" y1="90" x2="114" y2="90" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <!-- Success Checkmark Bubble -->
  <circle cx="100" cy="128" r="16" fill="#10b981"/>
  <path d="M92 128 L98 134 L108 122" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },
  {
    id: 'elem-shopping-cart-drift',
    title: 'Turbo Speed Shopping Cart',
    category: 'UI Icons',
    tags: 'shopping cart, speed, ecommerce, store, basket, fast, checkout, drift',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Motion Blur Streaks -->
  <line x1="28" y1="76" x2="52" y2="76" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <line x1="22" y1="96" x2="48" y2="96" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="32" y1="116" x2="58" y2="116" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <!-- Push Handle Bar -->
  <path d="M54 62 L74 62 L88 120 H154 L168 68 H76" stroke="#f43f5e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Cart Wire Grid -->
  <line x1="94" y1="84" x2="160" y2="84" stroke="#f43f5e" stroke-width="2"/>
  <line x1="100" y1="102" x2="156" y2="102" stroke="#f43f5e" stroke-width="2"/>
  <line x1="114" y1="68" x2="104" y2="120" stroke="#f43f5e" stroke-width="2"/>
  <line x1="138" y1="68" x2="130" y2="120" stroke="#f43f5e" stroke-width="2"/>
  <!-- Fast Spinning Wheels -->
  <circle cx="96" cy="142" r="10" fill="#0f172a" stroke="#facc15" stroke-width="3"/>
  <circle cx="146" cy="142" r="10" fill="#0f172a" stroke="#facc15" stroke-width="3"/>
</svg>`
  },

  // --- 41 to 50: Gaming, Science & Nature Assets ---
  {
    id: 'elem-arcade-pixel-heart',
    title: 'Retro 8-Bit Pixel Heart',
    category: 'UI Icons',
    tags: 'pixel, heart, retro, 8bit, arcade, gaming, life, health, hp',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Pixelated Stepped Heart Silhouette -->
  <path d="M60 40 H90 V55 H110 V40 H140 V70 H155 V100 H140 V115 H125 V130 H110 V145 H90 V130 H75 V115 H60 V100 H45 V70 H60 V40 Z" fill="#ef4444" stroke="#991b1b" stroke-width="4"/>
  <!-- Inner Pixel Highlight -->
  <rect x="65" y="55" width="15" height="15" fill="#ffffff"/>
  <rect x="80" y="55" width="10" height="15" fill="#fca5a5"/>
  <rect x="65" y="70" width="15" height="15" fill="#fca5a5"/>
</svg>`
  },
  {
    id: 'elem-level-up-chevron',
    title: 'Level Up Cyber Chevron',
    category: 'UI Icons',
    tags: 'level up, chevron, arrow, rank, gaming, boost, upgrade, neon',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Bottom Chevron Arrow -->
  <path d="M52 152 L100 114 L148 152 L148 132 L100 94 L52 132 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
  <!-- Middle Chevron Arrow -->
  <path d="M52 114 L100 76 L148 114 L148 94 L100 56 L52 94 Z" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>
  <!-- Top Pinnacle Glowing Arrow -->
  <path d="M52 76 L100 38 L148 76 L148 56 L100 18 L52 56 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="2.5"/>
</svg>`
  },
  {
    id: 'elem-cyber-skull-emblem',
    title: 'Mecha Cyber Skull Crest',
    category: 'Badges & Stickers',
    tags: 'skull, mecha, cyber, esports, gaming, tactical, robot, badge, clan',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="skullGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#334155"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Angular Robotic Skull Cranium -->
  <path d="M60 44 L100 26 L140 44 L162 84 L148 126 L134 126 L134 166 L100 174 L66 166 L66 126 L52 126 L38 84 Z" fill="url(#skullGrad)" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>
  <!-- Glowing Hex Eye Sockets -->
  <polygon points="72,82 86,74 94,86 88,100 74,98" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5"/>
  <polygon points="128,82 114,74 106,86 112,100 126,98" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Nasal Bridge Slot -->
  <polygon points="100,102 106,116 94,116" fill="#38bdf8"/>
  <!-- Mechanical Teeth Grille -->
  <line x1="82" y1="138" x2="82" y2="156" stroke="#38bdf8" stroke-width="3"/>
  <line x1="100" y1="138" x2="100" y2="158" stroke="#38bdf8" stroke-width="3"/>
  <line x1="118" y1="138" x2="118" y2="156" stroke="#38bdf8" stroke-width="3"/>
</svg>`
  },
  {
    id: 'elem-champions-trophy-cup',
    title: 'Grand Champions Gold Trophy',
    category: 'Awards',
    tags: 'trophy, cup, champion, award, victory, winner, first place, tournament',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="trophyCupGold" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.5" stop-color="#eab308"/>
      <stop offset="1" stop-color="#a16207"/>
    </linearGradient>
  </defs>
  <!-- Heavy Marble Pedestal Base -->
  <rect x="68" y="160" width="64" height="18" rx="4" fill="#1e293b" stroke="#ca8a04" stroke-width="2"/>
  <rect x="78" y="148" width="44" height="12" fill="#ca8a04"/>
  <!-- Trophy Stem -->
  <path d="M92 120 H108 L104 148 H96 Z" fill="url(#trophyCupGold)" stroke="#78350f" stroke-width="2"/>
  <!-- Left Curved Handle -->
  <path d="M68 54 C46 54 44 92 70 102" stroke="url(#trophyCupGold)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Right Curved Handle -->
  <path d="M132 54 C154 54 156 92 130 102" stroke="url(#trophyCupGold)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Main Goblet Chalice Body -->
  <path d="M64 42 H136 V82 C136 108 118 120 100 120 C82 120 64 108 64 82 Z" fill="url(#trophyCupGold)" stroke="#78350f" stroke-width="3"/>
  <!-- #1 Star Inset on Trophy -->
  <circle cx="100" cy="74" r="16" fill="#78350f"/>
  <polygon points="100,64 104,71 112,71 106,76 108,83 100,79 92,83 94,76 88,71 96,71" fill="#fde047"/>
</svg>`
  },
  {
    id: 'elem-airdrop-loot-crate',
    title: 'Airdrop Supply Loot Crate',
    category: 'UI Icons',
    tags: 'airdrop, crate, loot, box, parachute, gaming, survival, battle royale',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Parachute Canopy -->
  <path d="M44 66 C44 32 156 32 156 66 C136 66 126 56 100 56 C74 56 64 66 44 66 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
  <!-- White Parachute Center Strip -->
  <path d="M84 64 C90 58 100 56 116 64 C110 50 90 50 84 64 Z" fill="#ffffff"/>
  <!-- Suspension Suspension Cords -->
  <line x1="44" y1="66" x2="72" y2="108" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="78" y1="62" x2="86" y2="108" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="122" y1="62" x2="114" y2="108" stroke="#e2e8f0" stroke-width="1.5"/>
  <line x1="156" y1="66" x2="128" y2="108" stroke="#e2e8f0" stroke-width="1.5"/>
  <!-- Reinforced Military Crate -->
  <rect x="70" y="108" width="60" height="58" rx="6" fill="#1e3a8a" stroke="#172554" stroke-width="2.5"/>
  <rect x="70" y="108" width="60" height="14" fill="#dc2626"/>
  <!-- Diagonal Hazard Webbing -->
  <line x1="70" y1="122" x2="130" y2="166" stroke="#facc15" stroke-width="3"/>
  <line x1="130" y1="122" x2="70" y2="166" stroke="#facc15" stroke-width="3"/>
</svg>`
  },
  {
    id: 'elem-gamepad-neo-controller',
    title: 'Wireless E-Sports Gamepad',
    category: 'UI Icons',
    tags: 'gamepad, controller, console, gaming, joystick, playstation, xbox, gamer',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="padGrad" x1="40" y1="60" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <!-- Ergonomic Controller Shell Grips -->
  <path d="M52 64 C64 64 76 74 100 74 C124 74 136 64 148 64 C166 64 176 84 168 136 C164 158 142 164 130 144 L118 126 H82 L70 144 C58 164 36 158 32 136 C24 84 34 64 52 64 Z" fill="url(#padGrad)" stroke="#38bdf8" stroke-width="3"/>
  <!-- Left D-Pad Cross -->
  <rect x="58" y="94" width="8" height="24" rx="2" fill="#64748b"/>
  <rect x="50" y="102" width="24" height="8" rx="2" fill="#64748b"/>
  <!-- Right Action Buttons (A, B, X, Y) -->
  <circle cx="134" cy="94" r="4.5" fill="#f43f5e"/>
  <circle cx="146" cy="106" r="4.5" fill="#38bdf8"/>
  <circle cx="134" cy="118" r="4.5" fill="#10b981"/>
  <circle cx="122" cy="106" r="4.5" fill="#facc15"/>
  <!-- Dual Analog Thumbsticks -->
  <circle cx="82" cy="120" r="11" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
  <circle cx="118" cy="120" r="11" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
</svg>`
  },
  {
    id: 'elem-turbo-nitrous-flame',
    title: 'Nitrous Turbo Speed Boost',
    category: 'UI Icons',
    tags: 'turbo, boost, nitro, speed, flame, racing, fast, energy',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Speed Velocity Streaks -->
  <line x1="24" y1="68" x2="68" y2="68" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
  <line x1="18" y1="100" x2="78" y2="100" stroke="#06b6d4" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="26" y1="132" x2="72" y2="132" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>
  <!-- High Pressure Nitrous Blue Jet Flame -->
  <path d="M74 100 C100 68 136 68 182 100 C136 132 100 132 74 100 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2.5"/>
  <!-- Core White Heat Needle -->
  <path d="M102 100 C120 84 144 84 174 100 C144 116 120 116 102 100 Z" fill="#ffffff"/>
  <!-- Shock Diamonds in Exhaust Wave -->
  <polygon points="126,94 134,100 126,106 118,100" fill="#38bdf8"/>
  <polygon points="152,95 158,100 152,105 146,100" fill="#38bdf8"/>
</svg>`
  },
  {
    id: 'elem-atom-quantum-orbit',
    title: 'Atomic Physics Quantum Orbit',
    category: 'Cyber & Tech',
    tags: 'atom, science, physics, quantum, nuclear, orbit, chemistry, energy',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Three Intersecting Orbital Rings -->
  <ellipse cx="100" cy="100" rx="72" ry="24" stroke="#38bdf8" stroke-width="2.5"/>
  <ellipse cx="100" cy="100" rx="72" ry="24" stroke="#a855f7" stroke-width="2.5" transform="rotate(60 100 100)"/>
  <ellipse cx="100" cy="100" rx="72" ry="24" stroke="#10b981" stroke-width="2.5" transform="rotate(120 100 100)"/>
  <!-- Orbiting Electrons -->
  <circle cx="168" cy="100" r="5" fill="#38bdf8"/>
  <circle cx="66" cy="42" r="5" fill="#a855f7"/>
  <circle cx="66" cy="158" r="5" fill="#10b981"/>
  <!-- Central Nucleus Proton Cluster -->
  <circle cx="100" cy="100" r="14" fill="#f43f5e" stroke="#ffffff" stroke-width="2"/>
  <circle cx="95" cy="94" r="5" fill="#fde047"/>
  <circle cx="106" cy="104" r="5" fill="#fde047"/>
</svg>`
  },
  {
    id: 'elem-solar-eco-sunburst',
    title: 'Solar Clean Energy Sun',
    category: 'Illustrations',
    tags: 'sun, solar, eco, green energy, clean, renewable, environment, power',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="sunGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fde047"/>
      <stop offset="0.6" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <!-- Geometric Photovoltaic Radiant Rays -->
  <g stroke="#f59e0b" stroke-width="4" stroke-linecap="round">
    <line x1="100" y1="20" x2="100" y2="40"/>
    <line x1="100" y1="160" x2="100" y2="180"/>
    <line x1="20" y1="100" x2="40" y2="100"/>
    <line x1="160" y1="100" x2="180" y2="100"/>
    <line x1="44" y1="44" x2="58" y2="58"/>
    <line x1="142" y1="142" x2="156" y2="156"/>
    <line x1="156" y1="44" x2="142" y2="58"/>
    <line x1="44" y1="156" x2="58" y2="142"/>
  </g>
  <!-- Central Sun Disc -->
  <circle cx="100" cy="100" r="46" fill="url(#sunGrad)" stroke="#b45309" stroke-width="3"/>
  <!-- Eco Sprout Leaf Silhouette in Sun -->
  <path d="M100 72 C116 72 124 88 124 104 C108 104 100 88 100 72 Z" fill="#15803d"/>
  <path d="M100 104 C100 120 84 128 76 128 C76 112 92 104 100 104 Z" fill="#16a34a"/>
</svg>`
  },
  {
    id: 'elem-dna-double-helix',
    title: 'Biotech DNA Double Helix',
    category: 'Cyber & Tech',
    tags: 'dna, genetics, biology, science, biotech, medical, medicine, health',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- Double Helix Curving Strands -->
  <path d="M60 30 Q100 65 140 100 Q100 135 60 170" stroke="#06b6d4" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M140 30 Q100 65 60 100 Q100 135 140 170" stroke="#a855f7" stroke-width="4.5" stroke-linecap="round"/>
  <!-- Connecting Genetic Base Pairs -->
  <line x1="72" y1="45" x2="128" y2="45" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <line x1="88" y1="72" x2="112" y2="72" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
  <line x1="96" y1="100" x2="104" y2="100" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <line x1="88" y1="128" x2="112" y2="128" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
  <line x1="72" y1="155" x2="128" y2="155" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
  <!-- Base Pair Nodes -->
  <circle cx="72" cy="45" r="4.5" fill="#06b6d4"/>
  <circle cx="128" cy="45" r="4.5" fill="#a855f7"/>
  <circle cx="72" cy="155" r="4.5" fill="#06b6d4"/>
  <circle cx="128" cy="155" r="4.5" fill="#a855f7"/>
</svg>`
  }
];

console.log('Total SVG assets to generate:', SVG_ASSET_ITEMS.length);

// Write to src/svgAssetItemsData.js
const fileContent = `// 50 Hand-Crafted Premium SVG Asset Items for Iconderry
export const SVG_ASSET_ITEMS = ${JSON.stringify(SVG_ASSET_ITEMS, null, 2)};
`;

fs.writeFileSync('src/svgAssetItemsData.js', fileContent, 'utf8');
console.log('Successfully written src/svgAssetItemsData.js');
