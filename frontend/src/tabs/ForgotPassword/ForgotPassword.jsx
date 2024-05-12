import { useState } from "react";
import {CustomButton} from "../../helper/CustomButton"

export default function ForgotPassword(){
    const [emailChecked, setEmailChecked] = useState(true)

    return (
        <div className="bg-slate-700 flex items-center justify-center h-full">
        <div className="bg-slate-700 rounded-lg p-8">
        <div className="bg-slate-700 flex flex-col items-center justify-center">
          
          {emailChecked ? <p>Hallo</p> : <CheckEmail/>}

        </div>
      </div>
    </div>
    )
}

function CheckEmail(){
    function continuePage(){
    
    }

    const [email, setEmail] = useState("")
    return ( 
        <input
            type="email"
            placeholder="Email"
            className="custom-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
        />
        
    )

}
