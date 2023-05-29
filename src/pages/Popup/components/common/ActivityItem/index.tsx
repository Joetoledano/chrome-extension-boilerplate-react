import React from 'react';
// ./components/ActivityItem.tsx
interface Activity {
  type: string;
  time: string;
  address: string;
  amount: number;
}

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="flex flex-row justify-between items-center bg-gray-100 p-4 rounded-lg">
      <span className="font-semibold text-sm">{activity.type}</span>
      <span className="font-mono text-sm">{activity.time}</span>
      <span className="font-mono text-sm">{activity.address}</span>
      <span className="font-mono text-sm">{activity.amount}</span>
    </div>
  );
};

export default ActivityItem;
