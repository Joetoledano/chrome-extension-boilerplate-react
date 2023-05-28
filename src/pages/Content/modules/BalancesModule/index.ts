import { formatBalance, publicClient } from '../../../../Client';
export class balancesFetcherModule {
  private walletAddress: `0x${string}`;

  constructor(walletAddress: `0x${string}`) {
    this.walletAddress = walletAddress;
  }

  public async getFormattedBalance(): Promise<string> {
    const balancesData = await publicClient.getBalance({
      address: this.walletAddress,
    });
    return formatBalance(balancesData);
  }
}
