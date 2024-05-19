import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { MapEditorContext } from '../../DimensionContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, scale, cellCoordinates, setLayout }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const cord = cellCoordinates.split('-').map(Number);
  const { duplicateCells, setDuplicateCells, deleteCells, setDeleteCells, duplicateMode, deleteMode } = useContext(MapEditorContext);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (duplicateMode && !duplicateCells.includes(cellCoordinates)) setDuplicateCells([...duplicateCells, cellCoordinates]);
    if (deleteMode && !deleteCells.includes(cellCoordinates)) setDeleteCells([...deleteCells, cellCoordinates]);
    setIsOver(true);
  };  

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    
    let imageData = e.dataTransfer.getData('application/json')
    if (!imageData) return;

    const item = JSON.parse(imageData);
    setDroppedItem(deleteCells.length === 0 ? item : null);

    const { rootCoordinates } = item;
    if (rootCoordinates && isEqualArray(cord, rootCoordinates)) {
      return;
    }
    // update layout
    setLayout(prevLayout => {
      const newLayout = [...prevLayout];

      // add item to current cell 
      newLayout[cord[0]][cord[1]]['type'] = item.alt;

      // remove item from drag start cell
      if (rootCoordinates) newLayout[rootCoordinates[0]][rootCoordinates[1]]['type'] = 'empty';

      // add/remove items with modes
      for (const cell of duplicateCells) {
        const c = cell.split('-').map(Number);
        newLayout[c[0]][c[1]]['type'] = item.alt;
      }
      for (const cell of deleteCells) {
        const c = cell.split('-').map(Number);
        newLayout[c[0]][c[1]]['type'] = 'empty';
      }
      return newLayout;
    });

    return deleteCells.length === 0 ? { name: type } : null;
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} className='flex justify-center items-center p-[0.1rem]' 
      style={{
        height: `${scale}px`,
        width: `${scale}px`,
        border: `${scale/10}px solid rgb(16 16 16)`,
        borderRadius: `${scale/5}px`,
        cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : '',
        backgroundColor: isOver ? '#715DF2' : type !== 'empty' ? '#d9d9d9' : '#4e4e4e7a',
      }}>
      { type === 'empty' ? null
      : droppedItem
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}/>
        : <LoadImage 
          type={type} 
          cellCoordinates={cord} 
          setDroppedItem={setDroppedItem}/>
      }
    </div>
  );
});

export default Cell;