'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import {
   CoursesBundleDetailsModifyTabs,
   CoursesBundleDetailsTabs,
} from '../Schema';

interface BundleDetailsTabsProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
   modify: boolean;
}

const BundleDetailsTabs: FC<BundleDetailsTabsProps> = ({
   tab: currentTab,
   modify,
}) => {
   const pathname = usePathname();
   const router = useRouter();

   const filteredTabs = useMemo(() => {
      let filtered = CoursesBundleDetailsTabs;
      if (!modify) {
         filtered = filtered.filter(
            (t) => !CoursesBundleDetailsModifyTabs.includes(t)
         );
      }
      return filtered;
   }, [modify]);

   return (
      <div
         className="grid gap-2.5"
         style={{
            gridTemplateColumns: `repeat(${filteredTabs.length}, minmax(0, 1fr))`,
         }}
      >
         {filteredTabs.map((tab, tabIndex) => (
            <button
               key={tabIndex}
               onClick={() => {
                  router.push(`${pathname}?tab=${tab}`);
               }}
               className={clsx(
                  'py-4 font-medium rounded-2xl transition duration-200 ease-linear',
                  currentTab === tabIndex
                     ? 'bg-blue-500 text-white'
                     : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
               )}
            >
               {tab}
            </button>
         ))}
      </div>
   );
};

export default BundleDetailsTabs;
