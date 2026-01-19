import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginManusRuntime(),
];

export default defineConfig({
  // 🔴 ESSENCIAL para funcionar em localhost / ngrok / pasta
  base: "./",

  plugins,

  // 📁 Pasta raiz do frontend
  root: path.resolve(import.meta.dirname, "client"),

  // 📁 Assets públicos
  publicDir: path.resolve(import.meta.dirname, "client", "public"),

  // 🔗 Aliases
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets"),
    },
  },

  // 🌱 Variáveis de ambiente
  envDir: path.resolve(import.meta.dirname),

  // 🏗️ Build final
  build: {
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    emptyOutDir: true,
  },
});
