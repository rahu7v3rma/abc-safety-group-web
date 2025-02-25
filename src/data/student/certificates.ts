import { TStudentTableCertificateData } from '@/lib/types';
import fetchData from '../fetch';
import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';

async function getMyCertificates(page?: number) {
   type StudentCertificatesData = {
      certificates: TStudentTableCertificateData[];
   };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<StudentCertificatesData, true>(
      'users/my-certificates' + queries
   );
}

export { getMyCertificates };
