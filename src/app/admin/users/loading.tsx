'use client';

import LoadingSuspense from '@/components/ui/Suspense';
import { useSearchParams } from 'next/navigation';

const Loading = () => {
   const searchParams = useSearchParams();

   const table = searchParams ? searchParams.get('table') : false;

   function getName() {
      if (table) {
         if (table.toLowerCase() === 'instructors') {
            return 'Instructors';
         } else if (table.toLowerCase() === 'admins') {
            return 'Admins';
         }
      }
      return 'Students';
   }

   return <LoadingSuspense name={getName()} />;
};

export default Loading;
