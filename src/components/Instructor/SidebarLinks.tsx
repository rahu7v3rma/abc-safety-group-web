'use client';

import { BookmarkBook, HomeAltSlimHoriz, User, UserPlus } from 'iconoir-react';
import { type FC } from 'react';

import { type TPanels } from '@/lib/types';
import SidebarLink from '../Panel/Sidebar/Link';

interface InstructorSidebarLinksProps {
   panel: TPanels;
}

const InstructorSidebarLinks: FC<InstructorSidebarLinksProps> = ({ panel }) => {
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
            href="/my-courses"
            Icon={BookmarkBook}
            tooltipContent="My Courses"
         >
            My Courses
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/students"
            Icon={User}
            tooltipContent="Students"
         >
            Students
         </SidebarLink>
         <SidebarLink
            panel={panel}
            href="/expedited-register"
            Icon={UserPlus}
            tooltipContent="Expedited Register"
         >
            Expedited Register
         </SidebarLink>
      </>
   );
};

export default InstructorSidebarLinks;
