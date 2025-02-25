'use client';

import * as iconoirIcons from 'iconoir-react';
import { FC } from 'react';

import { TIcons } from '@/lib/types';

interface ErrorPageProps {
   icon: TIcons;
   title: string;
   message: string;
}

const ErrorPage: FC<ErrorPageProps> = ({ icon, title, message }) => {
   const Icon = iconoirIcons[icon] as any;

   return (
      <div className="flex-grow bg-zinc-50 flex flex-col items-center justify-center border border-zinc-300 rounded-2xl">
         <Icon className="h-16 w-16 text-red-300" strokeWidth={2} />
         <p className="mt-4 font-semibold text-lg text-zinc-600">
            Failed loading {title.toLowerCase()}
         </p>
         <p className="mt-2 text-sm text-zinc-500 tracking-tight">{message}</p>
      </div>
   );
};

export default ErrorPage;
