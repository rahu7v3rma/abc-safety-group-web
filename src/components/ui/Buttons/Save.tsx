import { Check } from 'iconoir-react';
import { FC } from 'react';
import Spinner from '../Spinner';

type SaveButtonProps = {
   onClick?: () => void;
   disabled?: boolean;
   loading?: boolean;
};

const SaveButton: FC<SaveButtonProps> = ({ onClick, disabled, loading }) => (
   <button
      onClick={onClick}
      disabled={disabled}
      className="px-5 w-28 inline-flex outline-none justify-between transition duration-200 ease-linear disabled:opacity-75 disabled:cursor-not-allowed tracking-tight items-center text-white border border-blue-800 font-semibold text-sm py-2 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl shadow-inner-blue"
   >
      Save
      <span className="flex items-center justify-center h-8 w-8 -mr-2 bg-blue-600 rounded-[0.6rem]">
         {loading ? (
            <Spinner className="h-4 w-4" />
         ) : (
            <Check className="h-4 w-4" strokeWidth={2} />
         )}
      </span>
   </button>
);

export default SaveButton;
