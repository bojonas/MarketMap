import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { getImages } from "../../helper/getImages";
import DraggableImage from "../../helper/DraggableImage";
import { useTrackCommand } from "../../helper/useTrackCommand";

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

export default function Cell({ type, scale, cellCoordinates, setLayout }) {
  const [droppedItem, setDroppedItem] = useState(null);
  const [rootCord, setRootCord] = useState(null);
  const [cord, ] = useState(cellCoordinates.split('-'))
  const [isCommandKey, setIsCommandKey] = useState(false);
  const [cells, setCells] = useState([]);

  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item) => {
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

  // track if command key is pressed
  useTrackCommand(setIsCommandKey);

  let divStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${scale}px`,
    width: `${scale}px`,
    border: '2px rgb(30 41 59) solid',
    borderRadius: '5px',
  };
  if (isOver) divStyle['backgroundColor'] = '#715DF2';

  // add image type to layout array
  useEffect(() => {
    if (droppedItem) {
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

  // track command and drag cells
  useEffect(() => {
    if (isOver && isCommandKey) {
      // add new cells
      setCells(prevCells => [...prevCells, cellCoordinates]); 
    }
  }, [isOver, isCommandKey, cellCoordinates]);

  if (cells.length > 0) console.log(new Set(cells))

  return (
    <div ref={drop} style={divStyle}>
      {droppedItem && cord && rootCord && cord[0] !== rootCord[0] && cord[0] !== rootCord[0]
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cellCoordinates} 
          onDragEnd={(cords) => {
            setRootCord(cords);
            // reset dropped item
            setDroppedItem(null);
          }} 
        />
        : <LoadImage 
          type={type} 
          cellCoordinates={cellCoordinates} 
          setRootCord={setRootCord} 
        />
      }
    </div>
  );
}