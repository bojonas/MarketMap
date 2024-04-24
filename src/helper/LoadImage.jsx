import { getImages } from "./getImages";
import DraggableImage from "./DraggableImage";

// loads an image from image folder
export default function LoadImage({ type, cellCoordinates, setDroppedItem }) {
    if (type === 'empty') return null;

    const images = getImages();
    const source = images[type];

    return (
        <DraggableImage source={source} alt={type} cellCoordinates={cellCoordinates} setDroppedItem={setDroppedItem}/>
    );
}