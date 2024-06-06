import React, { useRef } from 'react';
import { useAdjustScale } from '../hooks/useAdjustScale';
import { getItemImages } from '../helper/getItemImages';

export default function ZoneViewer({ layout, rows, columns }) {
    const ref = useRef(null);
    const { width, height } = useAdjustScale(ref);
    const scale = Math.min(width/ columns, height / rows);  

    return (
        <div ref={ref} className='w-[20svw] h-[40svh] p-[1svh] flex flex-col items-center justify-center'>
            <div className='grid items-center justify-center content-center w-full h-full'
                style={{ 
                    gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
                    gridTemplateRows: `repeat(${rows}, ${scale}px)`
                }}>
                { layout.map((row, i) => (
                    row.map((cell, j) => {
                        return (
                            <div key={j}>
                                { cell.filled && <ZoneCellViewer 
                                    type={cell.type}
                                    cellStyle={{ 
                                        height: `${scale}px`, 
                                        width: `${scale}px`, 
                                        border: `${scale/10}px solid #171717`,
                                        borderRadius: `${scale/5}px`,
                                    }}
                                />}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );     
};

const ZoneCellViewer = React.memo(({ type, cellStyle }) => {
  const images = getItemImages();
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