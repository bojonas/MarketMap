export default function ItemSelector({cartName, setCartName, displayMapping, adjustItem, handleUpload}){
    
    return (<div className="overflow-auto w-full h-full">
                <input type="text" className=" h-[10%] w-full bg-offwhite px-[2%]" value={cartName} onChange={(event)=>{setCartName(event.target.value)}}/>

                <div className="h-[70%] w-full bg-white p-3">
                    {displayMapping.map((item, index) => (
                        <div key={displayMapping[index]["listItem"]}>{adjustItem(index, item)}</div>
                    ))}
                </div>
                <div className="flex h-[20%] w-full bg-offwhite">
                    <button className="bg-custom rounded-xl w-1/5 h-1/2 m-auto border-2 hover:border-darkgray-custom" onClick={handleUpload}>
                        Upload Cart
                    </button>
                </div>
            </div>)
}