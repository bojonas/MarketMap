import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login = () => {
    if (password === "1234") {
      // Führe den Login durch
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Credentials");
    }
  };

  const forgotPassword = () => {
    console.log("Hallo");
  };

  return (
    <div className="bg-slate-700 flex items-center justify-center h-full">
      <div className="bg-slate-700 rounded-lg p-8">
        <div className="bg-slate-700 flex flex-col items-center justify-center">
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
          <p className="text-red-700">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}