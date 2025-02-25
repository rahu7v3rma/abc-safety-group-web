import { APIResponse } from '@/lib/types';
import Cookies from 'js-cookie';
import { cookies } from 'next/dist/client/components/headers';

export default async function fetchData<P, PA>(
   route: string,
   headers?: any,
   raw: boolean = false,
   ott?: string,
): Promise<APIResponse<P, PA>> {
   let cookie = ott;

   if (!ott) {
      try {
         const cookieStore = cookies();
         cookie = cookieStore.get(
            process.env.NEXT_PUBLIC_COOKIE_NAME as string,
         )?.value;
      } catch (err) {
         cookie = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
      }
   }

   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
      cache: 'no-cache',
      headers: {
         Authorization: cookie ? `Bearer ${cookie}` : '',
         ...headers,
      },
   });

   if (raw) return res as any;

   if (!res.ok) {
      const { message, detail } = await res.json();

      return {
         success: false,
         message: detail ?? message ?? 'Something went wrong',
      };
   }

   const { payload } = await res.json();

   return {
      success: true,
      payload,
   };
}
