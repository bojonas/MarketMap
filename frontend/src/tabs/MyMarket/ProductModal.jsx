import { useState, useEffect, useContext } from "react";
import Modal from 'react-modal';
import debounce from 'lodash.debounce';
import { MapEditorContext } from '../../context/MapEditorContext';
import SearchBar from '../../atoms/SearchBar';
import { noProducts } from './noProducts';

export default function ProductModal({ openCell, closeCell, products }) {
    const { setLayout, editedZones, setEditedZones } = useContext(MapEditorContext);
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

    const addProduct = (product_id) => {
        setLayout(prev => {
            const newLayout = [...prev];
            const prevProducts = newLayout[openCell.x][openCell.y].products;

            if (!prevProducts) newLayout[openCell.x][openCell.y].products = [product_id];
            if (!prevProducts.includes(product_id)) prevProducts.push(product_id);
            return newLayout;
        });

        // add product to editedZones
        for (const zone of editedZones) {
            if (typeof openCell.zone_id !== 'number' || zone.zone_id !== openCell.zone_id) continue;
            
            setEditedZones(prev => {
                const newZones = [...prev];
                const prevZoneLayout = newZones.find(newZone => newZone.zone_id === zone.zone_id).zone_layout;
                const x = openCell.x - zone.zone_position.row;
                const y = openCell.y - zone.zone_position.column;

                const prevZoneProducts = prevZoneLayout[x][y].products;

                if (!prevZoneProducts) prevZoneLayout[x][y].products = [product_id];
                if (!prevZoneProducts.includes(product_id)) prevZoneProducts.push(product_id);
                return newZones;
            });
        }
    }

    const removeProduct = (product_id) => {
        setLayout(prev => {
            const newLayout = [...prev];
            const prevProducts = newLayout[openCell.x][openCell.y].products;

            if (!prevProducts) return;
            const index = prevProducts.indexOf(product_id);
            if (index > -1) prevProducts.splice(index, 1);
            return newLayout;
        })

        // remove product to editedZones
        for (const zone of editedZones) {
            if (typeof openCell.zone_id !== 'number' || zone.zone_id !== openCell.zone_id) continue;
            setEditedZones(prev => {
                const newZones = [...prev];
                const prevZone = newZones.find(newZone => newZone.zone_id === zone.zone_id);
                const x = openCell.x - zone.zone_position.row;
                const y = openCell.y - zone.zone_position.column;

                const prevZoneProducts = prevZone.zone_layout[x][y].products;
                if (!prevZoneProducts) return;

                const index = prevZoneProducts.indexOf(product_id);
                if (index > -1) prevZoneProducts.splice(index, 1);
                return newZones;
            });
        }
    }

    return openCell && noProducts.includes(openCell.type) ? null : (
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
                        <div onDoubleClick={() => addProduct(product.product_id)} key={product.product_id} className='flex bg-darkoffwhite border-2 border-darkgray-custom rounded-xl p-[2%] w-full hover:bg-offwhite border-secondary-hover hover:cursor-pointer'>
                            <p>{product.product_name_en}</p>
                        </div>  
                        ))
                    }
                </div>
            </div>
            <div className='w-[0.5%] h-5/6 bg-offwhite'></div>
            <div className='flex flex-col w-2/5 h-5/6 items-center mr-[2%]'>
                <p className='font-bold text-lg'>Products in Cell: {openCell ? openCell.coordinates : null}</p>
                <div className='bg-offwhite text-black w-full h-full flex flex-col items-center gap-[2%] p-[5%] rounded-xl mt-[5%] overflow-scroll'>
                    { openCell && openCell.products ? openCell.products.map((product_id) => {
                        products.sort((a, b) => a.product_id - b.product_id)
                        return (
                            <div onDoubleClick={() => removeProduct(product_id)} key={product_id} className='bg-darkoffwhite border-2 border-darkgray-custom rounded-xl p-[2%] w-full hover:bg-offwhite border-secondary-hover hover:cursor-pointer'>
                                <p>{products[product_id-1].product_name_en}</p>
                            </div>  
                        );
                    })
                    : null}
                </div>
            </div>
            <button className='bg-offwhite text-black border-offwhite border-[0.3svh] border-secondary-hover rounded-full  text-[2.5vh] w-[11%] h-[9%] shadow-slate-700 self-center absolute bottom-[3svh] left-1/2 transform -translate-x-1/2' onClick={closeCell}>Close</button>
        </Modal>
    );
}