'use client';

import { FC, useMemo } from 'react';

import Dropdown from '@/components/ui/Dropdown';
import { usePanels } from '@/contexts/panels';
import { useRoles } from '@/contexts/roles';
import { roleToPanel, roleWeightage } from '@/lib/constants';
import { uppercaseFirstLetter } from '@/lib/helpers';
import { Panel } from '@/lib/types';
import { Item } from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { ArrowSeparateVertical } from 'iconoir-react';
import Link from 'next/link';

interface ViewHeaderProps {
   panelName: string;
}

const ViewHeader: FC<ViewHeaderProps> = ({ panelName }) => {
   const { roles } = useRoles();
   const { panels } = usePanels();

   const displayPanels = useMemo(() => {
      if (roles) {
         // assign weightage to roles
         let rolesCalculated = structuredClone(roles).sort(
            (a, b) => roleWeightage[b.roleName] - roleWeightage[a.roleName]
         );

         // convert roles to panels
         let allPanels = rolesCalculated.map(
            (role) => roleToPanel[role.roleName]
         );

         // remove duplicate panels
         allPanels = [...new Set(allPanels)];

         // filter panels by availability
         allPanels = allPanels.filter((panel) =>
            panels.includes(panel as Panel)
         );

         return allPanels.map((role) => ({
            name: `${uppercaseFirstLetter(role)} Panel`,
            path: `/${role}`,
         }));
      }
      return [];
   }, [roles, panels]);

   return (
      <div>
         {displayPanels.length > 1 ? (
            <Dropdown
               align="start"
               trigger={
                  <button className="group flex items-center gap-2.5 rounded-xl border border-zinc-200/50 bg-zinc-50 px-3 py-2 text-xl font-semibold tracking-tight transition duration-200 ease-linear hover:bg-zinc-100 focus:outline-none data-[state=open]:bg-zinc-100">
                     {panelName}
                     <ArrowSeparateVertical
                        className="h-5 w-5"
                        strokeWidth={2}
                     />
                  </button>
               }
            >
               {displayPanels.map((panel, index) => (
                  <Link href={panel.path} key={index}>
                     <Item
                        className={clsx(
                           'relative flex cursor-pointer select-none items-center rounded-xl px-4 py-2.5 font-medium tracking-tight outline-none transition duration-200 ease-linear',
                           panelName === panel.name
                              ? 'bg-zinc-200/75 text-black'
                              : 'text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
                        )}
                     >
                        {panel.name}
                     </Item>
                  </Link>
               ))}
            </Dropdown>
         ) : (
            <span className="rounded-xl border border-zinc-200/50 bg-zinc-50 px-3 py-2 text-center text-xl font-semibold">
               {panelName}
            </span>
         )}
      </div>
   );
};

export default ViewHeader;
