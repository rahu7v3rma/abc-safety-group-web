import { CertificateData } from '@/data/admin/users';
import { TUserData, TWithPagination } from '@/lib/types';
import { FC } from 'react';
import UserDataCertificates from './Certificates';

interface UserDataProps {
   user: TUserData;
   data: 'certificates';
   certificates?: TWithPagination<CertificateData>;
   page: number;
   tables?: string[];
   error?: false | string;
}

const UserDataRender: FC<UserDataProps> = ({
   user,
   data,
   certificates,
   page,
   tables,
   error,
}) => {
   const props = {
      user,
      page,
      tables,
      error,
   };
   if (data === 'certificates' && certificates) {
      return <UserDataCertificates certificates={certificates} {...props} />;
   }
};

const UserData: FC<UserDataProps> = ({
   user,
   data,
   certificates,
   page,
   tables,
   error,
}) => {
   return (
      <>
         <div className="mt-14 mb-8 flex items-center gap-5">
            <p className="text-sm font-medium text-zinc-400">USER DATA</p>
            <div className="flex-1 border-t border-zinc-200" />
         </div>
         <UserDataRender
            user={user}
            data={data}
            certificates={certificates}
            page={page}
            tables={tables}
            error={error}
         />
      </>
   );
};

export default UserData;
