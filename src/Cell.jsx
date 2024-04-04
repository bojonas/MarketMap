import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { getImages } from './Toolbar';
import DraggableImage from './helper/DraggableImage';

const LoadImage = ({ type }) => {
    const images = getImages();
    const source = images[type];

    return type === 'empty' ? null :(
        <DraggableImage source={source} alt={type} />
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
    if (canDrop) 
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
            ? <DraggableImage source={droppedItem.source} alt={droppedItem.type}/>
            : <LoadImage type={type} />
        }
        </div>
    );
}