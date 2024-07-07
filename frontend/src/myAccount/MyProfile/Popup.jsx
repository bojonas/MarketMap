export default function Popup({ backPopup, closePopup, popupLabel, setPopupContent }) {
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