import { useState } from "react";
import { useDrag } from "react-dnd";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey, duplicate }) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag] = useDrag({
    type: 'image',
    item: () => {
      const rootCoordinates = duplicate ? null : cellCoordinates.split('-');
      return { alt, source, rootCoordinates };
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setIsVisible(!isCommandKey || duplicate);
        if (!duplicate) setDroppedItem(null);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return !isVisible ? null :(
    <img ref={drag} src={source} alt={alt}/>
  );
}