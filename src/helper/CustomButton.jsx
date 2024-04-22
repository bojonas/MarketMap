import { ButtonStyle } from "./style";

export default function CustomButton({ onClick }) {
    return (
        <button className={`${ButtonStyle} w-[7rem] text-xl `} onClick={onClick}>Save</button>
    );
}