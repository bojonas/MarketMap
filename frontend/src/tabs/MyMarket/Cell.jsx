import React, { useState, useContext, memo } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { MapEditorContext } from '../../context/MapEditorContext';
import { isEqualArray } from '../../helper/isEqualArray';

const Cell = memo(({ type, coordinates, cellStyle }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [isOver, setIsOver] = useState(false);
  const [row, col] = coordinates.split('-').map(Number);
  const { 
    layout,
    setLayout,
    setEditedZones,
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

    setEditedZones(prev => {
      const newZones = [...prev];
      for (const zone in newZones) {
        const cell = layout[row][col];
        if (typeof cell.zone_id !== 'number' || cell.zone_id !== zone.zone_id) return;
        // add item to current cell 
        zone[row][col].type = item.alt;

        // remove item from drag start cell
        if (rootCoordinates) {
          const newCell = zone[rootCoordinates[0]][rootCoordinates[1]];
          newCell.type = 'empty';
          newCell.products = [];
        }

        // add/remove items with modes
        for (const cell of duplicateCells) {
          const [x, y] = cell.split('-').map(Number);
          zone[x][y].type = item.alt;
        }
        for (const cell of deleteCells) {
          const [x, y] = cell.split('-').map(Number);
          zone[x][y].type = 'empty';
          zone[x][y].products = [];
        }

        return newZones;
      }
    })

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
      className={`flex justify-center items-center p-[5%] ${type !== 'empty' ? 'bg-[#d9d9d9]' : 'bg-gray-custom'}`}
      style={{
        cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : 'pointer',
        ...(isOver ? { ...cellStyle, backgroundColor: '#715DF2' } : cellStyle),
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