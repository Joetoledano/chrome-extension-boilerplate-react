import { Menu } from '@headlessui/react';
import React from 'react';

interface IDropdownProps {
  options: string[];
  onChange: (option: string) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({ options, onChange }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center whitespace-nowrap w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add detail
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-.707.293 1 1 0 01-.707-.293l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Menu.Button>
      </div>

      <Menu.Items className="origin-top-right w-full absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1">
          {options.map((option, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  onClick={() => onChange(option)}
                  className={`block  w-full px-4 py-2 text-sm ${
                    active ? 'bg-gray-200 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  {option}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default Dropdown;
