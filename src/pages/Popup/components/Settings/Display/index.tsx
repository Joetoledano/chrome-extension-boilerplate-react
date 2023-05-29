// DisplaySettings.tsx
import React from 'react';

interface IDisplaySettingsProps {
  value: { currency: string };
  onChange: (value: { currency: string }) => void;
}

const DisplaySettings: React.FC<IDisplaySettingsProps> = ({
  value,
  onChange,
}) => {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ currency: e.target.value });
  };

  return (
    <div className="display-settings">
      <label>Display Currency:</label>
      <select
        className="select-field"
        value={value.currency}
        onChange={handleCurrencyChange}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        {/* Add as many currencies as you need */}
      </select>
    </div>
  );
};

export default DisplaySettings;
