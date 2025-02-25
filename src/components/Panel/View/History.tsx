'use client';

import { ArrowLeft, ArrowRight, Refresh } from 'iconoir-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

const History = () => {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const [history, setHistory] = useState<string[]>([pathname]);
   const [currentIndex, setCurrentIndex] = useState<number>(0);

   useEffect(() => {
      const url = `${pathname}${
         [...searchParams.keys()].length ? '?' + searchParams : ''
      }`;

      if (url !== history[currentIndex]) {
         setHistory((prevHistory) => [
            ...prevHistory.slice(0, currentIndex + 1),
            url,
         ]);
         setCurrentIndex((prevIndex) => prevIndex + 1);
      }
   }, [pathname, searchParams]);

   const canGoBack = useMemo(() => currentIndex > 0, [currentIndex]);
   const canGoForward = useMemo(
      () => currentIndex < history.length - 1,
      [currentIndex, history]
   );

   const goBack = () => {
      if (canGoBack) {
         const previousUrl = history[currentIndex - 1];
         router.push(previousUrl);
         setCurrentIndex(currentIndex - 1);
      }
   };

   const goForward = () => {
      if (canGoForward) {
         const nextUrl = history[currentIndex + 1];
         router.push(nextUrl);
         setCurrentIndex(currentIndex + 1);
      }
   };

   return (
      <div className="flex items-center gap-2 mt-3">
         <button
            onClick={goBack}
            disabled={!canGoBack}
            className="text-zinc-600 hover:bg-zinc-100 disabled:hover:bg-transparent px-1.5 py-1 rounded-lg transition duration-200 ease-in-out hover:-translate-x-px disabled:hover:-translate-x-0 will-change-transform disabled:text-zinc-300"
         >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
         </button>
         <button
            onClick={goForward}
            disabled={!canGoForward}
            className="text-zinc-600 hover:bg-zinc-100 disabled:hover:bg-transparent px-1.5 py-1 rounded-lg transition duration-200 ease-in-out hover:translate-x-px disabled:hover:translate-x-0 will-change-transform disabled:text-zinc-300"
         >
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
         </button>
         <button
            className="text-blue-500 group transition duration-200 ease-linear hover:text-blue-600 hover:bg-zinc-100 px-2 py-1.5 rounded-lg"
            onClick={() => location.reload()}
         >
            <Refresh
               className="h-4 w-4 transition duration-200 ease-in-out will-change-transform group-hover:rotate-[45deg] group-focus:rotate-[360deg]"
               strokeWidth={2.5}
            />
         </button>
      </div>
   );
};

export default History;
