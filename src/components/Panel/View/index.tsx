'use client';

import { FC, PropsWithChildren } from 'react';

import History from './History';
import Header from './Header';
import Time from './Time';

import { TPanels } from '@/lib/types';

interface PanelViewProps {
   panel: TPanels;
   panelName: string;
   search?: boolean;
}

const PanelView: FC<PropsWithChildren<PanelViewProps>> = ({
   panel,
   panelName,
   children,
   search = true,
}) => {
   return (
      <div className="flex-1 flex flex-col max-h-full overflow-auto max-w-full">
         <div className="w-full flex items-center justify-between py-5 px-5 lg:px-10 border-b border-zinc-200 bg-white">
            <Header panelName={panelName} />
            <div className="flex flex-col items-end">
               <Time />
               <History />
            </div>
         </div>
         <div className="lg:p-5 flex-1 flex flex-col max-h-full overflow-auto max-w-full">
            <div className="flex-1 flex flex-col whitespace-pre-line break-words p-5 lg:p-10 lg:rounded-3xl lg:border border-zinc-200 bg-white">
               <div className="flex flex-col flex-1">{children}</div>
            </div>
         </div>
      </div>
   );
};

export default PanelView;
