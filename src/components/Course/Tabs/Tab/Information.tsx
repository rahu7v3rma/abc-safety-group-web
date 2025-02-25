'use client';

import clsx from 'clsx';
import { format, intervalToDuration } from 'date-fns';
import { Alarm, Mail, NavArrowRight, Page, Phone } from 'iconoir-react';
import Link from 'next/link';
import { FC, useCallback, useMemo, useState } from 'react';

import { PaymentSuccess } from '@/components/Paypal';
import DialogPay from '@/components/ui/DialogPay';
import Enrollment from '@/components/ui/Enrollment';
import Spinner from '@/components/ui/Spinner';
import VisualizationTable from '@/components/ui/VisualizationTable';
import Join from '@/components/ui/VisualizationTable/Buttons/Join';
import usePost from '@/hooks/usePost';
import { isEnvFalse } from '@/lib/environment';
import { filterZeroProperties, formatting } from '@/lib/helpers';
import { getImageURL } from '@/lib/image';
import {
   TAdminTableClassScheduleData,
   TCourseDetailsData,
   TInstructorTableScheduleData,
   TStudentTableScheduleData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CourseInformationProps {
   course: TCourseDetailsData;
   enrolled?: boolean;
   registration?: boolean;
   schedule: Array<
      | TAdminTableClassScheduleData
      | TStudentTableScheduleData
      | TInstructorTableScheduleData
   >;
}

const CourseInformation: FC<CourseInformationProps> = ({
   course,
   enrolled: enrolledData,
   registration,
   schedule: scheduleData,
}) => {
   const router = useRouter();

   const [enrolled, setEnrolled] = useState<boolean>(enrolledData ?? false);
   const [enroll, setEnroll] = useState<boolean>(false);
   const [cash, setCash] = useState<boolean>(false);
   const [paypal, setPaypal] = useState<boolean>(false);

   const [enrollPost, enrollLoading] = usePost<
      { transactionId?: string; userPaid: boolean; usingCash: boolean },
      any
   >('courses', ['enroll', course.courseId]);

   const enrollStudent = useCallback(() => {
      if (cash || isEnvFalse(process.env.NEXT_PUBLIC_ALLOW_PAYMENTS)) {
         toast.promise(
            enrollPost(
               {
                  usingCash: cash,
                  userPaid: false,
               },
               {
                  success: () => {
                     setEnrolled(true);
                     router.refresh();
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Enrolling into course...',
               success: 'Enrolled into course!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      } else {
         setPaypal(true);
      }
   }, [cash, enrollPost, router]);

   const enrollStudentPaid = useCallback(
      (data: PaymentSuccess) => {
         toast.promise(
            enrollPost(
               {
                  transactionId: data.transactionId,
                  userPaid: true,
                  usingCash: false,
               },
               {
                  success: () => {
                     setPaypal(false);
                     setEnrolled(true);
                     router.refresh();
                  },
               },
               {
                  throw: true,
               }
            ),
            {
               loading: 'Enrolling into course...',
               success: 'Enrolled into course!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      },
      [enrollPost, router]
   );

   const schedule = useHookstate(scheduleData);
   const pathname = usePathname();
   const schema: TVisualizationTableRootSchema<
      | TAdminTableClassScheduleData
      | TStudentTableScheduleData
      | TInstructorTableScheduleData
   > = useMemo(
      () => ({
         __root: {
            render: (children, values) => {
               return (
                  <Link
                     href={`${pathname}/schedule/${values.seriesNumber}`}
                     className="flex-grow transition duration-200 ease-linear hover:bg-zinc-100"
                  >
                     {children}
                  </Link>
               );
            },
            customActions: [
               (values) => {
                  if (
                     values.inProgress &&
                     values.remoteLink &&
                     values.remoteLink.trim().length
                  ) {
                     return <Join href={values.remoteLink} />;
                  }
                  return null;
               },
            ],
         },
         courseId: {
            hidden: true,
         },
         courseName: {
            render: (value, values) => {
               return (
                  <span
                     className={clsx(
                        values.inProgress ? 'text-blue-500' : 'text-black'
                     )}
                  >
                     {value}
                  </span>
               );
            },
         },
         duration: {
            render: (value) => {
               const duration = intervalToDuration({
                  start: 0,
                  end: value * 60 * 1000,
               });
               const formatted = Object.entries(filterZeroProperties(duration))
                  .map(([key, value]) => `${value}${key[0]}`)
                  .join(' ');
               return <span>{formatted}</span>;
            },
         },
         startTime: {
            render: (value, values) => {
               return (
                  <span className="text-sm text-zinc-500">
                     {format(new Date(value), formatting)}
                  </span>
               );
            },
         },
         endTime: {
            render: (value, values) => {
               return (
                  <span className="text-sm text-zinc-500">
                     {format(new Date(value), formatting)}
                  </span>
               );
            },
         },
      }),
      [pathname]
   );

   return (
      <div>
         {course.coursePicture && (
            <Image
               alt="Course picture"
               src={getImageURL('courses', course.coursePicture, 1024)}
               placeholder="blur"
               blurDataURL={`/_next/image?url=${getImageURL(
                  'courses',
                  course.coursePicture,
                  16
               )}&w=16&q=1`}
               width={1024}
               height={1024}
               className="mb-8 h-auto animate-fadeIn max-h-[20rem] w-full !flex-shrink-0 !flex-grow-0 rounded-2xl object-cover shadow-lg"
            />
         )}
         <div>
            <div className="flex items-center gap-2.5">
               <span className="rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-medium tracking-tight text-blue-500">
                  Course
               </span>
               {!course.complete && (
                  <span
                     className={clsx(
                        'rounded-lg px-2 py-1 text-sm font-medium tracking-tight',
                        course.active
                           ? 'bg-green-500/10 text-green-500'
                           : 'bg-red-500/10 text-red-500'
                     )}
                  >
                     {course.active ? 'Active' : 'Inactive'}
                  </span>
               )}
               {!!course.complete && (
                  <span
                     className={clsx(
                        'rounded-lg bg-green-500/10 px-2 py-1 text-sm font-medium tracking-tight text-green-500'
                     )}
                  >
                     Completed
                  </span>
               )}
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight">
               {course.courseName}
            </p>
            <p className="mt-5 leading-7 text-zinc-600">{course.description}</p>
            <div className="mt-10 grid grid-cols-2">
               {!!course.instructors &&
                  !!course.instructors.filter((v) => !!v).length && (
                     <div>
                        <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                           Instructors
                        </span>
                        <div className="mt-5 flex flex-wrap gap-5">
                           {course.instructors.map(
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
               <div>
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Instruction method
                  </span>
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                     {course.instructionTypes.map(
                        (instructionMethod, instructionMethodIndex) => (
                           <p
                              key={instructionMethodIndex}
                              className="font-medium"
                           >
                              {instructionMethod[0].toUpperCase() +
                                 instructionMethod.slice(
                                    1,
                                    instructionMethod.length
                                 )}{' '}
                              {instructionMethodIndex <
                                 course.instructionTypes.length - 1 &&
                                 course.instructionTypes.length > 1 &&
                                 '+'}
                           </p>
                        )
                     )}
                  </div>
               </div>
            </div>
            <div className="mt-10 grid grid-cols-2">
               <div>
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Languages
                  </span>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                     {course.languages.map((language, languageIndex) => (
                        <p key={languageIndex} className="font-medium">
                           {language}
                           {languageIndex !== course.languages.length - 1 &&
                              ','}
                        </p>
                     ))}
                  </div>
               </div>
               <div>
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Start date
                  </span>
                  <div className="mt-5">
                     <p className="inline-flex items-center gap-2.5 font-medium">
                        <Alarm
                           className="h-5 w-5 text-zinc-400"
                           strokeWidth={2}
                        />

                        {format(new Date(course.startDate), formatting)}
                     </p>
                  </div>
               </div>
            </div>
            {!!course.prerequisites && !!course.prerequisites.length && (
               <div className="mt-10">
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Prerequisites
                  </span>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                     {course.prerequisites.map(
                        (prerequisite, prerequisiteIndex) => (
                           <Link
                              key={prerequisiteIndex}
                              href={`/admin/courses/course/${prerequisite.courseId}`}
                              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 font-medium text-blue-500 shadow transition duration-200 ease-linear hover:bg-zinc-100/50 hover:underline"
                           >
                              <Page
                                 className="h-5 w-5 text-zinc-400"
                                 strokeWidth={2}
                              />
                              {prerequisite.courseName}
                           </Link>
                        )
                     )}
                  </div>
               </div>
            )}
            <div className="mt-14 grid grid-cols-2">
               <div>
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Contact email
                  </span>
                  <div className="mt-5">
                     <p className="inline-flex items-center gap-2.5 font-medium tracking-tight">
                        <Mail
                           className="h-5 w-5 text-zinc-400"
                           strokeWidth={2}
                        />
                        {course.email}
                     </p>
                  </div>
               </div>
               <div>
                  <span className="rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                     Contact phone
                  </span>
                  <div className="mt-5">
                     <p className="inline-flex items-center gap-2.5 font-medium tracking-tight">
                        <Phone
                           className="h-5 w-5 text-zinc-400"
                           strokeWidth={2}
                        />
                        {course.phoneNumber}
                     </p>
                  </div>
               </div>
            </div>
            <div className="mt-10">
               <VisualizationTable
                  name="Course schedule"
                  data={schedule}
                  schema={schema}
                  maxHeight="h-auto max-h-[60rem] min-h-[15rem]"
               />
            </div>
            <hr className="mb-5 mt-10 border-t border-zinc-200" />
            <div className="w-full rounded-3xl bg-white p-10 text-center shadow">
               <p className="inline-block rounded-lg bg-zinc-500/10 px-2 py-1 text-sm font-medium tracking-tight text-zinc-500">
                  Course price
               </p>
               <p className="mt-5 text-2xl font-semibold tracking-wide">
                  ${course.price}
               </p>
               <p className="mt-2.5 text-sm font-medium tracking-tight text-zinc-500">
                  One-time total
               </p>
            </div>
            {!!registration && (
               <div className="mt-10">
                  {!enrolled &&
                  !course.complete &&
                  !!course.enrollable &&
                  (!course.isFull || course.waitlist) ? (
                     <>
                        <button
                           disabled={course.isFull}
                           onClick={() => setEnroll(true)}
                           className="group flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-5 font-semibold tracking-tight text-white transition duration-200 ease-linear hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-75"
                        >
                           {!!course.isFull && !!course.waitlist
                              ? 'Join waitlist'
                              : 'Enroll into course'}
                           {enrollLoading ? (
                              <Spinner className="-mr-4 ml-4 h-5 w-5 text-zinc-200" />
                           ) : (
                              <NavArrowRight
                                 className="-mr-4 ml-4 h-5 w-5 text-zinc-200 transition duration-200 ease-linear will-change-transform group-hover:translate-x-1"
                                 strokeWidth={2}
                              />
                           )}
                        </button>
                        <Enrollment
                           title="Course enrollment"
                           name={course.courseName}
                           open={enroll}
                           setDialogOpen={setEnroll}
                           action={enrollStudent}
                           checkbox={
                              course.allowCash
                                 ? {
                                      checked: cash,
                                      label: 'Pay with cash',
                                      setChecked: setCash,
                                   }
                                 : undefined
                           }
                        />
                        <DialogPay
                           title="Course payment"
                           description={`You are paying to enroll into ${course.courseName}`}
                           open={paypal}
                           setOpen={setPaypal}
                           body={{
                              id: course.courseId,
                              name: course.courseName,
                              price: course.price,
                           }}
                           action={enrollStudentPaid}
                        />
                     </>
                  ) : (
                     <div className="flex w-full cursor-not-allowed items-center justify-center rounded-2xl bg-zinc-200 px-4 py-5 font-medium tracking-tight text-zinc-600">
                        {course.complete
                           ? 'Course completed'
                           : !!enrolled
                           ? 'Already enrolled in this course'
                           : course.isFull && !course.waitlist
                           ? 'Course is full'
                           : !course.enrollable
                           ? 'Course is not enrollable'
                           : 'Cannot enroll into course'}
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

export default CourseInformation;
