'use client';

import { SWRConfig } from 'swr';
import SWRConfigValue from '@/lib/swr';
import { FC, PropsWithChildren } from 'react';

const SWRProvider: FC<PropsWithChildren> = ({ children }) => {
   return <SWRConfig value={SWRConfigValue}>{children}</SWRConfig>;
};

export default SWRProvider;
