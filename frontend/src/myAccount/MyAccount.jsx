import DropdownMenu from "./DropdownMenu";
import { useState } from "react";

export default function MyAccount(){
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] =  useState("b")

    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

  return (
    <div className="relative p-5">
      <button 
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-custom text-white rounded-full hover:bg-blue-600"
      >
        {content}
      </button>
      <DropdownMenu isVisible={isVisible}>
        <div className="dropdown-content">Option 1</div>
        <div className="dropdown-content">Option 2</div>
        <div className="dropdown-content">Option 3</div>
      </DropdownMenu>
    </div>
  );
        
}