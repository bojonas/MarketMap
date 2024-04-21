import DuplicateImage from "../helper/DuplicateImage";
import { getImages } from "../helper/getImages";

export default function Toolbar() {
  return (
    <div className="flex flex-col items-center text-center bg-slate-500 w-full">
        <p className='text-white text-xl'>Toolbar</p>
        {Object.entries(getImages()).map(([type, source], index) => (
            <div key={index} className='w-[7rem] mt-10'>
                <DuplicateImage alt={type} source={source}/>
            </div>
        ))}
    </div>
  );
}