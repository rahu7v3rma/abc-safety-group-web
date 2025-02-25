'use client';

import clsx from 'clsx';
import { Dispatch, FC, SetStateAction } from 'react';

export const steps = ['Details', 'Photos'];

interface RegisterStepsProps {
   step: number;
   setStep: Dispatch<SetStateAction<number>>;
}

const RegisterSteps: FC<RegisterStepsProps> = ({
   step: currentStep,
   setStep,
}) => {
   function conditionalHighlight(stepIndex: number) {
      return currentStep === stepIndex || stepIndex < currentStep;
   }

   return (
      <div
         className="mt-10 px-4 grid gap-2.5"
         style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
         }}
      >
         {steps.map((step, stepIndex) => (
            <div key={stepIndex}>
               <button
                  disabled={stepIndex > currentStep}
                  onClick={() => setStep(stepIndex)}
                  className={clsx(
                     'font-medium text-sm disabled:cursor-not-allowed',
                     conditionalHighlight(stepIndex)
                        ? 'text-blue-500'
                        : 'text-zinc-400'
                  )}
               >
                  {stepIndex + 1}.&nbsp;&nbsp;{step}
               </button>
               <div
                  className={clsx(
                     'mt-2.5 w-full h-[8px] rounded-full',
                     conditionalHighlight(stepIndex)
                        ? 'bg-blue-500'
                        : 'bg-zinc-300'
                  )}
               ></div>
            </div>
         ))}
      </div>
   );
};

export default RegisterSteps;
