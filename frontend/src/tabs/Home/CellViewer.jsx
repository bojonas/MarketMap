import React, { memo } from 'react';
import { getItemImages } from '../../helper/getItemImages';

const CellViewer = memo(({ type, cellStyle }) => {
  const images = getItemImages();
  const source = images[type];
  return (
    <React.Fragment>
      {type !== 'empty' 
      ? <div className='flex justify-center items-center bg-[#d9d9d9] p-[5%]' style={cellStyle}>
          <img draggable='false' src={source} alt={type}/>
      </div>
      : <div className='flex justify-center items-center bg-[#4e4e4e7a] p-[5%]' style={cellStyle}/>
      }
    </React.Fragment>
  );
});

export default CellViewer;

