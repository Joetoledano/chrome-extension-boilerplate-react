import { Tab } from '@headlessui/react';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { fetchAddressForENSName } from '../../Client';
import {
  profileActions,
  tweetActions,
} from '../../lib/constants/ActionMessages';
import ExtensionMessagingHub from '../../messaging/';
import './Popup.css';
import ActiveWallet from './components/ActiveWallet';
import Profile from './components/Profile';
import Registrations from './components/Registrations';
import RelevantTweetsList from './components/RelevantTweets';
import Settings from './components/Settings';
import useBalances from './hooks/balances/useBalances';
interface WalletResponse {
  address: string;
  balance: number;
}

type twitterViewType = 'tweet' | 'profile' | null;

const Popup: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [twitterView, setTwitterView] = useState<twitterViewType>(null);
  const [focusedTweet, setFocusedTweet] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [walletAddressForFocusedWallet, setWalletAddressForFocusedWallet] =
    useState<string | null>(null);
  const [walletBalanceForFocusedWallet, setWalletBalanceForFocusedWallet] =
    useState<number | null>(null);
  const [twitterHandleForFocusedWallet, setTwitterHandleForFocusedWallet] =
    useState<string>('');
  const [
    twitterProfileImageForFocusedWallet,
    setTwitterProfileImageForFocusedWallet,
  ] = useState<string>('');
  const [relevantTweets, setRelevantTweets] = useState<any[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
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

  const loadInRelevantTweets = useCallback(async () => {
    if (twitterView === 'tweet') {
      console.log('inside load');
      try {
        const messageData = {
          action: tweetActions.loadRelevantTweets,
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
  }, [twitterView]);

  const setTwitterViewFunc = useCallback(async () => {
    if (twitterView === null) {
      try {
        const messageData = {
          action: profileActions.setTwitterView,
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
  }, []);

  const fetchBalance = useCallback(async () => {
    if (
      walletAddressForFocusedWallet?.includes('0x') &&
      walletBalanceForFocusedWallet === null
    ) {
      try {
        const walletBalanceResult = await getFormattedBalance(
          walletAddressForFocusedWallet
        );
        setWalletBalanceForFocusedWallet(walletBalanceResult);
        const messageData = {
          action: profileActions.renderProfileInfo,
          payload: {
            walletBalance: walletBalanceResult,
            walletAddress: walletAddressForFocusedWallet,
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
  }, [
    walletAddressForFocusedWallet,
    walletBalanceForFocusedWallet,
    getFormattedBalance,
  ]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    loadInRelevantTweets();
  }, [twitterView, loadInRelevantTweets]);

  useEffect(() => {
    setTwitterViewFunc();
  }, [twitterView, setTwitterViewFunc]);

  // Handles actions for messages from the background/content scripts
  const messageHandler = useCallback(async (data: any) => {
    switch (data.data.messageAction) {
      case profileActions.loadProfileInfo:
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
              `Error while fetching the wallet address: ${JSON.stringify(
                error
              )}`
            );
          }
        }
        break;
      case profileActions.setTwitterView:
        setTwitterView(data.data.twitterView);
        break;
      case profileActions.renderProfileInfo:
        break;
      case tweetActions.loadRelevantTweets:
        const relevantTweetsTwitterData = data.data.relevantTweets;
        if (relevantTweetsTwitterData && relevantTweetsTwitterData.length) {
          setRelevantTweets(relevantTweetsTwitterData);
        }
        break;
      default:
        console.warn(`Unknown action: ${data.data.messageAction}`);
    }
  }, []);

  useEffect(() => {
    ExtensionMessagingHub.listenForMessages('messageToPopup', messageHandler);
    if (twitterHandleForFocusedWallet === '') {
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
  }, [twitterHandleForFocusedWallet, messageHandler]);

  const handleFocusWallet = (focusedWalletData: any) => {
    const {
      focusedWalletHandle,
      focusedWalletAddress,
      focusedWalletBalance,
      focusedWalletProfileImage,
    } = focusedWalletData;

    setActiveTabIndex(1);
    setTwitterHandleForFocusedWallet(focusedWalletHandle);
    setWalletAddressForFocusedWallet(focusedWalletAddress);
    setWalletBalanceForFocusedWallet(focusedWalletBalance);
    setTwitterProfileImageForFocusedWallet(focusedWalletProfileImage);
  };

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
          <Tab.Group
            selectedIndex={activeTabIndex}
            onChange={setActiveTabIndex}
          >
            <Tab.Panels>
              <RelevantTweetsList
                tweets={relevantTweets}
                handleFocusWallet={handleFocusWallet}
              />
              <Tab.Panel>
                <ActiveWallet
                  twitterHandle={twitterHandleForFocusedWallet}
                  twitterProfileImage={twitterProfileImageForFocusedWallet}
                  walletAddress={walletAddressForFocusedWallet}
                  walletBalance={walletBalanceForFocusedWallet}
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
            <Tab.List className="fixed bottom-0 border-t border-t-slate-200 left-0 z-10 gap-x-4 flex items-center justify-between px-4 py-2 bg-white shadow-lg w-full text-gray-500">
              {[
                { name: 'Relevant Tweets', icon: 'tweets-icon' },
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
