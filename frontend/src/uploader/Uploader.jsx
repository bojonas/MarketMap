import { useState, React } from "react"
import UploaderComponent from "./UploaderComponent";
import { requestPostShoppingCart } from "../requests/homeRequests";
import { useNavigate } from "react-router-dom";
import ItemSelector from "./ItemSelector";


export default function Uploader(){
    const [mapping, setMapping] = useState();
    const [uploaderComponentDone,setUploaderComponentDone] = useState(false);

    const [displayMapping, setDisplayMapping] = useState();
    const [selectedItem, setSelectedItem] = useState({})

    const [cartName, setCartName] = useState("New Shopping Cart");

    const navigator = useNavigate()

    

    if(mapping) {
       //console.log(mapping);
    };


    const adjustItem = (index, item)=>{
        //listItem_id, listItem, product_id, product_name, isAssigned
        
        const handleChange = (event)=>{
            let newInput = selectedItem
            newInput[index] = event.target.value
            setSelectedItem(newInput);
        }
    
        return (
            <div className="flex flex-row">
                <div className="rounded-xl p-2 w-1/2 border-2 border-black mb-[1%] mr-[0.5%]">
                    {item["listItem"]}
                </div>
                <select className="rounded-full border-2 border-black mb-[1%] ml-[0.5%] w-1/2 outline-none border-custom-hover cursor-pointer" value={selectedItem[item["listItem"]]} onChange={handleChange}>
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
        let upload = []
        for(let i = 0; i<displayMapping.length;i++){
            upload.push({product_id: mapping.find(item => item.product_name === selectedItem[i])["product_id"], product_count: displayMapping[i]["amount"], product_name_en: selectedItem[i]})
            
        }


        await requestPostShoppingCart(cartName,localStorage.getItem("user_id"),upload)
        navigator("/")
    }
    

    
    return(
        <div className="w-1/2 h-1/2 m-auto bg-white flex flex-col items-center justify-center text-black">
            {!uploaderComponentDone?
            <UploaderComponent setMapping={setMapping} setUploaderComponentDone={setUploaderComponentDone} setDisplayMapping={setDisplayMapping} setSelectedItem={setSelectedItem}/>
            :
            <ItemSelector cartName={cartName} setCartName={setCartName} displayMapping={displayMapping} adjustItem={adjustItem} handleUpload={handleUpload}/>
            }
            
        </div>
    )
}








