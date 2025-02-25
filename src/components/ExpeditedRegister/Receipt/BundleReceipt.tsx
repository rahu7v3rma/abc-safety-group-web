import config from '@/config';

import { useHookstate } from '@hookstate/core';
import { format } from 'date-fns';
import domtoimage from 'dom-to-image';
import {
   Calendar,
   Dollar,
   Download,
   Folder,
   Group,
   Notes,
   Page,
   SendDollars,
   User,
} from 'iconoir-react';
import jsPDF from 'jspdf';
import { Dispatch, FC, SetStateAction, useRef } from 'react';

import { AdminScheduleTableSchema } from '../../Admin/ClassSchedule/Schema';
import {
   ExpeditedRegisterCourseOrBundle,
   expeditedRegisterSchemaType,
} from '../Schema';

import Dialog from '@/components/ui/Dialog';
import Tooltip from '@/components/ui/Tooltip';
import VisualizationTable from '@/components/ui/VisualizationTable';

import { TAdminTableClassScheduleData } from '@/lib/types';

interface BundleReceiptProps {
   open: boolean;
   setOpen: Dispatch<SetStateAction<boolean>>;
   bundle: ExpeditedRegisterCourseOrBundle;
   values: expeditedRegisterSchemaType;
}

const BundleReceipt: FC<BundleReceiptProps> = ({
   open,
   setOpen,
   bundle,
   values,
}) => {
   const schedule = useHookstate<TAdminTableClassScheduleData[]>(
      bundle.schedule
   );

   let schema = AdminScheduleTableSchema;
   delete schema['__root'];
   schema = {
      ...schema,
      duration: {
         hidden: true,
      },
      seriesNumber: {
         hidden: true,
      },
      complete: {
         hidden: true,
      },
      inProgress: {
         hidden: true,
      },
   };

   const bundleRef = useRef<HTMLDivElement>(null);
   const capturing = useHookstate<boolean>(false);

   async function downloadImage() {
      if (bundleRef.current) {
         capturing.set(true);
         domtoimage
            .toPng(bundleRef.current)
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
                  capturing.set(false);
               };
               img.src = dataUrl;
            })
            .catch((error) => {
               console.error('Error capturing screenshot:', error);
            });
      }
   }

   return (
      <Dialog
         open={open}
         onOpenChange={setOpen}
         contentClassName="max-w-[755px]"
         disablePadding
         zIndex={10001}
      >
         <div ref={bundleRef} className="w-full p-10 h-full bg-white">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-x-5">
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
               {!capturing.get() && (
                  <Tooltip content="Download Receipt">
                     <button
                        onClick={downloadImage}
                        className="bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 p-3 rounded-bl-2xl text-white"
                     >
                        <Download className="h-7 w-7" strokeWidth={2} />
                     </button>
                  </Tooltip>
               )}
            </div>

            <p className="mt-10 text-2xl text-center font-semibold tracking-tight">
               Registration receipt
            </p>
            <p className="mt-5 text-center text-xl text-blue-500 tracking-tight font-medium">
               You are all registered {values.firstName}.
            </p>
            <p className="text-base text-center text-zinc-500 font-medium mt-2.5 tracking-tight">
               Please see your registration receipt below.
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
               <div className="grid grid-cols-2 gap-x-5">
                  <div className="details-container">
                     <p className="flex tracking-tight text-zinc-500 items-center gap-3">
                        <User className="h-5 w-5" strokeWidth={2} />
                        Student name
                     </p>
                     <p className="font-medium">
                        {values.firstName} {values.lastName}
                     </p>
                  </div>
                  <div className="details-container">
                     <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                        <Calendar className="h-5 w-5" strokeWidth={2} />
                        Registration date
                     </p>
                     <p className="font-medium">
                        {format(Date.now(), 'MM/dd/yyyy hh:mm a')}
                     </p>
                  </div>
               </div>
               <div className="details-container">
                  <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                     <Folder className="h-5 w-5" strokeWidth={2} />
                     Courses
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                     {bundle.courses.map((prerequisite, prerequisiteIndex) => (
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
                     ))}
                  </div>
               </div>
               <div className="details-container">
                  <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                     <Group className="h-5 w-5" strokeWidth={2} />
                     Instructors
                  </p>
                  <div>
                     {bundle.instructors.map((instructor, instructorIndex) => (
                        <p
                           className="font-medium inline-block"
                           key={instructorIndex}
                        >
                           {instructor.firstName} {instructor.lastName}
                           {instructorIndex + 1 !== bundle.instructors.length
                              ? ', '
                              : ''}
                        </p>
                     ))}
                  </div>
               </div>
               <div className="details-container">
                  <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                     <Calendar className="h-5 w-5" strokeWidth={2} />
                     Start date and time
                  </p>
                  <p className="font-medium">{bundle.startDate}</p>
               </div>
               <div className="grid grid-cols-2 gap-x-5">
                  <div className="details-container">
                     <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                        <SendDollars className="h-5 w-5" strokeWidth={2} />
                        Amount paid
                     </p>
                     <p className="font-medium">${values.price}</p>
                  </div>
                  <div className="details-container">
                     <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                        <Dollar className="h-5 w-5" strokeWidth={2} />
                        Bundle price
                     </p>
                     <p className="font-medium">${bundle.price}</p>
                  </div>
               </div>
               {values.notes && !!values.notes.length && (
                  <div className="details-container">
                     <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                        <Notes className="h-5 w-5" strokeWidth={2} />
                        Notes
                     </p>
                     <div>{values.notes}</div>
                  </div>
               )}
            </div>
            <div className="mt-10">
               <VisualizationTable
                  name="Schedule"
                  data={schedule}
                  schema={schema}
                  autoHeight
               />
            </div>
         </div>
      </Dialog>
   );
};

export default BundleReceipt;
