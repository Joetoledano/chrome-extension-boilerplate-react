import React, { useState } from 'react';

interface IBusinessFormProps {
  businessName: string;
  businessAddress: string;
  onBack: () => void;
}

const BusinessForm: React.FC<IBusinessFormProps> = ({
  businessName,
  businessAddress,
  onBack,
}) => {
  const [name, setName] = useState(businessName);
  const [address, setAddress] = useState(businessAddress);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit form here, handle result
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex flex-col space-y-4 mb-4">
        <label htmlFor="businessName" className="font-medium text-gray-900">
          Business Name
        </label>
        <input
          type="text"
          name="businessName"
          id="businessName"
          className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
          placeholder="Enter Business Name"
          value={name}
          onChange={handleNameChange}
        />

        <label htmlFor="businessAddress" className="font-medium text-gray-900">
          Business Address
        </label>
        <input
          type="text"
          name="businessAddress"
          id="businessAddress"
          className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
          placeholder="Enter Business Address"
          value={address}
          onChange={handleAddressChange}
        />
      </div>

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

export default BusinessForm;
