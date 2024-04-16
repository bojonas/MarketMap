import { useDrag } from 'react-dnd';
import { useState } from 'react';

export default function DraggableImage({ alt, source }) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag] = useDrag({
    type: 'image',
    item: { alt, source },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        setIsVisible(false);
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
