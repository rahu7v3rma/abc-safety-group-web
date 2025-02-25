'use client';

import { FC } from 'react';
import {
   BookStack,
   BookmarkBook,
   HomeAltSlimHoriz,
   PageStar,
} from 'iconoir-react';

import SidebarLink from '../Panel/Sidebar/Link';
import { TPanels } from '@/lib/types';

interface StudentSidebarLinksProps {
   panel: TPanels;
}

const StudentSidebarLinks: FC<StudentSidebarLinksProps> = ({ panel }) => {
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
            href="/certificates"
            Icon={PageStar}
            tooltipContent="My Certificates"
         >
            My Certificates
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/my-courses"
            Icon={BookmarkBook}
            tooltipContent="My Courses"
         >
            My Courses
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/catalog"
            Icon={BookStack}
            tooltipContent="Catalog"
         >
            Catalog
         </SidebarLink>
      </>
   );
};

export default StudentSidebarLinks;
