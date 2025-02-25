'use client';

import {
   TInstructorStudentsData,
   TScheduleDetailsData,
   TWithPagination,
} from '@/lib/types';
import { LiveClassroomManagementTabsComponents } from '../Schema';

interface TabsRenderProps {
   tab: number;
   schedule: TScheduleDetailsData;
   students?: TWithPagination<{ students: TInstructorStudentsData[] }>;
}

const TabsRender = ({ tab, schedule, students }: TabsRenderProps) => {
   if (tab > LiveClassroomManagementTabsComponents.length - 1) return null;

   const CurrentTab = LiveClassroomManagementTabsComponents[tab];

   return <CurrentTab schedule={schedule} students={students} />;
};

export default TabsRender;
