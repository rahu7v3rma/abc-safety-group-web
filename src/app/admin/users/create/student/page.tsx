import StudentCreation from '@/components/Admin/Users/Create/Student/Creation';
import { isEnvTrue } from '@/lib/environment';

const AdminUsersCreateStudent = async () => {
   return (
      <StudentCreation
         uploadToTrainingConnect={isEnvTrue(
            process.env.ALLOW_TRAINING_CONNECT_UPLOAD_USER
         )}
      />
   );
};

export default AdminUsersCreateStudent;
