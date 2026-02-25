/*
 * @Author: leoking
 * @Date: 2024-11-11 16:22:17
 * @LastEditTime: 2025-01-10 18:47:03
 * @LastEditors: leoking
 * @Description:
 */
import { createApp } from "./index";
import { setupElementPlus } from "./shared/element-plus";
import App from "./App.vue";

const app = createApp(App);

await setupElementPlus(app);
app.mount("#app");
