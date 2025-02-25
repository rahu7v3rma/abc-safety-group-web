'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, PropsWithChildren, ReactNode } from 'react';

interface Props
   extends PropsWithChildren,
      DropdownMenu.DropdownMenuContentProps {
   rootProps?: DropdownMenu.DropdownMenuProps;
   trigger: ReactNode;
   search?: ReactNode;
   disabled?: boolean;
   zIndex?: number;
}

const Dropdown: FC<Props> = ({
   trigger,
   search,
   children,
   rootProps,
   disabled,
   zIndex,
   ...contentProps
}) => {
   return (
      <DropdownMenu.Root {...rootProps}>
         <DropdownMenu.Trigger disabled={disabled} asChild>
            {trigger}
         </DropdownMenu.Trigger>
         <DropdownMenu.Portal>
            <DropdownMenu.Content
               className="w-max max-w-[20rem] max-h-[23rem] overflow-auto min-w-[10rem] drop-shadow-lg bg-gray-50 border border-gray-200 rounded-2xl px-2.5 pb-2.5 will-change-transform data-[side=top]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideRightAndFade"
               sideOffset={10}
               style={{
                  zIndex: zIndex ?? 10001,
               }}
               align="end"
               {...contentProps}
            >
               {!!search && (
                  <div
                     className="sticky bg-zinc-50 pt-2.5 top-0 z-20"
                     onKeyDown={(e) => e.stopPropagation()}
                  >
                     {search}
                  </div>
               )}
               <div className="pt-2.5 flex-1 flex flex-col gap-y-0.5">
                  {children}
               </div>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu.Root>
   );
};

export default Dropdown;
