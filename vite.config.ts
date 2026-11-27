import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages URL: https://<user>.github.io/wishlist/
// Dev uses '/' so localhost works without a subpath.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VITE_BASE ?? (command === 'serve' ? '/' : '/wishlist/'),
}))
