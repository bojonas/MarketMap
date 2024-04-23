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

  const imageSize = 5;

  return (
    <div className='flex flex-col items-center text-center bg-slate-900 w-full shadow-xl shadow-black'>
      <SearchBar onSearch={setSearch}/>
      <div className='flex flex-col items-center text-center overflow-y-auto bg-slate-800 rounded-lg m-8'>
        <div className='flex flex-col items-center text-center bg-slate-700 rounded-lg m-2'
          style={{width: `${imageSize*3}rem`}}
        >
          {images.map(([type, source], index) => (
              <div key={index} style={{
                width: `${imageSize}rem`,
                margin: `${imageSize/5}rem`,
              }}>
                  <DuplicateImage alt={type} source={source}/>
              </div>
          ))}
        </div>
      </div>
      <CustomButton onClick={handleSave}/>
    </div>
  );
}