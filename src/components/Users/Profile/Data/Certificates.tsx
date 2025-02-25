'use client';

import ViewCertificateDialog from '@/components/PreviewCertificate/Dialog';
import VisualizationTable from '@/components/ui/VisualizationTable';
import { CertificateData } from '@/data/admin/users';
import useSelectable from '@/hooks/useSelectable';
import useUpdateHookstate from '@/hooks/useUpdateHookstate';
import {
   APIResponsePagination,
   TStudentTableCertificateData,
   TUserData,
   TVisualizationTableRootSchema,
   TWithPagination,
} from '@/lib/types';
import { FC, useMemo } from 'react';
import DeleteButton from './Buttons/CertificateDelete';

interface UserDataCertificatesProps {
   user: TUserData;
   certificates: TWithPagination<CertificateData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataCertificates: FC<UserDataCertificatesProps> = ({
   user,
   certificates,
   page,
   tables,
   error,
}) => {
   const certificatesData = useUpdateHookstate<TStudentTableCertificateData[]>(
      certificates.certificates
   );
   const certificatesPagination = useUpdateHookstate<
      APIResponsePagination | false
   >(certificates.pagination ?? false);

   const schema: TVisualizationTableRootSchema<TStudentTableCertificateData> =
      useMemo(
         () => ({
            __root: {
               render: (children, values) => {
                  return (
                     <ViewCertificateDialog
                        firstName={user.firstName}
                        lastName={user.lastName}
                        {...values}
                     >
                        {children}
                     </ViewCertificateDialog>
                  );
               },
            },
            userId: {
               hidden: true,
            },
            student: {
               hidden: true,
            },
         }),
         [user]
      );

   const selectable = useSelectable(certificatesData);

   return (
      <VisualizationTable
         name="Certificates"
         data={certificatesData}
         pagination={certificatesPagination}
         schema={schema}
         error={error}
         tables={tables}
         currentTable="Certificates"
         maxHeight="h-auto min-h-[20rem] max-h-[60rem]"
         buttons={[
            <DeleteButton
               key="deleteButton"
               certificates={certificatesData}
               selectable={selectable}
            />,
         ]}
         selectable={selectable}
      />
   );
};

export default UserDataCertificates;
