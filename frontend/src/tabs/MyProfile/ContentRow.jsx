export default function ContentRow({label="error", content ="error", editable=true, createPopup, setPopupLabel}){
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