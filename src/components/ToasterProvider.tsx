'use client';

import { Toaster } from 'sonner';

const ToasterProvider = () => {
   return (
      <Toaster
         expand={true}
         position="bottom-center"
         toastOptions={{ className: '!rounded-xl !text-base !px-5' }}
         closeButton
         offset="40px"
      />
   );
};

export default ToasterProvider;
