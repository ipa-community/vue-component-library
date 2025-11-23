import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";
export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/vite.svg",
  },
  action: {
    default_icon: {
      48: "public/vite.svg",
    },
    default_popup: "src/chrome/popup/index.html",
  },
  background: {
    service_worker: "src/chrome/background/index.ts",
  },
  content_scripts: [
    {
      js: ["src/chrome/content/index.ts"],
      matches: ["https://*/*"],
    },
  ],
  options_ui: {
    page: "src/chrome/options/index.html",
    open_in_tab: true,
  },
  side_panel: {
    default_path: "src/chrome/sidepanel/index.html",
  },
  web_accessible_resources: [
    {
      resources: ["index.html"],
      matches: ["https://*/*"],
    },
  ],
  permissions: ["sidePanel", "contentSettings"],
});
