'use client';

import { TableRows } from 'iconoir-react';
import { FC } from 'react';

interface VisualizationTableErrorProps {
   title?: string;
   message?: string;
}

const VisualizationTableError: FC<VisualizationTableErrorProps> = ({
   title,
   message,
}) => {
   return (
      <div className="flex-grow bg-zinc-50 flex flex-col justify-center items-center">
         <TableRows className="h-12 w-12 text-red-300" strokeWidth={2} />
         <p className="mt-6 font-semibold text-lg text-zinc-600">
            {typeof title === 'string' && title.trim().length
               ? title
               : 'Table error'}
         </p>
         <p className="mt-2 text-sm text-zinc-500 tracking-tight">
            {typeof message === 'string' && message.trim().length
               ? message
               : 'Failed getting data, retry or contact an administrator.'}
         </p>
      </div>
   );
};

export default VisualizationTableError;
