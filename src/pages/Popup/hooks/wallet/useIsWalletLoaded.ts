import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { OP_MANAGE_WALLETS_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';

const useIsWalletLoaded = (walletAddress: string) => {
  const [walletIsLoaded, setWalletIsLoaded] = useState(false);
  const buildWalletBalanceQuery = useCallback(() => {
    if (walletAddress && walletAddress.length) {
      return `${OP_MANAGE_WALLETS_ENDPOINT}?address=${walletAddress}`;
    }
    return null;
  }, [walletAddress]);
  const {
    data: responseForCheckingWalletStatus,
    error: errorCheckingWalletStatus,
    isLoading: loadingResponseForCheckingWalletStatus,
  } = useSWR(buildWalletBalanceQuery(), Transport.fetch, {});

  const walletLoadedStatus = useMemo(() => {
    if (!responseForCheckingWalletStatus) return false;
    const walletLoadedResults = responseForCheckingWalletStatus.results;
    if (walletLoadedResults) {
      if (walletLoadedResults.length === 1) {
        setWalletIsLoaded(
          walletLoadedResults.find((result: any) => result.is_loaded) !==
            undefined
        );
        return (
          walletLoadedResults.find((result: any) => result.is_loaded) !==
          undefined
        );
      } else {
        setWalletIsLoaded(
          walletLoadedResults.find(
            (result: any) => result.is_loaded === false
          ) === undefined
        );
        return (
          walletLoadedResults.find(
            (result: any) => result.is_loaded === false
          ) === undefined
        );
      }
    }
  }, [responseForCheckingWalletStatus]);

  return {
    walletLoadedStatus,
    errorCheckingWalletStatus,
    loadingResponseForCheckingWalletStatus,
  };
};

export default useIsWalletLoaded;
