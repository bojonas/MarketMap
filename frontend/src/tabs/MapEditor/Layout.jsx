import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';
import { addRow, addColumn } from '../../helper/expandLayout'

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const scale = Math.round(Math.min(width*0.8 / layout[0].length, height*0.8 / layout.length));

  const layoutCopy = JSON.parse(JSON.stringify(layout));
  return (
    <div>
      <button onClick={() => setLayout(addRow(layoutCopy, 'top'))}>↑</button>
      <button onClick={() => setLayout(addColumn(layoutCopy, 'left'))}>←</button>
      <div className='grid overflow-auto justify-center w-fit h-fit' style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)` }}>
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
      <button onClick={() => setLayout(addColumn(layoutCopy, 'right'))}>→</button>
      <button onClick={() => setLayout(addRow(layoutCopy, 'bottom'))}>↓</button>
    </div>
  );
}