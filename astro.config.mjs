// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

import solidJs from "@astrojs/solid-js";

export default defineConfig({
  site: "https://anmarivanderwesthuizen.com",
  integrations: [mdx(), sitemap(), solidJs()],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: [{
    cssVariable: "--font-fraunces",
    name: "Fraunces",
    provider: fontProviders.google(),
    styles: ["normal", "italic"],
    weights: ["100 900"],
    fallbacks: ["serif"],
    options: {
      experimental: {
        variableAxis: {
          opsz: [["9", "144"]],
          SOFT: [["0", "100"]],
          WONK: [["0", "1"]],
        }
      }
    }
  }],

  experimental: {
    rustCompiler: true,
  }
});