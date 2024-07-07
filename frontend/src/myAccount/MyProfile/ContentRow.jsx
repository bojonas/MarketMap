export default function ContentRow({label="error", content ="error", editable=true, createPopup, setPopupLabel}){
    const click = async()=>{
        setPopupLabel(label)
        await createPopup()
    }
    return (
        <div className="w-full mx-auto py-2 bg-black text-offwhite rounded-full">     
            <table className="w-full">
                <tbody>
                    <tr>
                        <td className="w-2/5 text-right pr-2 border-r-2 border-offwhite">{label}</td>
                        {editable?
                            <td className="pl-2 w-1/2">{content}</td>:
                            <td className="pl-2 w-3/5">{content}</td>}
                        {editable ? 
                            <td className="w-1/10 pr-1 flex">
                                <button className="bg-black text-offwhite border-offwhite border-2 border-custom-hover w-1/2 mx-auto rounded-lg" onClick={click}>Edit</button>
                            </td>:null}
                    </tr>
                </tbody>
            </table>
             
        </div>
    )
}