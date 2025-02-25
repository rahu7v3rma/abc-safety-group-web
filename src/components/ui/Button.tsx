'use client';

import clsx from 'clsx';
import { ComponentProps, FC, PropsWithChildren } from 'react';

interface ButtonProps extends ComponentProps<'button'> {}

const Button: FC<PropsWithChildren<ButtonProps>> = ({
   children,
   className,
   ...props
}) => {
   return (
      <button
         {...props}
         className={clsx(
            'bg-blue-500 transition disabled:opacity-75 disabled:cursor-not-allowed duration-200 ease-linear hover:bg-blue-400 rounded-2xl w-full py-4 shadow-sm text-white font-semibold',
            className
         )}
      >
         {children}
      </button>
   );
};

export default Button;
