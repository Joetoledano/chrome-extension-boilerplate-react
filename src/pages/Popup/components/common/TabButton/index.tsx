import { Tab } from '@headlessui/react';
import React from 'react';
interface TabButtonProps {
  label: string;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
}

const TabButton: React.FC<TabButtonProps> = ({
  label,
  selectedLabel,
  setSelectedLabel,
}) => (
  <Tab
    className={({ selected }) =>
      `py-2 px-4 font-semibold ${
        selected ? 'bg-blue-400 text-white' : 'text-gray-800'
      }`
    }
    onClick={() => setSelectedLabel(label)}
  >
    {label}
  </Tab>
);

export default TabButton;
