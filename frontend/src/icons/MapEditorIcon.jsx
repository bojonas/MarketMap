import { FaMap } from "react-icons/fa";
export default function MapViewerIcon({ isActive }) {
    return(
        <FaMap size={20} style={{ color: isActive ? '' : '#707070' }}/>
    );
}