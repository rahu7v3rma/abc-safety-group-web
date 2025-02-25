'use client';

import { TScheduleDetailsData } from '@/lib/types';
import { Calendar, Group, Internet, Page, Pin } from 'iconoir-react';
import CopyButton from '../../Buttons/Copy';

type CourseDetailsProps = {
   schedule: TScheduleDetailsData;
};

const CourseDetails = ({ schedule }: CourseDetailsProps) => {
   return (
      <>
         <div className="flex w-full justify-between">
            <p className="text-2xl font-semibold tracking-tight">
               {schedule.courseName}
            </p>
            <p className="inline-flex items-center gap-2.5 font-medium text-zinc-500">
               <Calendar className="h-5 w-5" strokeWidth={2} />
               {schedule.startTime}
            </p>
         </div>
         <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="details-container">
               <p className="flex items-center gap-3 tracking-tight text-zinc-500">
                  <Page className="h-5 w-5" strokeWidth={2} />
                  Course Name
               </p>
               <div className="flex w-full justify-between">
                  <p className="font-medium">{schedule.courseName}</p>
                  <CopyButton value={schedule.courseName} />
               </div>
            </div>
            <div className="details-container">
               <p className="flex items-center gap-3 tracking-tight text-zinc-500">
                  <Calendar className="h-5 w-5" strokeWidth={2} />
                  Start Time
               </p>
               <div className="flex w-full justify-between">
                  <p className="font-medium">{schedule.startTime}</p>
                  <CopyButton value={schedule.startTime} />
               </div>
            </div>
            <div className="details-container">
               <p className="flex items-center gap-3 tracking-tight text-zinc-500">
                  <Group className="h-5 w-5" strokeWidth={2} />
                  Instructor
               </p>
               <div className="flex w-full flex-wrap gap-2">
                  {schedule.instructors.map((instructor, instructorIndex) => (
                     <p
                        key={instructorIndex}
                        className="font-medium text-blue-500"
                     >
                        {instructor.firstName} {instructor.lastName}
                     </p>
                  ))}
               </div>
            </div>
            {schedule.remoteLink && (
               <div className="details-container">
                  <p className="flex items-center gap-3 tracking-tight text-zinc-500">
                     <Internet className="h-5 w-5" strokeWidth={2} />
                     Remote Link
                  </p>
                  <div className="flex w-full justify-between">
                     <p className="font-medium">{schedule.remoteLink}</p>
                     <CopyButton value={schedule.remoteLink} />
                  </div>
               </div>
            )}
            {schedule.address && (
               <div className="details-container">
                  <p className="flex items-center gap-3 tracking-tight text-zinc-500">
                     <Pin className="h-5 w-5" strokeWidth={2} />
                     Address
                  </p>
                  <div className="flex w-full justify-between">
                     <p className="font-medium">{schedule.address}</p>
                     <CopyButton value={schedule.address} />
                  </div>
               </div>
            )}
         </div>
      </>
   );
};

export default CourseDetails;
