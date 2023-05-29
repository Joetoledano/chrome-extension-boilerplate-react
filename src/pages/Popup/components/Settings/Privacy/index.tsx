// PrivacySettings.tsx
import React from 'react';

interface IPrivacySettingsProps {
  value: { profilePrivacy: boolean };
  onChange: (value: { profilePrivacy: boolean }) => void;
}

const PrivacySettings: React.FC<IPrivacySettingsProps> = ({
  value,
  onChange,
}) => {
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ profilePrivacy: e.target.checked });
  };

  return (
    <div className="privacy-settings mt-2">
      <label className="text-gray-700 dark:text-gray-200">
        Profile Privacy:
      </label>
      <input
        className="mt-1 block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
        type="checkbox"
        checked={value.profilePrivacy}
        onChange={handlePrivacyChange}
      />
    </div>
  );
};

export default PrivacySettings;
