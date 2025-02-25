import { OpenNewWindow } from 'iconoir-react';
import Link, { LinkProps } from 'next/link';
import { FC } from 'react';

interface VisualizationTableJoinProps extends LinkProps {
   external?: boolean;
}

const VisualizationTableJoin: FC<VisualizationTableJoinProps> = ({
   href,
   external = true,
   ...props
}) => {
   return (
      <Link
         href={href}
         target={external ? '_blank' : undefined}
         rel={external ? 'noopener' : undefined}
         className="px-5 w-24 pointer-events-auto inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue gap-2"
         {...props}
      >
         Join
         <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
            <OpenNewWindow className="h-4 w-4" strokeWidth={2} />
         </span>
      </Link>
   );
};

export default VisualizationTableJoin;
