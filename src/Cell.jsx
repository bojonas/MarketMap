import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { getImages } from "./helper/getImages";
import DraggableImage from "./helper/DraggableImage";

// loads an image from image folder
function LoadImage({ type }) {
  const images = getImages();
  const source = images[type];

  return type === 'empty' ? null :(
      <DraggableImage source={source} alt={type} />
  );
};

export default function Cell({ type, scale, layout, cellCoordinates }) {
  const [droppedItem, setDroppedItem] = useState(null);
  
  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
      setDroppedItem(item);
      return { name: type };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
  });

  let backgroundColor;
  if (isOver) backgroundColor = '#3db897';

  if (droppedItem) {
    const cord = cellCoordinates.split('-');
    layout[cord[0]][cord[1]]['type'] = droppedItem.alt;
  }

  return (
    <div ref={drop} style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: `${scale}px`,
      width: `${scale}px`,
      border: '2px rgb(30 41 59) solid',
      backgroundColor: backgroundColor,
    }}>
      {droppedItem
        ?<DraggableImage source={droppedItem.source} alt={droppedItem.alt} cellCoordinates={cellCoordinates} 
          onDragEnd={(cords) => {
            // remove item from cell
            const cord = cords.split('-');
            layout[cord[0]][cord[1]]['type'] = 'empty';
            console.log(layout)

            setDroppedItem(null);
          }}/>
        : <LoadImage type={type} />
      }
    </div>
  );
}