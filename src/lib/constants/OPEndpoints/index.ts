export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true';

export const API_ENDPOINT: string =
  IS_PRODUCTION && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://api.diveinopenpool.com'
    : 'https://staging.api.diveinopenpool.com';
// : "http://127.0.0.1:8000"

export const OPENPOOL_API_KEY: string =
  IS_PRODUCTION && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? '1c2a1f4a7f15bf7fc585c0cec8e02c8c3df0804d'
    : '56a659e6417a73561cf3da96c201acb31d1aea6d';

export const DATA_CENTER_API_REF_ENDPOINT: string = `${API_ENDPOINT}/refdata`;
export const DATA_CENTER_API_DATA_ENDPOINT: string = `${API_ENDPOINT}/data`;
export const DATA_CENTER_API_USER_ENDPOINT: string = `${API_ENDPOINT}/user`;
