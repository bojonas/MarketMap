export default function CustomButton({ onClick }) {
    return (
        <button className='bg-sky-950 text-white w-28 h-fit rounded-full p-4 text-xl font-bold' onClick={onClick}>Save</button>
    );
}