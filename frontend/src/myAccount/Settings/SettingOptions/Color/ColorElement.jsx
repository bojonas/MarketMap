import React from "react"
import { useState } from "react";
import { useEffect } from "react";
import { ChromePicker } from 'react-color';
import { requestGetColor, requestPostColor } from "../../../../requests/settingsRequests";



export default function ColorElement({label, isVisible=true}){
    const user_id = localStorage.getItem("user_id")
    const [color, setColor] = useState('#000000');
    
    const [editedColor, setEditedColor] = useState('#000000')
    const [editable, setEditable] = useState(false);
    

    const handleColorChange = (color) => {
        setEditedColor(color.hex);
    };

    const openColorEditor = ()=>{
        setEditable(!editable)
    }

    const handleSave = async() => {
        setColor(editedColor)
        try{
            if(label === "Personal"){
                await requestPostColor(user_id, editedColor, "Personal");
                document.documentElement.style.setProperty('--custom-color', editedColor);
            }
            else if(label === "Market Primary"){
                await requestPostColor(user_id, editedColor, "Primary");
                document.documentElement.style.setProperty('--primary-color', editedColor);
            }
            else if(label === "Market Secondary"){
                await requestPostColor(user_id, editedColor, "Secondary");
                document.documentElement.style.setProperty('--secondary-color', editedColor);
            }
        }
        catch(error){
            console.log("Error posting Color: " + error)
        }
        setEditable(false)
    };

    const handleBack = () => {
        setEditable(false)
    }

    useEffect(()=>{
        const initColor = async ()=>{
            if(label === "Personal"){
                setColor(await requestGetColor(user_id, "Personal"))
            }
            else if(label === "Market Primary"){
                setColor(await requestGetColor(user_id, "Primary"))
            }
            else if(label === "Market Secondary"){
                setColor(await requestGetColor(user_id, "Secondary"))
            }
        }
        initColor()
    },[label, setColor, user_id])

    return(
        <React.Fragment>
                <p className="text-offwhite text-xl mt-2 w-30 h-5 ml-10">{isVisible&&label}</p>
                <div 
                    className="ml-4 w-10 h-10 rounded-full border-2 cursor-pointer border-custom-hover" 
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
            </React.Fragment>
    );

}