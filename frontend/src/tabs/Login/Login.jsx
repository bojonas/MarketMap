import { useState } from "react"
import LoginComponent from "./LoginComponent"
import ForgotPassword from "./ForgotPassword"

export default function Login(){
    const [forgotP, setForgotPw] = useState(false)
    return(
        <div className="flex flex-col w-full h-full items-center">
            {!forgotP ? <LoginComponent setForgotPw={setForgotPw}/>:<ForgotPassword setForgotPw={setForgotPw}/>}
        </div>
        
    )
}