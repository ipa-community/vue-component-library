/*
 * @Author: leoking
 * @Date: 2024-11-17 12:32:39
 * @LastEditTime: 2024-11-17 12:57:22
 * @LastEditors: leoking
 * @Description: 抽离出web项目和组件库公用的配置
 */
import { createApp as __createApp__, type Component } from "vue";
import { useDark, useToggle } from "@vueuse/core";

import { createPinia as __createPinia__ } from "pinia";
import { createI18n as __createI18n__, I18nOptions } from "vue-i18n";

/*
 * All i18n resources specified in the plugin `include` option can be loaded
 * at once using the import syntax
 */
import messages from "@intlify/unplugin-vue-i18n/messages";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";

import { routes } from "vue-router/auto-routes";

import "virtual:uno.css";
import "./index.css";

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_MODE === "hash"
      ? createWebHashHistory()
      : createWebHistory(),
  routes: routes,
});

export function createPinia() {
  return __createPinia__();
}
const pinia = createPinia();

/**
 * 默认中文、并使用unplugin-vue-i18n插件获取messages
 * @param opt 其他i18n配置
 * @returns i18n实例
 */
export function createI18n(opt?: Partial<I18nOptions>) {
  return __createI18n__({
    locale: "zh-CN",
    fallbackLocale: "en",
    messages,
    ...opt,
  });
}
const i18n = createI18n();

const isDark = useDark({
  valueLight: "light",
  valueDark: "dark",
});

/**
 * 基于VueUse的useToggle切换主题
 * @param dark 是否切换为暗黑主题,默认值为当前值取反
 */
const toggleTheme = (dark?: boolean) => {
  isDark.value = dark ?? !isDark.value;
  useToggle(isDark);
  console.info("dark:", isDark.value);
};

/**
 * add routes & pinia & i18n
 * @param cmp component
 * @returns App<Element>
 */
export const createApp = (cmp: Component) => {
  const app = __createApp__(cmp);
  app.use(router).use(i18n).use(pinia);
  return app;
};

export const locale = ref<any>();
/**
 * 切换语言
 * TODO：此方法暂时只提供变量功能，尚未实现联动
 * @param locale 语言
 */
export const toggleLocale = (locale: any) => {
  locale.value = locale;
};

export { pinia, i18n, toggleTheme, router, isDark };

export * from "./ui";
