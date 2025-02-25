'use client';

import z from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { Dispatch, FC, ReactNode, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';

import { hookstate } from '@hookstate/core';
import RegisterSteps from './Steps/Steps';
import RegisterStepsRender from './Steps/Render';
import RegisterStepDetails from './Steps/Step/Details';
import RegisterStepPhotos from './Steps/Step/Photos';

const newPasswordState = hookstate<boolean>(false);

export const registerDefaultValues: registerInformationSchemaType = {
   firstName: '',
   lastName: '',
   state: '',
   city: '',
   address: '',
   gender: '',
   eyeColor: '',
   height: {},
   dob: '',
   email: '',
   password: '',
   phoneNumber: '',
};

export const registerInformationSchema = z.object({
   // headShot: z.custom<File | undefined | string>(
   //    validateZodFile,
   //    'Headshot is required'
   // ),
   headShot: z.custom<File | string>().optional(),
   photoIdPhoto: z.custom<File | string>().optional(),
   otherIdPhoto: z.custom<File | string>().optional(),
   firstName: z.string().min(1, {
      message: 'First name is required',
   }),
   middleName: z.string().optional(),
   lastName: z.string().min(1, {
      message: 'Last name is required',
   }),
   suffix: z.string().optional(),
   email: z
      .string()
      .min(1, {
         message: 'Email is required',
      })
      .email({
         message: 'Email is invalid',
      }),
   phoneNumber: z
      .string()
      .refine((input) => input.trim().length === 10 && !isNaN(Number(input)), {
         message: 'Phone number is invalid',
      }),
   state: z.string().min(1, {
      message: 'State is required',
   }),
   city: z.string().min(1, {
      message: 'City is required',
   }),
   address: z.string().min(1, {
      message: 'Address is required',
   }),
   zipcode: z.coerce
      .number()
      .optional()
      .refine(
         (v) => {
            if (!v) {
               return false;
            }
            return true;
         },
         { message: 'Zip code is required' }
      ),
   eyeColor: z.string().min(1, {
      message: 'Eye color is required',
   }),
   gender: z.string().min(1, {
      message: 'Gender is required',
   }),
   height: z.object({
      feet: z.coerce
         .number()
         .optional()
         .refine(
            (v) => {
               if (v !== 0 && !v) {
                  return false;
               }
               return true;
            },
            { message: 'Feet is required' }
         ),
      inches: z.coerce
         .number()
         .optional()
         .refine(
            (v) => {
               if (v !== 0 && !v) {
                  return false;
               }
               return true;
            },
            { message: 'Inches is required' }
         ),
   }),
   dob: z
      .string({ errorMap: () => ({ message: 'Birth date is required' }) })
      .nonempty({ message: 'Birth date is required' }),
   password: z.coerce
      .string()
      .optional()
      .refine(
         (v) => {
            if (!newPasswordState.value && (!v || v.length < 2)) {
               return false;
            }
            return true;
         },
         { message: 'Password is required' }
      )
      .refine(
         (v) => {
            if (v && v.length < 4) {
               return false;
            }
            return true;
         },
         { message: 'Password too short' }
      ),
   expirationDate: z.date().optional(),
});

export type registerInformationSchemaType = z.infer<
   typeof registerInformationSchema
>;

interface RegisterFormProps {
   enableSteps: boolean;
   step?: number;
   setStep?: Dispatch<SetStateAction<number>>;
   form: UseFormReturn<registerInformationSchemaType, any, any>;
   noContainerStyles?: boolean;
   children?: ReactNode;
   newPassword?: boolean;
   stepError?:
      | {
           step: number;
           message: string;
        }
      | false;
   expirationDate?: boolean;
}

const RegisterForm: FC<RegisterFormProps> = ({
   enableSteps = false,
   step,
   setStep,
   noContainerStyles,
   form,
   children,
   newPassword,
   stepError = false,
   expirationDate = false,
}) => {
   useEffect(() => {
      newPasswordState.set(!!newPassword);
   }, [newPassword]);

   return (
      <div className="w-full">
         {enableSteps && <RegisterSteps step={step!} setStep={setStep!} />}
         <form
            className={clsx(
               'flex flex-col gap-y-5',
               noContainerStyles
                  ? ''
                  : 'mt-6 py-8 md:py-12 border border-zinc-200 px-8 md:px-14 sm:rounded-3xl sm:shadow-md bg-white w-full'
            )}
         >
            {enableSteps ? (
               <RegisterStepsRender
                  step={step!}
                  setStep={setStep!}
                  form={form}
                  newPassword={newPassword}
                  rootChildren={children}
                  stepError={stepError}
               />
            ) : (
               <>
                  <RegisterStepPhotos
                     enableSteps={enableSteps}
                     form={form}
                     stepError={stepError}
                  />
                  <RegisterStepDetails
                     enableSteps={enableSteps}
                     form={form}
                     newPassword={newPassword}
                     stepError={stepError}
                     expirationDate={expirationDate}
                  />
                  {children ? children : null}
               </>
            )}
         </form>
      </div>
   );
};

export default RegisterForm;
