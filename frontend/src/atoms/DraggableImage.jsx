import React, { useState, useContext } from "react";
import { MapEditorContext } from "../DimensionContext";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, duplicate }) {
  const [isDuplicating, setisDuplicating] = useState(true);
  const { setTrackedCells, duplicateMode } = useContext(MapEditorContext);

  const handleDragStart = (e) => {
    setTrackedCells([]);
    const rootCoordinates = duplicate ? null : cellCoordinates;

    e.dataTransfer.setData('application/json', JSON.stringify({ alt, source, rootCoordinates }));
    e.dataTransfer.effectAllowed = "copyMove";
    e.target.style.cursor = duplicateMode ? 'cell' : e.altKey ? 'not-allowed' : 'auto';
  }  

  const handleDragEnter = (e) => {
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = (e) => {
    setisDuplicating(duplicateMode || duplicate);
    if (!duplicate) setDroppedItem(null);
  };

  return !isDuplicating ? null : (
    <img draggable onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd} 
      src={source} alt={alt}/>
  );
}