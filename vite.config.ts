import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": path.resolve("./src"),
      "@lib": path.resolve("./lib"),
      "@public": path.resolve("./public"),
      "@components": path.resolve("./src/components"),
      "@pages": path.resolve("./src/pages"),
      "@app": path.resolve("./src/app"),
      "@hooks": path.resolve("./src/hooks"),
      "@context": path.resolve("./src/context"),
      "@assets": path.resolve("./src/assets"),
      "@utils": path.resolve("./src/utils"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      includeAssets: ["favicon.ico"],
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },
      // manifest: false,
      manifest: {
        name: "client",
        short_name: "client",
        description: "My Awesome App description",
        start_url: "/",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#000000",
        icons: [
          {
            src: "/vite.svg",
            sizes: "512x512",
            // type: "image/png",
            type: "image/svg+xml",
          },
          {
            src: "/vite.svg",
            sizes: "144x144",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  server: {
    port: 4444,
    host: "::",
  },
});
