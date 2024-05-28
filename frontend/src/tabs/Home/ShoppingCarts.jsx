import { useState, useEffect } from 'react';
import { requestGetShoppingCarts, requestPostShoppingCart, requestRemoveShoppingCart, requestUpdateShoppingCart } from "../../requests/homeRequests";
import { FaTrashCan } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";

export default function ShoppingCarts() {
    const user_id = localStorage.getItem('user_id')
    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [cartNames, setCartNames] = useState([])

    useEffect(() => {
        const getShoppingCarts = async () => {
            const data = await requestGetShoppingCarts(user_id);
            if (!data) return;
            setShoppingCarts(data);
            setCartNames(data.map(cart => cart.cart_name))

        }
        getShoppingCarts();
    }, [user_id]);

    const handleInputChange = (e, i) => {
        const newCartNames = [...cartNames];
        newCartNames[i] = e.target.value;
        setCartNames(newCartNames);
    };    

    const updateCartName = async (e, i, cartName, cart_id, prevCartName) => {
        const name = cartName.trim();
        if (name === prevCartName) return;

        await requestUpdateShoppingCart(cart_id, name);
        const newShoppingCarts = [...shoppingCarts];
        newShoppingCarts[i].cart_name = name;
        setShoppingCarts(newShoppingCarts);
    }

    const removeShoppingCart = async (cart_id) => {
        if (!cart_id) return;
        const rowCount = await requestRemoveShoppingCart(cart_id)
        if (rowCount > 0) setShoppingCarts(shoppingCarts.filter(shoppingCart => shoppingCart.cart_id !== cart_id));
    }

    const addShoppingCart = async () => {
        if (shoppingCarts.length === 9) return;
        const cart_id = await requestPostShoppingCart('', user_id, []);
        if (cart_id) setShoppingCarts([...shoppingCarts, { cart_id: cart_id, cart_name: '', products: [] }]);
    }

    return (
        <div className='absolute z-0 bottom-[5%] right-[10%] flex flex-col w-1/3 h-2/3 text-black bg-darkoffwhite rounded-xl'>
            <p className='p-[3svh] text-[2.5svh] font-bold'>My Carts:</p>
            <div className='flex flex-col w-full h-full p-[4%] gap-[5%] bg-offwhite overflow-scroll'>
                { shoppingCarts.map((shoppingCart, i) => (
                    <div key={i} className='flex justify-center items-center gap-[10%] w-full'>
                        <input 
                            placeholder='not named'
                            onBlur={(e) => updateCartName(e, i, cartNames[i], shoppingCart.cart_id, shoppingCart.cart_name)} 
                            onChange={e => handleInputChange(e, i)} value={cartNames[i]} 
                            className='placeholder:italic placeholder-gray-700 font-bold bg-offwhite rounded-lg w-[19%] border-[0.4svh] border-offwhite hover:border-purple-custom outline-none'
                        />
                        <BsCart4 size={20} className='hover:text-purple-custom cursor-pointer'/>
                        <FaTrashCan onClick={() => removeShoppingCart(shoppingCart.cart_id)} className='hover:text-purple-custom cursor-pointer'/>
                    </div>
                ))}
            </div>
            <div className='flex justify-center items-center w-full h-[20%] bg-darkoffwhite rounded-b-xl'>
                <div onClick={addShoppingCart} className='flex justify-center items-center gap-[5%] w-[20%] hover:text-purple-custom cursor-pointer'>
                    <FaCartPlus size={24}/>
                    <p>Add Cart</p>
                </div>
            </div>
        </div>
    );
}