import React from 'react';
import checkout from './images/checkout.png'
import shelf from './images/shelf.png'

// a object in the cell has a custom size: the size determines how many objects can be in the cell
// the size ranges from 12 to 1. this means if the object is size 12 only one object fits in the cell. if the object is size 6, 2 of these fit in one cell
const Cell = ({type}) => {
  let cellStyle = "flex items-center justify-center";
  //let source = `./images/${type}.png`;
  if (type === "empty") return;

  if (type === "shelf") {
    return <img src={shelf} alt="Shelf"/>;
  } else if (type === "checkout") {
    return <img src={checkout} alt="Checkout"/>;
  }

  return <div className={ cellStyle }></div>;
};

// grid-cols-12 : 84px; grid-cols-6 : 168px
const scale = 12;
function Layout({data}) {
  let grid_style = `grid grid-cols-${scale} gap-[${Math.round(36 / scale)}px]`;
  let cell_scale = Math.round(scale * 7 * (12 / scale) ** 2); // (12 / scale)^2
  let cell_style = ` h-[${cell_scale}px] w-[${cell_scale}px] border-2 border-white content-center`;
  return (
    <div className={grid_style}>
      {data.map((row, i) => (
        <div key={i} className={cell_style}> 
          {row.map((cell, j) => (
            <Cell key={j} type={cell.type}/>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Layout;