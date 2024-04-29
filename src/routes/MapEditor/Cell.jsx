import React, { useState, useContext } from 'react';
import { useDrop } from 'react-dnd';
import DraggableImage from "../../helper/DraggableImage";
import LoadImage from "../../helper/LoadImage"
import { DimensionContext } from '../../DimensionContext';

export default function Cell({ type, scale, cellCoordinates, setLayout, isVertical }) {
  const [droppedItem, setDroppedItem] = useState(null);

  const cord = cellCoordinates.split('-').map(Number);
  const { isCommandKey } = useContext(DimensionContext);
  // on drop
  const [{ isOver }, drop] = useDrop({
    accept: 'image',
    hover: (item, monitor) => {
      if (!isCommandKey || item.trackedCells.includes(cellCoordinates)) return;
      item.trackedCells.push(cellCoordinates);
    },
    drop: (item, monitor) => {
      setDroppedItem(item);

      const { rootCoordinates } = item;
      // update layout
      setLayout(prevLayout => {
        const newLayout = [...prevLayout];
        // add item to cell 
        newLayout[cord[0]][cord[1]]['type'] = item.alt;

        // remove item from previous cell
        if (!isCommandKey && rootCoordinates) {
          newLayout[rootCoordinates[0]][rootCoordinates[1]]['type'] = 'empty';
          return newLayout;
        }

        // add item for tracked cells if command key is pressed
        for (const cell of item.trackedCells) {
          // ignore current cell
          if (cell === cellCoordinates) continue;

          // ignore root cell
          const c = cell.split('-').map(Number);
          if (rootCoordinates && c[0] === rootCoordinates[0] && c[1] === rootCoordinates[1]) continue;
      
          newLayout[c[0]][c[1]]['type'] = item.alt;
        }
        return newLayout;
      });

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
    border: '2px #171717 solid',
    borderRadius: '5px',
    backgroundColor: '#383838'
  };
  if (isOver) divStyle['backgroundColor'] = '#715DF2';
  if (isVertical) divStyle['transform'] = 'rotate(90deg)';

  return (
    <div ref={drop} style={divStyle}>
      {droppedItem 
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}
          isCommandKey={isCommandKey}
          scale={scale}/>
        : <LoadImage 
          type={type} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem} 
          isCommandKey={isCommandKey} 
          scale={scale}/>
      }
    </div>
  );
}