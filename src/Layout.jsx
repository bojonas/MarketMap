import React from 'react';
import Cell from './Cell';

export default function Layout({layout, height, width}) {
  const columns = layout[0].length;
  const rows = layout.length;

  const scale = Math.round(Math.min(width / columns, height / rows));
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, ${scale}px)`, 
      maxWidth: '100vw',
      maxHeight: '100vh',
      overflow: 'auto',
    }}>
      {layout.map((row, i) => (
        row.map((cell, j) => (
          <Cell key={`${i}-${j}`} type={cell} scale={scale} />
        ))
      ))}
    </div>
  );
};