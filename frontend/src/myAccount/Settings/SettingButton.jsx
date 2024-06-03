
export default function SettingButton({label, setContent, componenet, isActive, change}){
    const buttonAction = ()=>{
        setContent({header: label, body: (componenet)})
        change(label)
    }

    
    return(
        <div>
            {isActive?<button onClick={buttonAction} className="bg-gray-600 text-left">{label}</button>:
            <button onClick={buttonAction} className="hover:bg-gray-500 text-left">{label}</button>}
        </div>
    );
}