import ColorElement from "./ColorElement"


export default function Color(){
    return(
        <div className="flex flex-col w-full h-full relative">
                <div className="flex flex-row">
                    <ColorElement label={"Personal"}/>
                </div>
                <div className="flex flex-row mt-6">
                    <ColorElement label={"Market Primary"}/>
                </div>
                <div className="flex flex-row mt-6">
                    <ColorElement label={"Market Secondary"}/>
                </div>
        </div>
    )
}