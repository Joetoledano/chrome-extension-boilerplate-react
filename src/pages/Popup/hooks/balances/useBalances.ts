import { useState } from 'react';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { formatEther } from 'viem/utils';
import { DATA_CENTER_API_USER_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';
const useBalances = () => {
  const [loadingWalletTokens, setLoadingWalletTokens] = useState(false);
  const [errorLoadingWalletTokens, setErrorLoadingWalletTokens] =
    useState(false);
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });
  type addressType = `0x${string}`;
  const formatBalance = (balance: bigint): string => {
    return formatEther(balance);
  };
  const getFormattedBalance = async (walletAddress: any) => {
    const balancesData = await publicClient.getBalance({
      address: walletAddress,
    });
    return formatBalance(balancesData);
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
        const query = `${DATA_CENTER_API_USER_ENDPOINT}/balance/?wallet__address__in=${walletAddress}`;
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
