import { FaHouse } from "react-icons/fa6";
export default function HomeIcon({isActive}) {
    return(
        <FaHouse size={20} style={{ color: isActive ? '' : '#707070' }}/>
    );
}