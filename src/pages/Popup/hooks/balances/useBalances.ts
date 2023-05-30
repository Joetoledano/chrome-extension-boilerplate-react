import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { formatEther } from 'viem/utils';

const useBalances = () => {
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
  return {
    getFormattedBalance,
  };
};

export default useBalances;
