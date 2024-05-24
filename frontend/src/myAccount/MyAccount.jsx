import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyAccount(){

  const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] =  useState("Login")
    const [isLoggedIn, setIsLoggedIn] = useState(true)


    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    const login = ()=>{
      navigate("/login")
      setIsVisible(false)
    }

    const register=()=>{
      navigate("/register")
      setIsVisible(false)
    }

    const myProfile = ()=>{
      navigate("/my_profile")
      setIsVisible(false)
    }
    const logout = () =>{
      localStorage.removeItem("user_id")
      setIsLoggedIn(false)
    }

  return (
    <div className="relative p-5">
      <button 
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-custom text-white rounded-full hover:bg-blue-600"
      >
        {content}
      </button>
      <DropdownMenu isVisible={isVisible}>
        {isLoggedIn?null:<div className="dropdown-content" onClick={login}>Login</div>}
        {isLoggedIn?null: <div className="dropdown-content" onClick={register}>Register</div>}
        {isLoggedIn?<div className="dropdown-content" onClick={myProfile}>My Profile</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={logout}>Logout</div>:null}
      </DropdownMenu>
    </div>
  );
        
}