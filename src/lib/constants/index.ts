export const OPRegisterWalletEndpoint =
  'https://api.openpool.co/wallet/manage/';

export const OPBalancesEndpoint = 'https://api.openpool.co/wallet/balance/';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const OPENPOOL_API_KEY =
  IS_PRODUCTION && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? '31dda58a54e10751883afb9fb432cecc46be9786'
    : '31dda58a54e10751883afb9fb432cecc46be9786';
