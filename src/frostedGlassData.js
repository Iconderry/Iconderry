// 20 Layered Frosted Glassmorphism Icons (Productivity & Social)
// Inspired by Apple VisionOS & Microsoft Fluent Acrylic duo-tone aesthetic:
// Solid vibrant cobalt base + translucent frosted glass plate + crisp white rim light + clean glyphs

export const FROSTED_GLASS_ELEMENTS = [
  // ==========================================
  // SECTION 1: PRODUCTIVITY & OFFICE GLASS (10)
  // ==========================================

  // 1. Frosted Glass Folder
  {
    id: 'glass-folder-tabs',
    title: 'Frosted Glass Folder',
    category: 'Productivity Glass',
    tags: 'folder, file, office, storage, glass, frosted, acrylic, blue, productivity',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gFoldBack" x1="40" y1="50" x2="160" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gFoldGlass" x1="30" y1="75" x2="170" y2="165" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="gFoldBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Back Solid Tab & Folder Base -->
  <path d="M42 62 C42 55 47 50 54 50 L84 50 C90 50 95 54 98 58 L106 68 L152 68 C159 68 164 73 164 80 L164 142 C164 149 159 154 152 154 L48 154 C41 154 36 149 36 142 Z" fill="url(#gFoldBack)"/>
  <!-- Frosted Front Glass Envelope Flap -->
  <rect x="36" y="80" width="128" height="74" rx="14" fill="url(#gFoldGlass)" stroke="#ffffff" stroke-width="2.2" stroke-opacity="0.75" filter="url(#gFoldBlur)"/>
  <!-- Front File Info White Glyphs -->
  <line x1="56" y1="108" x2="108" y2="108" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="56" y1="124" x2="92" y2="124" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 2. 3D Glass Paperclip
  {
    id: 'glass-paperclip-3d',
    title: '3D Glossy Acrylic Paperclip',
    category: 'Productivity Glass',
    tags: 'paperclip, clip, attach, document, office, 3d, frosted, acrylic, lavender',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gClipGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.35" stop-color="#c7d2fe"/>
      <stop offset="0.7" stop-color="#818cf8"/>
      <stop offset="1" stop-color="#4f46e5"/>
    </linearGradient>
    <filter id="gClipGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <!-- Background Drop Shadow Stroke -->
  <path d="M72 136 L124 84 C138 70 156 88 142 102 L86 158 C62 182 32 152 56 128 L118 66 C138 46 168 76 148 96 L98 146" stroke="#1e1b4b" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
  <!-- Main 3D Tube Body -->
  <path d="M72 134 L124 82 C138 68 156 86 142 100 L86 156 C62 180 32 150 56 126 L118 64 C138 44 168 74 148 94 L98 144" stroke="url(#gClipGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" filter="url(#gClipGlow)"/>
  <!-- Specular Core Rim Highlight -->
  <path d="M74 132 L126 80 C138 68 154 84 142 96 L86 152 C64 174 36 146 58 124 L120 62" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85"/>
</svg>`
  },

  // 3. Frosted Glass Browser Window
  {
    id: 'glass-browser-window',
    title: 'Frosted Glass Browser Window',
    category: 'Productivity Glass',
    tags: 'browser, window, web, chrome, app, macos, frosted, glass, acrylic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gWinBorder" x1="30" y1="35" x2="170" y2="165" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="0.4" stop-color="#c7d2fe" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="gWinFill" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0f172a" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <!-- Window Glass Slab -->
  <rect x="36" y="42" width="128" height="116" rx="18" fill="url(#gWinFill)" stroke="url(#gWinBorder)" stroke-width="8"/>
  <!-- Titlebar Separator Glass Shelf -->
  <line x1="38" y1="74" x2="162" y2="74" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.4"/>
  <!-- 3 macOS Window Controls Dots -->
  <circle cx="56" cy="58" r="4.5" fill="#f87171"/>
  <circle cx="70" cy="58" r="4.5" fill="#fbbf24"/>
  <circle cx="84" cy="58" r="4.5" fill="#34d399"/>
  <!-- Browser Address URL Pill Glass -->
  <rect x="100" y="52" width="52" height="12" rx="6" fill="#ffffff" fill-opacity="0.2" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4"/>
  <!-- Inner Content Silhouette Area -->
  <rect x="52" y="90" width="96" height="52" rx="10" fill="#38bdf8" fill-opacity="0.08" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.25"/>
</svg>`
  },

  // 4. 3D Stacked Isometric Layers
  {
    id: 'glass-isometric-layers',
    title: '3D Stacked Isometric Layers',
    category: 'Productivity Glass',
    tags: 'layers, stack, isometric, design, figma, system, frosted, acrylic, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gIsoSolid" x1="40" y1="120" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gIsoMid" x1="40" y1="80" x2="160" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="gIsoTop" x1="40" y1="40" x2="160" y2="90" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#93c5fd" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <!-- Bottom Solid Plate -->
  <polygon points="100,122 168,148 100,174 32,148" fill="url(#gIsoSolid)"/>
  <polygon points="100,122 168,148 100,174 32,148" stroke="#93c5fd" stroke-width="1.5" stroke-opacity="0.6"/>
  <!-- Middle Translucent Plate -->
  <polygon points="100,82 168,108 100,134 32,108" fill="url(#gIsoMid)"/>
  <polygon points="100,82 168,108 100,134 32,108" stroke="#ffffff" stroke-width="2" stroke-opacity="0.75"/>
  <!-- Top Frosted Glass Plate -->
  <polygon points="100,42 168,68 100,94 32,68" fill="url(#gIsoTop)"/>
  <polygon points="100,42 168,68 100,94 32,68" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.95"/>
  <!-- Top Accent Angle Chevron -->
  <polyline points="90,64 100,58 110,64" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },

  // 5. 3D Floating Glass Disks
  {
    id: 'glass-stacked-disks',
    title: '3D Floating Glass Disks',
    category: 'Productivity Glass',
    tags: 'disks, stack, cylinder, database, storage, frosted, blue, acrylic, 3d',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gDiskSolid" x1="40" y1="120" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="gDiskMid" x1="40" y1="80" x2="160" y2="130" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="gDiskTop" x1="40" y1="40" x2="160" y2="90" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#93c5fd" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <!-- Bottom Solid Disk -->
  <ellipse cx="100" cy="148" rx="64" ry="24" fill="url(#gDiskSolid)" stroke="#93c5fd" stroke-width="1.8" stroke-opacity="0.7"/>
  <!-- Middle Disk -->
  <ellipse cx="100" cy="104" rx="64" ry="24" fill="url(#gDiskMid)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.75"/>
  <!-- Top Frosted Disk -->
  <ellipse cx="100" cy="60" rx="64" ry="24" fill="url(#gDiskTop)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.9"/>
  <!-- Frosted Gleam Arc -->
  <path d="M50 56 A60 20 0 0 1 128 44" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.8"/>
</svg>`
  },

  // 6. Neon Acrylic Chiseled Pencil
  {
    id: 'glass-stylus-pencil',
    title: 'Neon Acrylic Chiseled Pencil',
    category: 'Productivity Glass',
    tags: 'pencil, edit, write, stylus, design, tool, blue, frosted, neon',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gPenBody" x1="60" y1="40" x2="150" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa"/>
      <stop offset="0.5" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <g transform="rotate(45 100 100)">
    <!-- Back Eraser / Cap Slab -->
    <rect x="80" y="32" width="40" height="20" rx="6" fill="#93c5fd" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
    <!-- Pencil Main Shaft Body -->
    <rect x="80" y="58" width="40" height="84" rx="8" fill="url(#gPenBody)" stroke="#93c5fd" stroke-width="2"/>
    <!-- Twin Neon White Glow Lines -->
    <line x1="94" y1="70" x2="94" y2="130" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="106" y1="70" x2="106" y2="130" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
    <!-- Chiseled Tip Cone -->
    <polygon points="80,146 120,146 100,180" fill="#1e40af" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.75"/>
    <polygon points="92,166 108,166 100,180" fill="#ffffff"/>
  </g>
</svg>`
  },

  // 7. Frosted Glass Document with Folded Corner
  {
    id: 'glass-document-lines',
    title: 'Frosted Glass Document',
    category: 'Productivity Glass',
    tags: 'document, file, paper, text, note, office, frosted, glass, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gDocBack" x1="60" y1="40" x2="160" y2="170" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="gDocFront" x1="40" y1="40" x2="140" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="0.4" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <!-- Solid Blue Back Paper Sheet (Offset Behind) -->
  <path d="M72 40 L144 40 C150 40 156 46 156 52 L156 160 C156 166 150 172 144 172 L72 172 C66 172 60 166 60 160 L60 52 C60 46 66 40 72 40 Z" fill="url(#gDocBack)"/>
  <!-- Frosted Glass Front Paper Sheet (Tilted Foreground) -->
  <path d="M48 32 L112 32 L138 58 L138 152 C138 158 132 164 126 164 L48 164 C42 164 36 158 36 152 L36 44 C36 38 42 32 48 32 Z" fill="url(#gDocFront)" stroke="#ffffff" stroke-width="2.2" stroke-opacity="0.8"/>
  <!-- Folded Corner Triangle -->
  <polygon points="112,32 138,58 112,58" fill="#ffffff" fill-opacity="0.45" stroke="#ffffff" stroke-width="1.5"/>
  <!-- Document White Text Lines -->
  <line x1="56" y1="78" x2="108" y2="78" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="56" y1="96" x2="118" y2="96" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="56" y1="114" x2="98" y2="114" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 8. Frosted Acrylic Pushpin
  {
    id: 'glass-pushpin-marker',
    title: 'Frosted Acrylic Pushpin',
    category: 'Productivity Glass',
    tags: 'pin, pushpin, tack, memo, note, location, blue, frosted, acrylic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gPinHead" x1="60" y1="35" x2="140" y2="115" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0.45"/>
    </linearGradient>
    <linearGradient id="gPinNeedle" x1="100" y1="120" x2="100" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <!-- Sharp Pin Needle Point -->
  <path d="M96 110 L104 110 L102 176 C102 179 98 179 98 176 Z" fill="url(#gPinNeedle)"/>
  <!-- Pushpin Tapered Acrylic Grip Body -->
  <path d="M68 50 C68 44 74 38 80 38 L120 38 C126 38 132 44 132 50 L126 70 C124 76 130 84 136 90 L144 100 C146 104 144 110 138 110 L62 110 C56 110 54 104 56 100 L64 90 C70 84 76 76 74 70 Z" fill="url(#gPinHead)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Horizontal White Specular Bands -->
  <line x1="82" y1="76" x2="118" y2="76" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="76" y1="94" x2="124" y2="94" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 9. Duo-Layer Price & File Tags
  {
    id: 'glass-double-tags',
    title: 'Duo-Layer Price & File Tags',
    category: 'Productivity Glass',
    tags: 'tag, price, label, ticket, metadata, blue, frosted, acrylic, duo',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gTagBack" x1="80" y1="40" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gTagFront" x1="40" y1="40" x2="130" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.4" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Solid Blue Back Tag (Tilted Right) -->
  <g transform="rotate(18 135 105)">
    <path d="M105 40 L135 40 L155 64 L155 146 C155 152 149 158 143 158 L97 158 C91 158 85 152 85 146 L85 64 Z" fill="url(#gTagBack)"/>
    <circle cx="120" cy="56" r="5" fill="#ffffff" fill-opacity="0.7"/>
  </g>
  <!-- Frosted Front Tag -->
  <path d="M68 40 L98 40 L122 66 L122 152 C122 158 116 164 110 164 L56 164 C50 164 44 158 44 152 L44 66 Z" fill="url(#gTagFront)" stroke="#ffffff" stroke-width="2.2" stroke-opacity="0.8"/>
  <circle cx="83" cy="54" r="5.5" fill="#1e40af" stroke="#ffffff" stroke-width="2"/>
  <!-- Front Text Lines -->
  <line x1="60" y1="90" x2="106" y2="90" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="60" y1="108" x2="106" y2="108" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="60" y1="126" x2="90" y2="126" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 10. Frosted Glass Color Swatch Fan
  {
    id: 'glass-color-swatches',
    title: 'Frosted Glass Color Swatch Fan',
    category: 'Productivity Glass',
    tags: 'swatches, palette, color, design, art, fan, figma, frosted, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gSwatchSolid" x1="40" y1="50" x2="90" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gSwatchGlass" x1="80" y1="40" x2="170" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.4" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#60a5fa" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Left Solid Blue Swatch Blade -->
  <rect x="42" y="44" width="46" height="114" rx="8" fill="url(#gSwatchSolid)"/>
  <!-- Right Angled Frosted Glass Swatch Blade -->
  <g transform="rotate(35 65 145)">
    <rect x="42" y="44" width="46" height="114" rx="8" fill="url(#gSwatchGlass)" stroke="#ffffff" stroke-width="2.2" stroke-opacity="0.85"/>
  </g>
  <!-- Pivot Binding Ring Node -->
  <circle cx="65" cy="142" r="7.5" fill="#1e1b4b" stroke="#ffffff" stroke-width="2.5"/>
</svg>`
  },

  // ==========================================
  // SECTION 2: SOCIAL & COMMUNICATION GLASS (10)
  // ==========================================

  // 11. Duo-Layer Frosted Chat Bubbles
  {
    id: 'glass-chat-bubbles-duo',
    title: 'Duo-Layer Frosted Chat Bubbles',
    category: 'Social Glass',
    tags: 'chat, message, bubbles, speech, conversation, social, frosted, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gChatBack" x1="80" y1="50" x2="170" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563eb"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gChatFront" x1="30" y1="40" x2="140" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.4" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#3b82f6" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Back Solid Bubble (Right-Offset) -->
  <path d="M105 70 C105 50 125 38 145 38 C165 38 178 50 178 70 C178 86 166 98 150 101 L154 116 L138 102 C118 102 105 90 105 70 Z" fill="url(#gChatBack)"/>
  <!-- Front Frosted Glass Speech Bubble -->
  <path d="M38 78 C38 52 58 38 88 38 C118 38 138 52 138 78 C138 98 122 114 100 118 L94 136 L78 118 C50 118 38 102 38 78 Z" fill="url(#gChatFront)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Front Message Lines -->
  <line x1="62" y1="70" x2="114" y2="70" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="62" y1="84" x2="114" y2="84" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="62" y1="98" x2="94" y2="98" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 12. Frosted Typing Dots Speech Bubble
  {
    id: 'glass-typing-bubble',
    title: 'Frosted Typing Dots Bubble',
    category: 'Social Glass',
    tags: 'typing, dots, chat, speech, conversation, messenger, frosted, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gTypeGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="0.3" stop-color="#60a5fa" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="gTypeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <!-- Frosted Rounded Speech Body -->
  <path d="M42 56 C42 45 52 36 65 36 L135 36 C148 36 158 45 158 56 L158 108 C158 119 148 128 135 128 L108 128 L100 156 L88 128 L65 128 C52 128 42 119 42 108 Z" fill="url(#gTypeGrad)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.8" filter="url(#gTypeGlow)"/>
  <!-- 3 Glowing White Typing Dots -->
  <circle cx="76" cy="82" r="7" fill="#ffffff"/>
  <circle cx="100" cy="82" r="7" fill="#ffffff"/>
  <circle cx="124" cy="82" r="7" fill="#ffffff"/>
</svg>`
  },

  // 13. 3D Acrylic Share / Export Box
  {
    id: 'glass-share-box-arrow',
    title: '3D Acrylic Share Box',
    category: 'Social Glass',
    tags: 'share, upload, export, publish, arrow, box, social, acrylic, frosted',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gBoxGrad" x1="40" y1="70" x2="160" y2="180" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="0.4" stop-color="#c7d2fe" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0.5"/>
    </linearGradient>
    <linearGradient id="gArrowGrad" x1="100" y1="20" x2="100" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.4" stop-color="#93c5fd"/>
      <stop offset="1" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <!-- Open Receptacle Square Frame -->
  <path d="M72 84 L56 84 C50 84 46 88 46 94 L46 156 C46 162 50 166 56 166 L144 166 C150 166 154 162 154 156 L154 94 C154 88 150 84 144 84 L128 84" stroke="url(#gBoxGrad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Dynamic Upward Pointing 3D Arrow -->
  <path d="M100 26 L134 66 L114 66 L114 126 C114 129 111 132 108 132 L92 132 C89 132 86 129 86 126 L86 66 L66 66 Z" fill="url(#gArrowGrad)" stroke="#ffffff" stroke-width="2.5"/>
  <!-- Specular Reflection on Arrow Ridge -->
  <line x1="100" y1="36" x2="100" y2="122" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-opacity="0.85"/>
</svg>`
  },

  // 14. Frosted Video Conference Camera
  {
    id: 'glass-video-cam',
    title: 'Frosted Video Conference Camera',
    category: 'Social Glass',
    tags: 'video, camera, call, conference, zoom, meet, frosted, blue, glass',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gCamSolid" x1="40" y1="60" x2="170" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gCamGlass" x1="30" y1="50" x2="140" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Background Solid Camera Body & Lens Cone -->
  <path d="M136 86 L168 66 C173 63 178 66 178 72 L178 128 C178 134 173 137 168 134 L136 114 Z" fill="url(#gCamSolid)"/>
  <!-- Top Audio Sensor / Dual Microphones -->
  <circle cx="64" cy="54" r="10" fill="url(#gCamSolid)"/>
  <circle cx="88" cy="50" r="12" fill="url(#gCamSolid)"/>
  <!-- Frosted Front Camera Slab -->
  <rect x="34" y="66" width="102" height="76" rx="16" fill="url(#gCamGlass)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Front Lens Twin White Specular Highlights -->
  <line x1="52" y1="88" x2="80" y2="88" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="52" y1="102" x2="68" y2="102" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
</svg>`
  },

  // 15. Studio Projector & Light Beam
  {
    id: 'glass-stream-projector',
    title: 'Studio Projector & Light Beam',
    category: 'Social Glass',
    tags: 'projector, beam, stream, cinema, light, show, broadcast, frosted, blue',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gProjBeam" x1="100" y1="100" x2="175" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#93c5fd" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="gProjBody" x1="30" y1="60" x2="120" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <!-- Forward Translucent Light Ray Cone -->
  <polygon points="120,84 178,60 178,140 120,116" fill="url(#gProjBeam)"/>
  <!-- Projector Base Rig -->
  <rect x="36" y="68" width="90" height="64" rx="14" fill="url(#gProjBody)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Curved Lens Glare Arc -->
  <path d="M52 82 A14 14 0 0 1 66 96" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
  <!-- Right Lens Aperture Cap -->
  <path d="M126 86 C126 82 130 80 134 82 L144 88 C148 90 148 110 144 112 L134 118 C130 120 126 118 126 114 Z" fill="#60a5fa"/>
</svg>`
  },

  // 16. Frosted Specular Heart
  {
    id: 'glass-specular-heart',
    title: 'Frosted Specular Heart',
    category: 'Social Glass',
    tags: 'heart, like, love, favorite, reaction, social, frosted, blue, acrylic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gHeartSolid" x1="80" y1="40" x2="170" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gHeartGlass" x1="40" y1="40" x2="150" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.6"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <!-- Solid Blue Heart Base (Right Half Dominant) -->
  <path d="M100 162 C70 140 40 110 40 76 C40 52 58 36 80 36 C96 36 108 46 114 54 C120 46 132 36 148 36 C170 36 188 52 188 76 C188 110 158 140 128 162 Z" fill="url(#gHeartSolid)"/>
  <!-- Frosted Glass Heart Overlay (Left Tilted) -->
  <path d="M88 152 C62 132 36 106 36 74 C36 52 52 38 72 38 C88 38 98 48 104 56 C110 48 120 38 136 38 C156 38 172 52 172 74 C172 106 146 132 120 152 Z" fill="url(#gHeartGlass)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Specular Pill Glare Reflection -->
  <line x1="68" y1="124" x2="84" y2="140" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
  <circle cx="94" cy="148" r="3.5" fill="#ffffff"/>
</svg>`
  },

  // 17. Frosted Glass Clock / Timer
  {
    id: 'glass-time-chronos',
    title: 'Frosted Glass Clock / Timer',
    category: 'Social Glass',
    tags: 'clock, time, timer, schedule, watch, frosted, blue, acrylic, social',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gClockSolid" x1="100" y1="50" x2="170" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gClockGlass" x1="40" y1="40" x2="150" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.4" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Solid Blue Offset Circular Backdrop (Right) -->
  <circle cx="128" cy="100" r="48" fill="url(#gClockSolid)"/>
  <!-- Frosted Glass Main Clock Face -->
  <circle cx="88" cy="100" r="54" fill="url(#gClockGlass)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Crisp 90-Degree White Clock Hands -->
  <polyline points="88,68 88,100 114,100" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Center Pin Node -->
  <circle cx="88" cy="100" r="4" fill="#ffffff"/>
</svg>`
  },

  // 18. Frosted Cloud with Inbound Arrow
  {
    id: 'glass-cloud-download',
    title: 'Frosted Cloud with Inbound Arrow',
    category: 'Social Glass',
    tags: 'cloud, download, save, sync, storage, arrow, blue, frosted, acrylic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gCloudSolid" x1="50" y1="50" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <filter id="gCloudGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <!-- Fluffy Cloud Base -->
  <path d="M60 148 C42 148 32 134 32 118 C32 104 42 94 54 92 C56 70 74 54 98 54 C120 54 138 68 142 88 C156 90 168 102 168 116 C168 134 154 148 138 148 Z" fill="url(#gCloudSolid)" filter="url(#gCloudGlow)"/>
  <!-- Frosted Glass Rim Contour -->
  <path d="M60 148 C42 148 32 134 32 118 C32 104 42 94 54 92 C56 70 74 54 98 54 C120 54 138 68 142 88 C156 90 168 102 168 116 C168 134 154 148 138 148 Z" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.7"/>
  <!-- White Inbound Download Arrow -->
  <line x1="100" y1="92" x2="100" y2="128" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
  <polyline points="88,118 100,130 112,118" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },

  // 19. Frosted Acrylic Verified Badge
  {
    id: 'glass-verified-check',
    title: 'Frosted Acrylic Verified Badge',
    category: 'Social Glass',
    tags: 'verified, check, badge, ok, success, trust, blue, frosted, acrylic',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gVerSolid" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="gVerGlass" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="0.3" stop-color="#93c5fd" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#2563eb" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <!-- Top Specular Capsule Pill Accent -->
  <rect x="86" y="32" width="28" height="8" rx="4" fill="#93c5fd" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.8"/>
  <!-- Solid Blue Circular Glow Base -->
  <circle cx="100" cy="112" r="48" fill="url(#gVerSolid)"/>
  <!-- Frosted Outer Ring & Glass Lens -->
  <circle cx="100" cy="112" r="54" fill="url(#gVerGlass)" stroke="#ffffff" stroke-width="2.5" stroke-opacity="0.85"/>
  <!-- Crisp Pure White Checkmark -->
  <polyline points="82,112 94,124 118,98" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
  },

  // 20. Frosted 4-Point AI Sparkle Star
  {
    id: 'glass-magic-sparkle',
    title: 'Frosted 4-Point AI Sparkle Star',
    category: 'Social Glass',
    tags: 'sparkle, star, ai, magic, viral, feature, highlight, white, frosted',
    svgCode: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <defs>
    <linearGradient id="gStarGrad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#e0e7ff"/>
      <stop offset="1" stop-color="#c7d2fe"/>
    </linearGradient>
    <filter id="gStarGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="glow"/>
      <feComposite in="SourceGraphic" in2="glow" operator="over"/>
    </filter>
  </defs>
  <!-- Soft Ambient Glow Silhouette Behind -->
  <path d="M100 22 C100 66 134 100 178 100 C134 100 100 134 100 178 C100 134 66 100 22 100 C66 100 100 66 100 22 Z" fill="#60a5fa" opacity="0.35" filter="url(#gStarGlow)"/>
  <!-- Main 4-Point Glossy White Sparkle Star -->
  <path d="M100 26 C100 66 134 100 174 100 C134 100 100 134 100 174 C100 134 66 100 26 100 C66 100 100 66 100 26 Z" fill="url(#gStarGrad)" stroke="#ffffff" stroke-width="2"/>
  <!-- Center Specular Core -->
  <circle cx="100" cy="100" r="10" fill="#ffffff"/>
</svg>`
  }
];
