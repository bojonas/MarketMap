export default function CustomButton({ onClick }) {
    return (
        <button className={'custom-button w-[7rem] text-xl shadow-slate-700'} onClick={onClick}>Save</button>
    );
}