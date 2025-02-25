import CertificatesGenerate from '@/components/Admin/Certificates/Generate';
import { isEnvTrue } from '@/lib/environment';

export default async function AdminCertificatesGenerate() {
   return (
      <CertificatesGenerate
         uploadToTrainingConnect={isEnvTrue(
            process.env.ALLOW_TRAINING_CONNECT_UPLOAD_CERTIFICATE
         )}
      />
   );
}
