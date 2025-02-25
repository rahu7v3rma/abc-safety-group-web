'use client';

import Button from '@/components/ui/Button';
import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import UploadInput from '@/components/ui/UploadInput';
import usePost from '@/hooks/usePost';
import { downloadZIP } from '@/lib/helpers';
import { Check, DownloadCircle, MultiplePages } from 'iconoir-react';
import { useState } from 'react';
import { toast } from 'sonner';

const GenerateCertificates = () => {
   const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
   const [generated, setGenerated] = useState<boolean>(false);
   const [file, setFile] = useState<File>();

   const [generateCertificates, loading, error] = usePost<FormData, any>(
      'data',
      ['download', 'certificates']
   );

   function startGenerate() {
      const formData = new FormData();

      if (file) {
         formData.append('file', file);

         toast.promise(
            generateCertificates(
               formData,
               {
                  fail: () => {
                     setGenerated(false);
                  },
                  success: (body) => {
                     setGenerated(true);
                     downloadZIP('certificates', body);
                  },
               },
               {
                  throw: true,
                  responseType: 'arraybuffer',
                  headers: {
                     'Content-Type': 'multipart/form-data',
                  },
               }
            ),
            {
               loading: 'Generating certificates...',
               success: 'Certificates downloaded!',
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
            <DownloadCircle
               className="h-6 w-6 text-zinc-400 mr-3.5"
               strokeWidth={2}
            />
            Generate Certificates
         </p>
         <p className="mt-2.5 text-zinc-500">
            Upload a CSV or Excel file to download bulk generated certificates.
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
                              setGenerated(false);
                              setFile(undefined);
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
            title="Download bulk generated certificates"
            open={confirmationOpen}
            setDialogOpen={setConfirmationOpen}
            action={startGenerate}
         >
            <Button
               disabled={confirmationOpen || loading || !file || generated}
               className="mt-5"
            >
               {loading ? (
                  <div className="flex justify-center items-center">
                     <Spinner className="h-6 w-6 mr-2.5" /> Generating...
                  </div>
               ) : generated ? (
                  <div className="flex justify-center items-center">
                     <Check className="h-6 w-6 mr-2.5" strokeWidth={2} />{' '}
                     Generated
                  </div>
               ) : (
                  'Generate'
               )}
            </Button>
         </Confirmation>
         {generated && (
            <div className="mt-5 text-green-500 font-medium text-center">
               Bulk certificates successfully downloaded
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

export default GenerateCertificates;
