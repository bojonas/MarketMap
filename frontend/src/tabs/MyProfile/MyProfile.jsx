import { useState, useEffect } from "react";
import { requestUpdateData, requestUser } from "../../requests/myProfileRequests";
import { useNavigate } from "react-router-dom";

export default function MyProfile(){
    

    const [showPopup, setShowPopup] = useState(false);
    const [popupLabel, setPopupLabel] = useState("")
    const [popupContent, setPopupContent] = useState("")

    const [user_id,] = useState(parseInt(localStorage.getItem("user_id"), 10))
    const[username, setUsername] = useState("no user logged in") //currently username is hardcoded, later we will automate it by user_id
    const[email, setEmail] = useState("no user logged in")
    const[firstName, setFirstName] = useState("no user logged in")
    const[lastName, setLastName] = useState("no user logged in")
    var navigator = useNavigate()

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

    const updateData = async()=>{
        if(popupContent){
            await requestUpdateData(username, popupLabel, popupContent)
            setPopupContent("")
            setPopupLabel("")
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

    const logout = ()=>{   
        localStorage.removeItem("user_id")
        navigator("/")
    }

    

    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className=" rounded-md p-6 w-full items-center">
                
                <div>
                    <ContentRow label = {"User id"} content = {user_id} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    <ContentRow label = {"Username"} content = {username} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    <ContentRow label = {"Email"} content = {email} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    <ContentRow label = {"Last Name"} content = {lastName} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/>
                    <ContentRow label = {"First Name"} content = {firstName} createPopup={createPopup} setPopupLabel={setPopupLabel} editable={false}/> 
                </div>
                <div className="flex w-1/2 justify-left mx-auto">
                    <button className="custom-button items-center mt-9" onClick={logout}>Logout</button>
                </div>
                
                
            
          </div>
          {showPopup && <Popup backPopup = {backPopup} closePopup={closePopup} popupLabel={popupLabel} setPopupContent={setPopupContent}/>}
        </div>
      );
}

function ContentRow({label="error", content ="error", editable=true, createPopup, setPopupLabel}){
    const click = async()=>{
        setPopupLabel(label)
        await createPopup()
    }
    return (
        <div className="w-1/2 mx-auto">     
            <table className="w-full border-2">
                <tbody>
                    <tr>
                        <td className="w-2/5 text-right pr-2">{label}</td>
                        {editable?<td className="w-1/2 ">{content}</td>:<td className="w-3/5">{content}</td>}
                        {editable ? <td className="w-1/10"><button className="bg-white text-black hover:bg-gray-600 w-full" onClick={click}>Edit</button></td>:null}
                    </tr>
                </tbody>
            </table>
             
        </div>
    )
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