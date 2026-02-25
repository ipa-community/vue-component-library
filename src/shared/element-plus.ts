import zhCn from "element-plus/es/locale/lang/zh-cn";
import "dayjs/locale/zh-cn";
import "element-plus/theme-chalk/dark/css-vars.css";

/**
 * 默认中文
 * @param app Vue应用实例
 * @param options ElementPlus配置项
 */
export function setupElementPlus<T = any>(app: T, options?: any) {
  return import("element-plus").then(({ default: ElementPlus }) => {
    return (app as any).use(ElementPlus, {
      locale: zhCn,
      ...options,
    });
  });
}
