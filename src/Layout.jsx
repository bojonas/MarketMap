import React, { useState } from 'react';
import Cell from './Cell';

export default function Layout({layout, height, width}) {
  const columns = layout[0].length;
  const rows = layout.length;

  const scale = Math.round(Math.min(width / columns, height / rows));
  console.log(width/columns, height/rows)
  const [droppedCell, setDroppedCell] = useState(null);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'auto',
      justifyContent: 'center',
    }}>
      {layout.map((row, i) => (
        row.map((cell, j) => (
          <Cell key={cell['id']} type={cell['type']} scale={scale} layout={layout} cellCoordinates={cell['id']}
            droppedCell={droppedCell} setDroppedCell={setDroppedCell} 
          /> 
        ))
      ))}
    </div>
  );
}