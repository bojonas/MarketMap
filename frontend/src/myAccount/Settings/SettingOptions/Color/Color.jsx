import { useState } from "react";
import { useEffect } from "react";
import { ChromePicker } from 'react-color';


export default function Color(){

    const [color, setColor] = useState('#000000');
    
    const [editedColor, setEditedColor] = useState('#000000')
    const [editable, setEditable] = useState(false);

    const handleColorChange = (color) => {
        setEditedColor(color.hex);
    };

    const openColorEditor = ()=>{
        setEditable(!editable)
    }

    const handleSave = () => {
        setColor(editedColor)
        setEditable(false)
    };

    const handleBack = () => {
        setEditable(false)
    }

    useEffect(()=>{
        //get Color which user has picked per default
    },[])

    const PickedColor = color;
    return(
        <div className="text-sm flex w-full h-full bg-red-500 relative">
                <p className="bg-blue-300 mt-2 w-30 h-5 ml-20">Selected Color: {PickedColor}</p>
                <div 
                    className="ml-4 w-10 h-10 rounded-full border-2 hover:cursor-pointer" 
                    style={{ backgroundColor: color }}
                    onClick={openColorEditor}
                ></div>
                {editable&&
                <div className="bg-white w-[257px] h-[329px] flex flex-col absolute inset-0 m-auto p-4 rounded-lg">
                    <ChromePicker 
                        color={editedColor}
                        onChange={handleColorChange}
                        className="mb-0"
                    />
                    <div className="flex flex-row w-full mt-2">
                        <button className="bg-red-600 text-white rounded-full p-[1.5svh] text-xl font-bold border-red-600 border-2  hover:border-offwhite w-1/2 ml-4" 
                                onClick={handleBack}>Back</button>
                        <div className="w-1/12"></div>
                        <button className="bg-green-600 text-white rounded-full p-[1.5svh] text-xl font-bold border-green-600 border-2  hover:border-offwhite w-1/2 mr-4" 
                                onClick={handleSave}>Save</button>
                    </div>
                    
                </div>}
                
                
            
        </div>
    )
}