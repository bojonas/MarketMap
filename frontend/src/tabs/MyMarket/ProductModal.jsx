import { useState, useEffect, useContext } from "react";
import Modal from 'react-modal';
import debounce from 'lodash.debounce';
import { MapEditorContext } from '../../DimensionContext';
import SearchBar from '../../atoms/SearchBar';

export default function CustomModal({ products, openCell, closeCell }) {
    const { layout, setLayout } = useContext(MapEditorContext);
    console.log(layout, setLayout)
    const [search, setSearch] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const debouncedSearch = debounce(value => {
        setSearch(value);
    }, 200);

    useEffect(() => {
        const results = products.filter(({ product_name_en, brand_name, category_en, type_en }) => 
            product_name_en.toLowerCase().includes(search) ||
            brand_name.toLowerCase().includes(search) ||
            category_en.toLowerCase().includes(search) ||
            type_en.toLowerCase().includes(search)
        );
        setFilteredProducts(results);
    }, [search, products]);

    return (
        <Modal
            isOpen={openCell ? true : false}
            onRequestClose={closeCell}
            contentLabel="ProductWindow"
            style={{
            content: {
                backgroundColor: '#171717',
                width: '50svw',
                height: '70svh',
                top: '18svh',
                left: '30%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            overlay: {
                backgroundColor: '#ffffff6e'
            }
            }}
        >
            <div className='flex flex-col w-2/5 h-5/6 items-center ml-[2%]'>
                <p className='font-bold text-lg'>All Products</p>
                <SearchBar placeholder={'Search products...'} onSearch={debouncedSearch}/>
                <div className='bg-offwhite text-black w-full h-full flex flex-col items-center gap-[2%] p-[5%] rounded-xl mt-[5%] overflow-scroll'>
                    { filteredProducts.map((product) => (
                        <div key={product.product_id} className='flex bg-gray-cell border-2 border-darkgray-custom rounded-xl p-[2%] w-4/5'>
                            <p>{product.product_name_en}</p>
                        </div>  
                        ))
                    }
                </div>
            </div>
            <div className='flex flex-col w-2/5 h-3/4 items-center mr-[2%]'>
                <p className='font-bold text-lg'>Products in Cell</p>
                <div className='bg-offwhite text-black w-full h-full flex flex-col items-center gap-[2%] p-[5%] rounded-xl mt-[5%] overflow-scroll'>
                    { openCell && openCell.products ? openCell.products.map((product_id) => {
                        const product = products[product_id];
                        return (
                            <div key={product_id} className='bg-gray-cell border-2 border-darkgray-custom rounded-xl p-[2%] w-4/5'>
                                <p>{product.product_name_en}</p>
                            </div>  
                        );
                    })
                    : null}
                </div>
            </div>
            <button className='custom-button text-[2.5vh] w-[12%] h-[9%] shadow-slate-700 self-center absolute bottom-[2svh] left-1/2 transform -translate-x-1/2' onClick={closeCell}>Close</button>
        </Modal>
    );
}