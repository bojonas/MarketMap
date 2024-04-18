import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { getImages } from "./helper/getImages";
import DraggableImage from "./helper/DraggableImage";

// loads an image from image folder
function LoadImage({ type, cellCoordinates, setRootCord}) {
  const images = getImages();
  const source = images[type];

  return type === 'empty' ? null :(
      <DraggableImage 
        source={source} 
        alt={type} 
        cellCoordinates={cellCoordinates} 
        onDragEnd={(cords) => {
          setRootCord(cords);
        }}
      />
  );
}

export default function Cell({ type, scale, layout, cellCoordinates }) {
  const [droppedItem, setDroppedItem] = useState(null);
  const [, setNewLayout] = useState(layout);
  const [rootCord, setRootCord] = useState(null)
  const [initialRender, setInititalRender] = useState(false);

  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
      const c = cellCoordinates.split('-');
      if (layout[c[0]][c[1]] !== 'empty') setInititalRender(true);

      setDroppedItem(item);
      return { name: type };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
  });

  let divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${scale}px`,
    width: `${scale}px`,
    border: '2px rgb(30 41 59) solid',
  };
  if (isOver) divStyle['backgroundColor'] = '#3db897';

  // add image type to layout array
  useEffect(() => {
    if (droppedItem) {
      const cord = cellCoordinates.split('-');
      setNewLayout(prevLayout => {
        const newLayout = [...prevLayout]; 
        newLayout[cord[0]][cord[1]]['type'] = droppedItem.alt;
        return newLayout;
      }); 
    }
  }, [droppedItem, cellCoordinates]);  

  // remove item from cell
  useEffect(() => {
    if (rootCord) {
      const cord = rootCord.split('-');
      setNewLayout(prevLayout => {
        const newLayout = [...prevLayout]; 
        newLayout[cord[0]][cord[1]]['type'] = 'empty';
        return newLayout;
      }); 
    }
  }, [rootCord]);

  return (
    <div ref={drop} style={divStyle}>
      {droppedItem
        ? 
        <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cellCoordinates} 
          onDragEnd={(cords) => {
            setRootCord(cords);
            // reset dropped item
            setDroppedItem(null);
          }} 
        />
        : initialRender
        ? null
        :
        <LoadImage 
          type={type} 
          cellCoordinates={cellCoordinates} 
          setRootCord={setRootCord} 
        />
      }
    </div>
  );
}