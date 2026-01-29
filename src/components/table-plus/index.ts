import "./index.css";

export * from "./types";
export const ElTablePlus = defineAsyncComponent(
  () => import("./ElTablePlus.vue"),
);
