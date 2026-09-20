export const INITIAL_ELEMENTS = [
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
    <filter id="glassGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Outer Glass Diamond Cushion -->
  <rect x="36" y="36" width="128" height="128" rx="38" transform="rotate(45 100 100)" fill="url(#glassDiamondGrad)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.8" filter="url(#glassGlow)"/>
  <!-- Specular Top Reflection -->
  <path d="M 64 64 C 84 44 116 44 136 64 C 110 75 90 75 64 64 Z" fill="#ffffff" fill-opacity="0.4"/>
  <!-- Inner Rainbow Spectrum Diamond Core -->
  <rect x="58" y="58" width="84" height="84" rx="22" transform="rotate(45 100 100)" fill="url(#prismRainbow)"/>
  <!-- Vector Coordinate Crosshair & Nodes -->
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
    <filter id="folderGlow" x="-20%" y="-20%" width="140%" height="140%">
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
    category: 'Badges',
    tags: 'shield, check, security, green',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="shieldGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10B981"/>
      <stop offset="1" stop-color="#047857"/>
    </linearGradient>
    <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
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
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
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
  }
];