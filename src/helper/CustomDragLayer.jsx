import { useDragLayer } from 'react-dnd';
import { getScale } from '../Layout';

export default function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;
  const scale = getScale();

  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 100, left: 0, top: 0 }}>
      <div style={{ 
        transform: `translate(${x}px, ${y}px)`,
        height: `${scale}px`,
        width: `${scale}px`,
        }}>
        <img src={item.source} alt={item.alt}/>
      </div>
    </div>
  );
}