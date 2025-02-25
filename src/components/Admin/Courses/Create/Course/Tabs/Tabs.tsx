'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import clsx from 'clsx';

export const tabs = [
   'General Information',
   'Series Settings',
   'Certification',
   'Content',
   'Quiz/Surveys',
   'Preview Certificate',
];

export const requiredTabs = [0, 1, 2];

interface CourseTabsProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CourseTabs: FC<CourseTabsProps> = ({ tab: currentTab, setTab }) => {
   return (
      <div className="w-56 flex flex-col gap-2.5">
         {tabs.map((tab, tabIndex) => (
            <button
               key={tabIndex}
               onClick={() => setTab(tabIndex)}
               className={clsx(
                  'w-full relative rounded-2xl text-base transition duration-200 ease-linear text-left disabled:cursor-not-allowed py-4 tracking-tight px-5',
                  {
                     'bg-blue-500 font-semibold text-white':
                        tabIndex === currentTab,
                     'bg-zinc-100 font-medium hover:bg-zinc-200 text-zinc-500 ':
                        tabIndex !== currentTab,
                  }
               )}
            >
               {tab}
               {requiredTabs.includes(tabIndex) && (
                  <div className="pointer-events-none select-none absolute right-5 inset-y-0 flex items-center">
                     <p className="text-xl -mb-1.5 font-semibold text-red-500">
                        *
                     </p>
                  </div>
               )}
            </button>
         ))}
      </div>
   );
};

export default CourseTabs;
