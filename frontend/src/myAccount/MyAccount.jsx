import DropdownMenu from "./DropdownMenu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaRegMap} from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";

export default function MyAccount({isLoggedIn, setIsLoggedIn}){
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false);
    const isMarket = localStorage.getItem("permission") === ("market_owner"||"market")

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

    const myMarket = ()=>{
      navigate("/my_market")
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
    <div className=" w-1/3 justify-center relative flex">
      {isLoggedIn ? <FaUserCircle 
        onClick={toggleDropdown}
        className=" text-profile hover:text-offwhite cursor-pointer"
        size={35}/> :
      <button 
        onClick={toggleDropdown}
        className="px-4 py-2 bg-gray-custom text-white rounded-full bg-custom-hover flex flex-row gap-[8%] justify-center items-center"
      > <CiLogin size={20}/>
        {
         'Login'
        }
      </button>}
      <DropdownMenu isVisible={isVisible}>
        {isLoggedIn?<div className="dropdown-content" onClick={myProfile}><MdAccountCircle size={20}/>My Profile</div>:null}
        {isMarket?<div className="dropdown-content" onClick={myMarket}><FaRegMap size={15}/>My Market</div>:null}
        {false?<div className="dropdown-content" onClick={settings}>Settings</div>:null}
        {isLoggedIn?<div className="dropdown-content" onClick={logout}><CiLogout size={20}/>Logout</div>:null}
      </DropdownMenu>
    </div>
  );
        
}