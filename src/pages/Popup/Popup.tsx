import { Tab } from '@headlessui/react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { fetchAddressForENSName } from '../../Client';
import { profileActions } from '../../lib/constants/ActionMessages';
import ExtensionMessagingHub from '../../messaging/';
import './Popup.css';
import ActiveWallet from './components/ActiveWallet';
import Profile from './components/Profile';
import Registrations from './components/Registrations';
import Settings from './components/Settings';
import useBalances from './hooks/balances/useBalances';
interface WalletResponse {
  address: string;
  balance: number;
}

const Popup: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [twitterHandle, setTwitterHandle] = useState<string>('');
  const [availableRegistrationsRemaining, setAvailableRegistrationsRemaining] =
    useState<number>(0);
  const [currentView, setCurrentView] = useState('');

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
  };

  const { getFormattedBalance } = useBalances();

  const handleClickSettingsIcon = () => {
    setCurrentView(currentView === 'settings' ? '' : 'settings');
  };

  const handleClickProfileIcon = () => {
    setCurrentView(currentView === 'profile' ? '' : 'profile');
  };

  const toggleBalances = () => {
    setShowBalances(!showBalances);
    // Add logic to send message to content script
  };

  const fetchBalance = useCallback(async () => {
    if (walletAddress?.includes('0x') && walletBalance === null) {
      try {
        const walletBalanceResult = await getFormattedBalance(walletAddress);
        setWalletBalance(walletBalanceResult);
        const messageData = {
          action: profileActions.renderProfileInfo,
          payload: {
            walletBalance: walletBalanceResult,
            walletAddress: walletAddress,
          },
        };

        await ExtensionMessagingHub.sendMessage(
          'background',
          null,
          'messageFromPopup',
          messageData
        );
      } catch (error) {
        console.error(
          `Error while fetching the balance and communicating with background script: ${JSON.stringify(
            error
          )}`
        );
      }
    }
  }, [walletAddress, walletBalance, getFormattedBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const messageHandler = useCallback(async (data: any) => {
    if (data?.data?.balance) {
      setWalletAddress(data.data.address);
      setWalletBalance(data.data.balance);
    } else if (data?.data?.handle) {
      setTwitterHandle(data.data.handle);
      if (data.data.address?.includes('.eth')) {
        try {
          const fullWalletAddress = await fetchAddressForENSName(
            data.data.address
          );
          if (fullWalletAddress) {
            setWalletAddress(fullWalletAddress);
          }
        } catch (error) {
          console.error(
            `Error while fetching the wallet address: ${JSON.stringify(error)}`
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    ExtensionMessagingHub.listenForMessages('messageToPopup', messageHandler);
    if (twitterHandle === '') {
      const messageData = {
        action: profileActions.loadProfileInfo,
      };
      ExtensionMessagingHub.sendMessage(
        'background',
        null,
        'messageFromPopup',
        messageData
      )
        .then((response) => {
          console.log('the response');
        })
        .catch((error) => {
          console.error(
            `Error while communicating with background script: ${JSON.stringify(
              error
            )}`
          );
        });
    }
    return () => {
      // Cleanup code here if necessary
    };
  }, [twitterHandle, messageHandler]);

  return (
    <div className="flex relative flex-col items-center  justify-start h-screen bg-gray-800 text-white">
      <div className="flex flex-row items-center bg-gray-100 justify-between py-2 px-4 w-full shadow">
        <button
          onClick={handleClickProfileIcon}
          className="w-8 h-8 shadow-xl bg-white rounded-full flex items-center justify-center"
        >
          <span className="text-white font-bold">👤</span>
        </button>
        <h1 className="text-xl font-extrabold text-gray-800">🐦 Bird Bags </h1>
        <button
          onClick={handleClickSettingsIcon}
          className="w-8 h-8 shadow-xl bg-white text-white rounded-full flex items-center justify-center font-bold"
        >
          ⚙️
        </button>
      </div>

      {currentView === 'settings' ? (
        <Settings />
      ) : currentView === 'profile' ? (
        <Profile />
      ) : (
        <div className="max-w-xl mx-auto bg-white h-screen w-full text-gray-800 px-4 py-2 shadow-md space-y-4">
          <Tab.Group>
            <Tab.Panels>
              <Tab.Panel>
                <ActiveWallet
                  twitterHandle={twitterHandle}
                  walletAddress={walletAddress}
                  walletBalance={walletBalance}
                />
              </Tab.Panel>
              <Registrations
                handleAccountChange={handleAccountChange}
                account={account}
                availableRegistrationsRemaining={
                  availableRegistrationsRemaining
                }
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
      )}
    </div>
  );
};

export default Popup;
