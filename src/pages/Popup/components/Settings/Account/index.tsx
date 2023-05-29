// AccountSettings.tsx
import React from 'react';

interface IAccountSettingsProps {
  value: { email: string };
  onChange: (value: { email: string }) => void;
}

const AccountSettings: React.FC<IAccountSettingsProps> = ({
  value,
  onChange,
}) => {
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ email: e.target.value });
  };

  return (
    <div className="account-settings mt-2">
      <label className="text-gray-700 dark:text-gray-200">Email:</label>
      <input
        className="input-field mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
        type="email"
        value={value.email}
        onChange={handleEmailChange}
      />
    </div>
  );
};

export default AccountSettings;
