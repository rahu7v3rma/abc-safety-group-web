'use client';

import { FC } from 'react';
import CourseInformation from './Tab/Information';
import CourseContents from './Tab/Contents';
import CourseManage from './Tab/Manage/Manage';

import {
   TAdminCourseDetailsManageStudent,
   TAdminTableClassScheduleData,
   TCourseContentData,
   TCourseDetailsData,
   TInstructorTableScheduleData,
   TStudentTableScheduleData,
   TWithPagination,
} from '@/lib/types';

const tabs = [CourseInformation, CourseContents, CourseManage];

interface CourseDetailsTabsRenderProps {
   tab: number;
   course: TCourseDetailsData;
   schedule: Array<
      | TAdminTableClassScheduleData
      | TStudentTableScheduleData
      | TInstructorTableScheduleData
   >;
   contents?: TCourseContentData[];
   students?: TWithPagination<{ students: TAdminCourseDetailsManageStudent[] }>;
   modify?: boolean;
   enrolled?: boolean;
   registration?: boolean;
   page: number;
}

const CourseDetailsTabsRender: FC<CourseDetailsTabsRenderProps> = ({
   tab,
   course,
   schedule,
   contents,
   students,
   modify,
   enrolled,
   registration,
   page,
}) => {
   if (tab > tabs.length - 1) return null;

   const CurrentTab = tabs[tab];

   return (
      <CurrentTab
         course={course}
         schedule={schedule}
         contents={contents}
         students={students}
         modify={modify}
         enrolled={enrolled}
         registration={registration}
         page={page}
      />
   );
};

export default CourseDetailsTabsRender;
