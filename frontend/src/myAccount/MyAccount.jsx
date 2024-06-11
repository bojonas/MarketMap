import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";

export default function MyAccount({isLoggedIn, setIsLoggedIn}){
  const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false);

    const toggleDropdown = () => {
      if(!isLoggedIn){
        login()
      }
      else{
        setIsVisible(!isVisible);
      }  
    };

    const login = ()=>{
      navigate("/login")
      setIsVisible(false)
    }

    const myProfile = ()=>{
      navigate("/my_profile")
      setIsVisible(false)
    }
    const logout = () =>{
      localStorage.removeItem("user_id")
      localStorage.removeItem("permission")
      setIsLoggedIn(false)
      setIsVisible(false)
      navigate("/")
    }

    const settings = ()=>{
      navigate("/settings")
      setIsVisible(false)
    }

  return (
    <div className=" w-1/2 justify-center relative flex">
      {isLoggedIn ? <FaUserCircle 
        onClick={toggleDropdown}
        className=" text-black hover:text-offwhite cursor-pointer"
        size={35}/> :
      <button 
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-custom text-white rounded-full hover:bg-blue-600"
      >
        {
         'Login'//todo: get_initials function instead of 'B'
        }
      </button>}
      <DropdownMenu isVisible={isVisible}>
        {isLoggedIn?<div className="dropdown-content" onClick={myProfile}>My Profile</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={settings}>Settings</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={logout}>Logout</div>:null}
      </DropdownMenu>
    </div>
  );
        
}