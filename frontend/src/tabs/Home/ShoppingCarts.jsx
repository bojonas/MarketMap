export default function ShoppingCarts() {
    return (
        <div className='absolute z-0 bottom-[5%] right-[10%] flex flex-col w-1/3 h-2/3 text-black bg-darkoffwhite rounded-xl'>
             <p className='p-[3svh] text-[2.5svh] font-bold'>Shopping Carts:</p>
            <div className='flex flex-col w-full h-full p-[4%] gap-[5%] bg-offwhite overflow-scroll rounded-b-xl'>
            </div>
        </div>
    );
}