import { APIResponse } from '@/lib/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import { cookies } from 'next/dist/client/components/headers';

export default async function postData<D, P, PA>(
   route: string,
   data?: D
): Promise<APIResponse<P, PA>> {
   let cookie;

   try {
      const cookieStore = cookies();
      cookie = cookieStore.get(
         process.env.NEXT_PUBLIC_COOKIE_NAME as string
      )?.value;
   } catch (err) {
      cookie = Cookies.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
   }

   return axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}${route}`, data, {
         headers: {
            Authorization: `Bearer ${cookie}`,
         },
      })
      .then((r) => r.data);
}
