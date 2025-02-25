import CourseCertificate from '@/components/ui/Certificate';
import Spinner from '@/components/ui/Spinner';
import Tooltip from '@/components/ui/Tooltip';
import { TAdminTableCertficateData } from '@/lib/types';
import html2canvas from 'html2canvas';
import { Download } from 'iconoir-react';
import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';

const ViewCertificate: FC<
   Omit<TAdminTableCertficateData, 'headShot'> & {
      image: string | false;
      setImage: Dispatch<SetStateAction<string | false>>;
   }
> = ({ image, setImage, ...certificate }) => {
   const width = 1300;
   const height = 1000;

   const certificateRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      async function renderImage(element: HTMLDivElement) {
         const canvas = await html2canvas(element, {
            width,
            height,
         });

         const data = canvas.toDataURL('image/jpg');

         setImage(data);
      }
      if (certificateRef.current) {
         renderImage(certificateRef.current);
      }
   }, [certificateRef]);

   const downloadImage = () => {
      if (image) {
         const a = document.createElement('a');
         a.href = image;
         a.download = 'certificate.png';
         a.click();
      }
   };

   if (image) {
      return (
         <div className="relative mt-5">
            <img src={image} className="w-auto h-auto object-cover" />
            <Tooltip content="Download Certificate">
               <button
                  onClick={downloadImage}
                  className="absolute bg-blue-500 transition duration-200 ease-linear hover:bg-blue-600 p-3 rounded-bl-2xl text-white top-0 right-0"
               >
                  <Download className="h-7 w-7" strokeWidth={2} />
               </button>
            </Tooltip>
         </div>
      );
   } else {
      return (
         <>
            <div className="w-full flex flex-col items-center justify-center">
               <p className="text-lg font-medium tracking-tight text-blue-500">
                  Generating Certificate...
               </p>
               <Spinner className="mt-10 h-12 w-12 text-blue-500" />
            </div>
            <CourseCertificate
               ref={certificateRef}
               width={width}
               height={height}
               student={certificate.firstName + ' ' + certificate.lastName}
               {...certificate}
            />
         </>
      );
   }
};
export default ViewCertificate;
