import { MessageRouter, sendMessage } from "@/chrome/util";
console.log("content script is loaded");

const messageRouter = new MessageRouter();

messageRouter.register<any>("hello", (message, sender, sendResponse) => {
  console.log("[内容脚本] Received message:", message, sender);
  sendResponse({ data: "content script!", success: true });
});

sendMessage<string>({
  type: "hello",
  payload: "Hello from content script!",
}).then((x) => {
  console.log("[内容脚本] Received response:", x);
});
