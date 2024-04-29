import React, { useContext } from 'react';
import Cell from './Cell';
import { DimensionContext } from '../../DimensionContext';

export default function Layout({ layout, setLayout }) {
  const { height, width } = useContext(DimensionContext);
  const scale = Math.round(Math.min(width*0.9 / layout[0].length, height*0.9 / layout.length));
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
      overflow: 'auto',
      justifyContent: 'center',
    }}>
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
