import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {requestCheckCredentials} from '../../requests/loginRequests';
import { CiLogin } from "react-icons/ci";


export default function LoginComponent({setForgotPw, setIsLoggedIn, setLoginFlag}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUser, setUserError] = useState(false);
  const [errorPw, setPwError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const login = async() => {
    if(!username ||!password){
      setErrorMessage("Insert required fields")
      if(!username) setUserError(true);
      if(!password) setPwError(true);
    }
    else{
      const result = await requestCheckCredentials(username, password)
      if(result.isLoggedIn){
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("permission", result.permission)
        setIsLoggedIn(true);
        setErrorMessage("");
        setUsername("");
        setPassword("");
        navigate('/');
      }
      else{
        if(result.message === "Invalid Password"){
          setPassword("")
        }
        setErrorMessage(result.message)
      }
    }
    
    
    
  };

  const register = ()=>{
    setLoginFlag(false);
  }

  const forgotPassword = () => {
    return(
      setForgotPw(true)
    )
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
          <button className="bg-custom border-2 hover:border-black rounded-3xl w-[35%] h-10 flex flex-row justify-center items-center gap-[8%]" onClick={login}>
            <CiLogin size={20}/>
            Login
          </button>
          <div className="text-black">
            <button className="custom-button-forgotPw mt-2" onClick={register}>
              Create Account
            </button>

          </div>
          
          <button className="custom-button-forgotPw" onClick={forgotPassword}>
            Forgot Password?
          </button>
          {errorMessage?<p className="text-red-700">{errorMessage}</p>:null}
        </div>
      </div>
    </div>
  );
}