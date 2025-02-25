import VisualizationTableButtonDelete from '@/components/ui/VisualizationTable/Buttons/Delete';
import usePost from '@/hooks/usePost';
import { useParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

const ScheduleButtonDelete = () => {
   const router = useRouter();
   const params = useParams<{ id: string; seriesNumber: string }>();

   const [deletePost, deletePostLoading] = usePost<{}, { success: boolean }>(
      'courses',
      ['schedule', 'delete', params.id, params.seriesNumber],
   );

   const Delete = useCallback(() => {
      toast.promise(
         deletePost(
            {},
            {
               success: () => {
                  router.back();
                  router.refresh();
               },
            },
            { throw: true },
         ),
         {
            loading: 'Deleting schedule...',
            success: 'Schedule deleted',
            error: 'Failed deleting schedule',
         },
      );
   }, [deletePost, router]);

   return (
      <VisualizationTableButtonDelete
         confirmationTitle="Delete course schedule"
         confirmationAction={Delete}
         loading={deletePostLoading}
      />
   );
};

export default ScheduleButtonDelete;
