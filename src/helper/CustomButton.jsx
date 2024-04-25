export default function CustomButton({ onClick, ToolbarWidth, ToolbarHeight }) {
    const scale = Math.min(ToolbarWidth,ToolbarHeight);
    return (
        <button className='custom-button w-[7rem] shadow-slate-700' 
        style={{
            width: `${ToolbarWidth/2}px`,
            height: `${ToolbarHeight/8}px`,
            fontSize: `${scale/12}px`,
        }}
        onClick={onClick}>Save</button>
    );
}