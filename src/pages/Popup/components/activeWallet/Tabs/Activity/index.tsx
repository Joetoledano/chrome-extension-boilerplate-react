import { Tab } from '@headlessui/react';
import React, { useState } from 'react';
import ActivityButton from '../../../common/ActivityButton';
import ActivityItem from '../../../common/ActivityItem';
interface Activity {
  type: string;
  time: string;
  address: string;
  amount: number;
}

const ActivitiesTab: React.FC = () => {
  const [activityType, setActivityType] = useState<string>('all');

  const activities: Activity[] = [
    // Populate with your activities data, should include type, time, address, and amount
  ];

  const filteredActivities = activities.filter(
    (activity) => activity.type === activityType || activityType === 'all'
  );

  return (
    <Tab.Panel className="flex flex-col w-full space-y-4">
      <div className="flex flex-row justify-around w-full mb-4">
        {['send', 'receive', 'mint', 'all'].map((activity) => (
          <ActivityButton
            activity={activity}
            selectedActivity={activityType}
            setSelectedActivity={setActivityType}
          />
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        {filteredActivities.map((activity, index) => (
          <ActivityItem activity={activity} key={index} />
        ))}
      </div>
    </Tab.Panel>
  );
};

export default ActivitiesTab;
