import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { requestGetShoppingCarts, requestPostShoppingCart, requestRemoveShoppingCart, requestUpdateShoppingCart } from "../../requests/homeRequests";
import { FaTrashCan } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
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
        <div className='absolute z-0 bottom-[2%] right-0 p-[2%] pt-[4%] px-[4%] flex flex-col w-2/3 h-full'>
            <div className='flex flex-col bg-custom rounded-2xl h-full'>
                <p className='p-[2svh] text-[2svh] font-bold flex justify-between'>
                    My Shopping Carts:
                    <div className='flex justify-between w-[8%]'>
                        <div onClick={addShoppingCart} className='flex justify-center items-center w-fit hover:text-black cursor-pointer'>
                            <IoIosAddCircle size={24}/>
                            <p className='ml-[0.2svw]'/>
                        </div>
                        <div onClick={uploadShoppingCart} className='flex justify-center items-center w-fit hover:text-black cursor-pointer'>
                            <MdOutlineFileUpload size={24}/>
                            <p className='ml-[0.2svw]'/>
                        </div>
                    </div>
                </p>
                <div className='flex flex-col w-full h-full p-[4%] pl-[10%] pr-[5%] gap-[6%] bg-gray-custom overflow-scroll rounded-b-2xl'>
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
            </div>
        </div>
    );
}