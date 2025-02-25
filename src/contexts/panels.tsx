'use client';

import { Panel } from '@/lib/types';
import {
   createContext,
   Dispatch,
   FC,
   PropsWithChildren,
   SetStateAction,
   useContext,
   useState,
} from 'react';

export const PanelsContext = createContext<{
   panels: Panel[];
   setPanels: Dispatch<SetStateAction<Panel[]>>;
}>({
   panels: [],
   setPanels: () => {},
});

interface Props extends PropsWithChildren {
   panels: Panel[];
}

export const PanelsProvider: FC<Props> = ({ children, panels }) => {
   const [panelsState, setPanels] = useState<Panel[]>(panels);

   return (
      <PanelsContext.Provider value={{ panels: panelsState, setPanels }}>
         {children}
      </PanelsContext.Provider>
   );
};

export const usePanels = () => useContext(PanelsContext);
