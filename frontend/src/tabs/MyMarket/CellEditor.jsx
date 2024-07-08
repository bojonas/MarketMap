import React, { useState, useContext, memo, useEffect } from 'react';
import DraggableImage from "../../atoms/DraggableImage";
import LoadImage from "../../atoms/LoadImage"
import { MapEditorContext } from '../../context/MapEditorContext';
import { isEqualArray } from '../../helper/isEqualArray';

const CellEditor = memo(({ type, row, col, cellStyle }) => {
  const [droppedItem, setDroppedItem] = useState(null);
  const [dropped, setDropped] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const { 
    layout,
    setLayout,
    editedZones,
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
    if (duplicateMode && !duplicateCells.some(cell => cell[0] === row && cell[1] === col)) setDuplicateCells([...duplicateCells, [row, col]]);
    if (deleteMode && !deleteCells.some(cell => cell[0] === row && cell[1] === col)) setDeleteCells([...deleteCells, [row, col]]);
    setIsOver(true);
  };  

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    
    const imageData = e.dataTransfer.getData('application/json');
    if (!imageData) return;

    const item = JSON.parse(imageData);
    const { rootCoordinates } = item;
    if (rootCoordinates && isEqualArray([row, col], rootCoordinates)) {
      if (deleteCells.length) setDroppedItem(item);
      else return;
    } else setDroppedItem(deleteCells.length === 0 ? item : null);

    // update layout
    setLayout(prev => {
      const newLayout = [...prev];

      // add item to current cell 
      newLayout[row][col].type = item.alt;

      // remove item from drag start cell
      if (rootCoordinates && duplicateCells.length === 0) {
        const newCell = newLayout[rootCoordinates[0]][rootCoordinates[1]];
        newCell.type = 'empty';
        newCell.products = null;
      }

      // add/remove items with modes
      for (const [x, y] of duplicateCells) {
        newLayout[x][y].type = item.alt;
      }
      for (const [x, y] of deleteCells) {
        const newCell = newLayout[x][y];
        newCell.type = 'empty';
        newCell.products = null;
      }
      return newLayout;
    });

    setEditedZones(prev => {
      const newZones = [...prev];
      const cell = layout[row][col];
      for (const zone of newZones) {
        if (typeof cell.zone_id !== 'number') continue;

        // add/remove items with modes
        for (const [x, y] of duplicateCells) {
          const adjustedX = x - zone.zone_position.row;
          const adjustedY = y - zone.zone_position.column;
          if (adjustedX < 0 || adjustedY < 0 || adjustedX >= zone.zone_layout.length || adjustedY >= zone.zone_layout[0].length) continue;
          zone.zone_layout[adjustedX][adjustedY].type = item.alt;
        }
       
        for (const [x, y] of deleteCells) {
          const adjustedX = x - zone.zone_position.row;
          const adjustedY = y - zone.zone_position.column;
          if (adjustedX < 0 || adjustedY < 0 || adjustedX >= zone.zone_layout.length || adjustedY >= zone.zone_layout[0].length) continue;
          zone.zone_layout[adjustedX][adjustedY].type = 'empty';
          zone.zone_layout[adjustedX][adjustedY].products = null;
        }

        const x = row - zone.zone_position.row;
        const y = col - zone.zone_position.column;
        if (cell.zone_id !== zone.zone_id || x < 0 || y < 0 || x >= zone.zone_layout.length || y >= zone.zone_layout[0].length) continue;

        // add item to current cell 
        if (deleteCells.length === 0) zone.zone_layout[x][y].type = item.alt;

        // remove item from drag start cell
        if (!rootCoordinates || duplicateCells.length > 0) continue;
        const rootX = rootCoordinates[0] - zone.zone_position.row;
        const rootY = rootCoordinates[1] - zone.zone_position.column;
        if (rootX < 0 || rootX >= zone.zone_layout.length || rootY < 0 || rootY >= zone.zone_layout[0].length) continue;

        zone.zone_layout[rootX][rootY].type = 'empty';
        zone.zone_layout[rootX][rootY].products = null;
      }
      return newZones;
    });

    setDropped(true);
  }

  const rotateCell = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'empty') return;

    const newLayout = JSON.parse(JSON.stringify(layout));
    newLayout[row][col]['rotation'] = 'rotation' in newLayout[row][col] ? (newLayout[row][col]['rotation'] + 90) % 360 : 90;
    setLayout(newLayout);

    const newZones = JSON.parse(JSON.stringify(editedZones));
    const cell = layout[row][col];
    for (const zone of newZones) {
      if (typeof cell.zone_id !== 'number') continue;

      const x = row - zone.zone_position.row;
      const y = col - zone.zone_position.column;
      if (cell.zone_id !== zone.zone_id || x < 0 || y < 0 || x >= zone.zone_layout.length || y >= zone.zone_layout[0].length) continue;
      zone.zone_layout[x][y]['rotation'] = 'rotation' in zone.zone_layout[x][y] ? (zone.zone_layout[x][y]['rotation'] + 90) % 360 : 90;
    }
    setEditedZones(newZones);
  }

  useEffect(() => {
    if (!dropped) return;

    setDuplicateCells([]);
    setDeleteCells([]);
    setDropped(false);
  }, [dropped, setDeleteCells, setDuplicateCells]);

  return row >= layout.length || col >= layout[0].length ? null : (
    <div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} onContextMenu={rotateCell} onDoubleClick={() => { if (type !== 'empty') setOpenCell(layout[row][col]) }}
      className={`flex justify-center items-center p-[5%] ${type !== 'empty' ? 'bg-[#d9d9d9]' : 'bg-gray-custom'}`}
      style={{
        cursor: duplicateMode ? 'cell' : deleteMode ? 'not-allowed' : typeof layout[row][col].zone_id === 'number' || type !== 'empty' ? 'pointer' : '',
        ...(isOver || duplicateCells.some(cell => cell[0] === row && cell[1] === col) || deleteCells.some(cell => cell[0] === row && cell[1] === col) ? { ...cellStyle, backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--primary-color') } : cellStyle),
      }}>
      { type === 'empty' ? null
      : droppedItem
        ? <DraggableImage 
          source={droppedItem.source} 
          alt={droppedItem.alt} 
          coordinates={[row, col]} 
          setDroppedItem={setDroppedItem}
          style={{ transform: `rotate(${layout[row][col].rotation}deg)` }}/>
        : <LoadImage 
          type={type} 
          coordinates={[row, col]} 
          setDroppedItem={setDroppedItem}
          style={{ transform: `rotate(${layout[row][col].rotation}deg)` }}/>
      }
    </div>
  );
});

export default CellEditor;