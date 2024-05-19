import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../atoms/SearchBar";
import DraggableImage from '../../atoms/DraggableImage';
import { requestUpdateMapLayout } from '../../requests/myMarketRequests';
import { MyMarketContext } from '../../DimensionContext';

export default function Toolbar({ layout, setEditMode }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.toLowerCase().includes(search));
  const market = useContext(MyMarketContext);

  const handleSave = async () => {
    market.map_layout = layout
    alert(await requestUpdateMapLayout(2, layout));
    setEditMode(false);
  }

  return (
    <div className='flex flex-col items-center text-center bg-darkgray-custom w-full h-full'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'}/>
      <div className='bg-darkoffwhite flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='min-h-[58svh] max-h-[58svh]'>
          <div className='grid grid-cols-2 gap-0 text-center rounded-lg m-2 overflow-y-scroll w-[15svw]'>
            {images.map(([type, source], index) => (
              <div key={index} className='border-darkoffwhite bg-offwhite w-full h-fit flex flex-col items-center rounded-lg border-2 p-1 pb-3'> 
                <span className='text-black text-xs'>{type.replace('_', ' ')}</span>
                <div className='w-[4svw] h-fit rounded-lg hover:border-[0.2rem] hover:border-purple-custom hover:shadow-purple-custom'
                  style={{ boxShadow: '0 5px 2px -1px rgb(35 45 65)' }}>
                  <DraggableImage alt={type} source={source} duplicate={true}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-purple-custom w-full h-full flex gap-6 items-center justify-center content-center float-end end-full'>
        <button onClick={handleSave} className='custom-button bg-offwhite border-offwhite hover:border-darkgray-custom text-black w-[6svw] h-[6svh] text-[2.6svh]'>Save</button>
        <button onClick={() => setEditMode(false)} className='custom-button bg-darkgray-custom border-darkgray-custom hover:border-offwhite shadow-slate-400 w-[6svw] h-[6svh] text-[2.6svh]'>Back</button>
      </div>
    </div>
  );  
}