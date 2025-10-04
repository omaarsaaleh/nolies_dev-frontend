import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: "PUB_",
  server: {
    allowedHosts: ['2iru20whfwei0ofjeh2tiofvcrewhf44weqlfjicoeqe23.omarsaleh.dev']
  }
})
