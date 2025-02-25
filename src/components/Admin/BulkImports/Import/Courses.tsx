'use client';

import Button from '@/components/ui/Button';
import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import UploadInput from '@/components/ui/UploadInput';
import usePost from '@/hooks/usePost';
import { Check, Folder, MultiplePages } from 'iconoir-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ImportCourses = () => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
   const [imported, setImported] = useState<boolean>(false);
   const [file, setFile] = useState<File>();
   const [succeeded, setSucceeded] = useState<false | number>(false);
   const [fails, setFails] = useState<false | any[]>(false);

   const [importCourses, loading, error] = usePost<
      FormData,
      { succeeded: number; courses: any[] }
   >('data', ['import', 'courses']);

   function startImport() {
      const formData = new FormData();

      if (file) {
         formData.append('file', file);

         toast.promise(
            importCourses(
               formData,
               {
                  success: ({ succeeded }) => {
                     setImported(true);
                     setSucceeded(succeeded);
                  },
                  fail: (message, payload) => {
                     if (payload) {
                        setImported(true);
                        setSucceeded(payload.succeeded);
                        setFails(payload.courses);
                     }
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
               loading: 'Importing courses...',
               success: 'Courses imported!',
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
            <Folder className="h-6 w-6 text-zinc-400 mr-3.5" strokeWidth={2} />
            Import Courses
         </p>
         <p className="mt-2.5 text-zinc-500">
            Upload a CSV or Excel file to bulk generate courses.
         </p>
         <div className="mt-10">
            <UploadInput
               asFile={true}
               accept=".csv,.xls,.xlsx"
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
                              setImported(false);
                              setFails(false);
                              setSucceeded(false);
                              remove();
                           }}
                           className="py-2.5 text-sm px-4 rounded-xl bg-red-500 font-medium tracking-tight text-white"
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
         >
            <Button
               disabled={confirmationOpen || loading || !file || imported}
               className="mt-5"
            >
               {loading ? (
                  <div className="flex justify-center items-center">
                     <Spinner className="h-6 w-6 mr-2.5" /> Importing...
                  </div>
               ) : imported ? (
                  <div className="flex justify-center items-center">
                     <Check className="h-6 w-6 mr-2.5" strokeWidth={2} />{' '}
                     Imported
                  </div>
               ) : (
                  'Start Import'
               )}
            </Button>
         </Confirmation>
         {imported && !!succeeded && succeeded > 0 && (
            <div className="mt-5 text-green-500 font-medium text-center">
               {succeeded} Courses successfully imported
            </div>
         )}
         {fails && (
            <div className="mt-5">
               <p className="font-medium text-red-500 text-center">
                  {fails.length} courses failed to import
               </p>
               <div className="mt-5 grid grid-cols-2 gap-5">
                  {fails.map((course, courseIndex) => (
                     <div
                        key={courseIndex}
                        className="bg-white p-5 rounded-2xl border border-zinc-200"
                     >
                        <p className="text-blue-500">{course.course_code}</p>
                        <p className="mt-1 font-medium text-lg">
                           {course.course_name}
                        </p>
                        <p className="mt-2.5">{course.first_class_dtm}</p>
                        <p className="mt-2.5 text-red-500 tracking-tight font-medium">
                           {course.reason}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         )}
         {error && (
            <div className="mt-5 text-red-500 font-medium text-center">
               {error}
            </div>
         )}
      </div>
   );
};

export default ImportCourses;
