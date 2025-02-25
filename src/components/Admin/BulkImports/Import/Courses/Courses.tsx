'use client';

import { BookStack, MultiplePages } from 'iconoir-react';
import { useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/ui/Button';
import Confirmation from '@/components/ui/Confirmation';
import UploadInput from '@/components/ui/UploadInput';
import usePost from '@/hooks/usePost';
import { TBulkImportsCourse } from '@/lib/types';
import { useHookstate } from '@hookstate/core';
import CoursesImportDialog from './ImportsDialog';

const ImportCourses = () => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
   const [file, setFile] = useState<File>();
   const courses = useHookstate<TBulkImportsCourse[]>([]);

   const [showCoursesDialog, setShowCoursesDialog] = useState<boolean>(false);

   const [uploadCourses, loading, error] = usePost<
      FormData,
      { courses: TBulkImportsCourse[] }
   >('data', ['import', 'courses', 'upload']);

   function startImport() {
      const formData = new FormData();

      if (file) {
         formData.append('file', file);

         setShowCoursesDialog(false);
         courses.set([]);

         toast.promise(
            uploadCourses(
               formData,
               {
                  success: ({ courses: uploadCourses }) => {
                     courses.set(
                        uploadCourses.map(
                           (uploadCourse, uploadCourseIndex) => ({
                              ...uploadCourse,
                              courseIndex: uploadCourseIndex,
                           })
                        )
                     );
                     setShowCoursesDialog(true);
                  },
                  fail: (message, payload) => {
                     console.log(message, payload);
                  },
               },
               {
                  throw: true,
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               }
            ),
            {
               loading: 'Parsing courses...',
               success: 'Courses parsed!',
               error: (e) => {
                  return e.message;
               },
            }
         );
      }
   }

   return (
      <div>
         <p className="inline-flex items-center font-medium tracking-tight text-xl">
            <BookStack
               className="h-6 w-6 text-zinc-400 mr-3.5"
               strokeWidth={2}
            />
            Import Courses
         </p>
         <p className="mt-2.5 text-zinc-500">
            Upload a CSV or Excel file to bulk generate courses.
         </p>
         <div className="mt-10">
            <UploadInput
               asFile={true}
               accept=".xls,.xlsx"
               value={file}
               onChange={setFile}
               render={(selectedContent, remove) => (
                  <>
                     <span className="h-14 w-14 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        <MultiplePages className="w-7 h-7" strokeWidth={1.5} />
                     </span>
                     <p className="mt-6 text-zinc-600 max-w-[22rem] truncate font-medium underline">
                        {selectedContent.contentName}
                     </p>
                     <p className="mt-2 tracking-tight text-sm text-zinc-400 font-medium">
                        {selectedContent.content.match(
                           /^data:(.*);base64,/
                        )?.[1] || '?'}
                     </p>
                     <div className="mt-6">
                        <button
                           type="button"
                           onClick={() => {
                              remove();
                           }}
                           className="py-2.5 text-sm px-4 rounded-xl bg-red-500 transition duration-200 ease-linear hover:bg-red-600 font-medium tracking-tight text-white"
                        >
                           Cancel
                        </button>
                     </div>
                  </>
               )}
            />
         </div>
         <Confirmation
            title="Bulk import courses"
            open={confirmationOpen}
            setDialogOpen={setConfirmationOpen}
            action={startImport}
            severe={false}
         >
            <Button
               disabled={confirmationOpen || loading || !file}
               className="mt-5"
            >
               Upload
            </Button>
         </Confirmation>
         {error && (
            <div className="mt-5 text-red-500 font-medium text-center">
               {error}
            </div>
         )}
         <CoursesImportDialog
            courses={courses}
            showCoursesDialog={showCoursesDialog}
            setShowCoursesDialog={setShowCoursesDialog}
         />
      </div>
   );
};

export default ImportCourses;
