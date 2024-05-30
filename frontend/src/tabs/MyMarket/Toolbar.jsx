import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../atoms/SearchBar";
import DraggableImage from '../../atoms/DraggableImage';
import { requestUpdateMapLayout } from '../../requests/myMarketRequests';
import { MapEditorContext } from '../../context/MapEditorContext';
import { MyMarketContext } from '../../context/MyMarketContext';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";

export default function Toolbar({ setEditMode }) {
  const user_id = localStorage.getItem('user_id')
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.toLowerCase().includes(search));
  const market = useContext(MyMarketContext);
  const { layout } = useContext(MapEditorContext);

  const handleSave = async () => {
    setEditMode(false);
    if (JSON.stringify(layout) === JSON.stringify(market.map_layout)) return alert('No Changes');
    market.map_layout = layout
    alert(await requestUpdateMapLayout(user_id, layout));
  }

  return (
    <div className='flex flex-col items-center text-center w-full h-full bg-purple-custom'>
      <SearchBar onSearch={setSearch} placeholder={'Search items...'} contrast='purple'/>
      <div className='bg-gray-custom flex flex-col items-center text-center h-full rounded-lg mt-[5svh]'>
        <div className='min-h-[65svh] max-h-[60svh]'>
          <div className='grid grid-cols-3 gap-[5%] text-center rounded-lg m-2 overflow-y-scroll w-[15svw] p-[2%]'>
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
      <div className='w-full h-full flex gap-[5%] items-center justify-center content-center float-end end-full'>
        <div onClick={() => setEditMode(false)} className='custom-button flex items-center justify-center gap-[10%] bg-darkgray-custom border-darkgray-custom hover:border-offwhite h-[5.5svh] text-[2.2svh] cursor-pointer'>
          <IoArrowBack size={25}/>
          <p>Back</p>
        </div>
        <div onClick={handleSave} className='custom-button flex items-center justify-center gap-[10%] bg-offwhite border-offwhite hover:border-darkgray-custom text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>
          <FaRegSave size={25} />
          <p>Save</p>
        </div>
      </div>
    </div>
  );  
}