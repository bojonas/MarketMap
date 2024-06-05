import { useState, React } from "react"
import { parseFile } from "./parseFile";

export default function Uploader(){
    const [content, setContent] = useState()
    if(content) console.log(content);
    const handleUpload = ()=>{


    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        var test;
        if (file) {
            if(file.name.endsWith('.txt')){
                test = await parseFile(file, "txt")

            }
            else{
                test = await parseFile(file, "docx")
            }
            
            console.log(test)
        }
    };
    return(
        <div className="w-1/2 h-1/2 m-auto bg-white flex flex-col items-center justify-center text-black">
            <div className="flex flex-row h-3/4 w-full">
                <input 
                    type="text" 
                    className="w-1/2 h-full bg-red-300 placeholder-black" 
                    placeholder="Copy Shopping list here"
                    onChange={(e)=>{setContent(e.target.value)}}
                />
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