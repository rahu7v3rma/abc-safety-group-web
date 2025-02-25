'use client';

import {
   ChatBubbleQuestion,
   Folder,
   HomeAltSlimHoriz,
   Import,
   PageStar,
   User,
} from 'iconoir-react';
import { FC } from 'react';

import { TPanels } from '@/lib/types';
import SidebarLink from '../Panel/Sidebar/Link';

interface AdminSidebarLinksProps {
   panel: TPanels;
}

const AdminSidebarLinks: FC<AdminSidebarLinksProps> = ({ panel }) => {
   return (
      <>
         <SidebarLink
            panel={panel}
            href="/"
            Icon={HomeAltSlimHoriz}
            tooltipContent="Class Schedule"
         >
            Class Schedule
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/users"
            Icon={User}
            tooltipContent="User Management"
         >
            User Management
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/courses"
            Icon={Folder}
            tooltipContent="Course Management"
         >
            Course Management
         </SidebarLink>
         {/* <SidebarLink
            panel={panel}
            href="/forms"
            Icon={PasteClipboard}
            tooltipContent="Form Management"
         >
            Form Management
         </SidebarLink> */}
         <SidebarLink
            panel={panel}
            href="/certificates"
            Icon={PageStar}
            tooltipContent="Certificates"
         >
            Certificates
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/imports"
            Icon={Import}
            tooltipContent="Bulk Imports"
         >
            Bulk Imports
         </SidebarLink>
         {/* <SidebarLink
            panel={panel}
            href="/transactions"
            Icon={CardWallet}
            tooltipContent="Transactions"
         >
            Transactions
         </SidebarLink> */}
         {/* <SidebarLink
            panel={panel}
            href="/expedited-register"
            Icon={UserPlus}
            tooltipContent="Expedited Register"
         >
            Expedited Register
         </SidebarLink> */}
         <SidebarLink
            panel={panel}
            href="/report-bug"
            Icon={ChatBubbleQuestion}
            tooltipContent="Report a bug"
         >
            Report a bug
         </SidebarLink>
         {/* <SidebarLink
            panel={panel}
            href="https://www.doitsolutions.io/"
            Icon={Reports}
            tooltipContent="Reports"
            target="_blank"
            hrefAbsolute
         >
            Reports
         </SidebarLink> */}
      </>
   );
};

export default AdminSidebarLinks;
