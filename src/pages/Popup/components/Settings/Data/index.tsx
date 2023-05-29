// DataSettings.tsx
import React from 'react';

interface IDataSettingsProps {
  value: any;
  onChange: (value: any) => void;
}

const DataSettings: React.FC<IDataSettingsProps> = ({ value, onChange }) => {
  const handleDataExport = () => {
    // Implement your data exporting logic here
  };

  const handleDataDeletion = () => {
    // Implement your data deletion logic here
  };
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="data-settings">
      <div className="data-settings mt-2">
        <label className="text-gray-700 dark:text-gray-200">
          Data Preferences:
        </label>
        <input
          className="mt-1 block rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm text-gray-900"
          type="text"
          value={value}
          onChange={handleDataChange}
        />
      </div>
      <button onClick={handleDataExport}>Export Data</button>
      <button onClick={handleDataDeletion}>Delete Data</button>
    </div>
  );
};

export default DataSettings;
