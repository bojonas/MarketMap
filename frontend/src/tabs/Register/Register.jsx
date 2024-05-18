import { useState } from "react";
import {requestCreateUser} from '../../requests/loginRequests';
import { useNavigate } from "react-router-dom";
export default function Register(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    var navigator = useNavigate()

    const register = async()=>{
        if(username !=="" || password.length<8 || email !== ""){
            await requestCreateUser(username, email, password, firstName, lastName,"user")
            navigator("/")
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
                type="text"
                placeholder="First Name"
                className="custom-input mb-4"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="custom-input mb-4"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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