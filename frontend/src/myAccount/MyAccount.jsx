import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyAccount({isLoggedIn, setIsLoggedIn, content, setContent}){

  const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false);


    const loadData = async () => {
      const user_id = localStorage.getItem("user_id");
      if(!user_id) return;
      setContent("My Profile"); //todo: get_initials function
      setIsLoggedIn(true);
    }

    const toggleDropdown = () => {
      if(content === "Login"){
        login()
      }
      else{
        setIsVisible(!isVisible);
        loadData();
      }
        
    };


    useEffect(() => {
      const loadData = async () => {
          const user_id = localStorage.getItem("user_id")
          if(!user_id) return;
          setContent("My Profile") //todo: get_initials function
          setIsLoggedIn(true)
      }
      loadData();
  }, [setIsLoggedIn, setContent]);

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
      setContent("Login")
      navigate("/")
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
        {isLoggedIn?<div className="dropdown-content" onClick={myProfile}>My Profile</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={logout}>Logout</div>:null}
      </DropdownMenu>
    </div>
  );
        
}