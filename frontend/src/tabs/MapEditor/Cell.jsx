import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../helper/DraggableImage";
import LoadImage from "../../helper/LoadImage"
import { DimensionContext } from '../../DimensionContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, scale, cellCoordinates, setLayout }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const cord = cellCoordinates.split('-').map(Number);
  const { addDuplicate, trackedCells, setTrackedCells } = useContext(DimensionContext);
  const handleDragOver = (e) => {
    e.preventDefault();
    if (addDuplicate && !trackedCells.includes(cellCoordinates)) {
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

    if (rootCoordinates && isEqualArray(cord, rootCoordinates)) {
      return;
    }

    // update layout
    setLayout(prevLayout => {
      const newLayout = [...prevLayout];

      // add item to cell 
      newLayout[cord[0]][cord[1]]['type'] = item.alt;

      // remove item from previous cell
      if (!addDuplicate && rootCoordinates) {
        newLayout[rootCoordinates[0]][rootCoordinates[1]]['type'] = 'empty';
        return newLayout;
      }

      // add item for tracked cells if command key is pressed
      for (const cell of trackedCells) {
        // ignore current cell
        if (cell === cellCoordinates) continue;

        // ignore root cell
        const c = cell.split('-').map(Number);
        if (rootCoordinates && isEqualArray(c, rootCoordinates)) continue;
    
        newLayout[c[0]][c[1]]['type'] = item.alt;
      }
      return newLayout;
    });

    return { name: type };
  };

  // useMemo?
  let divStyle = {
    height: `${scale}px`,
    width: `${scale}px`,
    border: `${scale/10}px solid rgb(16 16 16)`,
    borderRadius: `${scale/5}px`
  };
  if (type !== 'empty') divStyle['backgroundColor'] = '#d9d9d9';
  if (isOver) divStyle['backgroundColor'] = '#715DF2';

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className='flex justify-center items-center bg-[#4e4e4e7a] p-[0.1rem]' style={divStyle}>
      {droppedItem 
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}
          addDuplicate={addDuplicate}/>
        : <LoadImage 
          type={type} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem} 
          addDuplicate={addDuplicate}/>
      }
    </div>
  );
});

export default Cell;