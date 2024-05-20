import MyMarketComponent from "./MyMarketComponent";
import MyProfileComponent from "./MyProfileComponenet";
import Switch from "./Switch";
import { useState } from "react";

export default function MyProfile(){
    const[mode, setMode] = useState(true)
    
    
    return(
        <div className="flex flex-col w-full h-full justify-center">
            <Switch setMode={setMode} mode={mode}/>
            {mode?
            <MyProfileComponent/>:
            <MyMarketComponent/>}
        </div>
        
    )

}