import React, { useState } from 'react';
import AccountSettings from './Account';
import DataSettings from './Data';
import DisplaySettings from './Display';
import NotificationSettings from './Notifications';
import PrivacySettings from './Privacy';

interface ISettingsComponent {
  title: string;
  description: string;
  component: JSX.Element;
  icon: string;
}

const Settings: React.FC = () => {
  const [account, setAccount] = useState<Record<string, unknown>>({});
  const [notifications, setNotifications] = useState<Record<string, unknown>>(
    {}
  );
  const [privacy, setPrivacy] = useState<Record<string, unknown>>({});
  const [display, setDisplay] = useState<Record<string, unknown>>({});
  const [data, setData] = useState<Record<string, unknown>>({});

  const [currentSetting, setCurrentSetting] =
    useState<ISettingsComponent | null>(null);

  const settingsList: ISettingsComponent[] = [
    {
      title: 'Account Settings',
      description: 'Manage your account details',
      component: <AccountSettings value={account} onChange={setAccount} />,
      icon: '👤',
    },
    {
      title: 'Notification Settings',
      description: 'Control your notification preferences',
      component: (
        <NotificationSettings
          value={notifications}
          onChange={setNotifications}
        />
      ),
      icon: '🔔',
    },
    {
      title: 'Privacy Settings',
      description: 'Control your privacy settings',
      component: <PrivacySettings value={privacy} onChange={setPrivacy} />,
      icon: '🔒',
    },
    {
      title: 'Display Settings',
      description: 'Adjust your display settings',
      component: <DisplaySettings value={display} onChange={setDisplay} />,
      icon: '🖥️',
    },
    {
      title: 'Data Settings',
      description: 'Manage your data settings',
      component: <DataSettings value={data} onChange={setData} />,
      icon: '📊',
    },
  ];

  const handleSettingClick = (setting: ISettingsComponent) => {
    setCurrentSetting(setting);
  };

  return (
    <div className="max-w-xl mx-auto bg-white h-screen w-full text-gray-800 px-4 py-2 shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Settings
      </h2>

      {!currentSetting ? (
        settingsList.map((setting, index) => (
          <div
            key={setting.title}
            className={`mb-4 cursor-pointer ${
              index < settingsList.length - 1
                ? 'border-b border-gray-200 pb-4'
                : ''
            }`}
            onClick={() => handleSettingClick(setting)}
          >
            <div className="flex items-center">
              <span className="mr-2">{setting.icon}</span>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
                {setting.title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {setting.description}
            </p>
          </div>
        ))
      ) : (
        <div>
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => setCurrentSetting(null)}
          >
            Back
          </button>
          {currentSetting.component}
        </div>
      )}
    </div>
  );
};

export default Settings;
