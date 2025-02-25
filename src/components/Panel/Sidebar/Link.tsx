'use client';

import Tooltip from '@/components/ui/Tooltip';
import { TPanels } from '@/lib/types';
import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import {
   FC,
   PropsWithChildren,
   useContext,
   useEffect,
   useMemo,
   useState,
} from 'react';
import { PanelSidebarContext } from '.';

interface SidebarLinkProps extends NextLinkProps, PropsWithChildren {
   panel: TPanels;
   className?: string;
   Icon: any;
   tooltipContent?: string;
   hrefAbsolute?: boolean;
   target?: '_blank' | '_self';
}

const SidebarLinkVariants = cva(
   [
      'flex tracking-tight relative group justify-center border transition rounded-xl py-3.5 duration-200 ease-linear font-medium items-center',
   ],
   {
      variants: {
         intent: {
            inactive: 'text-zinc-500 hover:text-zinc-600 border-transparent',
            active: 'text-zinc-900 bg-zinc-100/75 border-zinc-200/50',
         },
      },
   }
);

const SidebarIconVariants = cva('h-6 w-6 transition duration-200 ease-linear', {
   variants: {
      intent: {
         inactive: 'text-zinc-400 group-hover:text-zinc-600',
         active: 'text-blue-500',
      },
      collapsed: {
         true: '',
         false: 'lg:mr-4 lg:h-auto lg:w-auto',
      },
   },
});

const SidebarLink: FC<SidebarLinkProps> = ({
   panel,
   className,
   Icon,
   children,
   href,
   tooltipContent,
   hrefAbsolute = false,
   target = '_self',
   ...props
}) => {
   const parent = `/${panel}`;

   const rootPathname = usePathname();
   const pathname = useMemo(() => {
      const n = rootPathname.replace(parent, '');
      if (!n.length) return '/';
      return n;
   }, [rootPathname]);

   const intent: VariantProps<typeof SidebarLinkVariants>['intent'] =
      useMemo(() => {
         if (href !== '/') {
            if (
               pathname.startsWith(href.toString() + '/') ||
               pathname === href
            ) {
               return 'active';
            }
         } else {
            if (pathname === href) {
               return 'active';
            }
         }
         return 'inactive';
      }, [href, pathname]);

   const [windowWidth, setWindowWidth] = useState(0);

   useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const hrefFinal =
      hrefAbsolute === true
         ? href // hrefAbsolute
         : parent + href; // hrefRelative

   const { collapsed } = useContext(PanelSidebarContext);

   return typeof tooltipContent === 'string' &&
      (windowWidth < 1024 || collapsed) ? (
      <Tooltip
         content={tooltipContent}
         contentProps={{ align: 'center', side: 'right' }}
      >
         <NextLink
            {...props}
            href={hrefFinal}
            className={clsx(className, SidebarLinkVariants({ intent }))}
            target={target}
         >
            <Icon className={SidebarIconVariants({ intent })} strokeWidth={2} />
            <span className={clsx('hidden', !collapsed && 'lg:inline-block')}>
               {children}
            </span>
         </NextLink>
      </Tooltip>
   ) : (
      <NextLink
         {...props}
         href={hrefFinal}
         className={clsx(
            className,
            SidebarLinkVariants({ intent }),
            !collapsed && 'lg:justify-normal lg:px-5'
         )}
         target={target}
      >
         <Icon
            className={SidebarIconVariants({
               intent,
               collapsed,
            })}
            strokeWidth={2}
         />
         <span className={clsx('hidden', !collapsed && 'lg:inline-block')}>
            {children}
         </span>
      </NextLink>
   );
};

export default SidebarLink;
