import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import UnoCSS from "unocss/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";
import VueRouterPlugin from "unplugin-vue-router/vite";

import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import zip from "vite-plugin-zip-pack";

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: {
      origin: [/chrome-extension:\/\//],
    },
  },
  plugins: [
    crx({ manifest }),
    zip({ outDir: "release", outFileName: "release.zip" }),
    VueRouterPlugin({}),
    vue(),
    AutoImport({
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.cjs",
        globalsPropValue: true,
      },
      dts: true,
      imports: [
        "vue",
        "pinia",
        "vue-router",
        "@vueuse/core",
        "@vueuse/head",
        "@vueuse/math",
      ],
      ignore: [],
    }),
    Components({}),
    Icons({
      autoInstall: true,
    }),
    UnoCSS(),
    VueI18nPlugin({
      include: [path.resolve(__dirname, "src/locales/**")],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
