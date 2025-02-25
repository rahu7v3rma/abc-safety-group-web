'use client';

import VisualizationTableButtonUpdate from '@/components/ui/VisualizationTable/Buttons/Update';
import {
   TAdminCourseDetailsManageStudent,
   TAdminTableClassScheduleData,
   TCourseContentData,
   TCourseDetailsData,
   TInstructorTableScheduleData,
   TStudentTableScheduleData,
   TWithPagination,
} from '@/lib/types';
import { Page } from 'iconoir-react';
import { FC, useEffect, useState } from 'react';
import CompleteCourseButton from './Buttons/CompleteCourse';
import DeleteCourseButton from './Buttons/DeleteCourse';
import PublishUnpublishCourseButton from './Buttons/PublishUnpublishCourse';
import { CoursesCourseDetailsTabs } from './Schema';
import CourseDetailsTabsRender from './Tabs/Render';
import CourseDetailsTabs from './Tabs/Tabs';

interface CourseDetailsProps {
   tab: string;
   course: TCourseDetailsData;
   schedule: Array<
      | TAdminTableClassScheduleData
      | TStudentTableScheduleData
      | TInstructorTableScheduleData
   >;
   contents?: TCourseContentData[];
   students?: TWithPagination<{ students: TAdminCourseDetailsManageStudent[] }>;
   enrolled?: boolean;
   update?: boolean;
   modify?: boolean;
   deleteButton?: boolean;
   registration?: boolean;
   complete?: boolean;
   publishUnpublish?: boolean;
   page: number;
}

const CourseDetails: FC<CourseDetailsProps> = ({
   tab: currentTab,
   course,
   schedule,
   contents,
   students,
   enrolled,
   update,
   modify,
   deleteButton,
   registration,
   complete,
   publishUnpublish,
   page,
}) => {
   const [tab, setTab] = useState<number>(
      CoursesCourseDetailsTabs.indexOf(currentTab)
   );

   useEffect(() => {
      setTab(CoursesCourseDetailsTabs.indexOf(currentTab));
   }, [currentTab]);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <Page className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Course details
            </div>
            <div className="flex gap-2">
               {publishUnpublish && (
                  <PublishUnpublishCourseButton course={course} />
               )}
               {!course.complete && complete && <CompleteCourseButton />}
               {update && <VisualizationTableButtonUpdate />}
               {deleteButton && <DeleteCourseButton />}
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-y-14">
               <CourseDetailsTabs
                  tab={tab}
                  setTab={setTab}
                  enrolled={enrolled}
                  modify={modify}
               />
               <CourseDetailsTabsRender
                  tab={tab}
                  course={course}
                  schedule={schedule}
                  contents={contents}
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

export default CourseDetails;
