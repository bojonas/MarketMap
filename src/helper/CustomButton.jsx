export default function CustomButton({ onClick }) {
    return (
        <button className={'custom-button w-[7rem] text-xl '} onClick={onClick}>Save</button>
    );
}