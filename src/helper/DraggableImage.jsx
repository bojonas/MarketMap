import { useState } from "react";
import { useDrag } from "react-dnd";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey }) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag] = useDrag({
    type: 'image',
    item: () => {
      const rootCoordinates = cellCoordinates.split('-')
      return { alt, source, rootCoordinates };
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setIsVisible(!isCommandKey);
        setDroppedItem(null);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (!isVisible) {
    return null;
  }

  return (
    <img ref={drag} src={source} alt={alt}/>
  );
}