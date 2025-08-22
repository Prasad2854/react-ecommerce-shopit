import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' // Make sure this import exists

export default defineConfig({
  base: '/react-ecommerce-shopit/', 
  plugins: [
    react(), 
    svgr() // Make sure this line exists
    
  ],
})