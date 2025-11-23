import type { MessageHandler, Message } from "@/chrome/types";
import type { ApiResponse } from "@ipa-schema/api";
export class MessageRouter {
  private handlers: Map<string, Set<MessageHandler<any, any>>> = new Map();
  constructor() {
    this.initListener();
  }

  /**
   * 注册消息处理器，统一了消息格式
   *
   * @param type 消息类型
   * @param handler 消息处理器
   */
  register<T = unknown, R = unknown>(
    type: string,
    handler: MessageHandler<T, R>,
  ) {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(handler);
  }

  // 初始化消息监听
  initListener() {
    chrome.runtime.onMessage.addListener(
      (message: Message<any>, sender, responseSender) => {
        // 为了使用类型提示
        const sendResponse = (response?: ApiResponse<unknown>) => {
          return responseSender(response);
        };

        const type = message?.type;
        if (!type) {
          console.warn(`非法数据格式：`, message, sender);
          sendResponse({
            error: {
              code: -1,
              message: `未知类型：${type}`,
            },
            success: false,
          });
          return;
        }

        const handlers = this.handlers.get(type);
        if (!handlers || handlers.size === 0) {
          console.warn(`无法处理消息类型：${type}`, message, sender);
          sendResponse({
            error: {
              code: -1,
              message: `无法处理消息类型：${type}`,
            },
            success: false,
          });
          return;
        }
        handlers.forEach((handler) => {
          handler(message, sender, sendResponse);
        });
      },
    );
  }
}

/**
 * 统一消息发送的格式
 *
 * 1. 通过targetId来区分是广播还是向指定tab发送
 *
 * @param message 要发送的消息
 * @returns 发送结果
 */
export function sendMessage<T>(
  message: Message<T>,
  options?: chrome.runtime.MessageOptions | chrome.tabs.MessageSendOptions,
) {
  if (message.targetId) {
    console.log("send message to tab", message.targetId, message);
    return chrome.tabs.sendMessage(
      message.targetId as number,
      message,
      options as chrome.tabs.MessageSendOptions,
    );
  } else {
    console.log("broadcast message", message);
    return chrome.runtime.sendMessage(
      message,
      options as chrome.runtime.MessageOptions,
    );
  }
}
