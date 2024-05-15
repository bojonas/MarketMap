import React, { useState, useContext } from "react";
import { DimensionContext } from "../DimensionContext";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, duplicate, duplicateMode }) {
  const [isDuplicating, setisDuplicating] = useState(true);
  const { setTrackedCells } = useContext(DimensionContext);

  const handleDragStart = (e) => {
    setTrackedCells([]);
    const rootCoordinates = duplicate ? null : cellCoordinates;

    e.dataTransfer.setData('application/json', JSON.stringify({ alt, source, rootCoordinates }));
  }  

  const handleDragEnd = (e) => {
    setisDuplicating(!duplicateMode || duplicate);
    if (!duplicate) setDroppedItem(null);
  };

  return !isDuplicating ? null : (
    <img draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} 
      src={source} alt={alt}/>
  );
}