'use client';

import { useHookstate } from '@hookstate/core';
import { Circle } from 'iconoir-react';
import { useEffect, useMemo } from 'react';

import { getTimezone } from '@/lib/helpers';

const Time = () => {
   const time = useHookstate<number | false>(false);

   useEffect(() => {
      time.set(Date.now());
      const interval = setInterval(() => {
         time.set(Date.now());
      }, 1000); // every minute

      return () => clearInterval(interval);
   }, []);

   const formattedTime = useMemo(() => {
      if (time.value) {
         return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: getTimezone(),
         }).format(time.value);
      }
      return '0:00 PM';
   }, [time.get()]);

   return (
      <p
         className="text-sm mr-1.5 flex items-center tracking-wide text-zinc-500 font-medium"
         suppressHydrationWarning
      >
         <Circle className="h-3 w-3 mr-2 text-zinc-300" />
         {formattedTime}
      </p>
   );
};

export default Time;
