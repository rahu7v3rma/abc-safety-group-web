'use client';

import {
   createContext,
   Dispatch,
   FC,
   PropsWithChildren,
   SetStateAction,
   useContext,
   useEffect,
   useState,
} from 'react';

import { TUser, TUserContext, TUserContextForce } from '@/lib/types';
import { hookstate } from '@hookstate/core';
import { create } from 'zustand';
import { contextState } from '@/lib/state';

export const UserContext = createContext<{
   user: TUser;
   updateUser: Dispatch<SetStateAction<TUser>>;
}>({
   user: false,
   updateUser: () => {},
});

interface Props extends PropsWithChildren {
   user: TUser;
}
export const UserProvider: FC<Props> = (props) => {
   const [user, updateUser] = useState<TUser>(props.user ?? false);
   contextState.setState((c) => ({ ...c, user }));

   return (
      <UserContext.Provider value={{ user, updateUser }}>
         {props.children}
      </UserContext.Provider>
   );
};

export const useUser = <T extends TUserContext | TUserContextForce>() =>
   useContext(UserContext) as T;

export const UserConsumer = UserContext.Consumer;
