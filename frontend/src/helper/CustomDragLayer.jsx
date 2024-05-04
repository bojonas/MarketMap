import { useDragLayer } from 'react-dnd';

export default function CustomDragLayer({ scale }) {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  const { x, y } = currentOffset;
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