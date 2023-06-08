import React, { useCallback } from 'react';

const useBalanceForTweets = (
  relevantTweets: any[],
  setRelevantTweets: any,
  getAddressForTweet: any,
  getFormattedBalance: any,
  getWalletTokenAllocation: any
) => {
  const fetchBalanceForTweet = React.useCallback(async (walletAddress: any) => {
    if (walletAddress && walletAddress.includes('0x')) {
      const walletBalanceResult = await getFormattedBalance(walletAddress);
      return walletBalanceResult;
    }
  }, []);

  // TODO SET UP THIS FUNCTION
  const findOverlapsBetweenAddressAndTweet = (
    tokensFromTweet: any,
    tokensFromAddress: any
  ) => {};

  const addBalancesAndAddressToRelevantTweets = useCallback(async () => {
    if (relevantTweets && relevantTweets.length) {
      const relevantTweetsWithBalancesAndAddresses = [];
      for (let currentTweet of relevantTweets) {
        const addressForTweet = await getAddressForTweet(currentTweet);
        const balanceForTweet = await fetchBalanceForTweet(addressForTweet);
        const allocationForTweet = await getWalletTokenAllocation(
          addressForTweet
        );
        const tokenOverlapsfromTweetsAndBalances = [];

        // Create a new object with the updated properties
        const updatedTweet = {
          ...currentTweet,
          walletAddress: addressForTweet,
          walletBalance: balanceForTweet,
          walletTokenAllocation: allocationForTweet,
          walletTokenMentionsInTweet: tokenOverlapsfromTweetsAndBalances,
        };

        relevantTweetsWithBalancesAndAddresses.push(updatedTweet);
      }
      setRelevantTweets(relevantTweetsWithBalancesAndAddresses);

      return relevantTweetsWithBalancesAndAddresses;
    }
    return [];
  }, [
    relevantTweets,
    fetchBalanceForTweet,
    getWalletTokenAllocation,
    getAddressForTweet,
  ]);

  return {
    addBalancesAndAddressToRelevantTweets,
    fetchBalanceForTweet,
  };
};

export default useBalanceForTweets;
