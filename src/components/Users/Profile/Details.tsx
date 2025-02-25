import { TUserData } from '@/lib/types';
import { differenceInYears } from 'date-fns';
import {
   BirthdayCake,
   Calendar,
   Eye,
   Map,
   MapsArrowDiagonal,
   Phone,
   Pin,
   ProfileCircle,
   Ruler,
   TimeZone,
} from 'iconoir-react';
import { FC } from 'react';

const calculateAge = (dob: string) => {
   const today = new Date();
   const birthDate = new Date(dob);
   return differenceInYears(today, birthDate);
};

const valueOrNone = (object: Record<string, any>, property: string) => {
   return (
      (object && object[property]) ?? (
         <span className="text-zinc-400 italic">No {property} given</span>
      )
   );
};

interface UserDetailsProps {
   user: TUserData;
}

const UserDetails: FC<UserDetailsProps> = ({ user }) => {
   return (
      <>
         <div className="mt-14 mb-8 flex items-center gap-5">
            <p className="text-sm font-medium text-zinc-400">USER DETAILS</p>
            <div className="flex-1 border-t border-zinc-200"></div>
         </div>
         <div className="grid grid-cols-3 w-full gap-3">
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Phone className="h-5 w-5" strokeWidth={2} />
                  Phone number
               </p>
               <div className="inline-flex items-center">
                  <a
                     href={`tel:${user.phoneNumber}`}
                     className="text-blue-500 transition duration-200 ease-linear hover:bg-white font-medium py-0.5 px-2 rounded-lg border border-zinc-200"
                  >
                     {valueOrNone(user, 'phoneNumber')}
                  </a>
               </div>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <BirthdayCake className="h-5 w-5" strokeWidth={2} />
                  Date of birth
               </p>
               <p className="font-medium">
                  {valueOrNone(user, 'dob')}{' '}
                  <span className="text-zinc-600 tracking-tight font-normal">
                     ({calculateAge(user.dob)} years old)
                  </span>
               </p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <ProfileCircle className="h-5 w-5" strokeWidth={2} />
                  Gender
               </p>
               <p className="font-medium">{valueOrNone(user, 'gender')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Map className="h-5 w-5" strokeWidth={2} />
                  State
               </p>
               <p className="font-medium">{valueOrNone(user, 'state')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <MapsArrowDiagonal className="h-5 w-5" strokeWidth={2} />
                  City
               </p>
               <p className="font-medium">{valueOrNone(user, 'city')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Pin className="h-5 w-5" strokeWidth={2} />
                  Address
               </p>
               <p className="font-medium">{valueOrNone(user, 'address')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <TimeZone className="h-5 w-5" strokeWidth={2} />
                  Timezone
               </p>
               <p className="font-medium">{valueOrNone(user, 'timeZone')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Eye className="h-5 w-5" strokeWidth={2} />
                  Eye color
               </p>
               <p className="font-medium">{valueOrNone(user, 'eyeColor')}</p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Ruler className="h-5 w-5" strokeWidth={2} />
                  Height
               </p>
               <p className="font-medium">
                  {user.height ? (
                     <>
                        {user.height.feet}&apos;
                        {user.height.inches}&quot;
                     </>
                  ) : (
                     valueOrNone(user, 'height')
                  )}
               </p>
            </div>
            <div className="details-container">
               <p className="inline-flex tracking-tight text-zinc-500 items-center gap-3">
                  <Calendar className="h-5 w-5" strokeWidth={2} />
                  Expiration date
               </p>
               <p className="font-medium">
                  {valueOrNone(user, 'expirationDate')}
               </p>
            </div>
         </div>
      </>
   );
};

export default UserDetails;
