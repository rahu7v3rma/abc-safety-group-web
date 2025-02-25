import clsx from 'clsx';
import { Trash } from 'iconoir-react';
import { Dispatch, SetStateAction, forwardRef, useCallback } from 'react';
import SignaturePad from 'react-signature-canvas';
import Tooltip from './Tooltip';

interface SignatureProps {
   wrapperClassName?: string;
   error?: false | string;
   setError?: Dispatch<SetStateAction<false | string>>;
   required?: boolean;
}

const Signature = forwardRef<any, SignatureProps>(
   ({ wrapperClassName, error, setError, required = true }, ref) => {
      const clearSignature = useCallback(() => {
         if (ref && typeof ref === 'object' && ref.current) {
            ref.current.clear();
         }
      }, [ref]);

      return (
         <div className={wrapperClassName}>
            <label className="font-medium tracking-tight">
               <span
                  className={clsx(
                     'text-lg font-bold text-red-500',
                     required && 'mr-2'
                  )}
                  style={{
                     verticalAlign: 'sub',
                  }}
               >
                  {required ? '*' : ''}
               </span>
               Signature
            </label>
            <div className="relative mt-2 h-64 w-full">
               <SignaturePad
                  ref={ref}
                  onBegin={() => {
                     if (error && setError) {
                        setError(false);
                     }
                  }}
                  canvasProps={{
                     className:
                        'w-full h-full cursor-crosshair bg-white shadow-sm rounded-xl border border-zinc-400',
                  }}
               />
               <div className="absolute right-2.5 top-2.5 flex items-center gap-2">
                  <Tooltip content="Clear signature">
                     <button
                        onClick={clearSignature}
                        className="rounded-xl bg-red-500 p-2.5 transition duration-200 ease-linear"
                     >
                        <Trash className="h-5 w-5 text-white" strokeWidth={2} />
                     </button>
                  </Tooltip>
               </div>
            </div>
            {!!error && (
               <div className="mt-2 text-sm font-medium tracking-tight text-red-500">
                  {error}
               </div>
            )}
         </div>
      );
   }
);

export default Signature;
