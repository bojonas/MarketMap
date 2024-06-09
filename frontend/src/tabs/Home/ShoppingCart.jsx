import { useState, useEffect, useRef, useContext } from 'react';
import SearchBar from "../../atoms/SearchBar";
import { requestGetProducts, requestPostShoppingCart, requestGetShoppingCarts, requestUpdateShoppingCart } from "../../requests/homeRequests";
import debounce from 'lodash.debounce';
import { MapViewerContext } from "../../context/MapViewerContext";
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";

export default function ShoppingCart({ setShoppingCart, removeMarket }) {
    const user_id = localStorage.getItem('user_id')
    const timeoutId = useRef();
    const [search, setSearch] = useState('');
    const { shoppingCart, productsInMarket, colors, layoutIndex } = useContext(MapViewerContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [openSelect, setOpenSelect] = useState(false);
    const [searchClicked, setSearchClicked] = useState(false);
    const [cartName, setCartName] = useState(''); 
    
    const debouncedSearch = debounce(value => {
        setSearch(value);
    }, 200);

    useEffect(() => {
        const getProducts = async () => {
            const data = await requestGetProducts();
            if (data) setProducts(data);
        }
        const getShoppingCarts = async () => {
            const data = await requestGetShoppingCarts(user_id);
            if (data) setShoppingCarts(data);
        }
        getProducts();
        getShoppingCarts();
    }, [user_id]);

    useEffect(() => {
        const results = products.filter(({ product_name_en, brand_name, category_en, type_en }) => 
            product_name_en.toLowerCase().includes(search) ||
            brand_name.toLowerCase().includes(search) ||
            category_en.toLowerCase().includes(search) ||
            type_en.toLowerCase().includes(search)
        );
        setFilteredProducts(results);
    }, [search, products]);

    const handleOnFocus = () => {
        setSearchClicked(prevsearchClicked => !prevsearchClicked);
    }

    const handleOnBlur = () => {
        timeoutId.current = setTimeout(() => {
            setSearchClicked(prevsearchClicked => !prevsearchClicked);
        }, 200);
    }

    // clear timeout
    useEffect(() => {
        return () => {
            clearTimeout(timeoutId.current);
        }
    }, []);

    const addProduct = (product) => {
        let productExists = false;
        const newShoppingCart = { ...shoppingCart, products: [...shoppingCart.products] };
    
        newShoppingCart.products = newShoppingCart.products.map(item => {
            if (item.product_id === product.product_id) {
                productExists = true;
                return { ...item, product_count: item.product_count + 1 };
            }
            return item;
        });
    
        if (!productExists) {
            product.product_count = 1;
            newShoppingCart.products.push(product);
        }
    
        if (newShoppingCart.products.length > 0) setShoppingCart(newShoppingCart);
    }      

    const selectShoppingCart = (cart) => {
        setShoppingCart(cart);
        setCartName(cart.cart_name);
        setOpenSelect(false);
    }
    
    const saveShoppingCart = async () => {
        if (shoppingCart.products.length === 0) return;
        const name = cartName.trim();
        const newShoppingCart = { ...shoppingCart, cart_name: name }
        if ('cart_id' in shoppingCart) {    
            // filter shopping carts
            const filteredShoppingCart = shoppingCarts.filter(cart => cart.cart_id === shoppingCart.cart_id)[0];
            // shopping carts are different
            if (JSON.stringify(newShoppingCart) !== JSON.stringify(filteredShoppingCart)) {
                await requestUpdateShoppingCart(
                    newShoppingCart.cart_id, 
                    name === shoppingCart.name ? null : name, 
                    newShoppingCart.products.map(product => ({ product_id: product.product_id, product_count: product.product_count }))
                );
                setShoppingCart(newShoppingCart);
                setShoppingCarts(shoppingCarts.map(cart => cart.cart_id === newShoppingCart.cart_id ? newShoppingCart : cart));
            } return;
        }
        // add new cart
        if (shoppingCarts.length === 10) return;
        const cart_id = await requestPostShoppingCart(name, user_id, shoppingCart.products.map(product => ({ product_id: product.product_id, product_count: product.product_count })))
        newShoppingCart.cart_id = cart_id;
        setShoppingCart(newShoppingCart);
        setShoppingCarts([ ...shoppingCarts, newShoppingCart ]);
    }    
    
    return (
        <div className='relative flex flex-col items-center w-full h-full bg-purple-custom gap-[5%]'>
            <div className='flex flex-col items-center w-full'>
                <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search products...'} contrast='purple'/>
                { searchClicked && <div className='flex flex-col z-10 w-[65%] max-h-[50svh] overflow-y-scroll bg-gray-custom border-gray-custom border-[0.8svh] rounded-b-xl'>
                    { filteredProducts.map(product => {
                        const marketProduct = productsInMarket.find(marketProduct => marketProduct.product_id === product.product_id);
                        return !marketProduct ? null : (
                        <div key={`filtered-${product.product_id}`} onClick={() => addProduct(product)} 
                            className='h-[5svh] p-[1svh] flex items-center text-black bg-darkoffwhite border-l-[0.5svh] border-darkoffwhite hover:bg-offwhite hover:border-l-purple-custom hover:cursor-pointer'>
                            <p className='font-bold'>{product.product_name_en}</p>
                        </div>
                    )})}
                </div>}
            </div>
            <div className='absolute bottom-[11svh] z-0 flex flex-col items-center bg-darkoffwhite text-black w-3/4 h-3/4 rounded-xl'>
                <p className='p-[2svh] text-[2.5svh] font-bold'>Shopping Cart:</p>
                <div className='flex flex-col items-center w-full h-full p-[1svh] bg-offwhite'>
                    <div className='absolute w-full flex flex-col justify-center items-center'>
                        <div onClick={() => setOpenSelect(prev => !prev)} className='flex justify-center items-center w-[42%] gap-[5%] hover:text-purple-custom cursor-pointer'>
                            <FaCartArrowDown size={20}/>
                            <p>Select cart</p>
                        </div>
                       { openSelect && <div className='flex flex-col justify-center items-center w-[42%] bg-darkoffwhite border-[0.5svh] border-gray-custom overflow-auto'>
                            { shoppingCarts.length > 0 ? shoppingCarts.map(cart => (
                                <p key={cart.cart_id} onClick={() => selectShoppingCart(cart)} className='w-full hover:bg-offwhite text-center cursor-pointer'>{cart.cart_name || 'not named'}</p>
                            ))
                            : <p>No carts yet</p>}
                        </div>}
                    </div>
                    <div className='flex flex-col items-center text-center w-full h-full pt-[15%] overflow-y-scroll'>
                        <input 
                            value={cartName} 
                            onChange={e => setCartName(e.target.value)}
                            placeholder='not named' 
                            className='w-fit font-bold bg-offwhite text-center outline-none rounded-lg placeholder:italic placeholder-gray-700'/>
                        { shoppingCart.products.length > 0 && shoppingCart.products.map((product, i) => {
                            const marketProduct = productsInMarket.find(marketProduct => marketProduct.product_id === product.product_id);
                            return (
                                <div key={`cart-${product.product_id}`} className='flex justify-between p-[5%] w-full'>
                                    <div className='flex gap-[5%] w-3/4'>
                                        <p className='font-bold'>{i+1}.</p>
                                        <p>{product.product_name_en}</p>
                                    </div>
                                    <div className='flex gap-[20%] w-1/4'>
                                        <p>{product.product_count}x</p>
                                        { marketProduct && <div className='rounded-full w-fit h-fit p-[12%] self-center'
                                        style={{ backgroundColor: colors[layoutIndex[marketProduct.row.toString() + marketProduct.column.toString()]], }}/>}
                                    </div>
                                </div>
                            );
                        }
                        )}
                    </div>
                </div>
                <div className='flex flex-col w-full p-[5%] bg-offwhite overflow-y-scroll rounded-b-xl'>
                    <div onClick={saveShoppingCart} className='flex items-center justify-center gap-[4%] bg-offwhite border-offwhite hover:text-purple-custom h-[5.5svh] text-[2.2svh] cursor-pointer'>
                        <FaRegSave size={25} />
                        <p>Save</p>
                    </div>
                </div>
            </div>
            { removeMarket && 
            <div onClick={removeMarket} className='custom-button absolute bottom-[2svh] flex items-center justify-center gap-[10%] bg-darkgray-custom border-darkgray-custom hover:border-offwhite h-[5.5svh] text-[2.2svh] cursor-pointer'>
                <IoArrowBack size={25}/>
                <p>Back</p>
            </div>}
        </div>
    );
}