import React, { useState } from 'react';
import AccountSettings from './Account';
import DataSettings from './Data';
import DisplaySettings from './Display';
import NotificationSettings from './Notifications';
import PrivacySettings from './Privacy';

const Settings = () => {
  const [account, setAccount] = useState({});
  const [notifications, setNotifications] = useState({});
  const [privacy, setPrivacy] = useState({});
  const [display, setDisplay] = useState({});
  const [data, setData] = useState({});

  // functions to handle changes go here

  return (
    <div className="settings p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Settings
      </h2>

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          Account Settings
        </h3>
        <AccountSettings value={account} onChange={setAccount} />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          Notification Settings
        </h3>
        <NotificationSettings
          value={notifications}
          onChange={setNotifications}
        />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          Privacy Settings
        </h3>
        <PrivacySettings value={privacy} onChange={setPrivacy} />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          Display Settings
        </h3>
        <DisplaySettings value={display} onChange={setDisplay} />
      </div>

      <div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200">
          Data Settings
        </h3>
        <DataSettings value={data} onChange={setData} />
      </div>
    </div>
  );
};

export default Settings;
