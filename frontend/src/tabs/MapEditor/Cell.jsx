import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { DimensionContext } from '../../DimensionContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, scale, cellCoordinates, setLayout }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const cord = cellCoordinates.split('-').map(Number);
  const { trackedCells, setTrackedCells, duplicateMode, deleteMode } = useContext(DimensionContext);

  const handleDragOver = (e) => {
    e.preventDefault();
    if ((duplicateMode || deleteMode) && !trackedCells.includes(cellCoordinates))  setTrackedCells([...trackedCells, cellCoordinates]);
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

    if (rootCoordinates && isEqualArray(cord, rootCoordinates)) {
      return;
    }

    // update layout
    setLayout(prevLayout => {
      const newLayout = [...prevLayout];

      // add item to cell 
      newLayout[cord[0]][cord[1]]['type'] = item.alt;

      // remove item from previous cell
      if (!duplicateMode && rootCoordinates) {
        newLayout[rootCoordinates[0]][rootCoordinates[1]]['type'] = 'empty';
      }

      // add item for tracked cells if command key is pressed
      for (const cell of trackedCells) {
        const c = cell.split('-').map(Number);
        // skip root cell
        if (rootCoordinates && isEqualArray(c, rootCoordinates)) continue;
        if (deleteMode) {
          newLayout[c[0]][c[1]]['type'] = 'empty';
        } else {
          // ignore current cell
          if (cell === cellCoordinates) continue;

          newLayout[c[0]][c[1]]['type'] = item.alt;
        }
      }
      return newLayout;
    });

    return { name: type };
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className='flex justify-center items-center p-[0.1rem]' 
      style={{
        height: `${scale}px`,
        width: `${scale}px`,
        border: `${scale/10}px solid rgb(16 16 16)`,
        borderRadius: `${scale/5}px`,
        cursor: duplicateMode ? 'copy' : deleteMode ? 'not-allowed' : 'auto',
        backgroundColor: isOver ? '#715DF2' : type !== 'empty' ? '#d9d9d9' : '#4e4e4e7a'
      }}>
      {type === 'empty' ? null
      : droppedItem
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}
          duplicateMode={duplicateMode}/>
        : <LoadImage 
          type={type} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}/>
      }
    </div>
  );
});

export default Cell;