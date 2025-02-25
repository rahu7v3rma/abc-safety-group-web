'use client';

import clsx from 'clsx';
import { FC } from 'react';

interface SpinnerProps {
   className?: string;
}

const Spinner: FC<SpinnerProps> = ({ className }) => {
   return (
      <svg
         className={clsx(
            'spinner',
            className ?? 'h-[1rem] w-[1rem] text-white'
         )}
         viewBox="0 0 50 50"
      >
         <circle
            className="path"
            cx="25"
            cy="25"
            r="15"
            fill="none"
            strokeWidth="4"
         ></circle>
      </svg>
   );
};

export default Spinner;
