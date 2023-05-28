import { Tab } from '@headlessui/react';
import React from 'react';

interface ActiveWalletProps {
  walletAddress: string;
  walletBalance: number;
}
const ActiveWallet = ({ walletAddress, walletBalance }: ActiveWalletProps) => {
  return (
    <Tab.Panel>
      {' '}
      <div>
        <h2>Wallet Address:</h2>
        <p>{walletAddress}</p>
        <h2>Wallet Balance:</h2>
        <p>{walletBalance}</p>
      </div>
    </Tab.Panel>
  );
};

export default ActiveWallet;
