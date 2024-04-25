import { getEmptyImage } from 'react-dnd-html5-backend';
import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import CustomDragLayer from './CustomDragLayer';

export default function DuplicateImage({ alt, source, scale }) {
  const [, drag, preview] = useDrag({
    type: 'image',
    item: { alt, source },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  // remove drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <>
      <CustomDragLayer scale={scale}/>
      <img ref={drag} src={source} alt={alt}/>
    </>
  );
}
