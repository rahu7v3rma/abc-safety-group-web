'use client';

import { usePermissions } from '@/contexts/permissions';
import {
   getPermissionClassNodes,
   validatePermissionNodes,
} from '@/lib/permissions';
import { FC, PropsWithChildren } from 'react';

export function PermissionsGuardComponent(
   Component: FC<any>,
   permissionClass: string,
   permissionNode: string
) {
   return function ComponentWithPermissionsGuard(
      props: any
   ): JSX.Element | null {
      const { permissions } = usePermissions();

      const permissionClassNodes = getPermissionClassNodes(permissions);

      if (permissionClassNodes.hasOwnProperty(permissionClass)) {
         const permissionNodes = permissionClassNodes[permissionClass];

         const permissionAllowed = validatePermissionNodes(
            permissionNode,
            permissionNodes
         );

         if (permissionAllowed) {
            return <Component {...props} />;
         }
      }

      return null;
   };
}

interface PermissionsGuardProps {
   permissionClass: string;
   permissionNode: string;
}

export const PermissionsGuard = ({
   children,
   permissionClass,
   permissionNode,
}: PropsWithChildren<PermissionsGuardProps>) => {
   const { permissions } = usePermissions();

   const permissionClassNodes = getPermissionClassNodes(permissions);

   if (permissionClassNodes.hasOwnProperty(permissionClass)) {
      const permissionNodes = permissionClassNodes[permissionClass];

      const permissionAllowed = validatePermissionNodes(
         permissionNode,
         permissionNodes
      );

      if (permissionAllowed) {
         return children;
      }
   }

   return null;
};
