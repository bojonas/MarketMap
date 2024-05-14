import React, { memo } from 'react';
import { getItemImages } from '../../helper/getItemImages';

const CellViewer = memo(({ type, scale }) => {
  let divStyle = {
    height: `${scale}px`,
    width: `${scale}px`,
  };

  const images = getItemImages();
  const source = images[type];
  return (
    <React.Fragment>
      {type !== 'empty' 
      ? <div className='flex justify-center items-center bg-[#d9d9d9]' style={divStyle}>
          <img draggable='false' src={source} alt={type}/>
      </div>
      : <div className='flex justify-center items-center bg-[#4e4e4e7a]'/>
      }
    </React.Fragment>
  );
});

export default CellViewer;