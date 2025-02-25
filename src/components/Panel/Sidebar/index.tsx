'use client';

import { ProfileCircle, SidebarCollapse, SidebarExpand } from 'iconoir-react';

import Tooltip from '@/components/ui/Tooltip';
import config from '@/config';
import { TPanels } from '@/lib/types';
import clsx from 'clsx';
import Image from 'next/image';
import {
   FC,
   PropsWithChildren,
   createContext,
   useCallback,
   useState,
} from 'react';
import SidebarLink from './Link';
import Profile from './Profile';

interface PanelSidebarProps {
   panel: TPanels;
}

export const PanelSidebarContext = createContext({ collapsed: false });

const PanelSidebar: FC<PropsWithChildren<PanelSidebarProps>> = ({
   panel,
   children,
}) => {
   const [collapsed, setCollapse] = useState(false);

   const [collapseIconTooltipOpen, setCollapseIconTooltipOpen] =
      useState(false);
   const collapseIconSizePx = 22;
   const CollapseIcon = useCallback(
      () => (
         <Tooltip
            content={collapsed ? 'Uncollapse' : 'Collapse'}
            open={collapseIconTooltipOpen}
         >
            <div
               className={clsx(
                  'hidden lg:block cursor-pointer absolute bg-zinc-200 p-1.5 transition duration-200 ease-linear hover:text-black text-zinc-600 rounded-lg top-8',
                  collapsed ? '-right-4' : 'right-5'
               )}
               onClick={() => {
                  setCollapse(!collapsed);
                  setCollapseIconTooltipOpen(false);
               }}
               onMouseEnter={() => setCollapseIconTooltipOpen(true)}
               onMouseLeave={() => setCollapseIconTooltipOpen(false)}
            >
               {collapsed ? (
                  <SidebarExpand
                     className={`h-[${collapseIconSizePx}px] w-[${collapseIconSizePx}px]`}
                     strokeWidth={2}
                  />
               ) : (
                  <SidebarCollapse
                     className={`h-[${collapseIconSizePx}px] w-[${collapseIconSizePx}px]`}
                     strokeWidth={2}
                  />
               )}
            </div>
         </Tooltip>
      ),
      [collapsed, collapseIconTooltipOpen, collapseIconSizePx]
   );

   return (
      <PanelSidebarContext.Provider value={{ collapsed }}>
         <div
            className={clsx(
               'max-w-[7rem] border-r flex-1 flex flex-col max-h-full border-zinc-200 bg-white w-full pt-5 pb-10 relative',
               !collapsed && 'lg:max-w-[20rem]'
            )}
         >
            <CollapseIcon />
            <h1
               className={clsx(
                  'px-5 text-xl tracking-tight flex flex-col font-semibold text-yellow-600',
                  collapsed
                     ? 'items-center'
                     : 'lg:px-10 items-center lg:items-start'
               )}
            >
               <Image
                  src={config.logo}
                  alt="logo"
                  width={300}
                  height={300}
                  className="w-16 animate-fadeIn"
               />
               <p className={`mt-6 hidden ${!collapsed && 'lg:inline-block'}`}>
                  {config.name}
               </p>
            </h1>
            <div
               className={clsx(
                  'mt-[3rem] px-5 flex flex-col gap-1',
                  !collapsed && 'lg:mt-8'
               )}
            >
               <SidebarLink
                  panel={panel}
                  href="/profile"
                  Icon={ProfileCircle}
                  tooltipContent="My Profile"
               >
                  My Profile
               </SidebarLink>
            </div>
            <hr className="border-t border-zinc-100 my-4" />
            <div className="px-5 flex flex-col gap-1 h-[1px] overflow-auto flex-grow">
               {children}
            </div>
            <div className="pt-10 flex flex-col">
               <Profile />
            </div>
         </div>
      </PanelSidebarContext.Provider>
   );
};

export default PanelSidebar;
