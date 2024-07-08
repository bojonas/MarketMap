import { useState, React } from "react"
import { parseFile, parseText } from "./parseFile";
import assignProducts from "./assignProducts";
import prepareList from "./prepareList";
import { initializeFill } from "./initializeFill";


export default function UploaderComponent({setMapping, setUploaderComponentDone, setDisplayMapping, setSelectedItem, setIsAlert}){

    const [content, setContent] = useState();
    const [contentArray, setContentArray] = useState();
    
    const handleUpload = async()=>{
        if(!content){setIsAlert(true); return}
        const mappingVar = await assignProducts(contentArray);
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
                className="w-1/2 h-full bg-white placeholder-black border-offwhite border-2 p-4" 
                placeholder="Copy Shopping Cart here" 
                onChange={handleTextChange} 
                value={content}></textarea>
                <input
                    type="file" 
                    className="w-1/2 h-full bg-white placeholder-black border-offwhite border-2 p-4" 
                    placeholder="Copy Shopping list here"
                    onChange={handleFileChange}
                />
            </div>
            <div className="h-1/4 w-full flex bg-offwhite">
                <button className="bg-custom w-1/5 h-1/2 m-auto rounded-2xl border-2 hover:border-black "
                    onClick={handleUpload}>
                    Upload
                </button>
            </div>
        </div>
    )
}