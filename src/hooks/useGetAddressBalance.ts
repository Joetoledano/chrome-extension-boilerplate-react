import React, { useCallback, useState } from 'react';
import useSWR from 'swr';

import { OPBalancesEndpoint } from '../lib/constants';
import Transport from '../lib/fetch';

const useWalletBalances = (walletAddress: string, localGranularity = '') => {
  const [showUnsupportedTokens, setShowUnsupportedTokens] = useState(false);

  const buildWalletBalanceQuery = useCallback(() => {
    if (walletAddress) {
      return `${OPBalancesEndpoint}/balance/?wallet__address__in=${walletAddress}`;
    } else return null;
  }, [walletAddress]);
  const {
    data,
    error,
    isLoading: loadingBalances,
  } = useSWR(buildWalletBalanceQuery(), Transport.fetch);

  const walletBalance = React.useMemo(() => {
    return data ? data.data : [];
  }, [data]);
  const balancesByChain = React.useMemo(() => {
    return data && data.summary && data.summary.chain_breakdown
      ? data.summary.chain_breakdown
      : {};
  }, [data]);
  const walletSummary = React.useMemo(() => {
    return data ? data.summary : {};
  }, [data]);
  const tokenAllocation = React.useMemo(() => {
    return data && data.summary && data.summary.allocation
      ? data.summary.allocation
      : [];
  }, [data]);
  const devActivity = React.useMemo(() => {
    return data && data.summary && data.summary.developer_activity
      ? data.summary.developer_activity
      : [];
  }, [data]);
  const currentWalletValue = React.useMemo(() => {
    return data && data.summary && data.summary.total_value
      ? data.summary.total_value
      : [];
  }, [data]);
  const largestAllocation = React.useMemo(() => {
    return data && data.summary && data.summary.allocation_largest
      ? data.summary.allocation_largest
      : [];
  }, [data]);
  const smallestAllocation = React.useMemo(() => {
    return data && data.summary && data.summary.allocation_smallest
      ? data.summary.allocation_smallest
      : [];
  }, [data]);
  const priceWinner = React.useMemo(() => {
    return data && data.summary && data.summary.price_winner
      ? data.summary.price_winner
      : [];
  }, [data]);
  const priceLoser = React.useMemo(() => {
    return data && data.summary && data.summary.price_loser
      ? data.summary.price_loser
      : [];
  }, [data]);

  const protocolAllocation = React.useMemo(() => {
    return (
      walletSummary?.protocol_allocation
        ? walletSummary?.protocol_allocation
        : []
    ).map((obj: any) => ({
      allocation: (100 * obj.notional).toFixed(2),
      value: (100 * obj.notional).toFixed(2),
      label: obj.protocol,
    }));
  }, [walletSummary?.protocol_allocation]);

  return {
    walletBalance,
    walletSummary,
    tokenAllocation,
    currentWalletValue,
    protocolAllocation,
    devActivity,
    loadingBalances,
    error,
    showUnsupportedTokens,
    setShowUnsupportedTokens,
    largestAllocation,
    smallestAllocation,
    priceWinner,
    priceLoser,
    balancesByChain,
  };
};

export default useWalletBalances;
