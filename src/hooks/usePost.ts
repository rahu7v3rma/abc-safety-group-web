import { useCallback, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import {
   APIResponseActions,
   APIResponseError,
   TAPIRouters,
   APIResponse,
} from '@/lib/types';
import config from '@/config';
import { filterObjectToQueries, formatResource } from '@/lib/helpers';
import { State } from '@hookstate/core';

export default function usePost<D, P>(
   router: TAPIRouters,
   resource: string | (string | State<string, {}>)[],
   rootActions?: APIResponseActions<P>,
   rootQueries?: Record<string, any | State<any, {}>>,
) {
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | false>(false);

   const post = useCallback(
      async (
         data: D,
         actions?: APIResponseActions<P>,
         options?: AxiosRequestConfig & {
            throw?: boolean;
            ott?: string;
         },
         queries?: Record<string, any | State<any, {}>>,
      ): Promise<APIResponse<P, false>> => {
         let auth = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);

         if (options && options.ott) {
            auth = options.ott;
         }

         setError(false);
         setLoading(true);

         const searchQueries =
            rootQueries || queries
               ? filterObjectToQueries(rootQueries || queries || {})
               : '';

         return axios
            .post(
               config.api +
                  router +
                  `/${formatResource(resource)}${searchQueries}`,
               data,
               {
                  ...options,
                  headers: {
                     Authorization: auth ? `Bearer ${auth}` : undefined,
                     ...options?.headers,
                  },
               },
            )
            .then((r) => r.data)
            .then((res) => {
               setLoading(false);
               if (res.success === true) {
                  if (rootActions && rootActions.success)
                     rootActions.success(res.payload ? res.payload : res);
                  if (actions && actions.success)
                     actions.success(res.payload ? res.payload : res);
               } else if (res.success === false) {
                  if (rootActions && rootActions.fail)
                     rootActions.fail(
                        res.message ?? 'Something went wrong',
                        res.payload ? res.payload : {},
                     );
                  if (actions && actions.fail)
                     actions.fail(
                        res.message ?? 'Something went wrong',
                        res.payload ? res.payload : res,
                     );

                  if (options && options.throw) {
                     throw new Error(res.message ?? 'Something went wrong');
                  }
               } else {
                  if (actions && actions.success) actions.success(res);
                  if (rootActions && rootActions.success)
                     rootActions.success(res);
               }
               return res;
            })
            .catch((err) => {
               setLoading(false);
               const errData: APIResponseError = err.response
                  ? err.response.data
                  : {};
               let message =
                  errData.message ??
                  errData.detail ??
                  err.message ??
                  'Something went wrong';

               if (message == '[object Object]') {
                  message = 'Pydantic error';
               }

               setError(message);

               if (rootActions && rootActions.error) rootActions.error(message);
               if (actions && actions.error) actions.error(message);

               if (options && options.throw) {
                  throw new Error(message);
               }
               return {
                  success: false,
                  message,
               };
            });
      },
      [rootActions, router, resource, rootQueries],
   );

   return [post, loading, error] as [typeof post, typeof loading, typeof error];
}
