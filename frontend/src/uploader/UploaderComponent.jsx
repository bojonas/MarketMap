import { useState, React } from "react"
import { parseFile, parseText } from "./parseFile";
import assignProducts from "./assignProducts";
import prepareList from "./prepareList";
import { initializeFill } from "./initializeFill";


export default function UploaderComponent({setMapping, setUploaderComponentDone, setDisplayMapping, setSelectedItem}){

    const [content, setContent] = useState();
    const [contentArray, setContentArray] = useState();
    
    const handleUpload = async()=>{
        if(!content){alert("Insert Shoping List"); return}
        let mappingVar = await assignProducts(contentArray);
        setMapping(mappingVar);
        setUploaderComponentDone(true);
        setDisplayMapping(prepareList(mappingVar))
        initializeFill(prepareList(mappingVar),setSelectedItem)

    }

    const handleTextChange = async (event)=>{
        setContent(event.target.value);
        setContentArray(parseText(event.target.value));
        
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        var test;
        if (file) {
            if(file.name.endsWith('.txt')){
                test = await parseFile(file, "txt");
                setContent(test["text"]);
                setContentArray(test["output"]);

            }
            else if(file.name.endsWith('.docx')){
                test = await parseFile(file, "docx");
                setContent(test["text"]);
                setContentArray(test["output"]);
            }
            else{
                console.error("Invalid File Type");
            }
            
        }
    };
    return(
        <div className="w-full h-full">
            <div className="flex flex-row h-3/4 w-full">
                <textarea
                className="w-1/2 h-full bg-red-300 placeholder-black" 
                placeholder="Copy Shopping Cart here" 
                onChange={handleTextChange} 
                value={content}></textarea>
                <input
                    type="file" 
                    className="w-1/2 h-full bg-yellow-300 placeholder-black" 
                    placeholder="Copy Shopping list here"
                    onChange={handleFileChange}

                />
            </div>
            <div className="h-1/4 w-full flex">
                <button className="bg-blue-700 w-1/2 h-1/2 m-auto rounded-2xl hover:bg-green-500"
                    onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </div>
    )
}