import { useState, useEffect } from "react";
import { requestUpdateData, requestUser } from "../../requests/myProfileRequests";
import ContentRow from "./ContentRow";
import ColorElement from "../Settings/SettingOptions/Color/ColorElement";

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
            await requestUpdateData(username, popupLabel, popupContent)
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
          <div className=" rounded-md p-6 w-full items-center">
                
                <div>
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




function Popup({ backPopup, closePopup, popupLabel, setPopupContent }) {
    return (
        <div className="fixed inset-1 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md text-black">
                <h2 className="text-xl font-semibold mb-4">Edit: {popupLabel}</h2>
                <div className="mb-4">
                    <input type="text" className="custom-input" placeholder={"New "+ popupLabel} onChange={(e)=>{setPopupContent(e.target.value)}} />
                </div>
                <button onClick={backPopup} className="bg-red-500 text-white px-4 py-2 rounded-md mr-3 hover:bg-red-400">Back</button>   
                <button onClick={closePopup} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 ">Save</button>
            </div>
        </div>
    );
}