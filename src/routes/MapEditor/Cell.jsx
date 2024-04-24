import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableImage from "../../helper/DraggableImage";
import { useTrackCommand } from "../../helper/useTrackCommand";
import LoadImage from "../../helper/LoadImage"

var trackedCells = [];
export default function Cell({ type, scale, cellCoordinates, setLayout }) {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isCommandKey, setIsCommandKey] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  const cord = cellCoordinates.split('-')
  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    drop: (item, monitor) => {
      setDroppedItem(item);

      const { rootCoordinates } = item;
      // update layout
      setLayout(prevLayout => {
        const newLayout = [...prevLayout];
        // remove item previous cell
        if (!isCommandKey && rootCoordinates) newLayout[rootCoordinates[0]][rootCoordinates[1]]['type'] = 'empty'
        else {
           // add item for tracked cells if command key is pressed
          for (const cell of new Set(trackedCells)) {
            // ignore current cell
            if (cell === cellCoordinates) continue;

            const c = cell.split('-');
            // ignore root cell
            if (c[0] === rootCoordinates[0] && c[1] === rootCoordinates[1]) continue;
        
            newLayout[c[0]][c[1]]['type'] = item.alt;
          }
        }
        // add item to cell 
        newLayout[cord[0]][cord[1]]['type'] = item.alt;
        return newLayout;
      });
      trackedCells = [];

      // check item alignment
      if (isVertical) setIsVertical(true);

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
    borderRadius: '5px',
  };
  if (isOver) divStyle['backgroundColor'] = '#715DF2';

  // track if command key is pressed
  useTrackCommand(setIsCommandKey);

  useEffect(() => {
    if (isCommandKey && isOver) trackedCells.push(cellCoordinates);
  }, [isCommandKey, isOver, cellCoordinates])

  return (
    <div ref={drop} style={divStyle}>
      {droppedItem 
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cellCoordinates} 
          setDroppedItem={setDroppedItem}
          isCommandKey={isCommandKey}/>
        : <LoadImage type={type} cellCoordinates={cellCoordinates} setDroppedItem={setDroppedItem} isCommandKey={isCommandKey}/>
      }
    </div>
  );
}