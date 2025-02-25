'use client';

import { forwardRef } from 'react';

interface CourseCertificateProps {
   width: number;
   height: number;
   student?: string;
   certificateName?: string;
   instructor?: string;
   completionDate?: string;
   certificateNumber?: string;
}

const CourseCertificate = forwardRef<HTMLDivElement, CourseCertificateProps>(
   (
      {
         width,
         height,
         student,
         certificateName,
         instructor,
         completionDate,
         certificateNumber,
      },
      ref
   ) => {
      return (
         <div
            className="flex flex-col"
            ref={ref}
            style={{
               position: 'absolute',
               left: '-30000px',
               pointerEvents: 'none',
               zIndex: '-1',
               width,
               height,
            }}
         >
            <div className="flex-1 flex flex-col border-[35px] border-abc_darkblue">
               <div className="flex-1 flex flex-col justify-between py-[10px] px-[35px] border-[35px] border-abc_orange">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <img
                           width="131.74"
                           height="116"
                           src="/certificate/img/logo.png"
                        />
                        <div className="text-center ml-[20px]">
                           <p className="text-base font-semibold leading-6">
                              147 Prince Street
                              <br />
                              Brooklyn, NY 11201 <br />
                              info@ABCSafetyGroup.com
                              <br />
                              718-307-8133
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-semibold">
                           NYC DOB COURSE PROVIDER ID: 4Q01
                        </p>
                        <p className="mt-[10px] text-2xl font-semibold">
                           PROGRAM ADMINISTRATOR:
                           <img
                              className="inline-block"
                              width="135"
                              height="47.48"
                              src="/certificate/img/handsign.png"
                           />
                        </p>
                     </div>
                  </div>
                  <div className="text-center max-w-3xl w-full mx-auto">
                     <p className="text-5xl font-semibold text-abc_blue">
                        CERTIFICATE OF COMPLETION
                     </p>
                     <p className="text-4xl font-medium mt-[20px]">
                        THIS CERTIFIES THAT
                     </p>
                     <p className="text-4xl font-semibold mt-[15px]">
                        {student}
                     </p>
                     <p className="text-2xl font-medium mt-[15px]">
                        has successfully completed the training program
                        requirement for
                     </p>
                     <p className="text-4xl font-semibold mt-[10px]">
                        {certificateName}
                     </p>
                     <div className="mt-[25px] flex justify-between">
                        <div className="min-w-[16rem] w-auto">
                           <p className="text-2xl font-medium">
                              {completionDate}
                           </p>
                           <hr className="w-full border-t-2 mt-[10px] mb-[10px] border-black" />
                           <p className="text-sm">COURSE COMPLETION DATE</p>
                        </div>
                        <div className="min-w-[16rem] w-auto">
                           <p className="text-2xl">{instructor}</p>

                           <hr className="w-full border-t-2 mt-[15px] mb-[10px] border-black" />
                           <p className="text-sm">DOB AUTHORIZED INSTRUCTOR</p>
                        </div>
                     </div>
                     <p className="mt-[20px] leading-8 italic">
                        In accordance with New York City Building Code Section
                        3302.1 and 3321 (Local Law 196 of 2017).
                        <br />
                        This certification provides Site Safety Training Credits
                        which may be used to obtain an SST card.
                     </p>
                  </div>
                  <div className="flex items-end justify-between">
                     <p className="text-3xl font-semibold mb-[30px]">
                        CERTIFICATE #:
                        <span className="font-normal">{certificateNumber}</span>
                     </p>
                     <img
                        width="182.74"
                        height="117.75"
                        src="/certificate/img/authorized.png"
                     />
                  </div>
               </div>
            </div>
         </div>
      );
   }
);

export default CourseCertificate;
