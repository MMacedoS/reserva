import path from "path"
import fs from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost+3.pem')),
    },
    host: true,       // acessível por IP ou sistemareserva.localhost
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
