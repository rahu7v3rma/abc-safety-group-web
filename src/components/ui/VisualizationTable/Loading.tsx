'use client';

import Spinner from '../Spinner';

const VisualizationTableLoading = () => {
   return (
      <div className="w-full h-full flex items-center justify-center">
         <Spinner className="text-blue-600 h-10 w-10" />
      </div>
   );
};

export default VisualizationTableLoading;
