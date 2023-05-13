chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  // Check if the URL change matches your desired criteria
  console.log('the deets', details);
  if (details.url.includes('twitter')) {
    console.log('pasta monsta');
    // Invoke your extension's functionality here
    // e.g., send a message to a content script
    chrome.tabs.sendMessage(details.tabId, { action: 'on tweetah' });
  }
});
