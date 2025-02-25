'use client';

import Dropdown from '@/components/ui/Dropdown';
import config from '@/config';
import usePost from '@/hooks/usePost';
import * as RDropdownMenu from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import clsx from 'clsx';
import { Download } from 'iconoir-react';
import { toast } from 'sonner';
import cookie from 'js-cookie';

const DownloadTemplate = () => {
   const templates = ['certificates', 'courses', 'students'];

   function getTemplate(name: string) {
      const auth = cookie.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);

      return axios
         .get(config.api + 'data/import/' + name + '/template', {
            headers: {
               Authorization: `Bearer ${auth}`,
            },
            responseType: 'arraybuffer',
         })
         .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
         })
         .catch((err) => {
            throw new Error(err.message);
         });
   }

   function download(name: string) {
      toast.promise(getTemplate(name), {
         loading: `Downloading ${name} template...`,
         success: 'Downloaded!',
         error: (e) => {
            return e.message;
         },
      });
   }

   return (
      <Dropdown
         trigger={
            <button className="px-5 w-[9.5rem] inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue">
               Templates
               <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
                  <Download className="h-5 w-5" strokeWidth={2} />
               </span>
            </button>
         }
      >
         {templates.map((template) => (
            <RDropdownMenu.Item
               key={template}
               onClick={() => download(template)}
               className={clsx(
                  'text-sm font-medium tracking-tight cursor-pointer transition duration-200 ease-linear rounded-xl flex items-center px-4 py-2.5 relative select-none outline-none text-zinc-500 data-[highlighted]:bg-zinc-200/50 data-[highlighted]:text-zinc-600'
               )}
            >
               {template[0].toUpperCase() + template.slice(1, template.length)}
            </RDropdownMenu.Item>
         ))}
      </Dropdown>
   );
};

export default DownloadTemplate;
