import { Tab } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import Dropdown from '../common/Dropdown';
import ActivitiesTab from './Tabs/Activity';
import BagTab from './Tabs/Bags';

import { copyToClipboard, truncateString } from '../../../../lib/helpers';
import BusinessInfo from './AddedDetails/BusinessInfo';
import SocialProfiles from './AddedDetails/SocialInfo';
import WalletAddresses from './AddedDetails/WalletAddresses';

interface ActiveWalletProps {
  walletAddress: string | null;
  walletBalance: number | null;
  twitterHandle: string;
}

const ActiveWallet: React.FC<ActiveWalletProps> = ({
  walletAddress,
  twitterHandle,
  walletBalance,
}) => {
  const options = ['Wallet Addresses', 'Business Info', 'Social Profiles'];
  const [selectedOption, setSelectedOption] = useState<string>('');
  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  const onBack = () => {
    setSelectedOption('');
  };

  const renderDropdownElement = () => {
    switch (selectedOption) {
      case 'Wallet Addresses':
        return (
          <WalletAddresses walletAddress={'test'} onBack={onBack} network="" />
        );
      case 'Business Info':
        return (
          <BusinessInfo businessAddress="" businessName="" onBack={onBack} />
        );
      case 'Social Profiles':
        return (
          <SocialProfiles
            onBack={onBack}
            lensProfile=""
            blueskyProfile=""
            farcasterProfile="s"
          />
        );
      default:
        return null;
    }
  };

  const tokens = [
    {
      name: 'Ethereum',
      symbol: 'Eth',
      value: 1800,
      amount: 1,
      performance: 10,
      image:
        'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
    },
  ];
  return (
    <div className="flex flex-col w-full space-y-4 px-4">
      <div className="flex flex-row justify-between w-full mt-2 mb-4">
        <div className="flex flex-row items-center w-full gap-x-2 ">
          <div className="w-6 h-6 bg-gray-500 rounded-full" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-900 tracking-tight">
              {twitterHandle}
            </span>
            <div className="flex flex-row items-center gap-x-2">
              <span className="font-light text-xs text-gray-600 tracking-wide">
                {walletAddress ? truncateString(walletAddress, 4, 4) : '0x'}
              </span>
              {walletAddress ? (
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="font-light text-xs text-gray-600 tracking-wide"
                >
                  Copy{' '}
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <Dropdown options={options} onChange={handleSelect} />
      </div>

      {selectedOption && selectedOption.length > 0 ? (
        <>{renderDropdownElement()}</>
      ) : (
        <Tab.Group>
          <Tab.List className="flex p-2 space-x-2 bg-white border-b border-b-gray-200 pb-4 justify-around w-full rounded-b-none rounded-md mb-4">
            {['Bag', 'Activities'].map((el) => (
              <>
                <Tab as={Fragment} key={el}>
                  {({ selected }) => (
                    <button
                      className={`py-2 px-3 rounded-xl font-semibold text-sm tracking-wide ${
                        selected ? 'bg-blue-600 text-white' : 'text-gray-900'
                      }`}
                    >
                      {el}
                    </button>
                  )}
                </Tab>
              </>
            ))}
          </Tab.List>
          <Tab.Panels>
            <BagTab
              tokens={tokens}
              walletBalance={walletBalance ? walletBalance : 0}
              walletPerformance={100}
            />

            <ActivitiesTab />
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
};

export default ActiveWallet;
