import { environment } from "./src/environments/environment";
import path from "path";
import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Sistema de Reservas",
        short_name: "Reservas",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#16a34a",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: environment.production
    ? {}
    : {
        https: {
          key: fs.readFileSync(
            path.resolve(__dirname, "certs/localhost+3-key.pem")
          ),
          cert: fs.readFileSync(
            path.resolve(__dirname, "certs/localhost+3.pem")
          ),
        },
        host: true, // acessível por IP ou sistemareserva.localhost
        port: 5173,
      },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
