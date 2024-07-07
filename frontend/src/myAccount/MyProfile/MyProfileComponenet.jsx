import { useState, useEffect } from "react";
import { requestUpdateData, requestUser } from "../../requests/myProfileRequests";
import ContentRow from "./ContentRow";
import ColorElement from "../Settings/SettingOptions/Color/ColorElement";
import Popup from "./Popup";

export default function MyProfileComponent(){
    

    const [showPopup, setShowPopup] = useState(false);
    const [popupLabel, setPopupLabel] = useState("")
    const [popupContent, setPopupContent] = useState("")

    const [user_id] = useState(parseInt(localStorage.getItem("user_id"), 10))
    const[username, setUsername] = useState("no user logged in") 
    const[email, setEmail] = useState("no user logged in")
    const[firstName, setFirstName] = useState("no user logged in")
    const[lastName, setLastName] = useState("no user logged in")

    useEffect(() => {
        const loadData = async () => {
            if(!user_id) return;
            const result = await requestUser(user_id);
            setUsername(result.username);
            setEmail(result.email);
            setFirstName(result.firstName);
            setLastName(result.lastName);
        }
        loadData();
    }, [user_id]);

    const loadData = async () => {
        if(!user_id) return;
        const result = await requestUser(user_id);
        setUsername(result.username);
        setEmail(result.email);
        setFirstName(result.firstName);
        setLastName(result.lastName);
    }

    const updateData = async()=>{
        if(popupContent){
            await requestUpdateData(user_id, popupLabel, popupContent, false)
            setPopupContent("");
            setPopupLabel("");
            loadData();
        }
            
    }

    const createPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        updateData()
        setShowPopup(false);
    };

    const backPopup = () => {
        setShowPopup(false);
    };

    

    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="w-[75%] rounded-md items-center">
                
                <div className="flex flex-col justify-center bg-darkgray-custom w-full m-auto p-[50svm] space-y-2">
                    <ContentRow label = {"Username"} content = {username} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    <ContentRow label = {"Email"} content = {email} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={true}/>
                    <ContentRow label = {"Last Name"} content = {lastName} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={true}/>
                    <ContentRow label = {"First Name"} content = {firstName} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={true}/> 
                    
                    <ContentRow label = {"Color"} content={
                        <div className="flex flex-row w-1/2 mx-auto">
                            <ColorElement label={"Personal"} isVisible={false}/>
                        </div>
                        } createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    
                </div>

                
                
            
          </div>
          {showPopup && <Popup backPopup = {backPopup} closePopup={closePopup} popupLabel={popupLabel} setPopupContent={setPopupContent}/>}
          
          
        </div>
        

      );
}




