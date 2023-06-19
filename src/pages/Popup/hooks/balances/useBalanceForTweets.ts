import { useCallback } from 'react';
import { fetchAddressForENSName } from '../../../../Client';
import { extractEthAddress } from '../../../../lib/helpers';

const useBalanceForTweets = (
  relevantTweets: any[],
  setRelevantTweets: any,
  getFormattedBalance: any,
  getWalletTokenAllocation: any
) => {
  const fetchBalanceForTweet = useCallback(
    async (walletAddress: any) => {
      if (walletAddress !== undefined && walletAddress.includes('0x')) {
        const walletBalanceResult = await getFormattedBalance(walletAddress);
        return walletBalanceResult;
      }
    },
    [getFormattedBalance]
  );

  const getAddressForTweet = useCallback(async (tweet: any) => {
    const textWithEnsAddress = [tweet.handle, tweet.username].find(
      (el: any) => el !== undefined && el.includes('.eth')
    );

    if (textWithEnsAddress) {
      const extractedAddress = extractEthAddress(textWithEnsAddress);
      if (extractedAddress) {
        const addressForText = await fetchAddressForENSName(
          extractedAddress.toLowerCase().trim()
        );
        return addressForText;
      }
    }
    return '';
  }, []);

  const addBalancesAndAddressToRelevantTweets = useCallback(async () => {
    if (relevantTweets && relevantTweets.length) {
      const relevantTweetsWithBalancesAndAddresses = [];
      for (let currentTweet of relevantTweets) {
        if (!currentTweet.walletBalance && currentTweet.walletBalance !== 0) {
          const addressForTweet = await getAddressForTweet(currentTweet);
          if (!addressForTweet) return;
          const balanceForTweet = await fetchBalanceForTweet(addressForTweet);

          const allocationForTweet = await getWalletTokenAllocation(
            addressForTweet
          );

          const updatedTweet = {
            ...currentTweet,
            walletAddress: addressForTweet,
            walletBalance: balanceForTweet,
            walletTokenAllocation: allocationForTweet,
          };

          relevantTweetsWithBalancesAndAddresses.push(updatedTweet);
        } else {
          relevantTweetsWithBalancesAndAddresses.push(currentTweet);
        }
      }

      setRelevantTweets(relevantTweetsWithBalancesAndAddresses);

      return relevantTweetsWithBalancesAndAddresses;
    }

    return [];
  }, []);

  return {
    addBalancesAndAddressToRelevantTweets,
    fetchBalanceForTweet,
  };
};

export default useBalanceForTweets;
