
export default function SettingContent({content}){
    return (
        <div className="text-2xl border-2 border-offwhite w-3/4">
            <div className="bg-offwhite text-black">{content["header"]}</div>
            {content["body"]}
        </div>
    );
}