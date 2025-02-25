import { FC } from 'react';
import Spinner from './Spinner';

interface LoadingSuspenseProps {
   name: string;
}

const LoadingSuspense: FC<LoadingSuspenseProps> = ({ name }) => {
   return (
      <div className="flex-1 flex flex-col">
         <div className="m-auto flex flex-col items-center">
            <Spinner className="h-12 w-12 text-blue-500" />
            <p className="mt-3 text-blue-500 font-medium tracking-tight">
               Loading {name.toLowerCase()}...
            </p>
         </div>
      </div>
   );
};

export default LoadingSuspense;
