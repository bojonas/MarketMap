import React, { useRef, useLayoutEffect } from 'react';
import Cell from './Cell';
import { useAdjustScale } from '../../helper/useAdjustScale';

export default function Layout({ layout, setLayout, setScale, zoom }) {
  const ref = useRef(null);
  const { width, height } = useAdjustScale(ref);
  const scale = Math.min(width/ layout[0].length, height / layout.length);

  useLayoutEffect(() => {
      setScale(scale);
  }, [scale, setScale]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div ref={ref} className='w-[70svw] h-[75svh] bg-slate-800 border-[1svh] border-slate-800 overflow-scroll'>
          <div id='layoutContainer' className='grid w-fit h-fit' style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
            gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
            {layout.map((row) => (
              row.map((cell) => (
                <Cell 
                  key={cell['coordinates']} 
                  type={cell['type']} 
                  scale={scale} 
                  zoom={zoom}
                  layout={layout} 
                  cellCoordinates={cell['coordinates']}
                  setLayout={setLayout}
                /> 
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}