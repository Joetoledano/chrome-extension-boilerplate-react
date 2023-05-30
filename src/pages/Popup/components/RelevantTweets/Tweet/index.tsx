import React from 'react';
import { fetchAddressForENSName } from '../../../../../Client';
import {
  copyToClipboard,
  extractEthAddress,
  truncateString,
} from '../../../../../lib/helpers';
import useBalances from '../../../hooks/balances/useBalances';

type TweetType = {
  id: string;
  text: string;
  username: string;
  handle: string;
  imageUrl: string;
  timestamp: string; // Consider using a Date if you have timestamps as datetime strings
  likes: number;
  replies: number;
  retweets: number;
};
interface TweetProps {
  tweet: TweetType;
  handleFocusWallet: (payload: any) => void;
}
const Tweet: React.FC<TweetProps> = ({ tweet, handleFocusWallet }) => {
  const [walletAddress, setWalletAddress] = React.useState<
    null | `0x${string}`
  >(null);
  const { getFormattedBalance } = useBalances();

  const [walletBalance, setWalletBalance] = React.useState(0);

  // if there a handle or username with eth in it, get the address
  const getAddressForTweet = React.useCallback(async () => {
    const textWithEnsAddress = [tweet.handle, tweet.username].find((el: any) =>
      el.includes('.eth')
    );

    if (textWithEnsAddress) {
      const extractedAddress = extractEthAddress(textWithEnsAddress);
      if (extractedAddress) {
        const addressForText = await fetchAddressForENSName(
          extractedAddress.toLowerCase().trim()
        );
        setWalletAddress(addressForText);
      }
    }
    return '';
  }, [tweet.handle, tweet.username]);

  React.useEffect(() => {
    getAddressForTweet();
  }, [tweet, getAddressForTweet]);

  const fetchBalanceForTweet = React.useCallback(async () => {
    if (walletAddress && walletAddress.includes('0x')) {
      const walletBalanceResult = await getFormattedBalance(walletAddress);
      setWalletBalance(walletBalanceResult);
    }
  }, [walletAddress, getFormattedBalance]);

  React.useEffect(() => {
    fetchBalanceForTweet();
  }, [walletAddress, fetchBalanceForTweet]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-2">
      <div className="flex items-center space-x-2">
        <img
          src={tweet.imageUrl}
          alt={tweet.username}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {tweet.username}
          </h3>
          <p className="text-sm text-gray-500">{tweet.handle}</p>
        </div>
      </div>
      <p className="text-base font-medium text-gray-700">{tweet.text}</p>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-gray-500">
            Balance: {Number(walletBalance).toFixed(2)} Eth
          </p>
          <div className="flex flex-row items-center gap-x-2">
            <p className="text-gray-500">
              Address:{' '}
              {truncateString(
                walletAddress ? walletAddress : '',
                walletAddress ? 4 : 0,
                walletAddress ? 4 : 0
              )}
            </p>
            {walletAddress ? (
              <button
                onClick={() => copyToClipboard(walletAddress)}
                className="font-light text-xs text-indigo-600 tracking-wide"
              >
                Copy{' '}
              </button>
            ) : null}
          </div>
        </div>
        <button
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() =>
            handleFocusWallet({
              focusedWalletHandle: tweet.handle,
              focusedWalletAddress: walletAddress,
              focusedWalletBalance: walletBalance,
              focusedWalletProfileImage: tweet.imageUrl,
            })
          }
        >
          View Wallet
        </button>
      </div>
      <p className="text-sm text-gray-500">{tweet.timestamp}</p>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">{tweet.likes} Likes</p>
        <p className="text-sm text-gray-500">{tweet.replies} Replies</p>
        <p className="text-sm text-gray-500">{tweet.retweets} Retweets</p>
      </div>
    </div>
  );
};
export default Tweet;
