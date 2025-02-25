'use client';

import { formatting, minutesToHumanReadable } from '@/lib/helpers';
import { TScheduleDetailsData } from '@/lib/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Alarm, LogIn, LogOut, Page, Pin, Timer } from 'iconoir-react';
import { usePathname } from 'next/navigation';
import { FC } from 'react';
import Link from '../ui/Link';
import VisualizationTableButtonUpdate from '../ui/VisualizationTable/Buttons/Update';
import ScheduleButtonComplete from './Buttons/Complete';
import ScheduleButtonDelete from './Buttons/Delete';

type ScheduleDetailsProps = {
   schedule: TScheduleDetailsData;
   signInOut: boolean;
   manage: boolean;
};

const ScheduleDetails: FC<ScheduleDetailsProps> = ({
   schedule,
   signInOut = false,
   manage = false,
}) => {
   const pathname = usePathname();

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <Page className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Schedule details
            </div>
            <div className="flex gap-2">
               {!!signInOut &&
                  !schedule.complete &&
                  !schedule.absent &&
                  schedule.inProgress &&
                  (schedule.signedIn ? (
                     <Link
                        href={pathname + '/signOut'}
                        className="shadow-inner-red pointer-events-auto flex w-32 items-center justify-between gap-2 rounded-2xl border border-red-800 bg-gradient-to-b from-red-400 to-red-500 px-5 pb-2 pt-2 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:text-white disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Sign Out
                        <span className="-mr-2 flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-red-600">
                           <LogOut className="h-4 w-4" strokeWidth={2} />
                        </span>
                     </Link>
                  ) : (
                     <Link
                        href={pathname + '/signIn'}
                        className="shadow-inner-blue pointer-events-auto flex w-32 items-center justify-between gap-2 rounded-2xl border border-blue-800 bg-gradient-to-b from-blue-400 to-blue-500 px-5 pb-2 pt-2 text-sm font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:text-white disabled:cursor-not-allowed disabled:opacity-75"
                     >
                        Sign In
                        <span className="-mr-2 flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-blue-600">
                           <LogIn className="h-4 w-4" strokeWidth={2} />
                        </span>
                     </Link>
                  ))}
               {!!manage && (
                  <>
                     {!schedule.complete && !schedule.inProgress && (
                        <VisualizationTableButtonUpdate />
                     )}
                     {!schedule.complete && (
                        <ScheduleButtonComplete schedule={schedule} />
                     )}
                     {!schedule.inProgress && <ScheduleButtonDelete />}
                  </>
               )}
            </div>
         </div>
         <div className="mt-5 flex h-[1px] flex-grow flex-col gap-5 overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-14">
               <div>
                  <div>
                     <div className="flex items-center gap-2.5">
                        <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500">
                           Schedule
                        </span>
                        <span
                           className={clsx(
                              'rounded-lg px-2 py-1 text-sm font-medium tracking-tight',
                              schedule.complete
                                 ? 'bg-green-500/10 text-green-500'
                                 : schedule.inProgress
                                 ? 'bg-blue-500/10 text-blue-500'
                                 : 'bg-red-500/10 text-red-500'
                           )}
                        >
                           {schedule.complete
                              ? 'Complete'
                              : schedule.inProgress
                              ? 'In progress'
                              : 'Incomplete'}
                        </span>
                     </div>
                     <p className="mt-5 text-2xl font-semibold tracking-tight">
                        {schedule.courseName}
                     </p>
                  </div>
                  <div className="mt-10 grid grid-cols-2">
                     <div>
                        <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                           Start time
                        </span>
                        <div className="mt-5">
                           <p className="inline-flex items-center gap-2.5 font-medium">
                              <Alarm
                                 className="h-5 w-5 text-zinc-400"
                                 strokeWidth={2}
                              />
                              {format(new Date(schedule.startTime), formatting)}
                           </p>
                        </div>
                     </div>
                     <div>
                        <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                           End time
                        </span>
                        <div className="mt-5">
                           <p className="inline-flex items-center gap-2.5 font-medium">
                              <Alarm
                                 className="h-5 w-5 text-zinc-400"
                                 strokeWidth={2}
                              />

                              {format(new Date(schedule.endTime), formatting)}
                           </p>
                        </div>
                     </div>
                  </div>
                  <div className="mt-10 grid grid-cols-2">
                     {schedule.duration > 0 && (
                        <div>
                           <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                              Duration
                           </span>
                           <div className="mt-5">
                              <p className="inline-flex items-center gap-2.5 font-medium">
                                 <Timer
                                    className="h-5 w-5 text-zinc-400"
                                    strokeWidth={2}
                                 />
                                 {minutesToHumanReadable(schedule.duration)}
                              </p>
                           </div>
                        </div>
                     )}
                     {!!schedule.instructors &&
                        !!schedule.instructors.length && (
                           <div>
                              <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                                 Instructors
                              </span>
                              <div className="mt-5 flex flex-wrap gap-5">
                                 {schedule.instructors.map(
                                    (instructor, instructorIndex) => (
                                       <div key={instructorIndex}>
                                          <p className="font-medium text-blue-500">
                                             {instructor.firstName}{' '}
                                             {instructor.lastName}
                                          </p>
                                       </div>
                                    )
                                 )}
                              </div>
                           </div>
                        )}
                  </div>
                  <div className="mt-10 grid grid-cols-2">
                     {schedule.address && (
                        <div>
                           <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                              Address
                           </span>
                           <div className="mt-5">
                              <p className="inline-flex items-center gap-2.5 font-medium">
                                 <Pin
                                    className="h-5 w-5 text-zinc-400"
                                    strokeWidth={2}
                                 />
                                 {schedule.address}
                              </p>
                           </div>
                        </div>
                     )}
                     {schedule.remoteLink && (
                        <div>
                           <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                              Remote link
                           </span>
                           <div className="mt-5">
                              <p className="inline-flex items-center gap-2.5 font-medium text-blue-500">
                                 {schedule.remoteLink}
                              </p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ScheduleDetails;
