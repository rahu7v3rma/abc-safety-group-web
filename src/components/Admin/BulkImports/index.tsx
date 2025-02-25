'use client';

import { Import } from 'iconoir-react';
import DownloadTemplate from './DownloadTemplate';

import ImportCertificates from './Import/ImportCertificates';
import ImportCourses from './Import/Courses/Courses';
import ImportStudents from './Import/Students/Students';
import GenerateCertificates from './Import/GenerateCertificates';

const BulkImports = () => {
   return (
      <div className="flex-1 flex flex-col">
         <div className="flex justify-between items-center">
            <div className="font-semibold text-xl inline-flex tracking-tight items-center">
               <Import className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               Bulk Imports
            </div>
            <div className="flex items-center gap-2.5">
               <DownloadTemplate />
            </div>
         </div>
         <div className="mt-5 h-[1px] bg-zinc-50 rounded-2xl border border-zinc-200 p-10 flex flex-col flex-grow overflow-auto">
            <div className="mx-auto max-w-xl w-full flex flex-col gap-y-20">
               <ImportCertificates />
               <GenerateCertificates />
               <ImportCourses />
               <ImportStudents />
            </div>
         </div>
      </div>
   );
};

export default BulkImports;
