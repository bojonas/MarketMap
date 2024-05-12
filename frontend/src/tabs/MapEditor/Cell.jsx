import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../helper/DraggableImage";
import LoadImage from "../../helper/LoadImage"
import { DimensionContext } from '../../DimensionContext';

const Cell = memo(({ type, scale, zoom, cellCoordinates, setLayout }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const cord = cellCoordinates.split('-').map(Number);
  const { isCommandKey, trackedCells, setTrackedCells } = useContext(DimensionContext);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isCommandKey && !trackedCells.includes(cellCoordinates)) {
      setTrackedCells([...trackedCells, cellCoordinates]);
    }
    setIsOver(true);
  };  

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);

    const item = JSON.parse(e.dataTransfer.getData('application/json'));
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
      for (const cell of trackedCells) {
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
  };

  let divStyle = {
    height: `${scale}px`,
    width: `${scale}px`,
    border: `${scale/25}px solid rgb(30 41 59)`,
    borderRadius: `${scale/10}px`
  };
  if (isOver) divStyle['backgroundColor'] = '#715DF2';

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className='flex justify-center items-center border-slate-800 bg-slate-700' style={divStyle}>
      {droppedItem 
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}
          isCommandKey={isCommandKey}
          scale={scale*zoom}/>
        : <LoadImage 
          type={type} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem} 
          isCommandKey={isCommandKey} 
          scale={scale*zoom}/>
      }
    </div>
  );
});

export default Cell;