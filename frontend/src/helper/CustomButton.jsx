export default function CustomButton({ action, onClick, scale }) {
    return (
        <button className='custom-button shadow-slate-700 w-[6svw] h-[6svh]' style={{fontSize: `${scale/3}px`}} onClick={onClick}>{action}</button>
    );
}