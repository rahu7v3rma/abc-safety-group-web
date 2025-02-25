'use client';

import {
   createContext,
   Dispatch,
   FC,
   PropsWithChildren,
   SetStateAction,
   useContext,
   useState,
} from 'react';

import { contextState } from '@/lib/state';
import { TPermissions, TPermissionsContext } from '@/lib/types';
import { hookstate } from '@hookstate/core';

export const permissionsState = hookstate<TPermissions>([]);

export const PermissionsContext = createContext<{
   permissions: TPermissions;
   updatePermissions: Dispatch<SetStateAction<TPermissions>>;
}>({
   permissions: [],
   updatePermissions: () => {},
});

interface Props extends PropsWithChildren {
   permissions: TPermissions;
}
export const PermissionsProvider: FC<Props> = (props) => {
   const [permissions, updatePermissions] = useState<TPermissions>(
      props.permissions
   );
   contextState.setState((c) => ({ ...c, permissions }));

   return (
      <PermissionsContext.Provider value={{ permissions, updatePermissions }}>
         {props.children}
      </PermissionsContext.Provider>
   );
};

export const usePermissions = <T extends TPermissionsContext>() =>
   useContext(PermissionsContext) as T;

export const PermissionsConsumer = PermissionsContext.Consumer;
