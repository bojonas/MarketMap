import React, { useState, useContext } from "react";
import { MapEditorContext } from "../context/MapEditorContext";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, duplicate }) {
  const [isDuplicating, setisDuplicating] = useState(true);
  const { setDuplicateCells, setDeleteCells, duplicateCells } = useContext(MapEditorContext);

  const handleDragStart = (e) => {
    setDuplicateCells([]);
    setDeleteCells([]);
    const rootCoordinates = duplicate ? null : cellCoordinates;
    e.dataTransfer.setData('application/json', JSON.stringify({ alt, source, rootCoordinates }));
    e.dataTransfer.effectAllowed = "copyMove";
    e.target.style.cursor = e.shiftKey ? 'cell' : e.altKey ? 'not-allowed' : 'auto';
  }  

  const handleDragEnter = (e) => {
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = (e) => {
    setisDuplicating(duplicateCells.length > 0 || duplicate);
    if (!duplicate) setDroppedItem(null);
  };

  return !isDuplicating ? null : (
    <img draggable onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd} 
      src={source} alt={alt}/>
  );
}