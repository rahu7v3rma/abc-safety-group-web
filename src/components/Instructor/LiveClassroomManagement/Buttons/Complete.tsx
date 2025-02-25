import Spinner from '@/components/ui/Spinner';
import usePost from '@/hooks/usePost';
import { Check } from 'iconoir-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

const CompleteCourseButton = () => {
   const { id: courseId, seriesNumber } = useParams<{
      id: string;
      seriesNumber: string;
   }>();

   const router = useRouter();

   const [completeClassPost, completeClassPostLoading] = usePost<{}, any>(
      'courses',
      ['schedule', 'complete', courseId, seriesNumber]
   );

   const CompleteClass = useCallback(() => {
      toast.promise(
         completeClassPost(
            {},
            {
               success: router.refresh,
            },
            {
               throw: true,
            }
         ),
         {
            loading: 'Completing class...',
            success: 'Completed Class!',
            error: 'Failed completing class',
         }
      );
   }, [completeClassPost, router]);

   return (
      <button
         disabled={completeClassPostLoading}
         className="complete-button"
         onClick={CompleteClass}
      >
         Complete
         <span className="complete-button-icon-span">
            {completeClassPostLoading ? (
               <Spinner className="h-4 w-4" />
            ) : (
               <Check className="h-4 w-4" strokeWidth={2} />
            )}
         </span>
      </button>
   );
};

export default CompleteCourseButton;
