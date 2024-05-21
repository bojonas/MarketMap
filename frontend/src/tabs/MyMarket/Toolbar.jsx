import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../atoms/SearchBar";
import DraggableImage from '../../atoms/DraggableImage';
import { requestUpdateMapLayout } from '../../requests/myMarketRequests';
import { MapEditorContext, MyMarketContext } from '../../DimensionContext';

export default function Toolbar({ setEditMode }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.toLowerCase().includes(search));
  const { market } = useContext(MyMarketContext);
  const { layout } = useContext(MapEditorContext);

  const handleSave = async () => {
    setEditMode(false);
    if (JSON.stringify(layout) === JSON.stringify(market.map_layout)) return alert('No Changes');
    market.map_layout = layout
    alert(await requestUpdateMapLayout(3, layout));
  }

  return (
    <div className='flex flex-col items-center text-center w-full h-full bg-purple-custom'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'} contrast='purple'/>
      <div className='bg-gray-custom flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='min-h-[60svh] max-h-[60svh]'>
          <div className='grid grid-cols-3 gap-3 text-center rounded-lg m-2 overflow-y-scroll w-[15svw] p-2'>
            {images.map(([type, source], index) => (
              <div key={index} className='bg-offwhite w-fit h-fit flex flex-col items-center rounded-lg border-1 border-gray-custom pb-2 pr-1 pl-1'> 
                <span className='text-black text-[0.6svw]'>{type.replace('_', ' ')}</span>
                <div className='w-3/4 h-fit rounded-lg hover:border-[0.5svh] hover:border-gray-button'
                  style={{ boxShadow: '0 5px 2px -1px #303030' }}>
                  <DraggableImage alt={type} source={source} duplicate={true}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-purple-custom w-full h-full flex gap-5 items-center justify-center content-center float-end end-full'>
        <button onClick={handleSave} className='custom-button bg-offwhite border-offwhite hover:border-darkgray-custom text-black w-[5svw] h-[5svh] text-[2.2svh]'>Save</button>
        <button onClick={() => setEditMode(false)} className='custom-button bg-darkgray-custom border-darkgray-custom hover:border-offwhite w-[5svw] h-[5svh] text-[2.2svh]'>Back</button>
      </div>
    </div>
  );  
}