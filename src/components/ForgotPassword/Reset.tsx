'use client';

import Logo from '@public/logo.webp';

import { zodResolver } from '@hookform/resolvers/zod';
import { WarningTriangle } from 'iconoir-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import z from 'zod';

import usePost from '@/hooks/usePost';
import { FC, useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Link from '../ui/Link';
import Spinner from '../ui/Spinner';

const resetPasswordSchema = z
   .object({
      password: z.string().min(1, {
         message: 'Required',
      }),
      confirmPassword: z
         .string()
         .min(1, {
            message: 'Required',
         })
         .min(4, {
            message: 'Password too short',
         }),
   })
   .refine((schema) => schema.confirmPassword === schema.password, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
   });

type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordProps {
   code: string;
}

const ResetPassword: FC<ResetPasswordProps> = ({ code }) => {
   const [resetted, setResetted] = useState<boolean>(false);

   const {
      register: registerForm,
      formState: { errors },
      handleSubmit,
      getValues,
   } = useForm<ResetPasswordSchemaType>({
      resolver: zodResolver(resetPasswordSchema),
   });

   const [resetPost, loading, error] = usePost<
      { newPassword: string },
      undefined
   >('users', ['forgot-password', code]);

   function reset() {
      resetPost(
         {
            newPassword: getValues().password,
         },
         {
            success: () => {
               setResetted(true);
            },
         }
      );
   }

   return (
      <div className="mx-auto max-w-xl w-full flex flex-col items-center">
         <Image
            src={Logo}
            alt="Logo"
            width={300}
            height={300}
            className="w-16 md:w-20 animate-fadeIn"
         />
         <h1 className="mt-5 text-2xl text-center sm:text-3xl font-semibold tracking-tight">
            Reset password
         </h1>
         <form
            onSubmit={handleSubmit(reset)}
            className="mt-10 md:mt-12 py-8 md:py-12 px-8 md:px-14 flex flex-col gap-y-6 sm:rounded-3xl sm:shadow-md bg-white w-full"
         >
            <Input
               type="password"
               label="Password"
               error={errors.password}
               {...registerForm('password')}
            />
            <Input
               type="password"
               label="Confirm password"
               error={errors.confirmPassword}
               {...registerForm('confirmPassword')}
            />
            <Button disabled={!!loading} type="submit" className="mt-2">
               {loading ? <Spinner className="w-5 h-5 mx-auto" /> : 'Reset'}
            </Button>
            {resetted && (
               <div className="text-sm flex items-center justify-center -mt-2 text-center tracking-tight font-medium text-green-500">
                  Your password was successfully reset,{' '}
                  <Link href="/login" className="text-sm ml-1">
                     Login
                  </Link>
               </div>
            )}
            {error && (
               <div className="text-sm flex items-center justify-center -mt-2 text-center font-medium text-red-500">
                  <WarningTriangle className="h-4 w-4 mr-2" strokeWidth={2} />
                  {error}
               </div>
            )}
         </form>
      </div>
   );
};

export default ResetPassword;
