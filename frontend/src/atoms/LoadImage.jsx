import { useContext } from "react";
import DraggableImage from "./DraggableImage";
import { MyMarketContext } from "../context/MyMarketContext";

// loads an image from image folder
export default function LoadImage({ type, coordinates, setDroppedItem, isCommandKey }) {
    const { images } = useContext(MyMarketContext);
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