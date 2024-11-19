/*
 * @Author: leoking
 * @Date: 2024-11-14 11:39:35
 * @LastEditTime: 2024-11-17 12:39:31
 * @LastEditors: leoking
 * @Description:
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import UnoCSS from "unocss/vite";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import path from "path";
import VueRouterPlugin from "unplugin-vue-router/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, "./src/index.ts"),
      },
      name: "@leoking/element-plus",
      fileName(format, entryName) {
        return `${entryName}.${format}${format.endsWith("js") ? "" : ".js"}`;
      },
      formats: ["cjs", "es"], // , "umd"
    },
    // FIXME: 设置为true时，只导入组件不会自动关联对应样式，暂不清楚怎么解决
    cssCodeSplit: false,
    rollupOptions: {
      external: ["vue", "pinia", "vue-router"],
      output: {
        dir: "./lib",
        globals: {
          vue: "Vue",
          pinia: "Pinia",
          "vue-router": "VueRouter",
        },
      },
    },
  },
  plugins: [
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
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
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
