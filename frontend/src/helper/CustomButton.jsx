export default function CustomButton({ action, onClick }) {
    return (
        <button className='custom-button shadow-slate-700 w-[6svw] h-[6svh] text-[2.6svh]' onClick={onClick}>{action}</button>
    );
}