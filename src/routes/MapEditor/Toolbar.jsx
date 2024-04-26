import React, { useContext, useState } from 'react';
import { getImages } from "../../helper/getImages";
import SearchBar from "../../helper/SearchBar";
import { saveLayout } from '../../helper/saveLayout';
import CustomButton from '../../helper/CustomButton';
import DraggableImage from '../../helper/DraggableImage';
import { DimensionContext } from '../../DimensionContext';

export default function Toolbar({ layout }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getImages()).filter(([type]) => type.includes(search));

  const handleSave = () => {
    saveLayout(layout);
  }

  // custom sizes
  const { width, height } = useContext(DimensionContext);

  const scale = Math.round(Math.min(width/layout[0].length, height/layout.length));
  const ToolbarWidth = width/6.5;
  const ToolbarHeight = height/1.7;
  return (
    <div className='flex flex-col items-center text-center bg-black-custom w-full shadow-xl shadow-black mt-4'>
      <SearchBar onSearch={setSearch} scale={scale} width={width}/>
      <div className='flex flex-col items-center text-center bg-slate-800 rounded-lg mt-8 mb-4'>
        <div className='flex flex-col content-center items-center text-center bg-slate-700 rounded-lg m-2 overflow-y-auto' 
          style={{height: `${ToolbarHeight}px`, width: `${ToolbarWidth}px`}}>
          {images.map(([type, source], index) => (
            <div key={index} style={{margin: `${ToolbarHeight/30}px`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
              <span className='text-slate-400' style={{fontSize: `${scale/4}px`}}>{type.replace('_', ' ')}</span>
              <div className='hover:border-[0.2rem] hover:border-slate-800 shadow-xl shadow-slate-800 rounded-[5px]'
                style={{
                  width: `${scale}px`,
                  boxShadow: '0 5px 2px -1px rgb(35 45 65)',
                }}
              >
                <DraggableImage alt={type} source={source} scale={scale} duplicate={true}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full flex items-center justify-center content-center float-end end-full'>
        <CustomButton action={'Save'} onClick={handleSave} width={ToolbarWidth} height={ToolbarHeight}/>
      </div>
    </div>
  );
}