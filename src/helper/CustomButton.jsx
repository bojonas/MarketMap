export default function CustomButton({ onClick, scale }) {
    const ButtonSize = scale*1.5;
    return (
        <button className={'custom-button w-[7rem] shadow-slate-700'} 
        style={{
            width: `${ButtonSize}px`,
            height: `${ButtonSize/2.1}px`,
            fontSize: `${ButtonSize/6}px`,
        }}
        onClick={onClick}>Save</button>
    );
}