import * as adminCertificatesData from '@/data/admin/certificates';

import AdminCertificatesTable from '@/components/Admin/Certificates/Table';

export default async function AdminCertificatesManagement({
   searchParams,
}: {
   searchParams: { [key: string]: string | string[] | undefined };
}) {
   const page = parseInt(searchParams.page as string) || 1;

   const certificates = await adminCertificatesData.getCerficatesList(page);

   return (
      <AdminCertificatesTable
         data={certificates.success ? certificates.payload.certificates : []}
         pagination={
            certificates.success ? certificates.payload.pagination : false
         }
         error={!certificates.success ? certificates.message : false}
         page={page}
      />
   );
}
