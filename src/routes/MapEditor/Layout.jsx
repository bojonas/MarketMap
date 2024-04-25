import React from 'react';
import Cell from './Cell';

export default function Layout({layout, scale, setLayout}) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${layout[0].length}, ${scale}px)`, 
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'auto',
      justifyContent: 'center'
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
