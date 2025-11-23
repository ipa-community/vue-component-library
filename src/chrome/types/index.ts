import type { ApiResponse } from "@ipa-schema/api";

export interface Message<T> {
  type: string;
  payload?: T;
  sourceId?: string | number;
  targetId?: string | number;
  extra?: any;
  [key: string]: any;
}

export type MessageHandler<T = unknown, R = unknown> = (
  payload: Message<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ApiResponse<R>) => void,
) => any;
