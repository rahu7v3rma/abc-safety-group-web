import Dialog from '@/components/ui/Dialog';
import { TAdminTableCertficateData } from '@/lib/types';
import React, { FC, PropsWithChildren, useState } from 'react';
import ViewCertificate from './Certificate';
import Link from 'next/link';

const ViewCertificateDialog: FC<
   PropsWithChildren<Omit<TAdminTableCertficateData, 'headShot'>>
> = ({ children, ...certificate }) => {
   const [showCertificate, setShowCertificate] = useState<boolean>(false);
   const [image, setImage] = useState<string | false>(false);

   return (
      <>
         <Dialog
            open={showCertificate}
            onOpenChange={setShowCertificate}
            contentClassName="max-w-[800px]"
         >
            <ViewCertificate
               image={image}
               setImage={setImage}
               {...certificate}
            />
         </Dialog>
         <Link
            href="#"
            onClick={() => setShowCertificate(true)}
            className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
         >
            {children}
         </Link>
      </>
   );
};

export default ViewCertificateDialog;
