import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { formatEther } from 'viem/utils';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
type addressType = `0x${string}`;

export async function fetchAddressForENSName(
  ensName: string
): Promise<addressType | null> {
  if (ensName && ensName.includes('.eth')) {
    try {
      const ensAddress = await publicClient.getEnsAddress({ name: ensName });
      return ensAddress;
    } catch (e) {
      console.error('Error fetching the ENS address:', e);
    }
  }
  return null;
}

export function formatBalance(balance: bigint): string {
  return formatEther(balance);
}
