import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import CustomDragLayer from "./CustomDragLayer";
import { getEmptyImage } from "react-dnd-html5-backend";

export default function DraggableImage({ alt, source, cellCoordinates, setDroppedItem, isCommandKey, scale }) {
  const [isVisible, setIsVisible] = useState(true);

  const [, drag, preview] = useDrag({
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

  // remove drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return !isVisible ? null :(
    <>
      <CustomDragLayer scale={scale}/>
      <img ref={drag} src={source} alt={alt}/>
    </>
  );
}