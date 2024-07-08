import { useState } from "react";
import {requestCreateMarket, requestCreateUser} from '../../requests/loginRequests';
import { useNavigate } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

export default function Register({setLoginFlag}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [marketName, setMarketName] = useState("");
    const [street, setStreet] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const [isMarket, setIsMarket] = useState (false)
    var navigator = useNavigate()

    const register = async()=>{
        if(username !=="" || password.length<8 || email !== ""){
            if(isMarket){
              await requestCreateMarket(username, email, password, firstName, lastName,"market_owner", marketName, street, zip, city, country)
            }
            else{
              await requestCreateUser(username, email, password, firstName, lastName,"user")
            }
            
            navigator("/")
        }
        else{
            setErrorMessage ("Invalid Credentials")
        }
        
        
    }

    const login = ()=>{setLoginFlag(true)}

    return (
        <div className="flex items-center justify-center h-full">
          <div className="rounded-lg p-8">
            <div className="flex flex-col items-center justify-center sourrounding-div">
              <div className="flex flex-row gap-[5%]">
              <div className="flex flex-col">
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
              </div>
              <div hidden={!isMarket}>
                  <div className="flex flex-col">
                  <input
                    type="test"
                    placeholder="Market Name"
                    className="custom-input mb-4"
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}
                  />
                  <input
                    type="test"
                    placeholder="Street"
                    className="custom-input mb-4"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Zip"
                    className="custom-input mb-4"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                  <input
                    type="test"
                    placeholder="City"
                    className="custom-input mb-4"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="custom-input mb-4"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                  </div>
                </div>
                </div>
              

              <div className="mb-3 flex flex-row">
                <p className="text-black mr-3">I am a Market:</p>
                <input type="checkbox" name="check" id="check" checked={isMarket} onChange={()=>{setIsMarket(!isMarket)}}/>
              </div>
              
              <button className="bg-custom border-2 hover:border-black rounded-3xl w-[7.5svw] h-10 flex flex-row justify-center items-center gap-[8%]" onClick={register}>
                <CiLogin size={20}/>
                Register
              </button>
              <div className="text-black">
                <button className="custom-button-forgotPw" onClick={login}>
                  Sign In
                </button>
              </div>
              
              
              {errorMessage?<p className="text-red-700">{errorMessage}</p>:null}
            </div>
          </div>
        </div>
      );
}