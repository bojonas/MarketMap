import { useState, React } from "react"
import UploaderComponent from "./UploaderComponent";
//import { requestPostShoppingCart } from "../requests/homeRequests";


export default function Uploader(){
    const [mapping, setMapping] = useState();
    const [uploaderComponentDone,setUploaderComponentDone] = useState(false);

    const [displayMapping, setDisplayMapping] = useState();
    const [selectedItem, setSelectedItem] = useState({})

    const [cartName, setCartName] = useState("New Shopping Cart")

    

    if(mapping) {
       //console.log(mapping);
    };

    
   

    

    const adjustItem = (index, item)=>{
        //listItem_id, listItem, product_id, product_name, isAssigned
        
        const handleChange = (event)=>{
            let newInput = selectedItem
            newInput[index] = event.target.value

            console.log(newInput)
            setSelectedItem(newInput);
        }
    
        return (
            <div className="flex flex-row">
                <div className=" w-1/3">
                    {item["listItem"]}
                </div>
                <select value={selectedItem[item["listItem"]]} onChange={handleChange}>
                    {item["assignedItems"].map((item, index) => (
                    <option key={index} value={item}>
                        {/*todo: logik für bild*/}
                        {item}
                    </option>
                    ))}
                </select>
            </div>
        );
    }
   
    const handleUpload = async()=>{
        let upload = [] //Wie sieht die liste aus?
        //--> [{product_id, product_count, product_name_en}]
        for(let i = 0; i<displayMapping.length;i++){
            console.log({product_id: "/", product_count: displayMapping[i]["amount"], product_name_en: selectedItem[i]})
        }
        console.log(upload)
        console.log(mapping)
        console.log(displayMapping)
        console.log(selectedItem)


        //await requestPostShoppingCart(cartName,localStorage.getItem("user_id"),upload)
        //setShoppingCarts(prev => [...prev,upload])
    }
    

    
    return(
        <div className="w-1/2 h-1/2 m-auto bg-white flex flex-col items-center justify-center text-black">
            {!uploaderComponentDone?
            <UploaderComponent setMapping={setMapping} setUploaderComponentDone={setUploaderComponentDone} setDisplayMapping={setDisplayMapping} setSelectedItem={setSelectedItem}/>
            
            :
            <div className="overflow-auto w-full h-full">
                <input type="text" className=" h-[10%] w-full" value={cartName} onChange={(event)=>{setCartName(event.target.value)}}/>

                <div className="h-[70%] w-full bg-blue-300">
                    {displayMapping.map((item, index) => (
                        <div key={displayMapping[index]["listItem"]}>{adjustItem(index, item)}</div>
                    ))}
                </div>
                <div className="flex h-[20%] w-full bg-green-300 ">
                    <button className="bg-blue-700 w-1/2 h-1/2 m-auto hover:bg-green-100" onClick={handleUpload}>
                        Upload Cart
                    </button>
                </div>
            </div>}
            
        </div>
    )
}








