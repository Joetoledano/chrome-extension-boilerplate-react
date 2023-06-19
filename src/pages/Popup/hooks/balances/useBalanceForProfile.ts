import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { profileActions } from '../../../../lib/constants/ActionMessages';
import { OP_BALANCES_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';
import ExtensionMessagingHub from '../../../../messaging';
const useBalanceForProfile = (
  walletAddressForFocusedWallet: string | null,
  getFormattedBalance = null
) => {
  const [walletBalanceForFocusedWallet, setWalletBalanceForFocusedWallet] =
    useState<number | null>(null);

  const fetchProfileBalance = useCallback(async () => {
    if (
      walletAddressForFocusedWallet?.includes('0x') &&
      walletBalanceForFocusedWallet === null &&
      getFormattedBalance !== null
    ) {
      try {
        const walletBalanceResult = await getFormattedBalance(
          walletAddressForFocusedWallet
        );
        setWalletBalanceForFocusedWallet(walletBalanceResult);
        const messageData = {
          action: profileActions.renderProfileInfo,
          payload: {
            walletBalance: walletBalanceResult,
            walletAddress: walletAddressForFocusedWallet,
          },
        };

        await ExtensionMessagingHub.sendMessage(
          'background',
          null,
          'messageFromPopup',
          messageData
        );
      } catch (error) {
        console.error(
          `Error while fetching the balance and communicating with background script: ${JSON.stringify(
            error
          )}`
        );
      }
    }
  }, [
    walletAddressForFocusedWallet,
    walletBalanceForFocusedWallet,
    getFormattedBalance,
  ]);

  const buildWalletBalanceQuery = useCallback(() => {
    if (walletAddressForFocusedWallet) {
      return `${OP_BALANCES_ENDPOINT}?wallet=${walletAddressForFocusedWallet}`;
    }
    return null;
  }, [walletAddressForFocusedWallet]);
  const {
    data: responseForWalletTokensForFocusedWallet,
    error: errorForWalletTokensForFocusedWallet,
    isLoading: loadingBWalletTokensForFocusedWallet,
  } = useSWR(buildWalletBalanceQuery(), Transport.fetch);

  // const walletBalanceForProfile = useMemo(() => {
  //   return responseForWalletTokensForFocusedWallet
  //     ? responseForWalletTokensForFocusedWallet.data
  //     : [];
  // }, [responseForWalletTokensForFocusedWallet]);
  // const balancesByChainForProfile = useMemo(() => {
  //   return responseForWalletTokensForFocusedWallet &&
  //     responseForWalletTokensForFocusedWallet.summary &&
  //     responseForWalletTokensForFocusedWallet.summary.chain_breakdown
  //     ? responseForWalletTokensForFocusedWallet.summary.chain_breakdown
  //     : {};
  // }, [responseForWalletTokensForFocusedWallet]);
  const walletSummaryForProfile = useMemo(() => {
    return responseForWalletTokensForFocusedWallet
      ? responseForWalletTokensForFocusedWallet.summary
      : {};
  }, [responseForWalletTokensForFocusedWallet]);
  const tokenAllocationForProfile = useMemo(() => {
    return responseForWalletTokensForFocusedWallet &&
      responseForWalletTokensForFocusedWallet.data
      ? responseForWalletTokensForFocusedWallet.data
      : [];
  }, [responseForWalletTokensForFocusedWallet]);

  return {
    fetchProfileBalance,
    walletBalanceForFocusedWallet,
    setWalletBalanceForFocusedWallet,
    tokenAllocationForProfile,
    walletSummaryForProfile,
    loadingBWalletTokensForFocusedWallet,
    errorForWalletTokensForFocusedWallet,
  };
};
export default useBalanceForProfile;
