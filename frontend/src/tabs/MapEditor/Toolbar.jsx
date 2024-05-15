import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../helper/SearchBar";
import CustomButton from '../../helper/CustomButton';
import DraggableImage from '../../helper/DraggableImage';
import { DimensionContext } from '../../DimensionContext';
import { requestUpdateMapLayout } from '../../requests/mapEditorRequests';

export default function Toolbar({ layout }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.toLowerCase().includes(search));
  const { addDuplicate } = useContext(DimensionContext);

  const handleSave = async () => {
    alert(await requestUpdateMapLayout(2, layout));
  }

  return (
    <div className='flex flex-col items-center text-center bg-darkgray-custom w-full h-full'>
      <SearchBar onSearch={setSearch}/>
      <div className='bg-darkoffwhite flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='min-h-[58svh] max-h-[58svh]'>
          <div className='grid grid-cols-2 gap-0 text-center rounded-lg m-2 overflow-y-scroll w-[12svw]'>
            {images.map(([type, source], index) => (
              <div key={index} className='border-darkoffwhite bg-offwhite w-full h-[13svh] flex flex-col items-center rounded-lg border-2 p-1'> 
                <span  className='text-black text-xs'>{type.replace('_', ' ')}</span>
                <div className='w-[4svw] h-fit rounded-lg hover:border-[0.2rem] hover:border-purple-custom hover:shadow-purple-custom'
                  style={{ boxShadow: '0 5px 2px -1px rgb(35 45 65)' }}>
                  <DraggableImage alt={type} source={source} addDuplicate={addDuplicate} duplicate={true}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full flex items-center justify-center content-center float-end end-full'>
        <CustomButton action={'Save'} onClick={handleSave}/>
      </div>
    </div>
  );  
}