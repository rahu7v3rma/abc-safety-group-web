'use client';

import * as iconoirIcons from 'iconoir-react';
import { FC } from 'react';

import { TIcons } from '@/lib/types';

interface NotFoundPageProps {
   icon: TIcons;
   title: string;
}

const NotFoundPage: FC<NotFoundPageProps> = ({ icon, title }) => {
   const Icon = iconoirIcons[icon] as any;

   return (
      <div className="flex-grow bg-zinc-50 flex flex-col items-center justify-center border border-zinc-300 rounded-2xl">
         <Icon className="h-16 w-16 text-zinc-300" strokeWidth={2} />
         <p className="mt-4 font-semibold text-lg text-zinc-600">
            {title} not found
         </p>
      </div>
   );
};

export default NotFoundPage;
