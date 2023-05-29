import React, { useState } from 'react';

interface IWalletFormProps {
  walletAddress: string;
  network: string;
  onBack: () => void;
}

interface AddressNetworkPair {
  address: string;
  network: string;
}

const WalletForm: React.FC<IWalletFormProps> = ({
  walletAddress,
  network,
  onBack,
}) => {
  const [pairs, setPairs] = useState<AddressNetworkPair[]>([
    { address: walletAddress, network: network },
  ]);

  const handleAddressChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPairs = [...pairs];
      newPairs[index].address = event.target.value;
      setPairs(newPairs);
    };

  const handleNetworkChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPairs = [...pairs];
      newPairs[index].network = event.target.value;
      setPairs(newPairs);
    };

  const handleAddPair = () => {
    setPairs([...pairs, { address: '', network: '' }]);
  };

  const handleRemovePair = (index: number) => () => {
    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    setPairs(newPairs);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit form here, handle result
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      {pairs.map((pair, index) => (
        <div key={index} className="flex flex-col space-y-4 mb-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor={`walletAddress-${index}`}
              className="font-medium text-gray-900"
            >
              Wallet Address
            </label>
            <input
              type="text"
              name={`walletAddress-${index}`}
              id={`walletAddress-${index}`}
              className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
              placeholder="Enter Wallet Address"
              value={pair.address}
              onChange={handleAddressChange(index)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label
              htmlFor={`network-${index}`}
              className="font-medium text-gray-900"
            >
              Blockchain Network
            </label>
            <input
              type="text"
              name={`network-${index}`}
              id={`network-${index}`}
              className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
              placeholder="Enter Blockchain Network"
              value={pair.network}
              onChange={handleNetworkChange(index)}
            />
          </div>
          <button
            type="button"
            onClick={handleRemovePair(index)}
            className="inline-flex items-center text-red-500 hover:text-red-700"
          >
            <span className="material-icons-outlined"></span>
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddPair}
        className="inline-flex items-center text-indigo-500 hover:text-indigo-700"
      >
        <span className="material-icons-outlined"> </span>
        Add More
      </button>

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default WalletForm;
