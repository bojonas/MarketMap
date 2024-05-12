import React, { useState, useContext, useRef } from "react";
import { DimensionContext } from "../DimensionContext";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey, duplicate, scale }) {
  const [isDuplicating, setisDuplicating] = useState(true);
  const { setTrackedCells } = useContext(DimensionContext);
  const ref = useRef(null);

  const handleDragStart = (e) => {
    setTrackedCells([]);
    const rootCoordinates = duplicate ? null : cellCoordinates;
    e.dataTransfer.setData('application/json', JSON.stringify({ alt, source, rootCoordinates }));

    // drag preview
    const crt = ref.current.cloneNode(true);
    crt.style.width = `${scale}px`;
    crt.style.height = `${scale}px`;
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, scale/2, scale/2);
  }  

  const handleDragEnd = (e) => {
    setisDuplicating(!isCommandKey || duplicate);
    if (!duplicate) setDroppedItem(null);
  };

  return !isDuplicating ? null :(
    <img ref={ref} draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd} src={source} alt={alt}
      className='hover:cursor-grab'/>
  );
}