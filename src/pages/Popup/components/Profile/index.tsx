import React from 'react';
import SubscriptionOption from './Subscriptions/SubscriptionOption';

const Profile: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [defaultAddress, setDefaultAddress] = React.useState('');
  const [subscriptionTier, setSubscriptionTier] = React.useState('Basic');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handleDefaultAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDefaultAddress(e.target.value);
  };

  const SubscriptionOptions = ['Basic', 'Premium'];

  return (
    <div className="max-w-xl mx-auto bg-white h-full w-full text-gray-800 px-4 py-2 shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Profile
      </h2>

      <div className="w-full flex flex-col justify-start mt-2">
        <label className="text-gray-700 dark:text-gray-200">
          Subscription:
        </label>
        <div className="flex flex-row items-center justify-between w-full gap-x-10">
          {SubscriptionOptions.map((option) => (
            <div key={option}>
              <SubscriptionOption
                selected={subscriptionTier === option}
                option={option}
                onOptionSelect={() => setSubscriptionTier(option)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="account-settings mt-2">
        <label className="text-gray-700 dark:text-gray-200">Username:</label>
        <input
          className="input-field mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>

      <div className="account-settings mt-2">
        <label className="text-gray-700 dark:text-gray-200">Email:</label>
        <input
          className="input-field mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>

      <div className="account-settings mt-2">
        <label className="text-gray-700 dark:text-gray-200">
          Default Address:
        </label>
        <input
          className="input-field mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
          type="text"
          value={defaultAddress}
          onChange={handleDefaultAddressChange}
        />
      </div>
    </div>
  );
};

export default Profile;
