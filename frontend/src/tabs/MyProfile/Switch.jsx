import { useState } from "react"

export default function Switch(){
    const[mode, setMode] = useState(true)

    function buttonColor(){
        const buttonPersonal = "custom-button item-left w-1/3"
        const buttonMarket = "custom-button item-right w-1/3"
        
        if(mode){
            return [buttonPersonal, buttonMarket]
        }
    }

    return (
        <div className="flex bg-orange-100 rounded-xl px-4 py-2 mt-10">
            <button className="custom-button w-1/3">Personal</button>
                <div className="w-1/3"></div>
            <button className="custom-button item-right w-1/3">Market</button>
        </div>
    )
}

