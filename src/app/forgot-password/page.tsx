'use client';

import ForgotPassword from '@/components/ForgotPassword/Email';
import ResetPassword from '@/components/ForgotPassword/Reset';
import { useSearchParams } from 'next/navigation';

const ForgotPasswordPage = () => {
   const params: any = useSearchParams();
   return (
      <main className="my-auto w-full pt-8 pb-0 px-0 sm:p-8">
         {params.get('code') ? (
            <ResetPassword code={params.get('code')} />
         ) : (
            <ForgotPassword />
         )}
      </main>
   );
};

export default ForgotPasswordPage;
