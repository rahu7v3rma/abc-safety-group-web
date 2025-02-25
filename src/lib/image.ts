'use client';

import config from '@/config';
import { contextState } from '@/lib/state';
import { TAPIRouters, TImageSizes } from './types';

export const validFileNameRegex = /^[a-z0-9_-]+\.[a-z0-9]+$/gi;

function getImageURL(
   router: TAPIRouters,
   id?: string,
   size?: TImageSizes
): string {
   const user = contextState.getState().user;
   if (id && id.match(validFileNameRegex) && user) {
      return (
         config.api +
         router +
         `/content/load/${id}` +
         `?uid=${user.userId}` +
         (size ? `&size=${size}` : '')
      );
   }

   return '/noimage.png';
}

export { getImageURL };
