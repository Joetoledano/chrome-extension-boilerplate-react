import React from 'react';

interface SubscriptionOptionProps {
  selected: boolean;
  option: string;
  onOptionSelect: () => void;
}

const SubscriptionOption: React.FC<SubscriptionOptionProps> = ({
  selected,
  option,
  onOptionSelect,
}) => {
  return (
    <div className="flex flex-col  gap-y-4 ">
      <button
        onClick={onOptionSelect}
        className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none transition-colors duration-200 
          ${
            selected
              ? 'bg-blue-600 text-white'
              : 'bg-white text-blue-600 border border-blue-600'
          }`}
      >
        {option}
      </button>
      <p className="text-gray-600 text-sm mt-1">
        {option === 'Basic'
          ? 'Basic features description'
          : 'Premium features description'}
      </p>
    </div>
  );
};

export default SubscriptionOption;
