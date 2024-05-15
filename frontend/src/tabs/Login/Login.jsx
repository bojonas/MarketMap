import { useState } from "react";
import {requestCheckCredentials} from '../../requests/loginRequests';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUser, setUserError] = useState(false);
  const [errorPw, setPwError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = async() => {
    if(!username ||!password){
      setErrorMessage("Insert required fields")
      if(!username) setUserError(true);
      if(!password) setPwError(true);
    }
    else{
      const result = await requestCheckCredentials(username, password)
      if(result.isLoggedIn){
        localStorage.setItem("user_id", result.user_id)
        setErrorMessage("")
        setUsername("")
        setPassword("")
      }
      else{
        if(result.message === "Invalid Password"){
          setPassword("")
        }
        setErrorMessage(result.message)
      }
    }
    
    
    
  };

  const forgotPassword = () => {
    console.log("Hallo");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-lg p-8">
        <div className=" flex flex-col items-center justify-center sourrounding-div">
          
          {errorUser ? 
          <input 
            type="text" 
            placeholder="Username" 
            className="custom-input-error mb-4" 
            value={username} 
            onChange={(e) => {setUsername(e.target.value); setUserError(false)}}
            />: 
          <input 
            type="text" 
            placeholder="Username" 
            className="custom-input mb-4" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}/>}
          {errorPw ? 
          <input
            type="password"
            placeholder="Password"
            className="custom-input-error mb-8"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setPwError(false)}}
          />:
          <input
            type="password"
            placeholder="Password"
            className="custom-input mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />}
          <button className="custom-button" onClick={login}>
            Login
          </button>
          <button className="custom-button-forgotPw" onClick={forgotPassword}>
            Forgot Password?
          </button>
          {errorMessage?<p className="text-red-700">{errorMessage}</p>:null}
        </div>
      </div>
    </div>
  );
}