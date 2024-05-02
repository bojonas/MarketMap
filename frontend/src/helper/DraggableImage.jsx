import { useState } from "react";
import { useDrag } from "react-dnd";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey, duplicate }) {
  const [isDuplicating, setisDuplicating] = useState(true);
  const [isDragging, drag] = useDrag({
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

  if (!isDragging) return null;

  return !isDuplicating ? null :(
    <img ref={drag} src={source} alt={alt}/>
  );
}