import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Agar 3000 busy ho toh kisi aur port par switch na kare, balki 3000 ko hi rakhe
    open: true        // npm run dev karte hi browser me apne aap khul jaye
  }
})