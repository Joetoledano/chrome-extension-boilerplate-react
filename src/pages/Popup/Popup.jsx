import { Tab } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import messagingHub from '../../messaging/';
import './Popup.css';
import ActiveWallet from './components/activeWallet';
import Registrations from './components/registrations';

const Popup = () => {
  const [account, setAccount] = useState('');
  const [showBalances, setShowBalances] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [availableRegistrationsRemaining, setAvailableRegistrationsRemaining] =
    useState(0);

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
      <Tab.Group>
        <Tab.List>
          <Tab as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={
                  selected ? 'bg-blue-500 text-white' : 'bg-white text-black'
                }
              >
                Focused Wallet{' '}
              </button>
            )}
          </Tab>{' '}
          <Tab as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={
                  selected ? 'bg-blue-500 text-white' : 'bg-white text-black'
                }
              >
                Registrations
              </button>
            )}
          </Tab>{' '}
          <Tab as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={
                  selected ? 'bg-blue-500 text-white' : 'bg-white text-black'
                }
              >
                Profile
              </button>
            )}
          </Tab>
          {/* ...  */}
        </Tab.List>
        <Tab.Panels>
          <ActiveWallet
            walletAddress={walletAddress}
            walletBalance={walletBalance}
          />
          <Registrations
            handleAccountChange={handleAccountChange}
            account={account}
            availableRegistrationsRemaining={availableRegistrationsRemaining}
            handleClick={() => {}}
            showBalances={showBalances}
          />
          <Tab.Panel>Profile</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Popup;
