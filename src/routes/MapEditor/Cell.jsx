import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { getImages } from "../../helper/getImages";
import DraggableImage from "../../helper/DraggableImage";
import { handleCommandAndDrag } from "../../helper/handleCommandAndDrag";

// loads an image from image folder
function LoadImage({ type, cellCoordinates, setRootCord}) {
  if (type === 'empty') return null;

  const images = getImages();
  const source = images[type];

  return (
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

export default function Cell({ type, scale, layout, cellCoordinates, setLayout }) {
  const [droppedItem, setDroppedItem] = useState(null);
  const [rootCord, setRootCord] = useState(null);
  const [cord, ] = useState(cellCoordinates.split('-'))
  const [initialRender, setInititalRender] = useState(false);
  const [isCommandKey, setIsCommandKey] = useState(false);
  const [, setCells] = useState(new Set());

  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
      if (layout[cord[0]][cord[1]] !== 'empty') setInititalRender(true);

      setDroppedItem(item);

      // set cells on drop here
      if (isCommandKey) {
        setCells(prevCells => {
          const newCells = new Set(prevCells);
          newCells.add(cellCoordinates);
          return newCells;
        }); 
      }

      return { name: type };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
  });

  // check for command or ctrl keydown
  useEffect(() => {
    const handleCommandAndDragWithState = (e) => {
      // ignore keydown and keyup events from input fields
      if (e.target.tagName.toLowerCase() === 'input') {
        return;
      }
    
      handleCommandAndDrag(e, setIsCommandKey);
    };
    
    window.addEventListener('keydown', handleCommandAndDragWithState);
    window.addEventListener('keyup', handleCommandAndDragWithState);
    return () => {
      window.removeEventListener('keydown', handleCommandAndDragWithState);
      window.removeEventListener('keyup', handleCommandAndDragWithState);
    };
  }, []);

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
    if (droppedItem && typeof setLayout === 'function') {
      setLayout(prevLayout => {
        const newLayout = [...prevLayout]; 
        newLayout[cord[0]][cord[1]]['type'] = droppedItem.alt;
        return newLayout;
      }); 
    }
  }, [droppedItem, cord, setLayout]);  

  // remove item from cell
  useEffect(() => {
    if (rootCord && typeof setLayout === 'function') {
      setLayout(prevLayout => {
        const newLayout = [...prevLayout]; 
        newLayout[rootCord[0]][rootCord[1]]['type'] = 'empty';
        return newLayout;
      }); 
    }
  }, [rootCord, setLayout]);

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
          setCells={setCells}
          isCommandKey={isCommandKey}
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