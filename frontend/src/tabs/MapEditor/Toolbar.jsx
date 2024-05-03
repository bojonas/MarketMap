import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../helper/SearchBar";
import CustomButton from '../../helper/CustomButton';
import DraggableImage from '../../helper/DraggableImage';
import { DimensionContext } from '../../DimensionContext';

export default function Toolbar({ layout }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.includes(search));

  const handleSave = async () => {
    console.log(layout);
  }

  const { width, height, isCommandKey } = useContext(DimensionContext);
  const scale = Math.round(Math.min(width*0.8 / layout[0].length, height*0.8 / layout.length));
  return (
    <div className='flex flex-col items-center text-center bg-darkgray-custom w-full h-full'>
      <SearchBar onSearch={setSearch} scale={scale}/>
      <div className='bg-slate-800 flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='flex flex-col content-center items-center text-center rounded-lg m-2 overflow-y-scroll min-h-[58svh] max-h-[58svh] w-[11svw]'>
          {images.map(([type, source], index) => (
            <div key={index} className={`bg-slate-700 w-full flex items-center flex-col border-slate-800 rounded-lg p-[1.6svh] 
              ${index === 0 ? 'border-b-2' : index === images.length-1 ? 'border-t-2' : 'border-2'}`}> 
              <span className='text-white' style={{fontSize: `${scale/4}px`}}>{type.replace('_', ' ')}</span>
              <div className='rounded-md hover:border-[0.2rem] hover:border-purple-custom hover:shadow-purple-custom'
                style={{ width: `${scale}px`, boxShadow: '0 5px 2px -1px rgb(35 45 65)' }}>
                <DraggableImage alt={type} source={source} isCommandKey={isCommandKey} duplicate={true}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full flex items-center justify-center content-center float-end end-full'>
        <CustomButton action={'Save'} onClick={handleSave} scale={scale}/>
      </div>
    </div>
  );
}