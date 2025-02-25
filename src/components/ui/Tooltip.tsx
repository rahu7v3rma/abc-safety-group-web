import * as RTooltip from '@radix-ui/react-tooltip';
import { VariantProps, cva } from 'class-variance-authority';
import { FC } from 'react';

interface Props extends RTooltip.TooltipProps {
   content: string;
   contentProps?: RTooltip.TooltipContentProps;
   intent?: VariantProps<typeof tooltipStyles>['intents'];
}

const tooltipStyles = cva(
   [
      'tracking-tight rounded-xl z-[10005] py-2.5 px-4 relative text-sm shadow-sm font-medium data-[state=delayed-open]:data-[side=top]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]',
   ],
   {
      variants: {
         intents: {
            default: [
               'bg-zinc-100',
               'text-black',
               'border',
               'border-zinc-200',
               'relative',
            ],
            error: ['bg-red-500', 'text-white'],
         },
      },
      defaultVariants: {
         intents: 'default',
      },
   }
);

const Tooltip: FC<Props> = ({
   children,
   content,
   contentProps,
   intent,
   ...props
}) => {
   return (
      <RTooltip.Provider delayDuration={0} disableHoverableContent>
         <RTooltip.Root {...props}>
            <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
            <RTooltip.Portal>
               <RTooltip.Content
                  className={tooltipStyles({ intents: intent })}
                  sideOffset={5}
                  {...contentProps}
               >
                  {content}
                  <RTooltip.Arrow
                     width={11}
                     height={5}
                     className="fill-zinc-200 z-[10005]"
                  />
               </RTooltip.Content>
            </RTooltip.Portal>
         </RTooltip.Root>
      </RTooltip.Provider>
   );
};

export default Tooltip;
