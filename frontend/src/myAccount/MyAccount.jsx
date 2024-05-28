import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="relative p-5">
      <button 
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-custom text-white rounded-full hover:bg-blue-600"
      >
        {
        isLoggedIn ? 'B' : 'Login'//todo: get_initials function instead of 'B'
        }
      </button>
      <DropdownMenu isVisible={isVisible}>
        {isLoggedIn?<div className="dropdown-content" onClick={myProfile}>My Profile</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={logout}>Logout</div>:null}
      </DropdownMenu>
    </div>
  );
        
}