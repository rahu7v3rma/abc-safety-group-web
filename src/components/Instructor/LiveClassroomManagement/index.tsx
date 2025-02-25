'use client';

import {
   TInstructorStudentsData,
   TScheduleDetailsData,
   TWithPagination,
} from '@/lib/types';
import { Community } from 'iconoir-react';
import { useEffect, useState } from 'react';
import CompleteCourseButton from './Buttons/Complete';
import TabsRender from './Tabs/Render';
import Tabs from './Tabs/Tabs';
import {
   LiveClassroomManagementTab,
   LiveClassroomManagementTabs,
} from './Schema';

type LiveClassroomCourseScheduleManagementProps = {
   tab: LiveClassroomManagementTab;
   schedule: TScheduleDetailsData;
   students?: TWithPagination<{ students: TInstructorStudentsData[] }>;
};

const LiveClassroomCourseScheduleManagement = ({
   tab: currentTab,
   schedule,
   students,
}: LiveClassroomCourseScheduleManagementProps) => {
   const [tab, setTab] = useState<number>(
      currentTab ? LiveClassroomManagementTabs.indexOf(currentTab) : 0,
   );

   useEffect(() => {
      setTab(currentTab ? LiveClassroomManagementTabs.indexOf(currentTab) : 0);
   }, [currentTab]);

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <Community
                  className="mr-4 h-8 w-8 text-blue-500"
                  strokeWidth={2}
               />
               Live Classroom Management
            </div>
            <div className="flex items-center gap-2.5">
               {!schedule.complete && <CompleteCourseButton />}
            </div>
         </div>
         <div className="mt-5 flex h-[1px] flex-grow gap-5">
            <Tabs tab={tab} />
            <div className="relative flex flex-1 flex-col overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
               <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
                  <TabsRender
                     tab={tab}
                     schedule={schedule}
                     students={students}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default LiveClassroomCourseScheduleManagement;
