import React, { useState } from 'react';
import { getImages } from "../../helper/getImages";
import SearchBar from "../../helper/SearchBar";
import { saveLayout } from '../../helper/saveLayout';
import CustomButton from '../../helper/CustomButton';
import DuplicateImage from '../../helper/DuplicateImage';

export default function Toolbar({ layout, width, height }) {
  const scale = Math.min(width, height);

  const [search, setSearch] = useState('');
  const images = Object.entries(getImages()).filter(([type]) => type.includes(search));

  const handleSave = () => {
    saveLayout(layout);
  }

  // custom sizes
  const ToolbarWidth = width/5.5;
  const ToolbarHeight = height/1.5;
  return (
    <div className='flex flex-col items-center text-center bg-black-custom w-full shadow-xl shadow-black mt-4'>
      <SearchBar onSearch={setSearch} scale={scale}/>
      <div className='flex flex-col items-center text-center bg-slate-800 rounded-lg mt-8 mb-4'>
        <div className='flex flex-col content-center items-center text-center bg-slate-700 rounded-lg m-2 overflow-y-auto' style={{height: `${ToolbarHeight}px`, width: `${ToolbarWidth}px`}}>
          {images.map(([type, source], index) => (
            <div key={index} style={{margin: `${ToolbarHeight/30}px`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
              <span className='text-slate-400' style={{fontSize: `${scale/40}px`}}>{type.replace('_', ' ')}</span>
              <div className='hover:border-[0.2rem] hover:border-slate-800 shadow-xl shadow-slate-800 rounded-[5px]'
                style={{
                  width: `${scale/12}px`,
                  boxShadow: '0 5px 2px -1px rgb(35 45 65)',
                }}
              >
                <DuplicateImage alt={type} source={source} 
                  scale={Math.round(Math.min(width/layout[0].length, height/layout.length))}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full content-center float-end end-full'>
        <CustomButton action={'save'} onClick={handleSave} width={ToolbarWidth} height={ToolbarHeight}/>
      </div>
    </div>
  );
}