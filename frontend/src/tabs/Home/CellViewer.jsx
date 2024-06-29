import React, { memo } from 'react';

const CellViewer = memo(({ type, source, cellStyle, imgStyle }) => {
  return (
    <React.Fragment>
      { type !== 'empty' 
      ? <div className='flex justify-center items-center bg-[#d9d9d9] p-[5%]' style={cellStyle}>
          <img draggable='false' src={source} alt={type} style={imgStyle}/>
      </div>
      : <div className='flex justify-center items-center bg-gray-custom p-[5%]' style={cellStyle}/>
      }
    </React.Fragment>
  );
});

export default CellViewer;

