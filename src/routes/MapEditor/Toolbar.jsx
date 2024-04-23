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
    <div className='flex flex-col items-center text-center bg-black-custom w-full shadow-xl shadow-black mt-4'>
      <SearchBar onSearch={setSearch}/>
      <div className='flex flex-col items-center text-center bg-slate-800 rounded-lg mt-8 mb-4'>
        <div className='flex flex-col items-center text-center bg-slate-700 rounded-lg m-2 overflow-y-auto'
          style={{width: `${imageSize*3}rem`, height: `${imageSize*12.3}vh`}}
        >
          {images.map(([type, source], index) => (
              <>
                <span className='text-slate-400'>{type.replace('_', ' ')}</span>
                <div key={index} className='hover:border-[0.2rem] hover:border-slate-800 shadow-xl shadow-slate-800 rounded-[5px]'
                  style={{
                    width: `${imageSize}rem`,
                    margin: `${imageSize/5}rem`,
                    boxShadow: '0 5px 2px -1px rgb(35 45 65)',
                  }}
                >
                    <DuplicateImage alt={type} source={source}/>
                </div>
              </>
          ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-20 content-center'>
        <CustomButton onClick={handleSave}/>
      </div>
    </div>
  );
}