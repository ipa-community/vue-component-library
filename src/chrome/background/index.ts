import { MessageRouter, sendMessage } from "@/chrome/util";

console.log("background script is loaded");

const messageRouter = new MessageRouter();

messageRouter.register<any>("hello", (message, sender, sendResponse) => {
  console.log("[后台脚本] Received message:", message, sender);
  sendResponse({ data: "Hello from background script!", success: true });
  if (!sender.tab?.id) {
    return;
  }
  sendMessage<string>({
    targetId: sender.tab.id,
    type: "hello",
    payload: "Hello from background script!",
  }).then((x) => {
    console.log("[后台脚本] Received response:", x);
  });
});

messageRouter.register<chrome.windows.CreateData>(
  "create:window",
  (message) => {
    console.log("xxxxxxxxxxxxxxxxx");
    chrome.windows
      .create(message.payload)
      .then(() => {
        console.log("open window success");
      })
      .catch((e) => {
        console.error(e);
      });
  },
);

messageRouter.register<chrome.tabs.CreateProperties>(
  "create:tab",
  (message) => {
    chrome.tabs
      .create(message.payload!)
      .then(() => {
        console.log("create tab success");
      })
      .catch((e) => {
        console.error(e);
      });
  },
);
