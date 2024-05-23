import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { MapEditorContext } from '../../DimensionContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, scale, cellCoordinates }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const cord = cellCoordinates.split('-').map(Number);
  const { 
    layout,
    setLayout, 
    duplicateCells, 
    setDuplicateCells, 
    deleteCells, 
    setDeleteCells, 
    duplicateMode, 
    deleteMode, 
    setOpenCell } = useContext(MapEditorContext);

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
    setLayout(prev => {
      const newLayout = [...prev];

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
  }

  const rotateCell = (e) => {
    if (type !== 'empty') return;
    e.preventDefault();
    setLayout(prev => {
      const newLayout = [...prev];

      newLayout[cord[0]][cord[1]]['rotation'] = (newLayout[cord[0]][cord[1]]['rotation'] + 90) % 360;
      return newLayout;
    });
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onContextMenu={rotateCell} onDoubleClick={() => { if (type !== 'empty') setOpenCell(layout[cord[0]][cord[1]]) }}
      className='flex justify-center items-center p-[5%]' 
      style={{
        height: `${scale}px`,
        width: `${scale}px`,
        border: `${scale/10}px solid #171717`,
        borderRadius: `${scale/5}px`,
        cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'pointer',
        backgroundColor: isOver ? '#715DF2' : type !== 'empty' ? '#d9d9d9' : '#242424',
        transform: `rotate(${layout[cord[0]][cord[1]]['rotation']}deg)`,
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