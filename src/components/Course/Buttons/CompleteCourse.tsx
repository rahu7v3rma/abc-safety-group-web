'use client';

import Confirmation from '@/components/ui/Confirmation';
import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { Check } from 'iconoir-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

const CompleteCourseButton: FC = ({}) => {
   const [openConfirmation, setOpenConfirmation] = useState(false);

   const [generateCertificates, setGenerateCertificates] = useState(false);
   const [uploadToTrainingConnect, setUploadToTrainingConnect] =
      useState(false);

   const { id: courseId } = useParams<{ id: string }>();

   const pathWithQueryParams = useMemo(() => {
      let queryParams: any = {};
      if (generateCertificates) {
         queryParams.generateCertificates = true;
      }
      if (uploadToTrainingConnect) {
         queryParams.uploadCertificates = true;
      }
      queryParams = new URLSearchParams(queryParams).toString();
      return courseId + (queryParams ? '?' + queryParams : '');
   }, [generateCertificates, courseId, uploadToTrainingConnect]);

   const [completeCoursePost, completeCoursePostLoading] = usePost<{}, any>(
      'courses',
      ['complete', pathWithQueryParams]
   );

   const router = useRouter();

   const CompleteCourse = useCallback(() => {
      toast.promise(
         completeCoursePost(
            {},
            {
               success: router.refresh,
            },
            { throw: true }
         ),
         {
            loading: 'Completing course...',
            success: 'Completed course',
            error: 'Failed completing course',
         }
      );
   }, [completeCoursePost, router]);

   return (
      <Confirmation
         title={'Complete course'}
         open={openConfirmation}
         setDialogOpen={setOpenConfirmation}
         action={CompleteCourse}
         description="Completing a course will also mark all of its scheduled classes as complete."
      >
         <div className="flex items-center gap-2.5">
            <button
               disabled={completeCoursePostLoading}
               className="px-5 w-36 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-green-800 font-semibold text-sm py-2 bg-gradient-to-b from-green-400 to-green-500 rounded-2xl shadow-inner-green gap-2"
               onClick={() => setOpenConfirmation(true)}
            >
               Complete
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-green-600 rounded-[0.6rem]">
                  {completeCoursePostLoading ? (
                     <Spinner className="h-4 w-4" />
                  ) : (
                     <Check className="h-4 w-4" strokeWidth={2} />
                  )}
               </span>
            </button>
         </div>
      </Confirmation>
   );
};

export default CompleteCourseButton;
