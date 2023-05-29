import { Tab } from '@headlessui/react';
import React from 'react';
import HoldingsItem from '../../../common/HoldingsItem';

type tokenType = {
  name: string;
  symbol: string;
  image: string;
  amount: number;
  value: number;
  performance: number;
};
interface BagsTabProps {
  walletBalance: number;
  walletPerformance: number;
  tokens: tokenType[];
}
const BagsTab: React.FC<BagsTabProps> = ({
  walletBalance,
  walletPerformance,
  tokens,
}) => {
  return (
    <Tab.Panel>
      <div className="flex flex-row justify-around w-full mb-4">
        <div className="flex flex-col items-start text-gray-900">
          <h2 className="font-semibold text-sm tracking-tighter">Balance:</h2>
          <span className="font-light text-sm text-gray-900">
            {walletBalance}
          </span>
        </div>
        <div className="flex flex-col items-start text-gray-900">
          <h2 className="font-semibold text-sm tracking-tighter">
            Performance:
          </h2>
          <span
            className={`font-light text-sm ${
              walletPerformance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {walletPerformance}%
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start text-gray-900 mb-4">
        <h2 className="font-semibold text-sm tracking-tighter">Holdings:</h2>
      </div>
      {tokens.map((token) => (
        <HoldingsItem key={token.name} token={token} />
      ))}
    </Tab.Panel>
  );
};

export default BagsTab;
