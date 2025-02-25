'use client';

import clsx from 'clsx';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { FC, PropsWithChildren } from 'react';

interface LinkProps extends NextLinkProps {
   className?: string;
}

const Link: FC<PropsWithChildren<LinkProps>> = ({
   children,
   className,
   ...props
}) => {
   return (
      <NextLink
         {...props}
         className={clsx(
            className,
            'border-b border-transparent text-blue-500 transition duration-200 ease-linear hover:border-blue-600 hover:text-blue-600',
         )}
      >
         {children}
      </NextLink>
   );
};

export default Link;
