import { Tab } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import messagingHub from '../../messaging/';
import './Popup.css';
import ActiveWallet from './components/ActiveWallet';
import Registrations from './components/registrations';

interface WalletResponse {
  address: string;
  balance: number;
}

const Popup: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [availableRegistrationsRemaining, setAvailableRegistrationsRemaining] =
    useState<number>(0);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
  };

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: 'getPopupData' },
      (response: WalletResponse) => {
        if (response) {
          setWalletAddress(response.address);
          setWalletBalance(response.balance);
        }
      }
    );
  }, []);

  const toggleBalances = () => {
    setShowBalances(!showBalances);
    // Add logic to send message to content script
  };

  // Send a message to the background script
  messagingHub
    .sendMessageToBackgroundScript('popupMessage', { someData: 'example' })
    .then((response: any) => {
      console.log('Received response:', response);
    })
    .catch((error: any) => {
      console.error('Error sending message:', error);
    });

  // Listen for messages from the content script or background script
  messagingHub.listenForMessages(
    'contentScriptMessage',
    (data: any, sender: any, sendResponse: any) => {
      console.log('Received message from content script:', data);
      // Handle the message here
    }
  );
  return (
    <div className="flex relative flex-col items-center  justify-start h-screen bg-gray-800 text-white">
      <div className="flex flex-row items-center bg-gray-100 justify-between py-2 px-4 w-full shadow">
        <div className="w-8 h-8 shadow-xl bg-white rounded-full flex items-center justify-center">
          <span className="text-white font-bold">👤</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Bird Bags</h1>
        <button className="w-8 h-8 shadow-xl bg-white text-white rounded-full flex items-center justify-center font-bold">
          ⚙️
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white h-screen w-full text-gray-800 px-4 py-2 shadow-md space-y-4">
        <Tab.Group>
          <Tab.Panels>
            <Tab.Panel>
              <ActiveWallet
                walletAddress={walletAddress}
                walletBalance={walletBalance}
              />
            </Tab.Panel>
            <Registrations
              handleAccountChange={handleAccountChange}
              account={account}
              availableRegistrationsRemaining={availableRegistrationsRemaining}
              handleClick={() => {}}
              showBalances={showBalances}
            />
            <Tab.Panel>Profile</Tab.Panel>
          </Tab.Panels>
          <Tab.List className="fixed bottom-0 border-t border-t-slate-200 left-0 z-10 flex items-center justify-between px-4 py-2 bg-white shadow-lg w-full text-gray-500">
            {[
              { name: 'Focused Wallet', icon: 'wallet-icon' },
              { name: 'Deep Dives', icon: 'registrations-icon' },
              { name: 'Share', icon: 'share-icon' },
            ].map((tab) => (
              <Tab as={Fragment} key={tab.name}>
                {({ selected }) => (
                  <button
                    className={`flex flex-col items-center justify-center flex-1 text-xs font-medium py-2 ${
                      selected
                        ? 'text-blue-500 border border-blue-200 rounded-xl'
                        : 'text-gray-500'
                    }`}
                  >
                    <i
                      className={`icon ${tab.icon} ${
                        selected ? 'text-blue-500' : 'text-gray-500'
                      }`}
                    ></i>
                    <span>{tab.name}</span>
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Popup;
