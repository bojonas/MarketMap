import React, { useRef, useEffect, useState } from 'react';
import { useAdjustScale } from '../../hooks/useAdjustScale';
import CellViewer from './CellViewer';

export default function MiniMap({ layout }) {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '10svw', height: '10svh' });
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  // update dimensions after initial render
  useEffect(() => {
    setDimensions({ width: 'fit-content', height: 'fit-content' });
  }, []);  

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='overflow-hidden' style={dimensions}>
          <div className='grid w-fit h-fit bg-darkgray-custom overflow-hidden rounded-xl' 
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
                      borderRadius: `${scale/5}px`
                    }}
                  />
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}