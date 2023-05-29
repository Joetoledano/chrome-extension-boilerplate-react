import React from 'react';

type tokenType = {
  name: string;
  symbol: string;
  image: string;
  amount: number;
  value: number;
  performance: number;
};
interface HoldingsItmeProps {
  token: tokenType;
}

const HoldingsItem: React.FC<HoldingsItmeProps> = ({ token }) => {
  return (
    <div className="flex flex-row justify-between items-center bg-white shadow-md p-3 rounded-md mb-2 transition-all duration-500 ease-in-out hover:shadow-lg">
      <div className="flex flex-row items-center">
        <img
          className="w-8 h-8 rounded-full mr-4 border-1 border-gray-300"
          src={token.image}
          alt={token.name}
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-gray-900 tracking-tighter">
            {token.name}
          </span>
          <span className="font-light text-xs text-gray-500 uppercase tracking-wider">
            {token.symbol}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold text-sm text-gray-900">
          {token.amount}{' '}
          <span className="font-light text-xs text-gray-500 uppercase">
            {token.symbol}
          </span>
        </span>
        <span className="font-light text-xs text-gray-600">${token.value}</span>
        <span
          className={`font-semibold text-xs ${
            token.performance >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {token.performance}%
        </span>
      </div>
    </div>
  );
};

export default HoldingsItem;
