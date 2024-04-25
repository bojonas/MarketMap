import React, { useState } from 'react';
import { getImages } from "../../helper/getImages";
import SearchBar from "../../helper/SearchBar";
import { saveLayout } from '../../helper/saveLayout';
import CustomButton from '../../helper/CustomButton';
import DuplicateImage from '../../helper/DuplicateImage';

export default function Toolbar({ layout, scale }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getImages()).filter(([type]) => type.includes(search));

  const handleSave = () => {
    saveLayout(layout);
  }

  const imageSize = scale;

  return (
    <div className='flex flex-col items-center text-center bg-black-custom w-full shadow-xl shadow-black mt-4'>
      <SearchBar onSearch={setSearch} scale={scale}/>
      <div className='flex flex-col items-center text-center bg-slate-800 rounded-lg mt-8 mb-4'>
        <div className='flex flex-col items-center text-center bg-slate-700 rounded-lg m-2 overflow-y-auto' style={{height: `${scale*7.5}px`, width: `${scale*3.5}px`}}>
          {images.map(([type, source], index) => (
            <div key={index} style={{margin: `${scale/5}px`,}}> 
              <span className='text-slate-400' style={{fontSize: `${scale/6}px`}}>{type.replace('_', ' ')}</span>
              <div className='hover:border-[0.2rem] hover:border-slate-800 shadow-xl shadow-slate-800 rounded-[5px]'
                style={{
                  width: `${scale/1.2}px`,
                  boxShadow: '0 5px 2px -1px rgb(35 45 65)',
                }}
              >
                <DuplicateImage alt={type} source={source} scale={scale}/>
              </div>
            </div>
            ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full content-center' style={{height: `${scale*1.4}px`}}>
        <CustomButton onClick={handleSave} scale={scale}/>
      </div>
    </div>
  );
}