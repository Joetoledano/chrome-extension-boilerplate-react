import React, { useEffect, useState } from 'react';
import messagingHub from '../../messaging/';

import './Popup.css';

const Popup = () => {
  const [account, setAccount] = useState('');
  const [showBalances, setShowBalances] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const handleAccountChange = (e) => {
    setAccount(e.target.value);
  };
  useEffect(() => {
    chrome.runtime.sendMessage({ message: 'getPopupData' }, (response) => {
      if (response) {
        setWalletAddress(response.address);
        setWalletBalance(response.balance);
      }
    });
  }, []);
  const toggleBalances = () => {
    setShowBalances(!showBalances);
    // Add logic to send message to content script
  };
  // Send a message to the background script
  messagingHub
    .sendMessageToBackgroundScript('popupMessage', { someData: 'example' })
    .then((response) => {
      console.log('Received response:', response);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

  // Listen for messages from the content script or background script
  messagingHub.listenForMessages(
    'contentScriptMessage',
    (data, sender, sendResponse) => {
      console.log('Received message from content script:', data);
      // Handle the message here
    }
  );
  return (
    <div className="App">
      <header className="App-header">Let's show some bags</header>
      <div>
        <h2>Wallet Address:</h2>
        <p>{walletAddress}</p>
        <h2>Wallet Balance:</h2>
        <p>{walletBalance}</p>
      </div>
      <form>
        <input
          type="text"
          value={account}
          onChange={handleAccountChange}
          placeholder="Account address"
        />
        <button type="button" onClick={toggleBalances}>
          {showBalances ? 'Hide Balances' : 'Show Balances'}
        </button>
      </form>
    </div>
  );
};

export default Popup;
