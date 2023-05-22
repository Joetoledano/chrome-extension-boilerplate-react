import { formatBalance, publicClient } from '../../../../Client';
export class balancesFetcherModule {
  constructor() {}

  public async getFormattedBalance(ensAddress: `0x${string}`): Promise<string> {
    const balancesData = await publicClient.getBalance({ address: ensAddress });
    return formatBalance(balancesData);
  }
}
