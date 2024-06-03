import { useState } from "react"

import Sidebar from "./Sidebar";
import Color from "./SettingOptions/Color/Color";
import SettingContent from "./SettingContent";

export default function Settings(){
    const [content, setContent] = useState({header: "Color", body: (<Color label={"Personal"}/>)})

    return (
        <div className="w-full h-full">
            <div className="flex justify-left text-4xl text-offwhite px-4 py-2 rounded-md">
                Settings
            </div>
            <div className=" flex h-full pt-4">
                <Sidebar setContent={setContent}/>
                <SettingContent content={content}/>
            </div>
        </div>
    )
}