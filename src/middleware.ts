import { NextRequest, NextResponse } from 'next/server';
import { roleToPanel, roleWeightage } from './lib/constants';
import { isEnvFalse } from './lib/environment';
import { TRoleData } from './lib/types';

const alreadyGuard = ['/login', '/register', '/forgot-password'];

export function middleware(req: NextRequest) {
   const { nextUrl } = req;
   const { pathname, origin } = nextUrl;

   if (new RegExp(/^.*(fonts|_next|vk.com|favicon).*$/).test(req.url)) {
      return NextResponse.next();
   }

   if (isEnvFalse(process.env.NEXT_PUBLIC_ALLOW_REGISTER)) {
      if (pathname.startsWith('/register')) {
         return NextResponse.redirect(new URL('404', origin));
      }
   }

   if (isEnvFalse(process.env.ALLOW_STUDENT_PANEL)) {
      if (pathname.startsWith('/student')) {
         return NextResponse.redirect(new URL('404', origin));
      }
   }

   if (isEnvFalse(process.env.ALLOW_INSTRUCTOR_PANEL)) {
      if (pathname.startsWith('/instructor')) {
         return NextResponse.redirect(new URL('404', origin));
      }
   }

   const cookie = req.cookies.get(
      process.env.NEXT_PUBLIC_COOKIE_NAME as string
   );

   if (!cookie || !cookie.value) {
      return alreadyGuard.includes(pathname)
         ? NextResponse.next()
         : NextResponse.redirect(new URL('login', origin));
   } else {
      return fetch(process.env.NEXT_PUBLIC_API_URL + 'users/me', {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${cookie.value}`,
         },
      })
         .then(async (res) => {
            if (res.status === 200) {
               const data = await res.json();
               const roles: TRoleData[] = data.payload.roles;
               const roleNames = roles.map((role) => role.roleName);
               // redirect to panel with max role if path is / or alreadyGuard
               if (pathname === '/' || alreadyGuard.includes(pathname)) {
                  const roleWithMaxWeightage = roleNames.sort(
                     (a, b) => roleWeightage[b] - roleWeightage[a]
                  )[0];
                  const assignedPanel = roleToPanel[roleWithMaxWeightage];

                  return NextResponse.redirect(new URL(assignedPanel, origin));
               }
               // prevent accessing panel if role is not assigned
               const panel = pathname.split('/')[1];
               const panels = roleNames.map((role) => roleToPanel[role]);

               if (!panels.includes(panel as TRoleData['roleName'])) {
                  return NextResponse.redirect(new URL('404', origin));
               }
               return NextResponse.next();
            }

            // let request pass if pathname is alreadyGuard else redirect to login
            return alreadyGuard.includes(pathname)
               ? NextResponse.next()
               : NextResponse.redirect(new URL('login', origin));
         })
         .catch(() => {
            // let request pass if pathname is alreadyGuard else redirect to login
            return alreadyGuard.includes(pathname)
               ? NextResponse.next()
               : NextResponse.redirect(new URL('login', origin));
         });
   }
}

export const config = {
   matcher: [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/admin',
      '/admin/:path*',
   ],
};
