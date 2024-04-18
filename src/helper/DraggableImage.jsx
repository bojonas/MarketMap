import { useDrag } from 'react-dnd';
import { useState } from 'react';

export default function DraggableImage({ alt, source, onDragEnd, cellCoordinates }) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag] = useDrag({
    type: 'image',
    item: { alt, source },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setIsVisible(false);
        if (typeof onDragEnd === 'function') {
          onDragEnd(cellCoordinates);
        }
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
    <img ref={drag} src={source} alt={alt} />
  );
}