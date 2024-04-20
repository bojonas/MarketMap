import { useDrag } from 'react-dnd';
import { useState, useEffect } from 'react';
import { handleCommandAndDrag } from './handleCommandAndDrag';

export default function DraggableImage({ alt, source, onDragEnd, cellCoordinates}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isCommandKey, setIsCommandKey] = useState(false);

  // check for command or ctrl keydown
  useEffect(() => {
    const handleCommandAndDragWithState = (e) => handleCommandAndDrag(e, setIsCommandKey);
    window.addEventListener('keydown', handleCommandAndDragWithState);
    return () => window.removeEventListener('keydown', handleCommandAndDragWithState);
  }, []);

  if (isCommandKey) console.log(isCommandKey);

  const [, drag] = useDrag({
    type: 'image',
    item: { alt, source },
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
    <img ref={drag} src={source} alt={alt} />
  );
}