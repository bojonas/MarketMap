import { useDrag } from 'react-dnd';
import { useState } from 'react';

export default function DraggableImage({ alt, source, onDragEnd, cellCoordinates, setCells, isCommandKey}) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag] = useDrag({
    type: 'image',
    item: { alt, source },
    hover: (item, monitor) => {
      if (isCommandKey) {
        setCells(prevCells => [...prevCells, cellCoordinates]);
      }
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setIsVisible(false);
        if (typeof onDragEnd === 'function') {
          onDragEnd(cellCoordinates.split('-'));
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
    <img ref={drag} src={source} alt={alt}/>
  );
}