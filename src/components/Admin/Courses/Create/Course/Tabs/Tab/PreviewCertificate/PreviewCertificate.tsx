'use client';

import html2canvas from 'html2canvas';
import {
   Dispatch,
   FC,
   SetStateAction,
   useEffect,
   useRef,
   useState,
} from 'react';

import CourseCertificate from '@/components/ui/Certificate';
import Tooltip from '@/components/ui/Tooltip';
import { Download, PageStar } from 'iconoir-react';
import { useCertification } from '../Certification';
import { useGeneralInformation } from '../GeneralInformation';

interface CoursePreviewCertificateProps {
   tab: number;
   setTab: Dispatch<SetStateAction<number>>;
}

const CoursePreviewCertificate: FC<CoursePreviewCertificateProps> = ({
   tab,
   setTab,
}) => {
   const width = 1300;
   const height = 1000;

   const certification = useCertification((state) => state.data);
   const generalInformation = useGeneralInformation((state) => state.data);
   const certificateRef = useRef<HTMLDivElement>(null);
   const [image, setImage] = useState<string | false>(false);

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

   if (!certification.certificate)
      return (
         <div className="w-full h-full flex flex-col items-center justify-center">
            <PageStar className="h-12 w-12 opacity-25" strokeWidth={1.5} />
            <p className="mt-8 text-xl font-semibold tracking-tight">
               Certificate disabled
            </p>
            <p className="mt-2.5 text-base tracking-tight text-zinc-500">
               You disabled certificate in the certification tab.
            </p>
         </div>
      );

   return image ? (
      <div className="relative w-full h-full flex items-center justify-center">
         <div className="relative">
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
      </div>
   ) : (
      <>
         <p>Loading...</p>
         <CourseCertificate
            ref={certificateRef}
            width={width}
            height={height}
            student="John Doe"
            instructor="Jane Doe"
            certificateName={
               certification.certificateName!.length
                  ? certification.certificateName!
                  : `${
                       generalInformation.courseCode &&
                       generalInformation.courseCode + ', '
                    }${generalInformation.courseName}`
            }
            completionDate={new Date(
               new Date().getFullYear(),
               new Date().getMonth() + 1,
               1
            ).toLocaleDateString()}
         />
      </>
   );
};

export default CoursePreviewCertificate;
