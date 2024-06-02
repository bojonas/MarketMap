import { useState } from "react"
import Color from "./SettingOptions/Color/Color"

export default function Settings(){
    const [content, setContent] = useState({header: "Error", body: ("Error")})

    const colorButton = ()=>{
        setContent({header: "Color", body: (<Color/>)})
    }

    return (
        <div className="bg-blue-100 w-full h-full">
            <div className="flex justify-left bg-green-300">
                <h1 className="text-4xl text-black px-4 py-2 rounded-md">Settings</h1>
            </div>

            <div className=" flex h-full pt-4">
                <div className="text-2xl bg-red-600 w-3/12">
                    <button onClick={colorButton}>Color</button>
                </div>
                <div className="text-2xl bg-orange-600 w-3/4">
                    <div className="bg-gray-800">{content["header"]}</div>
                    {content["body"]}
                </div>

            </div>
        </div>
    )
}