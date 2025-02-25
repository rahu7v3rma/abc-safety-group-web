'use client';

import { FC } from 'react';
import BundleInformation from './Tab/Information';
import BundleManage from './Tab/Manage/Manage';

import {
   TAdminBundleDetailsManageStudent,
   TAdminCourseDetailsManageStudent,
   TAdminTableClassScheduleData,
   TBundleDetailsData,
   TStudentTableScheduleData,
   TWithPagination,
} from '@/lib/types';

const tabs = [BundleInformation, BundleManage];

interface BundleDetailsTabsRenderProps {
   tab: number;
   bundle: TBundleDetailsData;
   schedule: Array<TAdminTableClassScheduleData | TStudentTableScheduleData>;
   students:
      | TWithPagination<{ students: TAdminBundleDetailsManageStudent[] }>
      | false;
   update?: boolean;
   modify?: boolean;
   deleteButton?: boolean;
   publishUnpublish?: boolean;
   enrolled: boolean;
   registration?: boolean;
   complete?: boolean;
   page: number;
}

const BundleDetailsTabsRender: FC<BundleDetailsTabsRenderProps> = ({
   tab,
   bundle,
   schedule,
   students,
   update,
   deleteButton,
   publishUnpublish,
   enrolled,
   registration,
   complete,
   page,
}) => {
   if (tab > tabs.length - 1) return null;

   const CurrentTab = tabs[tab];

   return (
      <CurrentTab
         bundle={bundle}
         schedule={schedule}
         students={students}
         enrolled={enrolled}
         registration={registration}
         complete={complete}
         page={page}
      />
   );
};

export default BundleDetailsTabsRender;
