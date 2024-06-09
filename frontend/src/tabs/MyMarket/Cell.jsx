import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { MapEditorContext } from '../../context/MapEditorContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, scale, coordinates }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);
  const [row, col] = coordinates.split('-').map(Number);
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
    if (duplicateMode && !duplicateCells.includes(coordinates)) setDuplicateCells([...duplicateCells, coordinates]);
    if (deleteMode && !deleteCells.includes(coordinates)) setDeleteCells([...deleteCells, coordinates]);
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
    if (rootCoordinates && isEqualArray([row, col], rootCoordinates)) return;
    // update layout
    setLayout(prev => {
      const newLayout = [...prev];

      // add item to current cell 
      newLayout[row][col].type = item.alt;

      // remove item from drag start cell
      if (rootCoordinates) {
        const newCell = newLayout[rootCoordinates[0]][rootCoordinates[1]];
        newCell.type = 'empty';
        newCell.products = [];
      }

      // add/remove items with modes
      for (const cell of duplicateCells) {
        const [x, y] = cell.split('-').map(Number);
        newLayout[x][y].type = item.alt;
      }
      for (const cell of deleteCells) {
        const [x, y] = cell.split('-').map(Number);
        const newCell = newLayout[x][y];
        newCell.type = 'empty';
        newCell.products = [];
      }
      return newLayout;
    });

    return deleteCells.length === 0 ? { name: type } : null;
  }

  const rotateCell = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'empty') return;
    const newLayout = JSON.parse(JSON.stringify(layout));
    newLayout[row][col]['rotation'] = 'rotation' in newLayout[row][col] ? (newLayout[row][col]['rotation'] + 90) % 360 : 90;
    setLayout(newLayout);
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onContextMenu={rotateCell} onDoubleClick={() => { if (type !== 'empty') setOpenCell(layout[row][col]) }}
      className='flex justify-center items-center p-[5%]' 
      style={{
        height: `${scale}px`,
        width: `${scale}px`,
        border: `${scale/10}px solid #171717`,
        borderRadius: `${scale/5}px`,
        cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'pointer',
        backgroundColor: isOver ? '#715DF2' : type !== 'empty' ? '#d9d9d9' : '#242424',
        transform: `rotate(${layout[row][col]['rotation']}deg)`,
      }}>
      { type === 'empty' ? null
      : droppedItem
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          coordinates={[row, col]} 
          setDroppedItem={setDroppedItem}/>
        : <LoadImage 
          type={type} 
          coordinates={[row, col]} 
          setDroppedItem={setDroppedItem}/>
      }
    </div>
  );
});

export default Cell;