import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { getImages, DraggableImage } from './Toolbar';

const LoadImage = ({ type }) => {
    const images = getImages();
    const source = images[type];

    return type === 'empty' ? null :(
        <img src={source} alt={type} />
    );
};
  
export default function Cell ({ type, scale }) {
    const [droppedItem, setDroppedItem] = useState(null);

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'image',
        drop: (item) => {
        setDroppedItem(item);
        return { name: type };
        },
        collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        }),
    });

    let backgroundColor;
    if (canDrop) backgroundColor = '#4a4aff';
    if (isOver) backgroundColor = '#3db897';

    return (
        <div ref={drop} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `${scale}px`,
        width: `${scale}px`,
        border: '2px rgb(30 41 59) solid',
        backgroundColor: backgroundColor,
        }}>
        {droppedItem
            ? <img src={droppedItem.source} alt={droppedItem.type} />
            : <LoadImage type={type} />
        }
        </div>
    );
}