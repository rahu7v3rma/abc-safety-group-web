'use client';

import Logo from '@public/logo.webp';

import { zodResolver } from '@hookform/resolvers/zod';
import { WarningTriangle } from 'iconoir-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import z from 'zod';

import usePost from '@/hooks/usePost';
import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';

const forgotPasswordSchema = z.object({
   email: z
      .string()
      .min(1, {
         message: 'Required',
      })
      .email(),
});

type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
   const [sent, setSent] = useState<boolean>(false);

   const {
      register: registerForm,
      formState: { errors },
      handleSubmit,
      getValues,
   } = useForm<ForgotPasswordSchemaType>({
      resolver: zodResolver(forgotPasswordSchema),
   });

   const [forgotPost, loading, error] = usePost<{ email: string }, undefined>(
      'users',
      'forgot-password'
   );

   function forgot() {
      forgotPost(getValues(), {
         success: () => {
            setSent(true);
         },
      });
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
            Forgot password
         </h1>
         <form
            onSubmit={handleSubmit(forgot)}
            className="mt-10 md:mt-12 py-8 md:py-12 px-8 md:px-14 flex flex-col gap-y-6 sm:rounded-3xl sm:shadow-md bg-white w-full"
         >
            <Input
               type="email"
               label="Email address"
               error={errors.email}
               {...registerForm('email')}
            />
            <Button disabled={!!loading} type="submit" className="mt-2">
               {loading ? <Spinner className="w-5 h-5 mx-auto" /> : 'Send code'}
            </Button>
            {sent && (
               <div className="text-sm flex items-center justify-center -mt-2 text-center tracking-tight font-medium text-green-500">
                  A password reset link was sent to your email
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

export default ForgotPassword;
