'use client';

import { Dispatch, FC, ReactNode, SetStateAction, useMemo } from 'react';
import { UseFormReturn, useController } from 'react-hook-form';
import { registerInformationSchemaType } from '../../Form';
import UploadInput from '@/components/ui/UploadInput';
import { steps } from '../Steps';

interface RegisterStepPhotosProps {
   enableSteps: boolean;
   step?: number;
   setStep?: Dispatch<SetStateAction<number>>;
   form: UseFormReturn<registerInformationSchemaType, any, any>;
   rootChildren?: ReactNode;
   stepError:
      | {
           step: number;
           message: string;
        }
      | false;
}

const RegisterStepPhotos: FC<RegisterStepPhotosProps> = ({
   enableSteps,
   step,
   setStep,
   form: {
      register: registerForm,
      formState: { errors },
      control,
   },
   rootChildren,
   stepError,
}) => {
   const {
      field: { value: headShotValue, onChange: headShotOnChange },
   } = useController({ name: 'headShot', control });
   const {
      field: { value: governmentValue, onChange: governmentOnChange },
   } = useController({ name: 'photoIdPhoto', control });
   const {
      field: { value: sstValue, onChange: sstOnChange },
   } = useController({ name: 'otherIdPhoto', control });

   const error = useMemo(() => {
      if (stepError && stepError.step === steps.indexOf('Photos')) {
         return stepError.message;
      }
      return false;
   }, [stepError]);

   return (
      <>
         <UploadInput
            asFile={true}
            key="headshot"
            label="Headshot"
            accept=".png,.jpg,.jpeg"
            value={headShotValue}
            required={false}
            onChange={headShotOnChange}
            error={errors.headShot}
            router="users"
         />
         <UploadInput
            asFile={true}
            key="government"
            label="Government ID"
            accept=".png,.jpg,.jpeg"
            value={governmentValue}
            onChange={governmentOnChange}
            error={errors.photoIdPhoto}
            required={false}
            router="users"
         />
         <UploadInput
            asFile={true}
            key="sst"
            label="SST ID"
            accept=".png,.jpg,.jpeg"
            required={false}
            value={sstValue}
            onChange={sstOnChange}
            error={errors.otherIdPhoto}
            router="users"
         />
         <div className="mt-2.5 flex flex-col gap-y-5">
            {rootChildren ? rootChildren : null}
            {!!error && (
               <div className="text-red-500 font-medium text-center">
                  {error}
               </div>
            )}
         </div>
      </>
   );
};

export default RegisterStepPhotos;
