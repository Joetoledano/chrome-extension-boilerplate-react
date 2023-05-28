import { Tab } from '@headlessui/react';
import React from 'react';

interface RegistrationsProps {
  availableRegistrationsRemaining: number;
  account: string;
  handleAccountChange: any;
  handleClick: any;
  showBalances: boolean;
}
const Registrations = ({
  availableRegistrationsRemaining,
  account,
  handleAccountChange,
  handleClick,
  showBalances,
}: RegistrationsProps) => {
  return (
    <Tab.Panel>
      <header className="App-header">Let's show some bags</header>

      <form>
        <p className="">Register Wallet</p>
        <p className="">
          Registrations remaining: {availableRegistrationsRemaining}
        </p>

        <input
          type="text"
          value={account}
          onChange={handleAccountChange}
          placeholder="Account address"
        />
        <button type="button" onClick={handleClick}>
          {showBalances ? 'Hide Balances' : 'Show Balances'}
        </button>
      </form>
    </Tab.Panel>
  );
};

export default Registrations;
