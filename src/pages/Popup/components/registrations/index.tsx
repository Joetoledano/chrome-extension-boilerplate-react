import { Tab } from '@headlessui/react';
import React, { useState } from 'react';
import useRegisterWallet from '../../hooks/registrations/useRegisterWallet';
interface RegistrationsProps {
  accountFromTweet?: string;
  showBalances: boolean;
}

const Registrations: React.FC<RegistrationsProps> = ({
  accountFromTweet,
  showBalances,
}) => {
  const [account, setAccount] = useState<string>('');

  const {
    handleRegisterWalletInBackend,
    registeringWallet,
    errorRegisteringWallet,
    availableRegistrationsRemaining,
    setAvailableRegistrationsRemaining,
  } = useRegisterWallet();

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount(e.target.value);
  };

  const handleRegisterProfileClick = async () => {
    await handleRegisterWalletInBackend(account);
  };

  return (
    <Tab.Panel>
      <form className="mt-6 space-y-3">
        <div className="flex items-center flex-col justify-between text-gray-900">
          <label htmlFor="account" className="font-semibold text-lg">
            Dive deeper into a wallet
          </label>
          <span className="font-mono text-sm">
            Registrations remaining: {availableRegistrationsRemaining}
          </span>
        </div>

        <input
          id="account"
          type="text"
          value={account}
          onChange={handleAccountChange}
          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md bg-white"
          placeholder="Account address"
        />
        <button
          type="button"
          onClick={handleRegisterProfileClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {availableRegistrationsRemaining > 0
            ? 'Register a new Wallet'
            : 'Add more wallets'}
        </button>
      </form>
    </Tab.Panel>
  );
};

export default Registrations;
