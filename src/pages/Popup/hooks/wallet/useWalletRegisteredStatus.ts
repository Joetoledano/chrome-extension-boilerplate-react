import { useState } from 'react';
import { OP_MANAGE_WALLETS_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';

const useWalletRegisteredStatus = (walletAddress = '') => {
  const [walletIsLoaded, setWalletIsLoaded] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [errorLoadingWallet, setErrorLoadingWallet] = useState(false);

  const handleLookupWalletsStatus = async (walletAddresses: string) => {
    if (!walletAddresses) return;
    try {
      setErrorLoadingWallet(false);
      setLoadingWallet(true);
      setWalletIsLoaded(false);
      const response = await Transport.fetch(
        `${OP_MANAGE_WALLETS_ENDPOINT}?address=${walletAddresses}`
      );
      if (response && response.results) {
        setLoadingWallet(false);
        const results = response.results;
        if (results.length === 1) {
          setWalletIsLoaded(
            results.find((result: any) => result.is_loaded) !== undefined
          );
          return results.find((result: any) => result.is_loaded) !== undefined;
        } else {
          setWalletIsLoaded(
            results.find((result: any) => result.is_loaded === false) ===
              undefined
          );
          return (
            results.find((result: any) => result.is_loaded === false) ===
            undefined
          );
        }
      }
      return false;
    } catch (e) {
      setErrorLoadingWallet(true);
      setLoadingWallet(false);
    }
  };

  return {
    walletIsLoaded,
    loadingWallet,
    errorLoadingWallet,
    handleLookupWalletsStatus,
  };
};

export default useWalletRegisteredStatus;
