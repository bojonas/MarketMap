import { useState, useEffect, useRef, useContext } from 'react';
import SearchBar from "../../atoms/SearchBar";
import { requestGetProducts } from "../../requests/homeRequests";
import debounce from 'lodash.debounce';
import { MapViewerContext } from "../../DimensionContext";
import { getLayoutIndex } from '../../helper/getLayoutIndex';
import { IoArrowBack } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";

export default function ShoppingCart({ setShoppingCart, removeMarket }) {
    const [search, setSearch] = useState('');
    const { shoppingCart, layout, productsInMarket, colors } = useContext(MapViewerContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false); 
    const timeoutId = useRef();
    
    const debouncedSearch = debounce(value => {
        setSearch(value);
    }, 200);

    useEffect(() => {
        const getProducts = async () => {
          const data = await requestGetProducts();
          if (data) setProducts(data);
        }
        getProducts();
    }, []);

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

    const handleShoppingCart = (product) => {
        let productExists = false;
        const newShoppingCart = shoppingCart.map((item) => {
            if (item.product_id === product.product_id) {
                productExists = true;
                return { ...item, count: item.count + 1 };
            }
            return item;
        });
    
        if (!productExists) {
            product.count = 1;
            newShoppingCart.push(product);
        }
        setShoppingCart(newShoppingCart);
    }    
    
    const handleSave = () => {
        
    }

    return (
        <div className='relative flex flex-col items-center w-full h-full bg-purple-custom gap-[5%]'>
            <div className='flex flex-col items-center w-full'>
                <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search products...'} contrast='purple'/>
                { searchClicked && <div className='flex flex-col z-10 w-[65%] max-h-[50svh] overflow-y-scroll bg-gray-custom border-gray-custom border-[0.8svh] rounded-b-sm'>
                    { filteredProducts.map(product => {
                         const marketProduct = productsInMarket.find(marketProduct => marketProduct.product_id === product.product_id);
                        return !marketProduct ? null : (
                        <div key={`filtered-${product.product_id}`} onClick={() => handleShoppingCart(product)} 
                            className='h-[5svh] p-[1svh] flex items-center text-black bg-darkoffwhite border-l-[0.5svh] border-darkoffwhite hover:bg-offwhite hover:border-l-purple-custom hover:cursor-pointer'>
                            <p className='font-bold'>{product.product_name_en}</p>
                        </div>
                    )}
                    )}
                </div>}
            </div>
            <div className='absolute bottom-[11svh] z-0 flex flex-col items-center bg-darkoffwhite text-black w-3/4 h-3/4 rounded-xl'>
                <p className='p-[2svh] text-[2.5svh] font-bold'>Shopping Cart:</p>
                <div className='flex flex-col items-center w-full h-full p-[1svh] bg-offwhite overflow-y-scroll'>
                    { shoppingCart.map((product, i) => {
                        const marketProduct = productsInMarket.find(marketProduct => marketProduct.product_id === product.product_id);
                        return (
                            <div key={`cart-${product.product_id}`} className='flex justify-between p-[5%] w-full'>
                                <div className='flex gap-[5%] w-3/4'>
                                    <p className='font-bold'>{i+1}.</p>
                                    <p>{product.product_name_en}</p>
                                </div>
                                <div className='flex gap-[20%] w-1/4'>
                                    <p>{product.count}x</p>
                                    { marketProduct && <div className='rounded-full w-fit h-fit p-[12%] self-center'
                                    style={{ backgroundColor: colors[getLayoutIndex(layout)[marketProduct.row.toString() + marketProduct.column.toString()]], }}/>}
                                </div>
                            </div>
                        );
                    }
                    )}
                </div>
                <div className='flex flex-col w-full p-[5%] bg-offwhite overflow-y-scroll rounded-b-xl'>
                    <div onClick={handleSave} className='flex items-center justify-center gap-[4%] bg-offwhite border-offwhite hover:text-purple-custom h-[5.5svh] text-[2.2svh] cursor-pointer'>
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