import { Tab } from '@headlessui/react';
import React from 'react';
import Tweet from './Tweet';

type TweetType = {
  id: string;
  content: any;
  balance: string;
  address: string;
  username: string;
  handle: string;
  imageUrl: string;
  timestamp: string; // Consider using a Date if you have timestamps as datetime strings
  likes: number;
  replies: number;
  retweets: number;
};

type Props = {
  tweets: TweetType[];
  handleFocusWallet: (payload: any) => void;
};

const RelevantTweetsList: React.FC<Props> = ({ tweets, handleFocusWallet }) => {
  return (
    <Tab.Panel>
      <div className="max-w-xl mx-auto bg-white h-screen w-full text-gray-800 px-4 py-2 shadow-md space-y-4">
        <div className="flex items-center flex-col justify-between text-gray-900">
          <label htmlFor="account" className="font-semibold text-lg">
            View Relevant Tweets
          </label>
          <span className="font-mono text-sm">
            Review all tweets with available addresses
          </span>
        </div>
        {tweets.map((tweet: TweetType) => (
          <Tweet
            tweet={tweet}
            handleFocusWallet={handleFocusWallet}
            key={tweet.content}
          />
        ))}
      </div>
    </Tab.Panel>
  );
};

export default RelevantTweetsList;
