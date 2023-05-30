type MessagePayload = {
  type: string;
  data: any;
};

type MessageHandler = (
  message: MessagePayload,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;

class ExtensionMessagingHub {
  private static instance: ExtensionMessagingHub;
  private handlers: Record<string, MessageHandler> = {};

  private constructor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      const handler = this.handlers[message.type];
      if (handler) {
        handler(message, sender, sendResponse);
        return true; // Keeps the sendMessage connection open for async `sendResponse`
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
    console.log('the type of message', type);
    this.handlers[type] = handler;
  }

  public async sendMessage(
    destination: 'background' | 'content',
    tabId: number | null,
    type: string,
    data: any
  ): Promise<any> {
    console.log(
      `Sending Message to: ${destination}, of type ${type}, with data of ${JSON.stringify(
        data
      )}`
    );
    return new Promise((resolve, reject) => {
      const payload = { type, data };
      const callback = (response: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      };

      if (destination === 'background') {
        chrome.runtime.sendMessage(payload, callback);
      } else if (destination === 'content' && tabId !== null) {
        chrome.tabs.sendMessage(tabId, payload, callback);
      }
    });
  }
}

export default ExtensionMessagingHub.getInstance();
