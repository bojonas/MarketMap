import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { requestGetShoppingCarts, requestPostShoppingCart, requestRemoveShoppingCart, requestUpdateShoppingCart } from "../../requests/homeRequests";
import { FaTrashCan } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { BsCart4 } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';

export default function ShoppingCarts({ user_id }) {
    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [cartNames, setCartNames] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const navigator = useNavigate()

    useEffect(() => {
        const getShoppingCarts = async () => {
            const data = await requestGetShoppingCarts(user_id);
            if (!data) return;
            setShoppingCarts(data);
            setCartNames(data.map(cart => cart.cart_name || ''));
            setIsDataFetched(true);
        }
        getShoppingCarts();
    }, [user_id]);

    const handleInputChange = (e, i) => {
        const newCartNames = [...cartNames];
        newCartNames[i] = e.target.value;
        setCartNames(newCartNames);
    };    

    const updateCartName = async (i, cartName, cart_id, prevCartName) => {
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

    const uploadShoppingCart = async () => {
        navigator('/uploader')
    }   

    return (
        <div className='absolute z-0 bottom-[2%] right-0 p-[2%] px-[4%] flex flex-col w-2/3 h-5/6'>
            <div className='flex flex-col bg-custom rounded-xl h-full'>
                <p className='p-[2.5svh] text-[3svh] font-bold'>My Shopping Carts:</p>
                <div className='flex flex-col w-full h-full p-[4%] pl-[10%] pr-[5%] gap-[6%] bg-gray-custom overflow-scroll'>
                    { isDataFetched && shoppingCarts.map((shoppingCart, i) => (
                        <div key={i} className='flex justify-between items-center w-full bg-darkgray-custom p-[2%] px-[5%] rounded-3xl'>
                            <input 
                                name={`cartName-${i}`}
                                placeholder='not named'
                                onBlur={(e) => updateCartName(i, cartNames[i], shoppingCart.cart_id, shoppingCart.cart_name)} 
                                onChange={e => handleInputChange(e, i)} value={cartNames[i] || ''} 
                                className='placeholder:italic placeholder-gray-100 font-bold text-center bg-darkgray-custom rounded-lg border-[0.4svh] border-darkgray-custom border-custom-hover outline-none'
                            />
                            <BsCart4 
                                size={20} 
                                className='text-custom-hover cursor-pointer outline-none'
                                data-tooltip-id={`info-${i}`} 
                                data-tooltip-html={shoppingCart.products.length > 0 ? shoppingCart.products.map(product => product.product_name_en).join('<br/>') : 'empty'}
                            />
                            <Tooltip id={`info-${i}`}/>
                            <FaTrashCan onClick={() => removeShoppingCart(shoppingCart.cart_id)} className='text-custom-hover cursor-pointer'/>
                        </div>              
                    ))}
                </div>
                <div className='flex justify-center items-center w-full h-[20%] gap-[5%] bg-gray-custom rounded-b-xl'>
                    <div onClick={addShoppingCart} className='flex justify-center items-center w-fit text-custom-hover cursor-pointer'>
                        <FaCartPlus size={24}/>
                        <p className='ml-[0.5svw]'>Add Cart</p>
                    </div>
                    <div onClick={uploadShoppingCart} className='flex justify-center items-center w-fit text-custom-hover cursor-pointer'>
                        <FaCartArrowDown size={24}/>
                        <p className='ml-[0.5svw]'>Upload Cart</p>
                    </div>
                </div>
            </div>
        </div>
    );
}