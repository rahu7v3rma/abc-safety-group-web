'use client';

import LoadingSuspense from '@/components/ui/Suspense';
import { useSearchParams } from 'next/navigation';

const Loading = () => {
   const searchParams = useSearchParams();

   const table = searchParams ? searchParams.get('table') : false;

   function getName() {
      if (table) {
         if (table.toLowerCase() === 'bundles') {
            return 'Bundles';
         }
      }
      return 'Courses';
   }

   return <LoadingSuspense name={getName()} />;
};

export default Loading;
