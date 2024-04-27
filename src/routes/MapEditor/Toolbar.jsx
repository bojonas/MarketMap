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

  const { width, height } = useContext(DimensionContext);
  const scale = Math.round(Math.min(width/layout[0].length, height/layout.length));
  const ToolbarScale = Math.min(width, height);
  return (
    <div className='flex flex-col items-center text-center bg-black-custom w-full shadow-xl shadow-black'>
      <SearchBar onSearch={setSearch} scale={ToolbarScale} width={width} height={height}/>
      <div className='bg-slate-800 flex flex-col items-center text-center h-full rounded-lg'
        style={{margin: `${height/30}px`}}>
        <div className='flex flex-col content-center items-center text-center bg-slate-800 rounded-lg m-2 overflow-y-scroll' 
          style={{maxHeight: `${height/1.7}px`, width: `${width/6}px`}}>
          {images.map(([type, source], index) => (
            <div key={index} 
              className={`bg-slate-700 w-full flex items-center flex-col border-slate-800 ${index === 0 ? 'border-b-2' : index === images.length - 1 ? 'border-t-2' : 'border-t-2 border-b-2'} rounded-lg`}
              style={{padding: `${ToolbarScale/50}px`}}> 
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
        <CustomButton action={'Save'} onClick={handleSave} scale={ToolbarScale}/>
      </div>
    </div>
  );
}