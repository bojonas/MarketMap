import { useState, useEffect, useRef, useContext } from "react";
import SearchBar from "../../atoms/SearchBar";
import { requestGetProducts } from "../../requests/homeRequests";
import debounce from 'lodash.debounce';
import { MapViewerContext } from "../../DimensionContext";
import { useProductState } from '../../hooks/useProductState';

export default function ShoppingCart({ setShoppingCart }) {
    const [search, setSearch] = useState('');
    const { shoppingCart, colors } = useContext(MapViewerContext);
    const [products, setProducts] = useProductState();
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
    }, [setProducts]);

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

    return (
        <div className='relative flex flex-col items-center w-full h-full bg-purple-custom gap-[5%]'>
            <div className='flex flex-col items-center w-full'>
                <SearchBar onSearch={debouncedSearch} onFocus={handleOnFocus} onBlur={handleOnBlur} placeholder={'Search products...'}/>
                { searchClicked && <div className='z-10 p-[0.5svh] w-[65%] max-h-3/4 overflow-y-scroll bg-gray-custom rounded-b-lg'>
                    { filteredProducts.map((product, i) => (
                        <div key={`filtered-${product.product_id}`} onClick={() => handleShoppingCart(product)} 
                            className='h-[5svh] p-[1svh] flex gap-1 items-center bg-offwhite text-black border-gray-custom border-[0.3svh] rounded-lg hover:bg-white hover:cursor-pointer'>
                            <p className='font-bold'>{product.product_name_en}</p>
                        </div>
                    ))}
                </div>}
            </div>
            <div className='absolute bottom-[10svh] z-0 flex flex-col items-center bg-darkoffwhite text-black w-3/4 h-[70%] max-h-1/2 rounded-xl'>
                <p className='p-[2svh] text-[2.5svh] font-bold'>Shopping Cart:</p>
                <div className='flex flex-col justify-start items-start w-full h-full p-[1svh] bg-offwhite overflow-y-scroll rounded-b-xl'>
                    { shoppingCart.map((product, i) => (
                        <div key={`cart-${product.product_id}`} className='flex justify-between gap-[5%] p-[2svh] w-full'>
                        <div className='flex gap-[5%] w-4/5'>
                            <p className='font-bold'>{i+1}.</p>
                            <p>{product.product_name_en}</p>
                        </div>
                        <div className='flex gap-[30%] w-1/5'>
                            <p>{product.count}x</p>
                            <p className='rounded-full w-fit h-fit p-[15%] m-[14%]'
                            style={{ backgroundColor: colors[product.product_id-1 % colors.length] }}/>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}