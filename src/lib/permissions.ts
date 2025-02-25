'use client';

import { TPermissions } from './types';

export function getPermissionClassNodes(
   permissions: TPermissions
): Record<string, string[]> {
   let permissionClassNodes: Record<string, string[]> = {};

   for (let i = 0; i < permissions.length; ++i) {
      const permission = permissions[i];

      const [permissionClass, permissionNode] =
         permission.permissionNode.split('.');

      if (permissionClassNodes.hasOwnProperty(permissionClass)) {
         permissionClassNodes[permissionClass].push(permissionNode);
      } else {
         permissionClassNodes[permissionClass] = [permissionNode];
      }
   }

   return permissionClassNodes;
}

export function validatePermissionNodes(
   permissionNode: string,
   permissionNodes: string[]
): boolean {
   let allowed = false;

   for (let i = 0; i < permissionNodes.length; ++i) {
      const currentPermissionNode = permissionNodes[i];

      if (currentPermissionNode === '*') {
         allowed = true;
         break;
      } else if (
         currentPermissionNode.toLowerCase() === permissionNode.toLowerCase()
      ) {
         allowed = true;
         break;
      }
   }

   return allowed;
}
