/*
 * @Author: leoking
 * @Date: 2024-11-11 16:22:17
 * @LastEditTime: 2025-01-10 18:47:03
 * @LastEditors: leoking
 * @Description:
 */
import { createApp } from "./shared";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "dayjs/locale/zh-cn";
import "element-plus/theme-chalk/dark/css-vars.css";

import App from "./App.vue";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
