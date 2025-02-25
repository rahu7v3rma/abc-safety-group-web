'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useMemo } from 'react';

import {
   CoursesCourseDetailsModifyTabs,
   CoursesCourseDetailsTabs,
} from '../Schema';

interface CourseDetailsTabsProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
   enrolled?: boolean;
   modify?: boolean;
}

const CourseDetailsTabs: FC<CourseDetailsTabsProps> = ({
   tab: currentTab,
   setTab,
   enrolled,
   modify,
}) => {
   const pathname = usePathname();
   const router = useRouter();

   const filteredTabs = useMemo(() => {
      let filtered = CoursesCourseDetailsTabs;
      if (!enrolled) {
         filtered = filtered.filter((t) => t !== 'Content');
      }
      if (!modify) {
         filtered = filtered.filter(
            (t) => !CoursesCourseDetailsModifyTabs.includes(t)
         );
      }

      return filtered;
   }, [enrolled, modify]);

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
                  'rounded-2xl py-4 font-medium transition duration-200 ease-linear',
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

export default CourseDetailsTabs;
