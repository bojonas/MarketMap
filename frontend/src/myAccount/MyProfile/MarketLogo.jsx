import { useState } from "react";

export default function MarketLogo({src}){
    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState(null);

    const handleEdit = ()=>{
        setIsOpen(true)
    }

    const handleBack = ()=>{
        setIsOpen(false)
    }

    return (
      <div className="relative group">
        <img src={src} alt="Logo" className="w-[15%] h-auto m-auto mb-[3%] object-cover" />
        <div className="absolute w-[15%] h-full m-auto inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={handleEdit}>
          <span className="text-lg">Edit</span>
        </div>
        <Popup isOpen={isOpen} onClose={()=>{setIsOpen(false)}}>
            <div className="text-black flex flex-row">
                <div className="flex items-center w-1/2">Current Picture:</div>
                <div className="flex items-center w-1/2">New Picture:</div>
            </div>
            <div className="text-black flex flex-row">
                <img src={src} alt="Logo" className=" h-1/2  p-2 w-1/2" />
                <FileUpload file={file} setFile={setFile}/>
            </div>
            <div className="text-black flex flex-row justify-center mt-[2%]">
                <button className='custom-button gap-[10%] bg-darkgray-custom border-darkgray-custom border-secondary-hover h-[5.5svh] text-[2.2svh] cursor-pointer' onClick={handleBack}>Back</button>
                <div className="w-[10%]"></div>
                <button className='custom-button gap-[10%] bg-offwhite border-offwhite border-secondary-hover text-black h-[5.5svh] text-[2.2svh] cursor-pointer'>Save</button>
            </div>
        </Popup>
      </div>
    );
  };



  const Popup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg relative w-[40%] h-auto">
          <button className="absolute top-2 right-2" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };


  const FileUpload = ({file, setFile}) => {
  
    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    };
  
    return (
      <div className="p-4">
        <label className="bg-offwhite text-custom-black px-4 py-2 rounded cursor-pointer">
          Datei auswählen
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <div className="mt-4">
            <img
              src={URL.createObjectURL(file)}
              alt="Selected"
              className="max-w-full max-h-full"
            />
          </div>
        )}
      </div>
    );
  };
