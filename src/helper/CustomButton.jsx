export default function CustomButton({ action, onClick, scale }) {
    return (
        <button className='custom-button w-[7rem] shadow-slate-700' 
        style={{
            width: `${scale/6.5}px`,
            height: `${scale/12.5}px`,
            fontSize: `${scale/33}px`,
        }}
        onClick={onClick}>{action}</button>
    );
}