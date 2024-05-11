import React, { useContext, useState } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';

export default function Layout({ layout, setLayout, zoom }) {
  const { height, width } = useContext(DimensionContext);
  const [scale, ] = useState(Math.min(width*0.75 / layout[0].length, height*0.7 / layout.length));

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div className='w-[70svw] h-[75svh] overflow-scroll bg-slate-800 border-[1svh] border-slate-800'>
          <div className='grid w-fit h-fit' style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
            gridTemplateRows: `repeat(${layout.length}, ${scale}px)`, transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
            {layout.map((row) => (
              row.map((cell) => (
                <Cell 
                  key={cell['coordinates']} 
                  type={cell['type']} 
                  scale={scale} 
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