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
    alert(await requestUpdateMapLayout(3, layout));
    setEditMode(false);
  }

  return (
    <div className='flex flex-col items-center text-center w-full h-full bg-purple-custom'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'}/>
      <div className='bg-gray-custom flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='min-h-[58svh] max-h-[58svh]'>
          <div className='grid grid-cols-3 gap-3 text-center rounded-lg m-2 overflow-y-scroll w-[15svw] p-2'>
            {images.map(([type, source], index) => (
              <div key={index} className='bg-offwhite w-fit h-fit flex flex-col items-center rounded-lg border-1 border-gray-custom pb-2 pr-1 pl-1'> 
                <span className='text-black text-xs'>{type.replace('_', ' ')}</span>
                <div className='w-3/4 h-fit rounded-lg hover:border-[0.5svh] hover:border-gray-button'
                  style={{ boxShadow: '0 5px 2px -1px #303030' }}>
                  <DraggableImage alt={type} source={source} duplicate={true}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-purple-custom w-full h-full flex gap-6 items-center justify-center content-center float-end end-full'>
        <button onClick={handleSave} className='custom-button bg-offwhite border-offwhite hover:border-darkgray-custom text-black w-[5svw] h-[5svh] text-[2.2svh]'>Save</button>
        <button onClick={() => setEditMode(false)} className='custom-button bg-darkgray-custom border-darkgray-custom hover:border-offwhite w-[5svw] h-[5svh] text-[2.2svh]'>Back</button>
      </div>
    </div>
  );  
}