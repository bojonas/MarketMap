import { useState } from 'react';
import DuplicateImage from "../../helper/DuplicateImage";
import { getImages } from "../../helper/getImages";
import SearchBar from "../../helper/SearchBar";
import { saveLayout } from '../../helper/saveLayout';
import CustomButton from '../../helper/CustomButton';

export default function Toolbar({ layout }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getImages()).filter(([type]) => type.includes(search));

  const handleSave = () => {
    saveLayout(layout);
  }

  return (
    <div className='flex flex-col items-center text-center bg-slate-900 w-full rounded-2xl max-h-full'>
      <SearchBar onSearch={setSearch}/>
      <p className='text-white text-xl'>Toolbar</p>
      <div className='flex flex-col items-center text-center w-[22rem] h-[] bg-slate-800 rounded-xl m-4'>
        <div className='flex flex-col items-center text-center w-[20rem] h-[65vh] overflow-y-auto bg-slate-700 rounded-xl m-4'>
          {images.map(([type, source], index) => (
              <div key={index} className='w-[5rem] mt-7'>
                  <DuplicateImage alt={type} source={source}/>
              </div>
          ))}
        </div>
      </div>
      <CustomButton onClick={handleSave}/>
    </div>
  );
}