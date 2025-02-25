'use client';

import { Dispatch, FC, ReactNode, SetStateAction } from 'react';

import { registerInformationSchemaType } from '../Form';
import { UseFormReturn } from 'react-hook-form';
import RegisterStepDetails from './Step/Details';
import RegisterStepPhotos from './Step/Photos';

const steps = [RegisterStepDetails, RegisterStepPhotos];

interface RegisterStepsRenderProps {
   step: number;
   setStep: Dispatch<SetStateAction<number>>;
   form: UseFormReturn<registerInformationSchemaType, any, any>;
   newPassword?: boolean;
   rootChildren?: ReactNode;
   stepError:
      | {
           step: number;
           message: string;
        }
      | false;
}

const RegisterStepsRender: FC<RegisterStepsRenderProps> = ({
   step,
   setStep,
   form,
   newPassword,
   rootChildren,
   stepError,
}) => {
   if (step > steps.length - 1) return null;

   const CurrentStep = steps[step];

   return (
      <CurrentStep
         enableSteps={true}
         step={step}
         setStep={setStep}
         form={form}
         newPassword={newPassword}
         rootChildren={rootChildren}
         stepError={stepError}
      />
   );
};

export default RegisterStepsRender;
