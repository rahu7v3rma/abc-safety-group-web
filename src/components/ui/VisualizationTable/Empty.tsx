'use client';

import { TableRows } from 'iconoir-react';
import { FC, ReactNode } from 'react';

interface VisualizationTableEmptyProps {
   empty?: false | string;
}

const VisualizationTableEmpty: FC<VisualizationTableEmptyProps> = ({
   empty,
}) => {
   return (
      <div className="flex-grow bg-zinc-50 flex flex-col items-center justify-center">
         <TableRows className="h-12 w-12 text-blue-300" strokeWidth={2} />
         <p className="mt-6 font-semibold text-lg text-zinc-600">
            Table is empty
         </p>
         <p className="mt-2 text-sm text-zinc-500 tracking-tight">
            {empty ? empty : `Looks like there's no data to show.`}
         </p>
      </div>
   );
};

export default VisualizationTableEmpty;
