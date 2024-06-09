import React, { memo, useContext } from 'react';
import { MyMarketContext } from '../../context/MyMarketContext';

const ZoneCellViewer = memo(({ type, cellStyle }) => {
  const { images } = useContext(MyMarketContext);
  const source = images[type];

  return (
    <React.Fragment>
      { type !== 'empty' 
      ? <div className='flex justify-center items-center bg-[#d9d9d9] p-[5%] rounded-[5%] w-full h-full' style={cellStyle}>
          <img draggable='false' src={source} alt={type}/>
        </div>
      : <div className='flex justify-center items-center bg-gray-custom p-[5%] rounded-[5%] w-full h-full' style={cellStyle}/>
      }
    </React.Fragment>
  );
});

export default ZoneCellViewer;