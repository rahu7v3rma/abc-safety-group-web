'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { WarningTriangle } from 'iconoir-react';
import Cookie from 'js-cookie';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import z from 'zod';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from '@/components/ui/Link';
import Spinner from '@/components/ui/Spinner';
import config from '@/config';
import { useRoles } from '@/contexts/roles';
import { useUser } from '@/contexts/user';
import usePost from '@/hooks/usePost';
import { redirectRolePanel } from '@/lib/role';
import { TRoleData, TUserContext, TUserData } from '@/lib/types';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
   email: z
      .string()
      .min(1, {
         message: 'Email is required',
      })
      .email(),
   password: z.string().min(1, {
      message: 'Password is required',
   }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

const LoginPage = () => {
   const { updateUser } = useUser<TUserContext>();
   const { updateRoles } = useRoles();

   const {
      register: registerForm,
      formState: { errors },
      handleSubmit,
      getValues,
   } = useForm<LoginSchemaType>({
      resolver: zodResolver(loginSchema),
   });

   const router = useRouter();

   const [loginPost, loading, error] = usePost<
      LoginSchemaType,
      { sessionId: string; user: TUserData; roles: TRoleData[] }
   >('users', 'login');

   function login() {
      loginPost(getValues(), {
         success: ({ sessionId, user, roles }) => {
            Cookie.set(
               process.env.NEXT_PUBLIC_COOKIE_NAME as string,
               sessionId
            );
            updateUser(user);
            updateRoles(roles);
            redirectRolePanel(roles, router);
         },
      });
   }

   return (
      <main className="my-auto w-full pt-8 pb-0 px-0 sm:p-8">
         <div className="mx-auto max-w-xl w-full flex  flex-col items-center">
            <Image
               src={config.logo}
               alt="Logo"
               width={300}
               height={300}
               className="w-16 md:w-20 animate-fadeIn"
            />
            <h1 className="mt-5 text-2xl text-center sm:text-3xl font-semibold tracking-tight">
               Log in to your account
            </h1>
            {/* <p className="mt-2 sm:mt-4 text-center text-sm text-zinc-500">
               Don&apos;t have an account?{' '}
               <Link href="/register">Register</Link>
            </p> */}
            <form
               onSubmit={handleSubmit(login)}
               className="mt-10 py-8 md:py-12 px-8 md:px-14 flex flex-col gap-y-6 sm:rounded-3xl sm:shadow-md border border-zinc-200 bg-white w-full"
            >
               <Input
                  type="email"
                  label="Email address"
                  error={errors.email}
                  {...registerForm('email')}
               />
               <Input
                  type="password"
                  label="Password"
                  error={errors.password}
                  {...registerForm('password')}
               />
               <Button disabled={!!loading} type="submit" className="mt-2">
                  {loading ? <Spinner className="w-6 h-6 mx-auto" /> : 'Login'}
               </Button>
               {error && (
                  <div className="text-sm flex items-center justify-center -mt-2 text-center font-medium text-red-500">
                     <WarningTriangle
                        className="h-4 w-4 mr-2"
                        strokeWidth={2}
                     />
                     {error}
                  </div>
               )}
               <div className="text-center">
                  <Link href="/forgot-password" className="text-sm">
                     Forgot password?
                  </Link>
               </div>
            </form>
         </div>
      </main>
   );
};

export default LoginPage;
