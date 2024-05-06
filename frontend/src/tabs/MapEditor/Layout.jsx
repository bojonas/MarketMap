import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';
import { addRow, addColumn } from '../../helper/expandLayout'

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const scale = Math.min(width*0.8 / layout[0].length, height*0.8 / layout.length);

  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <div className="flex flex-col items-center">
      <button className="mb-2" onClick={() => setLayout(addRow(layoutCopy, 'top'))}>+</button>
      <div className="flex items-center">
        <button className="mr-2" onClick={() => setLayout(addColumn(layoutCopy, 'left'))}>+</button>
        <div className='grid justify-center w-[70svw] max-w-[70svw] overflow-scroll' style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)` }}>
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
        <button className="ml-2" onClick={() => setLayout(addColumn(layoutCopy, 'right'))}>+</button>
      </div>
      <button className="mt-2" onClick={() => setLayout(addRow(layoutCopy, 'bottom'))}>+</button>
    </div>
  );
}