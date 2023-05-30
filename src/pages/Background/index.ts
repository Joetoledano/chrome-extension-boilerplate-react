import ExtensionMessagingHub from '../../messaging';
type MessagePayload = {
  type: string;
  data: any;
};
ExtensionMessagingHub.listenForMessages(
  'messageFromContentScript',
  async (
    message: MessagePayload,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    try {
      // Handle message from content script
      // This message is then relayed to the Popup script
      const response = await ExtensionMessagingHub.sendMessage(
        'background',
        null,
        'messageToPopup',
        message.data
      );
      sendResponse(response);
    } catch (error) {
      console.error(`Error while relaying message to popup: ${error}`);
      sendResponse({ success: false });
    }
    return true; // Indicate that we will send a response asynchronously
  }
);

ExtensionMessagingHub.listenForMessages(
  'messageFromPopup',
  async (
    message: MessagePayload,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    try {
      // Find active tab to send message to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0] && tabs[0].id !== undefined) {
          // Handle message from popup
          // This message is then relayed to the Content script
          await ExtensionMessagingHub.sendMessage(
            'content',
            tabs[0].id,
            'messageToContentScript',
            message.data
          ).catch((error) => {
            console.error(
              `Failed to send message to content script: ${error.message}`
            );
            sendResponse({ success: false });
          });
          sendResponse({ success: true });
        }
      });
    } catch (error) {
      console.error(`Error while relaying message to content script: ${error}`);
      sendResponse({ success: false });
    }
    return true; // Indicate that we will send a response asynchronously
  }
);
