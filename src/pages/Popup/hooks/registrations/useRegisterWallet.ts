import { useCallback, useState } from 'react';
import { DATA_CENTER_API_USER_ENDPOINT } from '../../../../lib/constants/OPEndpoints';
import Transport from '../../../../lib/fetch';

interface RegisterWalletResponse {
  wallet_id: number | undefined;
  error: boolean;
  is_loaded: boolean;
  loadedTokenBalances: boolean;
  loadedNFTBalances: boolean;
  loadedTransactions: boolean;
  isPolygonLoaded: boolean;
  address: '';
}

const useRegisterWallet = (): {
  handleRegisterWalletInBackend: (
    walletAddress: string
  ) => Promise<RegisterWalletResponse | RegisterWalletResponse[]>;
  registeringWallet: boolean;
  errorRegisteringWallet: boolean;
  availableRegistrationsRemaining: number;
  setAvailableRegistrationsRemaining: any;
} => {
  const [registeringWallet, setRegisteringWallet] = useState<boolean>(false);
  const [errorRegisteringWallet, setErrorRegisteringWallet] =
    useState<boolean>(false);
  const [availableRegistrationsRemaining, setAvailableRegistrationsRemaining] =
    useState<number>(0);

  const handleRegisterWalletInBackend = useCallback(
    async (walletAddress: string): Promise<RegisterWalletResponse> => {
      if (!walletAddress || walletAddress.length === 0) {
        return {
          wallet_id: undefined,
          error: true,
          is_loaded: false,
          loadedTokenBalances: false,
          loadedNFTBalances: false,
          loadedTransactions: false,
          isPolygonLoaded: false,
          address: '',
        };
      }

      setRegisteringWallet(true);
      setErrorRegisteringWallet(false);
      const formattedAddressInCaseOfMultipleAddresses = walletAddress
        .split(',')
        .map((address) => address.trim());

      try {
        const responseFromCreatingWallet = await Transport.sendJSON(
          `${DATA_CENTER_API_USER_ENDPOINT}/wallet/`,
          {
            body: { addresses: [...formattedAddressInCaseOfMultipleAddresses] },
          }
        );
        if (!responseFromCreatingWallet) {
          throw new Error('Failed to create wallet.');
        }
        if (walletAddress.includes(',')) {
          setRegisteringWallet(false);
          setErrorRegisteringWallet(false);
          return responseFromCreatingWallet.results;
        } else {
          const singleWalletResponseObject =
            responseFromCreatingWallet.results[0];
          const hasError = await singleWalletResponseObject.is_error;
          const walletId = await singleWalletResponseObject.id;
          const isLoaded = await singleWalletResponseObject.is_loaded;
          const loadedTokenBalances =
            await singleWalletResponseObject.collected_balances;
          const loadedNFTBalances =
            await singleWalletResponseObject.collected_nfts;
          const loadedTransactions =
            await singleWalletResponseObject.collected_txs;
          const isPolygonLoaded =
            await singleWalletResponseObject.is_polygon_loaded;
          const address = await singleWalletResponseObject.address;

          setRegisteringWallet(false);

          return {
            wallet_id: walletId,
            error: hasError,
            is_loaded: isLoaded,
            loadedTokenBalances,
            loadedNFTBalances,
            loadedTransactions,
            isPolygonLoaded,
            address,
          };
        }
      } catch (e) {
        setRegisteringWallet(false);
        setErrorRegisteringWallet(true);
        console.error('Error from trying to register a wallet:', e);
        return {
          wallet_id: 0,
          error: true,
          is_loaded: false,
          loadedTokenBalances: false,
          loadedNFTBalances: false,
          loadedTransactions: false,
          isPolygonLoaded: false,
          address: '',
        };
      }
    },
    []
  );

  return {
    handleRegisterWalletInBackend,
    registeringWallet,
    errorRegisteringWallet,
    availableRegistrationsRemaining,
    setAvailableRegistrationsRemaining,
  };
};

export default useRegisterWallet;
