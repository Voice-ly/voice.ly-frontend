import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        nodePolyfills({
            protocolImports: true,
        }),
    ],
    define: {
    global: "globalThis",
    "process.env": "{}",
  },
    server: {
        port: 5000,
        host: "0.0.0.0",
    },
});
