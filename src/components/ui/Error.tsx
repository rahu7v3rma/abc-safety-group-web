'use client';
import { WindowXmark } from 'iconoir-react';

export default function Error({
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   return (
      <div className="flex flex-grow flex-col items-center justify-center rounded-2xl border border-zinc-300 bg-zinc-50">
         <WindowXmark className="h-20 w-20 text-zinc-300" strokeWidth={2} />
         <p className="mt-4 text-lg font-semibold text-zinc-600">
            Something went wrong
         </p>
         <button
            onClick={reset}
            className="mt-8 rounded-xl bg-blue-500 px-4 py-2 font-medium text-white transition duration-200 ease-linear hover:bg-blue-600"
         >
            Try again
         </button>
      </div>
   );
}
