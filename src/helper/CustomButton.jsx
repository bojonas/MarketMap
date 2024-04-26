export default function CustomButton({ action, onClick, width, height }) {
    const scale = Math.min(width, height);
    return (
        <button className='custom-button w-[7rem] shadow-slate-700' 
        style={{
            width: `${width/2}px`,
            height: `${height/8}px`,
            fontSize: `${scale/12}px`,
        }}
        onClick={onClick}>{action}</button>
    );
}