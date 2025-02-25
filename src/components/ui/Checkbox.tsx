'use client';

import React, { FC } from 'react';
import * as RCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'iconoir-react';
import clsx from 'clsx';

interface CheckboxProps extends RCheckbox.CheckboxProps {
   className: string;
   checkClassName: string;
}

const Checkbox: FC<CheckboxProps> = ({
   className,
   checkClassName,
   ...props
}) => (
   <RCheckbox.Root
      className={clsx(
         className,
         'flex appearance-none items-center justify-center rounded-md transition duration-200 ease-linear hover:border-zinc-400 data-[state=checked]:border-zinc-400 border border-zinc-300 bg-white outline-none'
      )}
      {...props}
   >
      <RCheckbox.Indicator className="text-blue-500">
         <Check className={checkClassName} strokeWidth={2} />
      </RCheckbox.Indicator>
   </RCheckbox.Root>
);

export default Checkbox;
