'use client';

import Confirmation from '@/components/ui/Confirmation';
import Input from '@/components/ui/Input';
import { useUser } from '@/contexts/user';
import { formatting, uncamelcase } from '@/lib/helpers';
import {
   TScheduleDetailsData,
   TUserContext,
   TUserContextForce,
   TWithOTT,
} from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Alarm, Page } from 'iconoir-react';
import { FC, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import usePost from '@/hooks/usePost';
import Signature from '@/components/ui/Signature';
import { toast } from 'sonner';
import Spinner from '../ui/Spinner';
import clsx from 'clsx';
import { useParams } from 'next/navigation';

export const scheduleSignInOutSchema = z.object({
   firstName: z.string().min(1, {
      message: 'First name is required',
   }),
   lastName: z.string().min(1, {
      message: 'Last name is required',
   }),
   email: z
      .string()
      .min(1, {
         message: 'Email is required',
      })
      .refine(
         (input) => {
            if (input && z.string().email().safeParse(input).success)
               return true;
            return false;
         },
         { message: 'Invalid email' },
      ),
   phoneNumber: z
      .string()
      .refine((input) => input.trim().length === 10 && !isNaN(Number(input)), {
         message: 'Phone number is invalid',
      }),
});

export type scheduleSignInOutSchemaType = z.infer<
   typeof scheduleSignInOutSchema
>;

type ScheduleSignInOutProps = {
   view: 'signIn' | 'signOut';
   schedule: TScheduleDetailsData;
   external?: boolean;
};

const ScheduleSignInOut: FC<TWithOTT<ScheduleSignInOutProps>> = ({
   view,
   schedule,
   external,
   ott,
}) => {
   const { user } = useUser<TUserContext>();
   const params = useParams<{ id: string; seriesNumber: string }>();

   const [submitConfirmation, setSubmitConfirmation] = useState<boolean>(false);

   const signatureCanvas = useRef<any>();
   const [signatureError, setSignatureError] = useState<false | string>(false);

   const [signInOut, signInOutLoading] = usePost<FormData, any>('forms', [
      'submit',
      view,
   ]);

   const {
      handleSubmit,
      register: registerForm,
      formState: { errors },
      getValues,
   } = useForm<scheduleSignInOutSchemaType>({
      resolver: zodResolver(scheduleSignInOutSchema),
      values: {
         firstName: user ? user.firstName : '',
         lastName: user ? user.lastName : '',
         email: user ? user.email : '',
         phoneNumber: user ? user.phoneNumber : '',
      },
   });

   const SignInOut = useCallback(() => {
      setSignatureError(false);

      if (signatureCanvas.current) {
         const canvas = signatureCanvas.current.getCanvas();

         canvas.toBlob((blob: any) => {
            const file = new File([blob], 'signature.png');

            const formData = new FormData();

            formData.append('signature', file);

            const values = getValues();

            toast.promise(
               signInOut(
                  formData,
                  {},
                  {
                     throw: true,
                     ott,
                  },
                  {
                     courseId: params.id,
                     seriesNumber: params.seriesNumber,
                     ...values,
                  },
               ),
               {
                  loading:
                     view === 'signIn' ? 'Signing in...' : 'Signing out...',
                  success: view === 'signIn' ? 'Signed in' : 'Signed out',
                  error: (e) => {
                     return e.message;
                  },
               },
            );
         });
      }
   }, [signatureCanvas]);

   return (
      <div className="flex flex-1 flex-col">
         <div className="flex items-center justify-between">
            <div className="inline-flex items-center text-xl font-semibold tracking-tight">
               <Page className="mr-4 h-8 w-8 text-blue-500" strokeWidth={2} />
               {schedule.courseName}
            </div>
            <p className="inline-flex items-center gap-2.5 font-medium">
               <Alarm className="h-5 w-5 text-zinc-400" strokeWidth={2} />
               {format(new Date(schedule.startTime), formatting)}
            </p>
         </div>
         <div
            className={clsx(
               'mt-5 flex flex-col overflow-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-10',
               !external ? 'h-[1px] flex-grow' : 'h-full',
            )}
         >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
               <div className="grid grid-cols-2 gap-5">
                  <Input
                     disabled={!!user}
                     label="First name"
                     {...registerForm('firstName')}
                     error={errors.firstName}
                  />
                  <Input
                     disabled={!!user}
                     label="Last name"
                     {...registerForm('lastName')}
                     error={errors.lastName}
                  />
               </div>
               <Input
                  disabled={!!user}
                  type="email"
                  label="Email"
                  {...registerForm('email')}
                  error={errors.email}
               />
               <Input
                  disabled={!!user}
                  label="Phone number"
                  {...registerForm('phoneNumber')}
                  error={errors.phoneNumber}
               />
               <Signature
                  wrapperClassName="mt-5"
                  ref={signatureCanvas}
                  error={signatureError}
                  setError={setSignatureError}
               />
               <Confirmation
                  title={uncamelcase(view)}
                  description="Make sure your signature is correct."
                  open={submitConfirmation}
                  setDialogOpen={setSubmitConfirmation}
                  severe={false}
                  action={SignInOut}
                  zIndex={10006}
               >
                  <button
                     onClick={handleSubmit((_) => {
                        if (signatureCanvas.current) {
                           if (signatureCanvas.current.isEmpty()) {
                              setSignatureError('Signature cannot be empty');
                           } else {
                              setSignatureError(false);
                              setSubmitConfirmation(true);
                           }
                        }
                     })}
                     className="mt-10 flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-center font-semibold tracking-tight text-white outline-none transition duration-200 ease-linear hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-75"
                  >
                     {uncamelcase(view)}
                     {!!signInOutLoading && (
                        <Spinner className="ml-2.5 h-5 w-5" />
                     )}
                  </button>
               </Confirmation>
            </div>
         </div>
      </div>
   );
};

export default ScheduleSignInOut;
