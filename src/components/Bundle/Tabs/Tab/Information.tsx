'use client';

import clsx from 'clsx';
import { NavArrowRight, Page } from 'iconoir-react';
import Link from 'next/link';
import { FC, useCallback, useState } from 'react';

import DialogPay from '@/components/ui/DialogPay';
import Enrollment from '@/components/ui/Enrollment';
import Spinner from '@/components/ui/Spinner';
import VisualizationTable from '@/components/ui/VisualizationTable';

import { PaymentSuccess } from '@/components/Paypal';
import Join from '@/components/ui/VisualizationTable/Buttons/Join';
import usePost from '@/hooks/usePost';
import { isEnvFalse } from '@/lib/environment';
import { filterZeroProperties, formatting } from '@/lib/helpers';
import {
   TAdminTableClassScheduleData,
   TBundleDetailsData,
   TStudentTableScheduleData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import { format, intervalToDuration } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const schema: TVisualizationTableRootSchema<
   TAdminTableClassScheduleData | TStudentTableScheduleData
> = {
   __root: {
      render: (children, values) => {
         return (
            <Link
               href={`/admin/courses/course/${values.courseId}`}
               className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
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
};

interface BundleInformationProps {
   bundle: TBundleDetailsData;
   schedule: Array<TAdminTableClassScheduleData | TStudentTableScheduleData>;
   enrolled: boolean;
   registration?: boolean;
   complete?: boolean;
}

const BundleInformation: FC<BundleInformationProps> = ({
   bundle,
   schedule: scheduleData,
   enrolled: enrolledData,
   registration,
   complete,
}) => {
   const router = useRouter();
   const schedule = useHookstate(scheduleData);

   const [enrolled, setEnrolled] = useState<boolean>(enrolledData);
   const [enroll, setEnroll] = useState<boolean>(false);
   const [cash, setCash] = useState<boolean>(false);
   const [paypal, setPaypal] = useState<boolean>(false);

   const [enrollPost, enrollLoading] = usePost<
      { transactionId?: string; userPaid: boolean; usingCash: boolean },
      any
   >('courses', ['bundle', 'enroll', bundle.bundleId]);

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
               loading: 'Enrolling into bundle...',
               success: 'Enrolled into bundle!',
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
               loading: 'Enrolling into bundle...',
               success: 'Enrolled into bundle!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      },
      [enrollPost, router]
   );

   return (
      <div>
         <div className="flex items-center gap-2.5">
            <span className="font-medium py-1 px-2 rounded-lg bg-blue-500/10 text-sm tracking-tight text-blue-500">
               Bundle
            </span>
            {!bundle.complete && (
               <span
                  className={clsx(
                     'font-medium py-1 px-2 rounded-lg text-sm tracking-tight',
                     bundle.active
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                  )}
               >
                  {bundle.active ? 'Active' : 'Inactive'}
               </span>
            )}
            {!!bundle.complete && (
               <span
                  className={clsx(
                     'font-medium py-1 px-2 rounded-lg text-sm tracking-tight bg-green-500/10 text-green-500'
                  )}
               >
                  Completed
               </span>
            )}
         </div>
         <p className="mt-5 font-semibold tacking-tight text-xl">
            {bundle.bundleName}
         </p>
         <div className="grid grid-cols-2 mt-10">
            <div>
               <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                  Instruction method
               </span>
               <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {bundle.instructionTypes.map(
                     (instructionMethod, instructionMethodIndex) => (
                        <p key={instructionMethodIndex} className="font-medium">
                           {instructionMethod[0].toUpperCase() +
                              instructionMethod.slice(
                                 1,
                                 instructionMethod.length
                              )}{' '}
                           {instructionMethodIndex <
                              bundle.instructionTypes.length - 1 &&
                              bundle.instructionTypes.length > 1 &&
                              '+'}
                        </p>
                     )
                  )}
               </div>
            </div>
            <div>
               <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
                  Languages
               </span>
               <div className="mt-5 flex flex-wrap gap-2.5">
                  {bundle.languages.map((language, languageIndex) => (
                     <p key={languageIndex} className="font-medium">
                        {language}
                        {languageIndex !== bundle.languages.length - 1 && ','}
                     </p>
                  ))}
               </div>
            </div>
         </div>
         <div className="mt-10">
            <span className="font-medium tracking-tight py-1 px-2 rounded-lg text-sm bg-zinc-500/10 text-zinc-500">
               Courses included
            </span>
            <div className="mt-5 flex flex-wrap gap-2.5">
               {bundle.courses.map((prerequisite, prerequisiteIndex) => (
                  <Link
                     key={prerequisiteIndex}
                     href={`/admin/courses/course/${prerequisite.courseId}`}
                     className="font-medium py-2 inline-flex items-center gap-2.5 px-3 bg-white transition duration-200 ease-linear hover:bg-zinc-100/50 hover:underline rounded-xl shadow text-blue-500"
                  >
                     <Page className="h-5 w-5 text-zinc-400" strokeWidth={2} />
                     {prerequisite.courseName}
                  </Link>
               ))}
            </div>
         </div>
         <div className="mt-14">
            <VisualizationTable
               name="Bundle schedule"
               data={schedule}
               schema={schema}
               maxHeight="h-auto min-h-[15rem] max-h-[30rem]"
            />
         </div>
         <hr className="border-t border-zinc-200 mt-10 mb-5" />
         <div className="bg-white text-center p-10 w-full rounded-2xl shadow">
            <p className="font-medium py-1 px-2 rounded-lg bg-zinc-500/10 inline-block text-sm tracking-tight text-zinc-500">
               Bundle price
            </p>
            <p className="mt-5 text-2xl font-semibold tracking-wide">
               ${bundle.price}
            </p>
            <p className="mt-2.5 text-zinc-500 font-medium tracking-tight text-sm">
               One-time total
            </p>
         </div>
         {!!registration && (
            <div className="mt-10">
               {!enrolled &&
               !bundle.complete &&
               !!bundle.enrollable &&
               (!bundle.isFull || bundle.waitlist) ? (
                  <>
                     <button
                        disabled={bundle.isFull}
                        onClick={() => setEnroll(true)}
                        className="py-5 group w-full px-4 flex items-center disabled:opacity-75 disabled:cursor-not-allowed justify-center font-semibold tracking-tight bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 text-white rounded-2xl"
                     >
                        {!!bundle.isFull && !!bundle.waitlist
                           ? 'Join waitlist'
                           : 'Enroll into bundle'}
                        {enrollLoading ? (
                           <Spinner className="h-5 w-5 ml-4 -mr-4 text-zinc-200" />
                        ) : (
                           <NavArrowRight
                              className="h-5 transition duration-200 ease-linear group-hover:translate-x-1 will-change-transform w-5 ml-4 -mr-4 text-zinc-200"
                              strokeWidth={2}
                           />
                        )}
                     </button>
                     <Enrollment
                        title="Bundle enrollment"
                        name={bundle.bundleName}
                        open={enroll}
                        setDialogOpen={setEnroll}
                        action={enrollStudent}
                        checkbox={
                           bundle.allowCash
                              ? {
                                   checked: cash,
                                   label: 'Pay with cash',
                                   setChecked: setCash,
                                }
                              : undefined
                        }
                     />
                     <DialogPay
                        title="Bundle payment"
                        description={`You are paying to enroll into ${bundle.bundleName}`}
                        open={paypal}
                        setOpen={setPaypal}
                        body={{
                           id: bundle.bundleId,
                           name: bundle.bundleName,
                           price: bundle.price,
                        }}
                        action={enrollStudentPaid}
                     />
                  </>
               ) : (
                  <div className="py-5 cursor-not-allowed bg-zinc-200 text-zinc-600 w-full px-4 flex items-center justify-center font-medium tracking-tight rounded-2xl">
                     {bundle.complete
                        ? 'Bundle completed'
                        : !bundle.enrollable
                        ? 'Bundle is not enrollable'
                        : bundle.isFull && !bundle.waitlist
                        ? 'Bundle is full'
                        : !!enrolled
                        ? 'Already enrolled in this bundle'
                        : 'Cannot enroll into bundle'}
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

export default BundleInformation;
