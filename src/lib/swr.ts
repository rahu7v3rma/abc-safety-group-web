import { SWRConfiguration } from 'swr';
import axios from 'axios';
import cookie from 'js-cookie';
import config from '@/config';

export default {
   fetcher: async (resource: string | any[]) => {
      let url = 'http://localhost:8000';

      if (config.api) {
         url = config.api;
      }

      const auth = cookie.get(process.env.NEXT_PUBLIC_COOKIE_DOMAIN as string);

      return axios
         .get(url + (Array.isArray(resource) ? resource[0] : resource), {
            headers: {
               Authorization: auth ? `Bearer ${auth}` : '',
            },
            ...(Array.isArray(resource) ? resource[1] : {}),
         })
         .then((res) => res.data);
   },
   shouldRetryOnError: true,
   revalidateOnFocus: false,
} as SWRConfiguration;
