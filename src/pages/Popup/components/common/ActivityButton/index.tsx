// ./components/ActivityButton.tsx
import React from 'react';
interface ActivityButtonProps {
  activity: string;
  selectedActivity: string;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
}

const ActivityButton: React.FC<ActivityButtonProps> = ({
  activity,
  selectedActivity,
  setSelectedActivity,
}) => {
  return (
    <button
      className={`font-semibold py-2 px-4 ${
        selectedActivity === activity
          ? 'bg-blue-500 text-white'
          : 'text-gray-800'
      }`}
      onClick={() => setSelectedActivity(activity)}
    >
      {activity}
    </button>
  );
};

export default ActivityButton;
