import { useState } from "react";
import {requestCreateUser} from '../../requests/loginRequests';

export default function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const register = async()=>{
        if(username !=="" || password.length<8 || email !== ""){
            const response = await requestCreateUser(username, email, password,"admin")
            alert(response)
        }
        else{
            setErrorMessage ("Invalid Credentials")
        }
        
        
    }

    return (
        <div className="flex items-center justify-center h-full">
          <div className="rounded-lg p-8">
            <div className="flex flex-col items-center justify-center sourrounding-div">
              <input
                type="text"
                placeholder="Username"
                className="custom-input mb-4"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="custom-input mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="custom-input mb-8"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="custom-button" onClick={register}>
                Register
              </button>
              
              {errorMessage?<p className="text-red-700">{errorMessage}</p>:null}
            </div>
          </div>
        </div>
      );
}