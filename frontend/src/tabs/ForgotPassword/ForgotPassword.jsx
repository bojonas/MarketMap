import { useState } from "react";
import { requestUpdatePassword, requestCheckUser } from "../../requests/loginRequests";

var emailFinal = null;

export default function ForgotPassword(){
    const [emailChecked, setEmailChecked] = useState(false)

    return (
        <div className="flex items-center justify-center h-full">
        <div className="rounded-lg p-8">
        <div className="flex flex-col items-center justify-center">
          
          {emailChecked ? <NewPassword setEmailChecked={setEmailChecked}/> : <CheckEmail setEmailChecked={setEmailChecked}/>}

        </div>
      </div>
    </div>
    )
}

function NewPassword({setEmailChecked}){
    const [pw1, setPw1] = useState("")
    const [pw2, setPw2] = useState("")

    const savePassword = async () => {
        if(pw1===pw2){
            await requestUpdatePassword(emailFinal, pw1);
        }
        else{
            alert("Passwords must be identical");
        }
        
    }

    const backToPage = async () => {
        setEmailChecked(false)
    }

    return ( 
        <div className="flex flex-col">
            <input
                type="password"
                placeholder="New Password"
                className="custom-input mb-8"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)} 
            />

            <input
                type="password"
                placeholder="Confirm Password"
                className="custom-input mb-10"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)} 
            />
            <button className="custom-button" onClick={savePassword}>
                Save
            </button>
            <button className="" onClick={backToPage}>
                Back
            </button>
            
        </div>
        
    )
}

function CheckEmail({setEmailChecked}){
    const continuePage = async() => {
        if(email){
            const validMailFlag = await requestCheckUser(email)
            if(validMailFlag){
                await setEmailChecked(true)
                emailFinal = email;
            }
            else{
                alert("Invalid email")
            }
            
        }
        else{
            alert("Insert your email")
        }
        

    }

    const [email, setEmail] = useState("")
    return ( 
        <div>
            <input
                type="email"
                placeholder="Email"
                className="custom-input mb-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button className="custom-button" onClick={continuePage}>
                Continue
            </button>
        </div>
        
    )

}
