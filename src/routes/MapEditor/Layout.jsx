import React, { useState } from 'react';
import Cell from './Cell';

var scale;
export default function Layout({layout, height, width, setLayout}) {
  const [droppedCell, setDroppedCell] = useState(null);

  const columns = layout[0].length;
  const rows = layout.length;
  scale = Math.round(Math.min(width / columns, height / rows));

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'auto',
      justifyContent: 'center'
    }}>
      {layout.map((row) => (
        row.map((cell) => (
          <Cell key={cell['id']} type={cell['type']} scale={scale} layout={layout} cellCoordinates={cell['id']}
            droppedCell={droppedCell} setDroppedCell={setDroppedCell} setLayout={setLayout}
          /> 
        ))
      ))}
    </div>
  );
}

export function getScale() {
  return scale;
}