export const OPRegisterWalletEndpoint =
  'https://api.openpool.co/wallet/manage/';

export const OPBalancesEndpoint = 'https://api.openpool.co/wallet/balance/';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';