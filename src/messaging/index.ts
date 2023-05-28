type MessageHandler = (
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => void;

class ExtensionMessagingHub {
  private static instance: ExtensionMessagingHub;
  private handlers: { [type: string]: MessageHandler } = {};

  private constructor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const handler = this.handlers[message.type];
      if (handler) {
        handler(message.data, sender, sendResponse);
        return true; // This ensures async sendResponse
      }
    });
  }

  public static getInstance(): ExtensionMessagingHub {
    if (!ExtensionMessagingHub.instance) {
      ExtensionMessagingHub.instance = new ExtensionMessagingHub();
    }
    return ExtensionMessagingHub.instance;
  }

  public listenForMessages(type: string, handler: MessageHandler): void {
    this.handlers[type] = handler;
  }

  public async sendMessageToBackgroundScript(
    type: string,
    data: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type, data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  public async sendMessageToContentScript(
    tabId: number,
    type: string,
    data: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, { type, data }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default ExtensionMessagingHub.getInstance();
