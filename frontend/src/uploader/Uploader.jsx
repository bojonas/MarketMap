import { useState, React } from "react"
import UploaderComponent from "./UploaderComponent";
//import { requestPostShoppingCart } from "../requests/homeRequests";


export default function Uploader(){
    const [mapping, setMapping] = useState();
    const [uploaderComponentDone,setUploaderComponentDone] = useState(false);

    const [displayMapping, setDisplayMapping] = useState();
    const [selectedItem, setSelectedItem] = useState({})

    

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
                        {item}
                    </option>
                    ))}
                </select>
            </div>
        );
    }
   
    const handleUpload = async()=>{
        let upload = [] //Wie sieht die liste aus?
        console.log(upload)
        console.log(displayMapping)
        console.log(selectedItem)
        //await requestPostShoppingCart("new shopping cart",localStorage.getItem("user_id"),upload)
    }
    

    
    return(
        <div className="w-1/2 h-1/2 m-auto bg-white flex flex-col items-center justify-center text-black">
            {!uploaderComponentDone?
            <UploaderComponent setMapping={setMapping} setUploaderComponentDone={setUploaderComponentDone} setDisplayMapping={setDisplayMapping} setSelectedItem={setSelectedItem}/>
            
            :
            <div className="overflow-auto w-full h-full">
                <div className="h-3/4 w-full bg-blue-300">
                    {displayMapping.map((item, index) => (
                        <div key={displayMapping[index]["listItem"]}>{adjustItem(index, item)}</div>
                    ))}
                </div>
                <div className="flex h-1/4 w-full bg-green-300 ">
                    <button className="bg-blue-700 w-1/2 h-1/2 m-auto hover:bg-green-100" onClick={handleUpload}>
                        Upload Cart
                    </button>
                </div>
            </div>}
            
        </div>
    )
}








