'use client';

import { Folder } from 'iconoir-react';
import { FC, useEffect, useState } from 'react';
import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import DeleteBundleButton from './Buttons/DeleteBundle';
import PublishUnpublishBundleButton from './Buttons/PublishUnpublishBundle';
import CompleteBundleButton from './Buttons/CompleteBundle';

import {
   APIResponse,
   TAdminBundleDetailsManageStudent,
   TAdminTableClassScheduleData,
   TBundleDetailsData,
   TStudentTableScheduleData,
   TWithPagination,
} from '@/lib/types';
import BundleDetailsTabs from './Tabs/Tabs';
import BundleDetailsTabsRender from './Tabs/Render';
import { CoursesBundleDetailsTabs } from './Schema';

interface BundleDetailsProps {
   tab: string;
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

const BundleDetails: FC<BundleDetailsProps> = ({
   tab: currentTab,
   bundle,
   students,
   schedule,
   update = true,
   modify = true,
   deleteButton,
   publishUnpublish,
   enrolled,
   registration = true,
   complete,
   page,
}) => {
   const [tab, setTab] = useState<number>(
      CoursesBundleDetailsTabs.indexOf(currentTab)
   );

   useEffect(() => {
      setTab(CoursesBundleDetailsTabs.indexOf(currentTab));
   }, [currentTab]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <Folder className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Bundle details
            </div>
            <div className="flex gap-2">
               {publishUnpublish && (
                  <PublishUnpublishBundleButton bundle={bundle} />
               )}
               {!bundle.complete && complete && <CompleteBundleButton />}
               {update && <VisualizationTableButtonUpdate />}
               {deleteButton && <DeleteBundleButton />}
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-y-14">
               <BundleDetailsTabs tab={tab} setTab={setTab} modify={modify} />
               <BundleDetailsTabsRender
                  tab={tab}
                  bundle={bundle}
                  schedule={schedule}
                  students={students}
                  modify={modify}
                  enrolled={enrolled}
                  registration={registration}
                  page={page}
               />
            </div>
         </div>
      </div>
   );
};

export default BundleDetails;
