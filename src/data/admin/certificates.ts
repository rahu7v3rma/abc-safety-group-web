import { filterObjectToQueries } from '@/lib/helpers';
import { pageSize } from '@/lib/pagination';
import { TAdminTableCertficateData } from '@/lib/types';
import fetchData from '../fetch';

async function getCerficatesList(page?: number) {
   type AdminCertificatesData = { certificates: TAdminTableCertficateData[] };

   const queries = filterObjectToQueries({
      page: page || 1,
      pageSize,
   });

   return fetchData<AdminCertificatesData, true>(
      'users/certificates/list' + queries
   );
}

export { getCerficatesList };
