import { useState } from "react";
import {requestCheckCredentials} from '../../requests/loginRequests';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login = async() => {
    const result = await requestCheckCredentials(username, password)
    try{
      setErrorMessage(result.message);
    }
    catch(error){
      setErrorMessage("")
    };
  };

  const forgotPassword = () => {
    console.log("Hallo");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="rounded-lg p-8">
        <div className=" flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Username"
            className="custom-input mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="custom-input mb-8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="custom-button" onClick={login}>
            Login
          </button>
          <p id="reset_pw" onClick={forgotPassword}>
            Forgot Password?
          </p>
          {errorMessage?<p className="text-red-700">{errorMessage}</p>:null}
        </div>
      </div>
    </div>
  );
}