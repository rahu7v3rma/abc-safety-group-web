'use client';

import Button from '@/components/ui/Button';
import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import UploadInput from '@/components/ui/UploadInput';
import usePost from '@/hooks/usePost';
import { Check, MultiplePages, PageStar } from 'iconoir-react';
import { useState } from 'react';
import { toast } from 'sonner';

const ImportCertificates = () => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
   const [imported, setImported] = useState<boolean>(false);
   const [file, setFile] = useState<File>();

   const [onlyLMS, setOnlyLMS] = useState<boolean>(false);

   const [importCertificates, loading, error] = usePost<FormData, any>('data', [
      'import',
      'certificates',
   ]);

   function startImport() {
      const formData = new FormData();

      if (file) {
         formData.append('file', file);

         toast.promise(
            importCertificates(
               formData,
               {
                  fail: () => {
                     setImported(false);
                  },
                  success: () => {
                     setImported(true);
                  },
               },
               {
                  throw: true,
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               },
               {
                  onlyLMS,
               }
            ),
            {
               loading: 'Uploading certificates...',
               success: 'Certificates uploaded!',
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
            <PageStar
               className="h-6 w-6 text-zinc-400 mr-3.5"
               strokeWidth={2}
            />
            Import Certificates
         </p>
         <p className="mt-2.5 text-zinc-500">
            Upload a CSV or Excel file to bulk upload certificates
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
                     {!imported && (
                        <div className="mt-6">
                           <button
                              type="button"
                              onClick={remove}
                              className="py-2.5 text-sm px-4 rounded-xl bg-red-500 font-medium tracking-tight text-white"
                           >
                              Cancel
                           </button>
                        </div>
                     )}
                  </>
               )}
            />
         </div>
         <Confirmation
            title="Bulk import certificates"
            open={confirmationOpen}
            setDialogOpen={setConfirmationOpen}
            action={startImport}
            checkbox={{
               label: 'Only LMS',
               checked: onlyLMS,
               setChecked: setOnlyLMS,
            }}
         >
            <Button
               disabled={confirmationOpen || loading || !file || imported}
               className="mt-5"
            >
               {loading ? (
                  <div className="flex justify-center items-center">
                     <Spinner className="h-6 w-6 mr-2.5" /> Uploading...
                  </div>
               ) : imported ? (
                  <div className="flex justify-center items-center">
                     <Check className="h-6 w-6 mr-2.5" strokeWidth={2} />{' '}
                     Started Import
                  </div>
               ) : (
                  'Start Import'
               )}
            </Button>
         </Confirmation>
         {imported && (
            <div className="mt-5 text-green-500 font-medium text-center">
               Certificates successfully uploaded
               <br />
               All import progress updates will be sent to your email inbox.
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

export default ImportCertificates;
