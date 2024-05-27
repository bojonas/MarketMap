import { useState } from "react"
import LoginComponent from "./LoginComponent"
import ForgotPassword from "./ForgotPassword"
import Register from "../Register/Register"

export default function Login({setIsLoggedIn, setContent}){
    const [forgotP, setForgotPw] = useState(false)
    const [loginFlag, setLoginFlag] = useState(true)
    return(
        <div className="flex flex-col w-full h-full items-center">
            {!forgotP ?
             loginFlag? 
                <LoginComponent setForgotPw={setForgotPw} setLoginFlag={setLoginFlag} setIsLoggedIn={setIsLoggedIn} setContent={setContent}/>:
                <Register setLoginFlag={setLoginFlag}/>
                :<ForgotPassword setForgotPw={setForgotPw}/>}
        </div>
        
    )
}