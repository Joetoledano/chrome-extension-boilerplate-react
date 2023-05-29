import { Tab } from '@headlessui/react';
import React from 'react';

interface RegistrationsProps {
  availableRegistrationsRemaining: number;
  account: string;
  handleAccountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  showBalances: boolean;
}

const Registrations: React.FC<RegistrationsProps> = ({
  availableRegistrationsRemaining,
  account,
  handleAccountChange,
  handleClick,
  showBalances,
}) => {
  // Rest of the component

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
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {showBalances ? 'Hide Balances' : 'Show Balances'}
        </button>
      </form>
    </Tab.Panel>
  );
};

export default Registrations;
