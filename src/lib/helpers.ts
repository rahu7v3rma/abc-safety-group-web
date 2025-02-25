import { ImmutableArray, State } from '@hookstate/core';
import { gradingColors } from './constants';

export function uncamelcase(str: string) {
   let uncamelcased = str.replace(/([A-Z])/g, ' $1');
   uncamelcased = uncamelcased.charAt(0).toUpperCase() + uncamelcased.slice(1);
   uncamelcased = uncamelcased.replace(/\s(.)/g, (match, group1) => {
      return ' ' + group1.toLowerCase();
   });
   return uncamelcased;
}

export function getDropdownObjectValue(
   values:
      | (string | Record<'text' | 'value', any>)[]
      | ImmutableArray<string | Record<'text' | 'value', any>>
      | undefined,
) {
   return values
      ? values.map((v) => {
           if (typeof v === 'object') {
              return v.value;
           }
           return v;
        })
      : [];
}

export function getTimezone() {
   return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export const formatting = 'MMM d, yyyy h:mm aa';

export const dateFormat = 'MM/dd/yyyy';

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function downloadCSV(name: string, payload: any) {
   const blob = new Blob([payload], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.setAttribute('href', url);
   a.setAttribute('download', `${name}-${Date.now()}.csv`);
   a.click();
}

export function downloadZIP(name: string, payload: any) {
   const blob = new Blob([payload], { type: 'application/octet-stream' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.setAttribute('href', url);
   a.setAttribute('download', `${name}-${Date.now()}.zip`);
   a.click();
}

export function isBase64(value: string) {
   return value.match(/^data:image\/[a-z]+;base64/g);
}

export function minutesToHumanReadable(minutes: number) {
   if (typeof minutes !== 'number' || isNaN(minutes)) {
      return 'Invalid input';
   }

   const hours = Math.floor(minutes / 60);
   const remainingMinutes = minutes % 60;

   let result = '';

   if (hours > 0) {
      result += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
   }

   if (hours > 0 && remainingMinutes > 0) {
      result += ' and ';
   }

   if (remainingMinutes > 0) {
      result += `${remainingMinutes} ${
         remainingMinutes === 1 ? 'minute' : 'minutes'
      }`;
   }

   return result;
}

export const formatResource = (
   resource: string | (string | State<string, {}>)[],
) => {
   return Array.isArray(resource)
      ? resource
           .map((r) => {
              if (typeof r !== 'string') {
                 return r.value;
              }
              return r;
           })
           .join('/')
      : resource;
};

export const safePanelHref = (href: string, pathname: string) => {
   const parent = pathname.slice(1).split('/')[0];
   return `/${parent}/${href}`;
};

export const schemaAllowedColumns = <T,>(
   allowedColumns: T[],
   columns: string[],
) => {
   return Object.assign(
      {},
      ...columns
         .map((k: any) => {
            if (allowedColumns.includes(k)) {
               return false;
            }
            return {
               [k]: {
                  hidden: true,
               },
            };
         })
         .filter((v) => v !== false),
   );
};

export const validExtension = (accept: string, extension: string) => {
   const extensions = accept.split(',');
   return !!extensions.includes(extension);
};

export const convertFileToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
         if (event.target && event.target.result) {
            const base64 = event.target.result as string;
            resolve(base64);
         } else {
            reject(new Error('Failed to convert file to base64.'));
         }
      };
      reader.readAsDataURL(file);
   });
};

export const convertFileToBase64Sync = (file: File) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);

   // Synchronous loop until the load event is triggered
   while (!reader.result) {
      // This is not recommended for large files, as it could freeze the UI
   }

   if (reader.result) {
      return (reader.result as any).split(',')[1];
   } else {
      throw new Error('Failed to convert file to base64.');
   }
};

export const removePrivateProperties = (
   obj: Record<string, any>,
): Record<string, any> => {
   if (typeof obj !== 'object' || obj === null) {
      return obj;
   }

   if (Array.isArray(obj)) {
      return obj.map(removePrivateProperties);
   }

   const result: Record<string, any> = {};

   for (const key in obj) {
      if (obj.hasOwnProperty(key) && !key.startsWith('_')) {
         result[key] = removePrivateProperties(obj[key]);
      }
   }

   return result;
};

// Conditional If->Or
export const cio = (condition: boolean, values: [any, any]) => {
   if (condition) {
      return values[0];
   } else {
      return values[1];
   }
};

export const filterNoneProperties = (obj: Record<string, any>) => {
   return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
         if (typeof value === 'string') {
            if (!value.trim().length) {
               return false;
            }
            return true;
         }
         return true;
      }),
   );
};

export const filterZeroProperties = (obj: Record<string, number>) => {
   return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
         if (value < 1) {
            return false;
         }
         return true;
      }),
   );
};

export const compareLowercase = (property1: string, property2: string) => {
   if (property1 && property2) {
      return property1.trim().toLowerCase() === property2.trim().toLowerCase();
   }
   return false;
};

export const removeNullProperties = (obj: Record<string, any>) => {
   return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
         if (value === null) {
            return false;
         }
         return true;
      }),
   );
};

export const removeNullOrUndefinedProperties = (obj: Record<string, any>) => {
   return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => {
         if (value === null || value === undefined) {
            return false;
         }
         return true;
      }),
   );
};

export const filterObjectToQueries = (filterObj: Record<string, any>) => {
   const queryString = Object.entries(filterObj)
      .map(([key, value]) => {
         let v = '';

         if (typeof value === 'object') {
            v = value.value;
         } else {
            v = value;
         }

         if (v.hasOwnProperty('toString')) {
            v = v.toString();
         }

         return `${key}=${encodeURIComponent(v)}`;
      })
      .join('&');

   return queryString ? `?${queryString}` : '';
};

export const uppercaseFirstLetter = (str: string) => {
   return str[0].toUpperCase() + str.substring(1, str.length);
};

export function getColorForPercentage(percentage: number) {
   const keys = Object.keys(gradingColors)
      .map(Number)
      .sort((a, b) => a - b);
   for (const key of keys) {
      if (percentage <= key) {
         return gradingColors[key];
      }
   }
   return 'text-red-500';
}
