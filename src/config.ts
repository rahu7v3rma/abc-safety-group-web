import Logo from '@public/logo.webp';

import { Config } from './lib/types';

export default {
   logo: Logo,
   name: 'ABC Safety Group',
   api: process.env.NEXT_PUBLIC_API_URL as string,
} satisfies Config;
