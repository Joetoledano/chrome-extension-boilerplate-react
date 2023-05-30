// useWallet.js
import { useCallback, useEffect, useState } from 'react';
import { fetchAddressForENSName } from '../../../../Client';
import { profileActions } from '../../../../lib/constants/ActionMessages';
import ExtensionMessagingHub from '../../../../messaging/';
import useBalances from '../balances/useBalances';

const useWallet = (initialAddress = null) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(
    initialAddress
  );
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const { getFormattedBalance } = useBalances();

  const fetchBalance = useCallback(async () => {
    if (walletAddress?.includes('0x') && walletBalance === null) {
      try {
        const walletBalanceResult = await getFormattedBalance(walletAddress);
        setWalletBalance(walletBalanceResult);

        const messageData = {
          action: profileActions.renderProfileInfo,
          payload: {
            walletBalance: walletBalanceResult,
            walletAddress: walletAddress,
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
  }, [walletAddress, walletBalance, getFormattedBalance]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const setAddress = useCallback(async (address: string) => {
    if (address.includes('.eth')) {
      const fullWalletAddress = await fetchAddressForENSName(address);
      setWalletAddress(fullWalletAddress || address);
    } else {
      setWalletAddress(address);
    }
  }, []);

  return { walletAddress, walletBalance, setWalletAddress: setAddress };
};

export default useWallet;
