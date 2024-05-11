import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const rowCount = layout.length;
  const colCount = layout[0].length;
  const scale = Math.min(
    width*0.8 / colCount, 
    height*0.8 / rowCount
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div className='grid w-[70svw] max-w-[70svw] h-[75svh] max-h-[75svh] overflow-scroll bg-slate-800 border-[1svh] border-slate-800' 
          style={{ gridTemplateColumns: `repeat(${colCount}, ${scale}px)`, gridTemplateRows: `repeat(${rowCount}, ${scale}px)` }}>
        {layout.map((row) => (
          row.map((cell) => (
            <Cell 
              key={cell['coordinates']} 
              type={cell['type']} 
              scale={scale} 
              layout={layout} 
              cellCoordinates={cell['coordinates']}
              setLayout={setLayout}
              rowCount={rowCount}
              colCount={colCount}
            /> 
          ))
        ))}
        </div>
      </div>
    </div>
  );
}