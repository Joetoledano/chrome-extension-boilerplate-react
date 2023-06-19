export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const API_ENDPOINT: string = 'https://api.openpool.co';
// : "http://127.0.0.1:8000"

export const OPENPOOL_API_KEY: string =
  '56a659e6417a73561cf3da96c201acb31d1aea6d';

export const DATA_CENTER_API_REF_ENDPOINT: string = `${API_ENDPOINT}/refdata`;
export const DATA_CENTER_API_DATA_ENDPOINT: string = `${API_ENDPOINT}/data`;
export const OP_MANAGE_WALLETS_ENDPOINT: string = `${API_ENDPOINT}/wallet/manage/`;
export const OP_BALANCES_ENDPOINT = 'https://api.openpool.co/wallet/balance/';
