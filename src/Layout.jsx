import React, { useState } from 'react';
import { getImages } from './Toolbar';
import { useDrop } from 'react-dnd';

const Cell = ({ type }) => {
  const images = getImages();
  const source = images[type];
  const [droppedItem, setDroppedItem] = useState(null);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
      setDroppedItem(item);
      return { name: type };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  let backgroundColor;
  if (canDrop) backgroundColor = '#4a4aff';
  if (isOver) backgroundColor = 'red';

  return (
    <div ref={drop} style={{ backgroundColor }}> 
      {droppedItem 
        ? <img src={droppedItem.source} alt={droppedItem.type} /> 
        : <img src={source} alt={type} />
      }
    </div>
  );
};

export default function Layout({layout, height, width}) {
  const columns = layout[0].length;
  const rows = layout.length;

  // calculate the scale based on the window size and the number of columns
  const scale = Math.round(Math.min(width / columns, height / rows));

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'image',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  let backgroundColor;
  if (canDrop) backgroundColor = 'blue';
  if (isOver) backgroundColor = 'red';

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
          <div ref={drop} key={`${i}-${j}`} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${scale}px`,
            width: `${scale}px`,
            border: '2px rgb(30 41 59) solid',
            backgroundColor: backgroundColor,
          }}>
            <Cell key={j} type={cell}/>
          </div>
        ))
      ))}
    </div>
  );
};