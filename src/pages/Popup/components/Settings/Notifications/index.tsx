// NotificationSettings.tsx
import React from 'react';

interface INotificationSettingsProps {
  value: { balanceChanges: boolean };
  onChange: (value: { balanceChanges: boolean }) => void;
}

const NotificationSettings: React.FC<INotificationSettingsProps> = ({
  value,
  onChange,
}) => {
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ balanceChanges: e.target.checked });
  };

  return (
    <div className="notification-settings mt-2">
      <label className="text-gray-700 dark:text-gray-200">
        Notify on Balance Changes:
      </label>
      <input
        className="mt-1 block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
        type="checkbox"
        checked={value.balanceChanges}
        onChange={handleBalanceChange}
      />
    </div>
  );
};

export default NotificationSettings;
