import React, { useRef } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';

export default function MiniMap({ layout, market, setMarket }) {
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  return (
    <div className='flex flex-col justify-center items-center h-full w-[15svh]'>
        <div ref={ref} className='w-[10svw] h-[10svh]'>
          <div onClick={() => setMarket(market)}className='grid w-fit h-fit bg-darkgray-custom overflow-hidden rounded-xl cursor-pointer hover:border-purple-custom border-[0.4svh]' 
            style={{ 
              gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
              gridTemplateRows: `repeat(${layout.length}, ${scale}px)`
            }}>
            {layout.map((row, i) => (
                row.map((cell, j) => (
                  <CellViewer
                    key={cell['coordinates']} 
                    type={cell['type']} 
                    cellStyle={{ 
                      height: `${scale}px`, 
                      width: `${scale}px`, 
                      border: `${scale/10}px solid #171717`,
                      borderRadius: `${scale/5}px`,
                      transform: `rotate(${layout[i][j]['rotation']}deg)`,
                    }}
                  />
              ))
            ))}
          </div>
        </div>
    </div>
  );
}