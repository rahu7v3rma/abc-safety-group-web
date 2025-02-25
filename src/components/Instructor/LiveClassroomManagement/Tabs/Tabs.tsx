'use client';

import { LiveClassroomManagementTabs } from '../Schema';
import { usePathname, useRouter } from 'next/navigation';

interface TabsProps {
   tab: number;
}

const Tabs = ({ tab: currentTab }: TabsProps) => {
   const router = useRouter();
   const pathname = usePathname();

   return (
      <div className="flex w-56 flex-col gap-2.5">
         {LiveClassroomManagementTabs.map((tab, tabIndex) => (
            <button
               key={tabIndex}
               onClick={() => {
                  router.push(`${pathname}?tab=${tab}`);
               }}
               className={
                  tabIndex === currentTab
                     ? 'tab-button-active'
                     : 'tab-button-inactive'
               }
            >
               {tab}
            </button>
         ))}
      </div>
   );
};

export default Tabs;
