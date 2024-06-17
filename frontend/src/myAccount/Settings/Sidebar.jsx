import Color from "./SettingOptions/Color/Color"
import SettingButton from "./SettingButton";
import { useState } from "react";
import MyMarketComponent from "../MyProfile/MyMarketComponent";
import MyProfileComponent from "../MyProfile/MyProfileComponenet";

export default function Sidebar({setContent}){
    const [colorActive, setColorActive] = useState(true)
    const [myProfileActive, setMyProfileActive] = useState(false)
    const [myMarketActive, setMyMarketActive] = useState(false)

    const permission = localStorage.getItem("permission") === ("market"||"admin"||"market_owner")

    const change = (event)=>{
        switch(event){
            case "Color":
                setColorActive(true)
                setMyProfileActive(false)
                setMyMarketActive(false)
                break;
            case "My Profile":
                setColorActive(false)
                setMyProfileActive(true)
                setMyMarketActive(false)
                break;
            case "My Market":
                setColorActive(false)
                setMyProfileActive(false)
                setMyMarketActive(true)
                break;
            default:
                break;
        }
    }


    return(
        <div className="text-2xl border-2 border-offwhite w-3/12 flex flex-col text-offwhite">
            <SettingButton label={"Color"} setContent={setContent} componenet={<Color/>} isActive={colorActive} change={change}/>
            <SettingButton label={"My Profile"} setContent={setContent} componenet={<MyProfileComponent/>} isActive={myProfileActive} change={change}/>
            {permission&&<SettingButton label={"My Market"} setContent={setContent} componenet={<MyMarketComponent/>} isActive={myMarketActive} change={change}/>}
        </div>
    );
}