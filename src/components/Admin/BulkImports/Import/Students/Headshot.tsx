'use client';

import { convertFileToBase64 } from '@/lib/helpers';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

interface ImportStudentHeadshotProps {
   headShot: string | File;
   firstName: string;
   lastName: string;
}

const ImportStudentHeadshot: FC<ImportStudentHeadshotProps> = ({
   headShot,
   firstName,
   lastName,
}) => {
   const [Base64, setBase64] = useState<false | string>(false);

   useEffect(() => {
      async function ConvertFile() {
         const base64 = await convertFileToBase64(headShot as File);
         setBase64(base64);
      }
      if (headShot && headShot instanceof File) ConvertFile();
   }, [headShot]);

   function getSrc() {
      if (headShot) {
         if (Base64) {
            return Base64;
         } else {
            return '/noimage.png';
         }
      } else {
         return '/noimage.png';
      }
   }

   return (
      <Image
         alt={firstName + ' ' + lastName + "'s picture"}
         src={getSrc()}
         placeholder="blur"
         blurDataURL={`/_next/image?url=${getSrc()}&w=16&q=1`}
         width={100}
         height={100}
         className="w-14 h-14 animate-fadeIn object-cover mx-auto rounded-lg"
      />
   );
};

export default ImportStudentHeadshot;
