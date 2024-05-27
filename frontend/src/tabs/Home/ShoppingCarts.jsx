import { useState, useEffect } from 'react';
import { requestGetShoppingCarts, requestPostShoppingCart, requestRemoveShoppingCart, requestUpdateShoppingCart } from "../../requests/homeRequests";
import { FaTrashCan } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";

export default function ShoppingCarts() {
    const user_id = localStorage.getItem('user_id')
    const [shoppingCarts, setShoppingCarts] = useState([]);

    useEffect(() => {
        const getShoppingCarts = async () => {
          const data = await requestGetShoppingCarts(user_id);
          if (data) setShoppingCarts(data);
        }
        getShoppingCarts();
    }, [user_id]);

    const handleInputChange = (e, i) => {
        const cart = [...shoppingCarts];
        cart[i]['cart_name'] = e.target.value;
        setShoppingCarts(cart);
    };

    const updateCartName = async (e, cart_id) => {
        await requestUpdateShoppingCart(cart_id, e.target.value.trim())
    }

    const removeShoppingCart = async (cart_id) => {
        if (!cart_id) return;
        const rowCount = await requestRemoveShoppingCart(cart_id)
        if (rowCount > 0) setShoppingCarts(shoppingCarts.filter(shoppingCart => shoppingCart.cart_id !== cart_id));
    }

    const addShoppingCart = async () => {
        if (shoppingCarts.length === 9) return;
        const result = await requestPostShoppingCart('', user_id, []);
        if ('cart_id' in result) setShoppingCarts([...shoppingCarts, { cart_id: result.cart_id, cart_name: '', products: [] }]);
    }

    return (
        <div className='absolute z-0 bottom-[5%] right-[10%] flex flex-col w-1/3 h-2/3 text-black bg-darkoffwhite rounded-xl'>
            <p className='p-[3svh] text-[2.5svh] font-bold'>My Carts:</p>
            <div className='flex flex-col w-full h-full p-[4%] gap-[5%] bg-offwhite overflow-scroll'>
                { shoppingCarts.map((shoppingCart, i) => (
                    <div key={i} className='flex justify-center items-center gap-[5%] w-full'>
                        <input 
                            placeholder='not named'
                            onBlur={(e) => updateCartName(e, shoppingCart.cart_id)} 
                            onChange={e => handleInputChange(e, i)} value={shoppingCart.cart_name} 
                            className='placeholder:italic placeholder-gray-700 font-bold text-center bg-offwhite rounded-lg border-[0.4svh] border-offwhite hover:border-purple-custom outline-none'
                        />
                        <div className='flex items-center'>
                            <FaTrashCan onClick={() => removeShoppingCart(shoppingCart.cart_id)} className='hover:text-purple-custom cursor-pointer'/>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex justify-center items-center w-full h-[20%] bg-darkoffwhite rounded-b-xl'>
                <div onClick={addShoppingCart} className='flex justify-center items-center gap-[5%] w-[20%] hover:text-purple-custom cursor-pointer'>
                    <FaCartPlus size={25}/>
                    <p>add cart</p>
                </div>
            </div>
        </div>
    );
}