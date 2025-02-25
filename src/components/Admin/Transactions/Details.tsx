'use client';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import config from '@/config';
import { useRoles } from '@/contexts/roles';
import usePost from '@/hooks/usePost';
import { TTransaction } from '@/lib/types';
import clsx from 'clsx';
import domtoimage from 'dom-to-image';
import {
   Archive,
   AtSign,
   Bank,
   Calendar,
   Dollar,
   Download as DownloadIcon,
   Edit,
   Folder,
   Group,
   Internet,
   MultiplePages,
   Notes,
   Page,
   Pin,
   SendDollars,
   User,
   Xmark,
} from 'iconoir-react';
import jsPDF from 'jspdf';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const mockInstructions = [...Array(4).keys()].map((numb, numbIndex) => (
   <li key={numbIndex}>Lorem ipsum {numb + 1}</li>
));
const mockTermsConditions = mockInstructions;

type Props = {
   transaction: TTransaction;
};

const TransactionDetails: FC<Props> = ({ transaction }) => {
   const { payer, transactionId, transactionDate, course, bundle } =
      transaction;

   const router = useRouter();
   const pathname = usePathname();
   const { roles } = useRoles();

   const isAdmin = useMemo(
      () => (roles ? !!roles.find((role) => role.roleName === 'admin') : false),
      [roles]
   );

   const [voidTransactionPost, voidTransactionPostLoading] = usePost<{}, any>(
      'transactions',
      ['void', transactionId]
   );

   const Void = useCallback(() => {
      toast.promise(
         voidTransactionPost(
            {},
            {
               success: router.refresh,
            },
            {
               throw: true,
            }
         ),
         {
            loading: 'Voiding transaction...',
            success: 'Voided transaction!',
            error: 'Failed voiding transaction.',
         }
      );
   }, [voidTransactionPost, router]);

   const transactionRef = useRef<HTMLDivElement>(null);
   const [downloading, setDownloading] = useState(false);

   const Download = useCallback(() => {
      if (transactionRef.current) {
         setDownloading(true);
         domtoimage
            .toPng(transactionRef.current)
            .then((dataUrl) => {
               const img = new Image();
               img.onload = () => {
                  const aspectRatio = img.width / img.height;

                  const pdf = new jsPDF({
                     orientation: 'portrait',
                     unit: 'pt',
                     format: 'a4',
                  });

                  const pdfWidth = pdf.internal.pageSize.getWidth();
                  const pdfHeight = pdf.internal.pageSize.getHeight();
                  const pdfAspectRatio = pdfWidth / pdfHeight;

                  let width, height;
                  if (aspectRatio > pdfAspectRatio) {
                     width = pdfWidth;
                     height = width / aspectRatio;
                  } else {
                     height = pdfHeight;
                     width = height * aspectRatio;
                  }

                  const posX = (pdfWidth - width) / 2;
                  const posY = (pdfHeight - height) / 2;

                  pdf.addImage(dataUrl, 'PNG', posX, posY, width, height);
                  pdf.save('receipt.pdf');
                  setDownloading(false);
               };
               img.src = dataUrl;
            })
            .catch((error) => {
               console.error('Error capturing screenshot:', error);
               setDownloading(false);
            });
      }
   }, []);

   const [openVoidButtonConfirmation, setOpenVoidButtonConfirmation] =
      useState(false);

   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="inline-flex text-xl font-semibold tracking-tight items-center">
               <Page className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Transaction details
            </div>
            <div className="flex gap-2">
               {isAdmin && !transaction.void && (
                  <button
                     className="px-5 w-32 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
                     onClick={() => router.push(`${pathname}/update`)}
                  >
                     Update
                     <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                        <Edit className="h-4 w-4" strokeWidth={2} />
                     </span>
                  </button>
               )}
               {isAdmin && !transaction.void && (
                  <Confirmation
                     open={openVoidButtonConfirmation}
                     setDialogOpen={setOpenVoidButtonConfirmation}
                     title="Void transaction"
                     action={Void}
                  >
                     <button
                        className="px-5 w-30 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-red-800 font-semibold text-sm py-2 bg-gradient-to-b from-red-400 to-red-500 rounded-2xl shadow-inner-red"
                        onClick={() => setOpenVoidButtonConfirmation(true)}
                     >
                        Void
                        <span className="flex items-center justify-center h-8 w-8 ml-4 -mr-2 bg-red-600 rounded-[0.6rem]">
                           {voidTransactionPostLoading ? (
                              <Spinner className="h-4 w-4" />
                           ) : (
                              <Xmark className="h-4 w-4" strokeWidth={2} />
                           )}
                        </span>
                     </button>
                  </Confirmation>
               )}
               <button
                  disabled={downloading}
                  className="px-5 w-30 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-green-800 font-semibold text-sm py-2 bg-gradient-to-b from-green-400 to-green-500 rounded-2xl shadow-inner-green"
                  onClick={Download}
               >
                  Download
                  <span className="flex items-center justify-center h-8 w-8 ml-4 -mr-2 bg-green-600 rounded-[0.6rem]">
                     {downloading ? (
                        <Spinner className="h-4 w-4" />
                     ) : (
                        <DownloadIcon className="h-4 w-4" strokeWidth={2} />
                     )}
                  </span>
               </button>
            </div>
         </div>
         <div className="mt-5 h-[1px] gap-5 bg-zinc-50 rounded-2xl border border-zinc-200 flex flex-col flex-grow overflow-auto">
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-5">
               <div
                  className={clsx(
                     'flex flex-col p-10',
                     downloading && 'w-full h-full'
                  )}
                  ref={transactionRef}
               >
                  <div className="flex items-center gap-x-5 mb-4">
                     <img
                        src={config.logo.src}
                        alt="Logo"
                        className="flex-shrink-0 flex-grow-0 w-28"
                     />
                     <div className="text-center text-sm">
                        <p>147 Prince Street</p>
                        <p>Brooklyn, NY, 11201</p>
                        <p>718-387-8133</p>
                        <p>info@abcsafetygroup.com</p>
                        <p>abcsafetygroup.com</p>
                     </div>
                  </div>
                  <p className="mt-5 text-2xl text-center font-semibold tracking-tight">
                     Transaction receipt
                  </p>
                  <p className="mt-2.5 text-base text-center text-zinc-500 font-medium tracking-tight">
                     Please see your transaction receipt below.
                  </p>
                  <div className="mt-10 flex flex-col gap-y-5">
                     <div className="grid grid-cols-2 gap-5">
                        <div className="details-container">
                           <div className="w-full flex flex-col">
                              <p className="ml-5 tracking-tight text-lg text-zinc-800 font-medium">
                                 Instructions
                              </p>
                              <ul className="mt-4 w-full break-words list-disc px-5 text-zinc-600 space-y-1">
                                 <li>Lorem Ipsum 1</li>
                                 <li>Lorem ipsum 2</li>
                                 <li>Lorem ipsum 1</li>
                                 <li>Lorem ipsum 2</li>
                              </ul>
                           </div>
                        </div>
                        <div className="details-container">
                           <div className="w-full flex flex-col">
                              <p className="tracking-tight ml-5 text-lg text-zinc-800 font-medium">
                                 Terms and Conditions
                              </p>
                              <ul className="mt-4 list-disc w-full break-words px-5 text-zinc-600 space-y-1">
                                 <li>Lorem ipsum 1</li>
                                 <li>Lorem ipsum 2</li>
                                 <li>Lorem ipsum 1</li>
                                 <li>Lorem ipsum 2</li>
                              </ul>
                           </div>
                        </div>
                     </div>
                     <div className="details-container">
                        <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                           <AtSign className="h-5 w-5" strokeWidth={2} />
                           Transaction ID
                        </p>
                        <p className="font-medium">{transactionId}</p>
                     </div>
                     <div className="grid grid-cols-2 gap-x-5">
                        {(payer?.firstName || payer?.lastName) && (
                           <div className="grid">
                              <div className="details-container">
                                 <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                                    <User className="h-5 w-5" strokeWidth={2} />
                                    Student Name
                                 </p>
                                 <p className="font-medium relative inline-block">
                                    {payer.firstName} {payer.lastName}
                                 </p>
                              </div>
                           </div>
                        )}
                        <div className="details-container">
                           <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                              <Calendar className="h-5 w-5" strokeWidth={2} />
                              Transaction Date
                           </p>
                           <p className="font-medium">{transactionDate}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-x-5">
                        <div className="details-container">
                           <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                              <Archive className="h-5 w-5" strokeWidth={2} />
                              Transaction Status
                           </p>
                           <p className="font-medium">
                              {transaction.void ? 'VOID' : 'VALID'}
                           </p>
                        </div>
                        <div className="details-container">
                           <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                              <Bank className="h-5 w-5" strokeWidth={2} />
                              Transaction Type
                           </p>
                           <p className="font-medium">
                              {transaction.usingCash ? 'CASH' : 'CREDIT'}
                           </p>
                        </div>
                     </div>
                     {transaction.description && (
                        <div className="details-container">
                           <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                              <MultiplePages
                                 className="h-5 w-5"
                                 strokeWidth={2}
                              />
                              Description
                           </p>
                           <p className="font-medium">
                              {transaction.description}
                           </p>
                        </div>
                     )}
                     {transaction.notes && (
                        <div className="details-container">
                           <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                              <Notes className="h-5 w-5" strokeWidth={2} />
                              Notes
                           </p>
                           <p className="font-medium">{transaction.notes}</p>
                        </div>
                     )}
                     <div
                        className={clsx(
                           'grid',
                           (course?.coursePrice ||
                              bundle?.bundlePrice ||
                              course?.coursePrice === 0 ||
                              bundle?.bundlePrice === 0) &&
                              'grid-cols-2 gap-x-5'
                        )}
                     >
                        <div className="details-container">
                           <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                              <SendDollars
                                 className="h-5 w-5"
                                 strokeWidth={2}
                              />
                              Amount Paid
                           </p>
                           <p className="font-medium">${transaction.price}</p>
                        </div>
                        {(course?.coursePrice ||
                           bundle?.bundlePrice ||
                           course?.coursePrice === 0 ||
                           bundle?.bundlePrice === 0) && (
                           <div className="details-container">
                              <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                                 <Dollar className="h-5 w-5" strokeWidth={2} />
                                 {course
                                    ? 'Course'
                                    : bundle
                                    ? 'Bundle'
                                    : ''}{' '}
                                 Price
                              </p>
                              <p className="font-medium">
                                 $
                                 {course
                                    ? course.coursePrice
                                    : bundle
                                    ? bundle.bundlePrice
                                    : ''}
                              </p>
                           </div>
                        )}
                     </div>
                     {(course || bundle) && (
                        <>
                           <div className="flex flex-col gap-y-5">
                              <div className="grid">
                                 <div className="details-container">
                                    <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                                       <Page
                                          className="h-5 w-5"
                                          strokeWidth={2}
                                       />
                                       {course
                                          ? 'Course'
                                          : bundle
                                          ? 'Bundle'
                                          : ''}{' '}
                                       Name
                                    </p>
                                    <p className="font-medium">
                                       {course
                                          ? course?.courseName
                                          : bundle
                                          ? bundle.bundleName
                                          : ''}
                                    </p>
                                 </div>
                              </div>
                              <div className="details-container">
                                 <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                                    <Calendar
                                       className="h-5 w-5"
                                       strokeWidth={2}
                                    />
                                    Start Date and Time
                                 </p>
                                 <p className="font-medium">
                                    {course
                                       ? course?.startDate
                                       : bundle
                                       ? bundle.startDate
                                       : ''}
                                 </p>
                              </div>
                           </div>
                           {course && course.instructors.length > 0 && (
                              <div className="details-container">
                                 <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                                    <Group
                                       className="h-5 w-5"
                                       strokeWidth={2}
                                    />
                                    Instructors
                                 </p>
                                 {course.instructors.map(
                                    (instructor, instructorIndex) => (
                                       <p
                                          className="font-medium block"
                                          key={instructorIndex}
                                       >
                                          {instructor.firstName}{' '}
                                          {instructor.lastName}
                                       </p>
                                    )
                                 )}
                              </div>
                           )}
                           {bundle && bundle.courses.length > 0 && (
                              <div className="details-container">
                                 <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                                    <Folder
                                       className="h-5 w-5"
                                       strokeWidth={2}
                                    />
                                    Courses
                                 </p>
                                 <div className="flex flex-wrap gap-2.5">
                                    {bundle.courses.map(
                                       (prerequisite, prerequisiteIndex) => (
                                          <div
                                             key={prerequisiteIndex}
                                             className="font-medium py-2 inline-flex items-center gap-2.5 px-3 bg-white border border-zinc-100 transition duration-200 ease-linear rounded-xl shadow text-blue-500"
                                          >
                                             <Page
                                                className="h-5 w-5 text-zinc-400"
                                                strokeWidth={2}
                                             />
                                             {prerequisite.courseName}
                                          </div>
                                       )
                                    )}
                                 </div>
                              </div>
                           )}
                           {course &&
                              (course?.remoteLink || course?.address) && (
                                 <div
                                    className={clsx(
                                       'grid',
                                       course?.remoteLink &&
                                          course?.address &&
                                          'grid-cols-2 gap-x-5'
                                    )}
                                 >
                                    {course?.remoteLink && (
                                       <div className="details-container">
                                          <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                                             <Internet
                                                className="h-5 w-5"
                                                strokeWidth={2}
                                             />
                                             Remote Link
                                          </p>
                                          <p className="font-medium">
                                             {course?.remoteLink}
                                          </p>
                                       </div>
                                    )}
                                    {course?.address && (
                                       <div className="details-container">
                                          <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                                             <Pin
                                                className="h-5 w-5"
                                                strokeWidth={2}
                                             />
                                             Course Address
                                          </p>
                                          <p className="font-medium">
                                             {course?.address}
                                          </p>
                                       </div>
                                    )}
                                 </div>
                              )}
                        </>
                     )}
                     <div className="flex items-center gap-5 mt-8">
                        <div className="flex-1 border-t border-zinc-200" />
                        <p className="text-xs font-medium text-zinc-400">
                           NOTE
                        </p>
                        <div className="flex-1 border-t border-zinc-200" />
                     </div>
                     <span className="text-zinc-500 text-[11px] text-center -mt-3">
                        We may not be able to provide you with your completion
                        certification if you do not pay any outstanding balances
                        on this receipt.
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TransactionDetails;
