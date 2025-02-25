'use client';

import { State } from '@hookstate/core';
import { WarningCircle } from 'iconoir-react';
import { FC } from 'react';

import CourseAdded from './CourseAdded';
import { BundleCreationCoursesData } from './Creation';
import SelectCourse from './SelectCourse';

import { TAdminTableCourseData } from '@/lib/types';

interface BundleEditorProps {
   bundleCourses: State<BundleCreationCoursesData[], {}>;
   bundleName: State<string, {}>;
   allowCash: State<boolean, {}>;
   bundlePrice: State<number, {}>;
   allowWaitlist: State<boolean, {}>;
   coursesError: State<false | { courses: TAdminTableCourseData[] }, {}>;
}

// TODO: componetize number input
const BundleEditor: FC<BundleEditorProps> = ({
   bundleCourses,
   bundleName,
   allowCash,
   bundlePrice,
   allowWaitlist,
   coursesError,
}) => {
   return (
      <>
         <div className="flex items-center w-full">
            <label
               htmlFor="bundleName"
               className="w-36 text-black font-medium tracking-tight"
            >
               Bundle name
            </label>
            <input
               id="bundleName"
               name="bundleName"
               type="text"
               onInput={(e: any) => bundleName.set(e.target.value)}
               value={bundleName.value}
               className="flex-1 w-full font-medium hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300 py-3.5 text-zinc-700 placeholder:text-xs placeholder:sm:text-sm text-sm sm:text-base placeholder:font-normal placeholder:text-zinc-400 outline-none transition duration-200 ease-linear px-4 border shadow-sm rounded-xl"
            />
         </div>
         <div className="mt-10">
            <SelectCourse
               bundleCourses={bundleCourses}
               coursesError={coursesError}
            />
         </div>
         <div className="mt-8">
            {!bundleCourses.length ? (
               <div className="w-full text-zinc-400 tracking-tight text-sm font-medium p-5 border border-zinc-200 rounded-2xl bg-white">
                  No courses added.
               </div>
            ) : (
               <div className="flex items-center justify-between">
                  <p className="tracking-tight font-medium">
                     Courses list{' '}
                     <span className="ml-2.5 text-blue-500 font-medium">
                        {bundleCourses.length}
                     </span>
                  </p>
                  {!!coursesError.value && (
                     <div className="text-sm text-red-500 inline-flex items-center font-medium tracking-tight">
                        <WarningCircle
                           className="h-5 w-5 mr-2.5"
                           strokeWidth={2}
                        />
                        Course schedules are overlapping
                     </div>
                  )}
               </div>
            )}
            <div className="flex flex-col gap-2.5 mt-6">
               {bundleCourses.map((bundleCourse, courseKey) => (
                  <CourseAdded
                     key={courseKey}
                     bundleCourse={bundleCourse}
                     bundleCourses={bundleCourses}
                     coursesError={coursesError}
                  />
               ))}
            </div>
         </div>
         {!!bundleCourses.length && (
            <div className="mt-14 flex justify-end items-start w-full">
               <div>
                  <label
                     htmlFor="bundlePrice"
                     className="mr-10 text-black font-medium tracking-tight"
                  >
                     Bundle price
                  </label>
                  <div className="mt-2.5 relative">
                     <input
                        type="number"
                        id="bundlePrice"
                        name="bundlePrice"
                        step="any"
                        min="0"
                        max="99999999999"
                        className="w-44 font-medium tracking-wide hover:border-zinc-400 focus:border-blue-500 focus:ring-[1px] focus:ring-blue-500 border-zinc-300 py-3.5 text-zinc-700 placeholder:text-xs placeholder:sm:text-sm text-sm sm:text-base placeholder:font-normal placeholder:text-zinc-400 outline-none transition duration-200 ease-linear pl-10 pr-4 border shadow-sm rounded-xl"
                        value={bundlePrice.value}
                        onInput={(e: any) => bundlePrice.set(e.target.value)}
                     />
                     <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                        <p className="text-lg font-medium text-zinc-400">$</p>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

export default BundleEditor;
