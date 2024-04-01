import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        ui: './src/ui/index.html',
      },
    },
  }
})
