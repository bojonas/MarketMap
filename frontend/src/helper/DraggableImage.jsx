import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import CustomDragLayer from "./CustomDragLayer";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey, duplicate, scale }) {
  const [isDuplicating, setisDuplicating] = useState(true);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'image',
    item: () => {
      const trackedCells = [];
      const rootCoordinates = duplicate ? null : cellCoordinates;
      return { alt, source, rootCoordinates, trackedCells };
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setisDuplicating(!isCommandKey || duplicate);
        if (!duplicate) setDroppedItem(null);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview, duplicate, isCommandKey]);
  
  return !isDuplicating ? null :(
    <>
      {isDragging && <CustomDragLayer scale={scale}/>}
      <img ref={drag} src={source} alt={alt}/>
    </>
  );
}