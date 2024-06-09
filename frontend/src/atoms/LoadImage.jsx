import { getItemImages } from "../helper/getItemImages";
import DraggableImage from "./DraggableImage";

// loads an image from image folder
export default function LoadImage({ type, coordinates, setDroppedItem, isCommandKey }) {
    const images = getItemImages();
    const source = images[type];

    return (
        <DraggableImage 
            source={source} 
            alt={type} 
            coordinates={coordinates} 
            setDroppedItem={setDroppedItem} 
            isCommandKey={!isCommandKey}
        />
    );
}