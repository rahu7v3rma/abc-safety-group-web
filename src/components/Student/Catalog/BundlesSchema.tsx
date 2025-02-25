import {
   TStudentTableBundleData,
   TVisualizationTableRootSchema,
} from '@/lib/types';
import Link from 'next/link';

export const StudentCatalogBundlesTableSchema: TVisualizationTableRootSchema<TStudentTableBundleData> =
   {
      __root: {
         render: (children, values) => {
            return (
               <Link
                  href={`/student/catalog/bundle/${values.bundleId}`}
                  className="hover:bg-zinc-100 flex-grow transition duration-200 ease-linear"
               >
                  {children}
               </Link>
            );
         },
      },
      bundleId: {
         hidden: true,
      },
      bundlePicture: {
         hidden: true,
      },
      bundleName: {
         render: (value, _) => {
            return <span className="text-blue-500">{value}</span>;
         },
      },
   };
