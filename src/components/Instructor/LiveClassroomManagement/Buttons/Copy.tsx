'use client';

import Tooltip from '@/components/ui/Tooltip';
import { Check, Copy } from 'iconoir-react';
import { useCallback, useMemo, useState } from 'react';

const buttonProps = {
   className: 'h-6 w-6 text-blue-500 cursor-pointer',
   strokeWidth: 2,
};

const CopyButton = ({ value }: { value: string }) => {
   const [copied, setCopied] = useState(false);

   const onClickCopy = useCallback(() => {
      if (!copied) {
         window.navigator.clipboard.writeText(String(value));
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
   }, [value, copied]);

   const tooltipContent = useMemo(() => (copied ? 'Copied' : 'Copy'), [copied]);

   const Render = copied ? Check : Copy;

   return (
      <Tooltip content={tooltipContent}>
         <Render {...buttonProps} onClick={onClickCopy} />
      </Tooltip>
   );
};

export default CopyButton;
