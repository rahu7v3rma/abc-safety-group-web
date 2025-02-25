import { getImageURL } from '@/lib/image';
import { TVisualizationTableSchema } from '@/lib/types';
import Image from 'next/image';

const DefaultUserSchema: TVisualizationTableSchema<any> = {
   userId: {
      hidden: true,
   },
   headShot: {
      inline: 125,
      allowNull: true,
      render: (value, values) => {
         return (
            <Image
               alt={values.firstName + ' ' + values.lastName + "'s picture"}
               src={getImageURL('users', values.headShot, 300)}
               placeholder="blur"
               blurDataURL={`/_next/image?url=${getImageURL(
                  'users',
                  values.headShot,
                  16
               )}&w=16&q=1`}
               width={300}
               height={300}
               className="w-14 h-14 animate-fadeIn object-cover mx-auto rounded-lg"
            />
         );
      },
   },
};

export default DefaultUserSchema;
