import { OPBalancesEndpoint, OPRegisterWalletEndpoint } from '../lib/constants';
import Transport from '../lib/fetch';

export const registerWallet = async (walletAddress: string) => {
  if (walletAddress) {
    try {
      const buildWalletBalanceQuery = () => {
        return `${OPRegisterWalletEndpoint}`;
      };

      const opts = {
        body: {
          wallets: walletAddress,
        },
      };
      const data = await Transport.sendJSON(buildWalletBalanceQuery(), opts);
      return data;
    } catch (e) {
      console.error('error registering a wallet', e);
    }
  }
};

export const fetchBalances = async (walletAddress: string) => {
  if (!walletAddress) {
    return {};
  }

  try {
    const buildWalletBalanceQuery = () => {
      return `${OPBalancesEndpoint}?wallet=${walletAddress}`;
    };

    const dataFromRegisteringWallet = await registerWallet(walletAddress);
    if (
      !(
        dataFromRegisteringWallet &&
        dataFromRegisteringWallet.results &&
        Array.isArray(dataFromRegisteringWallet.results) &&
        dataFromRegisteringWallet.results.some(
          (res: any) => res.is_loaded === true
        )
      )
    ) {
      alert('Wallet not loaded');
      return;
    }

    const data = await Transport.fetch(buildWalletBalanceQuery());
    const walletBalance = data?.data || {};
    const balancesByChain = data?.summary?.chain_breakdown || {};
    const walletSummary = data?.summary || {};
    const tokenAllocation = data?.summary?.allocation || [];
    const devActivity = data?.summary?.developer_activity || [];
    const currentWalletValue = data?.summary?.total_value || [];
    const largestAllocation = data?.summary?.allocation_largest || [];
    const smallestAllocation = data?.summary?.allocation_smallest || [];
    const priceWinner = data?.summary?.price_winner || [];
    const priceLoser = data?.summary?.price_loser || [];

    const protocolAllocation = walletSummary?.protocol_allocation
      ? walletSummary.protocol_allocation.map((obj: any) => ({
          allocation: (100 * obj.notional).toFixed(2),
          value: (100 * obj.notional).toFixed(2),
          label: obj.protocol,
        }))
      : [];

    return {
      walletBalance,
      walletSummary,
      tokenAllocation,
      currentWalletValue,
      protocolAllocation,
      devActivity,
      largestAllocation,
      smallestAllocation,
      priceWinner,
      priceLoser,
      balancesByChain,
    };
  } catch (error) {
    console.error('Error fetching balances', error);
    return {
      errorFetchingBalance: true,
    };
  }
};
