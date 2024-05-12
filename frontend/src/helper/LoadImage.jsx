import { getItemImages } from "./getItemImages";
import DraggableImage from "./DraggableImage";

// loads an image from image folder
export default function LoadImage({ type, cellCoordinates, setDroppedItem, isCommandKey, scale }) {
    if (type === 'empty') return null;

    const images = getItemImages();
    const source = images[type];

    return (
        <DraggableImage source={source} alt={type} cellCoordinates={cellCoordinates} setDroppedItem={setDroppedItem} isCommandKey={!isCommandKey} scale={scale}/>
    );
}