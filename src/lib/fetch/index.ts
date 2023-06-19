import fetch from 'isomorphic-fetch';
import { secrets } from '../../../secrets/secrets.development';
const Transport = {
  async fetch(apiPath: string, opts: any = {}, endPoint: string = '') {
    try {
      const res = await fetch(apiPath, {
        ...opts,
        headers: {
          'X-API-KEY': `${secrets.OPENPOOL_API_KEY}`,
          ...(opts.headers || {}),
        },
      });
      return res.json();
    } catch (e) {}
  },

  async sendDataWithFile(apiPath: string, opts: any = {}) {
    const fetchOpts = Object.assign(
      {
        method: 'POST',
      },
      {
        body: opts.body,
      }
    );
    return this.fetch(apiPath, fetchOpts);
  },

  async sendJSON(apiPath: string, opts: any = {}) {
    console.log(JSON.stringify(opts.body));
    const fetchOpts = Object.assign(
      {
        method: 'POST',
      },
      opts,

      {
        body: JSON.stringify(opts.body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return this.fetch(apiPath, fetchOpts);
  },
  async updateJSON(apiPath: string, opts: any = {}) {
    const fetchOpts = Object.assign(
      {
        method: 'PUT',
      },
      opts,
      {
        body: JSON.stringify(opts.body),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return this.fetch(apiPath, fetchOpts);
  },
};

export default Transport;
