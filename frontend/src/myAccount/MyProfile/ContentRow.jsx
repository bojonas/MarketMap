export default function ContentRow({label="error", content ="error", editable=true, createPopup, setPopupLabel}){
    const click = async()=>{
        setPopupLabel(label)
        await createPopup()
    }
    return (
        <div className="w-full mx-auto">     
            <table className="w-full border-2  text-black">
                <tbody>
                    <tr>
                        <td className="w-2/5 text-right pr-2 border-r-black border-r-2 border-b-2 border-b-black">{label}</td>
                        {editable?<td className="w-1/2 border-b-2 border-b-black">{content}</td>:<td className="w-3/5 border-b-2 border-b-black">{content}</td>}
                        {editable ? <td className="w-1/10 border-b-2 border-b-black "><button className="bg-white text-black hover:bg-gray-600 w-full" onClick={click}>Edit</button></td>:null}
                    </tr>
                </tbody>
            </table>
             
        </div>
    )
}