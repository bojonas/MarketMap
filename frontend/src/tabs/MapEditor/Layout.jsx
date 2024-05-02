import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const scale = Math.round(Math.min(width*0.8 / layout[0].length, height*0.8 / layout.length));
  return (
    <div className='grid overflow-auto justify-center w-fit h-fit' style={{ gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)` }}>
      {layout.map((row) => (
        row.map((cell) => (
          <Cell 
            key={cell['id']} 
            type={cell['type']} 
            scale={scale} 
            layout={layout} 
            cellCoordinates={cell['id']}
            setLayout={setLayout}
          /> 
        ))
      ))}
    </div>
  );
}
