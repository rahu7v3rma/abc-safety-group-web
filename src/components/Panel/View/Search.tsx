'use client';

import { Search } from 'iconoir-react';

const ViewSearch = () => {
   return (
      <div className="relative group max-w-[17rem] w-full">
         <input
            type="text"
            placeholder="Search..."
            className="py-3 pl-[3rem] pr-4 font-medium rounded-2xl shadow-sm placeholder:text-zinc-400 w-full bg-zinc-50 border transition duration-200 ease-linear hover:border-zinc-400 focus:border-blue-500 outline-none focus:ring-[1px] focus:ring-blue-500 border-zinc-300"
         />
         <div className="absolute pointer-events-none inset-y-0 flex items-center ml-4">
            <Search
               className="text-zinc-400 transition duration-200 ease-linear group-focus-within:text-zinc-500 h-5 w-5"
               strokeWidth={2}
            />
         </div>
      </div>
   );
};

export default ViewSearch;
