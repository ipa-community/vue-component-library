export { default as HelloWorld } from "./HelloWorld.vue";

export const ElTablePlus = defineAsyncComponent(
  () => import("./ElTablePlus/index.vue"),
);
