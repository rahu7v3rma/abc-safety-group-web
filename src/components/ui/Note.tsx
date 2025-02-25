import { Notes } from 'iconoir-react';
import { FC } from 'react';

interface NoteProps {
   text: string;
}

const Note: FC<NoteProps> = ({ text }) => {
   return (
      <div className="bg-yellow-500/10 text-black pt-4 pb-5 px-5 w-full rounded-2xl">
         <p className="text-sm inline-flex items-center tracking-tight font-semibold text-yellow-700">
            <Notes className="h-4 w-4 mr-2" strokeWidth={2} />
            Note
         </p>
         <p className="mt-2 text-yellow-600">{text}</p>
      </div>
   );
};

export default Note;
