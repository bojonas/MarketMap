import React, { useContext, useState } from 'react';
import { getItemImages } from "../../helper/getItemImages";
import SearchBar from "../../helper/SearchBar";
import CustomButton from '../../helper/CustomButton';
import DraggableImage from '../../helper/DraggableImage';
import { DimensionContext } from '../../DimensionContext';
import { requestUpdateMapLayout } from '../../requests/mapEditorRequests';

export default function Toolbar({ layout, layoutScale }) {
  const [search, setSearch] = useState('');
  const images = Object.entries(getItemImages()).filter(([type]) => type.includes(search));

  const handleSave = async () => {
    alert(await requestUpdateMapLayout(2, layout));
  }

  const { isCommandKey } = useContext(DimensionContext);
  return (
    <div className='flex flex-col items-center text-center bg-darkgray-custom w-full h-full ml-10'>
      <SearchBar onSearch={setSearch}/>
      <div className='bg-slate-800 flex flex-col items-center text-center h-full rounded-lg m-[5svh]'>
        <div className='flex flex-col content-center items-center text-center rounded-lg m-2 overflow-y-scroll min-h-[58svh] max-h-[58svh] w-[11svw]'>
          {images.map(([type, source], index) => (
            <div key={index} className={`bg-slate-700 w-full flex items-center flex-col border-slate-800 rounded-lg p-[1.6svh] 
              ${index === 0 ? 'border-b-2' : index === images.length-1 ? 'border-t-2' : 'border-2'}`}> 
              <span style={{fontSize: '2svh'}}>{type.replace('_', ' ')}</span>
              <div className='rounded-md hover:border-[0.2rem] hover:border-purple-custom hover:shadow-purple-custom'
                style={{ width: '4svw', height: '8svh', boxShadow: '0 5px 2px -1px rgb(35 45 65)' }}>
                <DraggableImage alt={type} source={source} isCommandKey={isCommandKey} duplicate={true} scale={layoutScale}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='bg-gray-custom w-full h-full flex items-center justify-center content-center float-end end-full'>
        <CustomButton action={'Save'} onClick={handleSave}/>
      </div>
    </div>
  );
}