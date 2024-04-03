import React from 'react';

// a object in the cell has a custom size: the size determines how many objects can be in the cell
// the size ranges from 12 to 1. this means if the object is size 12 only one object fits in the cell. if the object is size 6, 2 of these fit in one cell
const Cell = ({type}) => {
  if (type === 'empty') return;

  const imageContext = require.context('./images', false, /\.png$/);

  const images = imageContext.keys().reduce((images, path) => {
    // remove the './' from the beginning of the path and the '.png' from the end
    const imageName = path.slice(2, -4);
    images[imageName] = imageContext(path);
    return images;
  }, {});

  const source = images[type]

  return <img src={source} alt={type}/>
};

function Layout({layout, height, width}) {
  const columns = layout[0].length;
  const rows = layout.length;

  // calculate the scale based on the window size and the number of columns
  const scale = Math.round(Math.min(width / columns, height / rows));
  console.log(width, columns, height, rows)

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
            height: `${scale}px`,
            width: `${scale}px`,
            border: '2px rgb(30 41 59) solid',
            alignContent: 'center'
          }}>
            <Cell key={j} type={cell}/>
          </div>
        ))
      ))}
    </div>
  );
};

export default Layout;