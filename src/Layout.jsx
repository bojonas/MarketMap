import React from 'react';
import { getImages } from './Toolbar';

const Cell = ({ type }) => {
  if (type === 'empty') return null;

  const images = getImages();
  const source = images[type];

  return (
    <img src={source} alt={type} />
  );
};

function Layout({layout, height, width}) {
  const columns = layout[0].length;
  const rows = layout.length;

  // calculate the scale based on the window size and the number of columns
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
          <div key={`${i}-${j}`} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${scale}px`,
            width: `${scale}px`,
            border: '2px rgb(30 41 59) solid',
          }}>
            <Cell key={j} type={cell}/>
          </div>
        ))
      ))}
    </div>
  );
};

export default Layout;