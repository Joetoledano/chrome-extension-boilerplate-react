import React, { useState } from 'react';

interface ISocialFormProps {
  lensProfile: string;
  farcasterProfile: string;
  blueskyProfile: string;
  onBack: () => void;
}

const SocialForm: React.FC<ISocialFormProps> = ({
  lensProfile,
  farcasterProfile,
  blueskyProfile,
  onBack,
}) => {
  const [lens, setLens] = useState(lensProfile);
  const [farcaster, setFarcaster] = useState(farcasterProfile);
  const [bluesky, setBluesky] = useState(blueskyProfile);

  const handleLensChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLens(event.target.value);
  };

  const handleFarcasterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFarcaster(event.target.value);
  };

  const handleBlueskyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBluesky(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit form here, handle result
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex flex-col space-y-4 mb-4">
        <label htmlFor="lensProfile" className="font-medium text-gray-900">
          Lens Profile
        </label>
        <input
          type="text"
          name="lensProfile"
          id="lensProfile"
          className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
          placeholder="Enter Lens Profile"
          value={lens}
          onChange={handleLensChange}
        />

        <label htmlFor="farcasterProfile" className="font-medium text-gray-900">
          Farcaster Profile
        </label>
        <input
          type="text"
          name="farcasterProfile"
          id="farcasterProfile"
          className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
          placeholder="Enter Farcaster Profile"
          value={farcaster}
          onChange={handleFarcasterChange}
        />

        <label htmlFor="blueskyProfile" className="font-medium text-gray-900">
          Blue Sky Profile
        </label>
        <input
          type="text"
          name="blueskyProfile"
          id="blueskyProfile"
          className="border rounded-md p-2 w-full focus:outline-none focus:border-indigo-500"
          placeholder="Enter Blue Sky Profile"
          value={bluesky}
          onChange={handleBlueskyChange}
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

export default SocialForm;
