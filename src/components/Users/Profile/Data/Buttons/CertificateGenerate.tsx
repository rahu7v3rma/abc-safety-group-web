import { Plus } from 'iconoir-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';

const GenerateButton: FC = ({}) => {
   const router = useRouter();
   const pathname = usePathname();
   const Generate = useCallback(() => {
      router.push(pathname + '/certificates/generate');
   }, [router, pathname]);
   return (
      <button
         className="px-5 w-38 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
         onClick={Generate}
      >
         Generate
         <span className="flex items-center justify-center h-8 w-8 ml-4 -mr-2 bg-blue-600 rounded-[0.6rem]">
            <Plus className="h-5 w-5" strokeWidth={2} />
         </span>
      </button>
   );
};

export default GenerateButton;
