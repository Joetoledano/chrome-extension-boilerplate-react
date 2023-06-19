import { useState } from 'react';
import { formatEther } from 'viem/utils';
import { publicClient } from '../../../../Client';
import { OP_BALANCES_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';
const useBalances = () => {
  const [loadingWalletTokens, setLoadingWalletTokens] = useState(false);
  const [errorLoadingWalletTokens, setErrorLoadingWalletTokens] =
    useState(false);

  type addressType = `0x${string}`;
  const formatBalance = (balance: bigint): string => {
    return formatEther(balance);
  };
  const getFormattedBalance = async (walletAddress: any) => {
    try {
      const balancesData = await publicClient.getBalance({
        address: walletAddress,
      });
      return formatBalance(balancesData);
    } catch (e) {
      console.error(e);
    }
  };

  const getTokenAllocationFromResponse = (response: any) => {
    return response && response.summary && response.summary.allocation
      ? response.summary.allocation
      : [];
  };

  const getWalletTokensForAddress = async (walletAddress: string) => {
    try {
      if (walletAddress && walletAddress.length) {
        setErrorLoadingWalletTokens(false);
        setLoadingWalletTokens(true);
        const query = `${OP_BALANCES_ENDPOINT}?wallet=${walletAddress}`;
        const walletBalancesResponse = await Transport.fetch(query);
        setLoadingWalletTokens(false);
        const tokenAllocation = getTokenAllocationFromResponse(
          walletBalancesResponse
        );
        return tokenAllocation;
      }
    } catch (e) {
      setErrorLoadingWalletTokens(true);
      setLoadingWalletTokens(false);
    }
  };

  return {
    getFormattedBalance,
    getWalletTokensForAddress,
    errorLoadingWalletTokens,
    loadingWalletTokens,
  };
};

export default useBalances;
